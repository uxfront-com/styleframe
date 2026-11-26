import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBackgroundOriginUtility } from "./useBackgroundOriginUtility";

describe("useBackgroundOriginUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundOriginUtility(s, {
			border: "border-box",
			padding: "padding-box",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-origin",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundOriginUtility(s, { content: "content-box" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundOrigin: "content-box" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundOriginUtility(s, { border: "border-box" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-origin\:border {`);
		expect(css).toContain("background-origin: border-box;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundOriginUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
