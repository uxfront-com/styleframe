import {
	isInstanceLicenseRequired,
	LICENSE_PROPERTY_NAME,
	markInstanceLicenseRequired,
} from "@styleframe/license";
import { describe, expect, it, beforeEach } from "vitest";

import { styleframe } from "../styleframe";
import type { Styleframe } from "../styleframe";
import { createRoot } from "../tokens/root";
import { createThemeFunction } from "../tokens/theme";
import { createVariableFunction } from "../tokens/variable";
import type { Container, Root } from "../types";
import { merge, mergeVariablesArray, mergeThemesArray, mergeContainers } from "./merge";

describe("mergeVariablesArray", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
	});

	describe("basic functionality", () => {
		it("should merge two variable arrays", () => {
			const varA = variable("color-primary", "#3b82f6");
			const varB = variable("color-secondary", "#64748b");

			const result = mergeVariablesArray([varA], [varB]);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual(varA);
			expect(result[1]).toEqual(varB);
		});

		it("should override existing variable values", () => {
			const varA1 = variable("color-primary", "#3b82f6");
			const varA2 = variable("color-secondary", "#64748b");
			const varB = variable("color-primary", "#ef4444");

			const result = mergeVariablesArray([varA1, varA2], [varB]);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				type: "variable",
				id: expect.any(String),
				name: "color-primary",
				value: "#ef4444",
				parentId: expect.any(String),
			});
			expect(result[1]).toEqual({
				type: "variable",
				id: expect.any(String),
				name: "color-secondary",
				value: "#64748b",
				parentId: expect.any(String),
			});
		});

		it("should not modify the original arrays", () => {
			const varA = variable("spacing", "1rem");
			const varB = variable("padding", "2rem");

			const a = [varA];
			const b = [varB];
			const originalALength = a.length;
			const originalBLength = b.length;

			mergeVariablesArray(a, b);

			expect(a).toHaveLength(originalALength);
			expect(b).toHaveLength(originalBLength);
		});
	});

	describe("edge cases", () => {
		it("should handle empty first array", () => {
			const varB = variable("color", "red");

			const result = mergeVariablesArray([], [varB]);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(varB);
		});

		it("should handle empty second array", () => {
			const varA = variable("color", "blue");

			const result = mergeVariablesArray([varA], []);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(varA);
		});

		it("should handle both arrays empty", () => {
			const result = mergeVariablesArray([], []);

			expect(result).toHaveLength(0);
		});

		it("should handle multiple overrides", () => {
			const varA1 = variable("var1", "a");
			const varA2 = variable("var2", "b");
			const varA3 = variable("var3", "c");
			const varB1 = variable("var1", "x");
			const varB2 = variable("var3", "z");

			const result = mergeVariablesArray([varA1, varA2, varA3], [varB1, varB2]);

			expect(result).toHaveLength(3);
			expect(result[0]).toMatchObject({ value: "x" });
			expect(result[1]).toMatchObject({ value: "b" });
			expect(result[2]).toMatchObject({ value: "z" });
		});
	});

	describe("variable matching", () => {
		it("should match variables by name", () => {
			const varA = variable("test-var", "old");
			const varB = variable("test-var", "new");

			const result = mergeVariablesArray([varA], [varB]);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({ value: "new" });
		});

		it("should be case-sensitive when matching", () => {
			const varA = variable("Color", "red");
			const varB = variable("color", "blue");

			const result = mergeVariablesArray([varA], [varB]);

			expect(result).toHaveLength(2);
		});

		it("should handle special characters in variable names", () => {
			const varA = variable("color--primary-500", "#000");
			const varB = variable("color--primary-500", "#fff");

			const result = mergeVariablesArray([varA], [varB]);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({ value: "#fff" });
		});
	});
});

