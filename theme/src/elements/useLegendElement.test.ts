import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useLegendElement } from "./useLegendElement";

describe("useLegendElement", () => {
	it("should create legend selector", () => {
		const s = styleframe();
		useLegendElement(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("legend");
		expect(css).toContain("float: left");
		expect(css).toContain("width: 100%");
	});
});
