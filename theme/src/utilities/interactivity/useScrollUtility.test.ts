import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useScrollMarginUtility,
	useScrollMarginXUtility,
	useScrollMarginYUtility,
	useScrollMarginTopUtility,
	useScrollMarginRightUtility,
	useScrollMarginBottomUtility,
	useScrollMarginLeftUtility,
	useScrollMarginStartUtility,
	useScrollMarginEndUtility,
	useScrollPaddingUtility,
	useScrollPaddingXUtility,
	useScrollPaddingYUtility,
	useScrollPaddingTopUtility,
	useScrollPaddingRightUtility,
	useScrollPaddingBottomUtility,
	useScrollPaddingLeftUtility,
	useScrollPaddingStartUtility,
	useScrollPaddingEndUtility,
} from "./useScrollUtility";

describe("useScrollMarginUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useScrollMarginUtility(s, { sm: "0.5rem", md: "1rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-margin",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollMarginUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollMargin: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin\:sm {`);
		expect(css).toContain("scroll-margin: 0.5rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useScrollMarginUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useScrollMarginXUtility", () => {
	it("should set correct declarations for horizontal sides", () => {
		const s = styleframe();
		useScrollMarginXUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			scrollMarginLeft: "0.5rem",
			scrollMarginRight: "0.5rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginXUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-x\:sm {`);
		expect(css).toContain("scroll-margin-left: 0.5rem;");
		expect(css).toContain("scroll-margin-right: 0.5rem;");
	});
});

describe("useScrollMarginYUtility", () => {
	it("should set correct declarations for vertical sides", () => {
		const s = styleframe();
		useScrollMarginYUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			scrollMarginTop: "0.5rem",
			scrollMarginBottom: "0.5rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginYUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-y\:sm {`);
		expect(css).toContain("scroll-margin-top: 0.5rem;");
		expect(css).toContain("scroll-margin-bottom: 0.5rem;");
	});
});

describe("useScrollMarginTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollMarginTopUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollMarginTop: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginTopUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-top\:sm {`);
		expect(css).toContain("scroll-margin-top: 0.5rem;");
	});
});

describe("useScrollMarginRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollMarginRightUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollMarginRight: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginRightUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-right\:sm {`);
		expect(css).toContain("scroll-margin-right: 0.5rem;");
	});
});

describe("useScrollMarginBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollMarginBottomUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollMarginBottom: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginBottomUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-bottom\:sm {`);
		expect(css).toContain("scroll-margin-bottom: 0.5rem;");
	});
});

describe("useScrollMarginLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollMarginLeftUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollMarginLeft: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginLeftUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-left\:sm {`);
		expect(css).toContain("scroll-margin-left: 0.5rem;");
	});
});

describe("useScrollMarginStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollMarginStartUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollMarginInlineStart: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginStartUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-inline-start\:sm {`);
		expect(css).toContain("scroll-margin-inline-start: 0.5rem;");
	});
});

describe("useScrollMarginEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollMarginEndUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollMarginInlineEnd: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollMarginEndUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-margin-inline-end\:sm {`);
		expect(css).toContain("scroll-margin-inline-end: 0.5rem;");
	});
});

describe("useScrollPaddingUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useScrollPaddingUtility(s, { sm: "0.5rem", md: "1rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-padding",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollPaddingUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollPadding: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding\:sm {`);
		expect(css).toContain("scroll-padding: 0.5rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useScrollPaddingUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useScrollPaddingXUtility", () => {
	it("should set correct declarations for horizontal sides", () => {
		const s = styleframe();
		useScrollPaddingXUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			scrollPaddingLeft: "0.5rem",
			scrollPaddingRight: "0.5rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingXUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-x\:sm {`);
		expect(css).toContain("scroll-padding-left: 0.5rem;");
		expect(css).toContain("scroll-padding-right: 0.5rem;");
	});
});

describe("useScrollPaddingYUtility", () => {
	it("should set correct declarations for vertical sides", () => {
		const s = styleframe();
		useScrollPaddingYUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			scrollPaddingTop: "0.5rem",
			scrollPaddingBottom: "0.5rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingYUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-y\:sm {`);
		expect(css).toContain("scroll-padding-top: 0.5rem;");
		expect(css).toContain("scroll-padding-bottom: 0.5rem;");
	});
});

describe("useScrollPaddingTopUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollPaddingTopUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollPaddingTop: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingTopUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-top\:sm {`);
		expect(css).toContain("scroll-padding-top: 0.5rem;");
	});
});

describe("useScrollPaddingRightUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollPaddingRightUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollPaddingRight: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingRightUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-right\:sm {`);
		expect(css).toContain("scroll-padding-right: 0.5rem;");
	});
});

describe("useScrollPaddingBottomUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollPaddingBottomUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollPaddingBottom: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingBottomUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-bottom\:sm {`);
		expect(css).toContain("scroll-padding-bottom: 0.5rem;");
	});
});

describe("useScrollPaddingLeftUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollPaddingLeftUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollPaddingLeft: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingLeftUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-left\:sm {`);
		expect(css).toContain("scroll-padding-left: 0.5rem;");
	});
});

describe("useScrollPaddingStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollPaddingStartUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			scrollPaddingInlineStart: "0.5rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingStartUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-inline-start\:sm {`);
		expect(css).toContain("scroll-padding-inline-start: 0.5rem;");
	});
});

describe("useScrollPaddingEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollPaddingEndUtility(s, { sm: "0.5rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollPaddingInlineEnd: "0.5rem" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollPaddingEndUtility(s, { sm: "0.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-padding-inline-end\:sm {`);
		expect(css).toContain("scroll-padding-inline-end: 0.5rem;");
	});
});
