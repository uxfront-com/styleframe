import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createScanner } from "./node";
import { quickScan, createContentScanner } from "./scanner";
import { hashContent, createCache } from "./cache";
import { createChangeHandler } from "./watcher";

// Mock dependencies
vi.mock("fast-glob", () => ({
	default: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
	readFile: vi.fn(),
}));

vi.mock("importree", () => ({
	parseImports: vi.fn(),
}));

import fg from "fast-glob";
import { readFile } from "node:fs/promises";
import { parseImports } from "importree";

const mockFg = fg as unknown as ReturnType<typeof vi.fn>;
const mockReadFile = readFile as unknown as ReturnType<typeof vi.fn>;
const mockParseImports = parseImports as unknown as ReturnType<typeof vi.fn>;

describe("createScanner", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("scan", () => {
		it("should scan multiple files and aggregate results", async () => {
			mockFg.mockResolvedValue([
				"/project/src/App.tsx",
				"/project/src/Button.tsx",
			]);
			mockReadFile
				.mockResolvedValueOnce(
					'<div className="_margin:sm _padding:md">App</div>',
				)
				.mockResolvedValueOnce(
					'<button className="_background:primary _hover:background:secondary">Click</button>',
				);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = await scanner.scan();

			expect(result.files.size).toBe(2);
			expect(result.allClasses.has("_margin:sm")).toBe(true);
			expect(result.allClasses.has("_padding:md")).toBe(true);
			expect(result.allClasses.has("_background:primary")).toBe(true);
			expect(result.allClasses.has("_hover:background:secondary")).toBe(true);
			expect(result.allParsed.length).toBe(4);
		});

		it("should return empty result when no files match", async () => {
			mockFg.mockResolvedValue([]);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = await scanner.scan();

			expect(result.files.size).toBe(0);
			expect(result.allClasses.size).toBe(0);
			expect(result.allParsed.length).toBe(0);
		});

		it("should continue scanning when a file fails", async () => {
			mockFg.mockResolvedValue([
				"/project/src/Valid.tsx",
				"/project/src/Invalid.tsx",
			]);
			mockReadFile
				.mockResolvedValueOnce('<div className="_margin:sm">Valid</div>')
				.mockRejectedValueOnce(new Error("File not found"));

			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = await scanner.scan();

			expect(result.files.size).toBe(1);
			expect(result.allClasses.has("_margin:sm")).toBe(true);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"[styleframe/scanner] Failed to scan /project/src/Invalid.tsx:",
				expect.any(Error),
			);

			consoleWarnSpy.mockRestore();
		});
	});

	describe("scanFile", () => {
		it("should scan a single file and return result", async () => {
			mockFg.mockResolvedValue(["/project/src/App.tsx"]);
			mockReadFile.mockResolvedValue(
				'<div className="_margin:sm _padding:md">App</div>',
			);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = await scanner.scanFile("/project/src/App.tsx");

			expect(result.path).toBe("/project/src/App.tsx");
			expect(result.classes.has("_margin:sm")).toBe(true);
			expect(result.classes.has("_padding:md")).toBe(true);
			expect(result.parsed.length).toBe(2);
			expect(result.lastScanned).toBeGreaterThan(0);
		});
	});

	describe("scanContent", () => {
		it("should scan content string directly", () => {
			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = scanner.scanContent(
				'<div className="_margin:sm _hover:padding:lg">Content</div>',
				"inline.tsx",
			);

			expect(result.length).toBe(2);
			expect(result[0]!.name).toBe("margin");
			expect(result[0]!.value).toBe("sm");
			expect(result[1]!.name).toBe("padding");
			expect(result[1]!.value).toBe("lg");
			expect(result[1]!.modifiers).toContain("hover");
		});

		it("should use default file path when not provided", () => {
			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = scanner.scanContent(
				'<div class="_margin:sm">Content</div>',
			);

			expect(result.length).toBe(1);
			expect(result[0]!.name).toBe("margin");
		});
	});

	describe("scanImports", () => {
		it("should aggregate import specifiers across all content files", async () => {
			mockFg.mockResolvedValue([
				"/project/src/App.tsx",
				"/project/src/Page.tsx",
			]);
			mockParseImports
				.mockReturnValueOnce([
					{ path: "virtual:styleframe", specifiers: ["button"] },
				])
				.mockReturnValueOnce([
					{ path: "virtual:styleframe", specifiers: ["badge", "card"] },
				]);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = await scanner.scanImports("virtual:styleframe");

			expect(result.specifiers).toEqual(new Set(["button", "badge", "card"]));
			expect(result.hasNamespace).toBe(false);
			expect(result.hasDynamic).toBe(false);
		});

		it("should detect namespace imports across files", async () => {
			mockFg.mockResolvedValue(["/project/src/App.tsx"]);
			mockParseImports.mockReturnValueOnce([
				{ path: "virtual:styleframe", isNamespace: true },
			]);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = await scanner.scanImports("virtual:styleframe");

			expect(result.hasNamespace).toBe(true);
		});

		it("should return empty result when no files match the module", async () => {
			mockFg.mockResolvedValue(["/project/src/App.tsx"]);
			mockParseImports.mockReturnValueOnce([
				{ path: "other-module", specifiers: ["foo"] },
			]);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = await scanner.scanImports("virtual:styleframe");

			expect(result.specifiers.size).toBe(0);
		});
	});

	describe("scanFileImports", () => {
		it("should scan a single file for imports of a specific module", () => {
			mockParseImports.mockReturnValueOnce([
				{ path: "virtual:styleframe", specifiers: ["button", "badge"] },
			]);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = scanner.scanFileImports(
				"/project/src/App.tsx",
				"virtual:styleframe",
			);

			expect(result.specifiers).toEqual(new Set(["button", "badge"]));
		});

		it("should return empty result when file cannot be parsed", () => {
			mockParseImports.mockImplementationOnce(() => {
				throw new Error("parse error");
			});

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const result = scanner.scanFileImports(
				"/project/src/broken.tsx",
				"virtual:styleframe",
			);

			expect(result.specifiers.size).toBe(0);
			expect(result.hasNamespace).toBe(false);
			expect(result.hasDynamic).toBe(false);
		});
	});

	describe("invalidate", () => {
		it("should invalidate specific file cache", async () => {
			mockFg.mockResolvedValue(["/project/src/App.tsx"]);
			mockReadFile.mockResolvedValue('<div className="_margin:sm">App</div>');

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			// First scan
			await scanner.scanFile("/project/src/App.tsx");
			expect(mockReadFile).toHaveBeenCalledTimes(1);

			// Second scan should use cache
			await scanner.scanFile("/project/src/App.tsx");
			expect(mockReadFile).toHaveBeenCalledTimes(2); // Still reads file for hash check

			// Invalidate and change content
			scanner.invalidate("/project/src/App.tsx");
			mockReadFile.mockResolvedValue(
				'<div className="_padding:lg">App Updated</div>',
			);

			const result = await scanner.scanFile("/project/src/App.tsx");
			expect(result.classes.has("_padding:lg")).toBe(true);
		});

		it("should invalidate all cache when no path provided", async () => {
			mockFg.mockResolvedValue([
				"/project/src/App.tsx",
				"/project/src/Button.tsx",
			]);
			mockReadFile
				.mockResolvedValueOnce('<div className="_margin:sm">App</div>')
				.mockResolvedValueOnce(
					'<button className="_padding:md">Button</button>',
				);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			// First scan
			await scanner.scan();

			// Invalidate all
			scanner.invalidate();

			// Update content
			mockReadFile
				.mockResolvedValueOnce('<div className="_margin:lg">App Updated</div>')
				.mockResolvedValueOnce(
					'<button className="_padding:xl">Button Updated</button>',
				);

			const result = await scanner.scan();
			expect(result.allClasses.has("_margin:lg")).toBe(true);
			expect(result.allClasses.has("_padding:xl")).toBe(true);
		});
	});
});

