import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFontWeightUtility } from "./useFontWeightUtility";

describe("useFontWeightUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFontWeightUtility(s, { normal: "400", bold: "700" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "font-weight",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFontWeightUtility(s, { semibold: "600" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ fontWeight: "600" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFontWeightUtility(s, { light: "300", medium: "500", bold: "700" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._font-weight\:light {`);
		expect(css).toContain("font-weight: 300;");
		expect(css).toContain(String.raw`._font-weight\:bold {`);
		expect(css).toContain("font-weight: 700;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFontWeightUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const fontWeightBold = s.variable("font-weight.bold", "700");
		useFontWeightUtility(s, { bold: s.ref(fontWeightBold) });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations?.fontWeight).toEqual({
			type: "reference",
			name: "font-weight.bold",
		});
	});
});
