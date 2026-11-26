import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useSummaryElement } from "./useSummaryElement";

describe("useSummaryElement", () => {
	it("should create summary selector", () => {
		const s = styleframe();
		useSummaryElement(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("summary");
		expect(css).toContain("cursor: pointer");
	});
});
