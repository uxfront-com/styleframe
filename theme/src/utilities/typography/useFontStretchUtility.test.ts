import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useFontStretchUtility } from "./useFontStretchUtility";

describe("useFontStretchUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFontStretchUtility(s, { condensed: "condensed", expanded: "expanded" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "font-stretch",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFontStretchUtility(s, { normal: "normal" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ fontStretch: "normal" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFontStretchUtility(s, { "semi-condensed": "semi-condensed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._font-stretch\:semi-condensed {`);
		expect(css).toContain("font-stretch: semi-condensed;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFontStretchUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
