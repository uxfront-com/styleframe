import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useBorderWidthUtility,
	useBorderWidthXUtility,
	useBorderWidthYUtility,
	useBorderWidthTopUtility,
	useBorderWidthRightUtility,
	useBorderWidthBottomUtility,
	useBorderWidthLeftUtility,
	useBorderWidthStartUtility,
	useBorderWidthEndUtility,
} from "./useBorderWidthUtility";

describe("useBorderWidthUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderWidthUtility(s, { "0": "0px", "2": "2px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-width",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderWidth: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderWidthUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-width\:4 {`);
		expect(css).toContain("border-width: 4px;");
	});

	it("should handle default key", () => {
		const s = styleframe();
		useBorderWidthUtility(s, { default: "1px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._border-width {");
		expect(css).toContain("border-width: 1px;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderWidthUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderWidthXUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthXUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderLeftWidth: "2px",
			borderRightWidth: "2px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderWidthXUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-x-width\:4 {`);
		expect(css).toContain("border-left-width: 4px;");
		expect(css).toContain("border-right-width: 4px;");
	});
});

describe("useBorderWidthYUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthYUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderTopWidth: "2px",
			borderBottomWidth: "2px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderWidthYUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-y-width\:4 {`);
		expect(css).toContain("border-top-width: 4px;");
		expect(css).toContain("border-bottom-width: 4px;");
	});
});

describe("useBorderWidthTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthTopUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderTopWidth: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderWidthTopUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-top-width\:4 {`);
		expect(css).toContain("border-top-width: 4px;");
	});
});

describe("useBorderWidthRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthRightUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderRightWidth: "2px" });
	});
});

describe("useBorderWidthBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthBottomUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderBottomWidth: "2px" });
	});
});

describe("useBorderWidthLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthLeftUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderLeftWidth: "2px" });
	});
});

describe("useBorderWidthStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthStartUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderInlineStartWidth: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderWidthStartUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-inline-start-width\:4 {`);
		expect(css).toContain("border-inline-start-width: 4px;");
	});
});

describe("useBorderWidthEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderWidthEndUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderInlineEndWidth: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderWidthEndUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-inline-end-width\:4 {`);
		expect(css).toContain("border-inline-end-width: 4px;");
	});
});
