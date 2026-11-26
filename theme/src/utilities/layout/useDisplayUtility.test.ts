import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDisplayUtility } from "./useDisplayUtility";

describe("useDisplayUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useDisplayUtility(s, { flex: "flex", block: "block" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "display",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useDisplayUtility(s, { flex: "flex" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ display: "flex" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useDisplayUtility(s, { grid: "grid" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._display\:grid {`);
		expect(css).toContain("display: grid;");
	});

	it("should handle hidden value", () => {
		const s = styleframe();
		useDisplayUtility(s, { hidden: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ display: "none" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useDisplayUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
