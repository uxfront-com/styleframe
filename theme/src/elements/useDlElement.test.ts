import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useDlElement } from "./useDlElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useDlElement", () => {
	it("should create dl margin-bottom variable and selector", () => {
		const s = createInstance();
		const result = useDlElement(s);

		expect(result.dlMarginBottom).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("dl");
		expect(css).toContain("var(--dl--margin-bottom)");
	});

	it("should use custom marginBottom value", () => {
		const s = createInstance();
		const result = useDlElement(s, { marginBottom: "2rem" });

		expect(result.dlMarginBottom.value).toBe("2rem");
	});
});
