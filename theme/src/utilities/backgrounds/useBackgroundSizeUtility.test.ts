import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useBackgroundSizeUtility } from "./useBackgroundSizeUtility";

describe("useBackgroundSizeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundSizeUtility(s, { auto: "auto", cover: "cover" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-size",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundSizeUtility(s, { contain: "contain" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundSize: "contain" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundSizeUtility(s, { cover: "cover" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-size\:cover {`);
		expect(css).toContain("background-size: cover;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundSizeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
