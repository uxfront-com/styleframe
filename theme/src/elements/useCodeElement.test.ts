import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useCodeElement } from "./useCodeElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useCodeElement", () => {
	it("should create code variables and selector with defaults", () => {
		const s = createInstance();
		const result = useCodeElement(s);

		expect(result.codeFontFamily).toBeDefined();
		expect(result.codeFontSize).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("code, samp");
		expect(css).toContain("var(--code--font-family)");
		expect(css).toContain("var(--code--font-size)");
	});

	it("should use custom config values", () => {
		const s = createInstance();
		const result = useCodeElement(s, {
			fontFamily: "monospace",
			fontSize: "1em",
		});

		expect(result.codeFontFamily.value).toBe("monospace");
		expect(result.codeFontSize.value).toBe("1em");
	});
});
