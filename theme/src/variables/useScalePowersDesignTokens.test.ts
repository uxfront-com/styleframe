import type { TokenValue } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { scalePowerValues } from "../values";
import { useScaleDesignTokens } from "./useScaleDesignTokens";
import { useScalePowersDesignTokens } from "./useScalePowersDesignTokens";

describe("useScalePowersDesignTokens", () => {
	it("should create scale powers with default powers array", () => {
		const s = styleframe();
		const { scaleGolden } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scaleGolden, scalePowerValues);

		// Keys are in insertion order
		expect(Object.keys(powers).length).toBe(scalePowerValues.length);
		for (const n of scalePowerValues) {
			expect(powers[n]).toBeDefined();
		}
	});

	it("should create CSS templates for each power", () => {
		const s = styleframe();
		const { scaleMajorThird } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scaleMajorThird, [1, 2, 3]);

		expect(powers[1]).toHaveProperty("type", "css");
		expect(powers[2]).toHaveProperty("type", "css");
		expect(powers[3]).toHaveProperty("type", "css");
	});

	it("should handle custom powers array", () => {
		const s = styleframe();
		const { scaleGolden } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scaleGolden, [0, 1, 10]);

		expect(Object.keys(powers).length).toBe(3);
		expect(powers[0]).toBeDefined();
		expect(powers[1]).toBeDefined();
		expect(powers[10]).toBeDefined();
	});

	it("should handle single power", () => {
		const s = styleframe();
		const { scaleMajorSecond } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scaleMajorSecond, [2]);

		expect(Object.keys(powers)).toEqual(["2"]);
		expect(powers[2]).toBeDefined();
	});

	it("should handle empty powers array", () => {
		const s = styleframe();
		const { scaleMinorThird } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scaleMinorThird, []);

		expect(Object.keys(powers)).toEqual([]);
		expect(powers).toEqual({});
	});

	it("should work with different scale variables", () => {
		const s = styleframe();
		const { scaleMinorSecond, scaleMajorSecond, scaleGolden } = useScaleDesignTokens(s);

		const powers1 = useScalePowersDesignTokens(s, scaleMinorSecond, [1, 2]);
		const powers2 = useScalePowersDesignTokens(s, scaleMajorSecond, [1, 2]);
		const powers3 = useScalePowersDesignTokens(s, scaleGolden, [1, 2]);

		expect(powers1[1]).toBeDefined();
		expect(powers2[1]).toBeDefined();
		expect(powers3[1]).toBeDefined();
	});

	it("should compile to correct CSS with positive powers", () => {
		const s = styleframe();
		const { scaleMajorThird } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scaleMajorThird, [1, 2] as const);

		const baseSize = s.variable("base", "1rem");
		s.selector(".scale-1", ({ variable }) => {
			variable("font-size", s.css`calc(${s.ref(baseSize)} * ${powers[1]})`);
		});
		s.selector(".scale-2", ({ variable }) => {
			variable("font-size", s.css`calc(${s.ref(baseSize)} * (${powers[2]}))`);
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--scale--minor-second: 1.067;
	--scale--major-second: 1.125;
	--scale--minor-third: 1.2;
	--scale--major-third: 1.25;
	--scale--perfect-fourth: 1.333;
	--scale--augmented-fourth: 1.414;
	--scale--perfect-fifth: 1.5;
	--scale--golden: 1.618;
	--scale: var(--scale--minor-third);
	--base: 1rem;
}

.scale-1 {
	--font-size: calc(var(--base) * var(--scale--major-third));
}

.scale-2 {
	--font-size: calc(var(--base) * (var(--scale--major-third) * var(--scale--major-third)));
}`);
	});

	it("should compile to correct CSS with negative powers", () => {
		const s = styleframe();
		const { scaleGolden } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scaleGolden, [-1, -2] as const);

		const baseSize = s.variable("base", "1rem");
		s.selector(".scale-neg-1", ({ variable }) => {
			variable("font-size", s.css`calc(${s.ref(baseSize)} * ${powers[-1]})`);
		});
		s.selector(".scale-neg-2", ({ variable }) => {
			variable("font-size", s.css`calc(${s.ref(baseSize)} * ${powers[-2]})`);
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--scale--minor-second: 1.067;
	--scale--major-second: 1.125;
	--scale--minor-third: 1.2;
	--scale--major-third: 1.25;
	--scale--perfect-fourth: 1.333;
	--scale--augmented-fourth: 1.414;
	--scale--perfect-fifth: 1.5;
	--scale--golden: 1.618;
	--scale: var(--scale--minor-third);
	--base: 1rem;
}

.scale-neg-1 {
	--font-size: calc(var(--base) * 1 / var(--scale--golden));
}

.scale-neg-2 {
	--font-size: calc(var(--base) * 1 / var(--scale--golden) / var(--scale--golden));
}`);
	});

	it("should handle mixed positive and negative powers", () => {
		const s = styleframe();
		const { scalePerfectFourth } = useScaleDesignTokens(s);
		const powers = useScalePowersDesignTokens(s, scalePerfectFourth, [-3, -1, 1, 3] as const);

		expect(Object.keys(powers).length).toBe(4);
		expect(powers[-3]).toBeDefined();
		expect(powers[-1]).toBeDefined();
		expect(powers[1]).toBeDefined();
		expect(powers[3]).toBeDefined();
	});

	describe("type safety", () => {
		it("should return Record<number, TokenValue>", () => {
			const s = styleframe();
			const { scaleGolden } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleGolden, [1, 2, 3] as const);

			// Type check
			const result: Record<number, TokenValue> = powers;
			expect(result).toBeDefined();
		});

		it("should accept any Variable as scale parameter", () => {
			const s = styleframe();
			const customScale = s.variable("custom-scale", 1.5);
			const powers = useScalePowersDesignTokens(s, customScale, [1, 2] as const);

			expect(powers[1]).toBeDefined();
			expect(powers[2]).toBeDefined();
		});
	});

	describe("practical usage", () => {
		it("should create modular typography scale", () => {
			const s = styleframe();
			const { scale } = useScaleDesignTokens(s);

			const powers = useScalePowersDesignTokens(s, scale, [-2, -1, 1, 2, 3] as const);

			const fontSize = s.variable("font-size", "1rem");

			s.variable("font-size-xs", s.css`calc(${s.ref(fontSize)} * ${powers[-2]})`);
			s.variable("font-size-sm", s.css`calc(${s.ref(fontSize)} * ${powers[-1]})`);
			s.variable("font-size-md", s.ref(fontSize));
			s.variable("font-size-lg", s.css`calc(${s.ref(fontSize)} * ${powers[1]})`);
			s.variable("font-size-xl", s.css`calc(${s.ref(fontSize)} * ${powers[2]})`);
			s.variable("font-size-2xl", s.css`calc(${s.ref(fontSize)} * ${powers[3]})`);

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--scale--minor-second: 1.067;
	--scale--major-second: 1.125;
	--scale--minor-third: 1.2;
	--scale--major-third: 1.25;
	--scale--perfect-fourth: 1.333;
	--scale--augmented-fourth: 1.414;
	--scale--perfect-fifth: 1.5;
	--scale--golden: 1.618;
	--scale: var(--scale--minor-third);
	--font-size: 1rem;
	--font-size-xs: calc(var(--font-size) * 1 / var(--scale) / var(--scale));
	--font-size-sm: calc(var(--font-size) * 1 / var(--scale));
	--font-size-md: var(--font-size);
	--font-size-lg: calc(var(--font-size) * var(--scale));
	--font-size-xl: calc(var(--font-size) * var(--scale) * var(--scale));
	--font-size-2xl: calc(var(--font-size) * var(--scale) * var(--scale) * var(--scale));
}`);
		});

		it("should create spacing scale with golden ratio", () => {
			const s = styleframe();
			const { scaleGolden } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleGolden, [-1, 0, 1, 2]);

			const baseSpacing = s.variable("spacing-base", "1rem");
			s.variable("spacing-sm", s.css`calc(${s.ref(baseSpacing)} * ${powers[-1]})`);
			s.variable("spacing-md", s.css`calc(${s.ref(baseSpacing)} * ${powers[0]})`);
			s.variable("spacing-lg", s.css`calc(${s.ref(baseSpacing)} * ${powers[1]})`);
			s.variable("spacing-xl", s.css`calc(${s.ref(baseSpacing)} * ${powers[2]})`);

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--scale--minor-second: 1.067;
	--scale--major-second: 1.125;
	--scale--minor-third: 1.2;
	--scale--major-third: 1.25;
	--scale--perfect-fourth: 1.333;
	--scale--augmented-fourth: 1.414;
	--scale--perfect-fifth: 1.5;
	--scale--golden: 1.618;
	--scale: var(--scale--minor-third);
	--spacing-base: 1rem;
	--spacing-sm: calc(var(--spacing-base) * 1 / var(--scale--golden));
	--spacing-md: calc(var(--spacing-base) * 1);
	--spacing-lg: calc(var(--spacing-base) * var(--scale--golden));
	--spacing-xl: calc(var(--spacing-base) * var(--scale--golden) * var(--scale--golden));
}`);
		});

		it("should work with default scale powers constant", () => {
			const s = styleframe();
			const { scaleMajorSecond } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleMajorSecond, scalePowerValues);

			// scalePowerValues = [-2, -1, 1, 2, 3, 4, 5]
			expect(Object.keys(powers).length).toBe(scalePowerValues.length);
			expect(powers[-2]).toBeDefined();
			expect(powers[-1]).toBeDefined();
			expect(powers[1]).toBeDefined();
			expect(powers[2]).toBeDefined();
			expect(powers[3]).toBeDefined();
			expect(powers[4]).toBeDefined();
			expect(powers[5]).toBeDefined();
		});

		it("should work with different scale ratios", () => {
			const s = styleframe();
			const { scaleMajorSecond, scaleGolden } = useScaleDesignTokens(s);

			const mobilePowers = useScalePowersDesignTokens(s, scaleMajorSecond, [1, 2, 3]);
			const desktopPowers = useScalePowersDesignTokens(s, scaleGolden, [1, 2, 3]);

			const baseSize = s.variable("size-base", "1rem");

			s.selector(".mobile", ({ variable }) => {
				variable("font-size", s.css`calc(${s.ref(baseSize)} * ${mobilePowers[2]})`);
			});

			s.selector(".desktop", ({ variable }) => {
				variable("font-size", s.css`calc(${s.ref(baseSize)} * ${desktopPowers[2]})`);
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--scale--minor-second: 1.067;
	--scale--major-second: 1.125;
	--scale--minor-third: 1.2;
	--scale--major-third: 1.25;
	--scale--perfect-fourth: 1.333;
	--scale--augmented-fourth: 1.414;
	--scale--perfect-fifth: 1.5;
	--scale--golden: 1.618;
	--scale: var(--scale--minor-third);
	--size-base: 1rem;
}

.mobile {
	--font-size: calc(var(--size-base) * var(--scale--major-second) * var(--scale--major-second));
}

.desktop {
	--font-size: calc(var(--size-base) * var(--scale--golden) * var(--scale--golden));
}`);
		});
	});

	describe("edge cases", () => {
		it("should handle power of 0", () => {
			const s = styleframe();
			const { scaleMajorThird } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleMajorThird, [0]);

			expect(powers[0]).toBeDefined();
			expect(powers[0]).toHaveProperty("type", "css");
		});

		it("should handle duplicate powers in array", () => {
			const s = styleframe();
			const { scaleMinorSecond } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleMinorSecond, [1, 1, 2, 2]);

			// Should overwrite duplicates, resulting in unique keys
			expect(Object.keys(powers).length).toBe(2);
			expect(powers[1]).toBeDefined();
			expect(powers[2]).toBeDefined();
		});

		it("should handle unsorted powers array", () => {
			const s = styleframe();
			const { scalePerfectFifth } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scalePerfectFifth, [3, -1, 2, -2, 1]);

			expect(Object.keys(powers).length).toBe(5);
			expect(powers[-2]).toBeDefined();
			expect(powers[-1]).toBeDefined();
			expect(powers[1]).toBeDefined();
			expect(powers[2]).toBeDefined();
			expect(powers[3]).toBeDefined();
		});

		it("should handle power of 1", () => {
			const s = styleframe();
			const { scaleAugmentedFourth } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleAugmentedFourth, [1]);

			expect(powers[1]).toBeDefined();
			expect(powers[1]).toHaveProperty("type", "css");
		});

		it("should handle power of -1", () => {
			const s = styleframe();
			const { scaleAugmentedFourth } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleAugmentedFourth, [-1]);

			expect(powers[-1]).toBeDefined();
			expect(powers[-1]).toHaveProperty("type", "css");
		});

		it("should handle large powers", () => {
			const s = styleframe();
			const { scaleMajorSecond } = useScaleDesignTokens(s);
			const powers = useScalePowersDesignTokens(s, scaleMajorSecond, [10, -10]);

			expect(powers[10]).toBeDefined();
			expect(powers[-10]).toBeDefined();
		});
	});
});
