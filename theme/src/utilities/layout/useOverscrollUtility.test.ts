import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useOverscrollUtility,
	useOverscrollXUtility,
	useOverscrollYUtility,
} from "./useOverscrollUtility";

describe("useOverscrollUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useOverscrollUtility(s, { auto: "auto", contain: "contain" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "overscroll",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useOverscrollUtility(s, { contain: "contain" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ overscrollBehavior: "contain" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOverscrollUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._overscroll\:none {`);
		expect(css).toContain("overscroll-behavior: none;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useOverscrollUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useOverscrollXUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useOverscrollXUtility(s, { contain: "contain" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ overscrollBehaviorX: "contain" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOverscrollXUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._overscroll-x\:auto {`);
		expect(css).toContain("overscroll-behavior-x: auto;");
	});
});

describe("useOverscrollYUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useOverscrollYUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ overscrollBehaviorY: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOverscrollYUtility(s, { contain: "contain" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._overscroll-y\:contain {`);
		expect(css).toContain("overscroll-behavior-y: contain;");
	});
});
