import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useTextWrapUtility } from "./useTextWrapUtility";

describe("useTextWrapUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useTextWrapUtility(s, { wrap: "wrap", nowrap: "nowrap" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-wrap",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useTextWrapUtility(s, { balance: "balance" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ textWrap: "balance" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useTextWrapUtility(s, { pretty: "pretty", balance: "balance" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-wrap\:pretty {`);
		expect(css).toContain("text-wrap: pretty;");
		expect(css).toContain(String.raw`._text-wrap\:balance {`);
		expect(css).toContain("text-wrap: balance;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useTextWrapUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
