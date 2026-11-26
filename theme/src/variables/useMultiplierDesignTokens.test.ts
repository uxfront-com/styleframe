import type { CSS, Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useMultiplierDesignTokens } from "./useMultiplierDesignTokens";
import { useScaleDesignTokens } from "./useScaleDesignTokens";
import { useScalePowersDesignTokens } from "./useScalePowersDesignTokens";

describe("useMultiplierDesignTokens", () => {
	it("should create a single multiplied variable with 'default' key", () => {
		const s = styleframe();
		const baseVar = s.variable("font-size", "1rem");
		const { fontSize } = useMultiplierDesignTokens(s, baseVar, {
			default: 1,
		});

		expect(fontSize.type).toBe("variable");
		expect(fontSize.name).toBe("font-size");
		expect(fontSize.value).toBe("1rem");

		const css = consumeCSS(fontSize, s.options);
		expect(css).toBe(`--font-size: 1rem;`);
	});

	it("should create multiplied variable with modifier for non-default keys", () => {
		const s = styleframe();
		const baseVar = s.variable("font-size", "1rem");
		const { fontSizeSm } = useMultiplierDesignTokens(s, baseVar, {
			sm: 0.875,
		});

		expect(fontSizeSm.type).toBe("variable");
		expect(fontSizeSm.name).toBe("font-size.sm");
		expect((fontSizeSm.value as CSS)?.type).toBe("css");

		const css = consumeCSS(fontSizeSm, s.options);
		expect(css).toBe(`--font-size--sm: calc(var(--font-size) * 0.875);`);
	});

	it("should create multiple multiplied variables", () => {
		const s = styleframe();
		const baseVar = s.variable("spacing", "1rem");
		const { spacing, spacingSm, spacingLg } = useMultiplierDesignTokens(s, baseVar, {
			default: 1,
			sm: 0.5,
			lg: 2,
		});

		expect(spacing.type).toBe("variable");
		expect(spacing.name).toBe("spacing");
		expect(spacing.value).toBe("1rem");

		expect(spacingSm.type).toBe("variable");
		expect(spacingSm.name).toBe("spacing.sm");
		expect((spacingSm.value as CSS)?.type).toBe("css");

		expect(spacingLg.type).toBe("variable");
		expect(spacingLg.name).toBe("spacing.lg");
		expect((spacingLg.value as CSS)?.type).toBe("css");
	});

	it("should add variables to root", () => {
		const s = styleframe();
		const baseVar = s.variable("size", "1rem");
		useMultiplierDesignTokens(s, baseVar, {
			sm: 0.75,
			lg: 1.5,
		});

		expect(s.root.variables).toHaveLength(3); // base + sm + lg
		expect(s.root.variables[0]?.name).toBe("size");
		expect(s.root.variables[1]?.name).toBe("size.sm");
		expect(s.root.variables[2]?.name).toBe("size.lg");
	});

	it("should handle kebab-case modifier names", () => {
		const s = styleframe();
		const baseVar = s.variable("font-size", "1rem");
		const { fontSizeExtraLarge } = useMultiplierDesignTokens(s, baseVar, {
			"extra-large": 2.5,
		});

		expect(fontSizeExtraLarge.type).toBe("variable");
		expect(fontSizeExtraLarge.name).toBe("font-size.extra-large");
		expect((fontSizeExtraLarge.value as CSS)?.type).toBe("css");
	});

	it("should handle snake_case modifier names", () => {
		const s = styleframe();
		const baseVar = s.variable("spacing", "1rem");
		const { spacingVeryLarge } = useMultiplierDesignTokens(s, baseVar, {
			very_large: 3,
		});

		expect(spacingVeryLarge.type).toBe("variable");
		expect(spacingVeryLarge.name).toBe("spacing.very_large");
		expect((spacingVeryLarge.value as CSS)?.type).toBe("css");
	});

	it("should handle numeric modifier names", () => {
		const s = styleframe();
		const baseVar = s.variable("scale", "1rem");
		const { scale2 } = useMultiplierDesignTokens(s, baseVar, {
			"2": 2,
		});

		expect(scale2.type).toBe("variable");
		expect(scale2.name).toBe("scale.2");
		expect((scale2.value as CSS)?.type).toBe("css");
	});

	it("should handle decimal multipliers", () => {
		const s = styleframe();
		const baseVar = s.variable("font-size", "1rem");
		const { fontSizeXs } = useMultiplierDesignTokens(s, baseVar, {
			xs: 0.75,
		});

		expect((fontSizeXs.value as CSS)?.type).toBe("css");
	});

	it("should handle negative multipliers", () => {
		const s = styleframe();
		const baseVar = s.variable("offset", "10px");
		const { offsetReverse } = useMultiplierDesignTokens(s, baseVar, {
			reverse: -1,
		});

		expect((offsetReverse.value as CSS)?.type).toBe("css");
	});

	it("should handle zero multiplier", () => {
		const s = styleframe();
		const baseVar = s.variable("spacing", "1rem");
		const { spacingNone } = useMultiplierDesignTokens(s, baseVar, {
			none: 0,
		});

		expect((spacingNone.value as CSS)?.type).toBe("css");
	});

	it("should handle large multipliers", () => {
		const s = styleframe();
		const baseVar = s.variable("size", "1rem");
		const { sizeHuge } = useMultiplierDesignTokens(s, baseVar, {
			huge: 10,
		});

		expect((sizeHuge.value as CSS)?.type).toBe("css");
	});

	it("should handle very small multipliers", () => {
		const s = styleframe();
		const baseVar = s.variable("font-size", "1rem");
		const { fontSizeTiny } = useMultiplierDesignTokens(s, baseVar, {
			tiny: 0.125,
		});

		expect((fontSizeTiny.value as CSS)?.type).toBe("css");
	});

	it("should handle empty multiplier object", () => {
		const s = styleframe();
		const baseVar = s.variable("size", "1rem");
		const result = useMultiplierDesignTokens(s, baseVar, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(1); // Only the base variable
	});

	it("should handle variable references as multipliers", () => {
		const s = styleframe();
		const baseVar = s.variable("font-size", "1rem");
		const scaleVar = s.variable("scale", "1.5");
		const { fontSizeLg } = useMultiplierDesignTokens(s, baseVar, {
			lg: s.ref(scaleVar),
		});

		expect((fontSizeLg.value as CSS)?.type).toBe("css");
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		const baseVar = s.variable("font-size", "1rem");
		useMultiplierDesignTokens(s, baseVar, {
			xs: 0.75,
			sm: 0.875,
			lg: 1.25,
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--font-size: 1rem;
	--font-size--xs: calc(var(--font-size) * 0.75);
	--font-size--sm: calc(var(--font-size) * 0.875);
	--font-size--lg: calc(var(--font-size) * 1.25);
}`);
	});

	it("should work with scale powers for typography", () => {
		const s = styleframe();
		const fontSize = s.variable("font-size", "1rem");
		const scalePowers = {
			"-2": 0.563,
			"-1": 0.75,
			"1": 1.333,
			"2": 1.777,
		};

		const { fontSizeXs, fontSizeSm, fontSizeLg, fontSizeXl } = useMultiplierDesignTokens(
			s,
			fontSize,
			{
				xs: scalePowers["-2"],
				sm: scalePowers["-1"],
				lg: scalePowers["1"],
				xl: scalePowers["2"],
			},
		);

		expect((fontSizeXs.value as CSS)?.type).toBe("css");
		expect((fontSizeSm.value as CSS)?.type).toBe("css");
		expect((fontSizeLg.value as CSS)?.type).toBe("css");
		expect((fontSizeXl.value as CSS)?.type).toBe("css");
	});

	it("should work with spacing scale", () => {
		const s = styleframe();
		const spacing = s.variable("spacing", "1rem");

		const { spacing2xs, spacingXs, spacingSm, spacingMd, spacingLg, spacingXl } =
			useMultiplierDesignTokens(s, spacing, {
				"2xs": 0.25,
				xs: 0.5,
				sm: 0.75,
				md: 1,
				lg: 1.5,
				xl: 2,
			});

		expect(spacing2xs.name).toBe("spacing.2xs");
		expect(spacingXs.name).toBe("spacing.xs");
		expect(spacingSm.name).toBe("spacing.sm");
		expect(spacingMd.name).toBe("spacing.md");
		expect(spacingLg.name).toBe("spacing.lg");
		expect(spacingXl.name).toBe("spacing.xl");
	});

	it("should handle complex variable names", () => {
		const s = styleframe();
		const baseVar = s.variable("component-font-size", "1rem");
		const { componentFontSizeLg } = useMultiplierDesignTokens(s, baseVar, {
			lg: 1.5,
		});

		expect(componentFontSizeLg.type).toBe("variable");
		expect(componentFontSizeLg.name).toBe("component-font-size.lg");
		expect((componentFontSizeLg.value as CSS)?.type).toBe("css");
	});

	it("should preserve base variable unchanged", () => {
		const s = styleframe();
		const baseVar = s.variable("size", "1rem");
		const originalValue = baseVar.value;

		useMultiplierDesignTokens(s, baseVar, {
			sm: 0.5,
			lg: 2,
		});

		expect(baseVar.value).toBe(originalValue);
		expect(baseVar.value).toBe("1rem");
	});

	it("should handle string number multipliers", () => {
		const s = styleframe();
		const baseVar = s.variable("scale", "1rem");
		const { scaleMd } = useMultiplierDesignTokens(s, baseVar, {
			md: "1.5",
		});

		expect((scaleMd.value as CSS)?.type).toBe("css");
	});

	it("should work with CSS custom properties in base variable", () => {
		const s = styleframe();
		const scale = s.variable("scale", "1.5");
		const baseVar = s.variable("font-size", s.ref(scale));
		const { fontSizeLg } = useMultiplierDesignTokens(s, baseVar, {
			lg: 2,
		});

		expect((fontSizeLg.value as CSS)?.type).toBe("css");
	});

	describe("type safety", () => {
		it("should preserve exact variable names in return type", () => {
			const s = styleframe();
			const baseVar = s.variable("font-size", "1rem");
			const sizes = useMultiplierDesignTokens(s, baseVar, {
				sm: 0.875,
				lg: 1.25,
			});

			// Type assertions to verify the generic types are preserved
			const smSize: Variable<"font-size.sm"> = sizes.fontSizeSm;
			const lgSize: Variable<"font-size.lg"> = sizes.fontSizeLg;

			expect(smSize.name).toBe("font-size.sm");
			expect(lgSize.name).toBe("font-size.lg");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const baseVar = s.variable("spacing", "1rem");
			const { spacingExtraLarge } = useMultiplierDesignTokens(s, baseVar, {
				"extra-large": 3,
			});

			const typed: Variable<"spacing.extra-large"> = spacingExtraLarge;
			expect(typed.name).toBe("spacing.extra-large");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const baseVar = s.variable("size", "1rem");
			const sizeConfig = {
				sm: 0.5,
				lg: 2,
			} as const;

			const sizes = useMultiplierDesignTokens(s, baseVar, sizeConfig);

			expect(sizes.sizeSm.name).toBe("size.sm");
			expect(sizes.sizeLg.name).toBe("size.lg");
		});

		it("should handle default key with proper typing", () => {
			const s = styleframe();
			const baseVar = s.variable("font-size", "1rem");
			const { fontSize } = useMultiplierDesignTokens(s, baseVar, {
				default: 1,
			});

			const typed: Variable<"font-size"> = fontSize;
			expect(typed.name).toBe("font-size");
		});
	});

	describe("integration with real-world scenarios", () => {
		it("should create a complete typographic scale", () => {
			const s = styleframe();
			const fontSize = s.variable("font-size", "1rem");

			const scale = useMultiplierDesignTokens(s, fontSize, {
				xs: 0.75,
				sm: 0.875,
				default: 1,
				md: 1,
				lg: 1.125,
				xl: 1.25,
				"2xl": 1.5,
				"3xl": 1.875,
				"4xl": 2.25,
			});

			expect(Object.keys(scale)).toHaveLength(9);
			expect(scale.fontSizeXs.name).toBe("font-size.xs");
			expect(scale.fontSize4xl.name).toBe("font-size.4xl");
		});

		it("should create a spacing scale system", () => {
			const s = styleframe();
			const spacing = s.variable("spacing", "0.25rem");

			const scale = useMultiplierDesignTokens(s, spacing, {
				"0": 0,
				"1": 1,
				"2": 2,
				"3": 3,
				"4": 4,
				"6": 6,
				"8": 8,
				"12": 12,
				"16": 16,
			});

			expect(scale.spacing0.name).toBe("spacing.0");
			expect(scale.spacing16.name).toBe("spacing.16");
		});

		it("should work with ratio scale", () => {
			const s = styleframe();
			const base = s.variable("size", "1rem");

			const { scale } = useScaleDesignTokens(s);
			const scales = useScalePowersDesignTokens(s, scale);

			const sizes = useMultiplierDesignTokens(s, base, {
				xs: scales[-2],
				sm: scales[-1],
				md: scales[0],
				lg: scales[1],
				xl: scales[2],
			});

			expect(sizes.sizeXs.name).toBe("size.xs");
			expect(sizes.sizeXs.value).toMatchObject({ type: "css" });
			expect(sizes.sizeSm.name).toBe("size.sm");
			expect(sizes.sizeSm.value).toMatchObject({ type: "css" });
			expect(sizes.sizeMd.name).toBe("size.md");
			expect(sizes.sizeMd.value).toMatchObject({ type: "css" });
			expect(sizes.sizeLg.name).toBe("size.lg");
			expect(sizes.sizeLg.value).toMatchObject({ type: "css" });
			expect(sizes.sizeXl.name).toBe("size.xl");
			expect(sizes.sizeXl.value).toMatchObject({ type: "css" });
		});
	});

	describe("transpiling", () => {
		it("should transpile single multiplied variable correctly", () => {
			const s = styleframe();
			const baseVar = s.variable("font-size", "1rem");
			const { fontSizeLg } = useMultiplierDesignTokens(s, baseVar, {
				lg: 1.5,
			});

			const css = consumeCSS(fontSizeLg, s.options);
			expect(css).toBe(`--font-size--lg: calc(var(--font-size) * 1.5);`);
		});

		it("should transpile multiple multiplied variables correctly", () => {
			const s = styleframe();
			const baseVar = s.variable("spacing", "1rem");
			useMultiplierDesignTokens(s, baseVar, {
				xs: 0.5,
				sm: 0.75,
				md: 1,
				lg: 1.5,
				xl: 2,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--spacing: 1rem;
	--spacing--xs: calc(var(--spacing) * 0.5);
	--spacing--sm: calc(var(--spacing) * 0.75);
	--spacing--md: calc(var(--spacing) * 1);
	--spacing--lg: calc(var(--spacing) * 1.5);
	--spacing--xl: calc(var(--spacing) * 2);
}`);
		});

		it("should transpile negative multipliers correctly", () => {
			const s = styleframe();
			const baseVar = s.variable("offset", "10px");
			const { offsetReverse } = useMultiplierDesignTokens(s, baseVar, {
				reverse: -1,
			});

			const css = consumeCSS(offsetReverse, s.options);
			expect(css).toBe(`--offset--reverse: calc(var(--offset) * -1);`);
		});

		it("should transpile decimal multipliers correctly", () => {
			const s = styleframe();
			const baseVar = s.variable("font-size", "1rem");
			useMultiplierDesignTokens(s, baseVar, {
				xs: 0.75,
				sm: 0.875,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--font-size: 1rem;
	--font-size--xs: calc(var(--font-size) * 0.75);
	--font-size--sm: calc(var(--font-size) * 0.875);
}`);
		});

		it("should transpile variable references as multipliers", () => {
			const s = styleframe();
			const baseVar = s.variable("font-size", "1rem");
			const scaleVar = s.variable("scale", "1.333");
			useMultiplierDesignTokens(s, baseVar, {
				lg: s.ref(scaleVar),
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--font-size: 1rem;
	--scale: 1.333;
	--font-size--lg: calc(var(--font-size) * var(--scale));
}`);
		});

		it("should transpile with kebab-case names correctly", () => {
			const s = styleframe();
			const baseVar = s.variable("line-height", "1.5");
			useMultiplierDesignTokens(s, baseVar, {
				"extra-tight": 0.8,
				tight: 0.9,
				normal: 1,
				loose: 1.1,
				"extra-loose": 1.2,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--line-height: 1.5;
	--line-height--extra-tight: calc(var(--line-height) * 0.8);
	--line-height--tight: calc(var(--line-height) * 0.9);
	--line-height--normal: calc(var(--line-height) * 1);
	--line-height--loose: calc(var(--line-height) * 1.1);
	--line-height--extra-loose: calc(var(--line-height) * 1.2);
}`);
		});

		it("should transpile with numeric keys correctly", () => {
			const s = styleframe();
			const baseVar = s.variable("spacing", "0.25rem");
			useMultiplierDesignTokens(s, baseVar, {
				"0": 0,
				"1": 1,
				"2": 2,
				"4": 4,
				"8": 8,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--spacing: 0.25rem;
	--spacing--0: calc(var(--spacing) * 0);
	--spacing--1: calc(var(--spacing) * 1);
	--spacing--2: calc(var(--spacing) * 2);
	--spacing--4: calc(var(--spacing) * 4);
	--spacing--8: calc(var(--spacing) * 8);
}`);
		});

		it("should transpile complete typography scale", () => {
			const s = styleframe();
			const fontSize = s.variable("font-size", "1rem");
			useMultiplierDesignTokens(s, fontSize, {
				xs: 0.75,
				sm: 0.875,
				md: 1,
				lg: 1.125,
				xl: 1.25,
				"2xl": 1.5,
				"3xl": 1.875,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--font-size: 1rem;
	--font-size--xs: calc(var(--font-size) * 0.75);
	--font-size--sm: calc(var(--font-size) * 0.875);
	--font-size--md: calc(var(--font-size) * 1);
	--font-size--lg: calc(var(--font-size) * 1.125);
	--font-size--xl: calc(var(--font-size) * 1.25);
	--font-size--2xl: calc(var(--font-size) * 1.5);
	--font-size--3xl: calc(var(--font-size) * 1.875);
}`);
		});

		it("should transpile when base variable uses a reference", () => {
			const s = styleframe();
			const baseSize = s.variable("base-size", "16px");
			const fontSize = s.variable("font-size", s.ref(baseSize));
			useMultiplierDesignTokens(s, fontSize, {
				sm: 0.875,
				lg: 1.25,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--base-size: 16px;
	--font-size: var(--base-size);
	--font-size--sm: calc(var(--font-size) * 0.875);
	--font-size--lg: calc(var(--font-size) * 1.25);
}`);
		});

		it("should transpile with very precise decimal values", () => {
			const s = styleframe();
			const baseVar = s.variable("size", "1rem");
			const golden = 1.618;

			useMultiplierDesignTokens(s, baseVar, {
				"-1": Math.pow(golden, -1),
				"1": golden,
				"2": Math.pow(golden, 2),
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(`--size: 1rem;`);
			expect(css).toContain(`--size---1: calc(var(--size) * ${Math.pow(golden, -1)});`);
			expect(css).toContain(`--size--1: calc(var(--size) * ${golden});`);
			expect(css).toContain(`--size--2: calc(var(--size) * ${Math.pow(golden, 2)});`);
		});

		it("should transpile with complex variable names", () => {
			const s = styleframe();
			const baseVar = s.variable("component-button-padding", "0.5rem");
			useMultiplierDesignTokens(s, baseVar, {
				sm: 0.75,
				md: 1,
				lg: 1.5,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--component-button-padding: 0.5rem;
	--component-button-padding--sm: calc(var(--component-button-padding) * 0.75);
	--component-button-padding--md: calc(var(--component-button-padding) * 1);
	--component-button-padding--lg: calc(var(--component-button-padding) * 1.5);
}`);
		});

		it("should transpile zero multiplier correctly", () => {
			const s = styleframe();
			const baseVar = s.variable("margin", "1rem");
			const { marginNone } = useMultiplierDesignTokens(s, baseVar, {
				none: 0,
			});

			const css = consumeCSS(marginNone, s.options);
			expect(css).toBe(`--margin--none: calc(var(--margin) * 0);`);
		});

		it("should transpile with string number multipliers", () => {
			const s = styleframe();
			const baseVar = s.variable("scale", "1rem");
			useMultiplierDesignTokens(s, baseVar, {
				md: "1.5",
				lg: "2",
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--scale: 1rem;
	--scale--md: calc(var(--scale) * 1.5);
	--scale--lg: calc(var(--scale) * 2);
}`);
		});

		it("should transpile multiple base variables with multipliers", () => {
			const s = styleframe();
			const fontSize = s.variable("font-size", "1rem");
			const spacing = s.variable("spacing", "0.5rem");

			useMultiplierDesignTokens(s, fontSize, {
				sm: 0.875,
				lg: 1.25,
			});

			useMultiplierDesignTokens(s, spacing, {
				sm: 0.5,
				lg: 2,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toBe(`:root {
	--font-size: 1rem;
	--spacing: 0.5rem;
	--font-size--sm: calc(var(--font-size) * 0.875);
	--font-size--lg: calc(var(--font-size) * 1.25);
	--spacing--sm: calc(var(--spacing) * 0.5);
	--spacing--lg: calc(var(--spacing) * 2);
}`);
		});

		it("should work with ratio scale", () => {
			const s = styleframe();
			const base = s.variable("size", "1rem");

			const { scale } = useScaleDesignTokens(s);
			const scales = useScalePowersDesignTokens(s, scale);

			useMultiplierDesignTokens(s, base, {
				xs: scales[-2],
				sm: scales[-1],
				md: scales[0],
				lg: scales[1],
				xl: scales[2],
				xxl: scales[3],
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--size: 1rem;
	--scale--minor-second: 1.067;
	--scale--major-second: 1.125;
	--scale--minor-third: 1.2;
	--scale--major-third: 1.25;
	--scale--perfect-fourth: 1.333;
	--scale--augmented-fourth: 1.414;
	--scale--perfect-fifth: 1.5;
	--scale--golden: 1.618;
	--scale: var(--scale--minor-third);
	--size--xs: calc(var(--size) * 1 / var(--scale) / var(--scale));
	--size--sm: calc(var(--size) * 1 / var(--scale));
	--size--md: calc(var(--size) * 1);
	--size--lg: calc(var(--size) * var(--scale));
	--size--xl: calc(var(--size) * var(--scale) * var(--scale));
	--size--xxl: calc(var(--size) * var(--scale) * var(--scale) * var(--scale));
}`);
		});
	});
});
