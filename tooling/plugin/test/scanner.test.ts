import { describe, expect, it, vi } from "vitest";
import { styleframe } from "@styleframe/core";
import type { PluginGlobalState } from "../src/plugin/state";
import {
	createPluginScanner,
	isContentFile,
	scanAndRegister,
	scanFileAndRegister,
} from "../src/plugin/scanner";
import type { PluginScannerState } from "../src/plugin/scanner";
import type {
	UtilityMatch,
	ParsedUtility,
	Scanner,
	ScanResult,
	FileScanResult,
} from "@styleframe/scanner";

function createMockState(
	instance?: ReturnType<typeof styleframe>,
): PluginGlobalState {
	return {
		globalInstance: instance ?? null,
		configFile: {
			path: "/path/to/config.ts",
			loadOrder: -1,
			exports: new Map(),
			lastModified: 0,
		},
		files: new Map(),
		loadingFiles: new Set(),
		initialized: false,
	};
}

function createParsedUtility(
	overrides: Partial<ParsedUtility> & { name: string; value: string },
): ParsedUtility {
	return {
		raw: `_${overrides.modifiers?.length ? overrides.modifiers.join(":") + ":" : ""}${overrides.name}:${overrides.value}`,
		modifiers: [],
		isArbitrary: false,
		...overrides,
	};
}

