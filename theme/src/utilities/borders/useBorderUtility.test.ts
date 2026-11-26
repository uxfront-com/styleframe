import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useBorderUtility,
	useBorderTopUtility,
	useBorderRightUtility,
	useBorderBottomUtility,
	useBorderLeftUtility,
} from "./useBorderUtility";

describe("useBorderUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderUtility(s, { thin: "1px solid black" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderUtility(s, { thin: "1px solid black" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ border: "1px solid black" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderUtility(s, { thin: "1px solid black" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border\:thin {`);
		expect(css).toContain("border: 1px solid black;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderTopUtility(s, { thin: "1px solid black" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderTop: "1px solid black" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderTopUtility(s, { thin: "1px solid black" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-top\:thin {`);
		expect(css).toContain("border-top: 1px solid black;");
	});
});

describe("useBorderRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRightUtility(s, { thin: "1px solid black" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderRight: "1px solid black" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderRightUtility(s, { thin: "1px solid black" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-right\:thin {`);
		expect(css).toContain("border-right: 1px solid black;");
	});
});

describe("useBorderBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderBottomUtility(s, { thin: "1px solid black" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderBottom: "1px solid black" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderBottomUtility(s, { thin: "1px solid black" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-bottom\:thin {`);
		expect(css).toContain("border-bottom: 1px solid black;");
	});
});

describe("useBorderLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderLeftUtility(s, { thin: "1px solid black" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderLeft: "1px solid black" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderLeftUtility(s, { thin: "1px solid black" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-left\:thin {`);
		expect(css).toContain("border-left: 1px solid black;");
	});
});
