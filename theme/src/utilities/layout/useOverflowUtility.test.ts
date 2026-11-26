import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useOverflowUtility,
	useOverflowXUtility,
	useOverflowYUtility,
} from "./useOverflowUtility";

describe("useOverflowUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useOverflowUtility(s, { hidden: "hidden", auto: "auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "overflow",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useOverflowUtility(s, { scroll: "scroll" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ overflow: "scroll" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOverflowUtility(s, { hidden: "hidden" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._overflow\:hidden {`);
		expect(css).toContain("overflow: hidden;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useOverflowUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useOverflowXUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useOverflowXUtility(s, { scroll: "scroll" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ overflowX: "scroll" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOverflowXUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._overflow-x\:auto {`);
		expect(css).toContain("overflow-x: auto;");
	});
});

describe("useOverflowYUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useOverflowYUtility(s, { hidden: "hidden" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ overflowY: "hidden" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOverflowYUtility(s, { visible: "visible" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._overflow-y\:visible {`);
		expect(css).toContain("overflow-y: visible;");
	});
});
