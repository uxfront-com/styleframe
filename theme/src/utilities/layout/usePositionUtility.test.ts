import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { usePositionUtility } from "./usePositionUtility";

describe("usePositionUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePositionUtility(s, { relative: "relative", absolute: "absolute" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "position",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePositionUtility(s, { fixed: "fixed" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ position: "fixed" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePositionUtility(s, { sticky: "sticky" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._position\:sticky {`);
		expect(css).toContain("position: sticky;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePositionUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