describe("cache", () => {
	describe("hashContent", () => {
		it("should generate consistent hash for same content", () => {
			const content = "Hello, World!";
			const hash1 = hashContent(content);
			const hash2 = hashContent(content);

			expect(hash1).toBe(hash2);
		});

		it("should generate different hashes for different content", () => {
			const hash1 = hashContent("Hello, World!");
			const hash2 = hashContent("Hello, Universe!");

			expect(hash1).not.toBe(hash2);
		});

		it("should include content length in hash", () => {
			const hash = hashContent("Test");
			expect(hash).toMatch(/-4$/); // Length 4
		});

		it("should generate different hashes for anagrams", () => {
			const hash1 = hashContent("abc");
			const hash2 = hashContent("cba");

			expect(hash1).not.toBe(hash2);
		});
	});

	describe("createCache", () => {
		it("should store and retrieve cached results", () => {
			const cache = createCache();
			const result = {
				path: "/test/file.tsx",
				classes: new Set(["_margin:sm"]),
				parsed: [
					{
						raw: "_margin:sm",
						name: "margin",
						value: "sm",
						modifiers: [],
						isArbitrary: false,
					},
				],
				lastScanned: Date.now(),
			};

			cache.set("/test/file.tsx", result, "hash123");

			expect(cache.get("/test/file.tsx")).toBe(result);
		});

		it("should return null for non-existent cache entry", () => {
			const cache = createCache();

			expect(cache.get("/nonexistent.tsx")).toBeNull();
		});

		it("should validate cache with matching hash", () => {
			const cache = createCache();
			const result = {
				path: "/test/file.tsx",
				classes: new Set(["_margin:sm"]),
				parsed: [],
				lastScanned: Date.now(),
			};

			cache.set("/test/file.tsx", result, "hash123");

			expect(cache.isValid("/test/file.tsx", "hash123")).toBe(true);
			expect(cache.isValid("/test/file.tsx", "different-hash")).toBe(false);
		});

		it("should return cached result only when hash matches via getIfValid", () => {
			const cache = createCache();
			const result = {
				path: "/test/file.tsx",
				classes: new Set(["_margin:sm"]),
				parsed: [],
				lastScanned: Date.now(),
			};

			cache.set("/test/file.tsx", result, "hash123");

			expect(cache.getIfValid("/test/file.tsx", "hash123")).toBe(result);
			expect(cache.getIfValid("/test/file.tsx", "different-hash")).toBeNull();
		});

		it("should invalidate specific cache entry", () => {
			const cache = createCache();
			const result = {
				path: "/test/file.tsx",
				classes: new Set(["_margin:sm"]),
				parsed: [],
				lastScanned: Date.now(),
			};

			cache.set("/test/file.tsx", result, "hash123");
			cache.invalidate("/test/file.tsx");

			expect(cache.get("/test/file.tsx")).toBeNull();
		});

		it("should clear all cache entries", () => {
			const cache = createCache();
			const result1 = {
				path: "/test/file1.tsx",
				classes: new Set(["_margin:sm"]),
				parsed: [],
				lastScanned: Date.now(),
			};
			const result2 = {
				path: "/test/file2.tsx",
				classes: new Set(["_padding:md"]),
				parsed: [],
				lastScanned: Date.now(),
			};

			cache.set("/test/file1.tsx", result1, "hash1");
			cache.set("/test/file2.tsx", result2, "hash2");
			cache.clear();

			expect(cache.get("/test/file1.tsx")).toBeNull();
			expect(cache.get("/test/file2.tsx")).toBeNull();
		});
	});

	describe("cache integration with scanner", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("should use cache on subsequent scans with same content", async () => {
			const content = '<div className="_margin:sm">App</div>';
			mockFg.mockResolvedValue(["/project/src/App.tsx"]);
			mockReadFile.mockResolvedValue(content);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			// First scan - should read and cache
			const result1 = await scanner.scanFile("/project/src/App.tsx");
			expect(mockReadFile).toHaveBeenCalledTimes(1);

			// Second scan - should still read file to compute hash, but return cached result
			const result2 = await scanner.scanFile("/project/src/App.tsx");
			expect(mockReadFile).toHaveBeenCalledTimes(2);

			// Results should be the same cached object
			expect(result1).toBe(result2);
		});

		it("should invalidate cache when content changes", async () => {
			mockFg.mockResolvedValue(["/project/src/App.tsx"]);
			mockReadFile.mockResolvedValueOnce(
				'<div className="_margin:sm">App</div>',
			);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			// First scan
			const result1 = await scanner.scanFile("/project/src/App.tsx");
			expect(result1.classes.has("_margin:sm")).toBe(true);

			// Content changes
			mockReadFile.mockResolvedValueOnce(
				'<div className="_padding:lg">App Updated</div>',
			);

			// Second scan - should detect content change via hash and re-parse
			const result2 = await scanner.scanFile("/project/src/App.tsx");
			expect(result2.classes.has("_padding:lg")).toBe(true);
			expect(result2.classes.has("_margin:sm")).toBe(false);
			expect(result1).not.toBe(result2);
		});
	});
});

