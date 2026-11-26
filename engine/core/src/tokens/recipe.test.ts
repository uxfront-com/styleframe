import { beforeEach, describe, expect, test, vi } from "vitest";

import type { Root } from "../types";
import { hashValue } from "../utils/hash";
import { createModifierFunction } from "./modifier";
import { createRecipeFunction, processRecipeUtilities, registerRecipeUtilities } from "./recipe";
import { createRoot } from "./root";
import { createUtilityFunction } from "./utility";

describe("createRecipeFunction", () => {
	let root: Root;
	let recipe: ReturnType<typeof createRecipeFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;

	beforeEach(() => {
		root = createRoot();
		recipe = createRecipeFunction(root, root);
		utility = createUtilityFunction(root, root);
	});

	test("should create a recipe function", () => {
		expect(recipe).toBeTypeOf("function");
	});

	test("should register recipe in root.recipes only", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("borderStyle", ({ value }) => ({ borderStyle: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "button",
			base: { borderWidth: "thin", borderStyle: "solid" },
			variants: {
				color: {
					primary: { background: "primary", color: "white" },
					secondary: { background: "secondary", color: "white" },
				},
				size: {
					sm: { padding: "sm" },
					md: { padding: "md" },
					lg: { padding: "lg" },
				},
			},
		});

		expect(instance.type).toBe("recipe");
		expect(instance.name).toBe("button");
		expect(instance.base).toEqual({
			borderWidth: "thin",
			borderStyle: "solid",
		});
		expect(instance.variants).toEqual({
			color: {
				primary: { background: "primary", color: "white" },
				secondary: { background: "secondary", color: "white" },
			},
			size: {
				sm: { padding: "sm" },
				md: { padding: "md" },
				lg: { padding: "lg" },
			},
		});

		expect(root.recipes).toHaveLength(1);
		expect(root.recipes[0]).toBe(instance);

		// Ensure no selectors/variables were created (only utilities from registration)
		const nonUtilityChildren = root.children.filter((child) => child.type !== "utility");
		expect(nonUtilityChildren).toHaveLength(0);
	});

	test("should support options: defaultVariants and compoundVariants", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "chip",
			base: { borderWidth: "thin" },
			variants: {
				variant: {
					filled: { background: "primary", color: "white" },
					outline: { background: "transparent", color: "primary" },
				},
				size: {
					sm: { padding: "sm" },
					md: { padding: "md" },
				},
			},
			defaultVariants: { variant: "filled", size: "sm" },
			compoundVariants: [
				{
					match: {
						variant: "filled",
						size: "sm",
					},
					css: { background: "primary", color: "white" },
				},
			],
		});

		expect(instance.defaultVariants).toEqual({
			variant: "filled",
			size: "sm",
		});
		expect(instance.compoundVariants?.length).toBe(1);
		expect(instance.compoundVariants).toEqual([
			{
				match: {
					variant: "filled",
					size: "sm",
				},
				css: { background: "primary", color: "white" },
			},
		]);
	});

	test("should maintain type information for recipe name", () => {
		const instance = recipe({ name: "typed-recipe", base: {}, variants: {} });
		const name: "typed-recipe" = instance.name;
		expect(name).toBe("typed-recipe");
	});
});

