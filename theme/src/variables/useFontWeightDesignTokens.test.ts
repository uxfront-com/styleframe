import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { fontWeightValues } from "../values";
import { useFontWeightDesignTokens } from "./useFontWeightDesignTokens";

describe("useFontWeightDesignTokens", () => {
	it("should create all font weight variables with correct names and values", () => {
		const s = styleframe();
		const {
			fontWeightExtralight,
			fontWeightLight,
			fontWeightNormal,
			fontWeightMedium,
			fontWeightSemibold,
			fontWeightBold,
			fontWeightBlack,
			fontWeightLighter,
			fontWeightBolder,
			fontWeight,
		} = useFontWeightDesignTokens(s);

		expect(fontWeightExtralight).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.extralight",
			value: 200,
		});

		expect(fontWeightLight).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.light",
			value: 300,
		});

		expect(fontWeightNormal).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.normal",
			value: "normal",
		});

		expect(fontWeightMedium).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.medium",
			value: 500,
		});

		expect(fontWeightSemibold).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.semibold",
			value: 600,
		});

		expect(fontWeightBold).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.bold",
			value: "bold",
		});

		expect(fontWeightBlack).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.black",
			value: 900,
		});

		expect(fontWeightLighter).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.lighter",
			value: "lighter",
		});

		expect(fontWeightBolder).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.bolder",
			value: "bolder",
		});

		expect(fontWeight).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight",
			value: {
				type: "reference",
				name: "font-weight.normal",
			},
		});
	});

	it("should add all font weight variables to root", () => {
		const s = styleframe();
		useFontWeightDesignTokens(s);

		expect(s.root.variables).toHaveLength(11);
		expect(s.root.variables[0]?.name).toBe("font-weight.extralight");
		expect(s.root.variables[1]?.name).toBe("font-weight.light");
		expect(s.root.variables[2]?.name).toBe("font-weight.normal");
		expect(s.root.variables[3]?.name).toBe("font-weight.medium");
		expect(s.root.variables[4]?.name).toBe("font-weight.semibold");
		expect(s.root.variables[5]?.name).toBe("font-weight.bold");
		expect(s.root.variables[6]?.name).toBe("font-weight.black");
		expect(s.root.variables[7]?.name).toBe("font-weight.lighter");
		expect(s.root.variables[8]?.name).toBe("font-weight.bolder");
		expect(s.root.variables[9]?.name).toBe("font-weight.inherit");
		expect(s.root.variables[10]?.name).toBe("font-weight");
	});

	it("should return all font weight variables in an object", () => {
		const s = styleframe();
		const fontWeights = useFontWeightDesignTokens(s);

		expect(Object.keys(fontWeights)).toEqual([
			"fontWeightExtralight",
			"fontWeightLight",
			"fontWeightNormal",
			"fontWeightMedium",
			"fontWeightSemibold",
			"fontWeightBold",
			"fontWeightBlack",
			"fontWeightLighter",
			"fontWeightBolder",
			"fontWeightInherit",
			"fontWeight",
		]);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useFontWeightDesignTokens(s);

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
}`);
	});

	it("should compile individual font weight variable to correct CSS", () => {
		const s = styleframe();
		const { fontWeightSemibold } = useFontWeightDesignTokens(s);

		const css = consumeCSS(fontWeightSemibold, s.options);

		expect(css).toBe("--font-weight--semibold: 600;");
	});

	it("should not create duplicate variables when called multiple times", () => {
		const s = styleframe();
		const fontWeights1 = useFontWeightDesignTokens(s);
		const fontWeights2 = useFontWeightDesignTokens(s);

		// Should return the same variables (default: true behavior)
		expect(fontWeights1.fontWeightExtralight).toBe(fontWeights2.fontWeightExtralight);
		expect(fontWeights1.fontWeight).toBe(fontWeights2.fontWeight);
		expect(s.root.variables).toHaveLength(11);
	});

	it("should allow font weight variables to be used as references", () => {
		const s = styleframe();
		const { fontWeightBold } = useFontWeightDesignTokens(s);

		const customFontWeight = s.variable("custom-font-weight", s.ref(fontWeightBold));

		expect(customFontWeight.value).toEqual({
			type: "reference",
			name: "font-weight.bold",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
	--custom-font-weight: var(--font-weight--bold);
}`);
	});

	it("should work with selector overrides", () => {
		const s = styleframe();
		const { fontWeightNormal } = useFontWeightDesignTokens(s);

		s.selector(".custom-font-weight", ({ variable }) => {
			variable(fontWeightNormal, 450);
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
}

.custom-font-weight {
	--font-weight--normal: 450;
}`);
	});

	describe("type safety", () => {
		it("should preserve exact font weight variable names in return type", () => {
			const s = styleframe();
			const fontWeights = useFontWeightDesignTokens(s);

			// Type assertions to verify the generic types are preserved
			const extralight: Variable<"font-weight.extralight"> = fontWeights.fontWeightExtralight;
			const light: Variable<"font-weight.light"> = fontWeights.fontWeightLight;
			const normal: Variable<"font-weight.normal"> = fontWeights.fontWeightNormal;
			const medium: Variable<"font-weight.medium"> = fontWeights.fontWeightMedium;
			const semibold: Variable<"font-weight.semibold"> = fontWeights.fontWeightSemibold;
			const bold: Variable<"font-weight.bold"> = fontWeights.fontWeightBold;
			const black: Variable<"font-weight.black"> = fontWeights.fontWeightBlack;
			const lighter: Variable<"font-weight.lighter"> = fontWeights.fontWeightLighter;
			const bolder: Variable<"font-weight.bolder"> = fontWeights.fontWeightBolder;
			const fontWeight: Variable<"font-weight"> = fontWeights.fontWeight;

			expect(extralight.name).toBe("font-weight.extralight");
			expect(light.name).toBe("font-weight.light");
			expect(normal.name).toBe("font-weight.normal");
			expect(medium.name).toBe("font-weight.medium");
			expect(semibold.name).toBe("font-weight.semibold");
			expect(bold.name).toBe("font-weight.bold");
			expect(black.name).toBe("font-weight.black");
			expect(lighter.name).toBe("font-weight.lighter");
			expect(bolder.name).toBe("font-weight.bolder");
			expect(fontWeight.name).toBe("font-weight");
		});

		it("should have correct value types", () => {
			const s = styleframe();
			const fontWeights = useFontWeightDesignTokens(s);

			expect(typeof fontWeights.fontWeightExtralight.value).toBe("number");
			expect(typeof fontWeights.fontWeightLight.value).toBe("number");
			expect(typeof fontWeights.fontWeightNormal.value).toBe("string");
			expect(typeof fontWeights.fontWeightMedium.value).toBe("number");
			expect(typeof fontWeights.fontWeightSemibold.value).toBe("number");
			expect(typeof fontWeights.fontWeightBold.value).toBe("string");
			expect(typeof fontWeights.fontWeightBlack.value).toBe("number");
			expect(typeof fontWeights.fontWeightLighter.value).toBe("string");
			expect(typeof fontWeights.fontWeightBolder.value).toBe("string");
			expect(typeof fontWeights.fontWeight.value).toBe("object");
		});
	});

	describe("default font weight", () => {
		it("should create a default font weight variable referencing normal by default", () => {
			const s = styleframe();
			const { fontWeight } = useFontWeightDesignTokens(s);

			expect(fontWeight).toEqual({
				type: "variable",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "font-weight",
				value: {
					type: "reference",
					name: "font-weight.normal",
				},
			});
		});

		it("should allow customizing the default font weight", () => {
			const s = styleframe();
			const { fontWeight } = useFontWeightDesignTokens(s, {
				...fontWeightValues,
				default: "@font-weight.bold",
			});

			expect(fontWeight.value).toEqual({
				type: "reference",
				name: "font-weight.bold",
			});
		});

		it("should compile default font weight to CSS correctly", () => {
			const s = styleframe();
			useFontWeightDesignTokens(s, {
				...fontWeightValues,
				default: "@font-weight.semibold",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--semibold);
}`);
		});

		it("should work with different default font weights", () => {
			const fontWeights = [
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"black",
				"lighter",
				"bolder",
			];

			for (const fontWeightName of fontWeights) {
				const s = styleframe();
				const { fontWeight } = useFontWeightDesignTokens(s, {
					...fontWeightValues,
					default: `@font-weight.${fontWeightName}`,
				});

				expect(fontWeight.value).toEqual({
					type: "reference",
					name: `font-weight.${fontWeightName}`,
				});
			}
		});
	});

	describe("font weight value relationships", () => {
		it("should have numeric weights in ascending order", () => {
			const s = styleframe();
			const {
				fontWeightExtralight,
				fontWeightLight,
				fontWeightMedium,
				fontWeightSemibold,
				fontWeightBlack,
			} = useFontWeightDesignTokens(s);

			expect(fontWeightExtralight.value).toBe(200);
			expect(fontWeightLight.value).toBe(300);
			expect(fontWeightMedium.value).toBe(500);
			expect(fontWeightSemibold.value).toBe(600);
			expect(fontWeightBlack.value).toBe(900);

			expect(fontWeightExtralight.value).toBeLessThan(fontWeightLight.value as number);
			expect(fontWeightLight.value).toBeLessThan(fontWeightMedium.value as number);
			expect(fontWeightMedium.value).toBeLessThan(fontWeightSemibold.value as number);
			expect(fontWeightSemibold.value).toBeLessThan(fontWeightBlack.value as number);
		});

		it("should have black as the heaviest numeric weight", () => {
			const s = styleframe();
			const fontWeights = useFontWeightDesignTokens(s);
			const numericValues = Object.values(fontWeights)
				.filter((v) => typeof v.value === "number")
				.map((v) => v.value as number);
			const maxValue = Math.max(...numericValues);

			expect(fontWeights.fontWeightBlack.value).toBe(maxValue);
			expect(fontWeights.fontWeightBlack.value).toBe(900);
		});

		it("should have extralight as the lightest numeric weight", () => {
			const s = styleframe();
			const fontWeights = useFontWeightDesignTokens(s);
			const numericValues = Object.values(fontWeights)
				.filter((v) => typeof v.value === "number")
				.map((v) => v.value as number);
			const minValue = Math.min(...numericValues);

			expect(fontWeights.fontWeightExtralight.value).toBe(minValue);
			expect(fontWeights.fontWeightExtralight.value).toBe(200);
		});

		it("should have CSS keyword values for normal, bold, lighter, and bolder", () => {
			const s = styleframe();
			const { fontWeightNormal, fontWeightBold, fontWeightLighter, fontWeightBolder } =
				useFontWeightDesignTokens(s);

			expect(fontWeightNormal.value).toBe("normal");
			expect(fontWeightBold.value).toBe("bold");
			expect(fontWeightLighter.value).toBe("lighter");
			expect(fontWeightBolder.value).toBe("bolder");
		});
	});

	describe("practical usage", () => {
		it("should work for creating typography with different font weights", () => {
			const s = styleframe();
			const { fontWeightNormal, fontWeightBold } = useFontWeightDesignTokens(s);

			s.selector("p", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightNormal));
			});

			s.selector("strong, b", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightBold));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
}

