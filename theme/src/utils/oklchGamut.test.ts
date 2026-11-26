import { describe, expect, it } from "vitest";

import {
	computeLightnessColor,
	computeRelativeColor,
	findMaxChroma,
	formatOklch,
	parseOklch,
} from "./oklchGamut";

describe("oklchGamut", () => {
	describe("parseOklch", () => {
		it("should parse hex color strings", () => {
			const result = parseOklch("#007bff");
			expect(result).toBeDefined();
			expect(result!.l).toBeCloseTo(0.57, 1);
			expect(result!.c).toBeGreaterThan(0);
			expect(result!.h).toBeGreaterThan(0);
			expect(result!.alpha).toBe(1);
		});

		it("should parse oklch CSS strings", () => {
			const result = parseOklch("oklch(0.5 0.19 258.8 / 1)");
			expect(result).toBeDefined();
			expect(result!.l).toBeCloseTo(0.5, 2);
			expect(result!.c).toBeCloseTo(0.19, 2);
			expect(result!.h).toBeCloseTo(258.8, 1);
			expect(result!.alpha).toBe(1);
		});

		it("should parse oklch without alpha", () => {
			const result = parseOklch("oklch(0.5 0.19 258.8)");
			expect(result).toBeDefined();
			expect(result!.alpha).toBe(1);
		});

		it("should handle black (achromatic, no hue)", () => {
			const result = parseOklch("#000000");
			expect(result).toBeDefined();
			expect(result!.l).toBeCloseTo(0, 2);
			expect(result!.c).toBeCloseTo(0, 3);
		});

		it("should handle white (achromatic, no hue)", () => {
			const result = parseOklch("#ffffff");
			expect(result).toBeDefined();
			expect(result!.l).toBeCloseTo(1, 2);
			expect(result!.c).toBeCloseTo(0, 3);
		});

		it("should return undefined for invalid strings", () => {
			expect(parseOklch("not-a-color")).toBeUndefined();
		});
	});

	describe("findMaxChroma", () => {
		it("should return near-zero for L=0 (black)", () => {
			expect(findMaxChroma(0, 240)).toBeLessThan(0.05);
		});

		it("should return near-zero for L=1 (white)", () => {
			expect(findMaxChroma(1, 240)).toBeLessThan(0.05);
		});

		it("should return positive chroma for mid-range lightness", () => {
			const maxC = findMaxChroma(0.5, 240);
			expect(maxC).toBeGreaterThan(0.05);
		});

		it("should vary by hue", () => {
			const maxBlue = findMaxChroma(0.5, 260);
			const maxYellow = findMaxChroma(0.5, 100);
			// Different hues have different gamut boundaries
			expect(maxBlue).not.toBeCloseTo(maxYellow, 2);
		});
	});

	describe("computeLightnessColor", () => {
		it("should produce a valid oklch string", () => {
			const result = computeLightnessColor(0.55, 0.15, 240, 1, 0.93);
			expect(result).toMatch(/^oklch\(.+ .+ .+ \/ .+\)$/);
		});

		it("should keep achromatic colors achromatic", () => {
			const result = computeLightnessColor(0.5, 0, 0, 1, 0.93);
			expect(result).toContain(" 0 ");
		});

		it("should reduce chroma at extreme lightness levels", () => {
			const baseL = 0.55;
			const baseC = 0.15;
			const baseH = 240;

			const lightResult = computeLightnessColor(baseL, baseC, baseH, 1, 0.97);
			const midResult = computeLightnessColor(baseL, baseC, baseH, 1, 0.55);

			// Extract chroma from the oklch strings
			const lightC = Number.parseFloat(lightResult.split(" ")[1] ?? "0");
			const midC = Number.parseFloat(midResult.split(" ")[1] ?? "0");

			// Light tints should have less chroma than mid-range
			expect(lightC).toBeLessThan(midC);
		});

		it("should preserve alpha", () => {
			const result = computeLightnessColor(0.55, 0.15, 240, 0.5, 0.93);
			expect(result).toContain("/ 0.5");
		});

		it("should work with known color #007bff at various lightness targets", () => {
			const parsed = parseOklch("#007bff")!;

			// Light tint
			const light = computeLightnessColor(parsed.l, parsed.c, parsed.h, parsed.alpha, 0.93);
			expect(light).toMatch(/^oklch\(/);

			// Dark shade
			const dark = computeLightnessColor(parsed.l, parsed.c, parsed.h, parsed.alpha, 0.17);
			expect(dark).toMatch(/^oklch\(/);
		});
	});

	describe("computeRelativeColor", () => {
		it("should produce a lighter color with positive offset", () => {
			const base = parseOklch("#007bff")!;
			const result = computeRelativeColor(base.l, base.c, base.h, base.alpha, 0.1);
			const resultL = Number.parseFloat(result.match(/oklch\(([0-9.]+)/)?.[1] ?? "0");
			expect(resultL).toBeGreaterThan(base.l);
		});

		it("should produce a darker color with negative offset", () => {
			const base = parseOklch("#007bff")!;
			const result = computeRelativeColor(base.l, base.c, base.h, base.alpha, -0.1);
			const resultL = Number.parseFloat(result.match(/oklch\(([0-9.]+)/)?.[1] ?? "0");
			expect(resultL).toBeLessThan(base.l);
		});

		it("should clamp lightness to 0", () => {
			const result = computeRelativeColor(0.1, 0.15, 240, 1, -0.5);
			const resultL = Number.parseFloat(result.match(/oklch\(([0-9.]+)/)?.[1] ?? "-1");
			expect(resultL).toBe(0);
		});

		it("should clamp lightness to 1", () => {
			const result = computeRelativeColor(0.9, 0.15, 240, 1, 0.5);
			const resultL = Number.parseFloat(result.match(/oklch\(([0-9.]+)/)?.[1] ?? "-1");
			expect(resultL).toBe(1);
		});
	});

	describe("formatOklch", () => {
		it("should format with consistent precision", () => {
			const result = formatOklch(0.93, 0.045, 240.93, 1);
			expect(result).toBe("oklch(0.93 0.045 240.93 / 1)");
		});

		it("should trim trailing zeros", () => {
			const result = formatOklch(0.5, 0.1, 240, 1);
			expect(result).toBe("oklch(0.5 0.1 240 / 1)");
		});
	});
});
