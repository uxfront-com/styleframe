import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useOutputElement } from "./useOutputElement";

describe("useOutputElement", () => {
	it("should create output selector", () => {
		const s = styleframe();
		useOutputElement(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("output");
		expect(css).toContain("display: inline-block");
	});
});
