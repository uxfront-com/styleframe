import type { Root, StyleframeOptions } from "@styleframe/core";
import {
	createCssFunction,
	createRefFunction,
	createRoot,
	createVariableFunction,
} from "@styleframe/core";

import { consume } from "./consume";
import { createCSSTemplateLiteralConsumer } from "./css";

describe("createCSSConsumer", () => {
	let root: Root;
	let css: ReturnType<typeof createCssFunction>;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;

	const consumeCSSTemplateLiteral = createCSSTemplateLiteralConsumer(consume);
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		css = createCssFunction(root, root);
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
	});

	it("should process a simple CSS value", () => {
		const cssValue = css`16px`;
		expect(consumeCSSTemplateLiteral(cssValue, options)).toBe("16px");
	});

	it("should handle CSS values with variable references", () => {
		const spacingVar = variable("spacing-md", "1rem");
		const paddingValue = css`
			${ref(spacingVar)} calc(${ref(spacingVar)} * 2)
		`;

		expect(consumeCSSTemplateLiteral(paddingValue, options)).toBe(
			"var(--spacing-md) calc(var(--spacing-md) * 2)",
		);
	});

	it("should handle empty CSS values", () => {
		const emptyCss = css``;
		expect(consumeCSSTemplateLiteral(emptyCss, options)).toBe("");
	});

	it("should respect prefix in options if provided", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--sf-${name}`,
			},
		};

		const colorVar = variable("color-primary", "#0066ff");
		const colorValue = css`
			${ref(colorVar)}
		`;

		expect(consumeCSSTemplateLiteral(colorValue, prefixOptions)).toBe("var(--sf-color-primary)");
	});

	it("should handle CSS values with numeric interpolations", () => {
		const zIndex = 100;
		const zIndexValue = css`
			${zIndex}
		`;

		expect(consumeCSSTemplateLiteral(zIndexValue, options)).toBe("100");
	});

	it("should handle CSS values with string interpolations", () => {
		const borderWidth = "2px";
		const borderStyle = "solid";
		const borderColor = "#000";
		const borderValue = css`
			${borderWidth} ${borderStyle} ${borderColor}
		`;

		expect(consumeCSSTemplateLiteral(borderValue, options)).toBe("2px solid #000");
	});

	it("should handle CSS values with array interpolations", () => {
		const gridAreas = ["header", "main", "footer"];
		const gridTemplateValue = css`"${gridAreas[0]}" "${gridAreas[1]}" "${gridAreas[2]}"`;

		expect(consumeCSSTemplateLiteral(gridTemplateValue, options)).toBe('"header" "main" "footer"');
	});

	it("should handle complex CSS values with multiple variable references", () => {
		const fontSize = variable("font-size-base", "16px");
		const lineHeight = variable("line-height-normal", "1.5");
		const fontFamily = variable("font-family-sans", "system-ui, sans-serif");

		const fontValue = css`
			${ref(fontSize)}/${ref(lineHeight)} ${ref(fontFamily)}
		`;

		expect(consumeCSSTemplateLiteral(fontValue, options)).toBe(
			"var(--font-size-base)/var(--line-height-normal) var(--font-family-sans)",
		);
	});

	it("should handle CSS values with calculations", () => {
		const spacing = variable("spacing", "8px");
		const calcValue = css`calc(100% - ${ref(spacing)} * 2)`;

		expect(consumeCSSTemplateLiteral(calcValue, options)).toBe("calc(100% - var(--spacing) * 2)");
	});

	it("should handle CSS values with color functions", () => {
		const primaryColor = variable("color-primary", "#006cff");
		const colorValue = css`rgba(${ref(primaryColor)}, 0.5)`;

		expect(consumeCSSTemplateLiteral(colorValue, options)).toBe("rgba(var(--color-primary), 0.5)");
	});

	it("should handle CSS values with gradient functions", () => {
		const primaryColor = variable("color-primary", "#006cff");
		const secondaryColor = variable("color-secondary", "#ff6b6b");

		const gradientValue = css`linear-gradient(135deg, ${ref(primaryColor)} 0%, ${ref(secondaryColor)} 100%)`;

		expect(consumeCSSTemplateLiteral(gradientValue, options)).toBe(
			"linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
		);
	});

	it("should handle CSS values with conditional interpolations", () => {
		const isLarge = true;
		const conditionalValue = css`
			${isLarge ? "2rem" : "1rem"}
		`;

		expect(consumeCSSTemplateLiteral(conditionalValue, options)).toBe("2rem");
	});

	it("should handle CSS values with fallback references", () => {
		const spacingValue = css`
			${ref("custom-spacing", "16px")}
		`;

		expect(consumeCSSTemplateLiteral(spacingValue, options)).toBe("var(--custom-spacing, 16px)");
	});

	it("should handle complex CSS values with multiple expressions", () => {
		const primary = variable("color-primary", "#006cff");
		const secondary = variable("color-secondary", "#ff6b6b");
		const spacing = variable("spacing", "8px");

		const complexValue = css`
			${ref(spacing)} solid ${ref(primary)},
			calc(${ref(spacing)} * 2) dashed ${ref(secondary)}
		`;

		// The function might normalize whitespace
		const result = consumeCSSTemplateLiteral(complexValue, options);
		expect(result).toContain("var(--spacing) solid var(--color-primary)");
		expect(result).toContain("calc(var(--spacing) * 2) dashed var(--color-secondary)");
	});

	it("should handle CSS values with nested expressions", () => {
		const baseSize = variable("size-base", "16px");
		const multiplier = 1.5;

		const nestedValue = css`calc(${ref(baseSize)} * ${multiplier})`;

		expect(consumeCSSTemplateLiteral(nestedValue, options)).toBe("calc(var(--size-base) * 1.5)");
	});
});
