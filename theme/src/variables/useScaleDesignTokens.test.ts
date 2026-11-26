import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { scaleValues } from "../values";
import { useScaleDesignTokens } from "./useScaleDesignTokens";

describe("useScaleDesignTokens", () => {
	it("should create all scale variables with correct names and values", () => {
		const s = styleframe();
		const {
			scaleMinorSecond,
			scaleMajorSecond,
			scaleMinorThird,
			scaleMajorThird,
			scalePerfectFourth,
			scaleAugmentedFourth,
			scalePerfectFifth,
			scaleGolden,
			scale,
		} = useScaleDesignTokens(s);

		expect(scaleMinorSecond).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.minor-second",
			value: 1.067,
		});

		expect(scaleMajorSecond).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.major-second",
			value: 1.125,
		});

		expect(scaleMinorThird).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.minor-third",
			value: 1.2,
		});

		expect(scaleMajorThird).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.major-third",
			value: 1.25,
		});

		expect(scalePerfectFourth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.perfect-fourth",
			value: 1.333,
		});

		expect(scaleAugmentedFourth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.augmented-fourth",
			value: 1.414,
		});

		expect(scalePerfectFifth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.perfect-fifth",
			value: 1.5,
		});

		expect(scaleGolden).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale.golden",
			value: 1.618,
		});

		expect(scale).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "scale",
			value: {
				type: "reference",
				name: "scale.minor-third",
			},
		});
	});

	it("should add all scale variables to root", () => {
		const s = styleframe();
		useScaleDesignTokens(s);

		expect(s.root.variables).toHaveLength(9);
		expect(s.root.variables[0]?.name).toBe("scale.minor-second");
		expect(s.root.variables[1]?.name).toBe("scale.major-second");
		expect(s.root.variables[2]?.name).toBe("scale.minor-third");
		expect(s.root.variables[3]?.name).toBe("scale.major-third");
		expect(s.root.variables[4]?.name).toBe("scale.perfect-fourth");
		expect(s.root.variables[5]?.name).toBe("scale.augmented-fourth");
		expect(s.root.variables[6]?.name).toBe("scale.perfect-fifth");
		expect(s.root.variables[7]?.name).toBe("scale.golden");
		expect(s.root.variables[8]?.name).toBe("scale");
	});

	it("should return all scale variables in an object", () => {
		const s = styleframe();
		const scales = useScaleDesignTokens(s);

		expect(Object.keys(scales)).toEqual([
			"scaleMinorSecond",
			"scaleMajorSecond",
			"scaleMinorThird",
			"scaleMajorThird",
			"scalePerfectFourth",
			"scaleAugmentedFourth",
			"scalePerfectFifth",
			"scaleGolden",
			"scale",
		]);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useScaleDesignTokens(s);

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--scale--minor-second: 1.067;
	--scale--major-second: 1.125;
	--scale--minor-third: 1.2;
	--scale--major-third: 1.25;
	--scale--perfect-fourth: 1.333;
	--scale--augmented-fourth: 1.414;
	--scale--perfect-fifth: 1.5;
	--scale--golden: 1.618;
	--scale: var(--scale--minor-third);
}`);
	});

	it("should compile individual scale variable to correct CSS", () => {
		const s = styleframe();
		const { scaleGolden } = useScaleDesignTokens(s);

		const css = consumeCSS(scaleGolden, s.options);

		expect(css).toBe("--scale--golden: 1.618;");
	});

	it("should not create duplicate variables when called multiple times", () => {
		const s = styleframe();
		const scales1 = useScaleDesignTokens(s);
		const scales2 = useScaleDesignTokens(s);

		// Should return the same variables (default: true behavior)
		expect(scales1.scaleGolden).toBe(scales2.scaleGolden);
		expect(scales1.scale).toBe(scales2.scale);
		expect(s.root.variables).toHaveLength(9);
	});

	it("should allow scale variables to be used as references", () => {
		const s = styleframe();
		const { scaleGolden } = useScaleDesignTokens(s);

		const customScale = s.variable("custom-scale", s.ref(scaleGolden));

		expect(customScale.value).toEqual({
			type: "reference",
			name: "scale.golden",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("--custom-scale: var(--scale--golden);");
	});

	it("should work with selector overrides", () => {
		const s = styleframe();
		const { scaleMajorThird } = useScaleDesignTokens(s);

		s.selector(".custom-scale", ({ variable }) => {
			variable(scaleMajorThird, 1.5);
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toContain("--scale--major-third: 1.25;");
		expect(css).toContain(".custom-scale");
		expect(css).toContain("--scale--major-third: 1.5;");
	});

	describe("type safety", () => {
		it("should preserve exact scale variable names in return type", () => {
			const s = styleframe();
			const scales = useScaleDesignTokens(s);

			// Type assertions to verify the generic types are preserved
			const minorSecond: Variable<"scale.minor-second"> = scales.scaleMinorSecond;
			const majorSecond: Variable<"scale.major-second"> = scales.scaleMajorSecond;
			const minorThird: Variable<"scale.minor-third"> = scales.scaleMinorThird;
			const majorThird: Variable<"scale.major-third"> = scales.scaleMajorThird;
			const perfectFourth: Variable<"scale.perfect-fourth"> = scales.scalePerfectFourth;
			const augmentedFourth: Variable<"scale.augmented-fourth"> = scales.scaleAugmentedFourth;
			const perfectFifth: Variable<"scale.perfect-fifth"> = scales.scalePerfectFifth;
			const golden: Variable<"scale.golden"> = scales.scaleGolden;
			const scale: Variable<"scale"> = scales.scale;

			expect(minorSecond.name).toBe("scale.minor-second");
			expect(majorSecond.name).toBe("scale.major-second");
			expect(minorThird.name).toBe("scale.minor-third");
			expect(majorThird.name).toBe("scale.major-third");
			expect(perfectFourth.name).toBe("scale.perfect-fourth");
			expect(augmentedFourth.name).toBe("scale.augmented-fourth");
			expect(perfectFifth.name).toBe("scale.perfect-fifth");
			expect(golden.name).toBe("scale.golden");
			expect(scale.name).toBe("scale");
		});

		it("should have correct numeric value types", () => {
			const s = styleframe();
			const scales = useScaleDesignTokens(s);

			expect(typeof scales.scaleMinorSecond.value).toBe("number");
			expect(typeof scales.scaleMajorSecond.value).toBe("number");
			expect(typeof scales.scaleMinorThird.value).toBe("number");
			expect(typeof scales.scaleMajorThird.value).toBe("number");
			expect(typeof scales.scalePerfectFourth.value).toBe("number");
			expect(typeof scales.scaleAugmentedFourth.value).toBe("number");
			expect(typeof scales.scalePerfectFifth.value).toBe("number");
			expect(typeof scales.scaleGolden.value).toBe("number");
			expect(typeof scales.scale.value).toBe("object");
		});
	});

	describe("default scale", () => {
		it("should create a default scale variable referencing minor-third by default", () => {
			const s = styleframe();
			const { scale } = useScaleDesignTokens(s);

			expect(scale).toEqual({
				type: "variable",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "scale",
				value: {
					type: "reference",
					name: "scale.minor-third",
				},
			});
		});

		it("should allow customizing the default scale", () => {
			const s = styleframe();
			const { scale } = useScaleDesignTokens(s, {
				...scaleValues,
				default: "@scale.perfect-fourth",
			});

			expect(scale.value).toEqual({
				type: "reference",
				name: "scale.perfect-fourth",
			});
		});

		it("should compile default scale to CSS correctly", () => {
			const s = styleframe();
			useScaleDesignTokens(s, {
				...scaleValues,
				default: "@scale.golden",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toContain("--scale: var(--scale--golden);");
		});

		it("should work with different default scales", () => {
			const scales = [
				"minor-second",
				"major-second",
				"minor-third",
				"major-third",
				"perfect-fourth",
				"augmented-fourth",
				"perfect-fifth",
				"golden",
			];

			for (const scaleName of scales) {
				const s = styleframe();
				const { scale } = useScaleDesignTokens(s, {
					...scaleValues,
					default: `@scale.${scaleName}`,
				});

				expect(scale.value).toEqual({
					type: "reference",
					name: `scale.${scaleName}`,
				});
			}
		});
	});

	describe("mathematical scale relationships", () => {
		it("should have scales in ascending order", () => {
			const s = styleframe();
			const {
				scaleMinorSecond,
				scaleMajorSecond,
				scaleMinorThird,
				scaleMajorThird,
				scalePerfectFourth,
				scaleAugmentedFourth,
				scalePerfectFifth,
				scaleGolden,
			} = useScaleDesignTokens(s);

			expect(scaleMinorSecond.value).toBeLessThan(scaleMajorSecond.value as number);
			expect(scaleMajorSecond.value).toBeLessThan(scaleMinorThird.value as number);
			expect(scaleMinorThird.value).toBeLessThan(scaleMajorThird.value as number);
			expect(scaleMajorThird.value).toBeLessThan(scalePerfectFourth.value as number);
			expect(scalePerfectFourth.value).toBeLessThan(scaleAugmentedFourth.value as number);
			expect(scaleAugmentedFourth.value).toBeLessThan(scalePerfectFifth.value as number);
			expect(scalePerfectFifth.value).toBeLessThan(scaleGolden.value as number);
		});

		it("should have golden ratio as the largest scale", () => {
			const s = styleframe();
			const scales = useScaleDesignTokens(s);
			const values = Object.values(scales)
				.filter((v) => typeof v.value === "number")
				.map((v) => v.value as number);
			const maxValue = Math.max(...values);

			expect(scales.scaleGolden.value).toBe(maxValue);
			expect(scales.scaleGolden.value).toBe(1.618);
		});

		it("should have minor second as the smallest scale", () => {
			const s = styleframe();
			const scales = useScaleDesignTokens(s);
			const values = Object.values(scales)
				.filter((v) => typeof v.value === "number")
				.map((v) => v.value as number);
			const minValue = Math.min(...values);

			expect(scales.scaleMinorSecond.value).toBe(minValue);
			expect(scales.scaleMinorSecond.value).toBe(1.067);
		});
	});

	describe("practical usage", () => {
		it("should work for creating modular typography scales", () => {
			const s = styleframe();
			const { scaleMajorThird } = useScaleDesignTokens(s);

			const baseSize = s.variable("font-size-base", "1rem");
			const fontSizeH1 = s.variable(
				"font-size-h1",
				s.ref(baseSize, `calc(${s.ref(baseSize)} * ${s.ref(scaleMajorThird)})`),
			);

			expect(fontSizeH1.value).toEqual({
				type: "reference",
				name: "font-size-base",
				fallback: `calc(${s.ref(baseSize)} * ${s.ref(scaleMajorThird)})`,
			});
		});

		it("should work for creating spacing scales", () => {
			const s = styleframe();
			const { scaleGolden } = useScaleDesignTokens(s);

			const spacingBase = s.variable("spacing-base", "1rem");
			s.variable("spacing-lg", s.css`calc(${s.ref(spacingBase)} * ${s.ref(scaleGolden)})`);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--spacing-base: 1rem;");
			expect(css).toContain("--scale--golden: 1.618;");
			expect(css).toContain("--spacing-lg: calc(var(--spacing-base) * var(--scale--golden));");
		});
	});
});
