import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBoxShadowDesignTokens } from "./useBoxShadowDesignTokens";

describe("useBoxShadowDesignTokens", () => {
	it("should create a single box-shadow variable with 'default' key", () => {
		const s = styleframe();
		const { boxShadow } = useBoxShadowDesignTokens(s, {
			default: "0 2px 4px rgba(0, 0, 0, 0.1)",
		});

		expect(boxShadow).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow",
			value: "0 2px 4px rgba(0, 0, 0, 0.1)",
		});

		const css = consumeCSS(boxShadow, s.options);
		expect(css).toBe(`--box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`);
	});

	it("should create box-shadow variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { boxShadowSm } = useBoxShadowDesignTokens(s, {
			sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
		});

		expect(boxShadowSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.sm",
			value: "0 1px 2px rgba(0, 0, 0, 0.05)",
		});

		const css = consumeCSS(boxShadowSm, s.options);
		expect(css).toBe(`--box-shadow--sm: 0 1px 2px rgba(0, 0, 0, 0.05);`);
	});

	it("should create multiple box-shadow variables", () => {
		const s = styleframe();
		const { boxShadow, boxShadowSm, boxShadowMd, boxShadowLg } = useBoxShadowDesignTokens(s, {
			default: "0 2px 4px rgba(0, 0, 0, 0.1)",
			sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
			md: "0 4px 8px rgba(0, 0, 0, 0.1)",
			lg: "0 8px 16px rgba(0, 0, 0, 0.15)",
		});

		expect(boxShadow).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow",
			value: "0 2px 4px rgba(0, 0, 0, 0.1)",
		});

		expect(boxShadowSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.sm",
			value: "0 1px 2px rgba(0, 0, 0, 0.05)",
		});

		expect(boxShadowMd).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.md",
			value: "0 4px 8px rgba(0, 0, 0, 0.1)",
		});

		expect(boxShadowLg).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.lg",
			value: "0 8px 16px rgba(0, 0, 0, 0.15)",
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useBoxShadowDesignTokens(s, {
			default: "0 2px 4px rgba(0, 0, 0, 0.1)",
			sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("box-shadow");
		expect(s.root.variables[1]?.name).toBe("box-shadow.sm");
	});

	it("should handle kebab-case box-shadow names", () => {
		const s = styleframe();
		const { boxShadowExtraLarge } = useBoxShadowDesignTokens(s, {
			"extra-large": "0 20px 40px rgba(0, 0, 0, 0.2)",
		});

		expect(boxShadowExtraLarge).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.extra-large",
			value: "0 20px 40px rgba(0, 0, 0, 0.2)",
		});
	});

	it("should handle snake_case box-shadow names", () => {
		const s = styleframe();
		const { boxShadowCardElevation } = useBoxShadowDesignTokens(s, {
			card_elevation: "0 4px 6px rgba(0, 0, 0, 0.1)",
		});

		expect(boxShadowCardElevation).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.card_elevation",
			value: "0 4px 6px rgba(0, 0, 0, 0.1)",
		});
	});

	it("should handle numeric box-shadow names", () => {
		const s = styleframe();
		const { boxShadow100 } = useBoxShadowDesignTokens(s, {
			"100": "0 1px 3px rgba(0, 0, 0, 0.12)",
		});

		expect(boxShadow100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.100",
			value: "0 1px 3px rgba(0, 0, 0, 0.12)",
		});
	});

	it("should handle none value", () => {
		const s = styleframe();
		const { boxShadowNone } = useBoxShadowDesignTokens(s, {
			none: "none",
		});

		expect(boxShadowNone).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.none",
			value: "none",
		});
	});

	it("should handle inset shadows", () => {
		const s = styleframe();
		const { boxShadowInset } = useBoxShadowDesignTokens(s, {
			inset: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
		});

		expect(boxShadowInset).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "box-shadow.inset",
			value: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
		});
	});

	it("should handle multiple shadows", () => {
		const s = styleframe();
		const { boxShadowMultiple } = useBoxShadowDesignTokens(s, {
			multiple: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
		});

		expect(boxShadowMultiple.value).toBe(
			"0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
		);
	});

	it("should handle colored shadows", () => {
		const s = styleframe();
		const { boxShadowColored } = useBoxShadowDesignTokens(s, {
			colored: "0 4px 8px rgba(59, 130, 246, 0.3)",
		});

		expect(boxShadowColored.value).toBe("0 4px 8px rgba(59, 130, 246, 0.3)");
	});

	it("should handle spread radius", () => {
		const s = styleframe();
		const { boxShadowSpread } = useBoxShadowDesignTokens(s, {
			spread: "0 4px 8px 2px rgba(0, 0, 0, 0.1)",
		});

		expect(boxShadowSpread.value).toBe("0 4px 8px 2px rgba(0, 0, 0, 0.1)");
	});

	it("should handle hex color values", () => {
		const s = styleframe();
		const { boxShadowHex } = useBoxShadowDesignTokens(s, {
			hex: "0 2px 4px #00000019",
		});

		expect(boxShadowHex.value).toBe("0 2px 4px #00000019");
	});

	it("should handle hsl color values", () => {
		const s = styleframe();
		const { boxShadowHsl } = useBoxShadowDesignTokens(s, {
			hsl: "0 4px 8px hsl(0, 0%, 0%, 0.1)",
		});

		expect(boxShadowHsl.value).toBe("0 4px 8px hsl(0, 0%, 0%, 0.1)");
	});

	it("should handle CSS variables in shadow values", () => {
		const s = styleframe();
		const { boxShadowVar } = useBoxShadowDesignTokens(s, {
			var: "0 2px 4px var(--shadow-color)",
		});

		expect(boxShadowVar.value).toBe("0 2px 4px var(--shadow-color)");
	});

	it("should handle empty box-shadow object", () => {
		const s = styleframe();
		const result = useBoxShadowDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle box-shadow references", () => {
		const s = styleframe();
		const baseBoxShadow = s.variable("base-box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)");
		const { boxShadow } = useBoxShadowDesignTokens(s, {
			default: s.ref(baseBoxShadow),
		});

		expect(boxShadow.value).toEqual({
			type: "reference",
			name: "base-box-shadow",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useBoxShadowDesignTokens(s, {
			default: "0 2px 4px rgba(0, 0, 0, 0.1)",
			none: "none",
			sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
			md: "0 4px 8px rgba(0, 0, 0, 0.1)",
			lg: "0 8px 16px rgba(0, 0, 0, 0.15)",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	--box-shadow--none: none;
	--box-shadow--sm: 0 1px 2px rgba(0, 0, 0, 0.05);
	--box-shadow--md: 0 4px 8px rgba(0, 0, 0, 0.1);
	--box-shadow--lg: 0 8px 16px rgba(0, 0, 0, 0.15);
}`);
	});

	it("should handle a complete box-shadow scale", () => {
		const s = styleframe();
		const shadows = useBoxShadowDesignTokens(s, {
			none: "none",
			xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
			sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
			default: "0 2px 4px rgba(0, 0, 0, 0.1)",
			md: "0 4px 8px rgba(0, 0, 0, 0.1)",
			lg: "0 8px 16px rgba(0, 0, 0, 0.15)",
			xl: "0 12px 24px rgba(0, 0, 0, 0.2)",
			"2xl": "0 16px 32px rgba(0, 0, 0, 0.25)",
			"3xl": "0 24px 48px rgba(0, 0, 0, 0.3)",
		});

		expect(shadows.boxShadowNone.value).toBe("none");
		expect(shadows.boxShadowXs.value).toBe("0 1px 2px rgba(0, 0, 0, 0.05)");
		expect(shadows.boxShadowSm.value).toBe("0 1px 3px rgba(0, 0, 0, 0.1)");
		expect(shadows.boxShadow.value).toBe("0 2px 4px rgba(0, 0, 0, 0.1)");
		expect(shadows.boxShadowMd.value).toBe("0 4px 8px rgba(0, 0, 0, 0.1)");
		expect(shadows.boxShadowLg.value).toBe("0 8px 16px rgba(0, 0, 0, 0.15)");
		expect(shadows.boxShadowXl.value).toBe("0 12px 24px rgba(0, 0, 0, 0.2)");
		expect(shadows.boxShadow2xl.value).toBe("0 16px 32px rgba(0, 0, 0, 0.25)");
		expect(shadows.boxShadow3xl.value).toBe("0 24px 48px rgba(0, 0, 0, 0.3)");
	});

	it("should handle elevation system", () => {
		const s = styleframe();
		const shadows = useBoxShadowDesignTokens(s, {
			"1": "0 1px 3px rgba(0, 0, 0, 0.12)",
			"2": "0 3px 6px rgba(0, 0, 0, 0.16)",
			"3": "0 10px 20px rgba(0, 0, 0, 0.19)",
			"4": "0 14px 28px rgba(0, 0, 0, 0.25)",
			"5": "0 19px 38px rgba(0, 0, 0, 0.30)",
		});

		expect(shadows.boxShadow1.value).toBe("0 1px 3px rgba(0, 0, 0, 0.12)");
		expect(shadows.boxShadow2.value).toBe("0 3px 6px rgba(0, 0, 0, 0.16)");
		expect(shadows.boxShadow3.value).toBe("0 10px 20px rgba(0, 0, 0, 0.19)");
		expect(shadows.boxShadow4.value).toBe("0 14px 28px rgba(0, 0, 0, 0.25)");
		expect(shadows.boxShadow5.value).toBe("0 19px 38px rgba(0, 0, 0, 0.30)");
	});

	describe("type safety", () => {
		it("should preserve exact box-shadow names in return type", () => {
			const s = styleframe();
			const shadows = useBoxShadowDesignTokens(s, {
				default: "0 2px 4px rgba(0, 0, 0, 0.1)",
				sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
			});

			// Type assertions to verify the generic types are preserved
			const defaultBoxShadow: Variable<"box-shadow"> = shadows.boxShadow;
			const smBoxShadow: Variable<"box-shadow.sm"> = shadows.boxShadowSm;

			expect(defaultBoxShadow.name).toBe("box-shadow");
			expect(smBoxShadow.name).toBe("box-shadow.sm");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const { boxShadowExtraLarge } = useBoxShadowDesignTokens(s, {
				"extra-large": "0 20px 40px rgba(0, 0, 0, 0.2)",
			});

			const typed: Variable<"box-shadow.extra-large"> = boxShadowExtraLarge;
			expect(typed.name).toBe("box-shadow.extra-large");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const boxShadowConfig = {
				default: "0 2px 4px rgba(0, 0, 0, 0.1)",
				sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
			} as const;

			const shadows = useBoxShadowDesignTokens(s, boxShadowConfig);

			expect(shadows.boxShadow.name).toBe("box-shadow");
			expect(shadows.boxShadowSm.name).toBe("box-shadow.sm");
		});
	});
});
