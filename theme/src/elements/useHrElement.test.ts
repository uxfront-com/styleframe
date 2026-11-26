import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useHrElement } from "./useHrElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useHrElement", () => {
	it("should create hr variables and selector", () => {
		const s = createInstance();
		const result = useHrElement(s);

		expect(result.hrBorderColor).toBeDefined();
		expect(result.hrBorderWidth).toBeDefined();
		expect(result.hrBorderStyle).toBeDefined();
		expect(result.hrMargin).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("hr");
		expect(css).toContain("var(--hr--border-color)");
		expect(css).toContain("var(--hr--border-width)");
		expect(css).toContain("var(--hr--border-style)");
		expect(css).toContain("var(--hr--margin)");
		expect(css).toContain("border-right-width: 0");
		expect(css).toContain("border-bottom-width: 0");
		expect(css).toContain("border-left-width: 0");
	});

	it("should use custom values", () => {
		const s = createInstance();
		const result = useHrElement(s, {
			borderColor: "#000",
			borderWidth: "2px",
			borderStyle: "dashed",
			margin: "2rem",
		});

		expect(result.hrBorderColor.value).toBe("#000");
		expect(result.hrBorderWidth.value).toBe("2px");
		expect(result.hrBorderStyle.value).toBe("dashed");
		expect(result.hrMargin.value).toBe("2rem");
	});
});