describe("processRecipeUtilities", () => {
	let root: Root;
	let recipe: ReturnType<typeof createRecipeFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;

	beforeEach(() => {
		root = createRoot();
		recipe = createRecipeFunction(root, root);
		utility = createUtilityFunction(root, root);
	});

	test("should process base declarations and create utilities", () => {
		// Register utilities
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("borderStyle", ({ value }) => ({ borderStyle: value }));

		const instance = recipe({
			name: "button",
			base: { borderWidth: "thin", borderStyle: "solid" },
			variants: {},
		});

		processRecipeUtilities(instance, root);

		// Should have created 2 utility instances
		expect(root.children).toHaveLength(2);
		expect(root.children[0]).toMatchObject({
			type: "utility",
			name: "borderWidth",
			value: "[thin]",
		});
		expect(root.children[1]).toMatchObject({
			type: "utility",
			name: "borderStyle",
			value: "[solid]",
		});
	});

	test("should process variant declarations and create utilities", () => {
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "blue", color: "white" },
					secondary: { background: "gray", color: "black" },
				},
				size: {
					sm: { padding: "0.5rem" },
					lg: { padding: "1rem" },
				},
			},
		});

		processRecipeUtilities(instance, root);

		// Should have created utilities for all variant values
		const backgroundUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "background",
		);
		const colorUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "color",
		);
		const paddingUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "padding",
		);

		expect(backgroundUtilities).toHaveLength(2);
		expect(colorUtilities).toHaveLength(2);
		expect(paddingUtilities).toHaveLength(2);
	});

	test("should process compoundVariants declarations and create utilities", () => {
		utility("padding", ({ value }) => ({ padding: value }));
		utility("fontWeight", ({ value }) => ({ fontWeight: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: {},
				},
				size: {
					lg: {},
				},
			},
			compoundVariants: [
				{
					match: { color: "primary", size: "lg" },
					css: { padding: "2rem", fontWeight: "bold" },
				},
			],
		});

		processRecipeUtilities(instance, root);

		expect(root.children).toHaveLength(2);
		expect(root.children[0]).toMatchObject({
			type: "utility",
			name: "padding",
			value: "[2rem]",
		});
		expect(root.children[1]).toMatchObject({
			type: "utility",
			name: "fontWeight",
			value: "[bold]",
		});
	});

	test("should process all three locations exhaustively", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("padding", ({ value }) => ({ padding: value }));
		utility("fontWeight", ({ value }) => ({ fontWeight: value }));

		const instance = recipe({
			name: "button",
			base: { borderWidth: "thin" },
			variants: {
				color: {
					primary: { background: "blue" },
				},
				size: {
					sm: { padding: "0.5rem" },
				},
			},
			compoundVariants: [
				{
					match: { color: "primary", size: "sm" },
					css: { fontWeight: "bold" },
				},
			],
		});

		processRecipeUtilities(instance, root);

		const utilityNames = root.children.map((child) =>
			child.type === "utility" ? child.name : null,
		);

		expect(utilityNames).toContain("borderWidth");
		expect(utilityNames).toContain("background");
		expect(utilityNames).toContain("padding");
		expect(utilityNames).toContain("fontWeight");
	});

	test("should throw when utility is not found in registry", () => {
		expect(() =>
			recipe({
				name: "button",
				base: { unknownUtility: "value" },
				variants: {},
			}),
		).toThrow(
			'[styleframe] Utility "unknownUtility" not found in registry. Make sure the utility is registered before using it in a recipe.',
		);
	});

	test("should match camelCase recipe property to kebab-case utility", () => {
		utility("border-radius", ({ value }) => ({ borderRadius: value }));

		const instance = recipe({
			name: "card",
			base: {
				borderRadius: "8px",
			},
			variants: {},
		});

		processRecipeUtilities(instance, root);

		expect(root.children).toHaveLength(1);
		expect(root.children[0]).toEqual(
			expect.objectContaining({
				type: "utility",
				name: "border-radius",
				value: "[8px]",
			}),
		);
	});

	test("should handle empty recipe gracefully", () => {
		const instance = recipe({
			name: "empty",
			variants: {},
		});

		processRecipeUtilities(instance, root);

		expect(root.children).toHaveLength(0);
	});

	test("should handle recipe with only empty base", () => {
		const instance = recipe({
			name: "empty",
			base: {},
			variants: {},
		});

		processRecipeUtilities(instance, root);

		expect(root.children).toHaveLength(0);
	});

	test("should handle recipe with empty variants", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));

		const instance = recipe({
			name: "button",
			base: { borderWidth: "thin" },
			variants: {
				color: {},
				size: {},
			},
		});

		processRecipeUtilities(instance, root);

		expect(root.children).toHaveLength(1);
	});

	test("should handle recipe with empty compoundVariants array", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));

		const instance = recipe({
			name: "button",
			base: { borderWidth: "thin" },
			variants: {},
			compoundVariants: [],
		});

		processRecipeUtilities(instance, root);

		expect(root.children).toHaveLength(1);
	});

	test("should handle boolean values", () => {
		utility("hidden", ({ value }) => ({
			display: value === true ? "none" : "block",
		}));

		const instance = recipe({
			name: "element",
			base: { hidden: true },
			variants: {},
		});

		processRecipeUtilities(instance, root);

		expect(root.children).toHaveLength(1);
		expect(root.children[0]).toMatchObject({
			type: "utility",
			name: "hidden",
			value: "[true]",
		});
	});

	test("should process multiple variant groups correctly", () => {
		utility("background", ({ value }) => ({ background: value }));
		utility("padding", ({ value }) => ({ padding: value }));
		utility("fontSize", ({ value }) => ({ fontSize: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "blue" },
					secondary: { background: "gray" },
					tertiary: { background: "green" },
				},
				size: {
					sm: { padding: "0.5rem", fontSize: "0.875rem" },
					md: { padding: "1rem", fontSize: "1rem" },
					lg: { padding: "1.5rem", fontSize: "1.25rem" },
				},
			},
		});

		processRecipeUtilities(instance, root);

		const backgroundUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "background",
		);
		const paddingUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "padding",
		);
		const fontSizeUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "fontSize",
		);

		expect(backgroundUtilities).toHaveLength(3);
		expect(paddingUtilities).toHaveLength(3);
		expect(fontSizeUtilities).toHaveLength(3);
	});

	test("should process multiple compoundVariants correctly", () => {
		utility("padding", ({ value }) => ({ padding: value }));
		utility("margin", ({ value }) => ({ margin: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: {},
					secondary: {},
				},
				size: {
					sm: {},
					lg: {},
				},
			},
			compoundVariants: [
				{
					match: { color: "primary", size: "sm" },
					css: { padding: "0.5rem" },
				},
				{
					match: { color: "primary", size: "lg" },
					css: { padding: "2rem" },
				},
				{
					match: { color: "secondary", size: "sm" },
					css: { margin: "1rem" },
				},
			],
		});

		processRecipeUtilities(instance, root);

		const paddingUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "padding",
		);
		const marginUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "margin",
		);

		expect(paddingUtilities).toHaveLength(2);
		expect(marginUtilities).toHaveLength(1);
	});

	test("should throw when one utility is missing from registry", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		// Note: borderStyle utility is NOT registered

		expect(() =>
			recipe({
				name: "button",
				base: { borderWidth: "thin", borderStyle: "solid" },
				variants: {},
			}),
		).toThrow(
			'[styleframe] Utility "borderStyle" not found in registry. Make sure the utility is registered before using it in a recipe.',
		);
	});

	describe("modifier support", () => {
		let modifier: ReturnType<typeof createModifierFunction>;

		beforeEach(() => {
			modifier = createModifierFunction(root, root);
		});

		test("should process modifier blocks in base declarations", () => {
			utility("background", ({ value }) => ({ background: value }));
			utility("boxShadow", ({ value }) => ({ boxShadow: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				base: {
					background: "blue",
					hover: {
						boxShadow: "lg",
					},
				},
				variants: {},
			});

			processRecipeUtilities(instance, root);

			// Should have created:
			// 1. background utility without modifier
			// 2. boxShadow utility without modifier (base)
			// 3. boxShadow utility with hover modifier
			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);
			const boxShadowUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "boxShadow",
			);

			expect(backgroundUtilities).toHaveLength(1);
			expect(boxShadowUtilities).toHaveLength(2); // base + hover modified

			// Check that one has the hover modifier
			const hoverBoxShadow = boxShadowUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBoxShadow).toBeDefined();
		});

		test("should process compound modifiers like hover:focus", () => {
			utility("boxShadow", ({ value }) => ({ boxShadow: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});
			modifier("focus", ({ selector }) => {
				selector("&:focus", {});
			});

			const instance = recipe({
				name: "button",
				base: {
					"hover:focus": {
						boxShadow: "sm",
					},
				},
				variants: {},
			});

			processRecipeUtilities(instance, root);

			// Should create modified utilities with both hover and focus
			const boxShadowUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "boxShadow",
			);

			// Base utility + combinations with hover, focus, and hover+focus
			expect(boxShadowUtilities.length).toBeGreaterThanOrEqual(1);

			// Check that there's a utility with both modifiers
			const hoverFocusBoxShadow = boxShadowUtilities.find(
				(u) =>
					u.type === "utility" && u.modifiers?.includes("hover") && u.modifiers?.includes("focus"),
			);
			expect(hoverFocusBoxShadow).toBeDefined();
		});

		test("should process modifier blocks in variant declarations", () => {
			utility("background", ({ value }) => ({ background: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				variants: {
					color: {
						primary: {
							background: "blue",
							hover: {
								background: "darkblue",
							},
						},
					},
				},
			});

			processRecipeUtilities(instance, root);

			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);

			// Should have created utilities for both values with hover modifier variants
			expect(backgroundUtilities.length).toBeGreaterThanOrEqual(2);

			// Check that there's a hover-modified background utility
			const hoverBackground = backgroundUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBackground).toBeDefined();
		});

		test("should process modifier blocks in compoundVariants", () => {
			utility("background", ({ value }) => ({ background: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				variants: {
					color: {
						primary: {},
					},
					disabled: {
						false: {},
					},
				},
				compoundVariants: [
					{
						match: { color: "primary", disabled: "false" },
						css: {
							hover: {
								background: "primary-shade-50",
							},
						},
					},
				],
			});

			processRecipeUtilities(instance, root);

			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);

			expect(backgroundUtilities.length).toBeGreaterThanOrEqual(1);

			const hoverBackground = backgroundUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBackground).toBeDefined();
		});

		test("should throw when modifier is not found in registry", () => {
			utility("boxShadow", ({ value }) => ({ boxShadow: value }));
			// Note: hover modifier is NOT registered

			expect(() =>
				recipe({
					name: "button",
					base: {
						hover: {
							boxShadow: "lg",
						},
					},
					variants: {},
				}),
			).toThrow(
				'[styleframe] Modifier "hover" not found in registry. Make sure the modifier is registered before using it in a recipe.',
			);
		});

		test("should strip '&:' prefix and treat '&:hover' the same as 'hover' in base", () => {
			utility("background", ({ value }) => ({ background: value }));
			utility("boxShadow", ({ value }) => ({ boxShadow: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				base: {
					background: "blue",
					"&:hover": {
						boxShadow: "lg",
					},
				},
				variants: {},
			});

			processRecipeUtilities(instance, root);

			const boxShadowUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "boxShadow",
			);

			const hoverBoxShadow = boxShadowUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBoxShadow).toBeDefined();
		});

		test("should strip '&:' prefix in compound variant modifier blocks", () => {
			utility("background", ({ value }) => ({ background: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				variants: {
					color: {
						primary: {},
					},
					disabled: {
						false: {},
					},
				},
				compoundVariants: [
					{
						match: { color: "primary", disabled: "false" },
						css: {
							"&:hover": {
								background: "primary-shade-50",
							},
						},
					},
				],
			});

			processRecipeUtilities(instance, root);

			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);

			const hoverBackground = backgroundUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBackground).toBeDefined();
		});

		test("should strip '&:' prefix in variant declarations", () => {
			utility("background", ({ value }) => ({ background: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				variants: {
					color: {
						primary: {
							background: "blue",
							"&:hover": {
								background: "darkblue",
							},
						},
					},
				},
			});

			processRecipeUtilities(instance, root);

			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);

			const hoverBackground = backgroundUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBackground).toBeDefined();
		});

		test("should not warn about '&' modifier when using '&:' prefix syntax", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			utility("textDecoration", ({ value }) => ({
				textDecoration: value,
			}));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "link",
				variants: {
					color: {
						primary: {},
					},
				},
				compoundVariants: [
					{
						match: { color: "primary" },
						css: {
							"&:hover": {
								textDecoration: "underline",
							},
						},
					},
				],
			});

			processRecipeUtilities(instance, root);

			expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('Modifier "&"'));

			warnSpy.mockRestore();
		});

		test("should strip '&:' prefix and treat '&:hover' the same as 'hover' in base", () => {
			utility("background", ({ value }) => ({ background: value }));
			utility("boxShadow", ({ value }) => ({ boxShadow: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				base: {
					background: "blue",
					"&:hover": {
						boxShadow: "lg",
					},
				},
				variants: {},
			});

			processRecipeUtilities(instance, root);

			const boxShadowUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "boxShadow",
			);

			const hoverBoxShadow = boxShadowUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBoxShadow).toBeDefined();
		});

		test("should strip '&:' prefix in compound variant modifier blocks", () => {
			utility("background", ({ value }) => ({ background: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				variants: {
					color: {
						primary: {},
					},
					disabled: {
						false: {},
					},
				},
				compoundVariants: [
					{
						match: { color: "primary", disabled: "false" },
						css: {
							"&:hover": {
								background: "primary-shade-50",
							},
						},
					},
				],
			});

			processRecipeUtilities(instance, root);

			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);

			const hoverBackground = backgroundUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBackground).toBeDefined();
		});

		test("should strip '&:' prefix in variant declarations", () => {
			utility("background", ({ value }) => ({ background: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "button",
				variants: {
					color: {
						primary: {
							background: "blue",
							"&:hover": {
								background: "darkblue",
							},
						},
					},
				},
			});

			processRecipeUtilities(instance, root);

			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);

			const hoverBackground = backgroundUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBackground).toBeDefined();
		});

		test("should not warn about '&' modifier when using '&:' prefix syntax", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			utility("textDecoration", ({ value }) => ({
				textDecoration: value,
			}));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});

			const instance = recipe({
				name: "link",
				variants: {
					color: {
						primary: {},
					},
				},
				compoundVariants: [
					{
						match: { color: "primary" },
						css: {
							"&:hover": {
								textDecoration: "underline",
							},
						},
					},
				],
			});

			processRecipeUtilities(instance, root);

			expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('Modifier "&"'));

			warnSpy.mockRestore();
		});

		test("should collect modifiers across multiple declarations", () => {
			utility("background", ({ value }) => ({ background: value }));
			utility("color", ({ value }) => ({ color: value }));
			modifier("hover", ({ selector }) => {
				selector("&:hover", {});
			});
			modifier("focus", ({ selector }) => {
				selector("&:focus", {});
			});

			const instance = recipe({
				name: "button",
				base: {
					background: "blue",
					hover: {
						background: "darkblue",
					},
					focus: {
						color: "white",
					},
				},
				variants: {},
			});

			processRecipeUtilities(instance, root);

			// background should have hover modifier
			const backgroundUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "background",
			);
			const hoverBackground = backgroundUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("hover"),
			);
			expect(hoverBackground).toBeDefined();

			// color should have focus modifier
			const colorUtilities = root.children.filter(
				(child) => child.type === "utility" && child.name === "color",
			);
			const focusColor = colorUtilities.find(
				(u) => u.type === "utility" && u.modifiers?.includes("focus"),
			);
			expect(focusColor).toBeDefined();
		});
	});
});

