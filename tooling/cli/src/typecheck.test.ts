import {
	chmod,
	mkdir,
	mkdtemp,
	readdir,
	realpath,
	rm,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTypecheckConfig,
	parseTscOutput,
	resolveTsc,
	typecheck,
} from "./typecheck";

describe("typecheck", () => {
	const tsc = resolveTsc(import.meta.filename)!;
	let project: string;
	let nodeModules: string;
	let entry: string;

	beforeEach(async () => {
		// No tsconfig.json above the system's temporary directory, so the
		// strict defaults apply: the untyped parameter is TS7006
		// The real path, since `tsc` prints paths relative to the real cwd
		project = await realpath(
			await mkdtemp(path.join(tmpdir(), "styleframe-cli-typecheck-")),
		);
		nodeModules = path.join(project, "node_modules");
		entry = path.join(project, "styleframe.config.ts");
		await mkdir(nodeModules);
		await writeFile(entry, "export default function scale(value) {}\n");
	});

	afterEach(async () => {
		await chmod(nodeModules, 0o755);
		await rm(project, { recursive: true, force: true });
	});

	it("uses strict defaults and removes the cache it created", async () => {
		const diagnostics = await typecheck(entry, tsc, project);

		expect(diagnostics.map(({ message }) => message.slice(0, 7))).toEqual([
			"TS7006:",
		]);
		expect(await readdir(nodeModules)).toEqual([]);
	});

	it("falls back to the system's temporary directory when node_modules is read-only", async () => {
		await chmod(nodeModules, 0o555);

		const diagnostics = await typecheck(entry, tsc, project);

		expect(diagnostics.map(({ path }) => path)).toEqual([
			"styleframe.config.ts:1",
		]);
		expect(await readdir(nodeModules)).toEqual([]);
	});
});

describe("createTypecheckConfig", () => {
	it("extends the project's tsconfig and roots the program at the file", () => {
		expect(
			createTypecheckConfig("/app/styleframe.config.ts", "/app/tsconfig.json"),
		).toEqual({
			extends: "/app/tsconfig.json",
			compilerOptions: { incremental: false, rootDir: "/" },
			files: ["/app/styleframe.config.ts"],
			include: [],
		});
	});

	it("keeps declaration on in place of composite", () => {
		expect(
			createTypecheckConfig(
				"/app/styleframe.config.ts",
				"/app/tsconfig.json",
				true,
			).compilerOptions,
		).toEqual({
			incremental: false,
			composite: false,
			declaration: true,
			rootDir: "/",
		});
	});

	it("uses strict defaults when the project has no tsconfig", () => {
		expect(
			createTypecheckConfig("/app/styleframe.config.ts", undefined),
		).toEqual({
			compilerOptions: {
				strict: true,
				target: "es2022",
				module: "esnext",
				moduleResolution: "bundler",
				skipLibCheck: true,
				incremental: false,
				rootDir: "/",
			},
			files: ["/app/styleframe.config.ts"],
			include: [],
		});
	});
});

describe("parseTscOutput", () => {
	it("joins indented lines to the message they continue", () => {
		expect(
			parseTscOutput(
				[
					"styleframe.config.ts(4,3): error TS2322: Type 'A' is not assignable to type 'B'.",
					"  Types of property 'size' are incompatible.",
					"",
				].join("\n"),
				2,
				"styleframe.config.ts",
			),
		).toEqual([
			{
				code: "typescript",
				severity: "error",
				message:
					"TS2322: Type 'A' is not assignable to type 'B'.\nTypes of property 'size' are incompatible.",
				path: "styleframe.config.ts:4",
			},
		]);
	});

	it("gives an error without a location the entry as its path", () => {
		expect(
			parseTscOutput(
				"error TS5083: Cannot read file 'tsconfig.base.json'.\n",
				1,
				"styleframe.config.ts",
			),
		).toEqual([
			{
				code: "typescript",
				severity: "error",
				message: "TS5083: Cannot read file 'tsconfig.base.json'.",
				path: "styleframe.config.ts",
			},
		]);
	});

	it("reports a failed run that printed no diagnostic", () => {
		expect(parseTscOutput("", 134, "styleframe.config.ts")).toEqual([
			{
				code: "typescript",
				severity: "error",
				message: "tsc exited with code 134.",
				path: "styleframe.config.ts",
			},
		]);
	});

	it("returns nothing for a clean run", () => {
		expect(parseTscOutput("", 0, "styleframe.config.ts")).toEqual([]);
	});
});
