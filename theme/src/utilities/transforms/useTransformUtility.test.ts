import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useBackfaceVisibilityUtility,
	usePerspectiveUtility,
	usePerspectiveOriginUtility,
	useRotateUtility,
	useRotateXUtility,
	useRotateYUtility,
	useScaleUtility,
	useScaleXUtility,
	useScaleYUtility,
	useSkewXUtility,
	useSkewYUtility,
	useTransformOriginUtility,
	useTransformStyleUtility,
	useTranslateUtility,
	useTranslateXUtility,
	useTranslateYUtility,
	useTranslateZUtility,
} from "./useTransformUtility";
import {
	backfaceVisibilityValues,
	perspectiveOriginValues,
	transformOriginValues,
	transformStyleValues,
} from "../../values";

describe("useBackfaceVisibilityUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackfaceVisibilityUtility(s, { visible: "visible", hidden: "hidden" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "backface-visibility",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackfaceVisibilityUtility(s, { hidden: "hidden" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backfaceVisibility: "hidden" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackfaceVisibilityUtility(s, { hidden: "hidden" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._backface-visibility\:hidden {`);
		expect(css).toContain("backface-visibility: hidden;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useBackfaceVisibilityUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "backface-visibility",
		);
		expect(utilities).toHaveLength(
			Object.keys(backfaceVisibilityValues).length,
		);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackfaceVisibilityUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePerspectiveUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePerspectiveUtility(s, { none: "none", sm: "500px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "perspective",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePerspectiveUtility(s, { md: "1000px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ perspective: "1000px" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePerspectiveUtility(s, { md: "1000px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._perspective\:md {`);
		expect(css).toContain("perspective: 1000px;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePerspectiveUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePerspectiveOriginUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePerspectiveOriginUtility(s, { center: "center", top: "top" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "perspective-origin",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePerspectiveOriginUtility(s, { "top-left": "top left" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ perspectiveOrigin: "top left" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePerspectiveOriginUtility(s, { "top-left": "top left" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._perspective-origin\:top-left {`);
		expect(css).toContain("perspective-origin: top left;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		usePerspectiveOriginUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "perspective-origin",
		);
		expect(utilities).toHaveLength(Object.keys(perspectiveOriginValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePerspectiveOriginUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useRotateUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useRotateUtility(s, { "45": "45deg", "90": "90deg" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "rotate",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useRotateUtility(s, { "45": "45deg" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-rotate": "45deg",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useRotateUtility(s, { "45": "45deg" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._rotate\:45 {`);
		expect(css).toContain("--transform-rotate: 45deg;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useRotateUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useRotateXUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useRotateXUtility(s, { "45": "45deg", "90": "90deg" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "rotate-x",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useRotateXUtility(s, { "45": "45deg" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-rotate-x": "45deg",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) rotateX(var(--transform-rotate-x)) rotateY(var(--transform-rotate-y)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useRotateXUtility(s, { "45": "45deg" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._rotate-x\:45 {`);
		expect(css).toContain("--transform-rotate-x: 45deg;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useRotateXUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useRotateYUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useRotateYUtility(s, { "45": "45deg", "90": "90deg" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "rotate-y",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useRotateYUtility(s, { "45": "45deg" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-rotate-y": "45deg",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) rotateX(var(--transform-rotate-x)) rotateY(var(--transform-rotate-y)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useRotateYUtility(s, { "45": "45deg" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._rotate-y\:45 {`);
		expect(css).toContain("--transform-rotate-y: 45deg;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useRotateYUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useScaleUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useScaleUtility(s, { "50": "0.5", "100": "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scale",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useScaleUtility(s, { "150": "1.5" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-scale-x": "1.5",
			"--transform-scale-y": "1.5",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScaleUtility(s, { "150": "1.5" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scale\:150 {`);
		expect(css).toContain("--transform-scale-x: 1.5;");
		expect(css).toContain("--transform-scale-y: 1.5;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useScaleUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useScaleXUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScaleXUtility(s, { "150": "1.5" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-scale-x": "1.5",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScaleXUtility(s, { "150": "1.5" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scale-x\:150 {`);
		expect(css).toContain("--transform-scale-x: 1.5;");
	});
});

describe("useScaleYUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useScaleYUtility(s, { "150": "1.5" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-scale-y": "1.5",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScaleYUtility(s, { "150": "1.5" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scale-y\:150 {`);
		expect(css).toContain("--transform-scale-y: 1.5;");
	});
});

describe("useSkewXUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSkewXUtility(s, { "3": "3deg", "6": "6deg" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "skew-x",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useSkewXUtility(s, { "12": "12deg" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-skew-x": "12deg",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSkewXUtility(s, { "12": "12deg" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._skew-x\:12 {`);
		expect(css).toContain("--transform-skew-x: 12deg;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useSkewXUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useSkewYUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSkewYUtility(s, { "3": "3deg", "6": "6deg" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "skew-y",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useSkewYUtility(s, { "12": "12deg" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-skew-y": "12deg",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSkewYUtility(s, { "12": "12deg" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._skew-y\:12 {`);
		expect(css).toContain("--transform-skew-y: 12deg;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useSkewYUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTransformOriginUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTransformOriginUtility(s, { center: "center", top: "top" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "transform-origin",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTransformOriginUtility(s, { "top-left": "top left" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ transformOrigin: "top left" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTransformOriginUtility(s, { "top-left": "top left" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._transform-origin\:top-left {`);
		expect(css).toContain("transform-origin: top left;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useTransformOriginUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "transform-origin",
		);
		expect(utilities).toHaveLength(Object.keys(transformOriginValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTransformOriginUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTransformStyleUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTransformStyleUtility(s, { flat: "flat", "3d": "preserve-3d" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "transform-style",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTransformStyleUtility(s, { "3d": "preserve-3d" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ transformStyle: "preserve-3d" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTransformStyleUtility(s, { "3d": "preserve-3d" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._transform-style\:3d {`);
		expect(css).toContain("transform-style: preserve-3d;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useTransformStyleUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "transform-style",
		);
		expect(utilities).toHaveLength(Object.keys(transformStyleValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTransformStyleUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTranslateUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTranslateUtility(s, { "1": "0.25rem", "2": "0.5rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "translate",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTranslateUtility(s, { "4": "1rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-translate-x": "1rem",
			"--transform-translate-y": "1rem",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTranslateUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._translate\:4 {`);
		expect(css).toContain("--transform-translate-x: 1rem;");
		expect(css).toContain("--transform-translate-y: 1rem;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTranslateUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTranslateXUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useTranslateXUtility(s, { "4": "1rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-translate-x": "1rem",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTranslateXUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._translate-x\:4 {`);
		expect(css).toContain("--transform-translate-x: 1rem;");
	});
});

describe("useTranslateYUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useTranslateYUtility(s, { "4": "1rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-translate-y": "1rem",
			transform:
				"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTranslateYUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._translate-y\:4 {`);
		expect(css).toContain("--transform-translate-y: 1rem;");
	});
});

describe("useTranslateZUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useTranslateZUtility(s, { "4": "1rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--transform-translate-z": "1rem",
			transform:
				"translate3d(var(--transform-translate-x), var(--transform-translate-y), var(--transform-translate-z)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTranslateZUtility(s, { "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._translate-z\:4 {`);
		expect(css).toContain("--transform-translate-z: 1rem;");
	});
});
