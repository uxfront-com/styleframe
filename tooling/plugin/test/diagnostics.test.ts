import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Diagnostic } from "@styleframe/core";
import { consola } from "consola";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	RESOLVED_VIRTUAL_CONSUMER_ID,
	RESOLVED_VIRTUAL_CSS_MODULE_ID,
} from "../src/plugin/constants";
import { reportDiagnostics } from "../src/plugin/diagnostics";
import { unpluginFactory } from "../src/plugin/index";
import { createPluginState } from "../src/plugin/state";

const testDir = dirname(fileURLToPath(import.meta.url));

function createConfig({ strict = false } = {}) {
	return `import { styleframe } from "@styleframe/core";

const s = styleframe({ strict: ${strict} });

s.variable("color.brand", "#6366f1");
s.selector(".card", {
	color: s.ref("color.brnad"),
	border: s.css\`1px solid \${s.ref("color.accnt")} \${s.ref("color.missing")}\`,
});

export default s;
`;
}

const CLEAN_CONFIG = `import { styleframe } from "@styleframe/core";

const s = styleframe({ strict: true });

s.variable("color.brand", "#6366f1");

export default s;
`;

const diagnostic: Diagnostic = {
	code: "unresolved-reference",
	severity: "warning",
	message: 'Reference "@color.brnad" resolves to no variable.',
	path: 'selector ".card" › color',
};

describe("reportDiagnostics", () => {
	beforeEach(() => {
		vi.spyOn(consola, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("logs each diagnostic once, by code, path, and message", () => {
		const state = createPluginState("styleframe.config.ts");

		reportDiagnostics(state, [diagnostic, diagnostic]);
		reportDiagnostics(state, [
			diagnostic,
			{ ...diagnostic, path: "other" },
			{
				...diagnostic,
				message: 'Reference "@color.accnt" resolves to no variable.',
			},
		]);

		expect(consola.warn).toHaveBeenCalledTimes(3);
		expect(consola.warn).toHaveBeenCalledWith(
			'[styleframe] unresolved-reference selector ".card" › color: Reference "@color.brnad" resolves to no variable.',
		);
	});

	it("records but doesn't log diagnostics when silent", () => {
		const state = createPluginState("styleframe.config.ts");

		reportDiagnostics(state, [diagnostic], true);

		expect(consola.warn).not.toHaveBeenCalled();
		expect(state.reportedDiagnostics.size).toBe(1);
	});
});

describe("plugin diagnostics", () => {
	let cwd: string;
	let configPath: string;

	const context = { addWatchFile: vi.fn() };

	beforeEach(async () => {
		cwd = await mkdtemp(join(testDir, ".tmp-diagnostics-"));
		configPath = join(cwd, "styleframe.config.ts");
		vi.spyOn(process, "cwd").mockReturnValue(cwd);
		for (const level of ["log", "info", "success", "warn", "error"] as const) {
			vi.spyOn(consola, level).mockImplementation(() => {});
		}
		vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(async () => {
		vi.restoreAllMocks();
		await rm(cwd, { recursive: true, force: true });
	});

	// The factory's hooks, called the way a bundler calls them
	type Hooks = {
		buildStart(this: typeof context): Promise<void>;
		load(this: typeof context, id: string): Promise<unknown>;
		vite: {
			configureServer(server: unknown): void;
			handleHotUpdate(ctx: unknown): Promise<unknown>;
		};
	};

	function createPlugin(options: Parameters<typeof unpluginFactory>[0] = {}) {
		return unpluginFactory(options, {
			framework: "vite",
		} as never) as unknown as Hooks;
	}

	function createServer() {
		return {
			watcher: { on: vi.fn(), add: vi.fn() },
			moduleGraph: {
				getModuleById: vi.fn(() => undefined),
				getModuleByUrl: vi.fn(async () => undefined),
				invalidateModule: vi.fn(),
			},
			ws: { send: vi.fn() },
		};
	}

	async function runBuild(plugin: Hooks) {
		await plugin.buildStart.call(context);
		await plugin.load.call(context, RESOLVED_VIRTUAL_CSS_MODULE_ID);
		await plugin.load.call(context, RESOLVED_VIRTUAL_CONSUMER_ID);
	}

	it("logs each diagnostic once per build", async () => {
		await writeFile(configPath, createConfig());
		const plugin = createPlugin();

		await runBuild(plugin);
		expect(vi.mocked(consola.warn).mock.calls).toEqual([
			[
				'[styleframe] unresolved-reference selector ".card" › color: Reference "@color.brnad" resolves to no variable. Did you mean "@color.brand"?',
			],
			[
				'[styleframe] unresolved-reference selector ".card" › border: Reference "@color.accnt" resolves to no variable.',
			],
			[
				'[styleframe] unresolved-reference selector ".card" › border: Reference "@color.missing" resolves to no variable.',
			],
		]);

		await runBuild(plugin);
		expect(consola.warn).toHaveBeenCalledTimes(6);
	});

	it("logs warnings with type declarations off, and again after a reload", async () => {
		await writeFile(configPath, createConfig());
		const plugin = createPlugin({ dts: { enabled: false } });

		await plugin.buildStart.call(context);
		await plugin.load.call(context, RESOLVED_VIRTUAL_CONSUMER_ID);
		expect(consola.warn).toHaveBeenCalledTimes(3);
		await plugin.load.call(context, RESOLVED_VIRTUAL_CSS_MODULE_ID);
		expect(consola.warn).toHaveBeenCalledTimes(3);

		await plugin.vite.handleHotUpdate({
			file: configPath,
			modules: [],
			server: createServer(),
		});
		await plugin.load.call(context, RESOLVED_VIRTUAL_CSS_MODULE_ID);
		expect(consola.warn).toHaveBeenCalledTimes(6);
	});

	it("fails the build under strict", async () => {
		await writeFile(configPath, createConfig({ strict: true }));

		await expect(createPlugin().buildStart.call(context)).rejects.toThrow(
			/Strict mode found 3 problems/,
		);

		const plugin = createPlugin({ dts: { enabled: false } });
		await plugin.buildStart.call(context);
		await expect(
			plugin.load.call(context, RESOLVED_VIRTUAL_CSS_MODULE_ID),
		).rejects.toThrow(/Strict mode found 3 problems/);
		await expect(
			plugin.load.call(context, RESOLVED_VIRTUAL_CONSUMER_ID),
		).rejects.toThrow(/Strict mode found 3 problems/);
		expect(consola.warn).not.toHaveBeenCalled();
	});

	it("fails the dev build from the debounced dts path under strict", async () => {
		await writeFile(configPath, CLEAN_CONFIG);
		const plugin = createPlugin();
		await plugin.buildStart.call(context);

		const server = createServer();
		plugin.vite.configureServer(server);

		await writeFile(configPath, createConfig({ strict: true }));
		await plugin.vite.handleHotUpdate({
			file: configPath,
			modules: [],
			server,
		});

		await vi.waitFor(() => {
			expect(server.ws.send).toHaveBeenCalledWith({
				type: "error",
				err: expect.objectContaining({
					message: expect.stringMatching(/Strict mode found 3 problems/),
				}),
			});
		});
		expect(consola.error).toHaveBeenCalledWith(
			"[styleframe] Type generation failed:",
			expect.any(Error),
		);
	});
});
