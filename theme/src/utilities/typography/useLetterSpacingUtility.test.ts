import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useLetterSpacingUtility } from "./useLetterSpacingUtility";

describe("useLetterSpacingUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useLetterSpacingUtility(s, { tight: "-0.05em", wide: "0.05em" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "letter-spacing",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useLetterSpacingUtility(s, { normal: "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ letterSpacing: "0" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useLetterSpacingUtility(s, { tighter: "-0.05em", wider: "0.1em" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._letter-spacing\:tighter {`);
		expect(css).toContain("letter-spacing: -0.05em;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useLetterSpacingUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
