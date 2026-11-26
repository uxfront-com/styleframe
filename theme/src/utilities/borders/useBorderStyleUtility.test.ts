import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useBorderStyleUtility,
	useBorderStyleXUtility,
	useBorderStyleYUtility,
	useBorderStyleTopUtility,
	useBorderStyleRightUtility,
	useBorderStyleBottomUtility,
	useBorderStyleLeftUtility,
	useBorderStyleStartUtility,
	useBorderStyleEndUtility,
} from "./useBorderStyleUtility";

describe("useBorderStyleUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderStyleUtility(s, { solid: "solid", dashed: "dashed" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-style",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderStyle: "solid" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderStyleUtility(s, { dotted: "dotted" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-style\:dotted {`);
		expect(css).toContain("border-style: dotted;");
	});

	it("should handle all style values", () => {
		const s = styleframe();
		useBorderStyleUtility(s, {
			solid: "solid",
			dashed: "dashed",
			dotted: "dotted",
			double: "double",
			hidden: "hidden",
			none: "none",
		});

		expect(s.root.children).toHaveLength(6);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderStyleUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderStyleXUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleXUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderLeftStyle: "solid",
			borderRightStyle: "solid",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderStyleXUtility(s, { dashed: "dashed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-x-style\:dashed {`);
		expect(css).toContain("border-left-style: dashed;");
		expect(css).toContain("border-right-style: dashed;");
	});
});

describe("useBorderStyleYUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleYUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderTopStyle: "solid",
			borderBottomStyle: "solid",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderStyleYUtility(s, { dashed: "dashed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-y-style\:dashed {`);
		expect(css).toContain("border-top-style: dashed;");
		expect(css).toContain("border-bottom-style: dashed;");
	});
});

describe("useBorderStyleTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleTopUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderTopStyle: "solid" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderStyleTopUtility(s, { dashed: "dashed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-top-style\:dashed {`);
		expect(css).toContain("border-top-style: dashed;");
	});
});

describe("useBorderStyleRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleRightUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderRightStyle: "solid" });
	});
});

describe("useBorderStyleBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleBottomUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderBottomStyle: "solid" });
	});
});

describe("useBorderStyleLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleLeftUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderLeftStyle: "solid" });
	});
});

describe("useBorderStyleStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleStartUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderInlineStartStyle: "solid" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderStyleStartUtility(s, { dashed: "dashed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-inline-start-style\:dashed {`);
		expect(css).toContain("border-inline-start-style: dashed;");
	});
});

describe("useBorderStyleEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderStyleEndUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderInlineEndStyle: "solid" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderStyleEndUtility(s, { dashed: "dashed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-inline-end-style\:dashed {`);
		expect(css).toContain("border-inline-end-style: dashed;");
	});
});
