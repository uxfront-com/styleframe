import { describe, expect, it } from "vitest";

import { parseCubicBezier } from "../../src/classify/cubic-bezier";

describe("parseCubicBezier", () => {
	it("parses canonical cubic-bezier strings", () => {
		expect(parseCubicBezier("cubic-bezier(0.42, 0, 0.58, 1)")).toEqual([0.42, 0, 0.58, 1]);
		expect(parseCubicBezier("cubic-bezier(0, 0, 1, 1)")).toEqual([0, 0, 1, 1]);
	});

	it("tolerates whitespace and case", () => {
		expect(parseCubicBezier("  CUBIC-BEZIER(0.25,0.1,0.25,1)  ")).toEqual([0.25, 0.1, 0.25, 1]);
	});

	it("supports negative and >1 y-values", () => {
		expect(parseCubicBezier("cubic-bezier(0.5, -0.5, 0.5, 1.5)")).toEqual([0.5, -0.5, 0.5, 1.5]);
	});

	it("returns undefined for invalid input", () => {
		expect(parseCubicBezier("ease-in")).toBeUndefined();
		expect(parseCubicBezier("cubic-bezier(0, 0, 1)")).toBeUndefined();
		expect(parseCubicBezier("cubic-bezier(a, b, c, d)")).toBeUndefined();
		expect(parseCubicBezier("")).toBeUndefined();
	});
});
