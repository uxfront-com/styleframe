import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useTextColorUtility } from "./useTextColorUtility";

describe("useTextColorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextColorUtility(s, { black: "#000", white: "#fff" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-color",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextColorUtility(s, { primary: "#3b82f6" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ color: "#3b82f6" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextColorUtility(s, { inherit: "inherit", current: "currentColor" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-color\:inherit {`);
		expect(css).toContain("color: inherit;");
		expect(css).toContain(String.raw`._text-color\:current {`);
		expect(css).toContain("color: currentColor;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextColorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		useTextColorUtility(s, { primary: "#3b82f6" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility =>
				isUtility(u) &&
				u.name === "text-color" &&
				u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const colorPrimary = s.variable("color.primary", "#3b82f6");
		useTextColorUtility(s, { primary: s.ref(colorPrimary) });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations?.color).toEqual({
			type: "reference",
			name: "color.primary",
		});
	});
});
