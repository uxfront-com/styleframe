import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBackgroundPositionUtility } from "./useBackgroundPositionUtility";

describe("useBackgroundPositionUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundPositionUtility(s, { center: "center", top: "top" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-position",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundPositionUtility(s, { bottom: "bottom" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundPosition: "bottom" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundPositionUtility(s, { "left-top": "left top" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-position\:left-top {`);
		expect(css).toContain("background-position: left top;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundPositionUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
