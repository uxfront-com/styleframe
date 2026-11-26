import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useCaptionElement } from "./useCaptionElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useCaptionElement", () => {
	it("should create caption variable and selector", () => {
		const s = createInstance();
		const result = useCaptionElement(s);

		expect(result.captionColor).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("caption");
		expect(css).toContain("--caption--color");
		expect(css).toContain("text-align: left");
	});
});
