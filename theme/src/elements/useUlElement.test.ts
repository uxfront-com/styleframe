import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useUlElement } from "./useUlElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useUlElement", () => {
	it("should create ul variables and selector with defaults", () => {
		const s = createInstance();
		const result = useUlElement(s);

		expect(result.ulMarginBottom).toBeDefined();
		expect(result.ulPaddingLeft).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("ul");
		expect(css).toContain("var(--ul--margin-bottom)");
		expect(css).toContain("var(--ul--padding-left)");
	});

	it("should use custom config values", () => {
		const s = createInstance();
		const result = useUlElement(s, {
			marginBottom: "2rem",
			paddingLeft: "3rem",
		});

		expect(result.ulMarginBottom.value).toBe("2rem");
		expect(result.ulPaddingLeft.value).toBe("3rem");
	});
});
