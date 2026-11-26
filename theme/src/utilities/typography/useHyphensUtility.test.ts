import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useHyphensUtility } from "./useHyphensUtility";

describe("useHyphensUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useHyphensUtility(s, { none: "none", auto: "auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "hyphens",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useHyphensUtility(s, { manual: "manual" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ hyphens: "manual" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useHyphensUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._hyphens\:auto {`);
		expect(css).toContain("hyphens: auto;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useHyphensUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
