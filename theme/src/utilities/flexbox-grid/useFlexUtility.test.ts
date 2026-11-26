import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useFlexUtility,
	useFlexGrowUtility,
	useFlexShrinkUtility,
	useFlexBasisUtility,
} from "./useFlexUtility";

describe("useFlexUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFlexUtility(s, { "1": "1 1 0%", auto: "1 1 auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "flex",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFlexUtility(s, { "1": "1 1 0%" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flex: "1 1 0%" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFlexUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._flex\:none {`);
		expect(css).toContain("flex: none;");
	});

	it("should route direction keywords to flex-direction", () => {
		const s = styleframe();
		useFlexUtility(s, { column: "column" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexDirection: "column" });
	});

	it("should route the col alias to the same flex-direction value", () => {
		const s = styleframe();
		useFlexUtility(s, { col: "column" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexDirection: "column" });
	});

	it("should route wrap keywords to flex-wrap", () => {
		const s = styleframe();
		useFlexUtility(s, { wrap: "wrap", nowrap: "nowrap" });

		const wrap = s.root.children[0] as Utility;
		const nowrap = s.root.children[1] as Utility;
		expect(wrap.declarations).toEqual({ flexWrap: "wrap" });
		expect(nowrap.declarations).toEqual({ flexWrap: "nowrap" });
	});

	it("should compile routed classes to correct CSS output", () => {
		const s = styleframe();
		useFlexUtility(s, { column: "column", wrap: "wrap" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._flex\:column {`);
		expect(css).toContain("flex-direction: column;");
		expect(css).toContain(String.raw`._flex\:wrap {`);
		expect(css).toContain("flex-wrap: wrap;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFlexUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useFlexGrowUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useFlexGrowUtility(s, { "1": "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexGrow: "1" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFlexGrowUtility(s, { "0": "0" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._flex-grow\:0 {`);
		expect(css).toContain("flex-grow: 0;");
	});
});

describe("useFlexShrinkUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useFlexShrinkUtility(s, { "1": "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexShrink: "1" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFlexShrinkUtility(s, { "0": "0" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._flex-shrink\:0 {`);
		expect(css).toContain("flex-shrink: 0;");
	});
});

describe("useFlexBasisUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useFlexBasisUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexBasis: "auto" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFlexBasisUtility(s, { "1/2": "50%" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._flex-basis\:1\/2 {`);
		expect(css).toContain("flex-basis: 50%;");
	});

	it("should handle pixel values", () => {
		const s = styleframe();
		useFlexBasisUtility(s, { "64": "16rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ flexBasis: "16rem" });
	});
});
