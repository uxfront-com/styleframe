import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useBackgroundBlendModeUtility } from "./useBackgroundBlendModeUtility";

describe("useBackgroundBlendModeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundBlendModeUtility(s, {
			normal: "normal",
			multiply: "multiply",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-blend-mode",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundBlendModeUtility(s, { overlay: "overlay" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundBlendMode: "overlay" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundBlendModeUtility(s, { screen: "screen" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-blend-mode\:screen {`);
		expect(css).toContain("background-blend-mode: screen;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundBlendModeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
