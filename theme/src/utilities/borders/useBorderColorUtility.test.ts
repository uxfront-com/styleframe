import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useBorderColorUtility,
	useBorderColorXUtility,
	useBorderColorYUtility,
	useBorderColorTopUtility,
	useBorderColorRightUtility,
	useBorderColorBottomUtility,
	useBorderColorLeftUtility,
	useBorderColorStartUtility,
	useBorderColorEndUtility,
} from "./useBorderColorUtility";

describe("useBorderColorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderColorUtility(s, { black: "#000", white: "#fff" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-color",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderColorUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderColor: "red" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderColorUtility(s, { transparent: "transparent" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-color\:transparent {`);
		expect(css).toContain("border-color: transparent;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderColorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderColorXUtility", () => {
	it("should set correct declarations for horizontal sides", () => {
		const s = styleframe();
		useBorderColorXUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderLeftColor: "red",
			borderRightColor: "red",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderColorXUtility(s, { blue: "blue" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-x-color\:blue {`);
		expect(css).toContain("border-left-color: blue;");
		expect(css).toContain("border-right-color: blue;");
	});
});

describe("useBorderColorYUtility", () => {
	it("should set correct declarations for vertical sides", () => {
		const s = styleframe();
		useBorderColorYUtility(s, { green: "green" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderTopColor: "green",
			borderBottomColor: "green",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderColorYUtility(s, { gray: "gray" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-y-color\:gray {`);
		expect(css).toContain("border-top-color: gray;");
		expect(css).toContain("border-bottom-color: gray;");
	});
});

describe("useBorderColorTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderColorTopUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderTopColor: "red" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderColorTopUtility(s, { blue: "blue" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-top-color\:blue {`);
		expect(css).toContain("border-top-color: blue;");
	});
});

describe("useBorderColorRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderColorRightUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderRightColor: "red" });
	});
});

describe("useBorderColorBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderColorBottomUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderBottomColor: "red" });
	});
});

describe("useBorderColorLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderColorLeftUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderLeftColor: "red" });
	});
});

describe("useBorderColorStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderColorStartUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderInlineStartColor: "red" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderColorStartUtility(s, { blue: "blue" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-inline-start-color\:blue {`);
		expect(css).toContain("border-inline-start-color: blue;");
	});
});

describe("useBorderColorEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderColorEndUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderInlineEndColor: "red" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderColorEndUtility(s, { blue: "blue" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-inline-end-color\:blue {`);
		expect(css).toContain("border-inline-end-color: blue;");
	});
});
