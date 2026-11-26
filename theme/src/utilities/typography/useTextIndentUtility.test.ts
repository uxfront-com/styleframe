import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useTextIndentUtility } from "./useTextIndentUtility";

describe("useTextIndentUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextIndentUtility(s, { "0": "0", "1": "0.25rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-indent",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextIndentUtility(s, { "2": "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textIndent: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextIndentUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-indent\:4 {`);
		expect(css).toContain("text-indent: 1rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextIndentUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
