import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useFontStyleDesignTokens } from "./useFontStyleDesignTokens";
import { fontStyleValues } from "../values";

describe("useFontStyleDesignTokens", () => {
	it("should create all font style variables with correct names and values", () => {
		const s = styleframe();
		const {
			fontStyleItalic,
			fontStyleOblique,
			fontStyleNormal,
			fontStyleInherit,
			fontStyle,
		} = useFontStyleDesignTokens(s);

		expect(fontStyleItalic).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-style.italic",
			value: "italic",
		});

		expect(fontStyleOblique).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-style.oblique",
			value: "oblique",
		});

		expect(fontStyleNormal).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-style.normal",
			value: "normal",
		});

		expect(fontStyleInherit).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-style.inherit",
			value: "inherit",
		});

		expect(fontStyle).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-style",
			value: {
				type: "reference",
				name: "font-style.normal",
			},
		});
	});

	it("should add all font style variables to root", () => {
		const s = styleframe();
		useFontStyleDesignTokens(s);

		expect(s.root.variables).toHaveLength(5);
		expect(s.root.variables[0]?.name).toBe("font-style.italic");
		expect(s.root.variables[1]?.name).toBe("font-style.oblique");
		expect(s.root.variables[2]?.name).toBe("font-style.normal");
		expect(s.root.variables[3]?.name).toBe("font-style.inherit");
		expect(s.root.variables[4]?.name).toBe("font-style");
	});

	it("should return all font style variables in an object", () => {
		const s = styleframe();
		const fontStyles = useFontStyleDesignTokens(s);

		expect(Object.keys(fontStyles)).toEqual([
			"fontStyleItalic",
			"fontStyleOblique",
			"fontStyleNormal",
			"fontStyleInherit",
			"fontStyle",
		]);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useFontStyleDesignTokens(s);

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}`);
	});

	it("should compile individual font style variable to correct CSS", () => {
		const s = styleframe();
		const { fontStyleItalic } = useFontStyleDesignTokens(s);

		const css = consumeCSS(fontStyleItalic, s.options);

		expect(css).toBe("--font-style--italic: italic;");
	});

	it("should not create duplicate variables when called multiple times", () => {
		const s = styleframe();
		const fontStyles1 = useFontStyleDesignTokens(s);
		const fontStyles2 = useFontStyleDesignTokens(s);

		// Should return the same variables (default: true behavior)
		expect(fontStyles1.fontStyleItalic).toBe(fontStyles2.fontStyleItalic);
		expect(fontStyles1.fontStyle).toBe(fontStyles2.fontStyle);
		expect(s.root.variables).toHaveLength(5);
	});

	it("should allow font style variables to be used as references", () => {
		const s = styleframe();
		const { fontStyleItalic } = useFontStyleDesignTokens(s);

		const customFontStyle = s.variable(
			"custom-font-style",
			s.ref(fontStyleItalic),
		);

		expect(customFontStyle.value).toEqual({
			type: "reference",
			name: "font-style.italic",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
	--custom-font-style: var(--font-style--italic);
}`);
	});

	it("should work with selector overrides", () => {
		const s = styleframe();
		const { fontStyleNormal } = useFontStyleDesignTokens(s);

		s.selector(".custom-font-style", ({ variable }) => {
			variable(fontStyleNormal, "italic");
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

.custom-font-style {
	--font-style--normal: italic;
}`);
	});

	describe("type safety", () => {
		it("should preserve exact font style variable names in return type", () => {
			const s = styleframe();
			const fontStyles = useFontStyleDesignTokens(s);

			// Type assertions to verify the generic types are preserved
			const italic: Variable<"font-style.italic"> = fontStyles.fontStyleItalic;
			const oblique: Variable<"font-style.oblique"> =
				fontStyles.fontStyleOblique;
			const normal: Variable<"font-style.normal"> = fontStyles.fontStyleNormal;
			const inherit: Variable<"font-style.inherit"> =
				fontStyles.fontStyleInherit;
			const fontStyle: Variable<"font-style"> = fontStyles.fontStyle;

			expect(italic.name).toBe("font-style.italic");
			expect(oblique.name).toBe("font-style.oblique");
			expect(normal.name).toBe("font-style.normal");
			expect(inherit.name).toBe("font-style.inherit");
			expect(fontStyle.name).toBe("font-style");
		});

		it("should have correct value types", () => {
			const s = styleframe();
			const fontStyles = useFontStyleDesignTokens(s);

			expect(typeof fontStyles.fontStyleItalic.value).toBe("string");
			expect(typeof fontStyles.fontStyleOblique.value).toBe("string");
			expect(typeof fontStyles.fontStyleNormal.value).toBe("string");
			expect(typeof fontStyles.fontStyleInherit.value).toBe("string");
			expect(typeof fontStyles.fontStyle.value).toBe("object");
		});
	});

	describe("default font style", () => {
		it("should create a default font style variable referencing normal by default", () => {
			const s = styleframe();
			const { fontStyle } = useFontStyleDesignTokens(s);

			expect(fontStyle).toEqual({
				type: "variable",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "font-style",
				value: {
					type: "reference",
					name: "font-style.normal",
				},
			});
		});

		it("should allow customizing the default font style", () => {
			const s = styleframe();
			const { fontStyle } = useFontStyleDesignTokens(s, {
				...fontStyleValues,
				default: "@font-style.italic",
			});

			expect(fontStyle.value).toEqual({
				type: "reference",
				name: "font-style.italic",
			});
		});

		it("should compile default font style to CSS correctly", () => {
			const s = styleframe();
			useFontStyleDesignTokens(s, {
				...fontStyleValues,
				default: "@font-style.oblique",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--oblique);
}`);
		});

		it("should work with different default font styles", () => {
			const fontStyles = ["italic", "oblique", "normal"];

			for (const fontStyleName of fontStyles) {
				const s = styleframe();
				const { fontStyle } = useFontStyleDesignTokens(s, {
					...fontStyleValues,
					default: `@font-style.${fontStyleName}`,
				});

				expect(fontStyle.value).toEqual({
					type: "reference",
					name: `font-style.${fontStyleName}`,
				});
			}
		});
	});

	describe("font style value relationships", () => {
		it("should have all standard CSS font-style keyword values", () => {
			const s = styleframe();
			const { fontStyleItalic, fontStyleOblique, fontStyleNormal } =
				useFontStyleDesignTokens(s);

			expect(fontStyleItalic.value).toBe("italic");
			expect(fontStyleOblique.value).toBe("oblique");
			expect(fontStyleNormal.value).toBe("normal");
		});

		it("should have inherit keyword value", () => {
			const s = styleframe();
			const { fontStyleInherit } = useFontStyleDesignTokens(s);

			expect(fontStyleInherit.value).toBe("inherit");
		});

		it("should only contain valid CSS font-style values", () => {
			const s = styleframe();
			const fontStyles = useFontStyleDesignTokens(s);
			const validValues = ["italic", "oblique", "normal", "inherit"];

			Object.values(fontStyles).forEach((fontStyle) => {
				if (typeof fontStyle.value === "string") {
					expect(validValues).toContain(fontStyle.value);
				}
			});
		});
	});

	describe("practical usage", () => {
		it("should work for creating typography with different font styles", () => {
			const s = styleframe();
			const { fontStyleNormal, fontStyleItalic } = useFontStyleDesignTokens(s);

			s.selector("p", ({ variable }) => {
				variable("font-style", s.ref(fontStyleNormal));
			});

			s.selector("em, i", ({ variable }) => {
				variable("font-style", s.ref(fontStyleItalic));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

p {
	--font-style: var(--font-style--normal);
}

em, i {
	--font-style: var(--font-style--italic);
}`);
		});

		it("should work for emphasis elements with italic style", () => {
			const s = styleframe();
			const { fontStyleItalic } = useFontStyleDesignTokens(s);

			s.selector("em, cite, dfn, var", ({ variable }) => {
				variable("font-style", s.ref(fontStyleItalic));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

em, cite, dfn, var {
	--font-style: var(--font-style--italic);
}`);
		});

		it("should work for resetting italic styles to normal", () => {
			const s = styleframe();
			const { fontStyleNormal } = useFontStyleDesignTokens(s);

			s.selector("em.not-italic, i.not-italic", ({ variable }) => {
				variable("font-style", s.ref(fontStyleNormal));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

em.not-italic, i.not-italic {
	--font-style: var(--font-style--normal);
}`);
		});

		it("should work with oblique for design-specific italic effects", () => {
			const s = styleframe();
			const { fontStyleOblique } = useFontStyleDesignTokens(s);

			s.selector(".slanted", ({ variable }) => {
				variable("font-style", s.ref(fontStyleOblique));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

.slanted {
	--font-style: var(--font-style--oblique);
}`);
		});

		it("should work for theme-specific font style overrides", () => {
			const s = styleframe();
			const { fontStyleNormal, fontStyleItalic } = useFontStyleDesignTokens(s);

			s.selector("blockquote", ({ variable }) => {
				variable("font-style", s.ref(fontStyleItalic));
			});

			s.selector('[data-theme="minimal"] blockquote', ({ variable }) => {
				variable(fontStyleItalic, s.ref(fontStyleNormal));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

blockquote {
	--font-style: var(--font-style--italic);
}

[data-theme="minimal"] blockquote {
	--font-style--italic: var(--font-style--normal);
}`);
		});

		it("should work with inherit for preserving parent font style", () => {
			const s = styleframe();
			const { fontStyleInherit } = useFontStyleDesignTokens(s);

			s.selector(".inherit-style", ({ variable }) => {
				variable("font-style", s.ref(fontStyleInherit));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

.inherit-style {
	--font-style: var(--font-style--inherit);
}`);
		});

		it("should work for article content with mixed font styles", () => {
			const s = styleframe();
			const { fontStyleNormal, fontStyleItalic } = useFontStyleDesignTokens(s);

			s.selector("article p", ({ variable }) => {
				variable("font-style", s.ref(fontStyleNormal));
			});

			s.selector("article figcaption", ({ variable }) => {
				variable("font-style", s.ref(fontStyleItalic));
			});

			s.selector("article blockquote", ({ variable }) => {
				variable("font-style", s.ref(fontStyleItalic));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--normal: normal;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

article p {
	--font-style: var(--font-style--normal);
}

article figcaption {
	--font-style: var(--font-style--italic);
}

article blockquote {
	--font-style: var(--font-style--italic);
}`);
		});

		it("should work with custom font style values", () => {
			const s = styleframe();
			const { fontStyleSlanted } = useFontStyleDesignTokens(s, {
				default: "@font-style.normal",
				normal: "normal",
				italic: "italic",
				oblique: "oblique",
				slanted: "oblique 15deg",
				inherit: "inherit",
			});

			s.selector(".slanted-15", ({ variable }) => {
				variable("font-style", s.ref(fontStyleSlanted));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--font-style--normal: normal;
	--font-style--italic: italic;
	--font-style--oblique: oblique;
	--font-style--slanted: oblique 15deg;
	--font-style--inherit: inherit;
	--font-style: var(--font-style--normal);
}

.slanted-15 {
	--font-style: var(--font-style--slanted);
}`);
		});
	});

	describe("edge cases", () => {
		it("should handle empty custom values by using defaults", () => {
			const s = styleframe();
			const fontStyles = useFontStyleDesignTokens(s, {});

			expect(Object.keys(fontStyles)).toEqual([]);
		});

		it("should allow overriding only specific font style values", () => {
			const s = styleframe();
			const { fontStyleItalic, fontStyleNormal } = useFontStyleDesignTokens(s, {
				...fontStyleValues,
				italic: "oblique",
			});

			expect(fontStyleItalic.value).toBe("oblique");
			expect(fontStyleNormal.value).toBe("normal");
		});

		it("should handle direct value assignment for default", () => {
			const s = styleframe();
			const { fontStyle } = useFontStyleDesignTokens(s, {
				...fontStyleValues,
				default: "italic",
			});

			expect(fontStyle.value).toBe("italic");
		});

		it("should allow referencing font style in other variables", () => {
			const s = styleframe();
			const { fontStyleItalic } = useFontStyleDesignTokens(s);

			const emphasizedStyle = s.variable(
				"emphasized-style",
				s.ref(fontStyleItalic),
			);

			expect(emphasizedStyle.value).toEqual({
				type: "reference",
				name: "font-style.italic",
			});
		});
	});
});
