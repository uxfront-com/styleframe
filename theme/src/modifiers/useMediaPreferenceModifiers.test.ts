import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useMediaPreferenceModifiers } from "./useMediaPreferenceModifiers";

describe("useMediaPreferenceModifiers", () => {
	it("should register all media preference modifier factories", () => {
		const s = styleframe();
		const modifiers = useMediaPreferenceModifiers(s);

		expect(modifiers.dark.key).toEqual(["dark"]);
		expect(modifiers.motionSafe.key).toEqual(["motion-safe"]);
		expect(modifiers.motionReduce.key).toEqual(["motion-reduce"]);
		expect(modifiers.contrastMore.key).toEqual(["contrast-more"]);
		expect(modifiers.contrastLess.key).toEqual(["contrast-less"]);
		expect(modifiers.portrait.key).toEqual(["portrait"]);
		expect(modifiers.landscape.key).toEqual(["landscape"]);
		expect(modifiers.print.key).toEqual(["print"]);
		expect(modifiers.forcedColors.key).toEqual(["forced-colors"]);
		expect(modifiers.hoverCapable.key).toEqual(["hover-capable"]);
		expect(modifiers.anyPointerCoarse.key).toEqual(["any-pointer-coarse"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useMediaPreferenceModifiers(s);

		expect(s.root.modifiers).toHaveLength(11);
	});

	it("should generate correct CSS class names for dark modifier", () => {
		const s = styleframe();
		const { dark } = useMediaPreferenceModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ primary: "#006cff" }, [dark]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._background-color\\:primary {");
		expect(css).toContain("._dark\\:background-color\\:primary {");
	});

	it("should generate dark modifier with theme selectors only (no media query)", () => {
		const s = styleframe();
		const { dark } = useMediaPreferenceModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ primary: "#006cff" }, [dark]);

		const css = consumeCSS(s.root, s.options);
		expect(css).not.toContain("@media (prefers-color-scheme: dark)");
		expect(css).toContain(".dark-theme");
		expect(css).toContain('[data-theme="dark"]');
	});

	it("should generate correct CSS class names for motion-reduce modifier", () => {
		const s = styleframe();
		const { motionReduce } = useMediaPreferenceModifiers(s);

		const createTransition = s.utility("transition-duration", ({ value }) => ({
			transitionDuration: value,
		}));
		createTransition({ 0: "0s" }, [motionReduce]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._transition-duration\\:0 {");
		expect(css).toContain("._motion-reduce\\:transition-duration\\:0 {");
	});

	it("should generate correct CSS class names for print modifier", () => {
		const s = styleframe();
		const { print } = useMediaPreferenceModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ none: "none" }, [print]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._display\\:none {");
		expect(css).toContain("._print\\:display\\:none {");
	});

	it("should generate correct CSS class names for portrait modifier", () => {
		const s = styleframe();
		const { portrait } = useMediaPreferenceModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ flex: "flex" }, [portrait]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._display\\:flex {");
		expect(css).toContain("._portrait\\:display\\:flex {");
	});

	it("should wrap hover-capable styles in a hover media query", () => {
		const s = styleframe();
		const { hoverCapable } = useMediaPreferenceModifiers(s);

		const create = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		create({ primary: "#006cff" }, [hoverCapable]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._hover-capable\\:background-color\\:primary {");
		expect(css).toContain("@media (hover: hover) {");
	});

	it("should wrap any-pointer-coarse styles in a coarse pointer media query", () => {
		const s = styleframe();
		const { anyPointerCoarse } = useMediaPreferenceModifiers(s);

		const create = s.utility("min-height", ({ value }) => ({
			minHeight: value,
		}));
		create({ touch: "44px" }, [anyPointerCoarse]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._any-pointer-coarse\\:min-height\\:touch {");
		expect(css).toContain("@media (any-pointer: coarse) {");
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { dark } = useMediaPreferenceModifiers(s);

		const createColor = s.utility("color", ({ value }) => ({
			color: value,
		}));
		createColor({ white: "#fff" }, [dark]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "color",
		);
		expect(utilities).toHaveLength(2);

		const darkUtility = utilities.find((u) => u.modifiers.includes("dark"));
		expect(darkUtility).toBeDefined();
	});
});
