import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useImgElement } from "./useImgElement";

describe("useImgElement", () => {
	it("should create img, svg selector", () => {
		const s = styleframe();
		useImgElement(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("img, svg");
		expect(css).toContain("vertical-align: middle");
	});
});
