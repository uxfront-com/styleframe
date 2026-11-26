import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useFlexDirectionUtility } from "./useFlexDirectionUtility";

describe("useFlexDirectionUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFlexDirectionUtility(s, { row: "row", col: "column" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "flex-direction",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFlexDirectionUtility(s, { col: "column" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexDirection: "column" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFlexDirectionUtility(s, { "row-reverse": "row-reverse" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._flex-direction\:row-reverse {`);
		expect(css).toContain("flex-direction: row-reverse;");
	});

	it("should handle column-reverse value", () => {
		const s = styleframe();
		useFlexDirectionUtility(s, { "col-reverse": "column-reverse" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexDirection: "column-reverse" });
	});

	it("should support the full-word column alias", () => {
		const s = styleframe();
		useFlexDirectionUtility(s, { column: "column" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexDirection: "column" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFlexDirectionUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