describe("generateRecipeRuntime", () => {
	let root: Root;
	let recipe: ReturnType<typeof createRecipeFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;
	let modifier: ReturnType<typeof createModifierFunction>;

	beforeEach(() => {
		root = createRoot();
		recipe = createRecipeFunction(root, root);
		utility = createUtilityFunction(root, root);
		modifier = createModifierFunction(root, root);
	});

	test("should generate runtime for base declarations with arbitrary values", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("borderStyle", ({ value }) => ({ borderStyle: value }));

		const instance = recipe({
			name: "button",
			base: { borderWidth: "thin", borderStyle: "solid" },
			variants: {},
		});

		expect(instance._runtime).toBeDefined();
		expect(instance._runtime?.base).toEqual({
			borderWidth: "[thin]",
			borderStyle: "[solid]",
		});
	});

	test("should generate runtime for base declarations with @ token references", () => {
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));

		const instance = recipe({
			name: "button",
			base: {
				background: "@color.primary",
				color: "@color.white",
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			background: "color.primary",
			color: "color.white",
		});
	});

	test("should generate runtime for base declarations with Reference objects", () => {
		utility("boxShadow", ({ value }) => ({ boxShadow: value }));

		const instance = recipe({
			name: "card",
			base: {
				boxShadow: { type: "reference", name: "shadow.md" },
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			boxShadow: "shadow.md",
		});
	});

	test("should generate runtime for variant declarations", () => {
		utility("background", ({ value }) => ({ background: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "@color.primary" },
					secondary: { background: "@color.secondary" },
				},
				size: {
					sm: { padding: "0.5rem" },
					lg: { padding: "1rem" },
				},
			},
		});

		expect(instance._runtime?.variants).toEqual({
			color: {
				primary: { background: "color.primary" },
				secondary: { background: "color.secondary" },
			},
			size: {
				sm: { padding: "[0.5rem]" },
				lg: { padding: "[1rem]" },
			},
		});
	});

	test("should handle empty variant options", () => {
		utility("opacity", ({ value }) => ({ opacity: value }));

		const instance = recipe({
			name: "button",
			variants: {
				disabled: {
					false: {},
					true: { opacity: "@opacity.50" },
				},
			},
		});

		expect(instance._runtime?.variants).toEqual({
			disabled: {
				false: {},
				true: { opacity: "opacity.50" },
			},
		});
	});

	test("should copy defaultVariants as-is", () => {
		utility("background", ({ value }) => ({ background: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "@color.primary" },
					secondary: { background: "@color.secondary" },
				},
				size: {
					sm: { padding: "0.5rem" },
					md: { padding: "1rem" },
				},
			},
			defaultVariants: {
				color: "primary",
				size: "md",
			},
		});

		expect(instance._runtime?.defaultVariants).toEqual({
			color: "primary",
			size: "md",
		});
	});

	test("should generate runtime for compoundVariants", () => {
		utility("background", ({ value }) => ({ background: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "@color.primary" },
				},
				disabled: {
					false: {},
					true: {},
				},
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "false" },
					css: { background: "@color.primary-hover" },
				},
			],
		});

		expect(instance._runtime?.compoundVariants).toEqual([
			{
				match: { color: "primary", disabled: "false" },
				css: { background: "color.primary-hover" },
			},
		]);
	});

	test("should generate runtime for modifier blocks in base", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		utility("boxShadow", ({ value }) => ({ boxShadow: value }));

		const instance = recipe({
			name: "card",
			base: {
				boxShadow: "@shadow.md",
				hover: {
					boxShadow: "@shadow.lg",
				},
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			boxShadow: "shadow.md",
			hover: {
				boxShadow: "shadow.lg",
			},
		});
	});

	test("should generate runtime for modifier blocks in variants", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		utility("background", ({ value }) => ({ background: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: {
						background: "@color.primary",
						hover: {
							background: "@color.primary-dark",
						},
					},
				},
			},
		});

		expect(instance._runtime?.variants).toEqual({
			color: {
				primary: {
					background: "color.primary",
					hover: {
						background: "color.primary-dark",
					},
				},
			},
		});
	});

	test("should generate runtime for modifier blocks in compoundVariants", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		utility("background", ({ value }) => ({ background: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "@color.primary" },
				},
				disabled: {
					false: {},
				},
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "false" },
					css: {
						hover: {
							background: "@color.primary-dark",
						},
					},
				},
			],
		});

		expect(instance._runtime?.compoundVariants).toEqual([
			{
				match: { color: "primary", disabled: "false" },
				css: {
					hover: {
						background: "color.primary-dark",
					},
				},
			},
		]);
	});

	test("should normalize '&:hover' to 'hover' in base runtime", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		utility("boxShadow", ({ value }) => ({ boxShadow: value }));

		const instance = recipe({
			name: "card",
			base: {
				boxShadow: "@shadow.md",
				"&:hover": {
					boxShadow: "@shadow.lg",
				},
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			boxShadow: "shadow.md",
			hover: {
				boxShadow: "shadow.lg",
			},
		});
	});

	test("should normalize '&:hover' to 'hover' in compound variant runtime", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		utility("background", ({ value }) => ({ background: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "@color.primary" },
				},
				disabled: {
					false: {},
				},
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "false" },
					css: {
						"&:hover": {
							background: "@color.primary-dark",
						},
					},
				},
			],
		});

		expect(instance._runtime?.compoundVariants).toEqual([
			{
				match: { color: "primary", disabled: "false" },
				css: {
					hover: {
						background: "color.primary-dark",
					},
				},
			},
		]);
	});

	test("should normalize '&:hover' to 'hover' in variant runtime", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		utility("background", ({ value }) => ({ background: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: {
						background: "@color.primary",
						"&:hover": {
							background: "@color.primary-dark",
						},
					},
				},
			},
		});

		expect(instance._runtime?.variants).toEqual({
			color: {
				primary: {
					background: "color.primary",
					hover: {
						background: "color.primary-dark",
					},
				},
			},
		});
	});

	test("should use custom autogenerate function to resolve keys", () => {
		utility("background", ({ value }) => ({ background: value }), {
			autogenerate: (value) => {
				if (typeof value === "string" && value.startsWith("@")) {
					const fullName = value.slice(1);
					// Extract just the last part after the dot
					const shortName = fullName.split(".").pop() ?? fullName;
					return {
						[shortName]: { type: "reference", name: fullName },
					};
				}
				return { [`[${value}]`]: value };
			},
		});

		const instance = recipe({
			name: "button",
			base: {
				background: "@color.primary",
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			background: "primary",
		});
	});

	test("should handle empty recipe gracefully", () => {
		const instance = recipe({
			name: "empty",
			variants: {},
		});

		expect(instance._runtime).toBeDefined();
		expect(instance._runtime?.base).toBeUndefined();
		expect(instance._runtime?.defaultVariants).toBeUndefined();
		expect(instance._runtime?.compoundVariants).toBeUndefined();
	});

	test("should throw when utility in base is not found in registry", () => {
		utility("background", ({ value }) => ({ background: value }));

		expect(() =>
			recipe({
				name: "button",
				base: {
					background: "@color.primary",
					unknownUtility: "value", // This utility is not registered
				},
				variants: {},
			}),
		).toThrow(
			'[styleframe] Utility "unknownUtility" not found in registry. Make sure the utility is registered before using it in a recipe.',
		);
	});

	test("should handle compound modifiers like hover:focus", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		modifier("focus", ({ selector }) => {
			selector("&:focus", {});
		});
		utility("boxShadow", ({ value }) => ({ boxShadow: value }));

		const instance = recipe({
			name: "input",
			base: {
				"hover:focus": {
					boxShadow: "@shadow.ring",
				},
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			"hover:focus": {
				boxShadow: "shadow.ring",
			},
		});
	});

	test("should handle boolean values in declarations", () => {
		utility("hidden", ({ value }) => ({
			display: value === true ? "none" : "block",
		}));

		const instance = recipe({
			name: "element",
			base: {
				hidden: true,
			},
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			hidden: true,
		});
	});

	test("should generate complete runtime for complex recipe", () => {
		modifier("hover", ({ selector }) => {
			selector("&:hover", {});
		});
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));
		utility("padding", ({ value }) => ({ padding: value }));
		utility("opacity", ({ value }) => ({ opacity: value }));

		const instance = recipe({
			name: "button",
			base: {
				borderWidth: "@border.thin",
			},
			variants: {
				color: {
					primary: {
						background: "@color.primary",
						color: "@color.white",
						hover: {
							background: "@color.primary-dark",
						},
					},
					secondary: {
						background: "@color.secondary",
						color: "@color.black",
					},
				},
				size: {
					sm: { padding: "0.5rem" },
					md: { padding: "1rem" },
				},
				disabled: {
					false: {},
					true: { opacity: "@opacity.50" },
				},
			},
			defaultVariants: {
				color: "primary",
				size: "md",
				disabled: "false",
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "false" },
					css: {
						hover: { background: "@color.primary-hover" },
					},
				},
			],
		});

		expect(instance._runtime).toEqual({
			base: {
				borderWidth: "border.thin",
			},
			variants: {
				color: {
					primary: {
						background: "color.primary",
						color: "color.white",
						hover: {
							background: "color.primary-dark",
						},
					},
					secondary: {
						background: "color.secondary",
						color: "color.black",
					},
				},
				size: {
					sm: { padding: "[0.5rem]" },
					md: { padding: "[1rem]" },
				},
				disabled: {
					false: {},
					true: { opacity: "opacity.50" },
				},
			},
			defaultVariants: {
				color: "primary",
				size: "md",
				disabled: "false",
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "false" },
					css: {
						hover: { background: "color.primary-hover" },
					},
				},
			],
		});
	});

	test("should hash whitespace values in base declarations", () => {
		utility("transition", ({ value }) => ({ transition: value }));

		const instance = recipe({
			name: "button",
			base: { transition: "all 0.3s ease" },
			variants: {},
		});

		const expectedHash = hashValue("all 0.3s ease");
		expect(instance._runtime?.base).toEqual({
			transition: expectedHash,
		});
	});

	test("should hash whitespace values in variant declarations", () => {
		utility("transition", ({ value }) => ({ transition: value }));

		const instance = recipe({
			name: "button",
			variants: {
				animation: {
					fast: { transition: "all 0.15s ease" },
					slow: { transition: "all 0.5s ease-in-out" },
				},
			},
		});

		const fastHash = hashValue("all 0.15s ease");
		const slowHash = hashValue("all 0.5s ease-in-out");
		expect(instance._runtime?.variants).toEqual({
			animation: {
				fast: { transition: fastHash },
				slow: { transition: slowHash },
			},
		});
	});

	test("should hash whitespace values in compound variant declarations", () => {
		utility("transition", ({ value }) => ({ transition: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: {},
				},
			},
			compoundVariants: [
				{
					match: { color: "primary" },
					css: { transition: "all 0.3s ease" },
				},
			],
		});

		const expectedHash = hashValue("all 0.3s ease");
		expect(instance._runtime?.compoundVariants?.[0]?.css).toEqual({
			transition: expectedHash,
		});
	});

	test("should create valid utility instances for whitespace values", () => {
		utility("transition", ({ value }) => ({ transition: value }));

		const instance = recipe({
			name: "button",
			base: { transition: "all 0.3s ease" },
			variants: {},
		});

		processRecipeUtilities(instance, root);

		const transitionUtilities = root.children.filter(
			(child) => child.type === "utility" && child.name === "transition",
		);
		expect(transitionUtilities.length).toBeGreaterThanOrEqual(1);

		const utilityInstance = transitionUtilities[0];
		if (utilityInstance?.type === "utility") {
			expect(utilityInstance.value).toMatch(/^[0-9a-f]{7}$/);
			expect(utilityInstance.value).not.toContain(" ");
		}
	});

	test("should not hash non-whitespace arbitrary values (backward compatible)", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));

		const instance = recipe({
			name: "button",
			base: { borderWidth: "thin" },
			variants: {},
		});

		expect(instance._runtime?.base).toEqual({
			borderWidth: "[thin]",
		});
	});

	test("should generate runtime for compoundVariants with className only", () => {
		const instance = recipe({
			name: "button",
			variants: {
				disabled: {
					false: {},
					true: {},
				},
			},
			compoundVariants: [
				{
					match: { disabled: "true" },
					className: "button--disabled",
				},
			],
		});

		expect(instance._runtime?.compoundVariants).toEqual([
			{
				match: { disabled: "true" },
				className: "button--disabled",
			},
		]);
	});

	test("should generate runtime for compoundVariants with both css and className", () => {
		utility("background", ({ value }) => ({ background: value }));

		const instance = recipe({
			name: "button",
			variants: {
				color: {
					primary: { background: "@color.primary" },
				},
				disabled: {
					false: {},
					true: {},
				},
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "false" },
					css: { background: "@color.primary-hover" },
					className: "button--primary-active",
				},
			],
		});

		expect(instance._runtime?.compoundVariants).toEqual([
			{
				match: { color: "primary", disabled: "false" },
				css: { background: "color.primary-hover" },
				className: "button--primary-active",
			},
		]);
	});

	test("should process recipe utilities without error when compoundVariant has className only", () => {
		const instance = recipe({
			name: "button",
			variants: {
				disabled: {
					false: {},
					true: {},
				},
			},
			compoundVariants: [
				{
					match: { disabled: "true" },
					className: "button--disabled",
				},
			],
		});

		// Should not throw — className-only compound variants have no utilities to process
		expect(instance._runtime?.compoundVariants).toEqual([
			{
				match: { disabled: "true" },
				className: "button--disabled",
			},
		]);
	});

	test("should populate _usage.recipeUtilities instead of _usage.utilities", () => {
		utility("padding", ({ value }) => ({ padding: value }));

		recipe({
			name: "button",
			base: { padding: "1rem" },
			variants: {},
		});

		expect(root._usage.utilities.size).toBe(0);
		expect(root._usage.recipeUtilities.has("button")).toBe(true);
		expect(root._usage.recipeUtilities.get("button")).toEqual(new Set(["_padding:[1rem]"]));
	});

	test("should track multiple recipes independently in recipeUtilities", () => {
		utility("padding", ({ value }) => ({ padding: value }));
		utility("background", ({ value }) => ({ background: value }));

		recipe({
			name: "button",
			base: { padding: "1rem" },
			variants: {},
		});

		recipe({
			name: "badge",
			base: { background: "blue" },
			variants: {},
		});

		expect(root._usage.recipeUtilities.size).toBe(2);
		expect(root._usage.recipeUtilities.get("button")).toEqual(new Set(["_padding:[1rem]"]));
		expect(root._usage.recipeUtilities.get("badge")).toEqual(new Set(["_background:[blue]"]));
	});
});

