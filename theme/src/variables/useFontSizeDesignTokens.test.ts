import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFontSizeDesignTokens } from "./useFontSizeDesignTokens";

describe("useFontSizeDesignTokens", () => {
	it("should create a single font size variable with 'default' key", () => {
		const s = styleframe();
		const { fontSize } = useFontSizeDesignTokens(s, {
			default: "1rem",
		});

		expect(fontSize).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size",
			value: "1rem",
		});

		const css = consumeCSS(fontSize, s.options);
		expect(css).toBe(`--font-size: 1rem;`);
	});

	it("should create font size variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { fontSizeSm } = useFontSizeDesignTokens(s, {
			sm: "0.875rem",
		});

		expect(fontSizeSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.sm",
			value: "0.875rem",
		});

		const css = consumeCSS(fontSizeSm, s.options);
		expect(css).toBe(`--font-size--sm: 0.875rem;`);
	});

	it("should create multiple font size variables", () => {
		const s = styleframe();
		const { fontSize, fontSizeSm, fontSizeMd, fontSizeLg } = useFontSizeDesignTokens(s, {
			default: "1rem",
			sm: "0.875rem",
			md: "1rem",
			lg: "1.25rem",
		});

		expect(fontSize).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size",
			value: "1rem",
		});

		expect(fontSizeSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.sm",
			value: "0.875rem",
		});

		expect(fontSizeMd).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.md",
			value: "1rem",
		});

		expect(fontSizeLg).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.lg",
			value: "1.25rem",
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useFontSizeDesignTokens(s, {
			default: "1rem",
			sm: "0.875rem",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("font-size");
		expect(s.root.variables[1]?.name).toBe("font-size.sm");
	});

	it("should handle kebab-case font size names", () => {
		const s = styleframe();
		const { fontSizeExtraLarge } = useFontSizeDesignTokens(s, {
			"extra-large": "2rem",
		});

		expect(fontSizeExtraLarge).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.extra-large",
			value: "2rem",
		});
	});

	it("should handle snake_case font size names", () => {
		const s = styleframe();
		const { fontSizeHeadingPrimary } = useFontSizeDesignTokens(s, {
			heading_primary: "1.5rem",
		});

		expect(fontSizeHeadingPrimary).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.heading_primary",
			value: "1.5rem",
		});
	});

	it("should handle numeric font size names", () => {
		const s = styleframe();
		const { fontSize100 } = useFontSizeDesignTokens(s, {
			"100": "0.75rem",
		});

		expect(fontSize100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.100",
			value: "0.75rem",
		});
	});

	it("should handle pixel values", () => {
		const s = styleframe();
		const { fontSize } = useFontSizeDesignTokens(s, {
			default: "16px",
		});

		expect(fontSize).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size",
			value: "16px",
		});
	});

	it("should handle em values", () => {
		const s = styleframe();
		const { fontSizeBase } = useFontSizeDesignTokens(s, {
			base: "1.5em",
		});

		expect(fontSizeBase).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.base",
			value: "1.5em",
		});
	});

	it("should handle percentage values", () => {
		const s = styleframe();
		const { fontSizeRelative } = useFontSizeDesignTokens(s, {
			relative: "125%",
		});

		expect(fontSizeRelative).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.relative",
			value: "125%",
		});
	});

	it("should handle viewport units", () => {
		const s = styleframe();
		const { fontSizeFluid } = useFontSizeDesignTokens(s, {
			fluid: "2.5vw",
		});

		expect(fontSizeFluid).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.fluid",
			value: "2.5vw",
		});
	});

	it("should handle calc() expressions", () => {
		const s = styleframe();
		const { fontSizeDynamic } = useFontSizeDesignTokens(s, {
			dynamic: "calc(1rem + 0.5vw)",
		});

		expect(fontSizeDynamic.value).toBe("calc(1rem + 0.5vw)");
	});

	it("should handle clamp() expressions", () => {
		const s = styleframe();
		const { fontSizeResponsive } = useFontSizeDesignTokens(s, {
			responsive: "clamp(1rem, 2vw, 2rem)",
		});

		expect(fontSizeResponsive.value).toBe("clamp(1rem, 2vw, 2rem)");
	});

	it("should handle empty font size object", () => {
		const s = styleframe();
		const result = useFontSizeDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle font size references", () => {
		const s = styleframe();
		const baseSize = s.variable("base-size", "1rem");
		const { fontSize } = useFontSizeDesignTokens(s, {
			default: s.ref(baseSize),
		});

		expect(fontSize.value).toEqual({
			type: "reference",
			name: "base-size",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useFontSizeDesignTokens(s, {
			default: "1rem",
			sm: "0.875rem",
			md: "1rem",
			lg: "1.25rem",
			xl: "1.5rem",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--font-size: 1rem;
	--font-size--sm: 0.875rem;
	--font-size--md: 1rem;
	--font-size--lg: 1.25rem;
	--font-size--xl: 1.5rem;
}`);
	});

	it("should handle a complete font size scale", () => {
		const s = styleframe();
		const sizes = useFontSizeDesignTokens(s, {
			xs: "0.75rem",
			sm: "0.875rem",
			default: "1rem",
			md: "1rem",
			lg: "1.25rem",
			xl: "1.5rem",
			"2xl": "2rem",
			"3xl": "2.5rem",
		});

		expect(sizes.fontSizeXs.value).toBe("0.75rem");
		expect(sizes.fontSizeSm.value).toBe("0.875rem");
		expect(sizes.fontSize.value).toBe("1rem");
		expect(sizes.fontSizeMd.value).toBe("1rem");
		expect(sizes.fontSizeLg.value).toBe("1.25rem");
		expect(sizes.fontSizeXl.value).toBe("1.5rem");
		expect(sizes.fontSize2xl.value).toBe("2rem");
		expect(sizes.fontSize3xl.value).toBe("2.5rem");
	});

	describe("fluid ranges", () => {
		it("should treat tuple values as absolute pixel ranges and emit calc()", () => {
			const s = styleframe();
			const { fontSizeMd } = useFontSizeDesignTokens(s, {
				md: [16, 18],
			});

			expect(fontSizeMd.name).toBe("font-size.md");
			expect(fontSizeMd.value).toEqual(expect.objectContaining({ type: "css" }));

			const css = consumeCSS(fontSizeMd, s.options);
			expect(css).toEqual(
				"--font-size--md: calc((16 / 16 * 1rem) + (18 - 16) * var(--fluid--breakpoint));",
			);
		});

		it("should accept the object form { min, max }", () => {
			const s = styleframe();
			const { fontSizeMd } = useFontSizeDesignTokens(s, {
				md: { min: 16, max: 18 },
			});

			const css = consumeCSS(fontSizeMd, s.options);
			expect(css).toEqual(
				"--font-size--md: calc((16 / 16 * 1rem) + (18 - 16) * var(--fluid--breakpoint));",
			);
		});

		it("should produce identical CSS for tuple and object forms", () => {
			const tupleS = styleframe();
			const { fontSizeMd: tupleMd } = useFontSizeDesignTokens(tupleS, {
				md: [16, 18],
			});

			const objectS = styleframe();
			const { fontSizeMd: objectMd } = useFontSizeDesignTokens(objectS, {
				md: { min: 16, max: 18 },
			});

			expect(consumeCSS(objectMd, objectS.options)).toBe(consumeCSS(tupleMd, tupleS.options));
		});

		it("should mix fluid ranges and fixed values in the same call", () => {
			const s = styleframe();
			const { fontSize, fontSizeMd, fontSizeSmall } = useFontSizeDesignTokens(s, {
				default: "@font-size.md",
				md: [16, 18],
				small: "0.8rem",
			});

			// Fluid: range → calc()
			expect(fontSizeMd.value).toEqual(expect.objectContaining({ type: "css" }));
			// Fixed: pass-through string
			expect(fontSizeSmall.value).toBe("0.8rem");
			// Reference: @-prefixed string short-circuits to a Reference token
			expect(fontSize.value).toEqual({
				type: "reference",
				name: "font-size.md",
				fallback: undefined,
			});
		});

		it("should resolve @-references inside tuples", () => {
			const s = styleframe();
			s.variable("custom-multiplier", 1.5, { default: true });

			const { fontSizeLg } = useFontSizeDesignTokens(s, {
				lg: ["@custom-multiplier", "@custom-multiplier"],
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
\t--custom-multiplier: 1.5;
\t--font-size--lg: calc((var(--custom-multiplier) / 16 * 1rem) + (var(--custom-multiplier) - var(--custom-multiplier)) * var(--fluid--breakpoint));
}`);
			expect(fontSizeLg.name).toBe("font-size.lg");
		});

		it("should accept Variable references inside tuples", () => {
			const s = styleframe();
			const minMultiplier = s.variable("scale-min", 1.2);
			const maxMultiplier = s.variable("scale-max", 1.25);

			const { fontSizeLg } = useFontSizeDesignTokens(s, {
				lg: [s.ref(minMultiplier), s.ref(maxMultiplier)],
			});

			expect(fontSizeLg.value).toEqual(expect.objectContaining({ type: "css" }));
		});

		it("should accept CSS expressions inside tuples", () => {
			const s = styleframe();
			s.variable("scale.min-powers.1", 1.2, { default: true });
			s.variable("scale.max-powers.1", 1.25, { default: true });

			const { fontSizeLg } = useFontSizeDesignTokens(s, {
				lg: [
					s.css`16 * ${s.ref("scale.min-powers.1")}`,
					s.css`18 * ${s.ref("scale.max-powers.1")}`,
				],
			});

			expect(fontSizeLg.name).toBe("font-size.lg");

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
\t--scale--min-powers--1: 1.2;
\t--scale--max-powers--1: 1.25;
\t--font-size--lg: calc((16 * var(--scale--min-powers--1) / 16 * 1rem) + (18 * var(--scale--max-powers--1) - 16 * var(--scale--min-powers--1)) * var(--fluid--breakpoint));
}`);
		});

		it("should default the breakpoint reference to fluid.breakpoint", () => {
			const s = styleframe();
			const { fontSizeMd } = useFontSizeDesignTokens(s, {
				md: [16, 18],
			});

			const css = consumeCSS(fontSizeMd, s.options);
			expect(css).toEqual(
				"--font-size--md: calc((16 / 16 * 1rem) + (18 - 16) * var(--fluid--breakpoint));",
			);
		});

		it("should accept a custom breakpoint via options", () => {
			const s = styleframe();
			const customBreakpoint = s.variable("custom-bp", "75vw");

			const { fontSizeMd } = useFontSizeDesignTokens(
				s,
				{ md: [16, 18] },
				{ breakpoint: customBreakpoint },
			);

			const css = consumeCSS(fontSizeMd, s.options);
			expect(css).toEqual(
				"--font-size--md: calc((16 / 16 * 1rem) + (18 - 16) * var(--custom-bp));",
			);
		});

		it("should accept a custom breakpoint reference via options", () => {
			const s = styleframe();
			const customBreakpoint = s.variable("custom-bp", "50vw");

			const { fontSizeMd } = useFontSizeDesignTokens(
				s,
				{ md: [16, 18] },
				{ breakpoint: s.ref(customBreakpoint) },
			);

			const css = consumeCSS(fontSizeMd, s.options);
			expect(css).toEqual(
				"--font-size--md: calc((16 / 16 * 1rem) + (18 - 16) * var(--custom-bp));",
			);
		});

		it("should not emit font-size.min/max when not provided in values", () => {
			const s = styleframe();
			useFontSizeDesignTokens(s, {
				md: [16, 18],
			});

			expect(s.root.variables.some((v) => v.name === "font-size.min")).toBe(false);
			expect(s.root.variables.some((v) => v.name === "font-size.max")).toBe(false);
		});
	});

	describe("type safety", () => {
		it("should preserve exact font size names in return type", () => {
			const s = styleframe();
			const sizes = useFontSizeDesignTokens(s, {
				default: "1rem",
				sm: "0.875rem",
			});

			// Type assertions to verify the generic types are preserved
			const defaultSize: Variable<"font-size"> = sizes.fontSize;
			const smSize: Variable<"font-size.sm"> = sizes.fontSizeSm;

			expect(defaultSize.name).toBe("font-size");
			expect(smSize.name).toBe("font-size.sm");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const { fontSizeExtraLarge } = useFontSizeDesignTokens(s, {
				"extra-large": "2rem",
			});

			const typed: Variable<"font-size.extra-large"> = fontSizeExtraLarge;
			expect(typed.name).toBe("font-size.extra-large");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const sizeConfig = {
				default: "1rem",
				sm: "0.875rem",
			} as const;

			const sizes = useFontSizeDesignTokens(s, sizeConfig);

			expect(sizes.fontSize.name).toBe("font-size");
			expect(sizes.fontSizeSm.name).toBe("font-size.sm");
		});
	});
});
