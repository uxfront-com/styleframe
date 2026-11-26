import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useBreakAfterUtility,
	useBreakBeforeUtility,
	useBreakInsideUtility,
} from "./useBreakUtility";

describe("useBreakAfterUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBreakAfterUtility(s, { auto: "auto", page: "page" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "break-after",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBreakAfterUtility(s, { page: "page" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ breakAfter: "page" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBreakAfterUtility(s, { avoid: "avoid" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._break-after\:avoid {`);
		expect(css).toContain("break-after: avoid;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBreakAfterUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBreakBeforeUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBreakBeforeUtility(s, { column: "column" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ breakBefore: "column" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBreakBeforeUtility(s, { page: "page" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._break-before\:page {`);
		expect(css).toContain("break-before: page;");
	});
});

describe("useBreakInsideUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBreakInsideUtility(s, { avoid: "avoid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ breakInside: "avoid" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBreakInsideUtility(s, { "avoid-page": "avoid-page" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._break-inside\:avoid-page {`);
		expect(css).toContain("break-inside: avoid-page;");
	});
});
