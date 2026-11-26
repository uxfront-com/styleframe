import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useSampElement } from "./useSampElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useSampElement", () => {
	it("should create samp variable and selector with defaults", () => {
		const s = createInstance();
		const result = useSampElement(s);

		expect(result.sampFontFamily).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("samp");
		expect(css).toContain("var(--samp--font-family)");
	});

	it("should use custom fontFamily value", () => {
		const s = createInstance();
		const result = useSampElement(s, { fontFamily: "monospace" });

		expect(result.sampFontFamily.value).toBe("monospace");
	});
});
