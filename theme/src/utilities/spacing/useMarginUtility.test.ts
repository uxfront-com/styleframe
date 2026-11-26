import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useMarginBlockUtility,
	useMarginBottomUtility,
	useMarginInlineEndUtility,
	useMarginInlineStartUtility,
	useMarginInlineUtility,
	useMarginLeftUtility,
	useMarginRightUtility,
	useMarginTopUtility,
	useMarginUtility,
	useMarginXUtility,
	useMarginYUtility,
} from "./useMarginUtility";

describe("useMarginUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useMarginUtility(s, { sm: "8px", md: "16px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "margin",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should add utility instances to root.children", () => {
		const s = styleframe();
		useMarginUtility(s, { sm: "8px" });

		expect(s.root.children).toHaveLength(1);
		const utility = s.root.children[0] as Utility;
		expect(utility.type).toBe("utility");
		expect(utility.name).toBe("margin");
		expect(utility.value).toBe("sm");
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useMarginUtility(s, { md: "16px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ margin: "16px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginUtility(s, { sm: "8px", md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:sm {`);
		expect(css).toContain("margin: 8px;");
		expect(css).toContain(String.raw`._margin\:md {`);
		expect(css).toContain("margin: 16px;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		useMarginUtility(s, { default: "0" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._margin {");
		expect(css).not.toContain(String.raw`._margin\:default`);
	});

	it("should handle 'auto' value", () => {
		const s = styleframe();
		useMarginUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ margin: "auto" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useMarginUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		useMarginUtility(s, { sm: "8px" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility =>
				isUtility(u) && u.name === "margin" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const spacingSm = s.variable("spacing.sm", "8px");
		useMarginUtility(s, { sm: s.ref(spacingSm) });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations?.margin).toEqual({
			type: "reference",
			name: "spacing.sm",
		});
	});

	it("should return UtilityCreatorFn", () => {
		const s = styleframe();
		const creator = useMarginUtility(s, { sm: "8px" });

		expect(typeof creator).toBe("function");
	});
});

describe("useMarginInlineUtility", () => {
	it("should set marginLeft and marginRight", () => {
		const s = styleframe();
		useMarginInlineUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			marginLeft: "8px",
			marginRight: "8px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginInlineUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-inline\:auto {`);
		expect(css).toContain("margin-left: auto;");
		expect(css).toContain("margin-right: auto;");
	});
});

describe("useMarginBlockUtility", () => {
	it("should set marginTop and marginBottom", () => {
		const s = styleframe();
		useMarginBlockUtility(s, { md: "16px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			marginTop: "16px",
			marginBottom: "16px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginBlockUtility(s, { lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-block\:lg {`);
		expect(css).toContain("margin-top: 24px;");
		expect(css).toContain("margin-bottom: 24px;");
	});
});

describe("useMarginTopUtility", () => {
	it("should set marginTop", () => {
		const s = styleframe();
		useMarginTopUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ marginTop: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginTopUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-top\:md {`);
		expect(css).toContain("margin-top: 16px;");
	});
});

describe("useMarginRightUtility", () => {
	it("should set marginRight", () => {
		const s = styleframe();
		useMarginRightUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ marginRight: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginRightUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-right\:auto {`);
		expect(css).toContain("margin-right: auto;");
	});
});

describe("useMarginBottomUtility", () => {
	it("should set marginBottom", () => {
		const s = styleframe();
		useMarginBottomUtility(s, { lg: "24px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ marginBottom: "24px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginBottomUtility(s, { xl: "32px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-bottom\:xl {`);
		expect(css).toContain("margin-bottom: 32px;");
	});
});

describe("useMarginLeftUtility", () => {
	it("should set marginLeft", () => {
		const s = styleframe();
		useMarginLeftUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ marginLeft: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginLeftUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-left\:md {`);
		expect(css).toContain("margin-left: 16px;");
	});
});

describe("useMarginInlineStartUtility", () => {
	it("should set marginInlineStart", () => {
		const s = styleframe();
		useMarginInlineStartUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ marginInlineStart: "8px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginInlineStartUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-inline-start\:md {`);
		expect(css).toContain("margin-inline-start: 16px;");
	});
});

describe("useMarginInlineEndUtility", () => {
	it("should set marginInlineEnd", () => {
		const s = styleframe();
		useMarginInlineEndUtility(s, { lg: "24px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ marginInlineEnd: "24px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginInlineEndUtility(s, { xl: "32px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-inline-end\:xl {`);
		expect(css).toContain("margin-inline-end: 32px;");
	});
});

describe("useMarginXUtility", () => {
	it("should set marginLeft and marginRight", () => {
		const s = styleframe();
		useMarginXUtility(s, { sm: "8px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			marginLeft: "8px",
			marginRight: "8px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginXUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-x\:auto {`);
		expect(css).toContain("margin-left: auto;");
		expect(css).toContain("margin-right: auto;");
	});
});

describe("useMarginYUtility", () => {
	it("should set marginTop and marginBottom", () => {
		const s = styleframe();
		useMarginYUtility(s, { md: "16px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			marginTop: "16px",
			marginBottom: "16px",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useMarginYUtility(s, { lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-y\:lg {`);
		expect(css).toContain("margin-top: 24px;");
		expect(css).toContain("margin-bottom: 24px;");
	});
});
