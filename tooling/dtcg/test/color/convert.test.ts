import { describe, expect, it } from "vitest";

import { convert } from "../../src/color/convert";

describe("color.convert", () => {
	it("returns the same object when target equals source", () => {
		const c = { colorSpace: "srgb", components: [1, 0, 0] } as const;
		const out = convert(c, "srgb");
		expect(out).toBe(c);
	});

	it("converts sRGB → HSL with 0-100 scaling", () => {
		const out = convert({ colorSpace: "srgb", components: [1, 0, 0] }, "hsl");
		expect(out.colorSpace).toBe("hsl");
		expect(out.components[0]).toBeCloseTo(0); // hue
		expect(out.components[1]).toBeCloseTo(100); // saturation
		expect(out.components[2]).toBeCloseTo(50); // lightness
	});

	it("converts sRGB → oklch", () => {
		const out = convert({ colorSpace: "srgb", components: [1, 0, 0] }, "oklch");
		expect(out.colorSpace).toBe("oklch");
		expect(out.components[0]).toBeGreaterThan(0);
		expect(out.components[0]).toBeLessThan(1);
	});

	it("converts oklch → display-p3", () => {
		const out = convert({ colorSpace: "oklch", components: [0.7, 0.2, 0] }, "display-p3");
		expect(out.colorSpace).toBe("display-p3");
	});

	it("converts sRGB → xyz-d65", () => {
		const out = convert({ colorSpace: "srgb", components: [1, 1, 1] }, "xyz-d65");
		expect(out.colorSpace).toBe("xyz-d65");
		// White in xyz-d65 is approximately (0.95, 1.00, 1.09)
		expect(out.components[1]).toBeCloseTo(1, 1);
	});

	it("preserves alpha across conversions", () => {
		const out = convert({ colorSpace: "srgb", components: [1, 0, 0], alpha: 0.5 }, "oklch");
		expect(out.alpha).toBeCloseTo(0.5);
	});
});
