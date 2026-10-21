import { describe, expect, it } from "vitest";
import { createTypecheckConfig, parseTscOutput } from "./typecheck";

describe("createTypecheckConfig", () => {
	it("extends the project's tsconfig and roots the program at the file", () => {
		expect(
			createTypecheckConfig("/app/styleframe.config.ts", "/app/tsconfig.json"),
		).toEqual({
			extends: "/app/tsconfig.json",
			compilerOptions: { incremental: false, composite: false, rootDir: "/" },
			files: ["/app/styleframe.config.ts"],
			include: [],
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
				composite: false,
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
