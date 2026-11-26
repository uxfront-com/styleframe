import { describe, expect, it } from "vitest";
import { classifyValue } from "../../src/classify/classify";

describe("classifyValue — value detection", () => {
	it("classifies hex colors", () => {
		const out = classifyValue("#ff0000");
		expect(out?.type).toBe("color");
		expect((out!.value as { colorSpace: string }).colorSpace).toBe("srgb");
	});

	it("classifies rgb / hsl / oklch / named colors", () => {
		expect(classifyValue("rgb(255, 0, 0)")?.type).toBe("color");
		expect(classifyValue("hsl(120, 50%, 50%)")?.type).toBe("color");
		expect(classifyValue("oklch(0.7 0.15 30)")?.type).toBe("color");
		expect(classifyValue("red")?.type).toBe("color");
	});

	it("classifies cubic-bezier strings", () => {
		const out = classifyValue("cubic-bezier(0.42, 0, 0.58, 1)");
		expect(out?.type).toBe("cubicBezier");
		expect(out?.value).toEqual([0.42, 0, 0.58, 1]);
	});

	it("classifies duration strings before dimension", () => {
		const out = classifyValue("200ms");
		expect(out?.type).toBe("duration");
		expect(out?.value).toEqual({ value: 200, unit: "ms" });
	});

	it("classifies dimension strings", () => {
		expect(classifyValue("16px")).toEqual({
			type: "dimension",
			value: { value: 16, unit: "px" },
		});
		expect(classifyValue("1.5rem")?.type).toBe("dimension");
	});

	it("classifies stroke-style keywords", () => {
		expect(classifyValue("solid")).toEqual({
			type: "strokeStyle",
			value: "solid",
		});
		expect(classifyValue("dashed")?.type).toBe("strokeStyle");
	});

	it("classifies font-weight keywords", () => {
		expect(classifyValue("bold")).toEqual({
			type: "fontWeight",
			value: "bold",
		});
		expect(classifyValue("regular")?.type).toBe("fontWeight");
	});

	it("classifies bare numbers as `number` without a path hint", () => {
		expect(classifyValue(42)).toEqual({ type: "number", value: 42 });
	});

	it("classifies canonical color objects", () => {
		const out = classifyValue({ colorSpace: "srgb", components: [1, 0, 0] });
		expect(out?.type).toBe("color");
	});

	it("classifies canonical dimension objects", () => {
		const out = classifyValue({ value: 16, unit: "px" });
		expect(out?.type).toBe("dimension");
	});

	it("returns undefined for aliases", () => {
		expect(classifyValue("{color.primary}")).toBeUndefined();
	});

	it("returns undefined for empty/null/undefined/booleans", () => {
		expect(classifyValue("")).toBeUndefined();
		expect(classifyValue(null)).toBeUndefined();
		expect(classifyValue(undefined)).toBeUndefined();
		expect(classifyValue(true)).toBeUndefined();
		expect(classifyValue(false)).toBeUndefined();
	});

	it("returns undefined for unrecognised strings without a path hint", () => {
		expect(classifyValue("frosted")).toBeUndefined();
	});

	it("does NOT misclassify plain numeric strings as colors (culori #XXX bug)", () => {
		// culori.parse("100") → {mode:"rgb",...} because "100" looks like shorthand hex #100
		expect(classifyValue("100")).toBeUndefined();
		expect(classifyValue("200")).toBeUndefined();
		expect(classifyValue("1000")).toBeUndefined();
	});

	it("still classifies explicit hex strings as colors", () => {
		// "#100" must still work — only bare numerics are excluded
		expect(classifyValue("#100")?.type).toBe("color");
	});
});

describe("classifyValue — path tiebreaker for numbers", () => {
	it("treats number under duration/* as duration", () => {
		expect(classifyValue(200, { path: "duration.fast" })?.type).toBe(
			"duration",
		);
		expect(classifyValue(200, { path: "duration/fast" })?.type).toBe(
			"duration",
		);
	});

	it("treats number under font-weight/* as fontWeight", () => {
		const out = classifyValue(700, { path: "font-weight.bold" });
		expect(out?.type).toBe("fontWeight");
	});

	it("treats number under line-height/* as number", () => {
		expect(classifyValue(1.5, { path: "line-height.normal" })?.type).toBe(
			"number",
		);
	});

	it("falls back to number when no path hint matches", () => {
		expect(classifyValue(42, { path: "spacing.foo" })?.type).toBe("number");
	});
});