describe("mergeThemesArray", () => {
	let root: Root;
	let theme: ReturnType<typeof createThemeFunction>;

	beforeEach(() => {
		root = createRoot();
		theme = createThemeFunction(root, root);
	});

	describe("basic functionality", () => {
		it("should merge two theme arrays", () => {
			const themeA = theme("light", () => {});
			const themeB = theme("dark", () => {});

			const result = mergeThemesArray([themeA], [themeB]);

			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({ name: "light" });
			expect(result[1]).toMatchObject({ name: "dark" });
		});

		it("should merge themes with the same name", () => {
			const themeA = theme("dark", (ctx) => {
				ctx.variable("bg", "#000");
			});
			// Manually add declarations to test merge
			themeA.declarations.color = "white";

			const themeB = theme("dark", (ctx) => {
				ctx.variable("text", "#fff");
			});
			themeB.declarations.backgroundColor = "black";

			const result = mergeThemesArray([themeA], [themeB]);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				name: "dark",
				declarations: {
					color: "white",
					backgroundColor: "black",
				},
			});
			expect(result[0]).toHaveProperty("variables");
			expect(result[0]?.variables).toHaveLength(2);
		});

		it("should not modify the original arrays", () => {
			const themeA = theme("light", () => {});
			const themeB = theme("dark", () => {});

			const a = [themeA];
			const b = [themeB];
			const originalALength = a.length;
			const originalBLength = b.length;

			mergeThemesArray(a, b);

			expect(a).toHaveLength(originalALength);
			expect(b).toHaveLength(originalBLength);
		});
	});

	describe("edge cases", () => {
		it("should handle empty first array", () => {
			const themeB = theme("test", () => {});

			const result = mergeThemesArray([], [themeB]);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({ name: "test" });
		});

		it("should handle empty second array", () => {
			const themeA = theme("test", () => {});

			const result = mergeThemesArray([themeA], []);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({ name: "test" });
		});

		it("should handle both arrays empty", () => {
			const result = mergeThemesArray([], []);

			expect(result).toHaveLength(0);
		});
	});

	describe("theme matching", () => {
		it("should match themes by name", () => {
			const themeA = theme("primary", () => {});
			themeA.declarations.old = "value";

			const themeB = theme("primary", () => {});
			themeB.declarations.new = "value";

			const result = mergeThemesArray([themeA], [themeB]);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				declarations: {
					old: "value",
					new: "value",
				},
			});
		});

		it("should be case-sensitive when matching", () => {
			const themeA = theme("Dark", () => {});
			const themeB = theme("dark", () => {});

			const result = mergeThemesArray([themeA], [themeB]);

			expect(result).toHaveLength(2);
		});
	});
});

