import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { runCommand } from "citty";
import consola from "consola";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import buildCommand from "./build";

const fixture = (name: string) =>
	path.join(import.meta.dirname, "__fixtures__", `${name}.config.ts`);

describe("build", () => {
	let outDir: string;

	beforeEach(async () => {
		outDir = await mkdtemp(path.join(tmpdir(), "styleframe-cli-build-"));
		for (const level of ["info", "success", "warn", "error"] as const) {
			vi.spyOn(consola, level).mockImplementation(() => {});
		}
	});

	afterEach(async () => {
		process.exitCode = undefined;
		vi.restoreAllMocks();
		await rm(outDir, { recursive: true, force: true });
	});

	async function run(entry: string, outputDir = outDir) {
		await runCommand(buildCommand, { rawArgs: [entry, "-o", outputDir] });
		return process.exitCode;
	}

	it("builds a clean config and exits 0", async () => {
		expect(await run(fixture("clean"))).toBeUndefined();
		expect(consola.warn).not.toHaveBeenCalled();
		expect(await readdir(outDir)).toEqual(["index.css", "index.ts"]);
	});

	it("prints each diagnostic once as a warning line and still builds", async () => {
		expect(await run(fixture("problems"))).toBeUndefined();

		expect(vi.mocked(consola.warn).mock.calls).toEqual([
			[
				'unresolved-reference selector ".card" › color: Reference "@color.brnad" resolves to no variable. Did you mean "@color.brand"?',
			],
			[
				'unresolved-reference selector ".card" › border: Reference "@color.accnt" resolves to no variable.',
			],
		]);
		expect(await readdir(outDir)).toEqual(["index.css", "index.ts"]);
	});

	it("exits 1 under strict without writing files", async () => {
		expect(await run(fixture("strict"))).toBe(1);

		expect(consola.warn).toHaveBeenCalledTimes(1);
		expect(consola.error).toHaveBeenCalledWith(
			"Failed to build Styleframe: strict mode found 1 problem.",
		);
		expect(await readdir(outDir)).toEqual([]);
	});

	it("exits 1 when the build fails", async () => {
		const file = path.join(outDir, "file");
		await writeFile(file, "");

		expect(await run(fixture("clean"), path.join(file, "out"))).toBe(1);
		expect(consola.error).toHaveBeenCalledWith(
			"Failed to build Styleframe:",
			expect.any(Error),
		);
	});
});
