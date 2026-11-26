import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBackgroundColorUtility } from "./useBackgroundColorUtility";

describe("useBackgroundColorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundColorUtility(s, { black: "#000", white: "#fff" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-color",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundColorUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundColor: "red" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundColorUtility(s, { transparent: "transparent" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:transparent {`);
		expect(css).toContain("background-color: transparent;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundColorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
