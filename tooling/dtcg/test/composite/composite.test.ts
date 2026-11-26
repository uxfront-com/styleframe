import { describe, expect, it } from "vitest";

import { border, gradient, shadow, strokeStyle, transition, typography } from "../../src/composite";

describe("composite.border", () => {
	it("accepts the canonical object form", () => {
		const value = {
			color: { colorSpace: "srgb", components: [0, 0, 0] },
			width: { value: 1, unit: "px" },
			style: "solid",
		} as const;
		expect(border.parse(value)).toEqual(value);
	});

	it("accepts aliases for any field", () => {
		const value = {
			color: "{c}",
			width: "{w}",
			style: "{s}",
		} as const;
		expect(border.parse(value)).toEqual(value);
	});

	it("rejects missing fields", () => {
		expect(border.parse({ color: "{c}", width: "{w}" })).toBeUndefined();
	});
});

describe("composite.strokeStyle", () => {
	it("accepts keywords", () => {
		expect(strokeStyle.parse("solid")).toBe("solid");
	});

	it("accepts dash-array objects", () => {
		const value = {
			dashArray: [{ value: 5, unit: "px" }],
			lineCap: "round" as const,
		};
		expect(strokeStyle.parse(value)).toEqual(value);
	});

	it("formats as a keyword or JSON", () => {
		expect(strokeStyle.format("dashed")).toBe("dashed");
		const obj = {
			dashArray: [{ value: 1, unit: "px" }],
			lineCap: "butt" as const,
		};
		expect(strokeStyle.format(obj)).toBe(JSON.stringify(obj));
	});
});

describe("composite.transition", () => {
	it("accepts duration + timingFunction", () => {
		const value = {
			duration: { value: 200, unit: "ms" },
			timingFunction: [0.25, 0.1, 0.25, 1],
		} as const;
		expect(transition.parse(value)).toBeDefined();
	});

	it("accepts an optional delay", () => {
		const value = {
			duration: { value: 200, unit: "ms" },
			delay: { value: 50, unit: "ms" },
			timingFunction: [0, 0, 1, 1],
		} as const;
		expect(transition.parse(value)).toBeDefined();
	});
});

describe("composite.shadow", () => {
	it("accepts a single layer", () => {
		const layer = {
			color: { colorSpace: "srgb", components: [0, 0, 0] },
			offsetX: { value: 0, unit: "px" },
			offsetY: { value: 4, unit: "px" },
		} as const;
		expect(shadow.parse(layer)).toBeDefined();
	});

	it("accepts an array of layers", () => {
		const value = [
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
		] as const;
		expect(shadow.parse(value)).toBeDefined();
	});
});

describe("composite.gradient", () => {
	it("accepts an array of stops", () => {
		const value = [
			{ color: { colorSpace: "srgb", components: [1, 0, 0] }, position: 0 },
			{ color: { colorSpace: "srgb", components: [0, 0, 1] }, position: 1 },
		] as const;
		expect(gradient.parse(value)).toBeDefined();
	});
});

describe("composite.typography", () => {
	it("accepts a complete typography token", () => {
		const value = {
			fontFamily: ["Inter", "sans-serif"],
			fontSize: { value: 16, unit: "px" },
			fontWeight: 400,
			lineHeight: 1.5,
		} as const;
		expect(typography.parse(value)).toBeDefined();
	});

	it("accepts aliases everywhere", () => {
		const value = {
			fontFamily: "{font.body}",
			fontSize: "{size.base}",
			fontWeight: "{weight.regular}",
		} as const;
		expect(typography.parse(value)).toBeDefined();
	});
});
