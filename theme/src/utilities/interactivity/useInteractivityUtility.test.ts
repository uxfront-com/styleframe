import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	appearanceValues,
	colorSchemeValues,
	cursorValues,
	pointerEventsValues,
	resizeValues,
	scrollBehaviorValues,
	touchActionValues,
	userSelectValues,
	willChangeValues,
} from "../../values";
import {
	useAccentColorUtility,
	useAppearanceUtility,
	useWebkitAppearanceUtility,
	useCaretColorUtility,
	useColorSchemeUtility,
	useCursorUtility,
	usePointerEventsUtility,
	useResizeUtility,
	useScrollBehaviorUtility,
	useTouchActionUtility,
	useUserSelectUtility,
	useWillChangeUtility,
} from "./useInteractivityUtility";

describe("useAccentColorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAccentColorUtility(s, { primary: "blue", secondary: "green" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "accent-color",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAccentColorUtility(s, { primary: "blue" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ accentColor: "blue" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAccentColorUtility(s, { primary: "blue" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._accent-color\:primary {`);
		expect(css).toContain("accent-color: blue;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAccentColorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useAppearanceUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAppearanceUtility(s, { none: "none", auto: "auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "appearance",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAppearanceUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ appearance: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAppearanceUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._appearance\:none {`);
		expect(css).toContain("appearance: none;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useAppearanceUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "appearance",
		);
		expect(utilities).toHaveLength(Object.keys(appearanceValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAppearanceUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useWebkitAppearanceUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useWebkitAppearanceUtility(s, { none: "none", auto: "auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "-webkit-appearance",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useWebkitAppearanceUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ "-webkit-appearance": "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useWebkitAppearanceUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("-webkit-appearance: none;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useWebkitAppearanceUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "-webkit-appearance",
		);
		expect(utilities).toHaveLength(Object.keys(appearanceValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useWebkitAppearanceUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useCaretColorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useCaretColorUtility(s, { primary: "blue", current: "currentColor" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "caret-color",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useCaretColorUtility(s, { primary: "blue" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ caretColor: "blue" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useCaretColorUtility(s, { primary: "blue" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._caret-color\:primary {`);
		expect(css).toContain("caret-color: blue;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useCaretColorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useColorSchemeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useColorSchemeUtility(s, { light: "light", dark: "dark" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "color-scheme",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useColorSchemeUtility(s, { dark: "dark" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ colorScheme: "dark" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useColorSchemeUtility(s, { dark: "dark" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._color-scheme\:dark {`);
		expect(css).toContain("color-scheme: dark;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useColorSchemeUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "color-scheme",
		);
		expect(utilities).toHaveLength(Object.keys(colorSchemeValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useColorSchemeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useCursorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useCursorUtility(s, { pointer: "pointer", wait: "wait" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "cursor",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useCursorUtility(s, { pointer: "pointer" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ cursor: "pointer" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useCursorUtility(s, { pointer: "pointer" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._cursor\:pointer {`);
		expect(css).toContain("cursor: pointer;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useCursorUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "cursor",
		);
		expect(utilities).toHaveLength(Object.keys(cursorValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useCursorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePointerEventsUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePointerEventsUtility(s, { none: "none", auto: "auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "pointer-events",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePointerEventsUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ pointerEvents: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePointerEventsUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._pointer-events\:none {`);
		expect(css).toContain("pointer-events: none;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		usePointerEventsUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "pointer-events",
		);
		expect(utilities).toHaveLength(Object.keys(pointerEventsValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePointerEventsUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useResizeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useResizeUtility(s, { none: "none", both: "both" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "resize",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useResizeUtility(s, { y: "vertical" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ resize: "vertical" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useResizeUtility(s, { y: "vertical" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._resize\:y {`);
		expect(css).toContain("resize: vertical;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useResizeUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "resize",
		);
		expect(utilities).toHaveLength(Object.keys(resizeValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useResizeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useScrollBehaviorUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useScrollBehaviorUtility(s, { auto: "auto", smooth: "smooth" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-behavior",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useScrollBehaviorUtility(s, { smooth: "smooth" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ scrollBehavior: "smooth" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useScrollBehaviorUtility(s, { smooth: "smooth" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._scroll-behavior\:smooth {`);
		expect(css).toContain("scroll-behavior: smooth;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useScrollBehaviorUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "scroll-behavior",
		);
		expect(utilities).toHaveLength(Object.keys(scrollBehaviorValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useScrollBehaviorUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useTouchActionUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTouchActionUtility(s, { auto: "auto", none: "none" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "touch-action",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTouchActionUtility(s, { manipulation: "manipulation" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ touchAction: "manipulation" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTouchActionUtility(s, { manipulation: "manipulation" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._touch-action\:manipulation {`);
		expect(css).toContain("touch-action: manipulation;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useTouchActionUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "touch-action",
		);
		expect(utilities).toHaveLength(Object.keys(touchActionValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTouchActionUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useUserSelectUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useUserSelectUtility(s, { none: "none", all: "all" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "user-select",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useUserSelectUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ userSelect: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useUserSelectUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._user-select\:none {`);
		expect(css).toContain("user-select: none;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useUserSelectUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "user-select",
		);
		expect(utilities).toHaveLength(Object.keys(userSelectValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useUserSelectUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useWillChangeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useWillChangeUtility(s, { auto: "auto", transform: "transform" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "will-change",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useWillChangeUtility(s, { transform: "transform" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ willChange: "transform" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useWillChangeUtility(s, { transform: "transform" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._will-change\:transform {`);
		expect(css).toContain("will-change: transform;");
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		useWillChangeUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "will-change",
		);
		expect(utilities).toHaveLength(Object.keys(willChangeValues).length);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useWillChangeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
