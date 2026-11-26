import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useInsetUtility,
	useInsetXUtility,
	useInsetYUtility,
	useInsetStartUtility,
	useInsetEndUtility,
	useTopUtility,
	useRightUtility,
	useBottomUtility,
	useLeftUtility,
} from "./useInsetUtility";

describe("useInsetUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useInsetUtility(s, { "0": "0", auto: "auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "inset",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations for all sides", () => {
		const s = styleframe();
		useInsetUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			top: "0",
			right: "0",
			bottom: "0",
			left: "0",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useInsetUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._inset\:4 {`);
		expect(css).toContain("top: 1rem;");
		expect(css).toContain("right: 1rem;");
		expect(css).toContain("bottom: 1rem;");
		expect(css).toContain("left: 1rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useInsetUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useInsetXUtility", () => {
	it("should set correct declarations for horizontal sides", () => {
		const s = styleframe();
		useInsetXUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			left: "0",
			right: "0",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useInsetXUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._inset-x\:4 {`);
		expect(css).toContain("left: 1rem;");
		expect(css).toContain("right: 1rem;");
	});
});

describe("useInsetYUtility", () => {
	it("should set correct declarations for vertical sides", () => {
		const s = styleframe();
		useInsetYUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			top: "0",
			bottom: "0",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useInsetYUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._inset-y\:4 {`);
		expect(css).toContain("top: 1rem;");
		expect(css).toContain("bottom: 1rem;");
	});
});

describe("useInsetStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useInsetStartUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ insetInlineStart: "0" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useInsetStartUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._inset-inline-start\:4 {`);
		expect(css).toContain("inset-inline-start: 1rem;");
	});
});

describe("useInsetEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useInsetEndUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ insetInlineEnd: "0" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useInsetEndUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._inset-inline-end\:4 {`);
		expect(css).toContain("inset-inline-end: 1rem;");
	});
});

describe("useTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useTopUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ top: "0" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTopUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._top\:4 {`);
		expect(css).toContain("top: 1rem;");
	});
});

describe("useRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useRightUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ right: "0" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useRightUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._right\:auto {`);
		expect(css).toContain("right: auto;");
	});
});

describe("useBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useBottomUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ bottom: "0" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBottomUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._bottom\:4 {`);
		expect(css).toContain("bottom: 1rem;");
	});
});

describe("useLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useLeftUtility(s, { "0": "0" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ left: "0" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useLeftUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._left\:auto {`);
		expect(css).toContain("left: auto;");
	});
});

describe("inset multiplier support", () => {
	it("should resolve numeric multiplier refs to calc(), not undefined vars", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createInset = useInsetUtility(s);
		createInset(["@0.5"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("top: calc(var(--spacing, 1rem) * 0.5);");
		expect(css).toContain("bottom: calc(var(--spacing, 1rem) * 0.5);");
		expect(css).not.toContain("var(--0--5)");
	});

	it("should resolve numeric multiplier refs on single-side insets", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createBottom = useBottomUtility(s);
		createBottom(["@0.25"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("bottom: calc(var(--spacing, 1rem) * 0.25);");
		expect(css).not.toContain("var(--0--25)");
	});

	it("should support negative multiplier refs on insets", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createTop = useTopUtility(s);
		createTop(["@-1"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("top: calc(var(--spacing, 1rem) * -1);");
	});
});
