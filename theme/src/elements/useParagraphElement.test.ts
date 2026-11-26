import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useParagraphElement } from "./useParagraphElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useParagraphElement", () => {
	it("should create paragraph variable and selector with defaults", () => {
		const s = createInstance();
		const result = useParagraphElement(s);

		expect(result.paragraphMarginBottom).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("p {");
		expect(css).toContain("margin-top: 0");
		expect(css).toContain("var(--paragraph--margin-bottom)");
	});

	it("should use custom marginBottom value", () => {
		const s = createInstance();
		const result = useParagraphElement(s, { marginBottom: "2rem" });

		expect(result.paragraphMarginBottom.value).toBe("2rem");
	});
});
