import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useMarkElement } from "./useMarkElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useMarkElement", () => {
	it("should create mark variables and selector", () => {
		const s = createInstance();
		const result = useMarkElement(s);

		expect(result.markBackground).toBeDefined();
		expect(result.markColor).toBeDefined();
		expect(result.markPaddingTop).toBeDefined();
		expect(result.markPaddingRight).toBeDefined();
		expect(result.markPaddingBottom).toBeDefined();
		expect(result.markPaddingLeft).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("mark");
		expect(css).toContain("var(--mark--background)");
		expect(css).toContain("var(--mark--color)");
		expect(css).toContain("var(--mark--padding-top)");
		expect(css).toContain("var(--mark--padding-right)");
		expect(css).toContain("var(--mark--padding-bottom)");
		expect(css).toContain("var(--mark--padding-left)");
	});

	it("should use custom values", () => {
		const s = createInstance();
		const result = useMarkElement(s, {
			background: "#ff0",
			color: "#000",
			paddingTop: "0.25rem",
			paddingRight: "0.5rem",
			paddingBottom: "0.25rem",
			paddingLeft: "0.5rem",
		});

		expect(result.markBackground.value).toBe("#ff0");
		expect(result.markColor.value).toBe("#000");
		expect(result.markPaddingTop.value).toBe("0.25rem");
		expect(result.markPaddingRight.value).toBe("0.5rem");
		expect(result.markPaddingBottom.value).toBe("0.25rem");
		expect(result.markPaddingLeft.value).toBe("0.5rem");
	});
});
