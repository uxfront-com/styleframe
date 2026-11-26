import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useBackgroundAttachmentUtility } from "./useBackgroundAttachmentUtility";

describe("useBackgroundAttachmentUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundAttachmentUtility(s, { fixed: "fixed", scroll: "scroll" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-attachment",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundAttachmentUtility(s, { fixed: "fixed" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundAttachment: "fixed" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundAttachmentUtility(s, { local: "local" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-attachment\:local {`);
		expect(css).toContain("background-attachment: local;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundAttachmentUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
