import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useTextAlignUtility } from "./useTextAlignUtility";

describe("useTextAlignUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextAlignUtility(s, { left: "left", center: "center", right: "right" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-align",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextAlignUtility(s, { justify: "justify" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textAlign: "justify" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextAlignUtility(s, { left: "left", center: "center" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-align\:left {`);
		expect(css).toContain("text-align: left;");
		expect(css).toContain(String.raw`._text-align\:center {`);
		expect(css).toContain("text-align: center;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextAlignUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
