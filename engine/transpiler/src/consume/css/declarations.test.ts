import type { DeclarationsBlock, StyleframeOptions } from "@styleframe/core";
import {
	createCssFunction,
	createRefFunction,
	createRoot,
	createVariableFunction,
} from "@styleframe/core";

import { consume } from "./consume";
import { createDeclarationsConsumer } from "./declarations";

describe("createDeclarationsConsumer", () => {
	let root: ReturnType<typeof createRoot>;
	let ref: ReturnType<typeof createRefFunction>;
	let variable: ReturnType<typeof createVariableFunction>;
	let css: ReturnType<typeof createCssFunction>;

	const consumeDeclarations = createDeclarationsConsumer(consume);
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		ref = createRefFunction(root, root);
		variable = createVariableFunction(root, root);
		css = createCssFunction(root, root);
	});

	it("should convert a simple declarations block to CSS declarations", () => {
		const declarations: DeclarationsBlock = {
			color: "#ff0000",
			fontSize: "16px",
			margin: "10px",
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["color: #ff0000;", "font-size: 16px;", "margin: 10px;"]);
	});

	it("should handle empty declarations block", () => {
		const declarations: DeclarationsBlock = {};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual([]);
	});

	it("should handle declarations with variable references", () => {
		const colorVar = variable("color-primary", "#006cff");
		const fontSizeVar = variable("font-size", "16px");

		const declarations: DeclarationsBlock = {
			color: ref(colorVar),
			fontSize: ref(fontSizeVar),
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["color: var(--color-primary);", "font-size: var(--font-size);"]);
	});

	it("should handle declarations with string references", () => {
		const declarations: DeclarationsBlock = {
			color: ref("color-primary"),
			fontSize: ref("font-size"),
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["color: var(--color-primary);", "font-size: var(--font-size);"]);
	});

	it("should handle declarations with references that have fallbacks", () => {
		const declarations: DeclarationsBlock = {
			color: ref("color-primary", "#006cff"),
			fontSize: ref("font-size", "16px"),
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual([
			"color: var(--color-primary, #006cff);",
			"font-size: var(--font-size, 16px);",
		]);
	});

	it("should handle declarations with CSS values", () => {
		const declarations: DeclarationsBlock = {
			boxShadow: css`0 2px 4px rgba(0, 0, 0, 0.1)`,
			transform: css`translate(10px, 20px)`,
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual([
			"box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);",
			"transform: translate(10px, 20px);",
		]);
	});

	it("should handle declarations with complex CSS values that include references", () => {
		const spacingVar = variable("spacing", "8px");

		const declarations: DeclarationsBlock = {
			padding: css`
				${ref(spacingVar)} calc(${ref(spacingVar)} * 2)
			`,
			margin: css`
				${ref("margin", "10px")} auto
			`,
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual([
			"padding: var(--spacing) calc(var(--spacing) * 2);",
			"margin: var(--margin, 10px) auto;",
		]);
	});

	it("should handle declarations with null or undefined values", () => {
		const declarations: DeclarationsBlock = {
			color: null,
			fontSize: undefined,
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["color: ;", "font-size: ;"]);
	});

	it("should handle declarations with numeric values", () => {
		const declarations: DeclarationsBlock = {
			zIndex: 100,
			opacity: 0.5,
			flex: 1,
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["z-index: 100;", "opacity: 0.5;", "flex: 1;"]);
	});

	it("should respect variable prefix in options if provided", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--sf-${name}`,
			},
		};

		const colorVar = variable("color-primary", "#006cff");

		const declarations: DeclarationsBlock = {
			color: ref(colorVar),
			backgroundColor: ref("color-secondary"),
		};

		const result = consumeDeclarations(declarations, prefixOptions);

		expect(result).toEqual([
			"color: var(--sf-color-primary);",
			"background-color: var(--sf-color-secondary);",
		]);
	});

	it("should handle declarations with boolean values", () => {
		const declarations: DeclarationsBlock = {
			// These would be converted to strings in CSS
			visible: true,
			disabled: false,
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["visible: true;", "disabled: false;"]);
	});

	it("should handle declarations with array values", () => {
		const declarations: DeclarationsBlock = {
			fontFamily: ["Helvetica", "Arial", "sans-serif"],
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["font-family: Helvetica,Arial,sans-serif;"]);
	});

	it("should handle custom property names", () => {
		const declarations: DeclarationsBlock = {
			"--customProperty": "value",
			"--another-custom": 42,
		};

		const result = consumeDeclarations(declarations, options);

		expect(result).toEqual(["--customProperty: value;", "--another-custom: 42;"]);
	});
});
