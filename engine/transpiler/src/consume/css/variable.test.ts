import type { Root, StyleframeOptions } from "@styleframe/core";
import { createRefFunction, createRoot, createVariableFunction } from "@styleframe/core";

import { consume } from "./consume";
import { createVariableConsumer } from "./variable";

describe("createVariableConsumer", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;

	const consumeVariable = createVariableConsumer(consume);
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
	});

	it("should convert a basic variable to CSS variable declaration", () => {
		const colorVar = variable("color-primary", "#006cff");
		const result = consumeVariable(colorVar, options);

		expect(result).toBe("--color-primary: #006cff;");
	});

	it("should handle variable with dashed names", () => {
		const spacingVar = variable("spacing--md", "1rem");
		const result = consumeVariable(spacingVar, options);

		expect(result).toBe("--spacing--md: 1rem;");
	});

	it("should convert variable with numeric value", () => {
		const zIndexVar = variable("z-index-header", 100);
		const result = consumeVariable(zIndexVar, options);

		expect(result).toBe("--z-index-header: 100;");
	});

	it("should handle variable with empty string value", () => {
		const emptyVar = variable("empty-var", "");
		const result = consumeVariable(emptyVar, options);

		expect(result).toBe("--empty-var: ;");
	});

	it("should respect prefix in options if provided", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--sf-${name}`,
			},
		};

		const colorVar = variable("color-primary", "#006cff");
		const result = consumeVariable(colorVar, prefixOptions);

		expect(result).toBe("--sf-color-primary: #006cff;");
	});

	it("should handle variable with complex values like calc expressions", () => {
		const calcVar = variable("sidebar-width", "calc(100% - 200px)");
		const result = consumeVariable(calcVar, options);

		expect(result).toBe("--sidebar-width: calc(100% - 200px);");
	});

	it("should handle variable referencing another variable", () => {
		// Create a base variable
		const baseColorVar = variable("color-base", "#006cff");

		// Create a reference to the base variable
		const baseColorRef = ref(baseColorVar);

		// Create a variable that uses the reference
		const colorPrimaryVar = variable("color-primary", baseColorRef);

		const result = consumeVariable(colorPrimaryVar, options);

		expect(result).toBe("--color-primary: var(--color-base);");
	});

	it("should handle variable with string reference", () => {
		// Create a reference using a string name
		const colorRef = ref("color-base");

		// Create a variable that uses the reference
		const colorPrimaryVar = variable("color-primary", colorRef);

		const result = consumeVariable(colorPrimaryVar, options);

		expect(result).toBe("--color-primary: var(--color-base);");
	});

	it("should handle variable with reference that has fallback", () => {
		// Create a reference with fallback value
		const fontSizeRef = ref("font-size", "16px");

		// Create a variable that uses the reference with fallback
		const bodyFontVar = variable("body-font-size", fontSizeRef);

		const result = consumeVariable(bodyFontVar, options);

		expect(result).toBe("--body-font-size: var(--font-size, 16px);");
	});

	it("should handle variable with null value", () => {
		const nullVar = variable("null-var", null);
		const result = consumeVariable(nullVar, options);

		expect(result).toBe("--null-var: ;");
	});

	it("should handle variable with undefined value", () => {
		const undefinedVar = variable("undefined-var", undefined);
		const result = consumeVariable(undefinedVar, options);

		expect(result).toBe("--undefined-var: ;");
	});

	it("should handle variable with boolean value", () => {
		const boolVar = variable("feature-enabled", true);
		const result = consumeVariable(boolVar, options);

		expect(result).toBe("--feature-enabled: true;");
	});

	it("should handle variable with array value", () => {
		const arrayVar = variable("font-stack", ["Helvetica", "Arial", "sans-serif"]);
		const result = consumeVariable(arrayVar, options);

		expect(result).toBe("--font-stack: Helvetica,Arial,sans-serif;");
	});

	it("should handle variable with complex CSS values", () => {
		const shadowVar = variable(
			"box-shadow",
			"0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)",
		);
		const result = consumeVariable(shadowVar, options);

		expect(result).toBe(
			"--box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05);",
		);
	});

	it("should handle chained variable references", () => {
		// Create a base color variable
		const baseColorVar = variable("color-base", "#006cff");

		// Create an intermediate variable that references the base
		const primaryColorVar = variable("color-primary", ref(baseColorVar));

		// Create a final variable that references the intermediate one
		const buttonColorVar = variable("button-color", ref(primaryColorVar));

		const result = consumeVariable(buttonColorVar, options);

		expect(result).toBe("--button-color: var(--color-primary);");
	});

	it("should handle variable with object value by converting to string", () => {
		// @ts-expect-error - Ignoring type to test object handling
		const objVar = variable("object-var", { key: "value" });
		const result = consumeVariable(objVar, options);

		// Object should be converted to string
		expect(result).toBe("--object-var: [object Object];");
	});

	it("should apply variable prefix consistently when referencing other variables", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--sf-${name}`,
			},
		};

		// Create a base color variable
		const baseColorVar = variable("color-base", "#006cff");

		// Create a variable that references the base
		const primaryColorVar = variable("color-primary", ref(baseColorVar));

		const result = consumeVariable(primaryColorVar, prefixOptions);

		// Both the variable name and the referenced variable should have the prefix
		expect(result).toBe("--sf-color-primary: var(--sf-color-base);");
	});

	it("should convert dot notation to double dashes in variable names", () => {
		const colorVar = variable("color.primary", "#006cff");
		const result = consumeVariable(colorVar, options);

		expect(result).toBe("--color--primary: #006cff;");
	});

	it("should handle multiple dots in variable names (nested paths)", () => {
		const colorVar = variable("color.primary.500", "#006cff");
		const result = consumeVariable(colorVar, options);

		expect(result).toBe("--color--primary--500: #006cff;");
	});

	it("should handle dot notation when referencing variables", () => {
		// Create a base variable with dot notation
		const baseColorVar = variable("color.base", "#006cff");

		// Create a reference to the base variable
		const baseColorRef = ref(baseColorVar);

		// Create a variable that uses the reference
		const colorPrimaryVar = variable("color.primary", baseColorRef);

		const result = consumeVariable(colorPrimaryVar, options);

		expect(result).toBe("--color--primary: var(--color--base);");
	});

	it("should handle dot notation with string reference", () => {
		// Create a reference using a string name with dot notation
		const colorRef = ref("color.base");

		// Create a variable that uses the reference
		const colorPrimaryVar = variable("color.primary", colorRef);

		const result = consumeVariable(colorPrimaryVar, options);

		expect(result).toBe("--color--primary: var(--color--base);");
	});

	it("should handle dot notation with reference that has fallback", () => {
		// Create a reference with fallback value using dot notation
		const fontSizeRef = ref("font.size", "16px");

		// Create a variable that uses the reference with fallback
		const bodyFontVar = variable("body.font.size", fontSizeRef);

		const result = consumeVariable(bodyFontVar, options);

		expect(result).toBe("--body--font--size: var(--font--size, 16px);");
	});

	it("should apply custom variable name function with dot notation", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--sf-${name.replaceAll(".", "-")}`,
			},
		};

		const colorVar = variable("color.primary", "#006cff");
		const result = consumeVariable(colorVar, prefixOptions);

		expect(result).toBe("--sf-color-primary: #006cff;");
	});

	it("should handle mixed dot and dash notation", () => {
		const colorVar = variable("color.primary-500", "#006cff");
		const result = consumeVariable(colorVar, options);

		expect(result).toBe("--color--primary-500: #006cff;");
	});
});
