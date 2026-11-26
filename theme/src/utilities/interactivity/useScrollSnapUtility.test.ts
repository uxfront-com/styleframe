import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { scrollSnapAlignValues, scrollSnapStopValues, scrollSnapTypeValues } from "../../values";
import {
	useScrollSnapAlignUtility,
	useScrollSnapStopUtility,
	useScrollSnapTypeUtility,
} from "./useScrollSnapUtility";

describe("useScrollSnapAlignUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useScrollSnapAlignUtility(s, { start: "start", center: "center" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-snap-align",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollSnapAlignUtility(s, { start: "start" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollSnapAlign: "start" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollSnapAlignUtility(s, { start: "start" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-snap-align\:start {`);
		expect(css).toContain("scroll-snap-align: start;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useScrollSnapAlignUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-snap-align",
		);
		expect(utilities).toHaveLength(Object.keys(scrollSnapAlignValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useScrollSnapAlignUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useScrollSnapStopUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useScrollSnapStopUtility(s, { normal: "normal", always: "always" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-snap-stop",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollSnapStopUtility(s, { always: "always" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollSnapStop: "always" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollSnapStopUtility(s, { always: "always" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-snap-stop\:always {`);
		expect(css).toContain("scroll-snap-stop: always;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useScrollSnapStopUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-snap-stop",
		);
		expect(utilities).toHaveLength(Object.keys(scrollSnapStopValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useScrollSnapStopUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useScrollSnapTypeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s, {
			none: "none",
			x: "x var(--scroll-snap-type-strictness)",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-snap-type",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations for axis values", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s, { x: "x var(--scroll-snap-type-strictness)" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			scrollSnapType: "x var(--scroll-snap-type-strictness)",
		});
	});

	it("should set correct declarations for strictness values", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s, { mandatory: "mandatory" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--scroll-snap-type-strictness": "mandatory",
		});
	});

	it("should set correct declarations for proximity strictness", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s, { proximity: "proximity" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--scroll-snap-type-strictness": "proximity",
		});
	});

	it("should compile to correct CSS output for axis values", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s, { x: "x var(--scroll-snap-type-strictness)" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-snap-type\:x {`);
		expect(css).toContain("scroll-snap-type: x var(--scroll-snap-type-strictness);");
	});

	it("should compile to correct CSS output for strictness values", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s, { mandatory: "mandatory" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-snap-type\:mandatory {`);
		expect(css).toContain("--scroll-snap-type-strictness: mandatory;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-snap-type",
		);
		expect(utilities).toHaveLength(Object.keys(scrollSnapTypeValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useScrollSnapTypeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
