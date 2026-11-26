import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBackgroundClipUtility } from "./useBackgroundClipUtility";

describe("useBackgroundClipUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundClipUtility(s, {
			border: "border-box",
			padding: "padding-box",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-clip",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundClipUtility(s, { content: "content-box" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundClip: "content-box" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundClipUtility(s, { text: "text" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-clip\:text {`);
		expect(css).toContain("background-clip: text;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundClipUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
