import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useLineClampUtility } from "./useLineClampUtility";

describe("useLineClampUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useLineClampUtility(s, { "1": "1", "2": "2", "3": "3" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "line-clamp",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should set correct declarations for clamped lines", () => {
		const s = styleframe();
		useLineClampUtility(s, { "2": "2" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			overflow: "hidden",
			display: "-webkit-box",
			WebkitBoxOrient: "vertical",
			WebkitLineClamp: "2",
		});
	});

	it("should set correct declarations for unset/none value", () => {
		const s = styleframe();
		useLineClampUtility(s, { none: "unset" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			overflow: "visible",
			display: "block",
			WebkitBoxOrient: "horizontal",
			WebkitLineClamp: "unset",
		});
	});

	it("should compile to correct CSS output for clamped lines", () => {
		const s = styleframe();
		useLineClampUtility(s, { "3": "3" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._line-clamp\:3 {`);
		expect(css).toContain("overflow: hidden;");
		expect(css).toContain("display: -webkit-box;");
		expect(css).toContain("webkit-line-clamp: 3;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useLineClampUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
