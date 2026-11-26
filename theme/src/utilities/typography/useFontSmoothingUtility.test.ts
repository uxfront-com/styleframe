import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useFontSmoothingUtility } from "./useFontSmoothingUtility";

describe("useFontSmoothingUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useFontSmoothingUtility(s, { antialiased: "antialiased" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "font-smoothing",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useFontSmoothingUtility(s, { antialiased: "antialiased" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._font-smoothing\:antialiased {`);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useFontSmoothingUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
