import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useVisibilityUtility } from "./useVisibilityUtility";

describe("useVisibilityUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useVisibilityUtility(s, { visible: "visible", invisible: "hidden" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "visibility",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useVisibilityUtility(s, { visible: "visible" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ visibility: "visible" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useVisibilityUtility(s, { invisible: "hidden" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._visibility\:invisible {`);
		expect(css).toContain("visibility: hidden;");
	});

	it("should handle collapse value", () => {
		const s = styleframe();
		useVisibilityUtility(s, { collapse: "collapse" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ visibility: "collapse" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useVisibilityUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
