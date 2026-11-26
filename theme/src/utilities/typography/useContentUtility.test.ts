import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useContentUtility } from "./useContentUtility";

describe("useContentUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useContentUtility(s, { none: "none", empty: "''" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "content",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useContentUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ content: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useContentUtility(s, { empty: "''" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._content\:empty {`);
		expect(css).toContain("content: '';");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useContentUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
