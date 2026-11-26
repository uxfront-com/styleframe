import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useZIndexUtility } from "./useZIndexUtility";

describe("useZIndexUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useZIndexUtility(s, { "0": "0", "10": "10", "20": "20" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "z-index",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useZIndexUtility(s, { "10": "10" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ zIndex: "10" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useZIndexUtility(s, { "50": "50" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._z-index\:50 {`);
		expect(css).toContain("z-index: 50;");
	});

	it("should handle auto value", () => {
		const s = styleframe();
		useZIndexUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ zIndex: "auto" });
	});

	it("should handle negative values", () => {
		const s = styleframe();
		useZIndexUtility(s, { "-10": "-10" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ zIndex: "-10" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useZIndexUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
