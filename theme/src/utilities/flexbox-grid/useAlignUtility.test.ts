import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useAlignContentUtility,
	useAlignItemsUtility,
	useAlignSelfUtility,
} from "./useAlignUtility";

describe("useAlignContentUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAlignContentUtility(s, { center: "center", start: "flex-start" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "align-content",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAlignContentUtility(s, { between: "space-between" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ alignContent: "space-between" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAlignContentUtility(s, { center: "center" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._align-content\:center {`);
		expect(css).toContain("align-content: center;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAlignContentUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useAlignItemsUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAlignItemsUtility(s, { center: "center", start: "flex-start" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "align-items",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAlignItemsUtility(s, { baseline: "baseline" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ alignItems: "baseline" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAlignItemsUtility(s, { stretch: "stretch" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._align-items\:stretch {`);
		expect(css).toContain("align-items: stretch;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAlignItemsUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useAlignSelfUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAlignSelfUtility(s, { auto: "auto", center: "center" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "align-self",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAlignSelfUtility(s, { start: "flex-start" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ alignSelf: "flex-start" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAlignSelfUtility(s, { end: "flex-end" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._align-self\:end {`);
		expect(css).toContain("align-self: flex-end;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAlignSelfUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
