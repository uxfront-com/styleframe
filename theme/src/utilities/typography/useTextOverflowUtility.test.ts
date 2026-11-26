import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useTextOverflowUtility } from "./useTextOverflowUtility";

describe("useTextOverflowUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextOverflowUtility(s, { ellipsis: "ellipsis", clip: "clip" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-overflow",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations for ellipsis", () => {
		const s = styleframe();
		useTextOverflowUtility(s, { ellipsis: "ellipsis" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		});
	});

	it("should set correct declarations for clip", () => {
		const s = styleframe();
		useTextOverflowUtility(s, { clip: "clip" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textOverflow: "clip" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextOverflowUtility(s, { ellipsis: "ellipsis" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-overflow\:ellipsis {`);
		expect(css).toContain("text-overflow: ellipsis;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextOverflowUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
