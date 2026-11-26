import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFontStyleUtility } from "./useFontStyleUtility";

describe("useFontStyleUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFontStyleUtility(s, { normal: "normal", italic: "italic" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "font-style",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFontStyleUtility(s, { oblique: "oblique" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ fontStyle: "oblique" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFontStyleUtility(s, { italic: "italic" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._font-style\:italic {`);
		expect(css).toContain("font-style: italic;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFontStyleUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
