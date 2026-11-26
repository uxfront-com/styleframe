import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { usePaddingUtility } from "./usePaddingUtility";
import { useMarginUtility } from "./useMarginUtility";

describe("spacing utilities in recipes", () => {
	it("should resolve named spacing values in recipe base", () => {
		const s = styleframe();
		const spacingSm = s.variable("spacing.sm", "0.5rem");

		usePaddingUtility(s, { sm: s.ref(spacingSm) });

		const instance = s.recipe({
			name: "card",
			base: {
				padding: s.ref(spacingSm),
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			padding: "sm",
		});
	});

	it("should resolve named spacing values in recipe variants", () => {
		const s = styleframe();
		const spacingSm = s.variable("spacing.sm", "0.5rem");
		const spacingMd = s.variable("spacing.md", "1rem");
		const spacingLg = s.variable("spacing.lg", "1.5rem");

		usePaddingUtility(s, {
			sm: s.ref(spacingSm),
			md: s.ref(spacingMd),
			lg: s.ref(spacingLg),
		});

		const instance = s.recipe({
			name: "button",
			variants: {
				size: {
					sm: { padding: s.ref(spacingSm) },
					md: { padding: s.ref(spacingMd) },
					lg: { padding: s.ref(spacingLg) },
				},
			},
		});

		expect(instance._runtime?.variants).toEqual({
			size: {
				sm: { padding: "sm" },
				md: { padding: "md" },
				lg: { padding: "lg" },
			},
		});
	});

	it("should resolve multiplier values in recipes", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createPadding = usePaddingUtility(s);
		createPadding(["@1.5", "@2"]);

		const instance = s.recipe({
			name: "card",
			base: {
				padding: "@1.5",
			},
			variants: {
				size: {
					lg: { padding: "@2" },
				},
			},
		});

		expect(instance._runtime?.base).toEqual({
			padding: "1.5",
		});
		expect(instance._runtime?.variants).toEqual({
			size: {
				lg: { padding: "2" },
			},
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("padding: calc(var(--spacing, 1rem) * 1.5);");
		expect(css).toContain("padding: calc(var(--spacing, 1rem) * 2);");
	});

	it("should handle mixed named and multiplier values in the same recipe", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");
		const spacingSm = s.variable("spacing.sm", "0.5rem");
		const spacingMd = s.variable("spacing.md", "1rem");

		const createPadding = usePaddingUtility(s, {
			sm: s.ref(spacingSm),
			md: s.ref(spacingMd),
		});
		createPadding(["@1.5", "@2"]);

		const instance = s.recipe({
			name: "button",
			base: {
				padding: s.ref(spacingSm),
			},
			variants: {
				size: {
					sm: { padding: s.ref(spacingSm) },
					md: { padding: s.ref(spacingMd) },
					custom: { padding: "@1.5" },
					large: { padding: "@2" },
				},
			},
		});

		expect(instance._runtime?.base).toEqual({
			padding: "sm",
		});
		expect(instance._runtime?.variants).toEqual({
			size: {
				sm: { padding: "sm" },
				md: { padding: "md" },
				custom: { padding: "1.5" },
				large: { padding: "2" },
			},
		});

		const css = consumeCSS(s.root, s.options);
		// Named values
		expect(css).toContain(String.raw`._padding\:sm {`);
		expect(css).toContain("padding: var(--spacing--sm);");
		// Multiplier values
		expect(css).toContain(String.raw`._padding\:1\.5 {`);
		expect(css).toContain("padding: calc(var(--spacing, 1rem) * 1.5);");
	});

	it("should handle negative multiplier values in recipes", () => {
		const s = styleframe();
		s.variable("spacing", "1rem");

		const createMargin = useMarginUtility(s);
		createMargin(["@-0.5", "@-1"]);

		const instance = s.recipe({
			name: "pullLeft",
			base: {
				margin: "@-0.5",
			},
			variants: {
				amount: {
					sm: { margin: "@-0.5" },
					md: { margin: "@-1" },
				},
			},
		});

		expect(instance._runtime?.base).toEqual({
			margin: "-0.5",
		});
		expect(instance._runtime?.variants).toEqual({
			amount: {
				sm: { margin: "-0.5" },
				md: { margin: "-1" },
			},
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("margin: calc(var(--spacing, 1rem) * -0.5);");
		expect(css).toContain("margin: calc(var(--spacing, 1rem) * -1);");
	});
});
