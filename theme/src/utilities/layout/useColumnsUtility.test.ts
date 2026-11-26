import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useColumnsUtility } from "./useColumnsUtility";

describe("useColumnsUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useColumnsUtility(s, { "1": "1", "2": "2", "3": "3" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "columns",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useColumnsUtility(s, { "2": "2" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ columns: "2" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useColumnsUtility(s, { "3": "3" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._columns\:3 {`);
		expect(css).toContain("columns: 3;");
	});

	it("should handle width values", () => {
		const s = styleframe();
		useColumnsUtility(s, { xs: "20rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ columns: "20rem" });
	});

	it("should handle auto value", () => {
		const s = styleframe();
		useColumnsUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ columns: "auto" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useColumnsUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
