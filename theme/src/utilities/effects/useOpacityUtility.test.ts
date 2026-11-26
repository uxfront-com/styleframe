import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useOpacityUtility } from "./useOpacityUtility";

describe("useOpacityUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useOpacityUtility(s, { "0": "0", "100": "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "opacity",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useOpacityUtility(s, { "50": "0.5" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ opacity: "0.5" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOpacityUtility(s, { "75": "0.75" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._opacity\:75 {`);
		expect(css).toContain("opacity: 0.75;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useOpacityUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
