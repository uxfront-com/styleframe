import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { runCommand } from "citty";
import consola from "consola";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import checkCommand from "./check";

const fixturesDir = path.join(import.meta.dirname, "__fixtures__");
const fixture = (name: string) => path.join(fixturesDir, `${name}.config.ts`);

const BRNAD_MESSAGE =
	'Reference "@color.brnad" resolves to no variable. Did you mean "@color.brand"?';
const ACCNT_MESSAGE = 'Reference "@color.accnt" resolves to no variable.';

describe("check", () => {
	const originalCwd = process.cwd();
	const originalLevel = consola.level;
	let cwd: string;
	let stdout: string;
	let stderr: string;

	beforeEach(async () => {
		cwd = await mkdtemp(path.join(tmpdir(), "styleframe-cli-check-"));
		process.chdir(cwd);

		// Log at every level, as outside a test, and capture what reaches the
		// streams, so a stray line on stdout fails the --json tests
		consola.level = Number.POSITIVE_INFINITY;
		stdout = "";
		stderr = "";
		vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
			stdout += String(chunk);
			return true;
		});
		vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
			stderr += String(chunk);
			return true;
		});
	});

	afterEach(async () => {
		process.exitCode = undefined;
		consola.level = originalLevel;
		vi.restoreAllMocks();
		process.chdir(originalCwd);
		await rm(cwd, { recursive: true, force: true });
	});

	async function run(...rawArgs: string[]) {
		await runCommand(checkCommand, { rawArgs });
		return process.exitCode;
	}

	it("exits 0 on a clean config", async () => {
		expect(await run(fixture("clean"))).toBeUndefined();
		expect(stdout).toContain("No problems found.");
		expect(stdout + stderr).not.toContain("WARN");
	});

	it("prints each diagnostic as a warning line and exits 1", async () => {
		const warn = vi.spyOn(consola, "warn");

		expect(await run(fixture("problems"))).toBe(1);

		expect(warn.mock.calls).toEqual([
			[`unresolved-reference selector ".card" › color: ${BRNAD_MESSAGE}`],
			[`unresolved-reference selector ".card" › border: ${ACCNT_MESSAGE}`],
		]);
		expect(stderr).toContain("Found 2 problems.");
	});

	it("prints one JSON document and nothing else on stdout with --json", async () => {
		expect(await run(fixture("problems"), "--json")).toBe(1);

		expect(JSON.parse(stdout)).toEqual({
			ok: false,
			diagnostics: [
				{
					code: "unresolved-reference",
					severity: "warning",
					message: BRNAD_MESSAGE,
					path: 'selector ".card" › color',
					suggestion: "color.brand",
				},
				{
					code: "unresolved-reference",
					severity: "warning",
					message: ACCNT_MESSAGE,
					path: 'selector ".card" › border',
				},
			],
		});
	});

	it("reports ok with --json on a clean config", async () => {
		expect(await run(fixture("clean"), "--json")).toBeUndefined();
		expect(JSON.parse(stdout)).toEqual({ ok: true, diagnostics: [] });
	});

	it("exits 1 when the config file doesn't exist", async () => {
		expect(await run("missing.config.ts", "--json")).toBe(1);
		expect(stdout).toBe("");
		expect(stderr).toContain("Config file not found: missing.config.ts");

		expect(await run("missing")).toBe(1);
		expect(stdout).not.toContain("No problems found.");
		expect(stderr).toContain("Config file not found: missing");
	});

	it("resolves the entry the way the loader does", async () => {
		const warn = vi.spyOn(consola, "warn");

		// Without an extension, each known extension is tried
		expect(await run(fixture("problems").replace(/\.ts$/, ""))).toBe(1);
		expect(warn).toHaveBeenCalledTimes(2);

		for (const entry of [
			`${fixture("problems")}/`,
			`${fixture("problems").replace(/\.ts$/, "")}/`,
			`${fixturesDir}/missing/../problems.config.ts`,
		]) {
			stdout = "";
			stdout = "";
			stderr = "";
			expect(await run(entry, "--json")).toBe(1);
			expect(stdout).toBe("");
			expect(stderr).toContain(`Config file not found: ${entry}`);
		}
	});

	it("writes no files", async () => {
		await run(fixture("problems"));
		await run(fixture("clean"), "--json");

		expect(await readdir(cwd)).toEqual([]);
		expect(await readdir(fixturesDir)).toEqual([
			"clean.config.ts",
			"inspect",
			"problems.config.ts",
			"strict.config.ts",
			"type-error.config.mts",
			"typecheck",
		]);
	});

	describe("--typecheck", () => {
		const typeErrorFixture = path.join(fixturesDir, "type-error.config.mts");

		it("reports the entry's type errors as typescript diagnostics", async () => {
			expect(await run(typeErrorFixture, "--typecheck", "--json")).toBe(1);

			const { ok, diagnostics } = JSON.parse(stdout);
			expect(ok).toBe(false);
			expect(diagnostics).toEqual([
				{
					code: "typescript",
					severity: "error",
					message:
						'TS2322: Type \'"medium"\' is not assignable to type \'"md" | "sm" | undefined\'.',
					path: `${path.relative(process.cwd(), typeErrorFixture)}:12`,
				},
			]);
		});

		it("prints type errors as warning lines", async () => {
			const warn = vi.spyOn(consola, "warn");

			expect(await run(typeErrorFixture, "--typecheck")).toBe(1);

			expect(warn).toHaveBeenCalledTimes(1);
			expect(warn.mock.calls[0]?.[0]).toMatch(
				/^typescript .*type-error\.config\.mts:12: TS2322: /,
			);
			expect(stderr).toContain("Found 1 problem.");
		});

		it("adds nothing for a config without type errors", async () => {
			expect(
				await run(fixture("clean"), "--typecheck", "--json"),
			).toBeUndefined();
			expect(JSON.parse(stdout)).toEqual({ ok: true, diagnostics: [] });
		});

		it("uses the project's types and checks only the entry, writing nothing", async () => {
			const projectDir = path.join(fixturesDir, "typecheck");
			const cacheDir = path.join(
				import.meta.dirname,
				"../../node_modules/.cache",
			);
			const entries = await readdir(projectDir);

			expect(
				await run(
					path.join(projectDir, "styleframe.config.mts"),
					"--typecheck",
					"--json",
				),
			).toBeUndefined();

			// `broken.mts` beside it has a type error, and `vite/client` resolves
			// only from the project, not from a temporary directory
			expect(JSON.parse(stdout)).toEqual({ ok: true, diagnostics: [] });
			expect(await readdir(projectDir)).toEqual(entries);
			expect(
				(await readdir(cacheDir).catch(() => [])).filter((name) =>
					name.startsWith("styleframe-typecheck-"),
				),
			).toEqual([]);
		});

		it("keeps the validate() diagnostics under --typecheck", async () => {
			expect(await run(fixture("problems"), "--typecheck", "--json")).toBe(1);

			const { diagnostics } = JSON.parse(stdout);
			expect(diagnostics.map(({ code }: { code: string }) => code)).toEqual([
				"unresolved-reference",
				"unresolved-reference",
			]);
		});

		it("exits 1 with one line when TypeScript can't be resolved", async () => {
			// The temporary directory has no node_modules to resolve TypeScript from
			await writeFile(
				path.join(cwd, "styleframe.config.ts"),
				"export default {};\n",
			);
			const error = vi.spyOn(consola, "error");

			expect(await run("styleframe.config.ts", "--typecheck", "--json")).toBe(
				1,
			);

			expect(stdout).toBe("");
			expect(error.mock.calls).toEqual([
				[
					"TypeScript not found: install `typescript` in your project to use --typecheck.",
				],
			]);
		});
	});
});
