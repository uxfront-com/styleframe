import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { runCommand } from "citty";
import consola from "consola";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import inspectCommand from "./inspect";

const fixture = path.join(
	import.meta.dirname,
	"__fixtures__",
	"inspect.config.ts",
);

const SNAPSHOT = {
	variables: [
		{ name: "color.brand", property: "--color--brand", value: "#6366f1" },
	],
	themes: [
		{
			name: "dark",
			selector: '.dark-theme, [data-theme="dark"]',
			overrides: [{ name: "color.brand", value: "#818cf8" }],
		},
	],
	utilities: [
		{
			name: "background-color",
			values: ["brand"],
			classNames: ["_background-color:brand", "_hover:background-color:brand"],
			modifiers: ["hover"],
		},
	],
	modifiers: [{ key: ["hover"] }],
	recipes: [
		{
			name: "button",
			variants: { size: ["sm", "md"] },
			defaultVariants: { size: "md" },
		},
	],
};

describe("inspect", () => {
	const originalCwd = process.cwd();
	const originalLevel = consola.level;
	let cwd: string;
	let stdout: string;
	let stderr: string;

	beforeEach(async () => {
		cwd = await mkdtemp(path.join(tmpdir(), "styleframe-cli-inspect-"));
		process.chdir(cwd);

		// Log at every level and capture both streams, so a stray line on
		// stdout fails the --json tests
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
		await runCommand(inspectCommand, { rawArgs });
		return process.exitCode;
	}

	it("prints the whole snapshot as one JSON document with --json", async () => {
		expect(await run(fixture, "--json")).toBeUndefined();
		expect(JSON.parse(stdout)).toEqual(SNAPSHOT);
	});

	it("prints one section with --json", async () => {
		expect(await run(fixture, "themes", "--json")).toBeUndefined();
		expect(JSON.parse(stdout)).toEqual({ themes: SNAPSHOT.themes });
	});

	it("prints every section as a readable list", async () => {
		expect(await run(fixture)).toBeUndefined();
		expect(stdout).toBe(
			[
				"variables (1)",
				"  color.brand  --color--brand: #6366f1",
				"",
				"themes (1)",
				'  dark  .dark-theme, [data-theme="dark"]',
				"    color.brand: #818cf8",
				"",
				"utilities (1)",
				"  background-color",
				"    values: brand",
				"    modifiers: hover",
				"    classes: _background-color:brand _hover:background-color:brand",
				"",
				"modifiers (1)",
				"  hover",
				"",
				"recipes (1)",
				"  button",
				"    size: sm, md (default: md)",
				"",
			].join("\n"),
		);
	});

	it("prints one section as a readable list", async () => {
		expect(await run(fixture, "recipes")).toBeUndefined();
		expect(stdout).toBe(
			"recipes (1)\n  button\n    size: sm, md (default: md)\n",
		);
	});

	it("reads a lone section name as the section, with the default entry", async () => {
		expect(await run("modifiers", "--json")).toBe(1);
		expect(stdout).toBe("");
		expect(stderr).toContain("Config file not found: styleframe.config.ts");
	});

	it("exits 1 on an unknown section", async () => {
		expect(await run(fixture, "tokens", "--json")).toBe(1);
		expect(stdout).toBe("");
		expect(stderr).toContain(
			"Unknown section: tokens. Use one of variables, themes, utilities, modifiers, recipes.",
		);
	});

	it("exits 1 when the config file doesn't exist", async () => {
		expect(await run("missing.config.ts", "--json")).toBe(1);
		expect(stdout).toBe("");
		expect(stderr).toContain("Config file not found: missing.config.ts");
	});
});
