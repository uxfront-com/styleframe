import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFontFamilyDesignTokens } from "./useFontFamilyDesignTokens";

describe("useFontFamilyDesignTokens", () => {
	it("should create a single font family variable with 'default' key", () => {
		const s = styleframe();
		const { fontFamily } = useFontFamilyDesignTokens(s, {
			default: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
		});

		expect(fontFamily).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family",
			value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
		});

		const css = consumeCSS(fontFamily, s.options);
		expect(css).toBe(`--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;`);
	});

	it("should create font family variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { fontFamilyMono } = useFontFamilyDesignTokens(s, {
			mono: "'SFMono-Regular', Menlo, Monaco, Consolas",
		});

		expect(fontFamilyMono).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family.mono",
			value: "'SFMono-Regular', Menlo, Monaco, Consolas",
		});

		const css = consumeCSS(fontFamilyMono, s.options);
		expect(css).toBe(`--font-family--mono: 'SFMono-Regular', Menlo, Monaco, Consolas;`);
	});

	it("should create multiple font family variables", () => {
		const s = styleframe();
		const { fontFamily, fontFamilyPrint, fontFamilyMono } = useFontFamilyDesignTokens(s, {
			default:
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
			print: "'Georgia', 'Times New Roman', 'Times', serif",
			mono: "'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
		});

		expect(fontFamily).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family",
			value:
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
		});

		expect(fontFamilyPrint).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family.print",
			value: "'Georgia', 'Times New Roman', 'Times', serif",
		});

		expect(fontFamilyMono).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family.mono",
			value:
				"'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useFontFamilyDesignTokens(s, {
			default: "Arial, sans-serif",
			mono: "Courier, monospace",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("font-family");
		expect(s.root.variables[1]?.name).toBe("font-family.mono");
	});

	it("should handle kebab-case font family names", () => {
		const s = styleframe();
		const { fontFamilySerifDisplay } = useFontFamilyDesignTokens(s, {
			"serif-display": "'Playfair Display', Georgia, serif",
		});

		expect(fontFamilySerifDisplay).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family.serif-display",
			value: "'Playfair Display', Georgia, serif",
		});
	});

	it("should handle snake_case font family names", () => {
		const s = styleframe();
		const { fontFamilyHeadingPrimary } = useFontFamilyDesignTokens(s, {
			heading_primary: "'Inter', sans-serif",
		});

		expect(fontFamilyHeadingPrimary).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family.heading_primary",
			value: "'Inter', sans-serif",
		});
	});

	it("should handle numeric font family names", () => {
		const s = styleframe();
		const { fontFamily100 } = useFontFamilyDesignTokens(s, {
			"100": "'Roboto', sans-serif",
		});

		expect(fontFamily100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family.100",
			value: "'Roboto', sans-serif",
		});
	});

	it("should handle single font family without fallback", () => {
		const s = styleframe();
		const { fontFamilyCustom } = useFontFamilyDesignTokens(s, {
			custom: "Arial",
		});

		expect(fontFamilyCustom).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family.custom",
			value: "Arial",
		});
	});

	it("should handle complex font family stacks", () => {
		const s = styleframe();
		const { fontFamilySystem } = useFontFamilyDesignTokens(s, {
			system:
				"system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		});

		expect(fontFamilySystem.value).toBe(
			"system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		);
	});

	it("should handle empty font family object", () => {
		const s = styleframe();
		const result = useFontFamilyDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle font family references", () => {
		const s = styleframe();
		const baseFont = s.variable("base-font", "Arial, sans-serif");
		const { fontFamily } = useFontFamilyDesignTokens(s, {
			default: s.ref(baseFont),
		});

		expect(fontFamily.value).toEqual({
			type: "reference",
			name: "base-font",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useFontFamilyDesignTokens(s, {
			default: "Arial, sans-serif",
			mono: "Courier, monospace",
			display: "'Playfair Display', Georgia, serif",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--font-family: Arial, sans-serif;
	--font-family--mono: Courier, monospace;
	--font-family--display: 'Playfair Display', Georgia, serif;
}`);
	});

	describe("type safety", () => {
		it("should preserve exact font family names in return type", () => {
			const s = styleframe();
			const fonts = useFontFamilyDesignTokens(s, {
				default: "Arial, sans-serif",
				mono: "Courier, monospace",
			});

			// Type assertions to verify the generic types are preserved
			const defaultFont: Variable<"font-family"> = fonts.fontFamily;
			const monoFont: Variable<"font-family.mono"> = fonts.fontFamilyMono;

			expect(defaultFont.name).toBe("font-family");
			expect(monoFont.name).toBe("font-family.mono");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const { fontFamilySerifDisplay } = useFontFamilyDesignTokens(s, {
				"serif-display": "'Playfair Display', Georgia, serif",
			});

			const typed: Variable<"font-family.serif-display"> = fontFamilySerifDisplay;
			expect(typed.name).toBe("font-family.serif-display");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const fontConfig = {
				default: "Arial, sans-serif",
				mono: "Courier, monospace",
			} as const;

			const fonts = useFontFamilyDesignTokens(s, fontConfig);

			expect(fonts.fontFamily.name).toBe("font-family");
			expect(fonts.fontFamilyMono.name).toBe("font-family.mono");
		});
	});
});
