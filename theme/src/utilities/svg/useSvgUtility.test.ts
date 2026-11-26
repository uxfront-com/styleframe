import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFillUtility, useStrokeUtility, useStrokeWidthUtility } from "./useSvgUtility";

describe("useFillUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFillUtility(s, { none: "none", current: "currentColor" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "fill",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFillUtility(s, { current: "currentColor" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ fill: "currentColor" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFillUtility(s, { current: "currentColor" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._fill\:current {`);
		expect(css).toContain("fill: currentColor;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFillUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useStrokeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useStrokeUtility(s, { none: "none", current: "currentColor" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "stroke",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useStrokeUtility(s, { current: "currentColor" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ stroke: "currentColor" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useStrokeUtility(s, { current: "currentColor" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._stroke\:current {`);
		expect(css).toContain("stroke: currentColor;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useStrokeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useStrokeWidthUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useStrokeWidthUtility(s, { "0": "0", "1": "1", "2": "2" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "stroke-width",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useStrokeWidthUtility(s, { "2": "2" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ strokeWidth: "2" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useStrokeWidthUtility(s, { "2": "2" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._stroke-width\:2 {`);
		expect(css).toContain("stroke-width: 2;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useStrokeWidthUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
