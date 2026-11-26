import { describe, expect, it } from "vitest";

import { genSafePropertyName } from "./genSafePropertyName";

describe("genSafePropertyName", () => {
	describe("camelCase to kebab-case conversion", () => {
		it("should convert backgroundColor to background-color", () => {
			const result = genSafePropertyName("backgroundColor");
			expect(result).toBe("background-color");
		});

		it("should convert fontSize to font-size", () => {
			const result = genSafePropertyName("fontSize");
			expect(result).toBe("font-size");
		});

		it("should convert marginTop to margin-top", () => {
			const result = genSafePropertyName("marginTop");
			expect(result).toBe("margin-top");
		});

		it("should convert paddingLeft to padding-left", () => {
			const result = genSafePropertyName("paddingLeft");
			expect(result).toBe("padding-left");
		});

		it("should convert borderBottomWidth to border-bottom-width", () => {
			const result = genSafePropertyName("borderBottomWidth");
			expect(result).toBe("border-bottom-width");
		});

		it("should convert textDecorationLine to text-decoration-line", () => {
			const result = genSafePropertyName("textDecorationLine");
			expect(result).toBe("text-decoration-line");
		});

		it("should convert zIndex to z-index", () => {
			const result = genSafePropertyName("zIndex");
			expect(result).toBe("z-index");
		});

		it("should convert lineHeight to line-height", () => {
			const result = genSafePropertyName("lineHeight");
			expect(result).toBe("line-height");
		});

		it("should convert boxShadow to box-shadow", () => {
			const result = genSafePropertyName("boxShadow");
			expect(result).toBe("box-shadow");
		});

		it("should convert flexDirection to flex-direction", () => {
			const result = genSafePropertyName("flexDirection");
			expect(result).toBe("flex-direction");
		});

		it("should convert justifyContent to justify-content", () => {
			const result = genSafePropertyName("justifyContent");
			expect(result).toBe("justify-content");
		});

		it("should convert alignItems to align-items", () => {
			const result = genSafePropertyName("alignItems");
			expect(result).toBe("align-items");
		});

		it("should convert maxWidth to max-width", () => {
			const result = genSafePropertyName("maxWidth");
			expect(result).toBe("max-width");
		});

		it("should convert minHeight to min-height", () => {
			const result = genSafePropertyName("minHeight");
			expect(result).toBe("min-height");
		});

		it("should convert overflowX to overflow-x", () => {
			const result = genSafePropertyName("overflowX");
			expect(result).toBe("overflow-x");
		});

		it("should convert overflowY to overflow-y", () => {
			const result = genSafePropertyName("overflowY");
			expect(result).toBe("overflow-y");
		});
	});

	describe("PascalCase to kebab-case conversion", () => {
		it("should convert BackgroundColor to background-color", () => {
			const result = genSafePropertyName("BackgroundColor");
			expect(result).toBe("background-color");
		});

		it("should convert FontSize to font-size", () => {
			const result = genSafePropertyName("FontSize");
			expect(result).toBe("font-size");
		});

		it("should convert TextAlign to text-align", () => {
			const result = genSafePropertyName("TextAlign");
			expect(result).toBe("text-align");
		});

		it("should convert BorderRadius to border-radius", () => {
			const result = genSafePropertyName("BorderRadius");
			expect(result).toBe("border-radius");
		});

		it("should convert GridTemplateColumns to grid-template-columns", () => {
			const result = genSafePropertyName("GridTemplateColumns");
			expect(result).toBe("grid-template-columns");
		});
	});

	describe("already kebab-case properties", () => {
		it("should preserve background-color", () => {
			const result = genSafePropertyName("background-color");
			expect(result).toBe("background-color");
		});

		it("should preserve font-size", () => {
			const result = genSafePropertyName("font-size");
			expect(result).toBe("font-size");
		});

		it("should preserve margin-top", () => {
			const result = genSafePropertyName("margin-top");
			expect(result).toBe("margin-top");
		});

		it("should preserve border-bottom-width", () => {
			const result = genSafePropertyName("border-bottom-width");
			expect(result).toBe("border-bottom-width");
		});

		it("should preserve text-decoration-line", () => {
			const result = genSafePropertyName("text-decoration-line");
			expect(result).toBe("text-decoration-line");
		});
	});

	describe("vendor prefixed properties", () => {
		it("should handle WebkitTransform", () => {
			const result = genSafePropertyName("WebkitTransform");
			expect(result).toBe("webkit-transform");
		});

		it("should handle MozAppearance", () => {
			const result = genSafePropertyName("MozAppearance");
			expect(result).toBe("moz-appearance");
		});

		it("should handle msFlexAlign", () => {
			const result = genSafePropertyName("msFlexAlign");
			expect(result).toBe("ms-flex-align");
		});

		it("should handle OTransform", () => {
			const result = genSafePropertyName("OTransform");
			expect(result).toBe("o-transform");
		});

		it("should handle already prefixed -webkit-transform", () => {
			const result = genSafePropertyName("-webkit-transform");
			expect(result).toBe("-webkit-transform");
		});

		it("should handle already prefixed -moz-appearance", () => {
			const result = genSafePropertyName("-moz-appearance");
			expect(result).toBe("-moz-appearance");
		});

		it("should handle already prefixed -ms-flex", () => {
			const result = genSafePropertyName("-ms-flex");
			expect(result).toBe("-ms-flex");
		});

		it("should handle already prefixed -o-transform", () => {
			const result = genSafePropertyName("-o-transform");
			expect(result).toBe("-o-transform");
		});

		it("should handle webkitTransform (lowercase webkit)", () => {
			const result = genSafePropertyName("webkitTransform");
			expect(result).toBe("webkit-transform");
		});

		it("should handle mozBoxSizing", () => {
			const result = genSafePropertyName("mozBoxSizing");
			expect(result).toBe("moz-box-sizing");
		});
	});

	describe("single word properties", () => {
		it("should preserve color", () => {
			const result = genSafePropertyName("color");
			expect(result).toBe("color");
		});

		it("should preserve width", () => {
			const result = genSafePropertyName("width");
			expect(result).toBe("width");
		});

		it("should preserve height", () => {
			const result = genSafePropertyName("height");
			expect(result).toBe("height");
		});

		it("should preserve margin", () => {
			const result = genSafePropertyName("margin");
			expect(result).toBe("margin");
		});

		it("should preserve padding", () => {
			const result = genSafePropertyName("padding");
			expect(result).toBe("padding");
		});

		it("should preserve display", () => {
			const result = genSafePropertyName("display");
			expect(result).toBe("display");
		});

		it("should preserve position", () => {
			const result = genSafePropertyName("position");
			expect(result).toBe("position");
		});

		it("should preserve top", () => {
			const result = genSafePropertyName("top");
			expect(result).toBe("top");
		});

		it("should preserve left", () => {
			const result = genSafePropertyName("left");
			expect(result).toBe("left");
		});

		it("should preserve right", () => {
			const result = genSafePropertyName("right");
			expect(result).toBe("right");
		});

		it("should preserve bottom", () => {
			const result = genSafePropertyName("bottom");
			expect(result).toBe("bottom");
		});

		it("should preserve float", () => {
			const result = genSafePropertyName("float");
			expect(result).toBe("float");
		});

		it("should preserve clear", () => {
			const result = genSafePropertyName("clear");
			expect(result).toBe("clear");
		});

		it("should preserve content", () => {
			const result = genSafePropertyName("content");
			expect(result).toBe("content");
		});

		it("should preserve cursor", () => {
			const result = genSafePropertyName("cursor");
			expect(result).toBe("cursor");
		});

		it("should preserve opacity", () => {
			const result = genSafePropertyName("opacity");
			expect(result).toBe("opacity");
		});

		it("should preserve filter", () => {
			const result = genSafePropertyName("filter");
			expect(result).toBe("filter");
		});

		it("should preserve transform", () => {
			const result = genSafePropertyName("transform");
			expect(result).toBe("transform");
		});

		it("should preserve transition", () => {
			const result = genSafePropertyName("transition");
			expect(result).toBe("transition");
		});

		it("should preserve animation", () => {
			const result = genSafePropertyName("animation");
			expect(result).toBe("animation");
		});
	});

	describe("snake_case to kebab-case conversion", () => {
		it("should convert background_color to background-color", () => {
			const result = genSafePropertyName("background_color");
			expect(result).toBe("background-color");
		});

		it("should convert font_size to font-size", () => {
			const result = genSafePropertyName("font_size");
			expect(result).toBe("font-size");
		});

		it("should convert text_align to text-align", () => {
			const result = genSafePropertyName("text_align");
			expect(result).toBe("text-align");
		});

		it("should convert border_bottom_width to border-bottom-width", () => {
			const result = genSafePropertyName("border_bottom_width");
			expect(result).toBe("border-bottom-width");
		});
	});

	describe("properties with spaces", () => {
		it("should preserve spaces in 'background color'", () => {
			const result = genSafePropertyName("background color");
			expect(result).toBe("background color");
		});

		it("should preserve spaces in 'font size'", () => {
			const result = genSafePropertyName("font size");
			expect(result).toBe("font size");
		});

		it("should handle 'Border Bottom Width' with mixed case and spaces", () => {
			const result = genSafePropertyName("Border Bottom Width");
			expect(result).toBe("border -bottom -width");
		});

		it("should preserve multiple spaces", () => {
			const result = genSafePropertyName("background   color");
			expect(result).toBe("background   color");
		});

		it("should preserve leading spaces with camelCase", () => {
			const result = genSafePropertyName("  backgroundColor");
			expect(result).toBe("  background-color");
		});

		it("should preserve trailing spaces with camelCase", () => {
			const result = genSafePropertyName("backgroundColor  ");
			expect(result).toBe("background-color  ");
		});
	});

	describe("custom properties (CSS variables)", () => {
		it("should handle --custom-property", () => {
			const result = genSafePropertyName("--custom-property");
			expect(result).toBe("--custom-property");
		});

		it("should handle --theme-color-primary", () => {
			const result = genSafePropertyName("--theme-color-primary");
			expect(result).toBe("--theme-color-primary");
		});

		it("should handle --spacing-large", () => {
			const result = genSafePropertyName("--spacing-large");
			expect(result).toBe("--spacing-large");
		});

		it("should convert camelCase custom property", () => {
			const result = genSafePropertyName("--primaryColor");
			expect(result).toBe("--primary-color");
		});

		it("should convert PascalCase custom property", () => {
			const result = genSafePropertyName("--PrimaryColor");
			expect(result).toBe("--primary-color");
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", () => {
			const result = genSafePropertyName("");
			expect(result).toBe("");
		});

		it("should handle property with numbers", () => {
			const result = genSafePropertyName("grid2Columns");
			expect(result).toBe("grid2-columns");
		});

		it("should handle property starting with number", () => {
			const result = genSafePropertyName("2Columns");
			expect(result).toBe("2-columns");
		});

		it("should handle all caps", () => {
			const result = genSafePropertyName("BACKGROUNDCOLOR");
			expect(result).toBe("backgroundcolor");
		});

		it("should handle mixed caps", () => {
			const result = genSafePropertyName("BACKGROUNDColor");
			expect(result).toBe("background-color");
		});

		it("should handle consecutive capitals", () => {
			const result = genSafePropertyName("XMLHttpRequest");
			expect(result).toBe("xml-http-request");
		});

		it("should handle acronyms in property names", () => {
			const result = genSafePropertyName("htmlFontSize");
			expect(result).toBe("html-font-size");
		});

		it("should handle property with dots", () => {
			const result = genSafePropertyName("background.color");
			expect(result).toBe("background-color");
		});

		it("should handle property with forward slash", () => {
			const result = genSafePropertyName("background/color");
			expect(result).toBe("background-color");
		});

		it("should preserve colon in property name", () => {
			const result = genSafePropertyName("background:color");
			expect(result).toBe("background:color");
		});

		it("should handle single letter", () => {
			const result = genSafePropertyName("x");
			expect(result).toBe("x");
		});

		it("should handle two letter camelCase", () => {
			const result = genSafePropertyName("xY");
			expect(result).toBe("x-y");
		});
	});

	describe("special CSS property patterns", () => {
		it("should handle gridTemplateAreas", () => {
			const result = genSafePropertyName("gridTemplateAreas");
			expect(result).toBe("grid-template-areas");
		});

		it("should handle willChange", () => {
			const result = genSafePropertyName("willChange");
			expect(result).toBe("will-change");
		});

		it("should handle counterReset", () => {
			const result = genSafePropertyName("counterReset");
			expect(result).toBe("counter-reset");
		});

		it("should handle listStyleType", () => {
			const result = genSafePropertyName("listStyleType");
			expect(result).toBe("list-style-type");
		});

		it("should handle borderTopLeftRadius", () => {
			const result = genSafePropertyName("borderTopLeftRadius");
			expect(result).toBe("border-top-left-radius");
		});

		it("should handle scrollBehavior", () => {
			const result = genSafePropertyName("scrollBehavior");
			expect(result).toBe("scroll-behavior");
		});

		it("should handle backdropFilter", () => {
			const result = genSafePropertyName("backdropFilter");
			expect(result).toBe("backdrop-filter");
		});

		it("should handle clipPath", () => {
			const result = genSafePropertyName("clipPath");
			expect(result).toBe("clip-path");
		});

		it("should handle objectFit", () => {
			const result = genSafePropertyName("objectFit");
			expect(result).toBe("object-fit");
		});

		it("should handle userSelect", () => {
			const result = genSafePropertyName("userSelect");
			expect(result).toBe("user-select");
		});
	});
});
