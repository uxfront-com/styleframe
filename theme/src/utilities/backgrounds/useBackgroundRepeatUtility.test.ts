import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useBackgroundRepeatUtility } from "./useBackgroundRepeatUtility";

describe("useBackgroundRepeatUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundRepeatUtility(s, {
			repeat: "repeat",
			"no-repeat": "no-repeat",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-repeat",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundRepeatUtility(s, { "repeat-x": "repeat-x" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundRepeat: "repeat-x" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundRepeatUtility(s, { "no-repeat": "no-repeat" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-repeat\:no-repeat {`);
		expect(css).toContain("background-repeat: no-repeat;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundRepeatUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
