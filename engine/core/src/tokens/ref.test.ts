import { beforeEach, describe, expect, it } from "vitest";

import type { Root, Selector } from "../types";
import { createRefFunction } from "./ref";
import { createRoot } from "./root";
import { createVariableFunction } from "./variable";

describe("createRefFunction", () => {
	let root: Root;
	let selector: Selector;
	let ref: ReturnType<typeof createRefFunction>;
	let variable: ReturnType<typeof createVariableFunction>;

	beforeEach(() => {
		root = createRoot();
		selector = {
			type: "selector",
			id: "test-id",
			parentId: root.id,
			query: ".test",
			variables: [],
			declarations: {},
			children: [],
		};
		root._registry.set(selector.id, selector);
		ref = createRefFunction(selector, root);
		variable = createVariableFunction(selector, root);
	});

	describe("basic reference creation", () => {
		it("should create a reference from a variable instance", () => {
			const colorPrimary = variable("color--primary", "#006cff");

			const result = ref(colorPrimary);

			expect(result).toEqual({
				type: "reference",
				name: "color--primary",
				fallback: undefined,
			});
		});

		it("should create a reference from a variable name string", () => {
			const result = ref("spacing--md");

			expect(result).toEqual({
				type: "reference",
				name: "spacing--md",
				fallback: undefined,
			});
		});

		it("should preserve the correct type", () => {
			const result = ref("my-custom-var");

			expect(result.type).toBe("reference");
		});

		it("should preserve generic type information", () => {
			const colorVar = variable("color-primary", "#blue");
			const result = ref(colorVar);

			// Type should be preserved
			expect(result.name).toBe("color-primary");
		});
	});

	describe("fallback values", () => {
		it("should create a reference with fallback from variable instance", () => {
			const colorSecondary = variable("color--secondary", "#ff5733");

			const result = ref(colorSecondary, "#cccccc");

			expect(result).toEqual({
				type: "reference",
				name: "color--secondary",
				fallback: "#cccccc",
			});
		});

		it("should create a reference with fallback from variable name", () => {
			const result = ref("color--purple", "#ff5733");

			expect(result).toEqual({
				type: "reference",
				name: "color--purple",
				fallback: "#ff5733",
			});
		});

		it("should handle complex fallback values", () => {
			const result = ref("spacing--xl", "calc(2rem + 10px)");

			expect(result).toEqual({
				type: "reference",
				name: "spacing--xl",
				fallback: "calc(2rem + 10px)",
			});
		});

		it("should handle empty string fallback", () => {
			const result = ref("test-var", "");

			expect(result).toEqual({
				type: "reference",
				name: "test-var",
				fallback: "",
			});
		});

		it("should handle undefined fallback explicitly", () => {
			const result = ref("test-var", undefined);

			expect(result).toEqual({
				type: "reference",
				name: "test-var",
				fallback: undefined,
			});
		});

		it("should resolve @-prefixed fallback to a reference", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "color.primary",
				value: "#006cff",
			});
			const result = ref("color.text", "@color.primary");

			expect(result).toEqual({
				type: "reference",
				name: "color.text",
				fallback: {
					type: "reference",
					name: "color.primary",
				},
			});
		});

		it("should resolve @-prefixed fallback from variable instance", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "color.primary",
				value: "#006cff",
			});
			const colorText = variable("color--text", "#333");
			const result = ref(colorText, "@color.primary");

			expect(result).toEqual({
				type: "reference",
				name: "color--text",
				fallback: {
					type: "reference",
					name: "color.primary",
				},
			});
		});

		it("should resolve embedded @reference in fallback to a CSS object", () => {
			variable("color.primary", "#006cff");
			const result = ref("border", "1px solid @color.primary");

			expect(result).toEqual({
				type: "reference",
				name: "border",
				fallback: {
					type: "css",
					value: ["1px solid ", { type: "reference", name: "color.primary" }],
				},
			});
		});

		it("should throw when @-prefixed fallback references undefined variable", () => {
			expect(() => ref("color", "@nonexistent")).toThrow('Variable "nonexistent" is not defined');
		});
	});

	describe("context parameter handling", () => {
		it("should work with root context", () => {
			const refWithRootContext = createRefFunction(root, root);
			const colorVar = variable("root-color", "#000");

			const result = refWithRootContext(colorVar);

			expect(result).toEqual({
				type: "reference",
				name: "root-color",
				fallback: undefined,
			});
		});

		it("should work with selector context", () => {
			const refWithSelectorContext = createRefFunction(selector, root);
			const spacingVar = variable("selector-spacing", "1rem");

			const result = refWithSelectorContext(spacingVar);

			expect(result).toEqual({
				type: "reference",
				name: "selector-spacing",
				fallback: undefined,
			});
		});

		it("should work with nested selector context", () => {
			const nestedSelector: Selector = {
				type: "selector",
				id: "test-id",
				query: "&:hover",
				variables: [],
				declarations: {},
				children: [],
			};

			const refWithNestedContext = createRefFunction(nestedSelector, root);
			const hoverVar = variable("hover-color", "#333");

			const result = refWithNestedContext(hoverVar);

			expect(result).toEqual({
				type: "reference",
				name: "hover-color",
				fallback: undefined,
			});
		});
	});

	describe("variable instance handling", () => {
		it("should correctly identify variable instances using isVariable", () => {
			const colorVar = variable("color-test", "#123456");

			const result = ref(colorVar);

			expect(result.name).toBe("color-test");
			expect(result.type).toBe("reference");
		});

		it("should handle variables with different value types", () => {
			const stringVar = variable("string-var", "value");
			const numberVar = variable("number-var", "42px");
			const complexVar = variable("complex-var", "calc(100% - 2rem)");

			const stringRef = ref(stringVar);
			const numberRef = ref(numberVar);
			const complexRef = ref(complexVar);

			expect(stringRef.name).toBe("string-var");
			expect(numberRef.name).toBe("number-var");
			expect(complexRef.name).toBe("complex-var");
		});

		it("should work with variables that have special characters in names", () => {
			const specialVar = variable("color--primary-500", "#006cff");

			const result = ref(specialVar);

			expect(result.name).toBe("color--primary-500");
		});
	});

	describe("string name handling", () => {
		it("should handle various string patterns", () => {
			const kebabCase = ref("font-family-sans");
			const camelCase = ref("fontSize");
			const snakeCase = ref("font_size");
			const withNumbers = ref("size-12");
			const withDashes = ref("color--primary--500");
			const withDots = ref("color.primary");

			expect(kebabCase.name).toBe("font-family-sans");
			expect(camelCase.name).toBe("fontSize");
			expect(snakeCase.name).toBe("font_size");
			expect(withNumbers.name).toBe("size-12");
			expect(withDashes.name).toBe("color--primary--500");
			expect(withDots.name).toBe("color.primary");
		});

		it("should handle empty string names", () => {
			const result = ref("");

			expect(result).toEqual({
				type: "reference",
				name: "",
				fallback: undefined,
			});
		});

		it("should handle single character names", () => {
			const result = ref("a");

			expect(result).toEqual({
				type: "reference",
				name: "a",
				fallback: undefined,
			});
		});
	});

	describe("dot notation handling", () => {
		it("should create a reference with dot notation in name", () => {
			const result = ref("color.primary");

			expect(result).toEqual({
				type: "reference",
				name: "color.primary",
				fallback: undefined,
			});
		});

		it("should handle multiple dots in reference names (nested paths)", () => {
			const result = ref("color.primary.500");

			expect(result).toEqual({
				type: "reference",
				name: "color.primary.500",
				fallback: undefined,
			});
		});

		it("should handle dot notation with fallback value", () => {
			const result = ref("color.primary", "#006cff");

			expect(result).toEqual({
				type: "reference",
				name: "color.primary",
				fallback: "#006cff",
			});
		});

		it("should handle dot notation when referencing variables with dots", () => {
			const colorVar = variable("color.primary", "#006cff");
			const result = ref(colorVar);

			expect(result).toEqual({
				type: "reference",
				name: "color.primary",
				fallback: undefined,
			});
		});

		it("should handle mixed dot and dash notation", () => {
			const result = ref("color.primary-500");

			expect(result).toEqual({
				type: "reference",
				name: "color.primary-500",
				fallback: undefined,
			});
		});

		it("should handle dot notation in reference chains", () => {
			const baseColor = variable("color.base", "#0066ff");
			const primaryColor = variable("color.primary", ref(baseColor));

			expect(primaryColor.value).toEqual({
				type: "reference",
				name: "color.base",
				fallback: undefined,
			});
		});

		it("should handle dot notation with complex fallback values", () => {
			const result = ref("spacing.md", "calc(1rem + 4px)");

			expect(result).toEqual({
				type: "reference",
				name: "spacing.md",
				fallback: "calc(1rem + 4px)",
			});
		});
	});

	describe("reference chaining", () => {
		it("should work with variables that reference other variables", () => {
			const baseColor = variable("base-color", "#0066ff");
			const primaryColor = variable("primary-color", ref(baseColor));

			// Verify the primary variable contains a reference
			expect(primaryColor.value).toEqual({
				type: "reference",
				name: "base-color",
				fallback: undefined,
			});
		});

		it("should support multiple levels of references", () => {
			const baseColor = variable("base-color", "#0066ff");
			const primaryColor = variable("primary-color", ref(baseColor));
			const buttonColor = variable("button-color", ref(primaryColor));

			expect(buttonColor.value).toEqual({
				type: "reference",
				name: "primary-color",
				fallback: undefined,
			});
		});

		it("should support references with fallbacks in chains", () => {
			const baseColor = variable("base-color", "#0066ff");
			const primaryColor = variable("primary-color", ref(baseColor, "#ff0000"));

			expect(primaryColor.value).toEqual({
				type: "reference",
				name: "base-color",
				fallback: "#ff0000",
			});
		});
	});

	describe("type safety and generic preservation", () => {
		it("should preserve string literal types", () => {
			const specificVar = variable("very-specific-name" as const, "value");
			const result = ref(specificVar);

			// This should maintain the literal type
			expect(result.name).toBe("very-specific-name");
		});

		it("should work with union types", () => {
			type ColorName = "primary" | "secondary" | "tertiary";

			const colorRef1 = ref("primary" as ColorName);
			const colorRef2 = ref("secondary" as ColorName);

			expect(colorRef1.name).toBe("primary");
			expect(colorRef2.name).toBe("secondary");
		});

		it("should maintain type information through function calls", () => {
			const createColorRef = (name: string) => ref(name);

			const result = createColorRef("dynamic-color");
			expect(result.name).toBe("dynamic-color");
		});
	});

	describe("edge cases", () => {
		it("should throw when passed undefined", () => {
			expect(() => ref(undefined as any)).toThrow("ref() received undefined");
		});

		it("should throw when passed null", () => {
			expect(() => ref(null as any)).toThrow("ref() received null");
		});

		it("should handle null fallback values", () => {
			const result = ref("test-var", null as any);

			expect(result.fallback).toBeNull();
		});

		it("should maintain object identity for repeated calls", () => {
			const colorVar = variable("repeat-test", "#fff");

			const ref1 = ref(colorVar);
			const ref2 = ref(colorVar);

			// Should create new objects each time
			expect(ref1).not.toBe(ref2);
			// But should be equal in content
			expect(ref1).toEqual(ref2);
		});
	});

	describe("real-world usage patterns", () => {
		it("should support design token patterns", () => {
			// Base tokens
			const blue500 = variable("blue-500", "#3b82f6");
			const blue600 = variable("blue-600", "#2563eb");

			// Semantic tokens
			const colorPrimary = variable("color-primary", ref(blue500));
			const colorPrimaryHover = variable("color-primary-hover", ref(blue600));

			expect(colorPrimary.value).toEqual({
				type: "reference",
				name: "blue-500",
				fallback: undefined,
			});

			expect(colorPrimaryHover.value).toEqual({
				type: "reference",
				name: "blue-600",
				fallback: undefined,
			});
		});

		it("should work in selector declarations", () => {
			const colorPrimary = variable("color-primary", "#006cff");
			const spacingMd = variable("spacing-md", "1rem");

			// Simulate selector usage
			const declarations = {
				backgroundColor: ref(colorPrimary),
				padding: ref(spacingMd),
				color: ref("text-color", "#000"),
			};

			expect(declarations.backgroundColor).toEqual({
				type: "reference",
				name: "color-primary",
				fallback: undefined,
			});

			expect(declarations.padding).toEqual({
				type: "reference",
				name: "spacing-md",
				fallback: undefined,
			});

			expect(declarations.color).toEqual({
				type: "reference",
				name: "text-color",
				fallback: "#000",
			});
		});

		it("should support conditional references", () => {
			const isDark = false;
			const lightColor = variable("light-bg", "#ffffff");
			const darkColor = variable("dark-bg", "#000000");

			const bgColor = isDark ? ref(darkColor) : ref(lightColor);

			expect(bgColor).toEqual({
				type: "reference",
				name: "light-bg",
				fallback: undefined,
			});
		});
	});

	describe("function context independence", () => {
		it("should create independent functions for different contexts", () => {
			const context1 = createRoot();
			const context2 = {
				type: "selector" as const,
				id: "test-id",
				query: ".test",
				variables: [],
				declarations: {},
				children: [],
			};

			const ref1 = createRefFunction(context1, root);
			const ref2 = createRefFunction(context2, root);

			// Both should work independently
			const result1 = ref1("test-var-1");
			const result2 = ref2("test-var-2");

			expect(result1.name).toBe("test-var-1");
			expect(result2.name).toBe("test-var-2");

			// And should be separate functions
			expect(ref1).not.toBe(ref2);
		});
	});
});
