import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useOutlineWidthUtility,
	useOutlineColorUtility,
	useOutlineStyleUtility,
	useOutlineOffsetUtility,
} from "./useOutlineUtility";

describe("useOutlineWidthUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useOutlineWidthUtility(s, { "0": "0px", "2": "2px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "outline-width",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useOutlineWidthUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ outlineWidth: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOutlineWidthUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._outline-width\:4 {`);
		expect(css).toContain("outline-width: 4px;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useOutlineWidthUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useOutlineColorUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useOutlineColorUtility(s, { blue: "blue" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ outlineColor: "blue" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOutlineColorUtility(s, { red: "red" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._outline-color\:red {`);
		expect(css).toContain("outline-color: red;");
	});
});

describe("useOutlineStyleUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useOutlineStyleUtility(s, { solid: "solid" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ outlineStyle: "solid" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOutlineStyleUtility(s, { dashed: "dashed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._outline-style\:dashed {`);
		expect(css).toContain("outline-style: dashed;");
	});

	it("should handle all style values", () => {
		const s = styleframe();
		useOutlineStyleUtility(s, {
			none: "none",
			solid: "solid",
			dashed: "dashed",
			dotted: "dotted",
			double: "double",
		});

		expect(s.root.children).toHaveLength(5);
	});
});

describe("useOutlineOffsetUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useOutlineOffsetUtility(s, { "2": "2px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ outlineOffset: "2px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useOutlineOffsetUtility(s, { "4": "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._outline-offset\:4 {`);
		expect(css).toContain("outline-offset: 4px;");
	});
});
