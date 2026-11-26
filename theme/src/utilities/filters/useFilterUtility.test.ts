import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useBlurUtility,
	useBrightnessUtility,
	useContrastUtility,
	useDropShadowUtility,
	useFilterUtility,
	useGrayscaleUtility,
	useHueRotateUtility,
	useInvertUtility,
	useSaturateUtility,
	useSepiaUtility,
} from "./useFilterUtility";

describe("useFilterUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFilterUtility(s, { none: "none", default: "blur(8px)" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "filter",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useFilterUtility(s, { default: "blur(8px)" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			filter: "blur(8px)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFilterUtility(s, { default: "blur(8px)" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._filter {");
		expect(css).toContain("filter: blur(8px);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFilterUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBlurUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBlurUtility(s, { sm: "4px", md: "8px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "blur",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBlurUtility(s, { sm: "4px" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-blur": "blur(4px)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBlurUtility(s, { sm: "4px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._blur\:sm {`);
		expect(css).toContain("--filter-blur: blur(4px);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBlurUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useBrightnessUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBrightnessUtility(s, { "50": "0.5", "100": "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "brightness",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBrightnessUtility(s, { "50": "0.5" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-brightness": "brightness(0.5)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBrightnessUtility(s, { "50": "0.5" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._brightness\:50 {`);
		expect(css).toContain("--filter-brightness: brightness(0.5);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBrightnessUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useContrastUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useContrastUtility(s, { "50": "0.5", "100": "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "contrast",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useContrastUtility(s, { "100": "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-contrast": "contrast(1)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useContrastUtility(s, { "100": "1" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._contrast\:100 {`);
		expect(css).toContain("--filter-contrast: contrast(1);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useContrastUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useDropShadowUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useDropShadowUtility(s, {
			sm: "0 1px 1px rgb(0 0 0 / 0.05)",
			md: "0 4px 3px rgb(0 0 0 / 0.07)",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "drop-shadow",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useDropShadowUtility(s, { sm: "0 1px 1px rgb(0 0 0 / 0.05)" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-drop-shadow": "drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useDropShadowUtility(s, { sm: "0 1px 1px rgb(0 0 0 / 0.05)" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._drop-shadow\:sm {`);
		expect(css).toContain("--filter-drop-shadow: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useDropShadowUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useGrayscaleUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useGrayscaleUtility(s, { "0": "0", default: "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "grayscale",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useGrayscaleUtility(s, { full: "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-grayscale": "grayscale(1)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGrayscaleUtility(s, { full: "1" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grayscale\:full {`);
		expect(css).toContain("--filter-grayscale: grayscale(1);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useGrayscaleUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useHueRotateUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useHueRotateUtility(s, { "15": "15deg", "30": "30deg" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "hue-rotate",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useHueRotateUtility(s, { "90": "90deg" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-hue-rotate": "hue-rotate(90deg)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useHueRotateUtility(s, { "90": "90deg" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._hue-rotate\:90 {`);
		expect(css).toContain("--filter-hue-rotate: hue-rotate(90deg);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useHueRotateUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useInvertUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useInvertUtility(s, { "0": "0", default: "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "invert",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useInvertUtility(s, { full: "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-invert": "invert(1)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useInvertUtility(s, { full: "1" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._invert\:full {`);
		expect(css).toContain("--filter-invert: invert(1);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useInvertUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useSaturateUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSaturateUtility(s, { "50": "0.5", "100": "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "saturate",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useSaturateUtility(s, { "150": "1.5" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-saturate": "saturate(1.5)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSaturateUtility(s, { "150": "1.5" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._saturate\:150 {`);
		expect(css).toContain("--filter-saturate: saturate(1.5);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useSaturateUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useSepiaUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSepiaUtility(s, { "0": "0", default: "1" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "sepia",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useSepiaUtility(s, { full: "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--filter-sepia": "sepia(1)",
			filter:
				"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSepiaUtility(s, { full: "1" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._sepia\:full {`);
		expect(css).toContain("--filter-sepia: sepia(1);");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useSepiaUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
