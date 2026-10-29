import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useAnchorNameUtility,
	usePositionAnchorUtility,
	usePositionAreaUtility,
	usePositionTryFallbacksUtility,
} from "./useAnchorUtility";

describe("useAnchorNameUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAnchorNameUtility(s, { toggle: "--toggle", menu: "--menu" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "anchor-name",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAnchorNameUtility(s, { toggle: "--toggle" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ anchorName: "--toggle" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAnchorNameUtility(s, { toggle: "--toggle" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._anchor-name\\:toggle {");
		expect(css).toContain("anchor-name: --toggle;");
	});

	it("should ship without defaults", () => {
		const s = styleframe();
		useAnchorNameUtility(s);

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePositionAnchorUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		usePositionAnchorUtility(s, { toggle: "--toggle" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ positionAnchor: "--toggle" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePositionAnchorUtility(s, { toggle: "--toggle" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._position-anchor\\:toggle {");
		expect(css).toContain("position-anchor: --toggle;");
	});

	it("should ship without defaults", () => {
		const s = styleframe();
		usePositionAnchorUtility(s);

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePositionAreaUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		usePositionAreaUtility(s, { "top-center": "top center" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ positionArea: "top center" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePositionAreaUtility(s, { "bottom-right": "bottom right" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._position-area\\:bottom-right {");
		expect(css).toContain("position-area: bottom right;");
	});

	it("should ship without defaults", () => {
		const s = styleframe();
		usePositionAreaUtility(s);

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePositionTryFallbacksUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		usePositionTryFallbacksUtility(s, { flip: "flip-block, flip-inline" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			positionTryFallbacks: "flip-block, flip-inline",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePositionTryFallbacksUtility(s, { "flip-block": "flip-block" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._position-try-fallbacks\\:flip-block {");
		expect(css).toContain("position-try-fallbacks: flip-block;");
	});

	it("should ship without defaults", () => {
		const s = styleframe();
		usePositionTryFallbacksUtility(s);

		expect(s.root.children).toHaveLength(0);
	});
});
