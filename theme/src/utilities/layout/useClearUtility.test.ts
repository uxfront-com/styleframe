import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useClearUtility } from "./useClearUtility";

describe("useClearUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useClearUtility(s, { left: "left", right: "right" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "clear",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useClearUtility(s, { both: "both" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ clear: "both" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useClearUtility(s, { left: "left" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._clear\:left {`);
		expect(css).toContain("clear: left;");
	});

	it("should handle start value", () => {
		const s = styleframe();
		useClearUtility(s, { start: "inline-start" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ clear: "inline-start" });
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useClearUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
