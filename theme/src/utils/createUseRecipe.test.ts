import type { Styleframe } from "@styleframe/core";
import { styleframe } from "@styleframe/core";

import { createUseRecipe } from "./createUseRecipe";

function registerUtilities(s: Styleframe) {
	for (const name of ["background", "borderColor", "display", "fontSize"]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
}

describe("createUseRecipe", () => {
	it("should create a recipe with name and base styles", () => {
		const useRecipe = createUseRecipe("test", {
			base: { display: "flex" },
		});
		const s = styleframe();
		registerUtilities(s);
		const recipe = useRecipe(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("test");
		expect(recipe.base).toEqual({ display: "flex" });
	});

	it("should create a recipe with variants", () => {
		const useRecipe = createUseRecipe("test", {
			base: { display: "flex" },
			variants: {
				size: {
					sm: { fontSize: "12px" },
					md: { fontSize: "14px" },
					lg: { fontSize: "16px" },
				},
			},
		});
		const s = styleframe();
		registerUtilities(s);
		const recipe = useRecipe(s);

		expect(recipe.variants).toEqual({
			size: {
				sm: { fontSize: "12px" },
				md: { fontSize: "14px" },
				lg: { fontSize: "16px" },
			},
		});
	});

	it("should create a recipe with defaultVariants", () => {
		const useRecipe = createUseRecipe("test", {
			base: {},
			variants: {
				size: {
					sm: { fontSize: "12px" },
					md: { fontSize: "14px" },
				},
			},
			defaultVariants: { size: "sm" },
		});
		const s = styleframe();
		registerUtilities(s);
		const recipe = useRecipe(s);

		expect(recipe.defaultVariants).toEqual({ size: "sm" });
	});

	it("should create a recipe with compoundVariants", () => {
		const useRecipe = createUseRecipe("test", {
			base: {},
			variants: {
				color: { primary: {}, error: {} },
				variant: { solid: {}, outline: {} },
			},
			compoundVariants: [
				{
					match: { color: "primary", variant: "solid" },
					css: { background: "blue" },
				},
			],
		});
		const s = styleframe();
		registerUtilities(s);
		const recipe = useRecipe(s);

		expect(recipe.compoundVariants).toEqual([
			{
				match: { color: "primary", variant: "solid" },
				css: { background: "blue" },
			},
		]);
	});

	it("should deep merge options with defaults", () => {
		const useRecipe = createUseRecipe("test", {
			base: { display: "flex", fontSize: "14px" },
			variants: {
				size: {
					sm: { fontSize: "12px" },
				},
			},
		});
		const s = styleframe();
		registerUtilities(s);
		const recipe = useRecipe(s, {
			base: { fontSize: "16px" },
		});

		expect(recipe.base).toEqual({ display: "flex", fontSize: "16px" });
	});

	it("should work with no options", () => {
		const useRecipe = createUseRecipe("test", {
			base: { display: "flex" },
		});
		const s = styleframe();
		registerUtilities(s);
		const recipe = useRecipe(s);

		expect(recipe.name).toBe("test");
		expect(recipe.base).toEqual({ display: "flex" });
	});
});

describe("createUseRecipe filter", () => {
	const useRecipe = createUseRecipe("test", {
		base: { display: "flex" },
		variants: {
			color: {
				primary: {},
				secondary: {},
				success: {},
				error: {},
			},
			variant: {
				solid: {},
				outline: {},
				soft: {},
			},
			size: {
				sm: { fontSize: "12px" },
				md: { fontSize: "14px" },
				lg: { fontSize: "16px" },
			},
		},
		compoundVariants: [
			{
				match: { color: "primary", variant: "solid" },
				css: { background: "blue" },
			},
			{
				match: { color: "primary", variant: "outline" },
				css: { borderColor: "blue" },
			},
			{
				match: { color: "error", variant: "solid" },
				css: { background: "red" },
			},
			{
				match: { color: "error", variant: "outline" },
				css: { borderColor: "red" },
			},
			{
				match: { color: "secondary", variant: "soft" },
				css: { background: "gray" },
			},
		],
		defaultVariants: {
			color: "primary",
			variant: "solid",
			size: "md",
		},
	});

	describe("variants filtering", () => {
		it("should filter a single variant axis", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: ["primary"] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["primary"]);
			expect(recipe.variants!.size).toEqual({
				sm: { fontSize: "12px" },
				md: { fontSize: "14px" },
				lg: { fontSize: "16px" },
			});
			expect(Object.keys(recipe.variants!.variant)).toEqual(["solid", "outline", "soft"]);
		});

		it("should filter multiple variant axes", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: {
					color: ["primary", "error"],
					size: ["sm", "md"],
				},
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["primary", "error"]);
			expect(Object.keys(recipe.variants!.size)).toEqual(["sm", "md"]);
			expect(Object.keys(recipe.variants!.variant)).toEqual(["solid", "outline", "soft"]);
		});

		it("should remove all values when filter is an empty array", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: [] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual([]);
		});

		it("should ignore filter axes that do not exist in variants", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { nonexistent: [] } as any,
			});

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"primary",
				"secondary",
				"success",
				"error",
			]);
		});

		it("should ignore filter values that do not exist in a variant axis", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: ["primary", "nonexistent" as any] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["primary"]);
		});
	});

	describe("compoundVariants pruning", () => {
		it("should prune compoundVariants referencing excluded values", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: ["primary"] },
			});

			expect(recipe.compoundVariants).toEqual([
				{
					match: { color: "primary", variant: "solid" },
					css: { background: "blue" },
				},
				{
					match: { color: "primary", variant: "outline" },
					css: { borderColor: "blue" },
				},
			]);
		});

		it("should prune compoundVariants when filtering multiple axes", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: {
					color: ["primary"],
					variant: ["solid"],
				},
			});

			expect(recipe.compoundVariants).toEqual([
				{
					match: { color: "primary", variant: "solid" },
					css: { background: "blue" },
				},
			]);
		});

		it("should keep compoundVariants when their match values are all included", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: {
					color: ["primary", "error"],
					variant: ["solid", "outline"],
				},
			});

			expect(recipe.compoundVariants).toEqual([
				{
					match: { color: "primary", variant: "solid" },
					css: { background: "blue" },
				},
				{
					match: { color: "primary", variant: "outline" },
					css: { borderColor: "blue" },
				},
				{
					match: { color: "error", variant: "solid" },
					css: { background: "red" },
				},
				{
					match: { color: "error", variant: "outline" },
					css: { borderColor: "red" },
				},
			]);
		});

		it("should remove all compoundVariants when filter is an empty array", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: [] },
			});

			expect(recipe.compoundVariants).toEqual([]);
		});

		it("should keep compoundVariants for unfiltered axes", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { size: ["sm"] },
			});

			expect(recipe.compoundVariants).toHaveLength(5);
		});
	});

	describe("defaultVariants adjustment", () => {
		it("should keep defaultVariants when the default is included", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: ["primary"] },
			});

			expect(recipe.defaultVariants?.color).toBe("primary");
		});

		it("should remove defaultVariants when the default is excluded", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: ["error"] },
			});

			expect(recipe.defaultVariants?.color).toBeUndefined();
			expect(recipe.defaultVariants?.variant).toBe("solid");
			expect(recipe.defaultVariants?.size).toBe("md");
		});

		it("should remove defaultVariants when filter is an empty array", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: [] },
			});

			expect(recipe.defaultVariants?.color).toBeUndefined();
		});

		it("should not affect defaultVariants for unfiltered axes", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				filter: { color: ["primary"] },
			});

			expect(recipe.defaultVariants?.variant).toBe("solid");
			expect(recipe.defaultVariants?.size).toBe("md");
		});
	});

	describe("no-op cases", () => {
		it("should not filter when filter is not provided", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s);

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"primary",
				"secondary",
				"success",
				"error",
			]);
			expect(recipe.compoundVariants).toHaveLength(5);
		});

		it("should not filter when filter is an empty object", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, { filter: {} });

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"primary",
				"secondary",
				"success",
				"error",
			]);
			expect(recipe.compoundVariants).toHaveLength(5);
		});
	});

	describe("filter combined with config overrides", () => {
		it("should apply overrides before filtering", () => {
			const s = styleframe();
			registerUtilities(s);
			const recipe = useRecipe(s, {
				base: { display: "inline-flex" },
				filter: { color: ["primary"] },
			});

			expect(recipe.base).toEqual({ display: "inline-flex" });
			expect(Object.keys(recipe.variants!.color)).toEqual(["primary"]);
		});
	});
});
