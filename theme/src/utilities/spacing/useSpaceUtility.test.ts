import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useSpaceXReverseUtility,
	useSpaceXUtility,
	useSpaceYReverseUtility,
	useSpaceYUtility,
} from "./useSpaceUtility";

describe("useSpaceXUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSpaceXUtility(s, { sm: "8px", md: "16px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "space-x",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should add utility instances to root.children", () => {
		const s = styleframe();
		useSpaceXUtility(s, { sm: "8px" });

		expect(s.root.children).toHaveLength(1);
		const utility = s.root.children[0] as Utility;
		expect(utility.type).toBe("utility");
		expect(utility.name).toBe("space-x");
		expect(utility.value).toBe("sm");
	});

	it("should generate nested selector with lobotomized owl pattern", () => {
		const s = styleframe();
		useSpaceXUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-x\:md {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("margin-left: 16px;");
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSpaceXUtility(s, { sm: "0.5rem", md: "1rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-x\:sm {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("margin-left: 0.5rem;");
		expect(css).toContain(String.raw`._space-x\:md {`);
		expect(css).toContain("margin-left: 1rem;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		useSpaceXUtility(s, { default: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._space-x {");
		expect(css).not.toContain(String.raw`._space-x\:default`);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useSpaceXUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should work with modifiers", () => {
		const s = styleframe();
		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		useSpaceXUtility(s, { sm: "8px" }, [hover]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "space-x" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should handle reference values", () => {
		const s = styleframe();
		const spacingSm = s.variable("spacing.sm", "8px");
		useSpaceXUtility(s, { sm: s.ref(spacingSm) });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-x\:sm {`);
		expect(css).toContain("var(--spacing--sm)");
	});

	it("should return UtilityCreatorFn", () => {
		const s = styleframe();
		const creator = useSpaceXUtility(s, { sm: "8px" });

		expect(typeof creator).toBe("function");
	});
});

describe("useSpaceYUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSpaceYUtility(s, { sm: "8px", md: "16px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "space-y",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should generate nested selector with marginTop", () => {
		const s = styleframe();
		useSpaceYUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-y\:md {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("margin-top: 16px;");
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSpaceYUtility(s, { lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-y\:lg {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("margin-top: 24px;");
	});

	it("should handle 'default' key", () => {
		const s = styleframe();
		useSpaceYUtility(s, { default: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._space-y {");
	});
});

describe("useSpaceXReverseUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSpaceXReverseUtility(s, { sm: "8px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "space-x-reverse",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should generate nested selector with marginRight and marginLeft: 0", () => {
		const s = styleframe();
		useSpaceXReverseUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-x-reverse\:md {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("margin-right: 16px;");
		expect(css).toContain("margin-left: 0;");
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSpaceXReverseUtility(s, { lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-x-reverse\:lg {`);
		expect(css).toContain("margin-right: 24px;");
		expect(css).toContain("margin-left: 0;");
	});
});

describe("useSpaceYReverseUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useSpaceYReverseUtility(s, { sm: "8px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "space-y-reverse",
		);
		expect(utilities).toHaveLength(1);
	});

	it("should generate nested selector with marginBottom and marginTop: 0", () => {
		const s = styleframe();
		useSpaceYReverseUtility(s, { md: "16px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-y-reverse\:md {`);
		expect(css).toContain("& > * + *");
		expect(css).toContain("margin-bottom: 16px;");
		expect(css).toContain("margin-top: 0;");
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useSpaceYReverseUtility(s, { xl: "32px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._space-y-reverse\:xl {`);
		expect(css).toContain("margin-bottom: 32px;");
		expect(css).toContain("margin-top: 0;");
	});
});
