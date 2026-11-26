import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useObjectFitUtility } from "./useObjectFitUtility";

describe("useObjectFitUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useObjectFitUtility(s, { cover: "cover", contain: "contain" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "object-fit",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useObjectFitUtility(s, { cover: "cover" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ objectFit: "cover" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useObjectFitUtility(s, { contain: "contain" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._object-fit\:contain {`);
		expect(css).toContain("object-fit: contain;");
	});

	it("should handle scale-down value", () => {
		const s = styleframe();
		useObjectFitUtility(s, { "scale-down": "scale-down" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ objectFit: "scale-down" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useObjectFitUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
