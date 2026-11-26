import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useAbbrElement } from "./useAbbrElement";

describe("useAbbrElement", () => {
	it("should create abbr variables and selector with defaults", () => {
		const s = styleframe();
		const result = useAbbrElement(s);

		expect(result.abbrCursor).toBeDefined();
		expect(result.abbrTextDecoration).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("abbr[title]");
		expect(css).toContain("var(--abbr--cursor)");
		expect(css).toContain("var(--abbr--text-decoration)");
	});

	it("should use custom config values", () => {
		const s = styleframe();
		const result = useAbbrElement(s, {
			cursor: "pointer",
			textDecoration: "underline",
		});

		expect(result.abbrCursor.value).toBe("pointer");
		expect(result.abbrTextDecoration.value).toBe("underline");
	});
});
