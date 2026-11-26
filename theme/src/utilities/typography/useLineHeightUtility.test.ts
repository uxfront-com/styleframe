import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useLineHeightUtility } from "./useLineHeightUtility";

describe("useLineHeightUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useLineHeightUtility(s, { tight: "1.25", normal: "1.5" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "line-height",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useLineHeightUtility(s, { relaxed: "1.625" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ lineHeight: "1.625" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useLineHeightUtility(s, { none: "1", tight: "1.25", normal: "1.5" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._line-height\:none {`);
		expect(css).toContain("line-height: 1;");
		expect(css).toContain(String.raw`._line-height\:tight {`);
		expect(css).toContain("line-height: 1.25;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useLineHeightUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
