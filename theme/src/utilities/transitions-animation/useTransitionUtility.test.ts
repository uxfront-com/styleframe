import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useTransitionUtility } from "./useTransitionUtility";

describe("useTransitionUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTransitionUtility(s, {
			"bg-color": "background-color 150ms ease",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "transition",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTransitionUtility(s, {
			"bg-color": "background-color 150ms ease",
		});

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			transition: "background-color 150ms ease",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTransitionUtility(s, { all: "all 200ms ease-in-out" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._transition\:all {`);
		expect(css).toContain("transition: all 200ms ease-in-out;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTransitionUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
