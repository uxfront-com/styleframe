import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useHeadingElement } from "./useHeadingElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useHeadingElement", () => {
	it("should create heading variables and selectors with defaults", () => {
		const s = createInstance();
		const result = useHeadingElement(s);

		expect(result.headingColor).toBeDefined();
		expect(result.headingFontFamily).toBeDefined();
		expect(result.headingFontWeight).toBeDefined();
		expect(result.headingLineHeight).toBeDefined();
		expect(result.headingH1FontSize).toBeDefined();
		expect(result.headingH6FontSize).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("h1, h2, h3, h4, h5, h6");
		expect(css).toContain("var(--heading--color)");
		expect(css).toContain("var(--heading--font-weight)");
		expect(css).toContain("var(--heading--line-height)");
		expect(css).toContain("var(--heading--h1--font-size)");
		expect(css).toContain("var(--heading--h6--font-size)");
	});

	it("should use custom heading sizes", () => {
		const s = createInstance();
		const result = useHeadingElement(s, { sizes: { h1: "3rem" } });

		expect(result.headingH1FontSize.value).toBe("3rem");
	});

	it("should use custom typography values", () => {
		const s = createInstance();
		const result = useHeadingElement(s, {
			fontFamily: "Georgia, serif",
			fontWeight: "600",
			lineHeight: "1.3",
		});

		expect(result.headingFontFamily.value).toBe("Georgia, serif");
		expect(result.headingFontWeight.value).toBe("600");
		expect(result.headingLineHeight.value).toBe("1.3");
	});
});
