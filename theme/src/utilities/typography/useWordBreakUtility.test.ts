import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useWordBreakUtility } from "./useWordBreakUtility";

describe("useWordBreakUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useWordBreakUtility(s, { normal: "normal", "break-all": "break-all" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "word-break",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useWordBreakUtility(s, { "break-word": "break-word" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ wordBreak: "break-word" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useWordBreakUtility(s, { "break-all": "break-all" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._word-break\:break-all {`);
		expect(css).toContain("word-break: break-all;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useWordBreakUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
