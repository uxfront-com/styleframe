import { describe, expect, it } from "vitest";
import {
	isBorderValue,
	isColorSpace,
	isColorValue,
	isCubicBezierValue,
	isDimensionValue,
	isDurationValue,
	isFontFamilyValue,
	isFontWeightValue,
	isGradientValue,
	isShadowLayer,
	isShadowValue,
	isStrokeStyleValue,
	isTransitionValue,
	isTypographyValue,
} from "../../src/guards/values";

describe("isColorSpace", () => {
	it("accepts every spec colorSpace", () => {
		const spaces = [
			"srgb",
			"srgb-linear",
			"hsl",
			"hwb",
			"lab",
			"lch",
			"oklab",
			"oklch",
			"display-p3",
			"a98-rgb",
			"prophoto-rgb",
			"rec2020",
			"xyz-d50",
			"xyz-d65",
		];
		for (const s of spaces) {
			expect(isColorSpace(s)).toBe(true);
		}
	});

	it("rejects unknown spaces", () => {
		expect(isColorSpace("rgba")).toBe(false);
		expect(isColorSpace("xyz")).toBe(false);
		expect(isColorSpace("")).toBe(false);
	});
});

describe("isColorValue", () => {
	it("accepts a minimal sRGB color", () => {
		expect(isColorValue({ colorSpace: "srgb", components: [1, 0, 0] })).toBe(
			true,
		);
	});

	it("accepts a color with alpha and hex", () => {
		expect(
			isColorValue({
				colorSpace: "srgb",
				components: [0, 0, 0],
				alpha: 0.5,
				hex: "#000000",
			}),
		).toBe(true);
	});

	it("accepts the `none` keyword in components", () => {
		expect(
			isColorValue({ colorSpace: "hsl", components: ["none", 0, 100] }),
		).toBe(true);
	});

	it("rejects out-of-range alpha", () => {
		expect(
			isColorValue({ colorSpace: "srgb", components: [1, 0, 0], alpha: 1.5 }),
		).toBe(false);
		expect(
			isColorValue({ colorSpace: "srgb", components: [1, 0, 0], alpha: -0.1 }),
		).toBe(false);
	});

	it("rejects components arrays of wrong length", () => {
		expect(isColorValue({ colorSpace: "srgb", components: [1, 0] })).toBe(
			false,
		);
		expect(isColorValue({ colorSpace: "srgb", components: [1, 0, 0, 1] })).toBe(
			false,
		);
	});

	it("rejects unknown colorSpace", () => {
		expect(isColorValue({ colorSpace: "rgba", components: [1, 0, 0] })).toBe(
			false,
		);
	});
});

describe("isDimensionValue", () => {
	it("accepts {value, unit}", () => {
		expect(isDimensionValue({ value: 16, unit: "px" })).toBe(true);
		expect(isDimensionValue({ value: 1.5, unit: "rem" })).toBe(true);
		expect(isDimensionValue({ value: 100, unit: "%" })).toBe(true);
	});

	it("rejects strings, numbers, missing fields", () => {
		expect(isDimensionValue("16px")).toBe(false);
		expect(isDimensionValue(16)).toBe(false);
		expect(isDimensionValue({ value: 16 })).toBe(false);
		expect(isDimensionValue({ unit: "px" })).toBe(false);
	});

	it("rejects non-finite values", () => {
		expect(isDimensionValue({ value: Number.NaN, unit: "px" })).toBe(false);
		expect(
			isDimensionValue({ value: Number.POSITIVE_INFINITY, unit: "px" }),
		).toBe(false);
	});
});

describe("isDurationValue", () => {
	it("accepts ms and s units", () => {
		expect(isDurationValue({ value: 100, unit: "ms" })).toBe(true);
		expect(isDurationValue({ value: 0.5, unit: "s" })).toBe(true);
	});

	it("rejects other units", () => {
		expect(isDurationValue({ value: 100, unit: "us" })).toBe(false);
		expect(isDurationValue({ value: 100, unit: "px" })).toBe(false);
	});
});

describe("isCubicBezierValue", () => {
	it("accepts a 4-tuple of numbers", () => {
		expect(isCubicBezierValue([0.42, 0, 0.58, 1])).toBe(true);
		expect(isCubicBezierValue([0, 0, 1, 1])).toBe(true);
	});

	it("rejects wrong length or non-numbers", () => {
		expect(isCubicBezierValue([0, 0, 1])).toBe(false);
		expect(isCubicBezierValue([0, 0, 1, 1, 0])).toBe(false);
		expect(isCubicBezierValue([0, 0, "1", 1])).toBe(false);
	});
});

describe("isFontFamilyValue", () => {
	it("accepts string and string[]", () => {
		expect(isFontFamilyValue("Inter")).toBe(true);
		expect(isFontFamilyValue(["Inter", "Helvetica", "sans-serif"])).toBe(true);
	});

	it("rejects mixed arrays", () => {
		expect(isFontFamilyValue(["Inter", 42])).toBe(false);
	});
});