describe("mergeContainers", () => {
	describe("basic functionality", () => {
		it("should merge two containers", () => {
			const a: Container = {
				id: "a",
				variables: [{ type: "variable", id: "test-id", name: "var1", value: "a" }],
				declarations: { color: "red" },
				children: [],
			};
			const b: Container = {
				id: "b",
				variables: [{ type: "variable", id: "test-id", name: "var2", value: "b" }],
				declarations: { backgroundColor: "blue" },
				children: [],
			};

			const result = mergeContainers(a, b);

			expect(result.variables).toHaveLength(2);
			expect(result.declarations).toEqual({
				color: "red",
				backgroundColor: "blue",
			});
		});

		it("should merge declarations by spreading", () => {
			const a: Container = {
				id: "a",
				variables: [],
				declarations: { color: "red", padding: "10px" },
				children: [],
			};
			const b: Container = {
				id: "b",
				variables: [],
				declarations: { color: "blue", margin: "20px" },
				children: [],
			};

			const result = mergeContainers(a, b);

			expect(result.declarations).toEqual({
				color: "blue",
				padding: "10px",
				margin: "20px",
			});
		});

		it("should concatenate children arrays", () => {
			const selector1 = {
				type: "selector" as const,
				id: "test-id",
				query: ".button",
				declarations: {},
				variables: [],
				children: [],
			};
			const selector2 = {
				type: "selector" as const,
				id: "test-id",
				query: ".card",
				declarations: {},
				variables: [],
				children: [],
			};

			const a: Container = {
				id: "a",
				variables: [],
				declarations: {},
				children: [selector1],
			};
			const b: Container = {
				id: "b",
				variables: [],
				declarations: {},
				children: [selector2],
			};

			const result = mergeContainers(a, b);

			expect(result.children).toHaveLength(2);
			expect(result.children[0]).toBe(selector1);
			expect(result.children[1]).toBe(selector2);
		});
	});

	describe("with Root containers", () => {
		it("should merge themes on Root containers", () => {
			const a: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [],
				recipes: [],
				variables: [],
				children: [],
				themes: [
					{
						type: "theme",
						id: "test-id",
						name: "light",
						declarations: {},
						variables: [],
						children: [],
					},
				],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};
			const b: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [],
				recipes: [],
				variables: [],
				children: [],
				themes: [
					{
						type: "theme",
						id: "test-id",
						name: "dark",
						declarations: {},
						variables: [],
						children: [],
					},
				],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};

			const result = mergeContainers(a, b);

			expect(result.themes).toHaveLength(2);
			expect(result.themes[0]).toMatchObject({ name: "light" });
			expect(result.themes[1]).toMatchObject({ name: "dark" });
		});

		it("should concatenate utilities arrays", () => {
			const mockAutogenerate = () => ({});
			const mockCreate = () => {};
			const a: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [
					{
						type: "utility",
						name: "padding",
						factory: () => {},
						values: [],
						autogenerate: mockAutogenerate,
						create: mockCreate,
					},
				],
				modifiers: [],
				recipes: [],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};
			const b: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [
					{
						type: "utility",
						name: "margin",
						factory: () => {},
						values: [],
						autogenerate: mockAutogenerate,
						create: mockCreate,
					},
				],
				modifiers: [],
				recipes: [],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};

			const result = mergeContainers(a, b);

			expect(result.utilities).toHaveLength(2);
			expect(result.utilities[0]).toMatchObject({ name: "padding" });
			expect(result.utilities[1]).toMatchObject({ name: "margin" });
		});

		it("should concatenate modifiers arrays", () => {
			const a: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [
					{
						type: "modifier",
						key: ["hover"],
						factory: () => {},
					},
				],
				recipes: [],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};
			const b: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [
					{
						type: "modifier",
						key: ["focus"],
						factory: () => {},
					},
				],
				recipes: [],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};

			const result = mergeContainers(a, b);

			expect(result.modifiers).toHaveLength(2);
			expect(result.modifiers[0]).toMatchObject({ key: ["hover"] });
			expect(result.modifiers[1]).toMatchObject({ key: ["focus"] });
		});

		it("should concatenate recipes arrays", () => {
			const a: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [],
				recipes: [
					{
						type: "recipe",
						name: "button",
						variants: {},
					},
				],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};
			const b: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [],
				recipes: [
					{
						type: "recipe",
						name: "card",
						variants: {},
					},
				],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};

			const result = mergeContainers(a, b);

			expect(result.recipes).toHaveLength(2);
			expect(result.recipes[0]).toMatchObject({ name: "button" });
			expect(result.recipes[1]).toMatchObject({ name: "card" });
		});
	});

	describe("edge cases", () => {
		it("should handle empty containers", () => {
			const a: Container = {
				id: "a",
				variables: [],
				declarations: {},
				children: [],
			};
			const b: Container = {
				id: "b",
				variables: [],
				declarations: {},
				children: [],
			};

			const result = mergeContainers(a, b);

			expect(result.variables).toHaveLength(0);
			expect(result.declarations).toEqual({});
			expect(result.children).toHaveLength(0);
		});

		it("should preserve non-container properties", () => {
			const a: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [],
				recipes: [],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};
			const b: Root = {
				type: "root",
				id: "test-id",
				declarations: {},
				utilities: [],
				modifiers: [],
				recipes: [],
				variables: [],
				children: [],
				themes: [],
				_registry: new Map(),
				_usage: {
					variables: new Set(),
					utilities: new Set(),
					recipes: new Set(),
					recipeUtilities: new Map(),
				},
			};

			const result = mergeContainers(a, b);

			expect(result.type).toBe("root");
		});
	});
});

