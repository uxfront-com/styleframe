import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { createUseVariable } from "./createUseVariable";

describe("createUseVariable", () => {
	it("should create a composable for font-family property", () => {
		const useFontFamily = createUseVariable("font-family");
		const s = styleframe();
		const { fontFamily } = useFontFamily(s, {
			default: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
		});

		expect(fontFamily).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-family",
			value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
		});
	});

	it("should create a composable for line-height property", () => {
		const useLineHeight = createUseVariable("line-height");
		const s = styleframe();
		const { lineHeight } = useLineHeight(s, {
			default: "1.5",
		});

		expect(lineHeight).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "line-height",
			value: "1.5",
		});
	});

	it("should create a composable for custom property", () => {
		const useCustomProp = createUseVariable("custom-property");
		const s = styleframe();
		const { customProperty } = useCustomProp(s, {
			default: "value",
		});

		expect(customProperty).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "custom-property",
			value: "value",
		});
	});

	it("should create variable with modifier for non-default keys", () => {
		const useFontSize = createUseVariable("font-size");
		const s = styleframe();
		const { fontSizeLarge } = useFontSize(s, {
			large: "20px",
		});

		expect(fontSizeLarge).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-size.large",
			value: "20px",
		});
	});

	it("should create multiple variables", () => {
		const useSpacing = createUseVariable("spacing");
		const s = styleframe();
		const { spacing, spacingSmall, spacingLarge } = useSpacing(s, {
			default: "16px",
			small: "8px",
			large: "32px",
		});

		expect(spacing).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "spacing",
			value: "16px",
		});

		expect(spacingSmall).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "spacing.small",
			value: "8px",
		});

		expect(spacingLarge).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "spacing.large",
			value: "32px",
		});
	});

	it("should add variables to root", () => {
		const useBorderWidth = createUseVariable("border-width");
		const s = styleframe();
		useBorderWidth(s, {
			default: "1px",
			thick: "3px",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("border-width");
		expect(s.root.variables[1]?.name).toBe("border-width.thick");
	});

	it("should handle kebab-case token names", () => {
		const useColor = createUseVariable("color");
		const s = styleframe();
		const { colorPrimaryLight } = useColor(s, {
			"primary-light": "#3b82f6",
		});

		expect(colorPrimaryLight).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color.primary-light",
			value: "#3b82f6",
		});
	});

	it("should handle snake_case token names", () => {
		const useColor = createUseVariable("color");
		const s = styleframe();
		const { colorPrimaryDark } = useColor(s, {
			primary_dark: "#1e40af",
		});

		expect(colorPrimaryDark).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "color.primary_dark",
			value: "#1e40af",
		});
	});

	it("should handle numeric token names", () => {
		const useFontWeight = createUseVariable("font-weight");
		const s = styleframe();
		const { fontWeight400 } = useFontWeight(s, {
			"400": "400",
		});

		expect(fontWeight400).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "font-weight.400",
			value: "400",
		});
	});

	it("should handle empty token object", () => {
		const useMargin = createUseVariable("margin");
		const s = styleframe();
		const result = useMargin(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle variable references", () => {
		const useSize = createUseVariable("size");
		const s = styleframe();
		const baseSize = s.variable("base-size", "16px");
		const { size } = useSize(s, {
			default: s.ref(baseSize),
		});

		expect(size.value).toEqual({
			type: "reference",
			name: "base-size",
		});
	});

	it("should compile to correct CSS output", () => {
		const usePadding = createUseVariable("padding");
		const s = styleframe();
		usePadding(s, {
			default: "16px",
			small: "8px",
			large: "32px",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--padding: 16px;
	--padding--small: 8px;
	--padding--large: 32px;
}`);
	});

	describe("type safety", () => {
		it("should preserve exact variable names in return type", () => {
			const useMargin = createUseVariable("margin");
			const s = styleframe();
			const margins = useMargin(s, {
				default: "0",
				auto: "auto",
			});

			// Type assertions to verify the generic types are preserved
			const defaultMargin: Variable<"margin"> = margins.margin;
			const autoMargin: Variable<"margin.auto"> = margins.marginAuto;

			expect(defaultMargin.name).toBe("margin");
			expect(autoMargin.name).toBe("margin.auto");
		});

		it("should maintain type information for kebab-case names", () => {
			const useTransition = createUseVariable("transition");
			const s = styleframe();
			const { transitionFastEase } = useTransition(s, {
				"fast-ease": "200ms ease",
			});

			const typed: Variable<"transition.fast-ease"> = transitionFastEase;
			expect(typed.name).toBe("transition.fast-ease");
		});
	});

	describe("property name variations", () => {
		it("should work with single-word properties", () => {
			const useWidth = createUseVariable("width");
			const s = styleframe();
			const { width } = useWidth(s, { default: "100%" });

			expect(width.name).toBe("width");
		});

		it("should work with multi-word kebab-case properties", () => {
			const useBoxShadow = createUseVariable("box-shadow");
			const s = styleframe();
			const { boxShadow } = useBoxShadow(s, {
				default: "0 2px 4px rgba(0,0,0,0.1)",
			});

			expect(boxShadow.name).toBe("box-shadow");
		});

		it("should work with complex property names", () => {
			const useBorderTopLeftRadius = createUseVariable("border-top-left-radius");
			const s = styleframe();
			const { borderTopLeftRadius } = useBorderTopLeftRadius(s, {
				default: "4px",
			});

			expect(borderTopLeftRadius.name).toBe("border-top-left-radius");
		});
	});

	describe("propertyValueFn", () => {
		it("should transform values using propertyValueFn", () => {
			const useSize = createUseVariable("size", {
				transform: (value) => `${value}px`,
			});
			const s = styleframe();
			const { size, sizeLarge } = useSize(s, {
				default: "16",
				large: "32",
			});

			expect(size.value).toBe("16px");
			expect(sizeLarge.value).toBe("32px");
		});

		it("should transform string values to uppercase", () => {
			const useFont = createUseVariable("font", {
				transform: (value) => String(value).toUpperCase(),
			});
			const s = styleframe();
			const { font, fontBold } = useFont(s, {
				default: "arial",
				bold: "helvetica",
			});

			expect(font.value).toBe("ARIAL");
			expect(fontBold.value).toBe("HELVETICA");
		});

		it("should transform numeric values", () => {
			const useOpacity = createUseVariable("opacity", {
				transform: (value) => (typeof value === "number" ? value / 100 : value),
			});
			const s = styleframe();
			const { opacity, opacityHalf } = useOpacity(s, {
				default: 100,
				half: 50,
			});

			expect(opacity.value).toBe(1);
			expect(opacityHalf.value).toBe(0.5);
		});

		it("should wrap values in calc()", () => {
			const useSpacing = createUseVariable("spacing", {
				transform: (value) => `calc(${value} * var(--scale))`,
			});
			const s = styleframe();
			const { spacing, spacingDouble } = useSpacing(s, {
				default: "1rem",
				double: "2rem",
			});

			expect(spacing.value).toBe("calc(1rem * var(--scale))");
			expect(spacingDouble.value).toBe("calc(2rem * var(--scale))");
		});

		it("should add units to unitless values", () => {
			const usePadding = createUseVariable("padding", {
				transform: (value) => {
					if (typeof value === "number" || /^\d+$/.test(String(value))) {
						return `${value}px`;
					}
					return value;
				},
			});
			const s = styleframe();
			const { padding, paddingSmall } = usePadding(s, {
				default: "16",
				small: 8,
			});

			expect(padding.value).toBe("16px");
			expect(paddingSmall.value).toBe("8px");
		});

		it("should handle variable references in transformer", () => {
			const useColor = createUseVariable("color", {
				transform: (value) => {
					if (typeof value === "object" && value !== null && "type" in value) {
						return value; // Pass through variable references
					}
					return `rgb(${value})`;
				},
			});
			const s = styleframe();
			const baseColor = s.variable("base-color", "255, 0, 0");
			const { color, colorCustom } = useColor(s, {
				default: s.ref(baseColor),
				custom: "0, 255, 0",
			});

			expect(color.value).toEqual({
				type: "reference",
				name: "base-color",
			});
			expect(colorCustom.value).toBe("rgb(0, 255, 0)");
		});

		it("should preserve complex values through transformer", () => {
			const useShadow = createUseVariable("shadow", {
				transform: (value) => {
					if (String(value).includes("rgba")) {
						return value;
					}
					return `0 2px 4px ${value}`;
				},
			});
			const s = styleframe();
			const { shadow, shadowCustom } = useShadow(s, {
				default: "rgba(0, 0, 0, 0.1)",
				custom: "red",
			});

			expect(shadow.value).toBe("rgba(0, 0, 0, 0.1)");
			expect(shadowCustom.value).toBe("0 2px 4px red");
		});

		it("should compile transformed values to CSS correctly", () => {
			const useMargin = createUseVariable("margin", {
				transform: (value) => `${value}rem`,
			});
			const s = styleframe();
			useMargin(s, {
				default: "1",
				large: "2",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toBe(`:root {
	--margin: 1rem;
	--margin--large: 2rem;
}`);
		});

		it("should use default identity function when not provided", () => {
			const useWidth = createUseVariable("width");
			const s = styleframe();
			const { width } = useWidth(s, {
				default: "100%",
			});

			expect(width.value).toBe("100%");
		});

		it("should transform all tokens consistently", () => {
			const useRounded = createUseVariable("border-radius", {
				transform: (value) => (value === "full" ? "9999px" : value),
			});
			const s = styleframe();
			const { borderRadius, borderRadiusSmall, borderRadiusMedium, borderRadiusFull } = useRounded(
				s,
				{
					default: "0",
					small: "4px",
					medium: "8px",
					full: "full",
				},
			);

			expect(borderRadius.value).toBe("0");
			expect(borderRadiusSmall.value).toBe("4px");
			expect(borderRadiusMedium.value).toBe("8px");
			expect(borderRadiusFull.value).toBe("9999px");
		});
	});

	describe("defaults option", () => {
		it("should use defaults when no tokens are provided", () => {
			const useColor = createUseVariable("color", {
				defaults: {
					default: "#000000",
					primary: "#3b82f6",
					secondary: "#8b5cf6",
				},
			});
			const s = styleframe();
			const { color, colorPrimary, colorSecondary } = useColor(s);

			expect(color.value).toBe("#000000");
			expect(colorPrimary.value).toBe("#3b82f6");
			expect(colorSecondary.value).toBe("#8b5cf6");
		});

		it("should override defaults when tokens are provided", () => {
			const useColor = createUseVariable("color", {
				defaults: {
					default: "#000000",
					primary: "#3b82f6",
				},
			});
			const s = styleframe();
			const { color, colorPrimary } = useColor(s, {
				default: "#ffffff",
				primary: "#ef4444",
			});

			expect(color.value).toBe("#ffffff");
			expect(colorPrimary.value).toBe("#ef4444");
		});

		it("should work with transform function", () => {
			const useSize = createUseVariable("size", {
				defaults: {
					default: "16",
					large: "32",
				},
				transform: (value) => `${value}px`,
			});
			const s = styleframe();
			const { size, sizeLarge } = useSize(s);

			expect(size.value).toBe("16px");
			expect(sizeLarge.value).toBe("32px");
		});
	});

	describe("mergeDefaults option", () => {
		it("should merge defaults with tokens when mergeDefaults is true", () => {
			const useColor = createUseVariable("color", {
				defaults: {
					default: "#000000",
					primary: "#3b82f6",
					secondary: "#8b5cf6",
				},
				mergeDefaults: true,
			});
			const s = styleframe();
			const { color, colorPrimary, colorSecondary, colorTertiary } = useColor(s, {
				primary: "#ef4444",
				tertiary: "#f59e0b",
			});

			expect(color.value).toBe("#000000"); // from defaults
			expect(colorPrimary.value).toBe("#ef4444"); // overridden
			expect(colorSecondary.value).toBe("#8b5cf6"); // from defaults
			expect(colorTertiary.value).toBe("#f59e0b"); // new token
		});

		it("should not merge when mergeDefaults is false", () => {
			const useColor = createUseVariable("color", {
				defaults: {
					default: "#000000",
					primary: "#3b82f6",
				},
				mergeDefaults: false,
			});
			const s = styleframe();
			const result = useColor(s, {
				custom: "#ff0000",
			});

			expect(result.colorCustom?.value).toBe("#ff0000");

			// @ts-expect-error color key should not be present
			expect(result.color).toBeUndefined();
			// @ts-expect-error colorPrimary key should not be present
			expect(result.colorPrimary).toBeUndefined();
		});

		it("should merge with empty tokens object", () => {
			const useSpacing = createUseVariable("spacing", {
				defaults: {
					default: "16px",
					small: "8px",
				},
				mergeDefaults: true,
			});
			const s = styleframe();
			const { spacing, spacingSmall } = useSpacing(s, {});

			expect(spacing.value).toBe("16px");
			expect(spacingSmall.value).toBe("8px");
		});

		it("should merge and apply transform function", () => {
			const useSize = createUseVariable("size", {
				defaults: {
					small: "8",
					medium: "16",
				},
				mergeDefaults: true,
				transform: (value) => `${value}px`,
			});
			const s = styleframe();
			const { sizeSmall, sizeMedium, sizeLarge } = useSize(s, {
				large: "32",
			});

			expect(sizeSmall.value).toBe("8px");
			expect(sizeMedium.value).toBe("16px");
			expect(sizeLarge.value).toBe("32px");
		});
	});

	describe("key reference values (@)", () => {
		it("should resolve key references with @ syntax", () => {
			const useColor = createUseVariable("color");
			const s = styleframe();
			const { color, colorPrimary, colorHover } = useColor(s, {
				default: "#3b82f6",
				primary: "@color",
				hover: "@color.primary",
			});

			expect(color.value).toBe("#3b82f6");
			expect(colorPrimary.value).toEqual({
				type: "reference",
				name: "color",
			});
			expect(colorHover.value).toEqual({
				type: "reference",
				name: "color.primary",
			});
		});

		it("should resolve nested key references", () => {
			const useSize = createUseVariable("size");
			const s = styleframe();
			const { size, sizeMedium, sizeLarge } = useSize(s, {
				default: "16px",
				medium: "@size",
				large: "@size.medium",
			});

			expect(size.value).toBe("16px");
			expect(sizeMedium.value).toEqual({
				type: "reference",
				name: "size",
			});
			expect(sizeLarge.value).toEqual({
				type: "reference",
				name: "size.medium",
			});
		});

		it("should compile key references to CSS correctly", () => {
			const useSpacing = createUseVariable("spacing");
			const s = styleframe();
			useSpacing(s, {
				default: "16px",
				small: "8px",
				medium: "@spacing",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toBe(`:root {
	--spacing: 16px;
	--spacing--small: 8px;
	--spacing--medium: var(--spacing);
}`);
		});

		it("should handle key references with transform function", () => {
			const useSize = createUseVariable("size", {
				transform: (value) => {
					if (typeof value === "object" && value !== null && "type" in value) {
						return value; // Pass through references
					}
					return `${value}px`;
				},
			});
			const s = styleframe();
			const { size, sizeLarge } = useSize(s, {
				default: "16",
				large: "@size",
			});

			expect(size.value).toBe("16px");
			expect(sizeLarge.value).toEqual({
				type: "reference",
				name: "size",
			});
		});

		it("should sort key references to be processed last when default key exists", () => {
			const useColor = createUseVariable("color");
			const s = styleframe();
			useColor(s, {
				primary: "@color",
				default: "#3b82f6",
				secondary: "@color.primary",
				tertiary: "#8b5cf6",
			});

			// Verify all variables were created
			expect(s.root.variables).toHaveLength(4);

			// Verify the default variable exists first
			const defaultVar = s.root.variables.find((v) => v.name === "color");
			expect(defaultVar?.value).toBe("#3b82f6");

			// Verify references point to correct variables
			const primaryVar = s.root.variables.find((v) => v.name === "color.primary");
			expect(primaryVar?.value).toEqual({
				type: "reference",
				name: "color",
			});
		});

		it("should sort key references to be processed last even without default key", () => {
			const useColor = createUseVariable("color");
			const s = styleframe();
			useColor(s, {
				accent: "@color.primary",
				primary: "#3b82f6",
				secondary: "#8b5cf6",
				hover: "@color.secondary",
			});

			// Verify all variables were created
			expect(s.root.variables).toHaveLength(4);

			// Non-reference variables should be created before references
			const primaryVar = s.root.variables.find((v) => v.name === "color.primary");
			expect(primaryVar?.value).toBe("#3b82f6");

			const accentVar = s.root.variables.find((v) => v.name === "color.accent");
			expect(accentVar?.value).toEqual({
				type: "reference",
				name: "color.primary",
			});

			const hoverVar = s.root.variables.find((v) => v.name === "color.hover");
			expect(hoverVar?.value).toEqual({
				type: "reference",
				name: "color.secondary",
			});
		});

		it("should work with key references in defaults", () => {
			const useColor = createUseVariable("color", {
				defaults: {
					default: "#3b82f6",
					primary: "@color",
					hover: "@color.primary",
				},
			});
			const s = styleframe();
			const { color, colorPrimary, colorHover } = useColor(s);

			expect(color.value).toBe("#3b82f6");
			expect(colorPrimary.value).toEqual({
				type: "reference",
				name: "color",
			});
			expect(colorHover.value).toEqual({
				type: "reference",
				name: "color.primary",
			});
		});

		it("should merge defaults and tokens with key references", () => {
			const useColor = createUseVariable("color", {
				defaults: {
					default: "#3b82f6",
					primary: "@color",
				},
				mergeDefaults: true,
			});
			const s = styleframe();
			const { color, colorPrimary, colorSecondary } = useColor(s, {
				secondary: "@color.primary",
			});

			expect(color.value).toBe("#3b82f6");
			expect(colorPrimary.value).toEqual({
				type: "reference",
				name: "color",
			});
			expect(colorSecondary.value).toEqual({
				type: "reference",
				name: "color.primary",
			});
		});

		it("should reference non-default keys", () => {
			const useColor = createUseVariable("color");
			const s = styleframe();
			const { colorPrimary, colorSecondary, colorAccent } = useColor(s, {
				primary: "#3b82f6",
				secondary: "#8b5cf6",
				accent: "@color.secondary",
			});

			expect(colorPrimary.value).toBe("#3b82f6");
			expect(colorSecondary.value).toBe("#8b5cf6");
			expect(colorAccent.value).toEqual({
				type: "reference",
				name: "color.secondary",
			});
		});
	});

	describe("fluid option", () => {
		it("should pass tuple values through useFluidClamp", () => {
			const useSize = createUseVariable("size", { fluid: true });
			const s = styleframe();
			const { size } = useSize(s, {
				default: [16, 18],
			});

			expect(size.value).toEqual(expect.objectContaining({ type: "css" }));

			const css = consumeCSS(size, s.options);
			expect(css).toEqual("--size: calc((16 / 16 * 1rem) + (18 - 16) * var(--fluid--breakpoint));");
		});

		it("should pass object-form ranges through useFluidClamp", () => {
			const useSize = createUseVariable("size", { fluid: true });
			const s = styleframe();
			const { size } = useSize(s, {
				default: { min: 16, max: 18 },
			});

			expect(size.value).toEqual(expect.objectContaining({ type: "css" }));
		});

		it("should keep plain TokenValue values as-is", () => {
			const useSize = createUseVariable("size", { fluid: true });
			const s = styleframe();
			const { sizeSmall } = useSize(s, {
				small: "0.8rem",
			});

			expect(sizeSmall.value).toBe("0.8rem");
		});

		it("should mix fluid and fixed values in the same call", () => {
			const useSize = createUseVariable("size", { fluid: true });
			const s = styleframe();
			const { size, sizeSmall, sizeLarge } = useSize(s, {
				default: [16, 18],
				small: "0.8rem",
				large: { min: 24, max: 32 },
			});

			expect(size.value).toEqual(expect.objectContaining({ type: "css" }));
			expect(sizeSmall.value).toBe("0.8rem");
			expect(sizeLarge.value).toEqual(expect.objectContaining({ type: "css" }));
		});

		it("should accept a breakpoint override via options", () => {
			const useSize = createUseVariable("size", { fluid: true });
			const s = styleframe();
			const customBp = s.variable("custom-bp", "75vw");
			const { size } = useSize(s, { default: [16, 18] }, { breakpoint: customBp });

			const css = consumeCSS(size, s.options);
			expect(css).toEqual("--size: calc((16 / 16 * 1rem) + (18 - 16) * var(--custom-bp));");
		});

		it("should still short-circuit @-prefixed reference strings", () => {
			const useSize = createUseVariable("size", { fluid: true });
			const s = styleframe();
			const { size, sizeAlias } = useSize(s, {
				default: [16, 18],
				alias: "@size",
			});

			expect(size.value).toEqual(expect.objectContaining({ type: "css" }));
			expect(sizeAlias.value).toEqual({
				type: "reference",
				name: "size",
			});
		});

		it("should not affect non-fluid composables", () => {
			const useSize = createUseVariable("size");
			const s = styleframe();
			const { sizeSmall } = useSize(s, {
				small: "0.8rem",
			});
			expect(sizeSmall.value).toBe("0.8rem");
			// font-size--min/max are not auto-emitted in non-fluid mode
			expect(s.root.variables.some((v) => v.name === "size.min")).toBe(false);
		});
	});

	describe("delimiter option", () => {
		it("should use custom delimiter", () => {
			const useColor = createUseVariable("color", {
				delimiter: "_",
			});
			const s = styleframe();
			const { color, colorPrimary } = useColor(s, {
				default: "#000000",
				primary: "#3b82f6",
			});

			expect(color.name).toBe("color");
			expect(colorPrimary.name).toBe("color_primary");
		});

		it("should compile with dot delimiter", () => {
			const useSpacing = createUseVariable("spacing", {
				delimiter: ".",
			});
			const s = styleframe();
			const { spacing, spacingPrimary } = useSpacing(s, {
				default: "16px",
				primary: "8px",
			});

			expect(spacing.name).toBe("spacing");
			expect(spacingPrimary.name).toBe("spacing.primary");
		});

		it("should compile with custom delimiter", () => {
			const useSpacing = createUseVariable("spacing", {
				delimiter: ".",
			});
			const s = styleframe();
			useSpacing(s, {
				default: "16px",
				small: "8px",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toBe(`:root {
	--spacing: 16px;
	--spacing--small: 8px;
}`);
		});
	});

	describe("real-world use cases", () => {
		it("should replicate useFontFamily behavior", () => {
			const useFontFamily = createUseVariable("font-family");
			const s = styleframe();
			const { fontFamily, fontFamilyMono, fontFamilySerif } = useFontFamily(s, {
				default: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
				mono: "'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
				serif: "'Georgia', 'Times New Roman', Times, serif",
			});

			expect(fontFamily.name).toBe("font-family");
			expect(fontFamilyMono.name).toBe("font-family.mono");
			expect(fontFamilySerif.name).toBe("font-family.serif");
		});

		it("should work for spacing scale", () => {
			const useSpacing = createUseVariable("spacing");
			const s = styleframe();
			const { spacing, spacingXs, spacingSm, spacingMd, spacingLg, spacingXl } = useSpacing(s, {
				default: "16px",
				xs: "4px",
				sm: "8px",
				md: "16px",
				lg: "24px",
				xl: "32px",
			});

			expect(spacing.value).toBe("16px");
			expect(spacingXs.value).toBe("4px");
			expect(spacingSm.value).toBe("8px");
			expect(spacingMd.value).toBe("16px");
			expect(spacingLg.value).toBe("24px");
			expect(spacingXl.value).toBe("32px");
		});

		it("should work for z-index scale", () => {
			const useZIndex = createUseVariable("z-index");
			const s = styleframe();
			const { zIndexDropdown, zIndexModal, zIndexTooltip } = useZIndex(s, {
				dropdown: "1000",
				modal: "2000",
				tooltip: "3000",
			});

			expect(zIndexDropdown.name).toBe("z-index.dropdown");
			expect(zIndexModal.name).toBe("z-index.modal");
			expect(zIndexTooltip.name).toBe("z-index.tooltip");
		});

		it("should create semantic color system with references", () => {
			const useColor = createUseVariable("color", {
				defaults: {
					blue: "#3b82f6",
					red: "#ef4444",
					primary: "@color.blue",
					error: "@color.red",
					link: "@color.primary",
					alert: "@color.error",
				},
			});
			const s = styleframe();
			const { colorBlue, colorRed, colorPrimary, colorError, colorLink, colorAlert } = useColor(s);

			expect(colorBlue.value).toBe("#3b82f6");
			expect(colorRed.value).toBe("#ef4444");
			expect(colorPrimary.value).toEqual({
				type: "reference",
				name: "color.blue",
			});
			expect(colorError.value).toEqual({
				type: "reference",
				name: "color.red",
			});
			expect(colorLink.value).toEqual({
				type: "reference",
				name: "color.primary",
			});
			expect(colorAlert.value).toEqual({
				type: "reference",
				name: "color.error",
			});
		});

		it("should create a design system with defaults and overrides", () => {
			const useSpacing = createUseVariable("spacing", {
				defaults: {
					xs: "4px",
					sm: "8px",
					md: "16px",
					lg: "24px",
					xl: "32px",
					default: "@spacing.md",
				},
				mergeDefaults: true,
			});
			const s = styleframe();
			const { spacing, spacingXs, spacingSm, spacingMd, spacingCustom } = useSpacing(s, {
				custom: "20px",
			});

			// All defaults should be present
			expect(spacingXs.value).toBe("4px");
			expect(spacingSm.value).toBe("8px");
			expect(spacingMd.value).toBe("16px");

			// Default should reference md
			expect(spacing.value).toEqual({
				type: "reference",
				name: "spacing.md",
			});

			// Custom should be added
			expect(spacingCustom.value).toBe("20px");
		});

		it("should work with transform and key references together", () => {
			const useDuration = createUseVariable("duration", {
				defaults: {
					fast: "150",
					normal: "300",
					slow: "500",
					default: "@duration.normal",
				},
				transform: (value) => {
					// Don't transform references
					if (typeof value === "object" && value !== null && "type" in value) {
						return value;
					}
					return `${value}ms`;
				},
			});
			const s = styleframe();
			const { duration, durationFast, durationNormal, durationSlow } = useDuration(s);

			expect(durationFast.value).toBe("150ms");
			expect(durationNormal.value).toBe("300ms");
			expect(durationSlow.value).toBe("500ms");
			expect(duration.value).toEqual({
				type: "reference",
				name: "duration.normal",
			});
		});
	});
});
