import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useBorderRadiusUtility,
	useBorderRadiusTopUtility,
	useBorderRadiusRightUtility,
	useBorderRadiusBottomUtility,
	useBorderRadiusLeftUtility,
	useBorderRadiusTopLeftUtility,
	useBorderRadiusTopRightUtility,
	useBorderRadiusBottomRightUtility,
	useBorderRadiusBottomLeftUtility,
} from "./useBorderRadiusUtility";

describe("useBorderRadiusUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBorderRadiusUtility(s, { sm: "0.125rem", md: "0.375rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "border-radius",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusUtility(s, { lg: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderRadius: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderRadiusUtility(s, { full: "9999px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-radius\:full {`);
		expect(css).toContain("border-radius: 9999px;");
	});

	it("should handle none value", () => {
		const s = styleframe();
		useBorderRadiusUtility(s, { none: "0px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderRadius: "0px" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBorderRadiusUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBorderRadiusTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusTopUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderTopLeftRadius: "0.375rem",
			borderTopRightRadius: "0.375rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderRadiusTopUtility(s, { lg: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-radius-top\:lg {`);
		expect(css).toContain("border-top-left-radius: 0.5rem;");
		expect(css).toContain("border-top-right-radius: 0.5rem;");
	});
});

describe("useBorderRadiusRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusRightUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderTopRightRadius: "0.375rem",
			borderBottomRightRadius: "0.375rem",
		});
	});
});

describe("useBorderRadiusBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusBottomUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderBottomLeftRadius: "0.375rem",
			borderBottomRightRadius: "0.375rem",
		});
	});
});

describe("useBorderRadiusLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusLeftUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderTopLeftRadius: "0.375rem",
			borderBottomLeftRadius: "0.375rem",
		});
	});
});

describe("useBorderRadiusTopLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusTopLeftUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderTopLeftRadius: "0.375rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBorderRadiusTopLeftUtility(s, { lg: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-top-left-radius\:lg {`);
		expect(css).toContain("border-top-left-radius: 0.5rem;");
	});
});

describe("useBorderRadiusTopRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusTopRightUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ borderTopRightRadius: "0.375rem" });
	});
});

describe("useBorderRadiusBottomRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusBottomRightUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderBottomRightRadius: "0.375rem",
		});
	});
});

describe("useBorderRadiusBottomLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBorderRadiusBottomLeftUtility(s, { md: "0.375rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			borderBottomLeftRadius: "0.375rem",
		});
	});
});
