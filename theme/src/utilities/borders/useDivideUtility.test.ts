import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useDivideXUtility,
	useDivideYUtility,
	useDivideXReverseUtility,
	useDivideYReverseUtility,
	useDivideColorUtility,
	useDivideStyleUtility,
} from "./useDivideUtility";

describe("useDivideXUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useDivideXUtility(s, { "0": "0px", "2": "2px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "divide-x",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should compile to correct CSS output with nested selector", () => {
		const s = styleframe();
		useDivideXUtility(s, { "2": "2px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._divide-x\:2 {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("border-left-width: 2px;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useDivideXUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useDivideYUtility", () => {
	it("should compile to correct CSS output with nested selector", () => {
		const s = styleframe();
		useDivideYUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._divide-y\:4 {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("border-top-width: 4px;");
	});
});

describe("useDivideXReverseUtility", () => {
	it("should compile to correct CSS output with reversed borders", () => {
		const s = styleframe();
		useDivideXReverseUtility(s, { "2": "2px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._divide-x-reverse\:2 {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("border-right-width: 2px;");
		expect(css).toContain("border-left-width: 0;");
	});
});

describe("useDivideYReverseUtility", () => {
	it("should compile to correct CSS output with reversed borders", () => {
		const s = styleframe();
		useDivideYReverseUtility(s, { "2": "2px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._divide-y-reverse\:2 {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("border-bottom-width: 2px;");
		expect(css).toContain("border-top-width: 0;");
	});
});

describe("useDivideColorUtility", () => {
	it("should compile to correct CSS output with nested selector", () => {
		const s = styleframe();
		useDivideColorUtility(s, { gray: "gray" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._divide-color\:gray {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("border-color: gray;");
	});
});

describe("useDivideStyleUtility", () => {
	it("should compile to correct CSS output with nested selector", () => {
		const s = styleframe();
		useDivideStyleUtility(s, { dashed: "dashed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._divide-style\:dashed {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("border-style: dashed;");
	});

	it("should handle all style values", () => {
		const s = styleframe();
		useDivideStyleUtility(s, {
			solid: "solid",
			dashed: "dashed",
			dotted: "dotted",
		});

		expect(s.root.children).toHaveLength(3);
	});
});
