import type { AtRule, Container, Root, Selector, Variable } from "../types";
import { createAtRuleFunction } from "./atRule";
import {
	createDeclarationsCallbackContext,
	parseDeclarationsBlock,
} from "./declarations";
import { createRoot } from "./root";
import { createSelectorFunction } from "./selector";
import { createVariableFunction } from "./variable";

describe("parseDeclarationsBlock", () => {
	let mockContext: any;
	let root: Root;

	beforeEach(() => {
		root = createRoot();
		mockContext = {
			selector: vi.fn(),
			variable: vi.fn(),
			keyframes: vi.fn(),
			atRule: vi.fn(),
			media: vi.fn(),
			css: vi.fn(),
			ref: vi.fn(),
		};
	});

	describe("nested selector parsing", () => {
		it("should parse selectors starting with &", () => {
			const declarations = {
				color: "blue",
				"&:hover": { color: "red" },
				"&::before": { content: '""' },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(2);
			expect(mockContext.selector).toHaveBeenCalledWith("&:hover", {
				color: "red",
			});
			expect(mockContext.selector).toHaveBeenCalledWith("&::before", {
				content: '""',
			});

			// Should remove nested selectors from original declarations
			expect(declarations).not.toHaveProperty("&:hover");
			expect(declarations).not.toHaveProperty("&::before");
			expect(declarations).toHaveProperty("color", "blue");
		});

		it("should parse selectors starting with .", () => {
			const declarations = {
				padding: "1rem",
				".child": { fontSize: "14px" },
				".another-child": { margin: "0.5rem" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(2);
			expect(mockContext.selector).toHaveBeenCalledWith(".child", {
				fontSize: "14px",
			});
			expect(mockContext.selector).toHaveBeenCalledWith(".another-child", {
				margin: "0.5rem",
			});
		});

		it("should parse selectors starting with :", () => {
			const declarations = {
				display: "block",
				":hover": { opacity: 0.8 },
				":focus": { outline: "2px solid blue" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(2);
			expect(mockContext.selector).toHaveBeenCalledWith(":hover", {
				opacity: 0.8,
			});
			expect(mockContext.selector).toHaveBeenCalledWith(":focus", {
				outline: "2px solid blue",
			});
		});

		it("should not parse regular CSS properties", () => {
			const declarations = {
				color: "blue",
				fontSize: "16px",
				marginTop: "1rem",
				backgroundColor: "#ffffff",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).not.toHaveBeenCalled();
			// All properties should remain
			expect(Object.keys(declarations)).toHaveLength(4);
		});

		it("should handle mixed declarations", () => {
			const declarations = {
				padding: "1rem",
				color: "blue",
				"&:hover": { color: "red" },
				fontSize: "16px",
				".child": { margin: "0.5rem" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(2);

			// Regular properties should remain
			expect(declarations).toHaveProperty("padding", "1rem");
			expect(declarations).toHaveProperty("color", "blue");
			expect(declarations).toHaveProperty("fontSize", "16px");

			// Nested selectors should be removed
			expect(declarations).not.toHaveProperty("&:hover");
			expect(declarations).not.toHaveProperty(".child");
		});
	});

	describe("keyframe selector parsing", () => {
		it("should parse percentage-based keyframe selectors", () => {
			const declarations = {
				"0%": { opacity: "0", transform: "translateY(-4px)" },
				"50%": { opacity: "0.5" },
				"100%": { opacity: "1", transform: "translateY(0)" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(3);
			expect(mockContext.selector).toHaveBeenCalledWith("0%", {
				opacity: "0",
				transform: "translateY(-4px)",
			});
			expect(mockContext.selector).toHaveBeenCalledWith("50%", {
				opacity: "0.5",
			});
			expect(mockContext.selector).toHaveBeenCalledWith("100%", {
				opacity: "1",
				transform: "translateY(0)",
			});

			expect(declarations).not.toHaveProperty("0%");
			expect(declarations).not.toHaveProperty("50%");
			expect(declarations).not.toHaveProperty("100%");
		});

		it("should parse compound keyframe selectors", () => {
			const declarations = {
				"0%, 100%": { opacity: "1" },
				"50%": { opacity: "0.5" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(2);
			expect(mockContext.selector).toHaveBeenCalledWith("0%, 100%", {
				opacity: "1",
			});
			expect(mockContext.selector).toHaveBeenCalledWith("50%", {
				opacity: "0.5",
			});

			expect(declarations).not.toHaveProperty("0%, 100%");
			expect(declarations).not.toHaveProperty("50%");
		});

		it("should parse compound from/to keyframe selectors", () => {
			const declarations = {
				"from, to": { opacity: "1" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(1);
			expect(mockContext.selector).toHaveBeenCalledWith("from, to", {
				opacity: "1",
			});

			expect(declarations).not.toHaveProperty("from, to");
		});

		it("should parse from and to keyframe selectors", () => {
			const declarations = {
				from: { opacity: "0" },
				to: { opacity: "1" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(2);
			expect(mockContext.selector).toHaveBeenCalledWith("from", {
				opacity: "0",
			});
			expect(mockContext.selector).toHaveBeenCalledWith("to", {
				opacity: "1",
			});

			expect(declarations).not.toHaveProperty("from");
			expect(declarations).not.toHaveProperty("to");
		});
	});

	describe("media query handling", () => {
		it("should handle media queries", () => {
			const declarations = {
				width: "100%",
				"@media (min-width: 768px)": {
					width: "50%",
				},
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations).not.toHaveProperty("@media (min-width: 768px)");
			expect(mockContext.atRule).toHaveBeenCalledTimes(1);
			expect(mockContext.atRule).toHaveBeenCalledWith(
				"media",
				"(min-width: 768px)",
				{ width: "50%" },
			);
		});

		it.each([
			["@starting-style", "starting-style", ""],
			["@font-feature-values Font One", "font-feature-values", "Font One"],
			["@-webkit-keyframes spin", "-webkit-keyframes", "spin"],
		])("should keep the hyphens of %s", (key, identifier, rule) => {
			const declarations = { [key]: { opacity: 0 } };

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.atRule).toHaveBeenCalledWith(identifier, rule, {
				opacity: 0,
			});
		});
	});

	describe("edge cases", () => {
		it("should handle non-object nested values", () => {
			const declarations = {
				color: "blue",
				"&:hover": "not-an-object",
				".child": { fontSize: "14px" },
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			// Should only process object values
			expect(mockContext.selector).toHaveBeenCalledTimes(1);
			expect(mockContext.selector).toHaveBeenCalledWith(".child", {
				fontSize: "14px",
			});

			// Non-object nested value should remain
			expect(declarations).toHaveProperty("&:hover", "not-an-object");
		});

		it("should handle empty nested objects", () => {
			const declarations = {
				color: "blue",
				"&:hover": {},
				".child": {},
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(mockContext.selector).toHaveBeenCalledTimes(2);
			expect(mockContext.selector).toHaveBeenCalledWith("&:hover", {});
			expect(mockContext.selector).toHaveBeenCalledWith(".child", {});
		});
	});

	describe("@ reference resolution", () => {
		it("should resolve @-prefixed string values to references", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "color.primary",
				value: "#006cff",
			});

			const declarations: any = {
				color: "@color.primary",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.color).toEqual({
				type: "reference",
				name: "color.primary",
			});
		});

		it("should resolve multiple @-prefixed values", () => {
			root.variables.push(
				{ type: "variable", id: "test-id", name: "spacing.md", value: "1rem" },
				{
					type: "variable",
					id: "test-id",
					name: "spacing.lg",
					value: "1.5rem",
				},
				{ type: "variable", id: "test-id", name: "color.dark", value: "#333" },
			);

			const declarations: any = {
				gap: "@spacing.md",
				padding: "@spacing.lg",
				color: "@color.dark",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.gap).toEqual({
				type: "reference",
				name: "spacing.md",
			});
			expect(declarations.padding).toEqual({
				type: "reference",
				name: "spacing.lg",
			});
			expect(declarations.color).toEqual({
				type: "reference",
				name: "color.dark",
			});
		});

		it("should not affect regular string values", () => {
			const declarations: any = {
				display: "flex",
				color: "blue",
				fontSize: "16px",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.display).toBe("flex");
			expect(declarations.color).toBe("blue");
			expect(declarations.fontSize).toBe("16px");
		});

		it("should not affect non-string values", () => {
			const declarations: any = {
				opacity: 0.8,
				zIndex: 10,
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.opacity).toBe(0.8);
			expect(declarations.zIndex).toBe(10);
		});

		it("should handle mixed @ references and regular values", () => {
			root.variables.push(
				{ type: "variable", id: "test-id", name: "spacing.md", value: "1rem" },
				{
					type: "variable",
					id: "test-id",
					name: "font-size.sm",
					value: "0.875rem",
				},
			);

			const declarations: any = {
				display: "flex",
				gap: "@spacing.md",
				color: "blue",
				fontSize: "@font-size.sm",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.display).toBe("flex");
			expect(declarations.gap).toEqual({
				type: "reference",
				name: "spacing.md",
			});
			expect(declarations.color).toBe("blue");
			expect(declarations.fontSize).toEqual({
				type: "reference",
				name: "font-size.sm",
			});
		});

		it("should resolve embedded @references to a CSS object", () => {
			root.variables.push({
				type: "variable",
				id: "color-primary",
				name: "color.primary",
				value: "#006cff",
			});

			const declarations: any = {
				border: "1px solid @color.primary",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.border).toEqual({
				type: "css",
				value: ["1px solid ", { type: "reference", name: "color.primary" }],
			});
		});

		it("should resolve multiple embedded @references to a CSS object", () => {
			root.variables.push(
				{
					type: "variable",
					id: "spacing-sm",
					name: "spacing.sm",
					value: "0.5rem",
				},
				{
					type: "variable",
					id: "spacing-md",
					name: "spacing.md",
					value: "1rem",
				},
			);

			const declarations: any = {
				padding: "@spacing.sm @spacing.md",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.padding).toEqual({
				type: "css",
				value: [
					{ type: "reference", name: "spacing.sm" },
					" ",
					{ type: "reference", name: "spacing.md" },
				],
			});
		});
	});

	describe("@ reference validation", () => {
		it("should resolve @ references when variable exists in root", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "color.primary",
				value: "#006cff",
			});

			const declarations: any = {
				color: "@color.primary",
			};

			parseDeclarationsBlock(declarations, mockContext, root, root);

			expect(declarations.color).toEqual({
				type: "reference",
				name: "color.primary",
			});
		});

		it("should throw when @ reference variable does not exist in root", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "color.primary",
				value: "#006cff",
			});

			const declarations: any = {
				color: "@color.doesnotexist",
			};

			expect(() =>
				parseDeclarationsBlock(declarations, mockContext, root, root),
			).toThrow(
				'[styleframe] Variable "color.doesnotexist" is not defined. Check that the variable exists before referencing it with "@color.doesnotexist".',
			);
		});

		it("should throw for each undefined variable independently", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "spacing.md",
				value: "1rem",
			});

			const declarations: any = {
				gap: "@spacing.md",
				color: "@color.dark",
			};

			expect(() =>
				parseDeclarationsBlock(declarations, mockContext, root, root),
			).toThrow('Variable "color.dark" is not defined');
		});
	});
});

describe("createDeclarationsCallbackContext", () => {
	let root: Root;
	let selector: Selector;
	let media: AtRule;

	beforeEach(() => {
		root = createRoot();
		selector = {
			type: "selector",
			id: "test-id",
			query: ".test",
			variables: [],
			declarations: {},
			children: [],
		};
		media = {
			type: "at-rule",
			id: "test-id",
			identifier: "media",
			rule: "(min-width: 768px)",
			variables: [],
			declarations: {},
			children: [],
		} as unknown as AtRule;
	});

	describe("basic context creation", () => {
		it("should create context with all required functions for root container", () => {
			const context = createDeclarationsCallbackContext(root, root);

			expect(context).toHaveProperty("variable");
			expect(context).toHaveProperty("selector");
			expect(context).toHaveProperty("media");
			expect(context).toHaveProperty("atRule");
			expect(typeof context.variable).toBe("function");
			expect(typeof context.selector).toBe("function");
			expect(typeof context.media).toBe("function");
			expect(typeof context.atRule).toBe("function");
		});

		it("should create context with all required functions for selector container", () => {
			const context = createDeclarationsCallbackContext(selector, root);

			expect(context).toHaveProperty("variable");
			expect(context).toHaveProperty("selector");
			expect(context).toHaveProperty("media");
			expect(context).toHaveProperty("atRule");
			expect(typeof context.variable).toBe("function");
			expect(typeof context.selector).toBe("function");
			expect(typeof context.media).toBe("function");
			expect(typeof context.atRule).toBe("function");
		});

		it("should create context with all required functions for media container", () => {
			const context = createDeclarationsCallbackContext(media, root);

			expect(context).toHaveProperty("variable");
			expect(context).toHaveProperty("selector");
			expect(context).toHaveProperty("media");
			expect(context).toHaveProperty("atRule");
			expect(typeof context.variable).toBe("function");
			expect(typeof context.selector).toBe("function");
			expect(typeof context.media).toBe("function");
			expect(typeof context.atRule).toBe("function");
		});
	});

	describe("function creation with proper context", () => {
		it("should create variable function bound to correct parent and root", () => {
			const context = createDeclarationsCallbackContext(selector, root);

			const testVar = context.variable("test-var", "test-value");

			expect(testVar.name).toBe("test-var");
			expect(testVar.value).toBe("test-value");
			expect(selector.variables).toContainEqual(testVar);
		});

		it("should create selector function bound to correct parent and root", () => {
			const context = createDeclarationsCallbackContext(root, root);

			const testSelector = context.selector(".test-selector", {
				color: "red",
			});

			expect(testSelector.query).toBe(".test-selector");
			expect(testSelector.declarations).toEqual({ color: "red" });
			expect(root.children).toContainEqual(testSelector);
		});

		it("should create media function bound to correct parent and root", () => {
			const context = createDeclarationsCallbackContext(root, root);

			const testMedia = context.media("(min-width: 768px)", {
				fontSize: "18px",
			});

			expect(testMedia.type).toBe("at-rule");
			expect(testMedia.identifier).toBe("media");
			expect(testMedia.rule).toBe("(min-width: 768px)");
			expect(testMedia.declarations).toEqual({ fontSize: "18px" });
			expect(root.children).toContainEqual(testMedia);
		});
	});

	describe("nested context functionality", () => {
		it("should support nested variable creation in selector context", () => {
			const context = createDeclarationsCallbackContext(selector, root);

			const nestedVar = context.variable("nested-var", "#006cff");

			expect(nestedVar.name).toBe("nested-var");
			expect(nestedVar.value).toBe("#006cff");
			expect(selector.variables).toContainEqual(nestedVar);
		});

		it("should support nested selector creation in media context", () => {
			const context = createDeclarationsCallbackContext(media, root);

			const nestedSelector = context.selector(".nested", {
				padding: "1rem",
			});

			expect(nestedSelector.query).toBe(".nested");
			expect(nestedSelector.declarations).toEqual({ padding: "1rem" });
			expect(media.children).toContainEqual(nestedSelector);
		});

		it("should support nested media creation in selector context", () => {
			const context = createDeclarationsCallbackContext(selector, root);

			const nestedMedia = context.media("(hover: hover)", {
				opacity: "0.8",
			});

			expect(nestedMedia.type).toBe("at-rule");
			expect(nestedMedia.identifier).toBe("media");
			expect(nestedMedia.rule).toBe("(hover: hover)");
			expect(nestedMedia.declarations).toEqual({ opacity: "0.8" });
			expect(selector.children).toContainEqual(nestedMedia);
		});
	});

	describe("function independence", () => {
		it("should create independent function instances for different contexts", () => {
			const context1 = createDeclarationsCallbackContext(root, root);
			const context2 = createDeclarationsCallbackContext(selector, root);

			expect(context1.variable).not.toBe(context2.variable);
			expect(context1.selector).not.toBe(context2.selector);
			expect(context1.media).not.toBe(context2.media);
		});

		it("should create functions that operate on different parent containers", () => {
			const root1 = createRoot();
			const root2 = createRoot();

			const context1 = createDeclarationsCallbackContext(root1, root1);
			const context2 = createDeclarationsCallbackContext(root2, root2);

			context1.variable("var1", "value1");
			context2.variable("var2", "value2");

			expect(root1.variables).toHaveLength(1);
			expect(root2.variables).toHaveLength(1);
			expect(root1.variables[0]).not.toEqual(root2.variables[0]);
		});
	});

	describe("container type handling", () => {
		it("should work with all Container union types", () => {
			const containers: Container[] = [root, selector, media];

			containers.forEach((container) => {
				const context = createDeclarationsCallbackContext(container, root);

				expect(context).toHaveProperty("variable");
				expect(context).toHaveProperty("selector");
				expect(context).toHaveProperty("media");
			});
		});

		it("should maintain proper parent-child relationships for different container types", () => {
			const contexts = [
				{ parent: root, name: "root" },
				{ parent: selector, name: "selector" },
				{ parent: media, name: "media" },
			];

			contexts.forEach(({ parent, name }) => {
				const context = createDeclarationsCallbackContext(parent, root);
				const initialVariablesCount = parent.variables.length;

				context.variable(`${name}-var`, "test");

				expect(parent.variables).toHaveLength(initialVariablesCount + 1);

				const lastVar = parent.variables[
					parent.variables.length - 1
				] as Variable;
				expect(lastVar.type).toBe("variable");
			});
		});
	});

	describe("root parameter handling", () => {
		it("should pass root parameter correctly to all created functions", () => {
			const customRoot = createRoot();
			const context = createDeclarationsCallbackContext(selector, customRoot);

			// The functions should use the passed root, but this is primarily internal
			// We can verify they work correctly by checking the functions execute
			const testVar = context.variable("test", "value");
			const testSelector = context.selector(".test", {});
			const testMedia = context.media("(test)", {});

			expect(testVar).toBeDefined();
			expect(testSelector).toBeDefined();
			expect(testMedia.type).toBe("at-rule");
		});

		it("should handle when parent and root are the same", () => {
			const context = createDeclarationsCallbackContext(root, root);

			const testVar = context.variable("root-var", "value");

			expect(testVar.name).toBe("root-var");
			expect(root.variables).toContainEqual(testVar);
		});

		it("should handle when parent and root are different", () => {
			const differentRoot = createRoot();
			const context = createDeclarationsCallbackContext(
				selector,
				differentRoot,
			);

			const testVar = context.variable("different-root-var", "value");

			expect(testVar.name).toBe("different-root-var");
			expect(selector.variables).toContainEqual(testVar);
			expect(differentRoot.variables).not.toContainEqual(testVar);
		});
	});

	describe("context object properties", () => {
		it("should return object with the expected properties", () => {
			const context = createDeclarationsCallbackContext(root, root);
			const keys = Object.keys(context);

			expect(keys).toHaveLength(8);
			expect(keys).toContain("atRule");
			expect(keys).toContain("variable");
			expect(keys).toContain("property");
			expect(keys).toContain("selector");
			expect(keys).toContain("keyframes");
			expect(keys).toContain("media");
			expect(keys).toContain("css");
			expect(keys).toContain("ref");
		});

		it("should not have enumerable prototype properties", () => {
			const context = createDeclarationsCallbackContext(root, root);

			expect(Object.hasOwn(context, "variable")).toBe(true);
			expect(Object.hasOwn(context, "selector")).toBe(true);
			expect(Object.hasOwn(context, "keyframes")).toBe(true);
			expect(Object.hasOwn(context, "media")).toBe(true);
		});

		it("should return functions with correct return types", () => {
			const context = createDeclarationsCallbackContext(root, root);

			const varResult = context.variable("test-var", "value");
			const selectorResult = context.selector(".test", {});
			const keyframesResult = context.keyframes("test-animation", {
				"0%": { opacity: 0 },
				"100%": { opacity: 1 },
			});
			const mediaResult = context.media("(test)", {});

			expect(varResult.type).toBe("variable");
			expect(selectorResult.type).toBe("selector");
			expect(keyframesResult.type).toBe("at-rule");
			expect(mediaResult.type).toBe("at-rule");
		});
	});

	describe("real-world usage patterns", () => {
		it("should support chaining multiple function calls", () => {
			const context = createDeclarationsCallbackContext(root, root);

			const primaryColor = context.variable("primary-color", "#006cff");
			context.selector(".button", {
				backgroundColor: primaryColor.value as string,
			});

			context.media("(min-width: 768px)", ({ selector }) => {
				selector(".button", {
					padding: "1rem 2rem",
				});
			});

			expect(root.children).toHaveLength(2); // selector + media
			expect(root.variables).toHaveLength(1); // variable
		});

		it("should work in complex nested scenarios", () => {
			const context = createDeclarationsCallbackContext(root, root);

			context.selector(".component", ({ variable, media }) => {
				const componentSpacing = variable("component-spacing", "1rem");

				media("(min-width: 768px)", {
					padding: componentSpacing.value as string,
				});

				return {
					display: "block",
				};
			});

			expect(root.children).toHaveLength(1); // main selector
			const mainSelector = root.children[0] as Selector;
			expect(mainSelector.children).toHaveLength(1); // media
			expect(mainSelector.variables).toHaveLength(1); // variable
		});

		it("should support design system patterns", () => {
			const context = createDeclarationsCallbackContext(root, root);

			// Define tokens
			const spacing = context.variable("spacing-md", "1rem");
			const color = context.variable("color-primary", "#006cff");

			// Create component with responsive behavior
			context.selector(".card", ({ media }) => {
				media("(min-width: 768px)", {
					padding: "1.5rem",
				});

				return {
					padding: spacing.value as string,
					borderColor: color.value as string,
				};
			});

			expect(root.children).toHaveLength(1); // 1 selector
			expect(root.variables).toHaveLength(2); // 2 variables
		});
	});

	describe("error handling and edge cases", () => {
		it("should handle empty containers", () => {
			const emptySelector: Selector = {
				type: "selector",
				id: "test-id",
				query: "",
				variables: [],
				declarations: {},
				children: [],
			};

			const context = createDeclarationsCallbackContext(emptySelector, root);

			expect(() => context.variable("test", "value")).not.toThrow();
			expect(() => context.selector(".test", {})).not.toThrow();
			expect(() => context.media("(test)", {})).not.toThrow();
		});

		it("should handle containers with existing children", () => {
			const existingVar = {
				type: "variable" as const,
				id: "test-id",
				name: "existing",
				value: "value",
			};

			selector.variables.push(existingVar);
			const initialLength = selector.variables.length;

			const context = createDeclarationsCallbackContext(selector, root);
			context.variable("new-var", "new-value");

			expect(selector.variables).toHaveLength(initialLength + 1);
			expect(selector.variables).toContain(existingVar);
		});
	});

	describe("type consistency", () => {
		it("should maintain type consistency across function calls", () => {
			const context = createDeclarationsCallbackContext(root, root);

			// All functions should work with the same interfaces they would individually
			const variableFunction = createVariableFunction(root, root);
			const _selectorFunction = createSelectorFunction(root, root);
			const _mediaFunction = createAtRuleFunction(root, root);

			// Context functions should behave identically
			const contextVar = context.variable("test1", "value1");
			const directVar = variableFunction("test2", "value2");

			expect(contextVar.type).toBe(directVar.type);
			expect(typeof contextVar.name).toBe(typeof directVar.name);
			expect(typeof contextVar.value).toBe(typeof directVar.value);
		});
	});
});
