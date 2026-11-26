import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useKbdElement } from "./useKbdElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useKbdElement", () => {
	it("should create kbd variables and selector", () => {
		const s = createInstance();
		const result = useKbdElement(s);

		expect(result.kbdBackground).toBeDefined();
		expect(result.kbdColor).toBeDefined();
		expect(result.kbdFontFamily).toBeDefined();
		expect(result.kbdFontSize).toBeDefined();
		expect(result.kbdBorderRadius).toBeDefined();
		expect(result.kbdPaddingBlock).toBeDefined();
		expect(result.kbdPaddingInline).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("kbd");
		expect(css).toContain("var(--kbd--background)");
		expect(css).toContain("var(--kbd--color)");
		expect(css).toContain("var(--kbd--font-family)");
		expect(css).toContain("var(--kbd--font-size)");
		expect(css).toContain("var(--kbd--border-radius)");
		expect(css).toContain("var(--kbd--padding-block)");
		expect(css).toContain("var(--kbd--padding-inline)");
		expect(css).toContain("display: inline-block");
	});

	it("should use custom values", () => {
		const s = createInstance();
		const result = useKbdElement(s, {
			background: "#333",
			color: "#fff",
			fontFamily: "monospace",
			fontSize: "1em",
		});

		expect(result.kbdBackground.value).toBe("#333");
		expect(result.kbdColor.value).toBe("#fff");
		expect(result.kbdFontFamily.value).toBe("monospace");
		expect(result.kbdFontSize.value).toBe("1em");
	});
});
