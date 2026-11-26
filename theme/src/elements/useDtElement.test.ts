import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useDtElement } from "./useDtElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useDtElement", () => {
	it("should create dt variable and selector", () => {
		const s = createInstance();
		const result = useDtElement(s);

		expect(result.dtFontWeight).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("dt");
		expect(css).toContain("var(--dt--font-weight)");
	});

	it("should use custom font weight", () => {
		const s = createInstance();
		const result = useDtElement(s, {
			fontWeight: "600",
		});

		expect(result.dtFontWeight.value).toBe("600");
	});
});
