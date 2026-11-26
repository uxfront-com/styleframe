import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useGapUtility, useGapXUtility, useGapYUtility } from "./useGapUtility";

describe("useGapUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useGapUtility(s, { "0": "0", "4": "1rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "gap",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useGapUtility(s, { "4": "1rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gap: "1rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGapUtility(s, { "2": "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._gap\:2 {`);
		expect(css).toContain("gap: 0.5rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useGapUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useGapXUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGapXUtility(s, { "4": "1rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ columnGap: "1rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGapXUtility(s, { "2": "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._gap-x\:2 {`);
		expect(css).toContain("column-gap: 0.5rem;");
	});
});

describe("useGapYUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGapYUtility(s, { "4": "1rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ rowGap: "1rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGapYUtility(s, { "2": "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._gap-y\:2 {`);
		expect(css).toContain("row-gap: 0.5rem;");
	});
});
