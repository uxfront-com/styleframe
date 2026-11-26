import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useAspectRatioUtility } from "./useAspectRatioUtility";

describe("useAspectRatioUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useAspectRatioUtility(s, { square: "1 / 1", video: "16 / 9" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "aspect-ratio",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useAspectRatioUtility(s, { square: "1 / 1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ aspectRatio: "1 / 1" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useAspectRatioUtility(s, { video: "16 / 9" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._aspect-ratio\:video {`);
		expect(css).toContain("aspect-ratio: 16 / 9;");
	});

	it("should handle auto value", () => {
		const s = styleframe();
		useAspectRatioUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ aspectRatio: "auto" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useAspectRatioUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
