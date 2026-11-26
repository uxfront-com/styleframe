import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useIframeElement } from "./useIframeElement";

describe("useIframeElement", () => {
	it("should create iframe selector", () => {
		const s = styleframe();
		useIframeElement(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("iframe");
		expect(css).toContain("border: 0");
	});
});
