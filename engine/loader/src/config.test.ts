import { mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Styleframe } from "@styleframe/core";
import { watch } from "chokidar";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { loadConfiguration, watchConfiguration } from "./config";

vi.mock("chokidar", () => ({ watch: vi.fn() }));

const mockedWatch = vi.mocked(watch);
const packageDir = fileURLToPath(new URL(".", import.meta.url));

type Handler = () => unknown;

/**
 * A chokidar watcher stand-in that records event handlers so tests can drive
 * "change"/"unlink" events deterministically instead of touching the real FS.
 */
function createFakeWatcher() {
	const handlers = new Map<string, Handler>();
	const watcher = {
		on(event: string, handler: Handler) {
			handlers.set(event, handler);
			return watcher;
		},
		close: vi.fn(async () => {}),
		async emit(event: string) {
			return handlers.get(event)?.();
		},
	};
	return watcher;
}

const validConfig = `import { styleframe } from "@styleframe/core";
export default styleframe();`;

let fixtureDir: string;

beforeEach(async () => {
	fixtureDir = await mkdtemp(path.join(packageDir, "__fixtures-"));
	mockedWatch.mockReset();
});

afterEach(async () => {
	await rm(fixtureDir, { recursive: true, force: true });
});

async function writeConfig(content: string, name = "styleframe.config.ts"): Promise<string> {
	const filePath = path.join(fixtureDir, name);
	await writeFile(filePath, content);
	return filePath;
}

describe("loadConfiguration", () => {
	test("loads a config file and returns the Styleframe instance", async () => {
		await writeConfig(validConfig);

		const instance = await loadConfiguration({
			cwd: fixtureDir,
			entry: "styleframe.config",
		});

		expect(instance.id).toEqual(expect.any(String));
		expect(instance.root).toBeDefined();
	});

	test("resolves an absolute entry path with a known extension", async () => {
		const filePath = await writeConfig(validConfig, "custom.config.ts");

		const instance = await loadConfiguration({ entry: filePath });

		expect(instance.root).toBeDefined();
	});

	test("returns a default instance when no config file is found", async () => {
		const instance = await loadConfiguration({
			cwd: fixtureDir,
			entry: "styleframe.config",
		});

		expect(instance.id).toEqual(expect.any(String));
		expect(instance.root.recipes).toHaveLength(0);
	});

	test("propagates errors from an invalid config file", async () => {
		await writeConfig(`export default { not: "styleframe" };`);

		await expect(
			loadConfiguration({ cwd: fixtureDir, entry: "styleframe.config" }),
		).rejects.toThrow(/Invalid default export/);
	});
});

describe("watchConfiguration", () => {
	test("throws when the config file cannot be found", async () => {
		await expect(
			watchConfiguration({ cwd: fixtureDir, entry: "styleframe.config" }),
		).rejects.toThrow(/Config file not found/);
	});

	test("returns the loaded config, resolved path, and an unwatch fn", async () => {
		const filePath = await writeConfig(validConfig);
		const watcher = createFakeWatcher();
		mockedWatch.mockReturnValue(watcher as unknown as ReturnType<typeof watch>);

		const { config, configFile, unwatch } = await watchConfiguration({
			cwd: fixtureDir,
			entry: "styleframe.config",
		});

		expect(config.root).toBeDefined();
		expect(configFile).toBe(filePath);

		await unwatch();
		expect(watcher.close).toHaveBeenCalledOnce();
	});

	test("reloads and calls onUpdate when the file changes", async () => {
		await writeConfig(validConfig);
		const watcher = createFakeWatcher();
		mockedWatch.mockReturnValue(watcher as unknown as ReturnType<typeof watch>);
		const onUpdate = vi.fn<(config: Styleframe) => void>();

		await watchConfiguration({
			cwd: fixtureDir,
			entry: "styleframe.config",
			onUpdate,
		});

		await watcher.emit("change");

		expect(onUpdate).toHaveBeenCalledOnce();
		const [updated] = onUpdate.mock.lastCall ?? [];
		expect(updated?.root).toBeDefined();
	});

	test("calls onError when a reload fails", async () => {
		const filePath = await writeConfig(validConfig);
		const watcher = createFakeWatcher();
		mockedWatch.mockReturnValue(watcher as unknown as ReturnType<typeof watch>);
		const onError = vi.fn<(error: Error) => void>();

		await watchConfiguration({
			cwd: fixtureDir,
			entry: "styleframe.config",
			onError,
		});

		// Make the next reload throw by writing an invalid config.
		await writeFile(filePath, `export default { not: "styleframe" };`);
		await watcher.emit("change");

		expect(onError).toHaveBeenCalledOnce();
		const [reloadError] = onError.mock.lastCall ?? [];
		expect(reloadError).toBeInstanceOf(Error);
	});

	test("calls onError when the config file is deleted", async () => {
		const filePath = await writeConfig(validConfig);
		const watcher = createFakeWatcher();
		mockedWatch.mockReturnValue(watcher as unknown as ReturnType<typeof watch>);
		const onError = vi.fn<(error: Error) => void>();

		await watchConfiguration({
			cwd: fixtureDir,
			entry: "styleframe.config",
			onError,
		});

		await watcher.emit("unlink");

		expect(onError).toHaveBeenCalledOnce();
		const [deleteError] = onError.mock.lastCall ?? [];
		expect(deleteError?.message).toBe(`Config file was deleted: ${filePath}`);
	});
});
