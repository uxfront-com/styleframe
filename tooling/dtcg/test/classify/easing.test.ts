import { describe, expect, it } from "vitest";

import { easingKeywordToBezier, isEasingKeyword } from "../../src/classify/easing";

describe("easingKeywordToBezier", () => {
	it("maps the five spec keywords", () => {
		expect(easingKeywordToBezier("linear")).toEqual([0, 0, 1, 1]);
		expect(easingKeywordToBezier("ease")).toEqual([0.25, 0.1, 0.25, 1]);
		expect(easingKeywordToBezier("ease-in")).toEqual([0.42, 0, 1, 1]);
		expect(easingKeywordToBezier("ease-out")).toEqual([0, 0, 0.58, 1]);
		expect(easingKeywordToBezier("ease-in-out")).toEqual([0.42, 0, 0.58, 1]);
	});

	it("is case-insensitive and trims", () => {
		expect(easingKeywordToBezier("  EASE-IN  ")).toEqual([0.42, 0, 1, 1]);
	});

	it("returns undefined for unknown keywords", () => {
		expect(easingKeywordToBezier("ease-in-sine")).toBeUndefined();
		expect(easingKeywordToBezier("bounce")).toBeUndefined();
		expect(easingKeywordToBezier("")).toBeUndefined();
	});
});

describe("isEasingKeyword", () => {
	it("returns true for spec keywords", () => {
		expect(isEasingKeyword("linear")).toBe(true);
		expect(isEasingKeyword("EASE")).toBe(true);
	});

	it("returns false for non-keywords", () => {
		expect(isEasingKeyword("cubic-bezier(0,0,1,1)")).toBe(false);
		expect(isEasingKeyword("spring")).toBe(false);
	});
});
