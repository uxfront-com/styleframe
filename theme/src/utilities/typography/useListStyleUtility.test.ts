import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useListStyleImageUtility,
	useListStylePositionUtility,
	useListStyleTypeUtility,
	useListStyleUtility,
} from "./useListStyleUtility";

describe("useListStyleUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useListStyleUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ listStyle: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useListStyleUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._list-style\:none {`);
		expect(css).toContain("list-style: none;");
	});
});

describe("useListStyleTypeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useListStyleTypeUtility(s, { disc: "disc", decimal: "decimal" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "list-style-type",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useListStyleTypeUtility(s, { disc: "disc" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ listStyleType: "disc" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useListStyleTypeUtility(s, { decimal: "decimal", disc: "disc" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._list-style-type\:decimal {`);
		expect(css).toContain("list-style-type: decimal;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useListStyleTypeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useListStylePositionUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useListStylePositionUtility(s, { inside: "inside" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ listStylePosition: "inside" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useListStylePositionUtility(s, { inside: "inside", outside: "outside" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._list-style-position\:inside {`);
		expect(css).toContain("list-style-position: inside;");
	});
});

describe("useListStyleImageUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useListStyleImageUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ listStyleImage: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useListStyleImageUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._list-style-image\:none {`);
		expect(css).toContain("list-style-image: none;");
	});
});