p {
	--font-weight: var(--font-weight--normal);
}

strong, b {
	--font-weight: var(--font-weight--bold);
}`);
		});

		it("should work for heading hierarchy with different weights", () => {
			const s = styleframe();
			const { fontWeightBlack, fontWeightBold, fontWeightSemibold } = useFontWeightDesignTokens(s);

			s.selector("h1", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightBlack));
			});

			s.selector("h2", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightBold));
			});

			s.selector("h3, h4, h5, h6", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightSemibold));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
}

h1 {
	--font-weight: var(--font-weight--black);
}

h2 {
	--font-weight: var(--font-weight--bold);
}

h3, h4, h5, h6 {
	--font-weight: var(--font-weight--semibold);
}`);
		});

		it("should work for theme-specific font weight overrides", () => {
			const s = styleframe();
			const { fontWeightNormal, fontWeightMedium } = useFontWeightDesignTokens(s);

			s.selector(".theme-strong", ({ variable }) => {
				variable(fontWeightNormal, s.ref(fontWeightMedium));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
}

.theme-strong {
	--font-weight--normal: var(--font-weight--medium);
}`);
		});

		it("should work with lighter and bolder relative weights", () => {
			const s = styleframe();
			const { fontWeightLighter, fontWeightBolder } = useFontWeightDesignTokens(s);

			s.selector(".text-lighter", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightLighter));
			});

			s.selector(".text-bolder", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightBolder));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
}

.text-lighter {
	--font-weight: var(--font-weight--lighter);
}

.text-bolder {
	--font-weight: var(--font-weight--bolder);
}`);
		});

		it("should work for responsive font weight adjustments", () => {
			const s = styleframe();
			const { fontWeightNormal, fontWeightMedium } = useFontWeightDesignTokens(s);

			const bodyFontWeight = s.variable("body-font-weight", s.ref(fontWeightNormal));

			s.selector("@media (min-width: 768px)", ({ variable }) => {
				variable(bodyFontWeight, s.ref(fontWeightMedium));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
	--body-font-weight: var(--font-weight--normal);
}

@media (min-width: 768px) {
	--body-font-weight: var(--font-weight--medium);
}`);
		});

		it("should work for light text on dark backgrounds", () => {
			const s = styleframe();
			const { fontWeightLight, fontWeightExtralight } = useFontWeightDesignTokens(s);

			s.selector(".dark-theme", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightLight));
			});

			s.selector(".dark-theme .text-subtle", ({ variable }) => {
				variable("font-weight", s.ref(fontWeightExtralight));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-weight--extralight: 200;
	--font-weight--light: 300;
	--font-weight--normal: normal;
	--font-weight--medium: 500;
	--font-weight--semibold: 600;
	--font-weight--bold: bold;
	--font-weight--black: 900;
	--font-weight--lighter: lighter;
	--font-weight--bolder: bolder;
	--font-weight--inherit: inherit;
	--font-weight: var(--font-weight--normal);
}

.dark-theme {
	--font-weight: var(--font-weight--light);
}

.dark-theme .text-subtle {
	--font-weight: var(--font-weight--extralight);
}`);
		});
	});
});
