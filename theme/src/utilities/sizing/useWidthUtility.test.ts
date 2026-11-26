import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useMaxWidthUtility, useMinWidthUtility, useWidthUtility } from "./useWidthUtility";

describe("useWidthUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useWidthUtility(s, { full: "100%", screen: "100vw" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "width",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should add utility instances to root.children", () => {
		const s = styleframe();
		useWidthUtility(s, { full: "100%" });

		expect(s.root.children).toHaveLength(1);
		const utility = s.root.children[0] as Utility;
		expect(utility.type).toBe("utility");
		expect(utility.name).toBe("width");
		expect(utility.value).toBe("full");
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useWidthUtility(s, { screen: "100vw" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ width: "100vw" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useWidthUtility(s, { full: "100%", screen: "100vw" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._width\:full {`);
		expect(css).toContain("width: 100%;");
		expect(css).toContain(String.raw`._width\:screen {`);
		expect(css).toContain("width: 100vw;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		useWidthUtility(s, { default: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._width {");
		expect(css).not.toContain(String.raw`._width\:default`);
	});

	it("should handle 'auto' value", () => {
		const s = styleframe();
		useWidthUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ width: "auto" });
	});

	it("should handle fractional values", () => {
		const s = styleframe();
		useWidthUtility(s, { "1/2": "50%", "1/3": "33.333333%" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._width\:1\/2 {`);
		expect(css).toContain("width: 50%;");
		expect(css).toContain(String.raw`._width\:1\/3 {`);
		expect(css).toContain("width: 33.333333%;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useWidthUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		useWidthUtility(s, { full: "100%" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "width" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const widthFull = s.variable("width.full", "100%");
		useWidthUtility(s, { full: s.ref(widthFull) });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations?.width).toEqual({
			type: "reference",
			name: "width.full",
		});
	});

	it("should return UtilityCreatorFn", () => {
		const s = styleframe();
		const creator = useWidthUtility(s, { full: "100%" });

		expect(typeof creator).toBe("function");
	});

	it("should support spacing multiplier values", () => {
		const s = styleframe();
		const createWidth = useWidthUtility(s);
		createWidth(["@1", "@2"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._width\:1 {`);
		expect(css).toContain("width: calc(var(--spacing, 1rem) * 1);");
		expect(css).toContain(String.raw`._width\:2 {`);
		expect(css).toContain("width: calc(var(--spacing, 1rem) * 2);");
	});
});

describe("useMinWidthUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useMinWidthUtility(s, { full: "100%", "0": "0" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "min-width",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useMinWidthUtility(s, { full: "100%" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ minWidth: "100%" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMinWidthUtility(s, { full: "100%", "0": "0" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._min-width\:full {`);
		expect(css).toContain("min-width: 100%;");
		expect(css).toContain(String.raw`._min-width\:0 {`);
		expect(css).toContain("min-width: 0;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useMinWidthUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useMaxWidthUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useMaxWidthUtility(s, { full: "100%", none: "none" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "max-width",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useMaxWidthUtility(s, { screen: "100vw" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ maxWidth: "100vw" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMaxWidthUtility(s, { full: "100%", none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._max-width\:full {`);
		expect(css).toContain("max-width: 100%;");
		expect(css).toContain(String.raw`._max-width\:none {`);
		expect(css).toContain("max-width: none;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useMaxWidthUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
