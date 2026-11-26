import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFlexWrapUtility } from "./useFlexWrapUtility";

describe("useFlexWrapUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFlexWrapUtility(s, { wrap: "wrap", nowrap: "nowrap" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "flex-wrap",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFlexWrapUtility(s, { wrap: "wrap" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexWrap: "wrap" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFlexWrapUtility(s, { "wrap-reverse": "wrap-reverse" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._flex-wrap\:wrap-reverse {`);
		expect(css).toContain("flex-wrap: wrap-reverse;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFlexWrapUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
