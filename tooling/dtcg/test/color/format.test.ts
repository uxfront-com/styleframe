import { describe, expect, it } from "vitest";

import { format } from "../../src/color/format";

describe("color.format", () => {
	it("formats sRGB without alpha as a hex string", () => {
		expect(format({ colorSpace: "srgb", components: [1, 0, 0] })).toBe("#ff0000");
		expect(format({ colorSpace: "srgb", components: [0, 1, 0] })).toBe("#00ff00");
	});

	it("formats sRGB with alpha as 8-digit hex", () => {
		const out = format({
			colorSpace: "srgb",
			components: [0, 0, 0],
			alpha: 0.5,
		});
		expect(out.startsWith("#000000")).toBe(true);
		expect(out.length).toBe(9);
	});

	it("prefers a precomputed hex when present", () => {
		expect(format({ colorSpace: "srgb", components: [1, 0, 0], hex: "#FF0000" })).toBe("#FF0000");
	});

	it("formats HSL via color() syntax", () => {
		const out = format({ colorSpace: "hsl", components: [120, 50, 50] });
		expect(out.startsWith("hsl(")).toBe(true);
	});

	it("formats oklch", () => {
		const out = format({ colorSpace: "oklch", components: [0.7, 0.15, 30] });
		expect(out.startsWith("oklch(")).toBe(true);
	});

	it("formats display-p3", () => {
		const out = format({ colorSpace: "display-p3", components: [1, 0, 0] });
		expect(out).toMatch(/color\(display-p3/);
	});
});
