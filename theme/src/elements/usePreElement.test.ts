import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { usePreElement } from "./usePreElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("usePreElement", () => {
	it("should create pre variables and selector with defaults", () => {
		const s = createInstance();
		const result = usePreElement(s);

		expect(result.preFontFamily).toBeDefined();
		expect(result.preFontSize).toBeDefined();
		expect(result.preMarginBottom).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("pre");
		expect(css).toContain("var(--pre--font-family)");
		expect(css).toContain("var(--pre--font-size)");
		expect(css).toContain("var(--pre--margin-bottom)");
		expect(css).toContain("display: block");
		expect(css).toContain("overflow-x: auto");
	});

	it("should use custom config values", () => {
		const s = createInstance();
		const result = usePreElement(s, {
			fontFamily: "monospace",
			fontSize: "1em",
			marginBottom: "2rem",
		});

		expect(result.preFontFamily.value).toBe("monospace");
		expect(result.preFontSize.value).toBe("1em");
		expect(result.preMarginBottom.value).toBe("2rem");
	});
});