describe("classifyValue — path tiebreaker for strings", () => {
	it("treats easing keywords as cubicBezier under easing/*", () => {
		const out = classifyValue("ease-in", { path: "easing.ease-in" });
		expect(out?.type).toBe("cubicBezier");
		expect(out?.value).toEqual([0.42, 0, 1, 1]);
	});

	it("treats unknown easing keywords without path as undefined", () => {
		expect(classifyValue("ease-in")).toBeUndefined();
	});

	it("treats string under font-family/* as fontFamily", () => {
		const out = classifyValue("Inter", { path: "font-family.body" });
		expect(out?.type).toBe("fontFamily");
		expect(out?.value).toBe("Inter");
	});

	it("treats numeric string under font-weight/* as fontWeight number", () => {
		const out = classifyValue("700", { path: "font-weight.bold" });
		expect(out?.type).toBe("fontWeight");
		expect(out?.value).toBe(700);
	});

	it("treats border-style/* with a stroke-style keyword as strokeStyle", () => {
		const out = classifyValue("solid", { path: "border-style.default" });
		expect(out?.type).toBe("strokeStyle");
	});
});

describe("classifyValue — disambiguation cases", () => {
	it("does NOT misclassify font-family strings as strokeStyle", () => {
		// Edge case: 'inset' is both a stroke-style keyword and could be in
		// other contexts. We only treat it as strokeStyle when path doesn't
		// signal font-family.
		const out = classifyValue("solid", { path: "font-family.weird" });
		expect(out?.type).toBe("fontFamily");
	});

	it("prioritises explicit value detection over path inference", () => {
		// Even if path says easing, a real cubic-bezier string parses correctly.
		const out = classifyValue("cubic-bezier(0.1, 0.2, 0.3, 0.4)", {
			path: "easing.weird",
		});
		expect(out?.type).toBe("cubicBezier");
		expect(out?.value).toEqual([0.1, 0.2, 0.3, 0.4]);
	});
});

describe("classifyValue — keyword-classification ambiguity", () => {
	it("does NOT classify 'normal' as fontWeight under letter-spacing/*", () => {
		expect(
			classifyValue("normal", { path: "letter-spacing.normal" }),
		).toBeUndefined();
	});

	it("does NOT classify 'normal' as fontWeight under font-style/*", () => {
		expect(
			classifyValue("normal", { path: "font-style.normal" }),
		).toBeUndefined();
	});

	it("does NOT classify 'thin' as fontWeight under border-width/*", () => {
		expect(
			classifyValue("thin", { path: "border-width.thin" }),
		).toBeUndefined();
	});

	it("does NOT classify 'medium' as fontWeight under border-width/*", () => {
		expect(
			classifyValue("medium", { path: "border-width.medium" }),
		).toBeUndefined();
	});

	it("DOES classify 'normal' as fontWeight under font-weight/*", () => {
		const out = classifyValue("normal", { path: "font-weight.normal" });
		expect(out?.type).toBe("fontWeight");
	});

	it("DOES classify 'bold' as fontWeight under dt.font-weight", () => {
		const out = classifyValue("bold", { path: "dt.font-weight" });
		expect(out?.type).toBe("fontWeight");
	});

	it("returns undefined for 'italic' (no DTCG type for font-style)", () => {
		expect(
			classifyValue("italic", { path: "font-style.italic" }),
		).toBeUndefined();
	});

	it("DOES classify stroke-style keyword 'solid' under border-style/*", () => {
		const out = classifyValue("solid", { path: "border-style.solid" });
		expect(out?.type).toBe("strokeStyle");
	});

	it("does NOT classify 'inset' as strokeStyle under unrelated paths", () => {
		expect(
			classifyValue("inset", { path: "shadow.elevation" }),
		).toBeUndefined();
	});

	it("preserves no-path back-compat: keyword still wins without context", () => {
		expect(classifyValue("bold")?.type).toBe("fontWeight");
		expect(classifyValue("solid")?.type).toBe("strokeStyle");
	});
});
