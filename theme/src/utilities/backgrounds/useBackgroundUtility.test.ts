import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBackgroundUtility } from "./useBackgroundUtility";

describe("useBackgroundUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundUtility(s, {
			none: "none",
			cover: "center / cover no-repeat",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundUtility(s, { cover: "center / cover no-repeat" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			background: "center / cover no-repeat",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background\:none {`);
		expect(css).toContain("background: none;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
