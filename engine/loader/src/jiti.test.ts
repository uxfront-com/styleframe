import path from "node:path";

import type { Jiti } from "jiti";
import { describe, expect, test } from "vitest";

import { clearAllJitiCache, clearJitiCache, createSharedJiti } from "./jiti";

/**
 * Build a fake Jiti whose cache is a plain object or Map, so cache-clearing
 * behaviour can be asserted without spinning up a real jiti runtime.
 */
function fakeJiti(cache: unknown): Jiti {
	return { cache } as unknown as Jiti;
}

describe("createSharedJiti", () => {
	test("returns an importable jiti instance with module caching enabled", () => {
		const jiti = createSharedJiti();
		expect(typeof jiti.import).toBe("function");
		expect(jiti.cache).toBeDefined();
	});

	test("merges caller options over the defaults", () => {
		const jiti = createSharedJiti({ interopDefault: false });
		expect(typeof jiti.import).toBe("function");
	});
});

describe("clearJitiCache", () => {
	test("removes both the resolved and file:// keys from a Map cache", () => {
		const filePath = "./theme/useTokens.ts";
		const resolved = path.resolve(filePath);
		const cache = new Map<string, unknown>();
		cache.set(resolved, {});
		cache.set(`file://${resolved}`, {});
		cache.set("unrelated", {});

		clearJitiCache(fakeJiti(cache), filePath);

		expect(cache.has(resolved)).toBe(false);
		expect(cache.has(`file://${resolved}`)).toBe(false);
		expect(cache.has("unrelated")).toBe(true);
	});

	test("removes both key formats from an object cache", () => {
		const filePath = "./theme/useTokens.ts";
		const resolved = path.resolve(filePath);
		const cache: Record<string, unknown> = {
			[resolved]: {},
			[`file://${resolved}`]: {},
			unrelated: {},
		};

		clearJitiCache(fakeJiti(cache), filePath);

		expect(resolved in cache).toBe(false);
		expect(`file://${resolved}` in cache).toBe(false);
		expect("unrelated" in cache).toBe(true);
	});

	test("clears multiple files in one call", () => {
		const a = path.resolve("./a.ts");
		const b = path.resolve("./b.ts");
		const cache = new Map<string, unknown>([
			[a, {}],
			[b, {}],
		]);

		clearJitiCache(fakeJiti(cache), "./a.ts", "./b.ts");

		expect(cache.size).toBe(0);
	});

	test("is a no-op when the jiti instance has no cache", () => {
		expect(() => clearJitiCache(fakeJiti(undefined), "./a.ts")).not.toThrow();
	});
});

describe("clearAllJitiCache", () => {
	test("empties a Map cache", () => {
		const cache = new Map<string, unknown>([
			["a", {}],
			["b", {}],
		]);

		clearAllJitiCache(fakeJiti(cache));

		expect(cache.size).toBe(0);
	});

	test("removes every key from an object cache", () => {
		const cache: Record<string, unknown> = { a: {}, b: {} };

		clearAllJitiCache(fakeJiti(cache));

		expect(Object.keys(cache)).toHaveLength(0);
	});

	test("is a no-op when the jiti instance has no cache", () => {
		expect(() => clearAllJitiCache(fakeJiti(undefined))).not.toThrow();
	});
});
