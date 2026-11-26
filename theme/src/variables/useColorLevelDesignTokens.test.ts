import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { colorLevelValues } from "../values";
import { useColorLevelDesignTokens } from "./useColorLevelDesignTokens";

describe("useColorLevelDesignTokens", () => {
	it("should create color levels with default values", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		const levels = useColorLevelDesignTokens(s, colorPrimary, colorLevelValues);

		// Test some of the default levels (we know they exist from the default parameter)
		expect(levels.colorPrimary50).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-50",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(levels.colorPrimary500).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-500",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(levels.colorPrimary950).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-950",
			value: expect.stringMatching(/^oklch\(/),
		});

		const css = consumeCSS(levels.colorPrimary100, s.options);
		expect(css).toMatch(/^--color--primary-100: oklch\(.+\);$/);
	});

	it("should compile color levels to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		useColorLevelDesignTokens(s, colorPrimary, {
			100: 0.93,
			500: 0.55,
			900: 0.17,
		});

		const css = consumeCSS(s.root, s.options);

		// All levels should be pre-computed oklch values
		expect(css).toMatch(/--color--primary-100: oklch\(.+\);/);
		expect(css).toMatch(/--color--primary-500: oklch\(.+\);/);
		expect(css).toMatch(/--color--primary-900: oklch\(.+\);/);
	});

	it("should create color levels with custom values", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		const levels = useColorLevelDesignTokens(s, colorPrimary, {
			100: 0.93,
			200: 0.85,
			300: 0.75,
		} as const);

		expect(levels.colorPrimary100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-100",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(levels.colorPrimary200).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-200",
			value: expect.stringMatching(/^oklch\(/),
		});
		expect(levels.colorPrimary300).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color--primary-300",
			value: expect.stringMatching(/^oklch\(/),
		});

		const css = consumeCSS(levels.colorPrimary200, s.options);
		expect(css).toMatch(/^--color--primary-200: oklch\(.+\);$/);
	});

	it("should add variables to root", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		useColorLevelDesignTokens(s, colorPrimary, {
			100: 0.93,
			200: 0.85,
		} as const);

		// +1 for the original color variable
		expect(s.root.variables.length).toBeGreaterThanOrEqual(3);
	});

	it("should handle color with kebab-case name", () => {
		const s = styleframe();
		const colorPrimaryDark = s.variable("color--primary-dark", "#0056b3");
		const levels = useColorLevelDesignTokens(s, colorPrimaryDark, {
			100: 0.93,
		} as const);

		expect(levels.colorPrimaryDark100.name).toBe("color--primary-dark-100");
	});

	it("should handle empty levels object", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		const levels = useColorLevelDesignTokens(s, colorPrimary, {} as const);

		expect(levels).toEqual({});
	});

	it("should work with different variable name patterns", () => {
		const s = styleframe();
		const customColor = s.variable("custom-color", "#ff0000");
		const levels = useColorLevelDesignTokens(s, customColor, {
			500: 0.55,
		} as const);

		expect(levels.customColor500).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "custom-color-500",
			value: expect.stringMatching(/^oklch\(/),
		});

		const css = consumeCSS(levels.customColor500, s.options);
		expect(css).toMatch(/^--custom-color-500: oklch\(.+\);$/);
	});

	it("should produce lighter colors for lower levels and darker for higher", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color--primary", "#007bff");
		const levels = useColorLevelDesignTokens(s, colorPrimary, {
			100: 0.93,
			500: 0.55,
			900: 0.17,
		});

		const css100 = consumeCSS(levels.colorPrimary100, s.options);
		const css900 = consumeCSS(levels.colorPrimary900, s.options);

		// Extract lightness from oklch strings
		const l100 = Number.parseFloat(css100.match(/oklch\(([0-9.]+)/)?.[1] ?? "0");
		const l900 = Number.parseFloat(css900.match(/oklch\(([0-9.]+)/)?.[1] ?? "0");

		// Level 100 should be lighter than 900
		expect(l100).toBeGreaterThan(l900);
	});

	it("should handle achromatic colors (gray)", () => {
		const s = styleframe();
		const colorGray = s.variable("color--gray", "#808080");
		const levels = useColorLevelDesignTokens(s, colorGray, {
			100: 0.93,
		} as const);

		const css = consumeCSS(levels.colorGray100, s.options);
		// Achromatic colors should have 0 chroma
		expect(css).toMatch(/oklch\(0\.93 0 /);
	});

	describe("type safety", () => {
		it("should preserve variable name in return type", () => {
			const s = styleframe();
			const colorPrimary = s.variable("color--primary", "#007bff");
			const levels = useColorLevelDesignTokens(s, colorPrimary, {
				100: 0.93,
				200: 0.85,
			} as const);

			const level100: Variable<"color--primary-100"> = levels.colorPrimary100;
			const level200: Variable<"color--primary-200"> = levels.colorPrimary200;

			expect(level100.name).toBe("color--primary-100");
			expect(level200.name).toBe("color--primary-200");
		});

		it("should work with generic variable names", () => {
			const s = styleframe();
			const colorSecondary = s.variable("color--secondary", "#6c757d");
			const levels = useColorLevelDesignTokens(s, colorSecondary, {
				300: 0.75,
			} as const);

			const typed: Variable<"color--secondary-300"> = levels.colorSecondary300;
			expect(typed.name).toBe("color--secondary-300");
		});
	});
});