describe("scanner integration", () => {
	describe("isContentFile", () => {
		it("should return false when scannerState is null", () => {
			expect(isContentFile(null, "/some/file.tsx")).toBe(false);
		});

		it("should return true for tracked files", () => {
			const scannerState = createPluginScanner(["./src/**/*.tsx"], "/");
			scannerState.scannedFiles.add("/some/file.tsx");

			expect(isContentFile(scannerState, "/some/file.tsx")).toBe(true);
		});

		it("should return false for untracked files", () => {
			const scannerState = createPluginScanner(["./src/**/*.tsx"], "/");

			expect(isContentFile(scannerState, "/some/file.tsx")).toBe(false);
		});
	});

	describe("scanAndRegister", () => {
		function createMockScanner(overrides?: Partial<Scanner>): Scanner {
			return {
				scan: vi.fn().mockResolvedValue({
					files: new Map(),
					allClasses: new Set(),
					allParsed: [],
				} satisfies ScanResult),
				scanFile: vi.fn().mockResolvedValue({
					path: "",
					classes: new Set(),
					parsed: [],
					lastScanned: 0,
				} satisfies FileScanResult),
				scanContent: vi.fn().mockReturnValue([]),
				match: vi.fn().mockReturnValue([]),
				watch: vi.fn().mockReturnValue(() => {}),
				invalidate: vi.fn(),
				...overrides,
			};
		}

		function createMockScannerState(scanner?: Scanner): PluginScannerState {
			return {
				scanner: scanner ?? createMockScanner(),
				scannedFiles: new Set(),
			};
		}

		it("should return 0 when globalInstance is null", async () => {
			const state = createMockState();
			const scannerState = createMockScannerState();

			const count = await scanAndRegister(state, scannerState);

			expect(count).toBe(0);
			expect(scannerState.scanner.scan).not.toHaveBeenCalled();
		});

		it("should scan files and update scannedFiles set", async () => {
			const s = styleframe();
			const state = createMockState(s);

			const scanResult: ScanResult = {
				files: new Map([
					[
						"/src/app.tsx",
						{
							path: "/src/app.tsx",
							classes: new Set(),
							parsed: [],
							lastScanned: Date.now(),
						},
					],
					[
						"/src/page.tsx",
						{
							path: "/src/page.tsx",
							classes: new Set(),
							parsed: [],
							lastScanned: Date.now(),
						},
					],
				]),
				allClasses: new Set(),
				allParsed: [],
			};

			const scanner = createMockScanner({
				scan: vi.fn().mockResolvedValue(scanResult),
				match: vi.fn().mockReturnValue([]),
			});
			const scannerState = createMockScannerState(scanner);

			await scanAndRegister(state, scannerState);

			expect(scannerState.scannedFiles.has("/src/app.tsx")).toBe(true);
			expect(scannerState.scannedFiles.has("/src/page.tsx")).toBe(true);
			expect(scannerState.scannedFiles.size).toBe(2);
		});

		it("should clear previous scannedFiles on each scan", async () => {
			const s = styleframe();
			const state = createMockState(s);

			const scanner = createMockScanner({
				scan: vi.fn().mockResolvedValue({
					files: new Map([
						[
							"/src/new.tsx",
							{
								path: "/src/new.tsx",
								classes: new Set(),
								parsed: [],
								lastScanned: Date.now(),
							},
						],
					]),
					allClasses: new Set(),
					allParsed: [],
				} satisfies ScanResult),
				match: vi.fn().mockReturnValue([]),
			});
			const scannerState = createMockScannerState(scanner);
			scannerState.scannedFiles.add("/src/old.tsx");

			await scanAndRegister(state, scannerState);

			expect(scannerState.scannedFiles.has("/src/old.tsx")).toBe(false);
			expect(scannerState.scannedFiles.has("/src/new.tsx")).toBe(true);
		});

		it("should match parsed utilities against root and register them", async () => {
			const s = styleframe();
			const { utility } = s;

			utility("padding", ({ value }) => ({ padding: value }));

			const state = createMockState(s);
			const factory = s.root.utilities.find((u) => u.name === "padding")!;

			const parsed: Array<ParsedUtility> = [
				createParsedUtility({ name: "padding", value: "sm" }),
			];

			const matches: Array<UtilityMatch> = [
				{
					parsed: parsed[0],
					factory,
					modifierFactories: [],
					exists: false,
				},
			];

			const scanner = createMockScanner({
				scan: vi.fn().mockResolvedValue({
					files: new Map(),
					allClasses: new Set(),
					allParsed: parsed,
				} satisfies ScanResult),
				match: vi.fn().mockReturnValue(matches),
			});
			const scannerState = createMockScannerState(scanner);

			const count = await scanAndRegister(state, scannerState);

			expect(count).toBe(1);
			expect(scanner.match).toHaveBeenCalledWith(parsed, s.root);
		});

		it("should suppress logging when silent option is true", async () => {
			const s = styleframe();
			const { utility } = s;

			utility("padding", ({ value }) => ({ padding: value }));

			const state = createMockState(s);
			const factory = s.root.utilities.find((u) => u.name === "padding")!;

			const parsed: Array<ParsedUtility> = [
				createParsedUtility({ name: "padding", value: "sm" }),
			];

			const unmatchedParsed = createParsedUtility({
				name: "unknown",
				value: "lg",
			});

			const matches: Array<UtilityMatch> = [
				{
					parsed: parsed[0],
					factory,
					modifierFactories: [],
					exists: false,
				},
				{
					parsed: unmatchedParsed,
					factory: null,
					modifierFactories: [],
					exists: false,
				},
			];

			const scanner = createMockScanner({
				scan: vi.fn().mockResolvedValue({
					files: new Map(),
					allClasses: new Set(),
					allParsed: parsed,
				} satisfies ScanResult),
				match: vi.fn().mockReturnValue(matches),
			});
			const scannerState = createMockScannerState(scanner);

			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			// Should not throw or error when silent
			const count = await scanAndRegister(state, scannerState, {
				silent: true,
			});

			expect(count).toBe(1);
			warnSpy.mockRestore();
		});

		it("should return 0 when there are no matches to register", async () => {
			const s = styleframe();
			const state = createMockState(s);

			const scanner = createMockScanner({
				scan: vi.fn().mockResolvedValue({
					files: new Map(),
					allClasses: new Set(),
					allParsed: [],
				} satisfies ScanResult),
				match: vi.fn().mockReturnValue([]),
			});
			const scannerState = createMockScannerState(scanner);

			const count = await scanAndRegister(state, scannerState);

			expect(count).toBe(0);
		});
	});

	describe("scanFileAndRegister", () => {
		function createMockScanner(overrides?: Partial<Scanner>): Scanner {
			return {
				scan: vi.fn().mockResolvedValue({
					files: new Map(),
					allClasses: new Set(),
					allParsed: [],
				}),
				scanFile: vi.fn().mockResolvedValue({
					path: "",
					classes: new Set(),
					parsed: [],
					lastScanned: 0,
				} satisfies FileScanResult),
				scanContent: vi.fn().mockReturnValue([]),
				match: vi.fn().mockReturnValue([]),
				watch: vi.fn().mockReturnValue(() => {}),
				invalidate: vi.fn(),
				...overrides,
			};
		}

		function createMockScannerState(scanner?: Scanner): PluginScannerState {
			return {
				scanner: scanner ?? createMockScanner(),
				scannedFiles: new Set(),
			};
		}

		it("should return false when globalInstance is null", async () => {
			const state = createMockState();
			const scannerState = createMockScannerState();

			const result = await scanFileAndRegister(
				state,
				scannerState,
				"/src/app.tsx",
			);

			expect(result).toBe(false);
			expect(scannerState.scanner.invalidate).not.toHaveBeenCalled();
		});

		it("should invalidate cache and scan the file", async () => {
			const s = styleframe();
			const state = createMockState(s);

			const filePath = "/src/app.tsx";
			const fileResult: FileScanResult = {
				path: filePath,
				classes: new Set(),
				parsed: [],
				lastScanned: Date.now(),
			};

			const scanner = createMockScanner({
				scanFile: vi.fn().mockResolvedValue(fileResult),
				match: vi.fn().mockReturnValue([]),
			});
			const scannerState = createMockScannerState(scanner);

			await scanFileAndRegister(state, scannerState, filePath);

			expect(scanner.invalidate).toHaveBeenCalledWith(filePath);
			expect(scanner.scanFile).toHaveBeenCalledWith(filePath);
		});

		it("should return true when new utilities are registered", async () => {
			const s = styleframe();
			const { utility } = s;

			utility("margin", ({ value }) => ({ margin: value }));

			const state = createMockState(s);
			const factory = s.root.utilities.find((u) => u.name === "margin")!;

			const filePath = "/src/app.tsx";
			const parsed: Array<ParsedUtility> = [
				createParsedUtility({ name: "margin", value: "lg" }),
			];

			const fileResult: FileScanResult = {
				path: filePath,
				classes: new Set(["_margin:lg"]),
				parsed,
				lastScanned: Date.now(),
			};

			const matches: Array<UtilityMatch> = [
				{
					parsed: parsed[0],
					factory,
					modifierFactories: [],
					exists: false,
				},
			];

			const scanner = createMockScanner({
				scanFile: vi.fn().mockResolvedValue(fileResult),
				match: vi.fn().mockReturnValue(matches),
			});
			const scannerState = createMockScannerState(scanner);

			const result = await scanFileAndRegister(state, scannerState, filePath);

			expect(result).toBe(true);
			expect(scanner.match).toHaveBeenCalledWith(parsed, s.root);
		});

		it("should return false when no new utilities are registered", async () => {
			const s = styleframe();
			const { utility } = s;

			utility("margin", ({ value }) => ({ margin: value }));

			const state = createMockState(s);
			const factory = s.root.utilities.find((u) => u.name === "margin")!;

			const filePath = "/src/app.tsx";
			const parsed: Array<ParsedUtility> = [
				createParsedUtility({ name: "margin", value: "sm" }),
			];

			const fileResult: FileScanResult = {
				path: filePath,
				classes: new Set(["_margin:sm"]),
				parsed,
				lastScanned: Date.now(),
			};

			// Match exists already
			const matches: Array<UtilityMatch> = [
				{
					parsed: parsed[0],
					factory,
					modifierFactories: [],
					exists: true,
				},
			];

			const scanner = createMockScanner({
				scanFile: vi.fn().mockResolvedValue(fileResult),
				match: vi.fn().mockReturnValue(matches),
			});
			const scannerState = createMockScannerState(scanner);

			const result = await scanFileAndRegister(state, scannerState, filePath);

			expect(result).toBe(false);
		});

		it("should return false when file has no utility classes", async () => {
			const s = styleframe();
			const state = createMockState(s);

			const filePath = "/src/plain.tsx";
			const fileResult: FileScanResult = {
				path: filePath,
				classes: new Set(),
				parsed: [],
				lastScanned: Date.now(),
			};

			const scanner = createMockScanner({
				scanFile: vi.fn().mockResolvedValue(fileResult),
				match: vi.fn().mockReturnValue([]),
			});
			const scannerState = createMockScannerState(scanner);

			const result = await scanFileAndRegister(state, scannerState, filePath);

			expect(result).toBe(false);
		});
	});
});
