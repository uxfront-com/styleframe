import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { colorTintValues } from "../values";
import { useColorTintDesignTokens } from "./useColorTintDesignTokens";

describe("useColorTintDesignTokens", () => {
	it("should create tint levels with default values", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		const tints = useColorTintDesignTokens(s, colorPrimary, colorTintValues);

		expect(tints.colorPrimaryTint50).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-tint-50",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(tints.colorPrimaryTint100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-tint-100",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(tints.colorPrimaryTint150).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-tint-150",
			value: expect.stringMatching(/^oklch\(/),
		});

		const css = consumeCSS(tints.colorPrimaryTint100, s.options);
		expect(css).toMatch(/^--color--primary-tint-100: oklch\(.+\);$/);
	});

	it("should create tint levels with custom values", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		const tints = useColorTintDesignTokens(s, colorPrimary, {
			"tint-25": 2.5,
			"tint-50": 5,
			"tint-75": 7.5,
			"tint-100": 10,
		} as const);

		expect(tints.colorPrimaryTint25).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-tint-25",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(tints.colorPrimaryTint50).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-tint-50",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(tints.colorPrimaryTint75).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-tint-75",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(tints.colorPrimaryTint100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-tint-100",
			value: expect.stringMatching(/^oklch\(/),
		});
	});

	it("should compile tint levels to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		useColorTintDesignTokens(s, colorPrimary, {
			"tint-50": 5,
			"tint-100": 10,
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toMatch(/--color--primary-tint-50: oklch\(.+\);/);
		expect(css).toMatch(/--color--primary-tint-100: oklch\(.+\);/);
	});

	it("should add variables to root", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		useColorTintDesignTokens(s, colorPrimary, {
			"tint-50": 5,
			"tint-100": 10,
		} as const);

		// +1 for the original color variable
		expect(s.root.variables.length).toBeGreaterThanOrEqual(3);
	});

	it("should handle color with kebab-case name", () => {
		const s = styleframe();
		const colorPrimaryLight = s.variable("color--primary-light", "#80bdff");
		const tints = useColorTintDesignTokens(s, colorPrimaryLight, {
			"tint-50": 5,
		} as const);

		expect(tints.colorPrimaryLightTint50.name).toBe("color--primary-light-tint-50");
	});

	it("should handle empty levels object", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		const tints = useColorTintDesignTokens(s, colorPrimary, {} as const);

		expect(tints).toEqual({});
	});

	it("should work with different variable name patterns", () => {
		const s = styleframe();
		const customColor = s.variable("custom-color", "#ff0000");
		const tints = useColorTintDesignTokens(s, customColor, {
			"tint-100": 10,
		} as const);

		expect(tints.customColorTint100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "custom-color-tint-100",
			value: expect.stringMatching(/^oklch\(/),
		});

		const css = consumeCSS(tints.customColorTint100, s.options);
		expect(css).toMatch(/^--custom-color-tint-100: oklch\(.+\);$/);
	});

	describe("type safety", () => {
		it("should preserve variable name in return type", () => {
			const s = styleframe();
			const colorPrimary = s.variable("color--primary", "#007bff");
			const tints = useColorTintDesignTokens(s, colorPrimary, {
				"tint-50": 5,
				"tint-100": 10,
			} as const);

			const tint50: Variable<"color--primary-tint-50"> = tints.colorPrimaryTint50;
			const tint100: Variable<"color--primary-tint-100"> = tints.colorPrimaryTint100;

			expect(tint50.name).toBe("color--primary-tint-50");
			expect(tint100.name).toBe("color--primary-tint-100");
		});

		it("should work with generic variable names", () => {
			const s = styleframe();
			const colorSecondary = s.variable("color--secondary", "#6c757d");
			const tints = useColorTintDesignTokens(s, colorSecondary, {
				"tint-75": 7.5,
			} as const);

			const typed: Variable<"color--secondary-tint-75"> = tints.colorSecondaryTint75;
			expect(typed.name).toBe("color--secondary-tint-75");
		});
	});
});
