import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFloatUtility } from "./useFloatUtility";

describe("useFloatUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFloatUtility(s, { left: "left", right: "right" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "float",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFloatUtility(s, { left: "left" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ float: "left" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFloatUtility(s, { right: "right" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._float\:right {`);
		expect(css).toContain("float: right;");
	});

	it("should handle start value", () => {
		const s = styleframe();
		useFloatUtility(s, { start: "inline-start" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ float: "inline-start" });
	});

	it("should handle none value", () => {
		const s = styleframe();
		useFloatUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ float: "none" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFloatUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