describe("isFontWeightValue", () => {
	it("accepts numbers", () => {
		expect(isFontWeightValue(400)).toBe(true);
		expect(isFontWeightValue(700)).toBe(true);
	});

	it("accepts spec keywords", () => {
		expect(isFontWeightValue("bold")).toBe(true);
		expect(isFontWeightValue("regular")).toBe(true);
		expect(isFontWeightValue("extra-light")).toBe(true);
	});

	it("rejects unknown keywords", () => {
		expect(isFontWeightValue("super-bold")).toBe(false);
	});
});

describe("isStrokeStyleValue", () => {
	it("accepts keywords", () => {
		expect(isStrokeStyleValue("solid")).toBe(true);
		expect(isStrokeStyleValue("dashed")).toBe(true);
	});

	it("accepts dash-array objects", () => {
		expect(
			isStrokeStyleValue({
				dashArray: [
					{ value: 5, unit: "px" },
					{ value: 2, unit: "px" },
				],
				lineCap: "round",
			}),
		).toBe(true);
	});

	it("accepts aliases inside dashArray", () => {
		expect(
			isStrokeStyleValue({
				dashArray: ["{spacing.dash}", { value: 2, unit: "px" }],
				lineCap: "butt",
			}),
		).toBe(true);
	});

	it("rejects unknown lineCap", () => {
		expect(
			isStrokeStyleValue({
				dashArray: [{ value: 1, unit: "px" }],
				lineCap: "wave",
			}),
		).toBe(false);
	});
});

describe("isBorderValue", () => {
	it("accepts a complete border", () => {
		expect(
			isBorderValue({
				color: { colorSpace: "srgb", components: [0, 0, 0] },
				width: { value: 1, unit: "px" },
				style: "solid",
			}),
		).toBe(true);
	});

	it("accepts aliases for any field", () => {
		expect(
			isBorderValue({
				color: "{color.border}",
				width: "{width.thin}",
				style: "{style.solid}",
			}),
		).toBe(true);
	});

	it("rejects missing fields", () => {
		expect(
			isBorderValue({
				color: { colorSpace: "srgb", components: [0, 0, 0] },
				width: { value: 1, unit: "px" },
			}),
		).toBe(false);
	});
});

describe("isTransitionValue", () => {
	it("accepts duration + timingFunction", () => {
		expect(
			isTransitionValue({
				duration: { value: 200, unit: "ms" },
				timingFunction: [0.25, 0.1, 0.25, 1],
			}),
		).toBe(true);
	});

	it("accepts an optional delay", () => {
		expect(
			isTransitionValue({
				duration: { value: 200, unit: "ms" },
				delay: { value: 50, unit: "ms" },
				timingFunction: [0, 0, 1, 1],
			}),
		).toBe(true);
	});
});

describe("isShadowValue", () => {
	it("accepts a single layer", () => {
		expect(
			isShadowLayer({
				color: { colorSpace: "srgb", components: [0, 0, 0], alpha: 0.2 },
				offsetX: { value: 0, unit: "px" },
				offsetY: { value: 4, unit: "px" },
				blur: { value: 12, unit: "px" },
			}),
		).toBe(true);
	});

	it("accepts an array of layers", () => {
		expect(
			isShadowValue([
				{
					color: { colorSpace: "srgb", components: [0, 0, 0] },
					offsetX: { value: 0, unit: "px" },
					offsetY: { value: 1, unit: "px" },
				},
				{
					color: { colorSpace: "srgb", components: [0, 0, 0] },
					offsetX: { value: 0, unit: "px" },
					offsetY: { value: 4, unit: "px" },
					blur: { value: 8, unit: "px" },
					inset: true,
				},
			]),
		).toBe(true);
	});

	it("rejects empty arrays", () => {
		expect(isShadowValue([])).toBe(false);
	});
});

describe("isGradientValue", () => {
	it("accepts an array of stops", () => {
		expect(
			isGradientValue([
				{ color: { colorSpace: "srgb", components: [1, 0, 0] }, position: 0 },
				{ color: { colorSpace: "srgb", components: [0, 0, 1] }, position: 1 },
			]),
		).toBe(true);
	});

	it("accepts stops without position", () => {
		expect(
			isGradientValue([
				{ color: { colorSpace: "srgb", components: [1, 0, 0] } },
				{ color: { colorSpace: "srgb", components: [0, 0, 1] } },
			]),
		).toBe(true);
	});

	it("rejects non-arrays", () => {
		expect(isGradientValue({})).toBe(false);
	});
});

describe("isTypographyValue", () => {
	it("accepts a complete typography token", () => {
		expect(
			isTypographyValue({
				fontFamily: ["Inter", "sans-serif"],
				fontSize: { value: 16, unit: "px" },
				fontWeight: 400,
				lineHeight: 1.5,
				letterSpacing: { value: 0, unit: "em" },
			}),
		).toBe(true);
	});

	it("accepts aliases everywhere", () => {
		expect(
			isTypographyValue({
				fontFamily: "{font.body}",
				fontSize: "{size.base}",
				fontWeight: "{weight.regular}",
				lineHeight: "{lh.normal}",
			}),
		).toBe(true);
	});

	it("rejects when fontFamily missing", () => {
		expect(isTypographyValue({ fontSize: { value: 16, unit: "px" } })).toBe(
			false,
		);
	});
});
