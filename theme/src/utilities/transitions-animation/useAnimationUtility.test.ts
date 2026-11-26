import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useAnimationUtility,
	useAnimationNameUtility,
	useAnimationDurationUtility,
	useAnimationTimingFunctionUtility,
	useAnimationIterationCountUtility,
} from "./useAnimationUtility";

describe("useAnimationUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAnimationUtility(s, { spin: "spin 1s linear infinite" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "animation",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAnimationUtility(s, { spin: "spin 1s linear infinite" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			animation: "spin 1s linear infinite",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAnimationUtility(s, { spin: "spin 1s linear infinite" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._animation\:spin {`);
		expect(css).toContain("animation: spin 1s linear infinite;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAnimationUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useAnimationNameUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAnimationNameUtility(s, { "fade-in": "fade-in" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "animation-name",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAnimationNameUtility(s, { "fade-in": "fade-in" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			animationName: "fade-in",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAnimationNameUtility(s, { "fade-in": "fade-in" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._animation-name\:fade-in {`);
		expect(css).toContain("animation-name: fade-in;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAnimationNameUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useAnimationDurationUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAnimationDurationUtility(s, { "200ms": "200ms" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "animation-duration",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAnimationDurationUtility(s, { "200ms": "200ms" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			animationDuration: "200ms",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAnimationDurationUtility(s, { "200ms": "200ms" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._animation-duration\:200ms {`);
		expect(css).toContain("animation-duration: 200ms;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAnimationDurationUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useAnimationTimingFunctionUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAnimationTimingFunctionUtility(s, {
			"ease-in-out": "ease-in-out",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "animation-timing-function",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAnimationTimingFunctionUtility(s, {
			"ease-in-out": "ease-in-out",
		});

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			animationTimingFunction: "ease-in-out",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAnimationTimingFunctionUtility(s, {
			"ease-in-out": "ease-in-out",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._animation-timing-function\:ease-in-out {`);
		expect(css).toContain("animation-timing-function: ease-in-out;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAnimationTimingFunctionUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useAnimationIterationCountUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAnimationIterationCountUtility(s, { infinite: "infinite" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "animation-iteration-count",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAnimationIterationCountUtility(s, { infinite: "infinite" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			animationIterationCount: "infinite",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAnimationIterationCountUtility(s, { infinite: "infinite" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._animation-iteration-count\:infinite {`);
		expect(css).toContain("animation-iteration-count: infinite;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAnimationIterationCountUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
