import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useTextDecorationColorUtility,
	useTextDecorationLineUtility,
	useTextDecorationStyleUtility,
	useTextDecorationThicknessUtility,
} from "./useTextDecorationUtility";

describe("useTextDecorationLineUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextDecorationLineUtility(s, {
			underline: "underline",
			"line-through": "line-through",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-decoration-line",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextDecorationLineUtility(s, { underline: "underline" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textDecorationLine: "underline" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextDecorationLineUtility(s, { overline: "overline" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-decoration-line\:overline {`);
		expect(css).toContain("text-decoration-line: overline;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextDecorationLineUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTextDecorationStyleUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useTextDecorationStyleUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textDecorationStyle: "solid" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextDecorationStyleUtility(s, { dashed: "dashed", wavy: "wavy" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-decoration-style\:dashed {`);
		expect(css).toContain("text-decoration-style: dashed;");
	});
});

describe("useTextDecorationColorUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useTextDecorationColorUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textDecorationColor: "red" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextDecorationColorUtility(s, { current: "currentColor" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-decoration-color\:current {`);
		expect(css).toContain("text-decoration-color: currentColor;");
	});
});

describe("useTextDecorationThicknessUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useTextDecorationThicknessUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textDecorationThickness: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextDecorationThicknessUtility(s, {
			auto: "auto",
			"from-font": "from-font",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-decoration-thickness\:auto {`);
		expect(css).toContain("text-decoration-thickness: auto;");
	});
});
