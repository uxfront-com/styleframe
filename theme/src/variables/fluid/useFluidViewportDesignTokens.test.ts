import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFluidViewportDesignTokens } from "./useFluidViewportDesignTokens";

describe("useFluidViewportDesignTokens", () => {
	it("should create fluid variables with default values", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth, fluidScreen, fluidBreakpoint } =
			useFluidViewportDesignTokens(s);

		expect(fluidMinWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.min-width",
			value: 320,
		});

		expect(fluidMaxWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.max-width",
			value: 1440,
		});

		expect(fluidScreen).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.screen",
			value: "100vw",
		});

		expect(fluidBreakpoint).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.breakpoint",
			value: {
				type: "css",
				value: [
					"calc((",
					{
						type: "reference",
						name: "fluid.screen",
						fallback: undefined,
					},
					" - ",
					{
						type: "reference",
						name: "fluid.min-width",
						fallback: undefined,
					},
					" / 16 * 1rem) / (",
					{
						type: "reference",
						name: "fluid.max-width",
						fallback: undefined,
					},
					" - ",
					{
						type: "reference",
						name: "fluid.min-width",
						fallback: undefined,
					},
					"))",
				],
			},
		});
	});

	it("should create fluid variables with custom minWidth", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			minWidth: 480,
		});

		expect(fluidMinWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.min-width",
			value: 480,
		});

		expect(fluidMaxWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.max-width",
			value: 1440,
		});
	});

	it("should create fluid variables with custom maxWidth", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			maxWidth: 1920,
		});

		expect(fluidMinWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.min-width",
			value: 320,
		});

		expect(fluidMaxWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.max-width",
			value: 1920,
		});
	});

	it("should create fluid variables with both custom minWidth and maxWidth", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			minWidth: 768,
			maxWidth: 1280,
		});

		expect(fluidMinWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.min-width",
			value: 768,
		});

		expect(fluidMaxWidth).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "fluid.max-width",
			value: 1280,
		});
	});

	it("should handle string values for minWidth and maxWidth", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			minWidth: "20rem",
			maxWidth: "90rem",
		});

		expect(fluidMinWidth.value).toBe("20rem");
		expect(fluidMaxWidth.value).toBe("90rem");
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s);

		expect(s.root.variables).toHaveLength(4);
		expect(s.root.variables[0]?.name).toBe("fluid.min-width");
		expect(s.root.variables[1]?.name).toBe("fluid.max-width");
		expect(s.root.variables[2]?.name).toBe("fluid.screen");
		expect(s.root.variables[3]?.name).toBe("fluid.breakpoint");
	});

	it("should register a media query that locks fluid.screen at maxWidth", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s);

		const lockMedia = s.root.children.find(
			(child) =>
				child.type === "at-rule" &&
				child.identifier === "media" &&
				child.rule === "screen and (min-width: 1440px)",
		);

		expect(lockMedia).toMatchObject({
			type: "at-rule",
			identifier: "media",
			rule: "screen and (min-width: 1440px)",
			children: [
				{
					type: "selector",
					query: ":root",
					variables: [
						{
							type: "variable",
							name: "fluid.screen",
							value: {
								type: "css",
								value: [
									"calc(",
									{
										type: "reference",
										name: "fluid.max-width",
										fallback: undefined,
									},
									" * 1px)",
								],
							},
						},
					],
				},
			],
		});
	});

	it("should derive lock breakpoint from custom maxWidth", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s, { maxWidth: 1920 });

		const lockMedia = s.root.children.find(
			(child) => child.type === "at-rule" && child.identifier === "media",
		);

		expect(lockMedia).toMatchObject({
			rule: "screen and (min-width: 1920px)",
		});
	});

	it("should pass through string maxWidth to lock breakpoint", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s, { maxWidth: "90rem" });

		const lockMedia = s.root.children.find(
			(child) => child.type === "at-rule" && child.identifier === "media",
		);

		expect(lockMedia).toMatchObject({
			rule: "screen and (min-width: 90rem)",
		});
	});

	it("should create fluidBreakpoint with references to other fluid variables", () => {
		const s = styleframe();
		const { fluidBreakpoint } = useFluidViewportDesignTokens(s);

		const css = consumeCSS(fluidBreakpoint, s.options);
		expect(css).toEqual(
			"--fluid--breakpoint: calc((var(--fluid--screen) - var(--fluid--min-width) / 16 * 1rem) / (var(--fluid--max-width) - var(--fluid--min-width)));",
		);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s);

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--fluid--min-width: 320;
	--fluid--max-width: 1440;
	--fluid--screen: 100vw;
	--fluid--breakpoint: calc((var(--fluid--screen) - var(--fluid--min-width) / 16 * 1rem) / (var(--fluid--max-width) - var(--fluid--min-width)));
}

