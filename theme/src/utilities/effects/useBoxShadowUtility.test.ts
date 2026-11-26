import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBoxShadowUtility, useBoxShadowColorUtility } from "./useBoxShadowUtility";

describe("useBoxShadowUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBoxShadowUtility(s, {
			sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
			md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "box-shadow",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBoxShadowUtility(s, { sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--box-shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
			boxShadow:
				"var(--box-shadow-ring-offset, 0 0 #0000), var(--box-shadow-ring, 0 0 #0000), var(--box-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBoxShadowUtility(s, { lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._box-shadow\:lg {`);
		expect(css).toContain("--box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);");
		expect(css).toContain(
			"box-shadow: var(--box-shadow-ring-offset, 0 0 #0000), var(--box-shadow-ring, 0 0 #0000), var(--box-shadow);",
		);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBoxShadowUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBoxShadowColorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBoxShadowColorUtility(s, { red: "red", blue: "blue" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "box-shadow-color",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBoxShadowColorUtility(s, { primary: "#006cff" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ "--box-shadow-color": "#006cff" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBoxShadowColorUtility(s, { black: "#000" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._box-shadow-color\:black {`);
		expect(css).toContain("--box-shadow-color: #000;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBoxShadowColorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
