import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBreakpointDesignTokens } from "./useBreakpointDesignTokens";

describe("useBreakpointDesignTokens", () => {
	it("should create a single breakpoint variable with 'default' key", () => {
		const s = styleframe();
		const { breakpoint } = useBreakpointDesignTokens(s, {
			default: 768,
		});

		expect(breakpoint).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint",
			value: 768,
		});

		const css = consumeCSS(breakpoint, s.options);
		expect(css).toBe(`--breakpoint: 768;`);
	});

	it("should create breakpoint variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { breakpointSm } = useBreakpointDesignTokens(s, {
			sm: 576,
		});

		expect(breakpointSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.sm",
			value: 576,
		});

		const css = consumeCSS(breakpointSm, s.options);
		expect(css).toBe(`--breakpoint--sm: 576;`);
	});

	it("should create multiple breakpoint variables", () => {
		const s = styleframe();
		const { breakpointXs, breakpointSm, breakpointMd, breakpointLg } = useBreakpointDesignTokens(
			s,
			{
				xs: 0,
				sm: 576,
				md: 768,
				lg: 992,
			},
		);

		expect(breakpointXs).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.xs",
			value: 0,
		});

		expect(breakpointSm).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.sm",
			value: 576,
		});

		expect(breakpointMd).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.md",
			value: 768,
		});

		expect(breakpointLg).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.lg",
			value: 992,
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useBreakpointDesignTokens(s, {
			sm: 576,
			md: 768,
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("breakpoint.sm");
		expect(s.root.variables[1]?.name).toBe("breakpoint.md");
	});

	it("should handle kebab-case breakpoint names", () => {
		const s = styleframe();
		const { breakpointExtraLarge } = useBreakpointDesignTokens(s, {
			"extra-large": 1440,
		});

		expect(breakpointExtraLarge).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.extra-large",
			value: 1440,
		});
	});

	it("should handle snake_case breakpoint names", () => {
		const s = styleframe();
		const { breakpointTabletPortrait } = useBreakpointDesignTokens(s, {
			tablet_portrait: 768,
		});

		expect(breakpointTabletPortrait).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.tablet_portrait",
			value: 768,
		});
	});

	it("should handle numeric breakpoint names", () => {
		const s = styleframe();
		const { breakpoint1024 } = useBreakpointDesignTokens(s, {
			"1024": 1024,
		});

		expect(breakpoint1024).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.1024",
			value: 1024,
		});
	});

	it("should handle numeric pixel values", () => {
		const s = styleframe();
		const { breakpointMd } = useBreakpointDesignTokens(s, {
			md: 768,
		});

		expect(breakpointMd).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.md",
			value: 768,
		});
	});

	it("should handle string pixel values", () => {
		const s = styleframe();
		const { breakpointLg } = useBreakpointDesignTokens(s, {
			lg: "992px",
		});

		expect(breakpointLg).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.lg",
			value: "992px",
		});
	});

	it("should handle em values", () => {
		const s = styleframe();
		const { breakpointBase } = useBreakpointDesignTokens(s, {
			base: "48em",
		});

		expect(breakpointBase).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.base",
			value: "48em",
		});
	});

	it("should handle rem values", () => {
		const s = styleframe();
		const { breakpointFluid } = useBreakpointDesignTokens(s, {
			fluid: "60rem",
		});

		expect(breakpointFluid).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.fluid",
			value: "60rem",
		});
	});

	it("should handle zero values", () => {
		const s = styleframe();
		const { breakpointXs } = useBreakpointDesignTokens(s, {
			xs: 0,
		});

		expect(breakpointXs).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "breakpoint.xs",
			value: 0,
		});
	});

	it("should handle viewport width units", () => {
		const s = styleframe();
		const { breakpointVw } = useBreakpointDesignTokens(s, {
			vw: "50vw",
		});

		expect(breakpointVw.value).toBe("50vw");
	});

	it("should handle calc() expressions", () => {
		const s = styleframe();
		const { breakpointDynamic } = useBreakpointDesignTokens(s, {
			dynamic: "calc(768px + 2rem)",
		});

		expect(breakpointDynamic.value).toBe("calc(768px + 2rem)");
	});

	it("should handle empty breakpoint object", () => {
		const s = styleframe();
		const result = useBreakpointDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle breakpoint references", () => {
		const s = styleframe();
		const baseBreakpoint = s.variable("base-breakpoint", 768);
		const { breakpoint } = useBreakpointDesignTokens(s, {
			default: s.ref(baseBreakpoint),
		});

		expect(breakpoint.value).toEqual({
			type: "reference",
			name: "base-breakpoint",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useBreakpointDesignTokens(s, {
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--breakpoint--xs: 0;
	--breakpoint--sm: 576;
	--breakpoint--md: 768;
	--breakpoint--lg: 992;
	--breakpoint--xl: 1200;
}`);
	});

	it("should handle a complete breakpoint scale", () => {
		const s = styleframe();
		const breakpoints = useBreakpointDesignTokens(s, {
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
			"2xl": 1440,
			"3xl": 1920,
		});

		expect(breakpoints.breakpointXs.value).toBe(0);
		expect(breakpoints.breakpointSm.value).toBe(576);
		expect(breakpoints.breakpointMd.value).toBe(768);
		expect(breakpoints.breakpointLg.value).toBe(992);
		expect(breakpoints.breakpointXl.value).toBe(1200);
		expect(breakpoints.breakpoint2xl.value).toBe(1440);
		expect(breakpoints.breakpoint3xl.value).toBe(1920);
	});

	it("should handle Bootstrap-style breakpoints", () => {
		const s = styleframe();
		const breakpoints = useBreakpointDesignTokens(s, {
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
			xxl: 1400,
		});

		expect(breakpoints.breakpointXs.value).toBe(0);
		expect(breakpoints.breakpointSm.value).toBe(576);
		expect(breakpoints.breakpointMd.value).toBe(768);
		expect(breakpoints.breakpointLg.value).toBe(992);
		expect(breakpoints.breakpointXl.value).toBe(1200);
		expect(breakpoints.breakpointXxl.value).toBe(1400);
	});

	it("should handle Tailwind-style breakpoints", () => {
		const s = styleframe();
		const breakpoints = useBreakpointDesignTokens(s, {
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			"2xl": 1536,
		});

		expect(breakpoints.breakpointSm.value).toBe(640);
		expect(breakpoints.breakpointMd.value).toBe(768);
		expect(breakpoints.breakpointLg.value).toBe(1024);
		expect(breakpoints.breakpointXl.value).toBe(1280);
		expect(breakpoints.breakpoint2xl.value).toBe(1536);
	});

	it("should handle semantic device-based breakpoints", () => {
		const s = styleframe();
		const breakpoints = useBreakpointDesignTokens(s, {
			mobile: 0,
			tablet: 768,
			desktop: 1024,
			wide: 1440,
		});

		expect(breakpoints.breakpointMobile.value).toBe(0);
		expect(breakpoints.breakpointTablet.value).toBe(768);
		expect(breakpoints.breakpointDesktop.value).toBe(1024);
		expect(breakpoints.breakpointWide.value).toBe(1440);
	});

	it("should handle Material Design breakpoints", () => {
		const s = styleframe();
		const breakpoints = useBreakpointDesignTokens(s, {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		});

		expect(breakpoints.breakpointXs.value).toBe(0);
		expect(breakpoints.breakpointSm.value).toBe(600);
		expect(breakpoints.breakpointMd.value).toBe(960);
		expect(breakpoints.breakpointLg.value).toBe(1280);
		expect(breakpoints.breakpointXl.value).toBe(1920);
	});

	describe("type safety", () => {
		it("should preserve exact breakpoint names in return type", () => {
			const s = styleframe();
			const breakpoints = useBreakpointDesignTokens(s, {
				sm: 576,
				md: 768,
			});

			// Type assertions to verify the generic types are preserved
			const smBreakpoint: Variable<"breakpoint.sm"> = breakpoints.breakpointSm;
			const mdBreakpoint: Variable<"breakpoint.md"> = breakpoints.breakpointMd;

			expect(smBreakpoint.name).toBe("breakpoint.sm");
			expect(mdBreakpoint.name).toBe("breakpoint.md");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const { breakpointExtraLarge } = useBreakpointDesignTokens(s, {
				"extra-large": 1440,
			});

			const typed: Variable<"breakpoint.extra-large"> = breakpointExtraLarge;
			expect(typed.name).toBe("breakpoint.extra-large");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const breakpointConfig = {
				sm: 576,
				md: 768,
			} as const;

			const breakpoints = useBreakpointDesignTokens(s, breakpointConfig);

			expect(breakpoints.breakpointSm.name).toBe("breakpoint.sm");
			expect(breakpoints.breakpointMd.name).toBe("breakpoint.md");
		});
	});

	describe("practical usage", () => {
		it("should work with media queries", () => {
			const s = styleframe();
			const { breakpointMd, breakpointLg } = useBreakpointDesignTokens(s, {
				md: 768,
				lg: 992,
			});

			s.selector(`@media (min-width: ${breakpointMd.value}px)`, ({ selector }) => {
				selector(".container", {
					maxWidth: "720px",
				});
			});

			s.selector(`@media (min-width: ${breakpointLg.value}px)`, ({ selector }) => {
				selector(".container", {
					maxWidth: "960px",
				});
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--breakpoint--md: 768;");
			expect(css).toContain("--breakpoint--lg: 992;");
			expect(css).toContain("@media (min-width: 768px)");
			expect(css).toContain("@media (min-width: 992px)");
		});

		it("should support container queries", () => {
			const s = styleframe();
			const { breakpointSm } = useBreakpointDesignTokens(s, {
				sm: 576,
			});

			expect(breakpointSm.value).toBe(576);
			expect(breakpointSm.name).toBe("breakpoint.sm");
		});

		it("should handle ascending breakpoint order", () => {
			const s = styleframe();
			const breakpoints = useBreakpointDesignTokens(s, {
				xs: 0,
				sm: 576,
				md: 768,
				lg: 992,
				xl: 1200,
			});

			const values = [
				breakpoints.breakpointXs.value,
				breakpoints.breakpointSm.value,
				breakpoints.breakpointMd.value,
				breakpoints.breakpointLg.value,
				breakpoints.breakpointXl.value,
			];

			// Verify ascending order
			for (let i = 1; i < values.length; i++) {
				expect(Number(values[i])).toBeGreaterThan(Number(values[i - 1]));
			}
		});
	});
});
