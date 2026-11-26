import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useTextUnderlineOffsetUtility } from "./useTextUnderlineOffsetUtility";

describe("useTextUnderlineOffsetUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextUnderlineOffsetUtility(s, { auto: "auto", "1": "1px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-underline-offset",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextUnderlineOffsetUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textUnderlineOffset: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextUnderlineOffsetUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-underline-offset\:auto {`);
		expect(css).toContain("text-underline-offset: auto;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextUnderlineOffsetUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
