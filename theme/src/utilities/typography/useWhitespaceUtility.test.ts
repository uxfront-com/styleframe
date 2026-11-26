import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useWhitespaceUtility } from "./useWhitespaceUtility";

describe("useWhitespaceUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useWhitespaceUtility(s, { normal: "normal", nowrap: "nowrap" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "whitespace",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useWhitespaceUtility(s, { pre: "pre" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ whiteSpace: "pre" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useWhitespaceUtility(s, { nowrap: "nowrap", "pre-wrap": "pre-wrap" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._whitespace\:nowrap {`);
		expect(css).toContain("white-space: nowrap;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useWhitespaceUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
