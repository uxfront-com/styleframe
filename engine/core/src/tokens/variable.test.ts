import type { Reference, Root, Variable } from "../types";
import { createRoot } from "./root";
import { createSelectorFunction } from "./selector";
import { createVariableFunction } from "./variable";

describe("createVariableFunction", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;
	let selector: ReturnType<typeof createSelectorFunction>;

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
		selector = createSelectorFunction(root, root);
	});

	describe("basic variable creation", () => {
		it("should create a new variable with correct properties", () => {
			const result = variable("primary-color", "#007bff");

			expect(result).toEqual({
				type: "variable",
				id: expect.any(String),
				name: "primary-color",
				value: "#007bff",
				parentId: expect.any(String),
			});
		});

		it("should add the variable to root declarations", () => {
			const result = variable("spacing", "1rem");

			expect(root.variables).toHaveLength(1);
			expect(root.variables[0]).toBe(result);
		});
	});

	describe("default behavior", () => {
		describe("when false", () => {
			it("should update existing variable value when default is false", () => {
				const first = variable("border-width", "1px", { default: true });
				const second = variable("border-width", "2px", { default: false });

				expect(second).toBe(first); // Same instance
				expect(second.value).toBe("2px"); // Updated value
				expect(root.variables).toHaveLength(1);
			});

			it("should create new variable if none exists with default: false", () => {
				const result = variable("line-height", "1.5", { default: false });

				expect(result.value).toBe("1.5");
				expect(root.variables).toHaveLength(1);
			});
		});

		describe("when true", () => {
			it("should return existing variable when default is true", () => {
				const first = variable("color", "red");
				const second = variable("color", "blue", { default: true }); // Should return first, not create new

				expect(second).toBe(first);
				expect(second.value).toBe("red");
				expect(root.variables).toHaveLength(1);
			});

			it("should return existing variable with explicit default: true", () => {
				const first = variable("font-size", "16px", { default: true });
				const second = variable("font-size", "18px", { default: true });

				expect(second).toBe(first);
				expect(second.value).toBe("16px");
				expect(root.variables).toHaveLength(1);
			});

			it("should create new variable if none exists with default: true", () => {
				const result = variable("margin", "10px", { default: true });

				expect(result.value).toBe("10px");
				expect(root.variables).toHaveLength(1);
			});
		});
	});

	describe("multiple variables", () => {
		it("should handle multiple different variables", () => {
			const color = variable("color", "blue");
			const spacing = variable("spacing", "8px");
			const fontSize = variable("font-size", "14px");

			expect(root.variables).toHaveLength(3);
			expect(root.variables).toContain(color);
			expect(root.variables).toContain(spacing);
			expect(root.variables).toContain(fontSize);
		});

		it("should find correct existing variable among multiple", () => {
			variable("color", "red");
			const spacing = variable("spacing", "10px");
			variable("font-size", "16px");

			// Try to override the middle variable
			const updatedSpacing = variable("spacing", "20px", { default: false });

			expect(updatedSpacing).toBe(spacing);
			expect(updatedSpacing.value).toBe("20px");
			expect(root.variables).toHaveLength(3);
		});
	});

	describe("working with references", () => {
		it("should handle reference token values", () => {
			const reference: Reference = {
				type: "reference",
				name: "base-color",
				fallback: "#000000",
			};

			const result = variable("ref-color", reference);

			expect(result.value).toEqual(reference);
		});
	});

	describe("working with selectors", () => {
		it("should work when root is a selector", () => {
			const selectorInstance = selector(".test", {});

			const selectorVariable = createVariableFunction(selectorInstance, root);
			const result = selectorVariable("nested-var", "50px");

			expect(result.name).toBe("nested-var");
			expect(selectorInstance.variables).toHaveLength(1);
			expect(selectorInstance.variables[0]).toBe(result);
		});
	});

	describe("edge cases", () => {
		it("should handle empty string values", () => {
			const result = variable("empty", "");
			expect(result.value).toBe("");
		});

		it("should handle null values", () => {
			const result = variable("null-value", null);
			expect(result.value).toBe(null);
		});

		it("should handle undefined values", () => {
			const result = variable("undefined-value", undefined);
			expect(result.value).toBe(undefined);
		});

		it("should handle numeric values", () => {
			const result = variable("numeric", 42);
			expect(result.value).toBe(42);
		});

		it("should handle boolean values", () => {
			const result = variable("boolean", true);
			expect(result.value).toBe(true);
		});
	});

	describe("type safety", () => {
		it("should maintain type information for variable name", () => {
			const result = variable("test-var", "100px");

			// Type assertion to verify the generic type is preserved
			const typedResult: Variable<"test-var"> = result;
			expect(typedResult.name).toBe("test-var");
		});

		it("should preserve generic type parameter", () => {
			const result = variable("typed-var", "test-value");

			// This should compile without type errors
			const name: "typed-var" = result.name;
			expect(name).toBe("typed-var");
		});

		it("should work with different string literal types", () => {
			const colorVar = variable("color-primary", "#ff0000");
			const spacingVar = variable("spacing-lg", "2rem");

			expect(colorVar.name).toBe("color-primary");
			expect(spacingVar.name).toBe("spacing-lg");
		});
	});

	describe("@ reference shorthand", () => {
		it("should resolve @-prefixed value to a reference", () => {
			variable("other-var", "value");
			const result = variable("color", "@other-var");

			expect(result.value).toEqual({
				type: "reference",
				name: "other-var",
			});
		});

		it("should resolve @-prefixed value with dot notation", () => {
			variable("color.primary", "#006cff");
			const result = variable("color", "@color.primary");

			expect(result.value).toEqual({
				type: "reference",
				name: "color.primary",
			});
		});

		it("should not convert regular string values", () => {
			const result = variable("color", "#ff0000");
			expect(result.value).toBe("#ff0000");
		});

		it("should resolve @-prefixed value when updating existing variable", () => {
			variable("other-color", "#ff0000");
			const first = variable("color", "red");
			const updated = variable("color", "@other-color");

			expect(updated).toBe(first);
			expect(updated.value).toEqual({
				type: "reference",
				name: "other-color",
			});
		});

		it("should resolve embedded @reference to a CSS object", () => {
			variable("color.primary", "#006cff");
			const result = variable("border", "1px solid @color.primary");

			expect(result.value).toEqual({
				type: "css",
				value: [
					"1px solid ",
					{ type: "reference", name: "color.primary", fallback: undefined },
				],
			});
		});

		it("should resolve multiple embedded @references to a CSS object", () => {
			variable("spacing.sm", "0.5rem");
			variable("spacing.md", "1rem");
			const result = variable("padding", "@spacing.sm @spacing.md");

			expect(result.value).toEqual({
				type: "css",
				value: [
					{ type: "reference", name: "spacing.sm", fallback: undefined },
					" ",
					{ type: "reference", name: "spacing.md", fallback: undefined },
				],
			});
		});

		it("should throw when @-prefixed value references undefined variable", () => {
			expect(() => variable("color", "@nonexistent")).toThrow(
				'Variable "nonexistent" is not defined',
			);
		});
	});

	describe("accepting variable instance as name", () => {
		let root: Root;
		let variable: ReturnType<typeof createVariableFunction>;

		beforeEach(() => {
			root = createRoot();
			variable = createVariableFunction(root, root);
		});

		it("should update existing variable when passing variable instance", () => {
			const first = variable("v", "a");
			const updated = variable(first, "b");

			expect(updated).toBe(first);
			expect(updated.value).toBe("b");
			expect(root.variables).toHaveLength(1);
		});

		it("should respect default: true when passing variable instance", () => {
			const first = variable("color", "red");
			const result = variable(first, "blue", { default: true });

			expect(result).toBe(first);
			expect(first.value).toBe("red");
			expect(root.variables).toHaveLength(1);
		});

		it("should create variable in new container when target from different parent", () => {
			const base = variable("spacing", "8px");
			const selectorInstance = selector(".x", {});
			const selectorVariable = createVariableFunction(selectorInstance, root);
			const result = selectorVariable(base, "12px");

			expect(result.name).toBe("spacing");
			expect(selectorInstance.variables).toHaveLength(1);
			expect(selectorInstance.variables[0]).toBe(result);
		});

		it("should maintain type information when passing variable instance", () => {
			const base = variable("typed-var", "x");
			const result = variable(base, "y");

			const typedResult: Variable<"typed-var"> = result;
			expect(typedResult.name).toBe("typed-var");
		});
	});
});
