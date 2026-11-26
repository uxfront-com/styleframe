import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createChangeHandler, debounce, matchesPatterns } from "./watcher";

describe("debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should delay function execution", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("should reset timer on subsequent calls", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		vi.advanceTimersByTime(50);
		debouncedFn();
		vi.advanceTimersByTime(50);

		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("should pass arguments to the debounced function", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn("arg1", "arg2");
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledWith("arg1", "arg2");
	});

	it("should use the latest arguments when called multiple times", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn("first");
		debouncedFn("second");
		debouncedFn("third");
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith("third");
	});

	it("should allow multiple executions after delay", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn("first");
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenLastCalledWith("first");

		debouncedFn("second");
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(2);
		expect(fn).toHaveBeenLastCalledWith("second");
	});
});

describe("createChangeHandler", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should accumulate changed files", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.onChange("file1.ts");
		handler.onChange("file2.ts");
		handler.onChange("file3.ts");

		vi.advanceTimersByTime(100);

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(
			expect.arrayContaining(["file1.ts", "file2.ts", "file3.ts"]),
		);
	});

	it("should deduplicate files", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.onChange("file1.ts");
		handler.onChange("file1.ts");
		handler.onChange("file1.ts");

		vi.advanceTimersByTime(100);

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(["file1.ts"]);
	});

	it("should debounce with default delay (100ms)", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.onChange("file1.ts");

		vi.advanceTimersByTime(50);
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should respect custom debounce delay", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback, { debounce: 200 });

		handler.onChange("file1.ts");

		vi.advanceTimersByTime(100);
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should reset timer on subsequent changes", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.onChange("file1.ts");
		vi.advanceTimersByTime(50);

		handler.onChange("file2.ts");
		vi.advanceTimersByTime(50);

		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(
			expect.arrayContaining(["file1.ts", "file2.ts"]),
		);
	});

	it("should flush immediately", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.onChange("file1.ts");
		handler.onChange("file2.ts");

		handler.flush();

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(
			expect.arrayContaining(["file1.ts", "file2.ts"]),
		);
	});

	it("should not call callback on flush when no files changed", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.flush();

		expect(callback).not.toHaveBeenCalled();
	});

	it("should clear accumulated files after flush", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.onChange("file1.ts");
		handler.flush();

		handler.flush();

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should clear accumulated files after debounced callback", () => {
		const callback = vi.fn();
		const handler = createChangeHandler(callback);

		handler.onChange("file1.ts");
		vi.advanceTimersByTime(100);

		handler.onChange("file2.ts");
		vi.advanceTimersByTime(100);

		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenNthCalledWith(1, ["file1.ts"]);
		expect(callback).toHaveBeenNthCalledWith(2, ["file2.ts"]);
	});
});

