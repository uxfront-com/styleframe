import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { borderCollapseValues, tableLayoutValues, captionSideValues } from "../../values";
import {
	useBorderCollapseUtility,
	useBorderSpacingUtility,
	useBorderSpacingXUtility,
	useBorderSpacingYUtility,
	useTableLayoutUtility,
	useCaptionSideUtility,
} from "./useTableUtility";

describe("useBorderCollapseUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderCollapseUtility(s, { collapse: "collapse", separate: "separate" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-collapse",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderCollapseUtility(s, { collapse: "collapse" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderCollapse: "collapse" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderCollapseUtility(s, { collapse: "collapse" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-collapse\:collapse {`);
		expect(css).toContain("border-collapse: collapse;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useBorderCollapseUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-collapse",
		);
		expect(utilities).toHaveLength(Object.keys(borderCollapseValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderCollapseUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderSpacingUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderSpacingUtility(s, { "0": "0", "1": "0.25rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-spacing",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderSpacingUtility(s, { "2": "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderSpacing: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderSpacingUtility(s, { "2": "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-spacing\:2 {`);
		expect(css).toContain("border-spacing: 0.5rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderSpacingUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderSpacingXUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderSpacingXUtility(s, { "0": "0", "1": "0.25rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-spacing-x",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderSpacingXUtility(s, { "2": "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderSpacing: "0.5rem var(--border-spacing-y, 0)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderSpacingXUtility(s, { "2": "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-spacing-x\:2 {`);
		expect(css).toContain("border-spacing: 0.5rem var(--border-spacing-y, 0);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderSpacingXUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderSpacingYUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderSpacingYUtility(s, { "0": "0", "1": "0.25rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-spacing-y",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderSpacingYUtility(s, { "2": "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderSpacing: "var(--border-spacing-x, 0) 0.5rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderSpacingYUtility(s, { "2": "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-spacing-y\:2 {`);
		expect(css).toContain("border-spacing: var(--border-spacing-x, 0) 0.5rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderSpacingYUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTableLayoutUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTableLayoutUtility(s, { auto: "auto", fixed: "fixed" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "table-layout",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTableLayoutUtility(s, { fixed: "fixed" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ tableLayout: "fixed" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTableLayoutUtility(s, { fixed: "fixed" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._table-layout\:fixed {`);
		expect(css).toContain("table-layout: fixed;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useTableLayoutUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "table-layout",
		);
		expect(utilities).toHaveLength(Object.keys(tableLayoutValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTableLayoutUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useCaptionSideUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useCaptionSideUtility(s, { top: "top", bottom: "bottom" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "caption-side",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useCaptionSideUtility(s, { top: "top" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ captionSide: "top" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useCaptionSideUtility(s, { top: "top" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._caption-side\:top {`);
		expect(css).toContain("caption-side: top;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useCaptionSideUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "caption-side",
		);
		expect(utilities).toHaveLength(Object.keys(captionSideValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useCaptionSideUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