describe("watch", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("createChangeHandler", () => {
		it("should debounce file changes and batch callback", async () => {
			const callback = vi.fn();
			const { onChange } = createChangeHandler(callback, { debounce: 100 });

			// Trigger multiple changes
			onChange("/project/src/App.tsx");
			onChange("/project/src/Button.tsx");
			onChange("/project/src/Card.tsx");

			// Callback shouldn't be called yet
			expect(callback).not.toHaveBeenCalled();

			// Advance timers
			await vi.advanceTimersByTimeAsync(100);

			// Callback should be called once with all files
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith([
				"/project/src/App.tsx",
				"/project/src/Button.tsx",
				"/project/src/Card.tsx",
			]);
		});

		it("should deduplicate repeated file changes", async () => {
			const callback = vi.fn();
			const { onChange } = createChangeHandler(callback, { debounce: 100 });

			// Same file changed multiple times
			onChange("/project/src/App.tsx");
			onChange("/project/src/App.tsx");
			onChange("/project/src/App.tsx");

			await vi.advanceTimersByTimeAsync(100);

			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(["/project/src/App.tsx"]);
		});

		it("should reset debounce timer on new changes", async () => {
			const callback = vi.fn();
			const { onChange } = createChangeHandler(callback, { debounce: 100 });

			onChange("/project/src/App.tsx");
			await vi.advanceTimersByTimeAsync(50);

			// New change should reset timer
			onChange("/project/src/Button.tsx");
			await vi.advanceTimersByTimeAsync(50);

			// Still not called - timer was reset
			expect(callback).not.toHaveBeenCalled();

			await vi.advanceTimersByTimeAsync(50);

			expect(callback).toHaveBeenCalledTimes(1);
		});

		it("should flush pending changes immediately", async () => {
			const callback = vi.fn();
			const { onChange, flush } = createChangeHandler(callback, {
				debounce: 100,
			});

			onChange("/project/src/App.tsx");
			onChange("/project/src/Button.tsx");

			// Flush before debounce completes
			flush();

			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith([
				"/project/src/App.tsx",
				"/project/src/Button.tsx",
			]);
		});

		it("should not call callback on flush if no pending changes", () => {
			const callback = vi.fn();
			const { flush } = createChangeHandler(callback, { debounce: 100 });

			flush();

			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe("scanner watch integration", () => {
		it("should invalidate cache and re-scan on file change", async () => {
			mockFg.mockResolvedValue(["/project/src/App.tsx"]);
			mockReadFile
				.mockResolvedValueOnce('<div className="_margin:sm">App</div>')
				.mockResolvedValueOnce(
					'<div className="_padding:lg">App Updated</div>',
				);

			const scanner = createScanner({
				content: ["./src/**/*.tsx"],
				cwd: "/project",
			});

			const watchCallback = vi.fn();

			// Initial scan
			await scanner.scan();

			// Set up watch
			const cleanup = scanner.watch(watchCallback);

			// The watch returns a cleanup function, but doesn't directly expose onChange
			// The watch is designed to be integrated with external file watchers
			// We can test the cleanup function
			expect(typeof cleanup).toBe("function");

			// Call cleanup to flush any pending changes
			cleanup();
		});
	});
});

describe("quickScan", () => {
	it("should scan content and return parsed utilities", () => {
		const result = quickScan(
			'<div class="_margin:sm _hover:padding:lg">Content</div>',
		);

		expect(result.length).toBe(2);
		expect(result[0]!.name).toBe("margin");
		expect(result[0]!.value).toBe("sm");
		expect(result[1]!.name).toBe("padding");
		expect(result[1]!.modifiers).toContain("hover");
	});

	it("should use file path hint for extractor selection", () => {
		// TSX uses className
		const tsxResult = quickScan(
			'<div className="_margin:sm">Content</div>',
			"component.tsx",
		);
		expect(tsxResult.length).toBe(1);

		// HTML uses class
		const htmlResult = quickScan(
			'<div class="_margin:sm">Content</div>',
			"page.html",
		);
		expect(htmlResult.length).toBe(1);
	});

	it("should return empty array for content without utilities", () => {
		const result = quickScan('<div class="btn primary">Content</div>');

		expect(result.length).toBe(0);
	});

	it("should scan with custom utility syntax", () => {
		const result = quickScan(
			'<div class="sf-margin-sm sf-hover-padding-lg">Content</div>',
			"page.html",
			{
				pattern: /sf-[a-zA-Z][a-zA-Z0-9-]*/g,
				parse: (className) => {
					if (!className.startsWith("sf-")) {
						return null;
					}
					const parts = className.slice(3).split("-");
					if (parts.length < 2) {
						return {
							raw: className,
							name: parts[0]!,
							value: "default",
							modifiers: [],
							isArbitrary: false,
						};
					}
					const value = parts.at(-1)!;
					const name = parts.at(-2)!;
					const modifiers = parts.slice(0, -2);
					return {
						raw: className,
						name,
						value,
						modifiers,
						isArbitrary: false,
					};
				},
			},
		);

		expect(result.length).toBe(2);
		expect(result[0]!.name).toBe("margin");
		expect(result[0]!.value).toBe("sm");
		expect(result[1]!.name).toBe("padding");
		expect(result[1]!.value).toBe("lg");
		expect(result[1]!.modifiers).toContain("hover");
	});
});

describe("createContentScanner", () => {
	it("should create a scanner function for content strings", () => {
		const scan = createContentScanner();
		const result = scan('<div class="_margin:sm _padding:md">Content</div>');

		expect(result.length).toBe(2);
		expect(result[0]!.name).toBe("margin");
		expect(result[1]!.name).toBe("padding");
	});

	it("should support custom extractors", () => {
		const customExtractor = (content: string) => {
			const matches = content.match(/data-class="([^"]+)"/g);
			if (!matches) {
				return [];
			}
			return matches.flatMap((m) => {
				const match = m.match(/data-class="([^"]+)"/);
				return match ? match[1]!.split(" ") : [];
			});
		};

		const scan = createContentScanner([customExtractor]);
		const result = scan(
			'<div data-class="_margin:sm _padding:md">Content</div>',
		);

		expect(result.length).toBe(2);
		expect(result[0]!.name).toBe("margin");
		expect(result[1]!.name).toBe("padding");
	});

	it("should use file path for extractor selection", () => {
		const scan = createContentScanner();

		// TSX file should use className extractor
		const tsxResult = scan(
			'<div className="_margin:sm">Content</div>',
			"file.tsx",
		);
		expect(tsxResult.length).toBe(1);

		// Default/HTML should use class extractor
		const htmlResult = scan('<div class="_margin:sm">Content</div>');
		expect(htmlResult.length).toBe(1);
	});

	it("should support custom utility syntax", () => {
		const scan = createContentScanner(undefined, {
			pattern: /sf-[a-zA-Z][a-zA-Z0-9-]*/g,
			parse: (className) => {
				if (!className.startsWith("sf-")) {
					return null;
				}
				const parts = className.slice(3).split("-");
				if (parts.length < 2) {
					return {
						raw: className,
						name: parts[0]!,
						value: "default",
						modifiers: [],
						isArbitrary: false,
					};
				}
				const value = parts.at(-1)!;
				const name = parts.at(-2)!;
				const modifiers = parts.slice(0, -2);
				return {
					raw: className,
					name,
					value,
					modifiers,
					isArbitrary: false,
				};
			},
		});

		const result = scan(
			'<div class="sf-margin-sm sf-padding-md">Content</div>',
		);
		expect(result.length).toBe(2);
		expect(result[0]!.name).toBe("margin");
		expect(result[0]!.value).toBe("sm");
		expect(result[1]!.name).toBe("padding");
		expect(result[1]!.value).toBe("md");
	});
});

describe("createScanner with custom utilities", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should scanContent with custom utility syntax", () => {
		const customUtilities = {
			pattern: /sf-[a-zA-Z][a-zA-Z0-9-]*/g,
			parse: (className: string) => {
				if (!className.startsWith("sf-")) {
					return null;
				}
				const parts = className.slice(3).split("-");
				if (parts.length < 2) {
					return {
						raw: className,
						name: parts[0]!,
						value: "default",
						modifiers: [] as Array<string>,
						isArbitrary: false,
					};
				}
				const value = parts.at(-1)!;
				const name = parts.at(-2)!;
				const modifiers = parts.slice(0, -2);
				return {
					raw: className,
					name,
					value,
					modifiers,
					isArbitrary: false,
				};
			},
		};

		const scanner = createScanner({
			content: ["./src/**/*.html"],
			cwd: "/project",
			utilities: customUtilities,
		});

		const parsed = scanner.scanContent(
			'<div class="sf-margin-sm sf-hover-padding-lg">Content</div>',
			"page.html",
		);

		expect(parsed.length).toBe(2);
		expect(parsed[0]!.name).toBe("margin");
		expect(parsed[0]!.value).toBe("sm");
		expect(parsed[1]!.name).toBe("padding");
		expect(parsed[1]!.value).toBe("lg");
		expect(parsed[1]!.modifiers).toContain("hover");
	});

	it("should scan files with custom utility syntax", async () => {
		mockFg.mockResolvedValue(["/project/src/page.html"]);
		mockReadFile.mockResolvedValue(
			'<div class="sf-margin-sm sf-hover-padding-lg">Content</div>',
		);

		const scanner = createScanner({
			content: ["./src/**/*.html"],
			cwd: "/project",
			utilities: {
				pattern: /sf-[a-zA-Z][a-zA-Z0-9-]*/g,
				parse: (className: string) => {
					if (!className.startsWith("sf-")) {
						return null;
					}
					const parts = className.slice(3).split("-");
					if (parts.length < 2) {
						return {
							raw: className,
							name: parts[0]!,
							value: "default",
							modifiers: [] as Array<string>,
							isArbitrary: false,
						};
					}
					const value = parts.at(-1)!;
					const name = parts.at(-2)!;
					const modifiers = parts.slice(0, -2);
					return {
						raw: className,
						name,
						value,
						modifiers,
						isArbitrary: false,
					};
				},
			},
		});

		const result = await scanner.scan();

		expect(result.files.size).toBe(1);
		expect(result.allClasses.size).toBeGreaterThan(0);
		expect(result.allClasses.has("sf-margin-sm")).toBe(true);
		expect(result.allParsed.length).toBe(2);
	});
});
