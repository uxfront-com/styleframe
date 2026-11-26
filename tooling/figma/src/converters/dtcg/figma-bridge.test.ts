import { describe, expect, it } from "vitest";

import type { FigmaExportVariable } from "../../types";
import {
	classifyFigmaVariable,
	dtcgColorToFigmaRgba,
	dtcgDimensionToFloat,
	dtcgDurationToFloat,
	dtcgPathToFigma,
	dtcgTypeToFigma,
	dtcgValueToFigma,
	figmaPathToDtcg,
	figmaRgbaToDtcgColor,
	figmaTypeToDtcg,
	floatToDtcgDimension,
	floatToDtcgDuration,
} from "./figma-bridge";

function fv(name: string, type: FigmaExportVariable["type"]): FigmaExportVariable {
	return { name, type, values: {} };
}

describe("dtcgTypeToFigma", () => {
	it("maps primitives to Figma types", () => {
		expect(dtcgTypeToFigma("color")).toBe("COLOR");
		expect(dtcgTypeToFigma("dimension")).toBe("FLOAT");
		expect(dtcgTypeToFigma("duration")).toBe("FLOAT");
		expect(dtcgTypeToFigma("number")).toBe("FLOAT");
		expect(dtcgTypeToFigma("fontWeight")).toBe("FLOAT");
		expect(dtcgTypeToFigma("fontFamily")).toBe("STRING");
	});

	it("falls back to STRING for composites", () => {
		expect(dtcgTypeToFigma("border")).toBe("STRING");
		expect(dtcgTypeToFigma("typography")).toBe("STRING");
	});
});

describe("figmaTypeToDtcg", () => {
	it("returns undefined for BOOLEAN and STRING (no unambiguous mapping)", () => {
		expect(figmaTypeToDtcg("BOOLEAN")).toBeUndefined();
		expect(figmaTypeToDtcg("STRING")).toBeUndefined();
	});
	it("maps COLOR and FLOAT", () => {
		expect(figmaTypeToDtcg("COLOR")).toBe("color");
		expect(figmaTypeToDtcg("FLOAT")).toBe("dimension");
	});
});

describe("classifyFigmaVariable — path-aware", () => {
	it("FLOAT under spacing/* defaults to dimension", () => {
		const out = classifyFigmaVariable(fv("spacing/small", "FLOAT"), 4);
		expect(out?.type).toBe("dimension");
		expect(out?.value).toEqual({ value: 4, unit: "px" });
	});

	it("FLOAT under duration/* is duration", () => {
		const out = classifyFigmaVariable(fv("duration/fast", "FLOAT"), 200);
		expect(out?.type).toBe("duration");
	});

	it("FLOAT under font-weight/* is fontWeight", () => {
		const out = classifyFigmaVariable(fv("font-weight/bold", "FLOAT"), 700);
		expect(out?.type).toBe("fontWeight");
	});

	it("STRING with cubic-bezier(...) value is cubicBezier", () => {
		const out = classifyFigmaVariable(
			fv("easing/ease-in-out", "STRING"),
			"cubic-bezier(0.42, 0, 0.58, 1)",
		);
		expect(out?.type).toBe("cubicBezier");
		expect(out?.value).toEqual([0.42, 0, 0.58, 1]);
	});

	it("STRING under easing/* with a keyword resolves to a cubic-bezier tuple", () => {
		const out = classifyFigmaVariable(fv("easing/ease-in", "STRING"), "ease-in");
		expect(out?.type).toBe("cubicBezier");
		expect(out?.value).toEqual([0.42, 0, 1, 1]);
	});

	it("STRING with a strokeStyle keyword classifies as strokeStyle", () => {
		const out = classifyFigmaVariable(fv("border-style/default", "STRING"), "solid");
		expect(out?.type).toBe("strokeStyle");
	});

	it("STRING under font-family/* is fontFamily", () => {
		const out = classifyFigmaVariable(fv("font-family/body", "STRING"), "Inter");
		expect(out?.type).toBe("fontFamily");
	});

	it("returns undefined for STRING values with no usable hint", () => {
		expect(classifyFigmaVariable(fv("misc/random", "STRING"), "hello")).toBeUndefined();
	});

	it("classifies a Figma RGBA shape as color", () => {
		const out = classifyFigmaVariable(fv("color/primary", "COLOR"), {
			r: 1,
			g: 0,
			b: 0,
			a: 1,
		});
		expect(out?.type).toBe("color");
	});
});

describe("color round-trip via Figma", () => {
	it("converts sRGB DTCG color to Figma RGBA", () => {
		const out = dtcgColorToFigmaRgba({
			colorSpace: "srgb",
			components: [1, 0, 0],
		});
		expect(out).toEqual({ r: 1, g: 0, b: 0, a: 1 });
	});

	it("converts wide-gamut color back to sRGB before producing RGBA", () => {
		const out = dtcgColorToFigmaRgba({
			colorSpace: "oklch",
			components: [0.7, 0, 0],
		});
		expect(out.r).toBeGreaterThan(0);
		expect(out.r).toBeLessThanOrEqual(1);
	});

	it("clamps out-of-gamut sRGB components to [0, 1]", () => {
		// oklch→sRGB conversion can produce slightly negative r due to floating-point rounding
		const out = dtcgColorToFigmaRgba({
			colorSpace: "oklch",
			components: [0.538, 0.1, 223],
		});
		expect(out.r).toBeGreaterThanOrEqual(0);
		expect(out.g).toBeGreaterThanOrEqual(0);
		expect(out.b).toBeGreaterThanOrEqual(0);
		expect(out.r).toBeLessThanOrEqual(1);
		expect(out.g).toBeLessThanOrEqual(1);
		expect(out.b).toBeLessThanOrEqual(1);
	});

	it("Figma RGBA → DTCG color emits sRGB with hex fallback", () => {
		const out = figmaRgbaToDtcgColor({ r: 1, g: 0, b: 0, a: 1 });
		expect(out.colorSpace).toBe("srgb");
		expect(out.components).toEqual([1, 0, 0]);
		expect(out.alpha).toBeUndefined();
		expect(out.hex).toBe("#ff0000");
	});

	it("preserves alpha < 1", () => {
		const out = figmaRgbaToDtcgColor({ r: 0, g: 0, b: 0, a: 0.5 });
		expect(out.alpha).toBe(0.5);
	});
});

