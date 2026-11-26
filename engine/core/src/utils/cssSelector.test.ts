import { describe, expect, it } from "vitest";

import { classNameToCssSelector } from "./cssSelector";

describe("classNameToCssSelector", () => {
	it("should add . prefix to simple class name", () => {
		expect(classNameToCssSelector("sf-margin-sm")).toBe(".sf-margin-sm");
	});

	it("should escape colons", () => {
		expect(classNameToCssSelector("_margin:sm")).toBe(String.raw`._margin\:sm`);
	});

	it("should escape brackets", () => {
		expect(classNameToCssSelector("_margin:[16px]")).toBe(String.raw`._margin\:\[16px\]`);
	});

	it("should escape hash character", () => {
		expect(classNameToCssSelector("_color:[#1E3A8A]")).toBe(String.raw`._color\:\[\#1E3A8A\]`);
	});

	it("should escape parentheses", () => {
		expect(classNameToCssSelector("_bg:[rgb(255,0,0)]")).toBe(
			String.raw`._bg\:\[rgb\(255\,0\,0\)\]`,
		);
	});

	it("should escape percentage", () => {
		expect(classNameToCssSelector("_width:[50%]")).toBe(String.raw`._width\:\[50\%\]`);
	});

	it("should escape dots", () => {
		expect(classNameToCssSelector("_opacity:[0.5]")).toBe(String.raw`._opacity\:\[0\.5\]`);
	});

	it("should escape commas", () => {
		expect(classNameToCssSelector("_bg:[rgba(255,0,0,0.5)]")).toBe(
			String.raw`._bg\:\[rgba\(255\,0\,0\,0\.5\)\]`,
		);
	});

	it("should not escape characters that are not special", () => {
		expect(classNameToCssSelector("_margin-sm")).toBe("._margin-sm");
	});

	it("should handle multiple colons (modifiers)", () => {
		expect(classNameToCssSelector("_hover:focus:margin:sm")).toBe(
			String.raw`._hover\:focus\:margin\:sm`,
		);
	});

	it("should escape forward slashes", () => {
		expect(classNameToCssSelector("_width:1/2")).toBe(String.raw`._width\:1\/2`);
	});
});
