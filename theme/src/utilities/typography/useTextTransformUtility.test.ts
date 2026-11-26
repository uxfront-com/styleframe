import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useTextTransformUtility } from "./useTextTransformUtility";

describe("useTextTransformUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextTransformUtility(s, {
			uppercase: "uppercase",
			lowercase: "lowercase",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-transform",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextTransformUtility(s, { capitalize: "capitalize" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textTransform: "capitalize" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextTransformUtility(s, { uppercase: "uppercase", none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-transform\:uppercase {`);
		expect(css).toContain("text-transform: uppercase;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextTransformUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
