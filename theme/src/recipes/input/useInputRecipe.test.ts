import { styleframe } from "@styleframe/core";
import { useDarkModifier } from "../../modifiers/useMediaPreferenceModifiers";
import {
	useFocusWithinModifier,
	useHoverModifier,
} from "../../modifiers/usePseudoStateModifiers";
import { useInputRecipe } from "./useInputRecipe";

function createInstance() {
	const s = styleframe();
	for (const name of [
		"display",
		"alignItems",
		"flexGrow",
		"minWidth",
		"width",
		"fontFamily",
		"fontSize",
		"fontWeight",
		"lineHeight",
		"border",
		"borderWidth",
		"borderStyle",
		"borderColor",
		"borderRadius",
		"borderBottomColor",
		"borderBottomLeftRadius",
		"borderBottomRightRadius",
		"padding",
		"paddingTop",
		"paddingBottom",
		"paddingLeft",
		"paddingRight",
		"background",
		"color",
		"outline",
		"outlineWidth",
		"outlineStyle",
		"outlineColor",
		"outlineOffset",
		"cursor",
		"opacity",
		"transitionProperty",
		"transitionTimingFunction",
		"transitionDuration",
	]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
	s.variable("color.text-weakest", "#64748B", { default: true });
	useDarkModifier(s);
	useHoverModifier(s);
	useFocusWithinModifier(s);
	return s;
}

describe("useInputRecipe", () => {
	it("should create a recipe with correct metadata", () => {
		const s = createInstance();
		const recipe = useInputRecipe(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("input");
	});

	it("should have correct base styles", () => {
		const s = createInstance();
		const recipe = useInputRecipe(s);

		expect(recipe.base).toEqual({
			display: "inline-flex",
			alignItems: "center",
			fontFamily: "inherit",
			fontSize: "@font-size.sm",
			fontWeight: "@font-weight.normal",
			lineHeight: "@line-height.normal",
			borderWidth: "@border-width.thin",
			borderStyle: "@border-style.solid",
			borderColor: "transparent",
			borderRadius: "@border-radius.md",
			paddingTop: "@0.5",
			paddingBottom: "@0.5",
			paddingLeft: "@0.75",
			paddingRight: "@0.75",
			background: "transparent",
			color: "@color.text",
			outline: "none",
			transitionProperty: "color, background-color, border-color",
			transitionTimingFunction: "@easing.ease-in-out",
			transitionDuration: "150ms",
			"&:focus-within": {
				outlineWidth: "2px",
				outlineStyle: "solid",
				outlineColor: "@color.primary",
				outlineOffset: "2px",
			},
		});
	});

	describe("variants", () => {
		it("should have all color variants", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"light",
				"dark",
				"neutral",
			]);
		});

		it("should have all style variants", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			expect(Object.keys(recipe.variants!.variant)).toEqual([
				"default",
				"soft",
				"ghost",
			]);
		});

		it("should have size variants with correct styles", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			expect(recipe.variants!.size).toEqual({
				sm: {
					fontSize: "@font-size.xs",
					paddingTop: "@0.375",
					paddingBottom: "@0.375",
					paddingLeft: "@0.625",
					paddingRight: "@0.625",
					borderRadius: "@border-radius.sm",
				},
				md: {
					fontSize: "@font-size.sm",
					paddingTop: "@0.5",
					paddingBottom: "@0.5",
					paddingLeft: "@0.75",
					paddingRight: "@0.75",
					borderRadius: "@border-radius.md",
				},
				lg: {
					fontSize: "@font-size.md",
					paddingTop: "@0.625",
					paddingBottom: "@0.625",
					paddingLeft: "@0.875",
					paddingRight: "@0.875",
					borderRadius: "@border-radius.md",
				},
			});
		});

		it("should have invalid boolean variants", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			expect(recipe.variants!.invalid).toEqual({
				true: {},
				false: {},
			});
		});

		it("should have disabled boolean variants", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			expect(recipe.variants!.disabled).toEqual({
				true: {},
				false: {},
			});
		});

		it("should have readonly boolean variants", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			expect(recipe.variants!.readonly).toEqual({
				true: {},
				false: {},
			});
		});
	});

	it("should have correct default variants", () => {
		const s = createInstance();
		const recipe = useInputRecipe(s);

		expect(recipe.defaultVariants).toEqual({
			color: "neutral",
			variant: "default",
			size: "md",
			invalid: "false",
			disabled: "false",
			readonly: "false",
		});
	});

	describe("compound variants", () => {
		it("should have 12 compound variants total", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			// 3 colors × 3 variants = 9, plus 3 standalone (invalid, readonly, disabled)
			expect(recipe.compoundVariants).toHaveLength(12);
		});

		it("should have correct light default compound variant", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.color === "light" && v.match.variant === "default",
			);

			expect(cv).toEqual({
				match: { color: "light", variant: "default" },
				css: {
					background: "@color.white",
					borderColor: "@color.gray-450",
					color: "@color.text",
					"&:hover": {
						borderColor: "@color.gray-500",
					},
					"&:dark": {
						background: "@color.white",
						borderColor: "@color.gray-450",
						color: "@color.text-inverted",
					},
					"&:dark:hover": {
						borderColor: "@color.gray-500",
					},
				},
			});
		});

		it("should have correct dark soft compound variant", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.color === "dark" && v.match.variant === "soft",
			);

			expect(cv).toEqual({
				match: { color: "dark", variant: "soft" },
				css: {
					background: "@color.gray-800",
					borderColor: "@color.gray-500",
					color: "@color.gray-300",
					"&:hover": {
						borderColor: "@color.gray-450",
					},
					"&:dark": {
						background: "@color.gray-800",
						borderColor: "@color.gray-500",
						color: "@color.gray-300",
					},
					"&:dark:hover": {
						borderColor: "@color.gray-450",
					},
				},
			});
		});

		it("should have correct neutral default compound variant with adaptive dark mode", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.color === "neutral" && v.match.variant === "default",
			);

			expect(cv).toEqual({
				match: { color: "neutral", variant: "default" },
				css: {
					background: "@color.white",
					borderColor: "@color.gray-450",
					color: "@color.text",
					"&:hover": {
						borderColor: "@color.gray-500",
					},
					"&:dark": {
						background: "@color.gray-900",
						borderColor: "@color.gray-500",
						color: "@color.white",
					},
					"&:dark:hover": {
						borderColor: "@color.gray-450",
					},
				},
			});
		});

		it("should give the neutral ghost compound variant an adaptive bottom border and square bottom corners", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.color === "neutral" && v.match.variant === "ghost",
			);

			expect(cv).toEqual({
				match: { color: "neutral", variant: "ghost" },
				css: {
					background: "transparent",
					borderColor: "transparent",
					borderBottomColor: "@color.gray-450",
					borderBottomLeftRadius: "0",
					borderBottomRightRadius: "0",
					color: "@color.text",
					"&:hover": {
						borderBottomColor: "@color.gray-500",
					},
					"&:dark": {
						background: "transparent",
						borderColor: "transparent",
						borderBottomColor: "@color.gray-500",
						color: "@color.white",
					},
					"&:dark:hover": {
						borderBottomColor: "@color.gray-450",
					},
				},
			});
		});

		it("should paint a ghost invalid bottom border with the error color", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const ghost = recipe.compoundVariants!.findIndex(
				(v) => v.match.color === "neutral" && v.match.variant === "ghost",
			);
			const invalid = recipe.compoundVariants!.findIndex(
				(v) => v.match.invalid === "true",
			);

			// A later compound replaces an earlier one's key, so invalid must follow ghost.
			expect(invalid).toBeGreaterThan(ghost);
			expect(recipe.compoundVariants![invalid]!.css).toMatchObject({
				borderBottomColor: "@color.error",
				"&:hover": { borderBottomColor: "@color.error" },
				"&:dark": { borderBottomColor: "@color.error" },
				"&:dark:hover": { borderBottomColor: "@color.error" },
			});
		});

		it("should have correct invalid compound variant overriding border and focus-within ring", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.invalid === "true",
			);

			expect(cv).toEqual({
				match: { invalid: "true" },
				css: {
					borderColor: "@color.error",
					borderBottomColor: "@color.error",
					"&:hover": {
						borderColor: "@color.error",
						borderBottomColor: "@color.error",
					},
					"&:focus-within": {
						outlineColor: "@color.error",
					},
					"&:dark": {
						borderColor: "@color.error",
						borderBottomColor: "@color.error",
					},
					"&:dark:hover": {
						borderColor: "@color.error",
						borderBottomColor: "@color.error",
					},
				},
			});
		});

		it("should have correct readonly compound variant with a dashed border", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.readonly === "true",
			);

			expect(cv).toEqual({
				match: { readonly: "true" },
				css: {
					background: "@color.gray-50",
					borderStyle: "@border-style.dashed",
					cursor: "default",
					"&:dark": {
						background: "@color.gray-800",
					},
				},
			});
		});

		it("should have correct disabled compound variant with dimmed styling", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.disabled === "true",
			);

			expect(cv).toEqual({
				match: { disabled: "true" },
				css: {
					opacity: "0.5",
					cursor: "not-allowed",
				},
			});
		});
	});

	describe("setup callback", () => {
		it("should register a .input-field selector with transparent styling", () => {
			const s = createInstance();
			useInputRecipe(s);

			const inputFieldSelector = s.root.children.find(
				(child) =>
					child.type === "selector" &&
					(child as { query: string }).query === ".input-field",
			) as { type: "selector"; query: string; children: unknown[] } | undefined;

			expect(inputFieldSelector).toBeDefined();
			expect(inputFieldSelector?.query).toBe(".input-field");
		});

		it("should give the disabled nested input a not-allowed cursor", () => {
			const s = createInstance();
			useInputRecipe(s);

			const inputFieldSelector = s.root.children.find(
				(child) =>
					child.type === "selector" &&
					(child as { query: string }).query === ".input-field",
			) as
				| {
						children: {
							query: string;
							declarations: Record<string, unknown>;
						}[];
				  }
				| undefined;

			expect(
				inputFieldSelector?.children.find(
					(child) => child.query === "&:disabled",
				)?.declarations,
			).toEqual({ cursor: "not-allowed" });
		});
	});

	describe("config overrides", () => {
		it("should allow overriding base styles", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s, {
				base: { display: "block" },
			});

			expect(recipe.base!.display).toBe("block");
		});
	});

	describe("filter", () => {
		it("should filter color variants", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s, {
				filter: { color: ["neutral"] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["neutral"]);
		});

		it("should prune compound variants when filtering colors", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s, {
				filter: { color: ["neutral"] },
			});

			// Every color-scoped compound variant should be for `neutral`;
			// the standalone invalid/readonly/disabled compounds have no `color` field.
			expect(
				recipe.compoundVariants!.every(
					(cv) => cv.match.color === undefined || cv.match.color === "neutral",
				),
			).toBe(true);
			expect(recipe.compoundVariants!.length).toBeLessThan(12);
		});

		it("should filter variant axis", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s, {
				filter: { variant: ["default", "soft"] },
			});

			expect(Object.keys(recipe.variants!.variant)).toEqual([
				"default",
				"soft",
			]);
		});

		it("should adjust default variants when filtered out", () => {
			const s = createInstance();
			const recipe = useInputRecipe(s, {
				filter: { color: ["light"] },
			});

			expect(recipe.defaultVariants?.color).toBeUndefined();
			expect(recipe.defaultVariants?.variant).toBe("default");
			expect(recipe.defaultVariants?.size).toBe("md");
		});
	});
});