describe("matchesPatterns", () => {
	describe("exact matching (non-glob patterns)", () => {
		it("should match exact file paths", () => {
			expect(matchesPatterns("src/index.ts", ["src/index.ts"])).toBe(true);
		});

		it("should not match different paths", () => {
			expect(matchesPatterns("src/index.ts", ["src/other.ts"])).toBe(false);
		});

		it("should match any of multiple patterns", () => {
			expect(
				matchesPatterns("src/index.ts", ["src/other.ts", "src/index.ts"]),
			).toBe(true);
		});
	});

	describe("single asterisk (*) matching", () => {
		it("should match any characters except path separator", () => {
			expect(matchesPatterns("src/index.ts", ["src/*.ts"])).toBe(true);
			expect(matchesPatterns("src/component.ts", ["src/*.ts"])).toBe(true);
		});

		it("should not match across directory boundaries", () => {
			expect(matchesPatterns("src/components/Button.ts", ["src/*.ts"])).toBe(
				false,
			);
		});

		it("should match file extensions", () => {
			expect(matchesPatterns("test.spec.ts", ["*.ts"])).toBe(true);
			expect(matchesPatterns("test.spec.js", ["*.ts"])).toBe(false);
		});

		it("should match prefix patterns", () => {
			expect(matchesPatterns("src/Button.tsx", ["src/Button*"])).toBe(true);
			expect(matchesPatterns("src/Button.test.tsx", ["src/Button*"])).toBe(
				true,
			);
			expect(matchesPatterns("src/Input.tsx", ["src/Button*"])).toBe(false);
		});
	});

	describe("double asterisk (**) matching", () => {
		it("should match any path depth", () => {
			expect(matchesPatterns("src/index.ts", ["**/*.ts"])).toBe(true);
			expect(matchesPatterns("src/components/Button.ts", ["**/*.ts"])).toBe(
				true,
			);
			expect(
				matchesPatterns("src/components/ui/deep/File.ts", ["**/*.ts"]),
			).toBe(true);
		});

		it("should match at start of pattern", () => {
			expect(matchesPatterns("src/test.ts", ["**/test.ts"])).toBe(true);
			expect(matchesPatterns("a/b/c/test.ts", ["**/test.ts"])).toBe(true);
		});

		it("should match directory patterns", () => {
			expect(
				matchesPatterns("src/components/Button.tsx", ["src/components/**"]),
			).toBe(true);
			expect(
				matchesPatterns("src/components/ui/Button.tsx", [
					"src/components/**/*.tsx",
				]),
			).toBe(true);
		});

		it("should match mid-path glob stars", () => {
			expect(matchesPatterns("src/a/b/c/index.ts", ["src/**/index.ts"])).toBe(
				true,
			);
		});

		it("should require at least one path segment for mid-path **", () => {
			// Note: This is simplified glob matching - ** between path segments
			// requires at least one character (the surrounding slashes are literal)
			expect(matchesPatterns("src/index.ts", ["src/**/index.ts"])).toBe(false);
			expect(matchesPatterns("src/x/index.ts", ["src/**/index.ts"])).toBe(true);
		});
	});

	describe("question mark (?) matching", () => {
		it("should match single character", () => {
			expect(matchesPatterns("file1.ts", ["file?.ts"])).toBe(true);
			expect(matchesPatterns("fileA.ts", ["file?.ts"])).toBe(true);
		});

		it("should not match zero or multiple characters", () => {
			expect(matchesPatterns("file.ts", ["file?.ts"])).toBe(false);
			expect(matchesPatterns("file12.ts", ["file?.ts"])).toBe(false);
		});

		it("should match multiple question marks", () => {
			expect(matchesPatterns("ab.ts", ["??.ts"])).toBe(true);
			expect(matchesPatterns("abc.ts", ["??.ts"])).toBe(false);
		});
	});

	describe("Windows path normalization", () => {
		it("should normalize backslashes to forward slashes in file paths", () => {
			expect(matchesPatterns(String.raw`src\index.ts`, ["src/index.ts"])).toBe(
				true,
			);
			expect(
				matchesPatterns(String.raw`src\components\Button.ts`, ["**/*.ts"]),
			).toBe(true);
		});

		it("should normalize backslashes in patterns", () => {
			expect(matchesPatterns("src/index.ts", [String.raw`src\index.ts`])).toBe(
				true,
			);
			expect(
				matchesPatterns("src/components/Button.ts", [String.raw`src\**\*.ts`]),
			).toBe(true);
		});

		it("should handle mixed slashes", () => {
			expect(
				matchesPatterns(String.raw`src\components/Button.ts`, [
					"src/components/*.ts",
				]),
			).toBe(true);
			expect(
				matchesPatterns(String.raw`src/components\Button.ts`, [
					String.raw`src\components\*.ts`,
				]),
			).toBe(true);
		});
	});

	describe("special regex characters", () => {
		it("should escape dots in patterns", () => {
			expect(matchesPatterns("test.spec.ts", ["*.spec.ts"])).toBe(true);
			expect(matchesPatterns("testXspecXts", ["*.spec.ts"])).toBe(false);
		});

		it("should escape other regex characters", () => {
			expect(matchesPatterns("file[1].ts", ["file[1].ts"])).toBe(true);
			expect(matchesPatterns("file(1).ts", ["file(1).ts"])).toBe(true);
			expect(matchesPatterns("file+1.ts", ["file+1.ts"])).toBe(true);
		});
	});

	describe("edge cases", () => {
		it("should return false for empty patterns array", () => {
			expect(matchesPatterns("src/index.ts", [])).toBe(false);
		});

		it("should handle root-level files with single asterisk", () => {
			expect(matchesPatterns("index.ts", ["*.ts"])).toBe(true);
		});

		it("should not match root-level files with **/ prefix", () => {
			// Note: **/*.ts requires at least one directory level because
			// the / after ** is literal in this simplified implementation
			expect(matchesPatterns("index.ts", ["**/*.ts"])).toBe(false);
			expect(matchesPatterns("src/index.ts", ["**/*.ts"])).toBe(true);
		});

		it("should match complex patterns", () => {
			expect(
				matchesPatterns("src/components/Button/Button.test.tsx", [
					"src/**/*.test.tsx",
				]),
			).toBe(true);
			expect(
				matchesPatterns("packages/scanner/src/utils/watcher.ts", [
					"packages/*/src/**/*.ts",
				]),
			).toBe(true);
		});

		it("should handle patterns with no wildcards as exact match", () => {
			expect(matchesPatterns("exact/path.ts", ["exact/path.ts"])).toBe(true);
			expect(matchesPatterns("exact/path.ts", ["other/path.ts"])).toBe(false);
		});
	});
});
