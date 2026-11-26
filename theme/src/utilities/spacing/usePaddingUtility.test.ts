import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	usePaddingBlockUtility,
	usePaddingBottomUtility,
	usePaddingInlineEndUtility,
	usePaddingInlineStartUtility,
	usePaddingInlineUtility,
	usePaddingLeftUtility,
	usePaddingRightUtility,
	usePaddingTopUtility,
	usePaddingUtility,
	usePaddingXUtility,
	usePaddingYUtility,
} from "./usePaddingUtility";

describe("usePaddingUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePaddingUtility(s, { sm: "8px", md: "16px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "padding",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should add utility instances to root.children", () => {
		const s = styleframe();
		usePaddingUtility(s, { sm: "8px" });

		expect(s.root.children).toHaveLength(1);
		const utility = s.root.children[0] as Utility;
		expect(utility.type).toBe("utility");
		expect(utility.name).toBe("padding");
		expect(utility.value).toBe("sm");
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePaddingUtility(s, { md: "16px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ padding: "16px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingUtility(s, { sm: "0.5rem", md: "1rem", lg: "1.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding\:sm {`);
		expect(css).toContain("padding: 0.5rem;");
		expect(css).toContain(String.raw`._padding\:md {`);
		expect(css).toContain("padding: 1rem;");
		expect(css).toContain(String.raw`._padding\:lg {`);
		expect(css).toContain("padding: 1.5rem;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		usePaddingUtility(s, { default: "0" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._padding {");
		expect(css).not.toContain(String.raw`._padding\:default`);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePaddingUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		usePaddingUtility(s, { sm: "8px" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "padding" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const spacingMd = s.variable("spacing.md", "16px");
		usePaddingUtility(s, { md: s.ref(spacingMd) });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations?.padding).toEqual({
			type: "reference",
			name: "spacing.md",
		});
	});

	it("should return UtilityCreatorFn", () => {
		const s = styleframe();
		const creator = usePaddingUtility(s, { sm: "8px" });

		expect(typeof creator).toBe("function");
	});
});

describe("usePaddingInlineUtility", () => {
	it("should set paddingLeft and paddingRight", () => {
		const s = styleframe();
		usePaddingInlineUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			paddingLeft: "8px",
			paddingRight: "8px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingInlineUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-inline\:md {`);
		expect(css).toContain("padding-left: 16px;");
		expect(css).toContain("padding-right: 16px;");
	});
});

describe("usePaddingBlockUtility", () => {
	it("should set paddingTop and paddingBottom", () => {
		const s = styleframe();
		usePaddingBlockUtility(s, { md: "16px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			paddingTop: "16px",
			paddingBottom: "16px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingBlockUtility(s, { lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-block\:lg {`);
		expect(css).toContain("padding-top: 24px;");
		expect(css).toContain("padding-bottom: 24px;");
	});
});

describe("usePaddingTopUtility", () => {
	it("should set paddingTop", () => {
		const s = styleframe();
		usePaddingTopUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ paddingTop: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingTopUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-top\:md {`);
		expect(css).toContain("padding-top: 16px;");
	});
});

describe("usePaddingRightUtility", () => {
	it("should set paddingRight", () => {
		const s = styleframe();
		usePaddingRightUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ paddingRight: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingRightUtility(s, { lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-right\:lg {`);
		expect(css).toContain("padding-right: 24px;");
	});
});

describe("usePaddingBottomUtility", () => {
	it("should set paddingBottom", () => {
		const s = styleframe();
		usePaddingBottomUtility(s, { lg: "24px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ paddingBottom: "24px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingBottomUtility(s, { xl: "32px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-bottom\:xl {`);
		expect(css).toContain("padding-bottom: 32px;");
	});
});

describe("usePaddingLeftUtility", () => {
	it("should set paddingLeft", () => {
		const s = styleframe();
		usePaddingLeftUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ paddingLeft: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingLeftUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-left\:md {`);
		expect(css).toContain("padding-left: 16px;");
	});
});

describe("usePaddingInlineStartUtility", () => {
	it("should set paddingInlineStart", () => {
		const s = styleframe();
		usePaddingInlineStartUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ paddingInlineStart: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingInlineStartUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-inline-start\:md {`);
		expect(css).toContain("padding-inline-start: 16px;");
	});
});

describe("usePaddingInlineEndUtility", () => {
	it("should set paddingInlineEnd", () => {
		const s = styleframe();
		usePaddingInlineEndUtility(s, { lg: "24px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ paddingInlineEnd: "24px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingInlineEndUtility(s, { xl: "32px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-inline-end\:xl {`);
		expect(css).toContain("padding-inline-end: 32px;");
	});
});

describe("usePaddingXUtility", () => {
	it("should set paddingLeft and paddingRight", () => {
		const s = styleframe();
		usePaddingXUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			paddingLeft: "8px",
			paddingRight: "8px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingXUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-x\:md {`);
		expect(css).toContain("padding-left: 16px;");
		expect(css).toContain("padding-right: 16px;");
	});
});

describe("usePaddingYUtility", () => {
	it("should set paddingTop and paddingBottom", () => {
		const s = styleframe();
		usePaddingYUtility(s, { md: "16px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			paddingTop: "16px",
			paddingBottom: "16px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePaddingYUtility(s, { lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-y\:lg {`);
		expect(css).toContain("padding-top: 24px;");
		expect(css).toContain("padding-bottom: 24px;");
	});
});

describe("recipe with @multiplier values", () => {
	it("should generate calc() expressions for @0.375 values via recipe", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");
		usePaddingRightUtility(s);

		s.recipe({
			name: "badge",
			variants: {
				size: {
					sm: {
						paddingRight: "@0.375",
					},
				},
			},
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-right\:0\.375`);
		expect(css).toContain("calc(var(--spacing, 1rem) * 0.375)");
		expect(css).not.toContain("[0.375]");
	});

	it("should generate calc() expressions for @0.125 values via recipe", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");
		usePaddingTopUtility(s);

		s.recipe({
			name: "badge",
			variants: {
				size: {
					xs: {
						paddingTop: "@0.125",
					},
				},
			},
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding-top\:0\.125`);
		expect(css).toContain("calc(var(--spacing, 1rem) * 0.125)");
		expect(css).not.toContain("[0.125]");
	});
});
