import type { RecipeRuntime } from "@styleframe/core";
import { describe, expect, it } from "vitest";

import { createRecipe } from "./runtime";

describe("createRecipe", () => {
	it("should apply base declarations", () => {
		const runtime = {
			base: {
				borderWidth: "thin",
				borderStyle: "solid",
				cursor: "pointer",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("button");
		expect(result).toContain("_border-width:thin");
		expect(result).toContain("_border-style:solid");
		expect(result).toContain("_cursor:pointer");
	});

	it("should apply default variants when no props are provided", () => {
		const runtime = {
			base: {
				borderWidth: "thin",
				borderStyle: "solid",
				cursor: "pointer",
			},
			variants: {
				color: {
					primary: {
						background: "primary",
						color: "white",
					},
					secondary: {
						background: "secondary",
						color: "white",
					},
				},
				size: {
					sm: {
						padding: "1",
					},
					md: {
						padding: "2",
					},
					lg: {
						padding: "3",
					},
				},
			},
			defaultVariants: {
				color: "primary",
				size: "md",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toBe(
			"button _border-width:thin _border-style:solid _cursor:pointer _background:primary _color:white _padding:2",
		);
	});

	it("should apply specified variant overriding default variant", () => {
		const runtime = {
			base: {
				borderWidth: "thin",
				borderStyle: "solid",
				cursor: "pointer",
			},
			variants: {
				color: {
					primary: {
						background: "primary",
						color: "white",
					},
					secondary: {
						background: "secondary",
						color: "white",
					},
				},
				size: {
					sm: {
						padding: "1",
					},
					md: {
						padding: "2",
					},
					lg: {
						padding: "3",
					},
				},
			},
			defaultVariants: {
				color: "primary",
				size: "md",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ color: "secondary" });

		expect(result).toBe(
			"button _border-width:thin _border-style:solid _cursor:pointer _background:secondary _color:white _padding:2",
		);
	});

	it("should apply compound variants when conditions match", () => {
		const runtime = {
			base: {
				borderWidth: "thin",
				borderStyle: "solid",
				cursor: "pointer",
			},
			variants: {
				color: {
					primary: {
						background: "primary",
						color: "white",
					},
					secondary: {
						background: "secondary",
						color: "white",
					},
				},
				size: {
					sm: {
						padding: "1",
					},
					md: {
						padding: "2",
					},
					lg: {
						padding: "3",
					},
				},
			},
			defaultVariants: {
				color: "primary",
				size: "md",
			},
			compoundVariants: [
				{
					match: {
						color: "primary",
						size: "sm",
					},
					css: {
						padding: "1",
						background: "primary-dark",
						color: "white",
					},
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ color: "primary", size: "sm" });

		expect(result).toBe(
			"button _border-width:thin _border-style:solid _cursor:pointer _background:primary-dark _color:white _padding:1",
		);
	});

	it("should not apply compound variants when conditions don't match", () => {
		const runtime = {
			base: {
				borderWidth: "thin",
			},
			variants: {
				color: {
					primary: {
						background: "primary",
					},
					secondary: {
						background: "secondary",
					},
				},
				size: {
					sm: {
						padding: "1",
					},
					md: {
						padding: "2",
					},
				},
			},
			defaultVariants: {
				color: "primary",
				size: "md",
			},
			compoundVariants: [
				{
					match: {
						color: "primary",
						size: "sm",
					},
					css: {
						background: "primary-dark",
					},
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ color: "secondary", size: "sm" });

		// Should not apply compound variant because color doesn't match
		expect(result).toContain("_background:secondary");
		expect(result).not.toContain("_background:primary-dark");
	});

	it("should convert camelCase utility names to kebab-case", () => {
		const runtime = {
			base: {
				borderRadius: "md",
				backgroundColor: "white",
			},
		} as const satisfies RecipeRuntime;

		const card = createRecipe("card", runtime);
		const result = card({});

		expect(result).toContain("_border-radius:md");
		expect(result).toContain("_background-color:white");
	});

	it("should handle boolean value true", () => {
		const runtime = {
			base: {
				display: true,
			},
		} as const satisfies RecipeRuntime;

		const element = createRecipe("element", runtime);
		const result = element({});

		expect(result).toContain("_display");
		expect(result).not.toContain("_display:true");
	});

	it("should handle multiple compound variants", () => {
		const runtime = {
			base: {
				cursor: "pointer",
			},
			variants: {
				color: {
					primary: { background: "primary" },
					secondary: { background: "secondary" },
				},
				size: {
					sm: { padding: "1" },
					md: { padding: "2" },
				},
				rounded: {
					true: { borderRadius: "full" },
					false: { borderRadius: "none" },
				},
			},
			compoundVariants: [
				{
					match: {
						color: "primary",
						size: "sm",
					},
					css: {
						padding: "0.5",
					},
				},
				{
					match: {
						color: "primary",
						rounded: "true",
					},
					css: {
						boxShadow: "glow",
					},
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ color: "primary", size: "sm", rounded: "true" });

		// Should apply both compound variants
		expect(result).toContain("_padding:0.5");
		expect(result).toContain("_box-shadow:glow");
		expect(result).toContain("_border-radius:full");
	});

	it("should handle recipes with no default variants", () => {
		const runtime = {
			base: {
				fontFamily: "sans",
			},
			variants: {
				size: {
					sm: { fontSize: "12" },
					md: { fontSize: "16" },
				},
			},
		} as const satisfies RecipeRuntime;

		const text = createRecipe("text", runtime);
		const result = text({});

		expect(result).toBe("text _font-family:sans");
	});

	it("should override declarations in correct order: base < variants < compound variants", () => {
		const runtime = {
			base: {
				padding: "default",
			},
			variants: {
				size: {
					sm: {
						padding: "variant",
					},
				},
			},
			compoundVariants: [
				{
					match: {
						size: "sm",
					},
					css: {
						padding: "compound",
					},
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ size: "sm" });

		// Compound variant should override variant, which overrides base
		expect(result).toBe("button _padding:compound");
	});

	it("should handle modifier blocks in base declarations", () => {
		const runtime = {
			base: {
				background: "blue",
				hover: {
					background: "darkblue",
				},
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("_background:blue");
		expect(result).toContain("_hover:background:darkblue");
	});

	it("should handle compound modifiers like hover:focus", () => {
		const runtime = {
			base: {
				boxShadow: "none",
				"hover:focus": {
					boxShadow: "lg",
				},
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("_box-shadow:none");
		expect(result).toContain("_hover:focus:box-shadow:lg");
	});

	it("should handle modifier blocks in variant declarations", () => {
		const runtime = {
			base: {},
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
			defaultVariants: {
				color: "primary",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("_background:blue");
		expect(result).toContain("_hover:background:darkblue");
	});

	it("should handle modifier blocks in compoundVariants", () => {
		const runtime = {
			base: {},
			variants: {
				color: {
					primary: {},
				},
				disabled: {
					false: {},
				},
			},
			defaultVariants: {
				color: "primary",
				disabled: "false",
			},
			compoundVariants: [
				{
					match: {
						color: "primary",
						disabled: "false",
					},
					css: {
						hover: {
							background: "primary-shade-50",
						},
					},
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("_hover:background:primary-shade-50");
	});

	it("should handle multiple modifiers in same block", () => {
		const runtime = {
			base: {
				background: "blue",
				hover: {
					background: "darkblue",
				},
				focus: {
					outline: "ring",
				},
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("_background:blue");
		expect(result).toContain("_hover:background:darkblue");
		expect(result).toContain("_focus:outline:ring");
	});

	it("should override modifier declarations correctly", () => {
		const runtime = {
			base: {
				hover: {
					background: "base-hover",
				},
			},
			variants: {
				color: {
					primary: {
						hover: {
							background: "variant-hover",
						},
					},
				},
			},
			defaultVariants: {
				color: "primary",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		// Variant should override base for the same modifier+utility combination
		expect(result).toContain("_hover:background:variant-hover");
		expect(result).not.toContain("_hover:background:base-hover");
	});

	it("should handle empty runtime", () => {
		const runtime = {} as const satisfies RecipeRuntime;

		const element = createRecipe("element", runtime);
		const result = element({});

		expect(result).toBe("element");
	});

	it("should handle runtime with only variants and no base", () => {
		const runtime = {
			variants: {
				size: {
					sm: { padding: "1" },
					md: { padding: "2" },
				},
			},
			defaultVariants: {
				size: "sm",
			},
		} as const satisfies RecipeRuntime;

		const element = createRecipe("element", runtime);
		const result = element({});

		expect(result).toBe("element _padding:1");
	});

	it("should handle variant with undefined value", () => {
		const runtime = {
			base: {
				padding: "default",
			},
			variants: {
				size: {
					none: undefined,
					sm: { padding: "1" },
				},
			},
		} as const satisfies RecipeRuntime;

		const element = createRecipe("element", runtime);
		const result = element({ size: "none" });

		// Should only have base padding since variant is undefined
		expect(result).toBe("element _padding:default");
	});

	it("should append className from matching compound variant", () => {
		const runtime = {
			variants: {
				disabled: {
					true: {},
					false: {},
				},
			},
			defaultVariants: {
				disabled: "true",
			},
			compoundVariants: [
				{
					match: { disabled: "true" },
					className: "button--disabled",
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("button--disabled");
	});

	it("should not append className from non-matching compound variant", () => {
		const runtime = {
			variants: {
				disabled: {
					true: {},
					false: {},
				},
			},
			defaultVariants: {
				disabled: "false",
			},
			compoundVariants: [
				{
					match: { disabled: "true" },
					className: "button--disabled",
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).not.toContain("button--disabled");
	});

	it("should accept boolean true to select 'true' variant option", () => {
		const runtime = {
			variants: {
				disabled: {
					true: { opacity: "50" },
					false: { opacity: "100" },
				},
			},
			defaultVariants: {
				disabled: "false",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ disabled: true });

		expect(result).toContain("_opacity:50");
	});

	it("should accept boolean false to select 'false' variant option", () => {
		const runtime = {
			variants: {
				disabled: {
					true: { opacity: "50" },
					false: { opacity: "100" },
				},
			},
			defaultVariants: {
				disabled: "true",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ disabled: false });

		expect(result).toContain("_opacity:100");
	});

	it("should match boolean true in compound variant conditions", () => {
		const runtime = {
			variants: {
				color: {
					primary: {},
				},
				disabled: {
					true: {},
					false: {},
				},
			},
			defaultVariants: {
				color: "primary",
				disabled: "false",
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "true" },
					css: {
						opacity: "50",
					},
					className: "button--primary-disabled",
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({ disabled: true });

		expect(result).toContain("_opacity:50");
		expect(result).toContain("button--primary-disabled");
	});

	it("should not fall through to defaultVariants when boolean false is provided", () => {
		const runtime = {
			variants: {
				disabled: {
					true: { opacity: "50" },
					false: { opacity: "100" },
				},
			},
			defaultVariants: {
				disabled: "true",
			},
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		// boolean false should select "false" variant, not fall through to default "true"
		const result = button({ disabled: false });

		expect(result).toContain("_opacity:100");
		expect(result).not.toContain("_opacity:50");
	});

	it("should handle compound variant with both css and className", () => {
		const runtime = {
			variants: {
				color: {
					primary: {},
				},
				disabled: {
					true: {},
					false: {},
				},
			},
			defaultVariants: {
				color: "primary",
				disabled: "true",
			},
			compoundVariants: [
				{
					match: { color: "primary", disabled: "true" },
					css: {
						opacity: "50",
					},
					className: "button--primary-disabled",
				},
			],
		} as const satisfies RecipeRuntime;

		const button = createRecipe("button", runtime);
		const result = button({});

		expect(result).toContain("_opacity:50");
		expect(result).toContain("button--primary-disabled");
	});
});
