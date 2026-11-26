import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useVerticalAlignUtility } from "./useVerticalAlignUtility";

describe("useVerticalAlignUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useVerticalAlignUtility(s, {
			top: "top",
			middle: "middle",
			bottom: "bottom",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "vertical-align",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useVerticalAlignUtility(s, { baseline: "baseline" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ verticalAlign: "baseline" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useVerticalAlignUtility(s, { middle: "middle", "text-top": "text-top" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._vertical-align\:middle {`);
		expect(css).toContain("vertical-align: middle;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useVerticalAlignUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
