import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useOverflowWrapUtility } from "./useOverflowWrapUtility";

describe("useOverflowWrapUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useOverflowWrapUtility(s, { normal: "normal", "break-word": "break-word" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "overflow-wrap",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useOverflowWrapUtility(s, { anywhere: "anywhere" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ overflowWrap: "anywhere" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOverflowWrapUtility(s, { "break-word": "break-word" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._overflow-wrap\:break-word {`);
		expect(css).toContain("overflow-wrap: break-word;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useOverflowWrapUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
