import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	usePlaceContentUtility,
	usePlaceItemsUtility,
	usePlaceSelfUtility,
} from "./usePlaceUtility";

describe("usePlaceContentUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePlaceContentUtility(s, { center: "center", start: "start" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "place-content",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePlaceContentUtility(s, { between: "space-between" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ placeContent: "space-between" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePlaceContentUtility(s, { center: "center" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._place-content\:center {`);
		expect(css).toContain("place-content: center;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePlaceContentUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePlaceItemsUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePlaceItemsUtility(s, { start: "start", center: "center" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "place-items",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePlaceItemsUtility(s, { stretch: "stretch" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ placeItems: "stretch" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePlaceItemsUtility(s, { baseline: "baseline" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._place-items\:baseline {`);
		expect(css).toContain("place-items: baseline;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePlaceItemsUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("usePlaceSelfUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		usePlaceSelfUtility(s, { auto: "auto", center: "center" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "place-self",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		usePlaceSelfUtility(s, { start: "start" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ placeSelf: "start" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		usePlaceSelfUtility(s, { stretch: "stretch" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._place-self\:stretch {`);
		expect(css).toContain("place-self: stretch;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		usePlaceSelfUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
