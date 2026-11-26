import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { forcedColorAdjustValues } from "../../values";
import {
	useForcedColorAdjustUtility,
	useSrOnlyUtility,
	useNotSrOnlyUtility,
} from "./useAccessibilityUtility";

describe("useForcedColorAdjustUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useForcedColorAdjustUtility(s, { auto: "auto", none: "none" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "forced-color-adjust",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useForcedColorAdjustUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ forcedColorAdjust: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useForcedColorAdjustUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._forced-color-adjust\:none {`);
		expect(css).toContain("forced-color-adjust: none;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useForcedColorAdjustUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "forced-color-adjust",
		);
		expect(utilities).toHaveLength(Object.keys(forcedColorAdjustValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useForcedColorAdjustUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useSrOnlyUtility", () => {
	it("should create utility instance with default value", () => {
		const s = styleframe();
		useSrOnlyUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "sr-only",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations for screen reader only", () => {
		const s = styleframe();
		useSrOnlyUtility(s);

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			position: "absolute",
			width: "1px",
			height: "1px",
			padding: "0",
			margin: "-1px",
			overflow: "hidden",
			clip: "rect(0, 0, 0, 0)",
			whiteSpace: "nowrap",
			borderWidth: "0",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSrOnlyUtility(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._sr-only {");
		expect(css).toContain("position: absolute;");
		expect(css).toContain("width: 1px;");
		expect(css).toContain("height: 1px;");
		expect(css).toContain("padding: 0;");
		expect(css).toContain("margin: -1px;");
		expect(css).toContain("overflow: hidden;");
		expect(css).toContain("clip: rect(0, 0, 0, 0);");
		expect(css).toContain("white-space: nowrap;");
		expect(css).toContain("border-width: 0;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useSrOnlyUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useNotSrOnlyUtility", () => {
	it("should create utility instance with default value", () => {
		const s = styleframe();
		useNotSrOnlyUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "not-sr-only",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations to undo sr-only", () => {
		const s = styleframe();
		useNotSrOnlyUtility(s);

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			position: "static",
			width: "auto",
			height: "auto",
			padding: "0",
			margin: "0",
			overflow: "visible",
			clip: "auto",
			whiteSpace: "normal",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useNotSrOnlyUtility(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._not-sr-only {");
		expect(css).toContain("position: static;");
		expect(css).toContain("width: auto;");
		expect(css).toContain("height: auto;");
		expect(css).toContain("padding: 0;");
		expect(css).toContain("margin: 0;");
		expect(css).toContain("overflow: visible;");
		expect(css).toContain("clip: auto;");
		expect(css).toContain("white-space: normal;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useNotSrOnlyUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
