import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useJustifyContentUtility,
	useJustifyItemsUtility,
	useJustifySelfUtility,
} from "./useJustifyUtility";

describe("useJustifyContentUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useJustifyContentUtility(s, { center: "center", between: "space-between" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "justify-content",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useJustifyContentUtility(s, { between: "space-between" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ justifyContent: "space-between" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useJustifyContentUtility(s, { center: "center" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._justify-content\:center {`);
		expect(css).toContain("justify-content: center;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useJustifyContentUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useJustifyItemsUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useJustifyItemsUtility(s, { start: "start", center: "center" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "justify-items",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useJustifyItemsUtility(s, { stretch: "stretch" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ justifyItems: "stretch" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useJustifyItemsUtility(s, { end: "end" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._justify-items\:end {`);
		expect(css).toContain("justify-items: end;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useJustifyItemsUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useJustifySelfUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useJustifySelfUtility(s, { auto: "auto", center: "center" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "justify-self",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useJustifySelfUtility(s, { start: "start" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ justifySelf: "start" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useJustifySelfUtility(s, { stretch: "stretch" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._justify-self\:stretch {`);
		expect(css).toContain("justify-self: stretch;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useJustifySelfUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
