import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useFontSizeUtility } from "./useFontSizeUtility";

describe("useFontSizeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFontSizeUtility(s, { sm: "0.875rem", md: "1rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "font-size",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should add utility instances to root.children", () => {
		const s = styleframe();
		useFontSizeUtility(s, { base: "1rem" });

		expect(s.root.children).toHaveLength(1);
		const utility = s.root.children[0] as Utility;
		expect(utility.type).toBe("utility");
		expect(utility.name).toBe("font-size");
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFontSizeUtility(s, { lg: "1.125rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ fontSize: "1.125rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFontSizeUtility(s, { xs: "0.75rem", sm: "0.875rem", base: "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._font-size\:xs {`);
		expect(css).toContain("font-size: 0.75rem;");
		expect(css).toContain(String.raw`._font-size\:sm {`);
		expect(css).toContain("font-size: 0.875rem;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		useFontSizeUtility(s, { default: "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._font-size {");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFontSizeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		useFontSizeUtility(s, { lg: "1.125rem" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility =>
				isUtility(u) && u.name === "font-size" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const fontSizeBase = s.variable("font-size.base", "1rem");
		useFontSizeUtility(s, { base: s.ref(fontSizeBase) });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations?.fontSize).toEqual({
			type: "reference",
			name: "font-size.base",
		});
	});
});
