import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFontFamilyUtility } from "./useFontFamilyUtility";

describe("useFontFamilyUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFontFamilyUtility(s, {
			sans: "ui-sans-serif, system-ui",
			mono: "ui-monospace",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "font-family",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFontFamilyUtility(s, { serif: "ui-serif, Georgia" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ fontFamily: "ui-serif, Georgia" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFontFamilyUtility(s, { sans: "Arial, sans-serif" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._font-family\:sans {`);
		expect(css).toContain("font-family: Arial, sans-serif;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFontFamilyUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
