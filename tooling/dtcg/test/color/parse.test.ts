import { describe, expect, it } from "vitest";

import { parse } from "../../src/color/parse";

describe("color.parse", () => {
	it("parses a 6-digit hex into sRGB", () => {
		const c = parse("#ff0000");
		expect(c?.colorSpace).toBe("srgb");
		expect(c?.components[0]).toBeCloseTo(1);
		expect(c?.components[1]).toBeCloseTo(0);
		expect(c?.components[2]).toBeCloseTo(0);
		expect(c?.alpha).toBeUndefined();
	});

	it("parses an 8-digit hex with alpha", () => {
		const c = parse("#00000080");
		expect(c?.colorSpace).toBe("srgb");
		expect(c?.alpha).toBeCloseTo(128 / 255, 3);
	});

	it("parses rgb()", () => {
		const c = parse("rgb(255, 128, 64)");
		expect(c?.colorSpace).toBe("srgb");
		expect(c?.components[0]).toBeCloseTo(1);
		expect(c?.components[1]).toBeCloseTo(128 / 255);
		expect(c?.components[2]).toBeCloseTo(64 / 255);
	});

	it("parses hsl() into HSL with 0-100 scaling", () => {
		const c = parse("hsl(120, 50%, 50%)");
		expect(c?.colorSpace).toBe("hsl");
		expect(c?.components[0]).toBeCloseTo(120);
		expect(c?.components[1]).toBeCloseTo(50);
		expect(c?.components[2]).toBeCloseTo(50);
	});

	it("parses oklch() with native ranges", () => {
		const c = parse("oklch(0.7 0.15 30)");
		expect(c?.colorSpace).toBe("oklch");
		expect(c?.components[0]).toBeCloseTo(0.7);
		expect(c?.components[1]).toBeCloseTo(0.15);
		expect(c?.components[2]).toBeCloseTo(30);
	});

	it("parses lab()", () => {
		const c = parse("lab(50% 20 -30)");
		expect(c?.colorSpace).toBe("lab");
		expect(c?.components[0]).toBeCloseTo(50);
		expect(c?.components[1]).toBeCloseTo(20);
		expect(c?.components[2]).toBeCloseTo(-30);
	});

	it("parses named colors", () => {
		const c = parse("red");
		expect(c?.colorSpace).toBe("srgb");
		expect(c?.components[0]).toBeCloseTo(1);
	});

	it("parses display-p3 via color() syntax", () => {
		const c = parse("color(display-p3 1 0 0)");
		expect(c?.colorSpace).toBe("display-p3");
		expect(c?.components[0]).toBeCloseTo(1);
	});

	it("returns undefined for invalid input", () => {
		expect(parse("not-a-color")).toBeUndefined();
		expect(parse("")).toBeUndefined();
	});
});
