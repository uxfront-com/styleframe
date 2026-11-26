import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useHeightUtility, useMaxHeightUtility, useMinHeightUtility } from "./useHeightUtility";

describe("useHeightUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useHeightUtility(s, { full: "100%", screen: "100vh" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "height",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should add utility instances to root.children", () => {
		const s = styleframe();
		useHeightUtility(s, { full: "100%" });

		expect(s.root.children).toHaveLength(1);
		const utility = s.root.children[0] as Utility;
		expect(utility.type).toBe("utility");
		expect(utility.name).toBe("height");
		expect(utility.value).toBe("full");
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useHeightUtility(s, { screen: "100vh" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ height: "100vh" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useHeightUtility(s, { full: "100%", screen: "100vh" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._height\:full {`);
		expect(css).toContain("height: 100%;");
		expect(css).toContain(String.raw`._height\:screen {`);
		expect(css).toContain("height: 100vh;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		useHeightUtility(s, { default: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._height {");
		expect(css).not.toContain(String.raw`._height\:default`);
	});

	it("should handle 'auto' value", () => {
		const s = styleframe();
		useHeightUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ height: "auto" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useHeightUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		useHeightUtility(s, { full: "100%" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "height" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const heightFull = s.variable("height.full", "100%");
		useHeightUtility(s, { full: s.ref(heightFull) });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations?.height).toEqual({
			type: "reference",
			name: "height.full",
		});
	});

	it("should return UtilityCreatorFn", () => {
		const s = styleframe();
		const creator = useHeightUtility(s, { full: "100%" });

		expect(typeof creator).toBe("function");
	});

	it("should support spacing multiplier values", () => {
		const s = styleframe();
		const createHeight = useHeightUtility(s);
		createHeight(["@1", "@2"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._height\:1 {`);
		expect(css).toContain("height: calc(var(--spacing, 1rem) * 1);");
		expect(css).toContain(String.raw`._height\:2 {`);
		expect(css).toContain("height: calc(var(--spacing, 1rem) * 2);");
	});
});

describe("useMinHeightUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useMinHeightUtility(s, { full: "100%", screen: "100vh" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "min-height",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useMinHeightUtility(s, { screen: "100vh" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ minHeight: "100vh" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMinHeightUtility(s, { full: "100%", "0": "0" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._min-height\:full {`);
		expect(css).toContain("min-height: 100%;");
		expect(css).toContain(String.raw`._min-height\:0 {`);
		expect(css).toContain("min-height: 0;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useMinHeightUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useMaxHeightUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useMaxHeightUtility(s, { full: "100%", screen: "100vh" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "max-height",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useMaxHeightUtility(s, { screen: "100vh" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ maxHeight: "100vh" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMaxHeightUtility(s, { full: "100%", none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._max-height\:full {`);
		expect(css).toContain("max-height: 100%;");
		expect(css).toContain(String.raw`._max-height\:none {`);
		expect(css).toContain("max-height: none;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useMaxHeightUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
