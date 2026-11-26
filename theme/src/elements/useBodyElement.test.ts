import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useBodyElement } from "./useBodyElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useBodyElement", () => {
	it("should create body variables and selector with defaults", () => {
		const s = createInstance();
		const result = useBodyElement(s);

		expect(result.bodyColor).toBeDefined();
		expect(result.bodyBackground).toBeDefined();
		expect(result.bodyFontFamily).toBeDefined();
		expect(result.bodyFontSize).toBeDefined();
		expect(result.bodyLineHeight).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("body");
		expect(css).toContain("--body--color");
		expect(css).toContain("--body--background");
		expect(css).toContain("var(--body--font-family)");
		expect(css).toContain("var(--body--font-size)");
		expect(css).toContain("var(--body--line-height)");
		expect(css).toContain("-webkit-font-smoothing: antialiased");
	});

	it("should use custom body colors", () => {
		const s = createInstance();
		const result = useBodyElement(s, {
			color: "#000000",
			background: "#f0f0f0",
		});

		expect(result.bodyColor.value).toBe("#000000");
		expect(result.bodyBackground.value).toBe("#f0f0f0");
	});

	it("should use custom typography values", () => {
		const s = createInstance();
		const result = useBodyElement(s, {
			fontFamily: "Georgia, serif",
			fontSize: "18px",
			lineHeight: "1.8",
		});

		expect(result.bodyFontFamily.value).toBe("Georgia, serif");
		expect(result.bodyFontSize.value).toBe("18px");
		expect(result.bodyLineHeight.value).toBe("1.8");
	});
});
