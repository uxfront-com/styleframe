import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useSizeUtility } from "./useSizeUtility";

describe("useSizeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSizeUtility(s, { full: "100%", "4": "1rem" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "size",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should add utility instances to root.children", () => {
		const s = styleframe();
		useSizeUtility(s, { full: "100%" });

		expect(s.root.children).toHaveLength(1);
		const utility = s.root.children[0] as Utility;
		expect(utility.type).toBe("utility");
		expect(utility.name).toBe("size");
		expect(utility.value).toBe("full");
	});

	it("should set correct declarations for width and height", () => {
		const s = styleframe();
		useSizeUtility(s, { "8": "2rem" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			width: "2rem",
			height: "2rem",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSizeUtility(s, { full: "100%", "4": "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._size\:full {`);
		expect(css).toContain("width: 100%;");
		expect(css).toContain("height: 100%;");
		expect(css).toContain(String.raw`._size\:4 {`);
		expect(css).toContain("width: 1rem;");
		expect(css).toContain("height: 1rem;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		useSizeUtility(s, { default: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._size {");
		expect(css).not.toContain(String.raw`._size\:default`);
	});

	it("should handle 'auto' value", () => {
		const s = styleframe();
		useSizeUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			width: "auto",
			height: "auto",
		});
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useSizeUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		useSizeUtility(s, { full: "100%" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "size" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const sizeFull = s.variable("size.full", "100%");
		useSizeUtility(s, { full: s.ref(sizeFull) });

		const utility = s.root.children[0] as Utility;
		const expectedRef = {
			type: "reference",
			name: "size.full",
		};
		expect(utility.declarations?.width).toEqual(expectedRef);
		expect(utility.declarations?.height).toEqual(expectedRef);
	});

	it("should return UtilityCreatorFn", () => {
		const s = styleframe();
		const creator = useSizeUtility(s, { full: "100%" });

		expect(typeof creator).toBe("function");
	});
});
