import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFontVariantNumericUtility } from "./useFontVariantNumericUtility";

describe("useFontVariantNumericUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFontVariantNumericUtility(s, {
			ordinal: "ordinal",
			tabular: "tabular-nums",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "font-variant-numeric",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFontVariantNumericUtility(s, { "slashed-zero": "slashed-zero" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			fontVariantNumeric: "slashed-zero",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFontVariantNumericUtility(s, { "lining-nums": "lining-nums" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._font-variant-numeric\:lining-nums {`);
		expect(css).toContain("font-variant-numeric: lining-nums;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFontVariantNumericUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
