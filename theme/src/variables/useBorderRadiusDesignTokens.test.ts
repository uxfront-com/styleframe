import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBorderRadiusDesignTokens } from "./useBorderRadiusDesignTokens";

describe("useBorderRadiusDesignTokens", () => {
	it("should create a single border-radius variable with 'default' key", () => {
		const s = styleframe();
		const { borderRadius } = useBorderRadiusDesignTokens(s, {
			default: "0.25rem",
		});

		expect(borderRadius).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius",
			value: "0.25rem",
		});

		const css = consumeCSS(borderRadius, s.options);
		expect(css).toBe(`--border-radius: 0.25rem;`);
	});

	it("should create border-radius variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { borderRadiusSm } = useBorderRadiusDesignTokens(s, {
			sm: "0.125rem",
		});

		expect(borderRadiusSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.sm",
			value: "0.125rem",
		});

		const css = consumeCSS(borderRadiusSm, s.options);
		expect(css).toBe(`--border-radius--sm: 0.125rem;`);
	});

	it("should create multiple border-radius variables", () => {
		const s = styleframe();
		const { borderRadius, borderRadiusSm, borderRadiusMd, borderRadiusLg } =
			useBorderRadiusDesignTokens(s, {
				default: "0.25rem",
				sm: "0.125rem",
				md: "0.25rem",
				lg: "0.5rem",
			});

		expect(borderRadius).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius",
			value: "0.25rem",
		});

		expect(borderRadiusSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.sm",
			value: "0.125rem",
		});

		expect(borderRadiusMd).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.md",
			value: "0.25rem",
		});

		expect(borderRadiusLg).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.lg",
			value: "0.5rem",
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useBorderRadiusDesignTokens(s, {
			default: "0.25rem",
			sm: "0.125rem",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("border-radius");
		expect(s.root.variables[1]?.name).toBe("border-radius.sm");
	});

	it("should handle kebab-case border-radius names", () => {
		const s = styleframe();
		const { borderRadiusExtraLarge } = useBorderRadiusDesignTokens(s, {
			"extra-large": "1rem",
		});

		expect(borderRadiusExtraLarge).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.extra-large",
			value: "1rem",
		});
	});

	it("should handle snake_case border-radius names", () => {
		const s = styleframe();
		const { borderRadiusCardCorner } = useBorderRadiusDesignTokens(s, {
			card_corner: "0.375rem",
		});

		expect(borderRadiusCardCorner).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.card_corner",
			value: "0.375rem",
		});
	});

	it("should handle numeric border-radius names", () => {
		const s = styleframe();
		const { borderRadius100 } = useBorderRadiusDesignTokens(s, {
			"100": "0.25rem",
		});

		expect(borderRadius100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.100",
			value: "0.25rem",
		});
	});

	it("should handle pixel values", () => {
		const s = styleframe();
		const { borderRadius } = useBorderRadiusDesignTokens(s, {
			default: "4px",
		});

		expect(borderRadius).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius",
			value: "4px",
		});
	});

	it("should handle em values", () => {
		const s = styleframe();
		const { borderRadiusBase } = useBorderRadiusDesignTokens(s, {
			base: "0.5em",
		});

		expect(borderRadiusBase).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.base",
			value: "0.5em",
		});
	});

	it("should handle percentage values", () => {
		const s = styleframe();
		const { borderRadiusCircle } = useBorderRadiusDesignTokens(s, {
			circle: "50%",
		});

		expect(borderRadiusCircle).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.circle",
			value: "50%",
		});
	});

	it("should handle viewport units", () => {
		const s = styleframe();
		const { borderRadiusFluid } = useBorderRadiusDesignTokens(s, {
			fluid: "1vw",
		});

		expect(borderRadiusFluid).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-radius.fluid",
			value: "1vw",
		});
	});

	it("should handle calc() expressions", () => {
		const s = styleframe();
		const { borderRadiusDynamic } = useBorderRadiusDesignTokens(s, {
			dynamic: "calc(0.25rem + 0.5vw)",
		});

		expect(borderRadiusDynamic.value).toBe("calc(0.25rem + 0.5vw)");
	});

	it("should handle clamp() expressions", () => {
		const s = styleframe();
		const { borderRadiusResponsive } = useBorderRadiusDesignTokens(s, {
			responsive: "clamp(0.125rem, 1vw, 1rem)",
		});

		expect(borderRadiusResponsive.value).toBe("clamp(0.125rem, 1vw, 1rem)");
	});

	it("should handle special keyword values", () => {
		const s = styleframe();
		const { borderRadiusNone, borderRadiusFull } = useBorderRadiusDesignTokens(s, {
			none: "0",
			full: "9999px",
		});

		expect(borderRadiusNone.value).toBe("0");
		expect(borderRadiusFull.value).toBe("9999px");
	});

	it("should handle multi-value border-radius", () => {
		const s = styleframe();
		const { borderRadiusCustom } = useBorderRadiusDesignTokens(s, {
			custom: "0.25rem 0.5rem",
		});

		expect(borderRadiusCustom.value).toBe("0.25rem 0.5rem");
	});

	it("should handle four-value border-radius", () => {
		const s = styleframe();
		const { borderRadiusAsymmetric } = useBorderRadiusDesignTokens(s, {
			asymmetric: "0.25rem 0.5rem 0.75rem 1rem",
		});

		expect(borderRadiusAsymmetric.value).toBe("0.25rem 0.5rem 0.75rem 1rem");
	});

	it("should handle empty border-radius object", () => {
		const s = styleframe();
		const result = useBorderRadiusDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle border-radius references", () => {
		const s = styleframe();
		const baseBorderRadius = s.variable("base-border-radius", "0.25rem");
		const { borderRadius } = useBorderRadiusDesignTokens(s, {
			default: s.ref(baseBorderRadius),
		});

		expect(borderRadius.value).toEqual({
			type: "reference",
			name: "base-border-radius",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useBorderRadiusDesignTokens(s, {
			default: "0.25rem",
			none: "0",
			sm: "0.125rem",
			md: "0.25rem",
			lg: "0.5rem",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--border-radius: 0.25rem;
	--border-radius--none: 0;
	--border-radius--sm: 0.125rem;
	--border-radius--md: 0.25rem;
	--border-radius--lg: 0.5rem;
}`);
	});

	it("should handle a complete border-radius scale", () => {
		const s = styleframe();
		const radii = useBorderRadiusDesignTokens(s, {
			none: "0",
			xs: "0.125rem",
			sm: "0.25rem",
			default: "0.375rem",
			md: "0.5rem",
			lg: "0.75rem",
			xl: "1rem",
			"2xl": "1.5rem",
			"3xl": "2rem",
			full: "9999px",
		});

		expect(radii.borderRadiusNone.value).toBe("0");
		expect(radii.borderRadiusXs.value).toBe("0.125rem");
		expect(radii.borderRadiusSm.value).toBe("0.25rem");
		expect(radii.borderRadius.value).toBe("0.375rem");
		expect(radii.borderRadiusMd.value).toBe("0.5rem");
		expect(radii.borderRadiusLg.value).toBe("0.75rem");
		expect(radii.borderRadiusXl.value).toBe("1rem");
		expect(radii.borderRadius2xl.value).toBe("1.5rem");
		expect(radii.borderRadius3xl.value).toBe("2rem");
		expect(radii.borderRadiusFull.value).toBe("9999px");
	});

	describe("type safety", () => {
		it("should preserve exact border-radius names in return type", () => {
			const s = styleframe();
			const radii = useBorderRadiusDesignTokens(s, {
				default: "0.25rem",
				sm: "0.125rem",
			});

			// Type assertions to verify the generic types are preserved
			const defaultBorderRadius: Variable<"border-radius"> = radii.borderRadius;
			const smBorderRadius: Variable<"border-radius.sm"> = radii.borderRadiusSm;

			expect(defaultBorderRadius.name).toBe("border-radius");
			expect(smBorderRadius.name).toBe("border-radius.sm");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const { borderRadiusExtraLarge } = useBorderRadiusDesignTokens(s, {
				"extra-large": "1rem",
			});

			const typed: Variable<"border-radius.extra-large"> = borderRadiusExtraLarge;
			expect(typed.name).toBe("border-radius.extra-large");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const borderRadiusConfig = {
				default: "0.25rem",
				sm: "0.125rem",
			} as const;

			const radii = useBorderRadiusDesignTokens(s, borderRadiusConfig);

			expect(radii.borderRadius.name).toBe("border-radius");
			expect(radii.borderRadiusSm.name).toBe("border-radius.sm");
		});
	});
});