describe("registerRecipeUtilities", () => {
	let root: Root;
	let recipe: ReturnType<typeof createRecipeFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;

	beforeEach(() => {
		root = createRoot();
		recipe = createRecipeFunction(root, root);
		utility = createUtilityFunction(root, root);
	});

	test("should promote all recipe utilities when called without names", () => {
		utility("padding", ({ value }) => ({ padding: value }));
		utility("background", ({ value }) => ({ background: value }));

		recipe({ name: "button", base: { padding: "1rem" }, variants: {} });
		recipe({ name: "badge", base: { background: "blue" }, variants: {} });

		registerRecipeUtilities(root);

		expect(root._usage.utilities).toEqual(new Set(["_padding:[1rem]", "_background:[blue]"]));
	});

	test("should promote only named recipes when called with a set", () => {
		utility("padding", ({ value }) => ({ padding: value }));
		utility("background", ({ value }) => ({ background: value }));

		recipe({ name: "button", base: { padding: "1rem" }, variants: {} });
		recipe({ name: "badge", base: { background: "blue" }, variants: {} });

		registerRecipeUtilities(root, new Set(["button"]));

		expect(root._usage.utilities).toEqual(new Set(["_padding:[1rem]"]));
	});

	test("should preserve shared utilities when only one recipe is promoted", () => {
		utility("background", ({ value }) => ({ background: value }));

		root.variables.push({
			type: "variable",
			id: "v1",
			name: "color.primary",
			value: "#006cff",
		});

		recipe({
			name: "button",
			base: { background: "@color.primary" },
			variants: {},
		});
		recipe({
			name: "badge",
			base: { background: "@color.primary" },
			variants: {},
		});

		registerRecipeUtilities(root, new Set(["button"]));

		expect(root._usage.utilities.has("_background:color.primary")).toBe(true);
	});

	test("should not promote anything when called with empty set", () => {
		utility("padding", ({ value }) => ({ padding: value }));

		recipe({ name: "button", base: { padding: "1rem" }, variants: {} });

		registerRecipeUtilities(root, new Set());

		expect(root._usage.utilities.size).toBe(0);
	});
});
