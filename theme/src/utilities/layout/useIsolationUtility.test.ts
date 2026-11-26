import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useIsolationUtility } from "./useIsolationUtility";

describe("useIsolationUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useIsolationUtility(s, { isolate: "isolate", auto: "auto" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "isolation",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useIsolationUtility(s, { isolate: "isolate" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ isolation: "isolate" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useIsolationUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._isolation\:auto {`);
		expect(css).toContain("isolation: auto;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useIsolationUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
