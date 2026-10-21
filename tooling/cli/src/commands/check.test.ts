import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { runCommand } from "citty";
import consola from "consola";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import checkCommand from "./check";

const fixture = (name: string) =>
	path.join(import.meta.dirname, "__fixtures__", `${name}.config.ts`);

describe("check", () => {
	let cwd: string;
	let stdout: string;

	beforeEach(async () => {
		cwd = await mkdtemp(path.join(tmpdir(), "styleframe-cli-check-"));
		vi.spyOn(process, "cwd").mockReturnValue(cwd);
		stdout = "";
		vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
			stdout += String(chunk);
			return true;
		});
		for (const level of ["info", "success", "warn", "error"] as const) {
			vi.spyOn(consola, level).mockImplementation(() => {});
		}
	});

	afterEach(async () => {
		process.exitCode = undefined;
		vi.restoreAllMocks();
		await rm(cwd, { recursive: true, force: true });
	});

	async function run(...rawArgs: string[]) {
		await runCommand(checkCommand, { rawArgs });
		return process.exitCode;
	}

	it("exits 0 on a clean config", async () => {
		expect(await run(fixture("clean"))).toBeUndefined();
		expect(consola.warn).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("No problems found.");
	});

	it("prints each diagnostic as a warning line and exits 1", async () => {
		expect(await run(fixture("problems"))).toBe(1);

		expect(consola.warn).toHaveBeenCalledTimes(1);
		expect(consola.warn).toHaveBeenCalledWith(
			'unresolved-reference selector ".card" › color: Reference "@color.brnad" resolves to no variable. Did you mean "@color.brand"?',
		);
		expect(consola.error).toHaveBeenCalledWith("Found 1 problem.");
	});

	it("prints one JSON document and nothing else on stdout with --json", async () => {
		expect(await run(fixture("problems"), "--json")).toBe(1);

		expect(JSON.parse(stdout)).toEqual({
			ok: false,
			diagnostics: [
				{
					code: "unresolved-reference",
					severity: "warning",
					message:
						'Reference "@color.brnad" resolves to no variable. Did you mean "@color.brand"?',
					path: 'selector ".card" › color',
					suggestion: "color.brand",
				},
			],
		});
		for (const level of ["info", "success", "warn", "error"] as const) {
			expect(consola[level]).not.toHaveBeenCalled();
		}
	});

	it("reports ok with --json on a clean config", async () => {
		expect(await run(fixture("clean"), "--json")).toBeUndefined();
		expect(JSON.parse(stdout)).toEqual({ ok: true, diagnostics: [] });
	});

	it("writes no files", async () => {
		await run(fixture("problems"));
		await run(fixture("clean"), "--json");

		expect(await readdir(cwd)).toEqual([]);
		expect(
			await readdir(path.join(import.meta.dirname, "__fixtures__")),
		).toEqual(["clean.config.ts", "problems.config.ts", "strict.config.ts"]);
	});
});