describe("dimension and duration", () => {
	it("dtcgDimensionToFloat handles px / rem / em / %", () => {
		expect(dtcgDimensionToFloat({ value: 16, unit: "px" })).toBe(16);
		expect(dtcgDimensionToFloat({ value: 1, unit: "rem" })).toBe(16);
		expect(dtcgDimensionToFloat({ value: 1, unit: "em" })).toBe(16);
		expect(dtcgDimensionToFloat({ value: 50, unit: "%" })).toBe(50);
	});

	it("dtcgDimensionToFloat returns undefined for viewport-relative and unknown units", () => {
		expect(dtcgDimensionToFloat({ value: 100, unit: "vw" })).toBeUndefined();
		expect(dtcgDimensionToFloat({ value: 100, unit: "vh" })).toBeUndefined();
		expect(dtcgDimensionToFloat({ value: 1, unit: "xyz" })).toBeUndefined();
	});

	it("floatToDtcgDimension defaults to px", () => {
		expect(floatToDtcgDimension(16)).toEqual({ value: 16, unit: "px" });
	});

	it("dtcgDurationToFloat handles ms and s", () => {
		expect(dtcgDurationToFloat({ value: 100, unit: "ms" })).toBe(100);
		expect(dtcgDurationToFloat({ value: 0.5, unit: "s" })).toBe(500);
	});

	it("floatToDtcgDuration always returns ms", () => {
		expect(floatToDtcgDuration(100)).toEqual({ value: 100, unit: "ms" });
	});
});

describe("path conversions", () => {
	it("dot ↔ slash", () => {
		expect(dtcgPathToFigma("color.primary")).toBe("color/primary");
		expect(figmaPathToDtcg("color/primary")).toBe("color.primary");
		expect(dtcgPathToFigma("color.palette.red.500")).toBe("color/palette/red/500");
		expect(figmaPathToDtcg("a/b/c")).toBe("a.b.c");
	});
});

describe("dtcgValueToFigma", () => {
	it("converts an alias to the Figma alias shape", () => {
		expect(dtcgValueToFigma("{color.primary}", "COLOR")).toEqual({
			kind: "alias",
			id: "color/primary",
		});
	});

	it("strips .$root suffix from alias paths", () => {
		expect(dtcgValueToFigma("{spacing.$root}", "FLOAT")).toEqual({
			kind: "alias",
			id: "spacing",
		});
		expect(dtcgValueToFigma("{font-family.$root}", "STRING")).toEqual({
			kind: "alias",
			id: "font-family",
		});
	});

	it("converts color objects", () => {
		expect(dtcgValueToFigma({ colorSpace: "srgb", components: [0, 0, 0] }, "COLOR")).toEqual({
			kind: "value",
			figmaType: "COLOR",
			value: { r: 0, g: 0, b: 0, a: 1 },
		});
	});

	it("converts dimension objects to FLOAT", () => {
		expect(dtcgValueToFigma({ value: 16, unit: "px" }, "FLOAT")).toEqual({
			kind: "value",
			figmaType: "FLOAT",
			value: 16,
		});
	});

	it("converts rem dimensions using a 16px baseline", () => {
		expect(dtcgValueToFigma({ value: 1, unit: "rem" }, "FLOAT")).toEqual({
			kind: "value",
			figmaType: "FLOAT",
			value: 16,
		});
	});

	it("falls back to STRING for viewport-relative dimensions", () => {
		expect(dtcgValueToFigma({ value: 100, unit: "vw" }, "FLOAT")).toEqual({
			kind: "fallback",
			figmaType: "STRING",
			value: "100vw",
		});
		expect(dtcgValueToFigma({ value: 100, unit: "vh" }, "FLOAT")).toEqual({
			kind: "fallback",
			figmaType: "STRING",
			value: "100vh",
		});
	});

	it("converts duration objects to FLOAT in milliseconds", () => {
		expect(dtcgValueToFigma({ value: 250, unit: "ms" }, "FLOAT")).toEqual({
			kind: "value",
			figmaType: "FLOAT",
			value: 250,
		});
		expect(dtcgValueToFigma({ value: 0.5, unit: "s" }, "FLOAT")).toEqual({
			kind: "value",
			figmaType: "FLOAT",
			value: 500,
		});
	});

	it("falls back to STRING for BOOLEAN type", () => {
		expect(dtcgValueToFigma(true, "BOOLEAN")).toEqual({
			kind: "fallback",
			figmaType: "STRING",
			value: "true",
		});
	});

	it("stringifies non-string values for STRING type", () => {
		expect(dtcgValueToFigma(["Inter", "sans-serif"], "STRING")).toEqual({
			kind: "value",
			figmaType: "STRING",
			value: JSON.stringify(["Inter", "sans-serif"]),
		});
	});
});
