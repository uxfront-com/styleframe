import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { createUseSpacingUtility } from "./createUseSpacingUtility";

describe("createUseSpacingUtility", () => {
	it("should return a function", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		expect(typeof useMargin).toBe("function");
	});

	it("should create a composable with multiplier support", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createMargin = useMargin(s);
		createMargin(["@1.5", "@2", "@-1"]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "margin",
		);
		expect(utilities).toHaveLength(3);
	});

	it("should generate correct calc CSS output for decimal multipliers", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createMargin = useMargin(s);
		createMargin(["@1.5"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:1\.5 {`);
		expect(css).toContain("margin: calc(var(--spacing, 1rem) * 1.5);");
	});

	it("should generate correct calc CSS output for integer multipliers", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createMargin = useMargin(s);
		createMargin(["@2"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:2 {`);
		expect(css).toContain("margin: calc(var(--spacing, 1rem) * 2);");
	});

	it("should generate correct calc CSS output for negative multipliers", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createMargin = useMargin(s);
		createMargin(["@-1"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:-1 {`);
		expect(css).toContain("margin: calc(var(--spacing, 1rem) * -1);");
	});

	it("should work with named values alongside multipliers", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		s.variable("spacing", "1rem");

		useMargin(s, { sm: "0.5rem", md: "1rem" });
		const createMargin = s.root.utilities[0]?.create;
		createMargin?.(["@1.5", "@2"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:sm {`);
		expect(css).toContain("margin: 0.5rem;");
		expect(css).toContain(String.raw`._margin\:1\.5 {`);
		expect(css).toContain("margin: calc(var(--spacing, 1rem) * 1.5);");
	});

	it("should allow custom base variable", () => {
		const useGap = createUseSpacingUtility("gap", ({ value }) => ({ gap: value }), {
			baseVariable: "gap-base",
		});
		const s = styleframe();
		s.variable("gap-base", "0.5rem");

		const createGap = useGap(s);
		createGap(["@2"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("gap: calc(var(--gap-base, 1rem) * 2);");
	});

	it("should handle Variable object as base variable without fallback", () => {
		const s = styleframe();
		const spacingVar = s.variable("my-spacing", "0.5rem");

		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({ margin: value }), {
			baseVariable: spacingVar,
		});

		const createMargin = useMargin(s);
		createMargin(["@1.5"]);

		const css = consumeCSS(s.root, s.options);
		// Variable objects don't need fallbacks since they're always defined
		expect(css).toContain("margin: calc(var(--my-spacing) * 1.5);");
		expect(css).not.toContain("margin: calc(var(--my-spacing, ");
	});

	it("should use fallback value when base variable is not defined", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({ margin: value }), {
			fallback: "0.5rem",
		});
		const s = styleframe();
		// Note: spacing variable is NOT defined

		const createMargin = useMargin(s);
		createMargin(["@2"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("margin: calc(var(--spacing, 0.5rem) * 2);");
	});

	it("should use default fallback of 1rem", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		// Note: spacing variable is NOT defined

		const createMargin = useMargin(s);
		createMargin(["@2"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("margin: calc(var(--spacing, 1rem) * 2);");
	});

	it("should fall back to default behavior for @ references", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		s.variable("spacing.sm", "0.5rem");

		const createMargin = useMargin(s);
		createMargin(["@spacing.sm"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:spacing\.sm {`);
		expect(css).toContain("margin: var(--spacing--sm);");
	});

	it("should fall back to default behavior for arbitrary values", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();

		const createMargin = useMargin(s);
		createMargin(["auto"]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:\[auto\] {`);
		expect(css).toContain("margin: auto;");
	});

	it("should support defaults option", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({ margin: value }), {
			defaults: { sm: "0.5rem", md: "1rem" },
		});
		const s = styleframe();

		useMargin(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:sm {`);
		expect(css).toContain(String.raw`._margin\:md {`);
	});

	it("should support mergeDefaults option", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({ margin: value }), {
			defaults: { sm: "0.5rem" },
			mergeDefaults: true,
		});
		const s = styleframe();

		useMargin(s, { lg: "1.5rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:sm {`);
		expect(css).toContain(String.raw`._margin\:lg {`);
	});

	it("should work with modifiers", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		s.variable("spacing", "1rem");

		const hover = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));

		const createMargin = useMargin(s, { sm: "0.5rem" }, [hover]);
		createMargin(["@1.5"], [hover]);

		const css = consumeCSS(s.root, s.options);
		// Base utilities
		expect(css).toContain(String.raw`._margin\:sm {`);
		expect(css).toContain(String.raw`._margin\:1\.5 {`);
		// Hover variants
		expect(css).toContain(String.raw`._hover\:margin\:sm {`);
		expect(css).toContain(String.raw`._hover\:margin\:1\.5 {`);
	});

	it("should return the utility creator function", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();

		const createMargin = useMargin(s);

		expect(typeof createMargin).toBe("function");
	});

	it("should handle empty values object", () => {
		const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();

		useMargin(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	describe("utilityOptions.name override", () => {
		it("should override the utility name", () => {
			const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();
			s.variable("spacing", "1rem");

			useMargin(s, { sm: "0.5rem" }, undefined, { name: "m" });

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(String.raw`._m\:sm {`);
			expect(css).not.toContain("._margin");
		});

		it("should override the utility name for multiplier values", () => {
			const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();
			s.variable("spacing", "1rem");

			const createMargin = useMargin(s, undefined, undefined, { name: "m" });
			createMargin(["@1.5"]);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(String.raw`._m\:1\.5 {`);
			expect(css).not.toContain("._margin");
		});

		it("should use default name when no override provided", () => {
			const useMargin = createUseSpacingUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();

			useMargin(s, { sm: "0.5rem" });

			expect(s.root.utilities[0]?.name).toBe("margin");
		});
	});
});
