import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { borderWidthValues } from "../values";
import { useBorderWidthDesignTokens } from "./useBorderWidthDesignTokens";

describe("useBorderWidthDesignTokens", () => {
	it("should create all border width variables with correct names and values", () => {
		const s = styleframe();
		const { borderWidthNone, borderWidthThin, borderWidthMedium, borderWidthThick, borderWidth } =
			useBorderWidthDesignTokens(s);

		expect(borderWidthNone).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-width.none",
			value: "0",
		});

		expect(borderWidthThin).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-width.thin",
			value: "thin",
		});

		expect(borderWidthMedium).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-width.medium",
			value: "medium",
		});

		expect(borderWidthThick).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-width.thick",
			value: "thick",
		});

		expect(borderWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "border-width",
			value: {
				type: "reference",
				name: "border-width.thin",
			},
		});
	});

	it("should add all border width variables to root", () => {
		const s = styleframe();
		useBorderWidthDesignTokens(s);

		expect(s.root.variables).toHaveLength(5);
		expect(s.root.variables[0]?.name).toBe("border-width.none");
		expect(s.root.variables[1]?.name).toBe("border-width.thin");
		expect(s.root.variables[2]?.name).toBe("border-width.medium");
		expect(s.root.variables[3]?.name).toBe("border-width.thick");
		expect(s.root.variables[4]?.name).toBe("border-width");
	});

	it("should return all border width variables in an object", () => {
		const s = styleframe();
		const borderWidths = useBorderWidthDesignTokens(s);

		expect(Object.keys(borderWidths)).toEqual([
			"borderWidthNone",
			"borderWidthThin",
			"borderWidthMedium",
			"borderWidthThick",
			"borderWidth",
		]);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useBorderWidthDesignTokens(s);

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
}`);
	});

	it("should compile individual border width variable to correct CSS", () => {
		const s = styleframe();
		const { borderWidthMedium } = useBorderWidthDesignTokens(s);

		const css = consumeCSS(borderWidthMedium, s.options);

		expect(css).toBe("--border-width--medium: medium;");
	});

	it("should not create duplicate variables when called multiple times", () => {
		const s = styleframe();
		const borderWidths1 = useBorderWidthDesignTokens(s);
		const borderWidths2 = useBorderWidthDesignTokens(s);

		// Should return the same variables (default: true behavior)
		expect(borderWidths1.borderWidthThin).toBe(borderWidths2.borderWidthThin);
		expect(borderWidths1.borderWidth).toBe(borderWidths2.borderWidth);
		expect(s.root.variables).toHaveLength(5);
	});

	it("should allow border width variables to be used as references", () => {
		const s = styleframe();
		const { borderWidthThick } = useBorderWidthDesignTokens(s);

		const customBorderWidth = s.variable("custom-border-width", s.ref(borderWidthThick));

		expect(customBorderWidth.value).toEqual({
			type: "reference",
			name: "border-width.thick",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
	--custom-border-width: var(--border-width--thick);
}`);
	});

	it("should work with selector overrides", () => {
		const s = styleframe();
		const { borderWidthThin } = useBorderWidthDesignTokens(s);

		s.selector(".custom-border-width", ({ variable }) => {
			variable(borderWidthThin, "2px");
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
}

.custom-border-width {
	--border-width--thin: 2px;
}`);
	});

	describe("type safety", () => {
		it("should preserve exact border width variable names in return type", () => {
			const s = styleframe();
			const borderWidths = useBorderWidthDesignTokens(s);

			// Type assertions to verify the generic types are preserved
			const none: Variable<"border-width.none"> = borderWidths.borderWidthNone;
			const thin: Variable<"border-width.thin"> = borderWidths.borderWidthThin;
			const medium: Variable<"border-width.medium"> = borderWidths.borderWidthMedium;
			const thick: Variable<"border-width.thick"> = borderWidths.borderWidthThick;
			const borderWidth: Variable<"border-width"> = borderWidths.borderWidth;

			expect(none.name).toBe("border-width.none");
			expect(thin.name).toBe("border-width.thin");
			expect(medium.name).toBe("border-width.medium");
			expect(thick.name).toBe("border-width.thick");
			expect(borderWidth.name).toBe("border-width");
		});

		it("should have correct value types", () => {
			const s = styleframe();
			const borderWidths = useBorderWidthDesignTokens(s);

			expect(typeof borderWidths.borderWidthNone.value).toBe("string");
			expect(typeof borderWidths.borderWidthThin.value).toBe("string");
			expect(typeof borderWidths.borderWidthMedium.value).toBe("string");
			expect(typeof borderWidths.borderWidthThick.value).toBe("string");
			expect(typeof borderWidths.borderWidth.value).toBe("object");
		});
	});

	describe("default border width", () => {
		it("should create a default border width variable referencing thin by default", () => {
			const s = styleframe();
			const { borderWidth } = useBorderWidthDesignTokens(s);

			expect(borderWidth).toEqual({
				type: "variable",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "border-width",
				value: {
					type: "reference",
					name: "border-width.thin",
				},
			});
		});

		it("should allow customizing the default border width", () => {
			const s = styleframe();
			const { borderWidth } = useBorderWidthDesignTokens(s, {
				...borderWidthValues,
				default: "@border-width.medium",
			});

			expect(borderWidth.value).toEqual({
				type: "reference",
				name: "border-width.medium",
			});
		});

		it("should compile default border width to CSS correctly", () => {
			const s = styleframe();
			useBorderWidthDesignTokens(s, {
				...borderWidthValues,
				default: "@border-width.thick",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thick);
}`);
		});

		it("should work with different default border widths", () => {
			const borderWidthNames = ["none", "thin", "medium", "thick"];

			for (const borderWidthName of borderWidthNames) {
				const s = styleframe();
				const { borderWidth } = useBorderWidthDesignTokens(s, {
					...borderWidthValues,
					default: `@border-width.${borderWidthName}`,
				});

				expect(borderWidth.value).toEqual({
					type: "reference",
					name: `border-width.${borderWidthName}`,
				});
			}
		});
	});

	describe("border width values", () => {
		it("should have correct CSS keyword values", () => {
			const s = styleframe();
			const { borderWidthNone, borderWidthThin, borderWidthMedium, borderWidthThick } =
				useBorderWidthDesignTokens(s);

			expect(borderWidthNone.value).toBe("0");
			expect(borderWidthThin.value).toBe("thin");
			expect(borderWidthMedium.value).toBe("medium");
			expect(borderWidthThick.value).toBe("thick");
		});

		it("should have all standard CSS border-width values", () => {
			const s = styleframe();
			const borderWidths = useBorderWidthDesignTokens(s);
			const values = [
				borderWidths.borderWidthNone.value,
				borderWidths.borderWidthThin.value,
				borderWidths.borderWidthMedium.value,
				borderWidths.borderWidthThick.value,
			];

			const expectedValues = ["0", "thin", "medium", "thick"];

			expect(values).toEqual(expectedValues);
		});

		it("should have none as zero value", () => {
			const s = styleframe();
			const { borderWidthNone } = useBorderWidthDesignTokens(s);

			expect(borderWidthNone.value).toBe("0");
			expect(typeof borderWidthNone.value).toBe("string");
		});
	});

	describe("practical usage", () => {
		it("should work for creating borders with different widths", () => {
			const s = styleframe();
			const { borderWidthThin, borderWidthThick } = useBorderWidthDesignTokens(s);

			s.selector(".card", ({ variable }) => {
				variable("border-width", s.ref(borderWidthThin));
			});

			s.selector(".emphasis", ({ variable }) => {
				variable("border-width", s.ref(borderWidthThick));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
}

.card {
	--border-width: var(--border-width--thin);
}

.emphasis {
	--border-width: var(--border-width--thick);
}`);
		});

		it("should work for responsive border width adjustments", () => {
			const s = styleframe();
			const { borderWidthThin, borderWidthMedium } = useBorderWidthDesignTokens(s);

			const buttonBorderWidth = s.variable("button-border-width", s.ref(borderWidthThin));

			s.selector("@media (min-width: 768px)", ({ variable }) => {
				variable(buttonBorderWidth, s.ref(borderWidthMedium));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
	--button-border-width: var(--border-width--thin);
}

@media (min-width: 768px) {
	--button-border-width: var(--border-width--medium);
}`);
		});

		it("should work for theme-specific border width overrides", () => {
			const s = styleframe();
			const { borderWidthThin, borderWidthThick } = useBorderWidthDesignTokens(s);

			s.selector(".theme-bold", ({ variable }) => {
				variable(borderWidthThin, s.ref(borderWidthThick));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
}

.theme-bold {
	--border-width--thin: var(--border-width--thick);
}`);
		});

		it("should work for state-specific border widths", () => {
			const s = styleframe();
			const { borderWidthThin, borderWidthMedium, borderWidthNone } = useBorderWidthDesignTokens(s);

			s.selector(".input", ({ variable }) => {
				variable("border-width", s.ref(borderWidthThin));
			});

			s.selector(".input:focus", ({ variable }) => {
				variable("border-width", s.ref(borderWidthMedium));
			});

			s.selector(".input:disabled", ({ variable }) => {
				variable("border-width", s.ref(borderWidthNone));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
}

.input {
	--border-width: var(--border-width--thin);
}

.input:focus {
	--border-width: var(--border-width--medium);
}

.input:disabled {
	--border-width: var(--border-width--none);
}`);
		});

		it("should work for combining border widths with other border properties", () => {
			const s = styleframe();
			const { borderWidthThin, borderWidthThick } = useBorderWidthDesignTokens(s);

			const borderStyle = s.variable("border-style", "solid");
			s.variable("border-color", "#000");

			s.selector(".box", ({ variable }) => {
				variable("border-width", s.ref(borderWidthThin));
			});

			s.selector(".box-fancy", ({ variable }) => {
				variable("border-width", s.ref(borderWidthThick));
				variable(borderStyle, "double");
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
	--border-style: solid;
	--border-color: #000;
}

.box {
	--border-width: var(--border-width--thin);
}

.box-fancy {
	--border-width: var(--border-width--thick);
	--border-style: double;
}`);
		});

		it("should work with custom pixel values for overrides", () => {
			const s = styleframe();
			const { borderWidthThin } = useBorderWidthDesignTokens(s);

			s.selector(".custom", ({ variable }) => {
				variable(borderWidthThin, "1px");
			});

			s.selector(".custom-thick", ({ variable }) => {
				variable(borderWidthThin, "3px");
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
}

.custom {
	--border-width--thin: 1px;
}

.custom-thick {
	--border-width--thin: 3px;
}`);
		});

		it("should work for removing borders with none value", () => {
			const s = styleframe();
			const { borderWidthNone } = useBorderWidthDesignTokens(s);

			s.selector(".no-border", ({ variable }) => {
				variable("border-width", s.ref(borderWidthNone));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--border-width--none: 0;
	--border-width--thin: thin;
	--border-width--medium: medium;
	--border-width--thick: thick;
	--border-width: var(--border-width--thin);
}

.no-border {
	--border-width: var(--border-width--none);
}`);
		});
	});

	describe("border width value relationships", () => {
		it("should have none as the smallest value", () => {
			const s = styleframe();
			const { borderWidthNone } = useBorderWidthDesignTokens(s);

			expect(borderWidthNone.value).toBe("0");
		});

		it("should have semantic progression from thin to thick", () => {
			const s = styleframe();
			const { borderWidthThin, borderWidthMedium, borderWidthThick } =
				useBorderWidthDesignTokens(s);

			// Verify semantic naming progression exists
			expect(borderWidthThin.value).toBe("thin");
			expect(borderWidthMedium.value).toBe("medium");
			expect(borderWidthThick.value).toBe("thick");

			// These CSS keywords have defined progressive values
			expect(borderWidthThin.name).toContain("thin");
			expect(borderWidthMedium.name).toContain("medium");
			expect(borderWidthThick.name).toContain("thick");
		});
	});
});
