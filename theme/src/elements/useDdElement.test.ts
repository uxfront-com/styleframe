import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useDdElement } from "./useDdElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useDdElement", () => {
	it("should create dd variable and selector", () => {
		const s = createInstance();
		const result = useDdElement(s);

		expect(result.ddMarginBottom).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("var(--dd--margin-bottom)");
	});

	it("should use custom marginBottom", () => {
		const s = createInstance();
		const result = useDdElement(s, {
			marginBottom: "2rem",
		});

		expect(result.ddMarginBottom.value).toBe("2rem");
	});

	it("should use custom marginLeft", () => {
		const s = createInstance();
		useDdElement(s, { marginLeft: "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("1rem");
	});
});