describe("merge", () => {
	let base: Styleframe;
	let extension: Styleframe;

	beforeEach(() => {
		base = styleframe();
		extension = styleframe();
	});

	describe("basic usage", () => {
		it("should merge two Styleframe instances", () => {
			base.variable("color-primary", "#3b82f6");
			extension.variable("color-secondary", "#64748b");

			const result = merge(base, extension);

			expect(result.root.variables).toHaveLength(2);
			expect(result.root.variables[0]).toMatchObject({
				name: "color-primary",
			});
			expect(result.root.variables[1]).toMatchObject({
				name: "color-secondary",
			});
		});

		it("should return a new Styleframe instance", () => {
			const result = merge(base, extension);

			expect(result).not.toBe(base);
			expect(result).not.toBe(extension);
		});

		it("should not modify original instances", () => {
			base.variable("original", "value");
			extension.variable("new", "value");

			const originalBaseVarCount = base.root.variables.length;

			merge(base, extension);

			expect(base.root.variables).toHaveLength(originalBaseVarCount);
		});
	});

	describe("merging multiple instances", () => {
		it("should merge three instances", () => {
			const colors = styleframe();
			const typography = styleframe();
			const spacing = styleframe();

			colors.variable("color-primary", "#3b82f6");
			typography.variable("font-sans", "Inter, sans-serif");
			spacing.variable("spacing-md", "1rem");

			const result = merge(colors, typography, spacing);

			expect(result.root.variables).toHaveLength(3);
			expect(result.root.variables[0]).toMatchObject({
				name: "color-primary",
			});
			expect(result.root.variables[1]).toMatchObject({
				name: "font-sans",
			});
			expect(result.root.variables[2]).toMatchObject({
				name: "spacing-md",
			});
		});

		it("should merge many instances", () => {
			const instances = Array.from({ length: 5 }, () => styleframe());

			instances.forEach((instance, i) => {
				instance.variable(`var-${i}`, `value-${i}`);
			});

			const [first, ...rest] = instances;
			if (!first) {
				throw new Error("First instance is undefined");
			}
			const result = merge(first, ...rest);

			expect(result.root.variables).toHaveLength(5);
		});
	});

	describe("variable override behavior", () => {
		it("should override variables with later declarations", () => {
			base.variable("color-primary", "#3b82f6");
			extension.variable("color-primary", "#ef4444");

			const result = merge(base, extension);

			expect(result.root.variables).toHaveLength(1);
			expect(result.root.variables[0]).toMatchObject({
				value: "#ef4444",
			});
		});

		it("should apply overrides in order from left to right", () => {
			const s1 = styleframe();
			const s2 = styleframe();
			const s3 = styleframe();

			s1.variable("color", "red");
			s2.variable("color", "blue");
			s3.variable("color", "green");

			const result = merge(s1, s2, s3);

			expect(result.root.variables).toHaveLength(1);
			expect(result.root.variables[0]).toMatchObject({ value: "green" });
		});

		it("should keep non-overridden variables", () => {
			base.variable("color-primary", "#3b82f6");
			base.variable("color-secondary", "#64748b");
			extension.variable("color-primary", "#ef4444");

			const result = merge(base, extension);

			expect(result.root.variables).toHaveLength(2);
			expect(result.root.variables[0]).toMatchObject({
				value: "#ef4444",
			});
			expect(result.root.variables[1]).toMatchObject({
				value: "#64748b",
			});
		});
	});

	describe("declarations merge behavior", () => {
		it("should merge declarations from both instances", () => {
			base.selector(".button", {
				padding: "0.5rem 1rem",
			});
			extension.selector(".card", {
				borderRadius: "0.5rem",
			});

			const result = merge(base, extension);

			expect(result.root.children).toHaveLength(2);
		});

		it("should override declarations with same property", () => {
			base.selector(".element", {
				color: "red",
				padding: "10px",
			});
			extension.selector(".element", {
				color: "blue",
			});

			const result = merge(base, extension);

			expect(result.root.children).toHaveLength(2);
		});
	});

	describe("utilities concatenation", () => {
		it("should concatenate utilities from both instances", () => {
			base.utility("text", (ctx) => {
				ctx.selector(String.raw`&.text\:sm`, { fontSize: "0.875rem" });
				ctx.selector(String.raw`&.text\:md`, { fontSize: "1rem" });
			});
			extension.utility("text", (ctx) => {
				ctx.selector(String.raw`&.text\:lg`, { fontSize: "1.125rem" });
				ctx.selector(String.raw`&.text\:xl`, { fontSize: "1.25rem" });
			});

			const result = merge(base, extension);

			expect(result.root.utilities).toHaveLength(2);
			expect(result.root.utilities[0]).toMatchObject({ name: "text" });
			expect(result.root.utilities[1]).toMatchObject({ name: "text" });
		});

		it("should preserve all utilities even with same name", () => {
			base.utility("spacing", (ctx) => {
				ctx.selector(String.raw`&.spacing\:sm`, { padding: "0.5rem" });
			});
			extension.utility("spacing", (ctx) => {
				ctx.selector(String.raw`&.spacing\:lg`, { padding: "2rem" });
			});

			const result = merge(base, extension);

			expect(result.root.utilities).toHaveLength(2);
		});
	});

	describe("modifiers concatenation", () => {
		it("should concatenate modifiers from both instances", () => {
			base.modifier(["hover", "h"], (ctx) => {
				ctx.selector("&:hover", {});
			});
			extension.modifier(["focus", "f"], (ctx) => {
				ctx.selector("&:focus", {});
			});

			const result = merge(base, extension);

			expect(result.root.modifiers).toHaveLength(2);
		});
	});

	describe("recipes concatenation", () => {
		it("should concatenate recipes from both instances", () => {
			const createFontSize = base.utility("fontSize", ({ value }) => ({
				fontSize: value,
			}));
			createFontSize({ "0.875rem": "0.875rem", "1.125rem": "1.125rem" });
			const createBoxShadow = extension.utility("boxShadow", ({ value }) => ({
				boxShadow: value,
			}));
			createBoxShadow({
				"0 1px 2px rgba(0,0,0,0.1)": "0 1px 2px rgba(0,0,0,0.1)",
				"0 4px 6px rgba(0,0,0,0.1)": "0 4px 6px rgba(0,0,0,0.1)",
			});

			base.recipe({
				name: "button",
				variants: {
					size: {
						sm: { fontSize: "0.875rem" },
						lg: { fontSize: "1.125rem" },
					},
				},
			});
			extension.recipe({
				name: "card",
				variants: {
					elevation: {
						low: { boxShadow: "0 1px 2px rgba(0,0,0,0.1)" },
						high: { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
					},
				},
			});

			const result = merge(base, extension);

			expect(result.root.recipes).toHaveLength(2);
			expect(result.root.recipes[0]).toMatchObject({ name: "button" });
			expect(result.root.recipes[1]).toMatchObject({ name: "card" });
		});
	});

	describe("themes merge behavior", () => {
		it("should merge different themes", () => {
			base.theme("light", (ctx) => {
				ctx.variable("bg-primary", "#ffffff");
			});
			extension.theme("dark", (ctx) => {
				ctx.variable("bg-primary", "#1f2937");
			});

			const result = merge(base, extension);

			expect(result.root.themes).toHaveLength(2);
			expect(result.root.themes[0]).toMatchObject({ name: "light" });
			expect(result.root.themes[1]).toMatchObject({ name: "dark" });
		});

		it("should merge themes with same name", () => {
			base.theme("dark", (ctx) => {
				ctx.variable("bg", "#000");
			});
			extension.theme("dark", (ctx) => {
				ctx.variable("text", "#fff");
			});

			const result = merge(base, extension);

			expect(result.root.themes).toHaveLength(1);
			expect(result.root.themes[0]).toMatchObject({ name: "dark" });
			expect(result.root.themes[0]).toHaveProperty("variables");
			expect(result.root.themes[0]?.variables).toHaveLength(2);
		});
	});

	describe("complex merging scenarios", () => {
		it("should handle merging with all property types", () => {
			base.variable("base-color", "#000");
			base.selector(".base", {});
			base.utility("base-util", () => {});
			base.modifier(["base"], () => {});
			base.recipe({ name: "base-recipe" });
			base.theme("base-theme", () => {});

			extension.variable("ext-color", "#fff");
			extension.selector(".ext", {});
			extension.utility("ext-util", () => {});
			extension.modifier(["ext"], () => {});
			extension.recipe({ name: "ext-recipe" });
			extension.theme("ext-theme", () => {});

			const result = merge(base, extension);

			expect(result.root.variables).toHaveLength(2);
			expect(result.root.children).toHaveLength(2);
			expect(result.root.utilities).toHaveLength(2);
			expect(result.root.modifiers).toHaveLength(2);
			expect(result.root.recipes).toHaveLength(2);
			expect(result.root.themes).toHaveLength(2);
		});

		it("should preserve order of merge operations", () => {
			const s1 = styleframe();
			const s2 = styleframe();
			const s3 = styleframe();

			s1.variable("order", "1");
			s2.variable("order", "2");
			s3.variable("order", "3");

			const result = merge(s1, s2, s3);

			expect(result.root.variables[0]).toMatchObject({ value: "3" });
		});
	});

	describe("options preservation", () => {
		it("should preserve options from merged instances", () => {
			const baseWithOptions = styleframe();
			const ext = styleframe();

			const result = merge(baseWithOptions, ext);

			expect(result.options).toBeDefined();
		});
	});

	describe("edge cases", () => {
		it("should handle merging with empty instances", () => {
			const empty1 = styleframe();
			const empty2 = styleframe();

			const result = merge(empty1, empty2);

			expect(result.root.variables).toHaveLength(0);
			expect(result.root.children).toHaveLength(0);
		});

		it("should handle merging single instance", () => {
			base.variable("test", "value");

			const result = merge(base);

			expect(result.root.variables).toHaveLength(1);
			expect(result.root.variables[0]).toMatchObject({ value: "value" });
		});

		it("should handle nested selectors", () => {
			base.selector(".parent", (ctx) => {
				ctx.selector(".child", {});
			});
			extension.selector(".other", (ctx) => {
				ctx.selector(".nested", {});
			});

			const result = merge(base, extension);

			expect(result.root.children).toHaveLength(2);
		});
	});

	describe("practical examples from documentation", () => {
		it("should merge base and extension as shown in basic usage", () => {
			const baseInstance = styleframe();
			baseInstance.variable("color--primary", "#3b82f6");
			baseInstance.selector(".button", {
				padding: "0.5rem 1rem",
				borderRadius: "0.25rem",
			});

			const extensionInstance = styleframe();
			extensionInstance.variable("color--secondary", "#64748b");
			extensionInstance.selector(".card", {
				padding: "1rem",
				borderRadius: "0.5rem",
			});

			const result = merge(baseInstance, extensionInstance);

			expect(result.root.variables).toHaveLength(2);
			expect(result.root.children).toHaveLength(2);
		});

		it("should merge colors, typography, and spacing modules", () => {
			const colors = styleframe();
			colors.variable("color--primary", "#3b82f6");
			colors.variable("color--secondary", "#64748b");

			const typography = styleframe();
			typography.variable("font--sans", "Inter, system-ui, sans-serif");
			typography.variable("font--mono", "Fira Code, monospace");

			const spacing = styleframe();
			spacing.variable("spacing--sm", "0.5rem");
			spacing.variable("spacing--md", "1rem");
			spacing.variable("spacing--lg", "2rem");

			const result = merge(colors, typography, spacing);

			expect(result.root.variables).toHaveLength(7);
		});

		it("should override base variables with extension", () => {
			const baseInstance = styleframe();
			baseInstance.variable("color--primary", "#3b82f6");
			baseInstance.variable("color--secondary", "#64748b");

			const override = styleframe();
			override.variable("color--primary", "#ef4444");

			const result = merge(baseInstance, override);

			expect(result.root.variables).toHaveLength(2);
			expect(result.root.variables[0]).toMatchObject({
				value: "#ef4444",
			});
			expect(result.root.variables[1]).toMatchObject({
				value: "#64748b",
			});
		});
	});

	describe("license", () => {
		it("should preserve license status when merging as base", () => {
			const base = styleframe();
			const extension = styleframe();

			markInstanceLicenseRequired(base);

			const result = merge(base, extension);

			expect((result as any)[LICENSE_PROPERTY_NAME]).toBe(true);
		});

		it("should preserve license status when merging as extension", () => {
			const base = styleframe();
			const extension = styleframe();

			markInstanceLicenseRequired(extension);

			const result = merge(base, extension);

			// The merge function returns a new object with spread operator,
			// which should copy the non-enumerable property descriptor
			// if the extension is the last one merged
			expect((result as any)[LICENSE_PROPERTY_NAME]).toBe(true);
		});

		it("should preserve license status when merging multiple instances", () => {
			const s1 = styleframe();
			const s2 = styleframe();
			const s3 = styleframe();

			markInstanceLicenseRequired(s1);

			const result = merge(s1, s2, s3);

			expect((result as any)[LICENSE_PROPERTY_NAME]).toBe(true);
		});

		it("should preserve license status from base even with multiple unmarked extensions", () => {
			const base = styleframe();
			const ext1 = styleframe();
			const ext2 = styleframe();
			const ext3 = styleframe();

			markInstanceLicenseRequired(base);

			const result = merge(base, ext1, ext2, ext3);

			expect((result as any)[LICENSE_PROPERTY_NAME]).toBe(true);
		});

		it("should handle merge with both instances marked", () => {
			const s1 = styleframe();
			const s2 = styleframe();

			markInstanceLicenseRequired(s1);
			markInstanceLicenseRequired(s2);

			const result = merge(s1, s2);

			expect((result as any)[LICENSE_PROPERTY_NAME]).toBe(true);
		});

		it("should keep license status after merging with content", () => {
			const base = styleframe();
			base.variable("color-primary", "#3b82f6");

			const extension = styleframe();
			extension.variable("color-secondary", "#64748b");

			markInstanceLicenseRequired(base);

			const result = merge(base, extension);

			expect((result as any)[LICENSE_PROPERTY_NAME]).toBe(true);
			expect(result.root.variables.length).toBe(2);
		});

		it("should preserve immutability after merge", () => {
			const base = styleframe();
			const extension = styleframe();

			markInstanceLicenseRequired(base);

			const result = merge(base, extension);

			// Should still be true due to non-writable descriptor
			expect(isInstanceLicenseRequired(result)).toBe(true);
		});
	});
});
