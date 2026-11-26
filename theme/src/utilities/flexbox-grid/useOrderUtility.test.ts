import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useOrderUtility } from "./useOrderUtility";

describe("useOrderUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useOrderUtility(s, { "1": "1", "2": "2", "3": "3" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "order",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useOrderUtility(s, { "2": "2" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ order: "2" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOrderUtility(s, { first: "-9999" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._order\:first {`);
		expect(css).toContain("order: -9999;");
	});

	it("should handle last value", () => {
		const s = styleframe();
		useOrderUtility(s, { last: "9999" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ order: "9999" });
	});

	it("should handle none value", () => {
		const s = styleframe();
		useOrderUtility(s, { none: "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ order: "0" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useOrderUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
