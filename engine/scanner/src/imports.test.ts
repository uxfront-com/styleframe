import { describe, expect, it, vi } from "vitest";
import {
	scanFileImports,
	createEmptyImportScanResult,
	mergeImportScanResults,
} from "./imports";

vi.mock("importree", () => ({
	parseImports: (filePath: string) => {
		const fixtures: Record<
			string,
			Array<{
				path: string;
				specifiers?: Array<string>;
				isNamespace?: boolean;
				isDynamic?: boolean;
				isSideEffect?: boolean;
			}>
		> = {
			"named-import.ts": [
				{
					path: "virtual:styleframe",
					specifiers: ["button"],
				},
			],
			"multiple-named.ts": [
				{
					path: "virtual:styleframe",
					specifiers: ["button", "badge", "card"],
				},
			],
			"aliased-import.ts": [
				{
					path: "virtual:styleframe",
					specifiers: ["button"],
				},
			],
			"re-export.ts": [
				{
					path: "virtual:styleframe",
					specifiers: ["button"],
				},
			],
			"namespace-import.ts": [
				{
					path: "virtual:styleframe",
					isNamespace: true,
				},
			],
			"dynamic-import.ts": [
				{
					path: "virtual:styleframe",
					isDynamic: true,
				},
			],
			"mixed-modules.ts": [
				{
					path: "virtual:styleframe",
					specifiers: ["button"],
				},
				{
					path: "./utils",
					specifiers: ["formatDate"],
				},
				{
					path: "vue",
					specifiers: ["ref", "computed"],
				},
			],
			"different-module.ts": [
				{
					path: "other-module",
					specifiers: ["something"],
				},
			],
			"no-imports.ts": [],
			"side-effect.ts": [
				{
					path: "virtual:styleframe.css",
					isSideEffect: true,
				},
			],
			"combined.ts": [
				{
					path: "virtual:styleframe",
					specifiers: ["button"],
				},
				{
					path: "virtual:styleframe",
					isNamespace: true,
				},
			],
		};

		const edges = fixtures[filePath];
		if (!edges) {
			throw new Error(`File not found: ${filePath}`);
		}
		return edges;
	},
}));

describe("scanFileImports", () => {
	it("extracts named import specifiers", () => {
		const result = scanFileImports("named-import.ts", "virtual:styleframe");
		expect(result.specifiers).toEqual(new Set(["button"]));
		expect(result.hasNamespace).toBe(false);
		expect(result.hasDynamic).toBe(false);
	});

	it("extracts multiple named imports", () => {
		const result = scanFileImports("multiple-named.ts", "virtual:styleframe");
		expect(result.specifiers).toEqual(new Set(["button", "badge", "card"]));
	});

	it("extracts aliased imports using original name", () => {
		const result = scanFileImports("aliased-import.ts", "virtual:styleframe");
		expect(result.specifiers).toEqual(new Set(["button"]));
	});

	it("extracts re-exported specifiers", () => {
		const result = scanFileImports("re-export.ts", "virtual:styleframe");
		expect(result.specifiers).toEqual(new Set(["button"]));
	});

	it("detects namespace imports", () => {
		const result = scanFileImports("namespace-import.ts", "virtual:styleframe");
		expect(result.hasNamespace).toBe(true);
		expect(result.specifiers.size).toBe(0);
	});

	it("detects dynamic imports", () => {
		const result = scanFileImports("dynamic-import.ts", "virtual:styleframe");
		expect(result.hasDynamic).toBe(true);
		expect(result.specifiers.size).toBe(0);
	});

	it("filters by module ID, ignoring other imports", () => {
		const result = scanFileImports("mixed-modules.ts", "virtual:styleframe");
		expect(result.specifiers).toEqual(new Set(["button"]));
	});

	it("returns empty result for different module", () => {
		const result = scanFileImports("different-module.ts", "virtual:styleframe");
		expect(result.specifiers.size).toBe(0);
		expect(result.hasNamespace).toBe(false);
		expect(result.hasDynamic).toBe(false);
	});

	it("returns empty result for files with no imports", () => {
		const result = scanFileImports("no-imports.ts", "virtual:styleframe");
		expect(result.specifiers.size).toBe(0);
	});

	it("ignores side-effect imports of other modules", () => {
		const result = scanFileImports("side-effect.ts", "virtual:styleframe");
		expect(result.specifiers.size).toBe(0);
	});

	it("handles combined specifiers and namespace in same file", () => {
		const result = scanFileImports("combined.ts", "virtual:styleframe");
		expect(result.specifiers).toEqual(new Set(["button"]));
		expect(result.hasNamespace).toBe(true);
	});

	it("returns empty result when file cannot be parsed", () => {
		const result = scanFileImports("nonexistent.ts", "virtual:styleframe");
		expect(result.specifiers.size).toBe(0);
		expect(result.hasNamespace).toBe(false);
		expect(result.hasDynamic).toBe(false);
	});
});

describe("mergeImportScanResults", () => {
	it("merges specifiers from two results", () => {
		const a = createEmptyImportScanResult();
		a.specifiers.add("button");

		const b = createEmptyImportScanResult();
		b.specifiers.add("badge");

		mergeImportScanResults(a, b);

		expect(a.specifiers).toEqual(new Set(["button", "badge"]));
	});

	it("ORs hasNamespace flag", () => {
		const a = createEmptyImportScanResult();
		const b = createEmptyImportScanResult();
		b.hasNamespace = true;

		mergeImportScanResults(a, b);

		expect(a.hasNamespace).toBe(true);
		expect(a.hasDynamic).toBe(false);
	});

	it("ORs hasDynamic flag", () => {
		const a = createEmptyImportScanResult();
		const b = createEmptyImportScanResult();
		b.hasDynamic = true;

		mergeImportScanResults(a, b);

		expect(a.hasDynamic).toBe(true);
		expect(a.hasNamespace).toBe(false);
	});
});
