import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useOlElement } from "./useOlElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useOlElement", () => {
	it("should create ol variables and selector with defaults", () => {
		const s = createInstance();
		const result = useOlElement(s);

		expect(result.olMarginBottom).toBeDefined();
		expect(result.olPaddingLeft).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("ol");
		expect(css).toContain("var(--ol--margin-bottom)");
		expect(css).toContain("var(--ol--padding-left)");
	});

	it("should use custom config values", () => {
		const s = createInstance();
		const result = useOlElement(s, {
			marginBottom: "2rem",
			paddingLeft: "3rem",
		});

		expect(result.olMarginBottom.value).toBe("2rem");
		expect(result.olPaddingLeft.value).toBe("3rem");
	});
});
