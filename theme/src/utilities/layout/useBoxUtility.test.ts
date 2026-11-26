import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBoxDecorationBreakUtility, useBoxSizingUtility } from "./useBoxUtility";

describe("useBoxDecorationBreakUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBoxDecorationBreakUtility(s, { clone: "clone", slice: "slice" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "box-decoration-break",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBoxDecorationBreakUtility(s, { clone: "clone" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ boxDecorationBreak: "clone" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBoxDecorationBreakUtility(s, { slice: "slice" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._box-decoration-break\:slice {`);
		expect(css).toContain("box-decoration-break: slice;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBoxDecorationBreakUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBoxSizingUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBoxSizingUtility(s, { border: "border-box", content: "content-box" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "box-sizing",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBoxSizingUtility(s, { border: "border-box" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ boxSizing: "border-box" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBoxSizingUtility(s, { content: "content-box" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._box-sizing\:content {`);
		expect(css).toContain("box-sizing: content-box;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBoxSizingUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