@media screen and (min-width: 1440px) {
	:root {
		--fluid--screen: calc(var(--fluid--max-width) * 1px);
	}
}`);
	});

	it("should compile to correct CSS with custom values", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s, {
			minWidth: 768,
			maxWidth: 1280,
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--fluid--min-width: 768;
	--fluid--max-width: 1280;
	--fluid--screen: 100vw;
	--fluid--breakpoint: calc((var(--fluid--screen) - var(--fluid--min-width) / 16 * 1rem) / (var(--fluid--max-width) - var(--fluid--min-width)));
}

@media screen and (min-width: 1280px) {
	:root {
		--fluid--screen: calc(var(--fluid--max-width) * 1px);
	}
}`);
	});

	it("should handle pixel string values", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			minWidth: "320px",
			maxWidth: "1440px",
		});

		expect(fluidMinWidth.value).toBe("320px");
		expect(fluidMaxWidth.value).toBe("1440px");
	});

	it("should handle rem string values", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			minWidth: "20rem",
			maxWidth: "90rem",
		});

		expect(fluidMinWidth.value).toBe("20rem");
		expect(fluidMaxWidth.value).toBe("90rem");
	});

	it("should handle variable references", () => {
		const s = styleframe();
		const customMinWidth = s.variable("custom-min", 400);
		const customMaxWidth = s.variable("custom-max", 1600);

		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			minWidth: s.ref(customMinWidth),
			maxWidth: s.ref(customMaxWidth),
		});

		expect(fluidMinWidth.value).toEqual({
			type: "reference",
			name: "custom-min",
			fallback: undefined,
		});

		expect(fluidMaxWidth.value).toEqual({
			type: "reference",
			name: "custom-max",
			fallback: undefined,
		});
	});

	it("should create variables with default flag set to true", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth, fluidScreen, fluidBreakpoint } =
			useFluidViewportDesignTokens(s);

		// Variables created with default: true should be added to root
		expect(s.root.variables).toContain(fluidMinWidth);
		expect(s.root.variables).toContain(fluidMaxWidth);
		expect(s.root.variables).toContain(fluidScreen);
		expect(s.root.variables).toContain(fluidBreakpoint);
	});

	it("should handle edge case with same minWidth and maxWidth", () => {
		const s = styleframe();
		const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			minWidth: 1024,
			maxWidth: 1024,
		});

		expect(fluidMinWidth.value).toBe(1024);
		expect(fluidMaxWidth.value).toBe(1024);
	});

	it("should handle very small viewport widths", () => {
		const s = styleframe();
		const { fluidMinWidth } = useFluidViewportDesignTokens(s, {
			minWidth: 240,
		});

		expect(fluidMinWidth.value).toBe(240);
	});

	it("should handle very large viewport widths", () => {
		const s = styleframe();
		const { fluidMaxWidth } = useFluidViewportDesignTokens(s, {
			maxWidth: 2560,
		});

		expect(fluidMaxWidth.value).toBe(2560);
	});

	it("should return all four fluid variables", () => {
		const s = styleframe();
		const result = useFluidViewportDesignTokens(s);

		expect(Object.keys(result)).toEqual([
			"fluidMinWidth",
			"fluidMaxWidth",
			"fluidScreen",
			"fluidBreakpoint",
		]);
	});

	describe("type safety", () => {
		it("should preserve exact variable names in return type", () => {
			const s = styleframe();
			const { fluidMinWidth, fluidMaxWidth, fluidScreen, fluidBreakpoint } =
				useFluidViewportDesignTokens(s);

			// Type assertions to verify the generic types are preserved
			const minWidth: Variable<"fluid.min-width"> = fluidMinWidth;
			const maxWidth: Variable<"fluid.max-width"> = fluidMaxWidth;
			const screen: Variable<"fluid.screen"> = fluidScreen;
			const breakpoint: Variable<"fluid.breakpoint"> = fluidBreakpoint;

			expect(minWidth.name).toBe("fluid.min-width");
			expect(maxWidth.name).toBe("fluid.max-width");
			expect(screen.name).toBe("fluid.screen");
			expect(breakpoint.name).toBe("fluid.breakpoint");
		});

		it("should work with const assertion for options", () => {
			const s = styleframe();
			const options = {
				minWidth: 768,
				maxWidth: 1280,
			} as const;

			const { fluidMinWidth, fluidMaxWidth } = useFluidViewportDesignTokens(s, options);

			expect(fluidMinWidth.name).toBe("fluid.min-width");
			expect(fluidMaxWidth.name).toBe("fluid.max-width");
		});
	});

	describe("fluidBreakpoint calculation", () => {
		it("should include all required variables in the calc expression", () => {
			const s = styleframe();
			const { fluidBreakpoint } = useFluidViewportDesignTokens(s);

			const css = consumeCSS(fluidBreakpoint, s.options);

			// Verify the calc expression contains the expected structure
			expect(css).toEqual(
				"--fluid--breakpoint: calc((var(--fluid--screen) - var(--fluid--min-width) / 16 * 1rem) / (var(--fluid--max-width) - var(--fluid--min-width)));",
			);
		});

		it("should use correct formula structure", () => {
			const s = styleframe();
			const { fluidBreakpoint } = useFluidViewportDesignTokens(s, {
				minWidth: 768,
				maxWidth: 1280,
			});

			const css = consumeCSS(fluidBreakpoint, s.options);

			// The formula should be: (screen - minWidth / 16 * 1rem) / (maxWidth - minWidth)
			expect(css).toEqual(
				"--fluid--breakpoint: calc((var(--fluid--screen) - var(--fluid--min-width) / 16 * 1rem) / (var(--fluid--max-width) - var(--fluid--min-width)));",
			);
		});
	});
});
