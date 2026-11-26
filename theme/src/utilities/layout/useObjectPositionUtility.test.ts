import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useObjectPositionUtility } from "./useObjectPositionUtility";

describe("useObjectPositionUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useObjectPositionUtility(s, { center: "center", top: "top" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "object-position",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useObjectPositionUtility(s, { center: "center" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ objectPosition: "center" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useObjectPositionUtility(s, { "left-top": "left top" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._object-position\:left-top {`);
		expect(css).toContain("object-position: left top;");
	});

	it("should handle single position values", () => {
		const s = styleframe();
		useObjectPositionUtility(s, { bottom: "bottom" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ objectPosition: "bottom" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useObjectPositionUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
