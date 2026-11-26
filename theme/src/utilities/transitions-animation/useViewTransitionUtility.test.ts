import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useViewTransitionNameUtility } from "./useViewTransitionUtility";

describe("useViewTransitionNameUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useViewTransitionNameUtility(s, { hero: "hero", card: "card" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "view-transition-name",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useViewTransitionNameUtility(s, { hero: "hero" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ viewTransitionName: "hero" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useViewTransitionNameUtility(s, { hero: "hero" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._view-transition-name\:hero {`);
		expect(css).toContain("view-transition-name: hero;");
	});

	it("should ship without defaults", () => {
		const s = styleframe();
		useViewTransitionNameUtility(s);

		expect(s.root.children).toHaveLength(0);
	});
});
