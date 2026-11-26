import { describe, expect, it } from "vitest";

import type { Reference, CSS, TokenValue } from "../types";
import { isTokenEqual } from "./isTokenEqual";

describe("isTokenEqual", () => {
	describe("primitive values", () => {
		it("should return true for identical strings", () => {
			expect(isTokenEqual("hello", "hello")).toBe(true);
		});

		it("should return false for different strings", () => {
			expect(isTokenEqual("hello", "world")).toBe(false);
		});

		it("should return true for identical numbers", () => {
			expect(isTokenEqual(42, 42)).toBe(true);
		});

		it("should return false for different numbers", () => {
			expect(isTokenEqual(42, 100)).toBe(false);
		});

		it("should return true for identical booleans", () => {
			expect(isTokenEqual(true, true)).toBe(true);
			expect(isTokenEqual(false, false)).toBe(true);
		});

		it("should return false for different booleans", () => {
			expect(isTokenEqual(true, false)).toBe(false);
		});

		it("should return true for null === null", () => {
			expect(isTokenEqual(null, null)).toBe(true);
		});

		it("should return true for undefined === undefined", () => {
			expect(isTokenEqual(undefined, undefined)).toBe(true);
		});

		it("should return false for null vs undefined", () => {
			expect(isTokenEqual(null, undefined)).toBe(false);
		});
	});

	describe("type mismatches", () => {
		it("should return false for string vs number", () => {
			expect(isTokenEqual("42", 42)).toBe(false);
		});

		it("should return false for boolean vs number", () => {
			expect(isTokenEqual(true, 1)).toBe(false);
		});

		it("should return false for string vs boolean", () => {
			expect(isTokenEqual("true", true)).toBe(false);
		});

		it("should return false for primitive vs object", () => {
			const ref: Reference = { type: "reference", name: "test" };
			expect(isTokenEqual("test", ref)).toBe(false);
		});

		it("should return false for null vs object", () => {
			const ref: Reference = { type: "reference", name: "test" };
			expect(isTokenEqual(null, ref)).toBe(false);
		});

		it("should return false for primitive vs array", () => {
			expect(isTokenEqual("test", ["test"])).toBe(false);
		});
	});

	describe("array comparison", () => {
		it("should return true for identical empty arrays", () => {
			expect(isTokenEqual([], [])).toBe(true);
		});

		it("should return true for identical primitive arrays", () => {
			expect(isTokenEqual(["a", "b", "c"], ["a", "b", "c"])).toBe(true);
		});

		it("should return false for arrays with different lengths", () => {
			expect(isTokenEqual(["a", "b"], ["a", "b", "c"])).toBe(false);
		});

		it("should return false for arrays with different values", () => {
			expect(isTokenEqual(["a", "b", "c"], ["a", "x", "c"])).toBe(false);
		});

		it("should return false for arrays with same values in different order", () => {
			expect(isTokenEqual(["a", "b", "c"], ["c", "b", "a"])).toBe(false);
		});

		it("should return true for arrays with identical reference objects", () => {
			const arr1: TokenValue = [
				{ type: "reference", name: "color" },
				{ type: "reference", name: "spacing" },
			];
			const arr2: TokenValue = [
				{ type: "reference", name: "color" },
				{ type: "reference", name: "spacing" },
			];
			expect(isTokenEqual(arr1, arr2)).toBe(true);
		});

		it("should return false for arrays with different reference objects", () => {
			const arr1: TokenValue = [
				{ type: "reference", name: "color" },
				{ type: "reference", name: "spacing" },
			];
			const arr2: TokenValue = [
				{ type: "reference", name: "color" },
				{ type: "reference", name: "other" },
			];
			expect(isTokenEqual(arr1, arr2)).toBe(false);
		});

		it("should return true for mixed primitive and reference arrays", () => {
			const arr1: TokenValue = ["hello", { type: "reference", name: "test" }];
			const arr2: TokenValue = ["hello", { type: "reference", name: "test" }];
			expect(isTokenEqual(arr1, arr2)).toBe(true);
		});

		it("should return false for array vs non-array", () => {
			expect(isTokenEqual(["test"], { type: "reference", name: "test" })).toBe(false);
		});
	});

	describe("Reference objects", () => {
		it("should return true for identical references", () => {
			const ref1: Reference = { type: "reference", name: "primary-color" };
			const ref2: Reference = { type: "reference", name: "primary-color" };
			expect(isTokenEqual(ref1, ref2)).toBe(true);
		});

		it("should return false for references with different names", () => {
			const ref1: Reference = { type: "reference", name: "primary-color" };
			const ref2: Reference = { type: "reference", name: "secondary-color" };
			expect(isTokenEqual(ref1, ref2)).toBe(false);
		});

		it("should return true for references with identical fallbacks", () => {
			const ref1: Reference = {
				type: "reference",
				name: "color",
				fallback: "#007bff",
			};
			const ref2: Reference = {
				type: "reference",
				name: "color",
				fallback: "#007bff",
			};
			expect(isTokenEqual(ref1, ref2)).toBe(true);
		});

		it("should return false for references with different fallbacks", () => {
			const ref1: Reference = {
				type: "reference",
				name: "color",
				fallback: "#007bff",
			};
			const ref2: Reference = {
				type: "reference",
				name: "color",
				fallback: "#ff0000",
			};
			expect(isTokenEqual(ref1, ref2)).toBe(false);
		});

		it("should return true for references with undefined fallbacks", () => {
			const ref1: Reference = {
				type: "reference",
				name: "color",
				fallback: undefined,
			};
			const ref2: Reference = {
				type: "reference",
				name: "color",
				fallback: undefined,
			};
			expect(isTokenEqual(ref1, ref2)).toBe(true);
		});

		it("should return true for references with nested reference fallbacks", () => {
			const ref1: Reference = {
				type: "reference",
				name: "color",
				fallback: { type: "reference", name: "fallback-color" },
			};
			const ref2: Reference = {
				type: "reference",
				name: "color",
				fallback: { type: "reference", name: "fallback-color" },
			};
			expect(isTokenEqual(ref1, ref2)).toBe(true);
		});

		it("should return false for references with different nested fallbacks", () => {
			const ref1: Reference = {
				type: "reference",
				name: "color",
				fallback: { type: "reference", name: "fallback-color" },
			};
			const ref2: Reference = {
				type: "reference",
				name: "color",
				fallback: { type: "reference", name: "other-fallback" },
			};
			expect(isTokenEqual(ref1, ref2)).toBe(false);
		});
	});

	describe("CSS objects", () => {
		it("should return true for identical CSS objects", () => {
			const css1: CSS = { type: "css", value: ["10px", "20px"] };
			const css2: CSS = { type: "css", value: ["10px", "20px"] };
			expect(isTokenEqual(css1, css2)).toBe(true);
		});

		it("should return false for CSS objects with different values", () => {
			const css1: CSS = { type: "css", value: ["10px", "20px"] };
			const css2: CSS = { type: "css", value: ["10px", "30px"] };
			expect(isTokenEqual(css1, css2)).toBe(false);
		});

		it("should return true for CSS objects with empty values", () => {
			const css1: CSS = { type: "css", value: [] };
			const css2: CSS = { type: "css", value: [] };
			expect(isTokenEqual(css1, css2)).toBe(true);
		});

		it("should return true for CSS objects containing references", () => {
			const css1: CSS = {
				type: "css",
				value: [{ type: "reference", name: "spacing" }, "auto"],
			};
			const css2: CSS = {
				type: "css",
				value: [{ type: "reference", name: "spacing" }, "auto"],
			};
			expect(isTokenEqual(css1, css2)).toBe(true);
		});

		it("should return false for CSS objects with different references", () => {
			const css1: CSS = {
				type: "css",
				value: [{ type: "reference", name: "spacing" }, "auto"],
			};
			const css2: CSS = {
				type: "css",
				value: [{ type: "reference", name: "other" }, "auto"],
			};
			expect(isTokenEqual(css1, css2)).toBe(false);
		});
	});

	describe("mixed type comparisons", () => {
		it("should return false for Reference vs CSS with same type value", () => {
			const ref: Reference = { type: "reference", name: "test" };
			const css: CSS = { type: "css", value: ["test"] };
			expect(isTokenEqual(ref, css)).toBe(false);
		});

		it("should return false for objects with different type properties", () => {
			const ref: Reference = { type: "reference", name: "test" };
			const css: CSS = { type: "css", value: ["test"] };
			expect(isTokenEqual(ref, css)).toBe(false);
		});
	});

	describe("same object reference", () => {
		it("should return true when comparing same object reference", () => {
			const ref: Reference = { type: "reference", name: "test" };
			expect(isTokenEqual(ref, ref)).toBe(true);
		});

		it("should return true when comparing same array reference", () => {
			const arr: TokenValue = ["a", "b", "c"];
			expect(isTokenEqual(arr, arr)).toBe(true);
		});
	});

	describe("edge cases", () => {
		it("should handle empty strings", () => {
			expect(isTokenEqual("", "")).toBe(true);
			expect(isTokenEqual("", "a")).toBe(false);
		});

		it("should handle zero values", () => {
			expect(isTokenEqual(0, 0)).toBe(true);
			expect(isTokenEqual(0, 1)).toBe(false);
		});

		it("should handle negative numbers", () => {
			expect(isTokenEqual(-1, -1)).toBe(true);
			expect(isTokenEqual(-1, 1)).toBe(false);
		});

		it("should handle decimal numbers", () => {
			expect(isTokenEqual(0.5, 0.5)).toBe(true);
			expect(isTokenEqual(0.1 + 0.2, 0.3)).toBe(false); // floating point precision
		});

		it("should handle references with empty names", () => {
			const ref1: Reference = { type: "reference", name: "" };
			const ref2: Reference = { type: "reference", name: "" };
			expect(isTokenEqual(ref1, ref2)).toBe(true);
		});

		it("should handle deeply nested fallbacks", () => {
			const ref1: Reference = {
				type: "reference",
				name: "a",
				fallback: {
					type: "reference",
					name: "b",
					fallback: {
						type: "reference",
						name: "c",
						fallback: "default",
					},
				},
			};
			const ref2: Reference = {
				type: "reference",
				name: "a",
				fallback: {
					type: "reference",
					name: "b",
					fallback: {
						type: "reference",
						name: "c",
						fallback: "default",
					},
				},
			};
			expect(isTokenEqual(ref1, ref2)).toBe(true);
		});

		it("should return false for deeply nested fallbacks with one difference", () => {
			const ref1: Reference = {
				type: "reference",
				name: "a",
				fallback: {
					type: "reference",
					name: "b",
					fallback: {
						type: "reference",
						name: "c",
						fallback: "default1",
					},
				},
			};
			const ref2: Reference = {
				type: "reference",
				name: "a",
				fallback: {
					type: "reference",
					name: "b",
					fallback: {
						type: "reference",
						name: "c",
						fallback: "default2",
					},
				},
			};
			expect(isTokenEqual(ref1, ref2)).toBe(false);
		});

		it("should return false for objects without type property", () => {
			const obj1 = { name: "test" } as unknown as TokenValue;
			const obj2 = { name: "test" } as unknown as TokenValue;
			expect(isTokenEqual(obj1, obj2)).toBe(false);
		});

		it("should return false for objects with unknown type values", () => {
			const obj1 = { type: "unknown", name: "test" } as unknown as TokenValue;
			const obj2 = { type: "unknown", name: "test" } as unknown as TokenValue;
			expect(isTokenEqual(obj1, obj2)).toBe(false);
		});
	});
});
