import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useTextShadowUtility, useTextShadowColorUtility } from "./useTextShadowUtility";

describe("useTextShadowUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextShadowUtility(s, {
			sm: "0 1px 2px var(--text-shadow-color, rgb(0 0 0 / 0.05))",
			md: "0 2px 4px var(--text-shadow-color, rgb(0 0 0 / 0.1))",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-shadow",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextShadowUtility(s, {
			sm: "0 1px 2px var(--text-shadow-color, rgb(0 0 0 / 0.05))",
		});

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			textShadow: "0 1px 2px var(--text-shadow-color, rgb(0 0 0 / 0.05))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextShadowUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-shadow\:none {`);
		expect(css).toContain("text-shadow: none;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextShadowUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTextShadowColorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextShadowColorUtility(s, { red: "red", blue: "blue" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-shadow-color",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextShadowColorUtility(s, { primary: "#006cff" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--text-shadow-color": "#006cff",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextShadowColorUtility(s, { black: "#000" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-shadow-color\:black {`);
		expect(css).toContain("--text-shadow-color: #000;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextShadowColorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
