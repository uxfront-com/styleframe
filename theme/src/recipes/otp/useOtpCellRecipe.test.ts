import { styleframe } from "@styleframe/core";
import { useDarkModifier } from "../../modifiers/useMediaPreferenceModifiers";
import {
	useFocusVisibleModifier,
	useHoverModifier,
} from "../../modifiers/usePseudoStateModifiers";
import { useOtpCellRecipe } from "./useOtpCellRecipe";

function createInstance() {
	const s = styleframe();
	for (const name of [
		"boxSizing",
		"textAlign",
		"padding",
		"fontFamily",
		"fontWeight",
		"lineHeight",
		"borderWidth",
		"borderStyle",
		"borderColor",
		"borderRadius",
		"width",
		"height",
		"fontSize",
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
	useDarkModifier(s);
	useHoverModifier(s);
	useFocusVisibleModifier(s);
	return s;
}

describe("useOtpCellRecipe", () => {
	it("should create a recipe with correct metadata", () => {
		const s = createInstance();
		const recipe = useOtpCellRecipe(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("otp-cell");
	});

	it("should have correct base styles with centered text and a focus-visible ring", () => {
		const s = createInstance();
		const recipe = useOtpCellRecipe(s);

		expect(recipe.base).toEqual({
			boxSizing: "border-box",
			textAlign: "center",
			padding: "0",
			fontFamily: "inherit",
			fontWeight: "@font-weight.medium",
			lineHeight: "@line-height.normal",
			borderWidth: "@border-width.thin",
			borderStyle: "@border-style.solid",
			borderColor: "transparent",
			background: "transparent",
			color: "@color.text",
			outline: "none",
			transitionProperty: "color, background-color, border-color",
			transitionTimingFunction: "@easing.ease-in-out",
			transitionDuration: "150ms",
			"&:focus-visible": {
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
			const recipe = useOtpCellRecipe(s);

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"light",
				"dark",
				"neutral",
			]);
		});

		it("should have all style variants", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			expect(Object.keys(recipe.variants!.variant)).toEqual([
				"default",
				"soft",
				"ghost",
			]);
		});

		it("should have square size variants with scaled font and radius", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			expect(recipe.variants!.size).toEqual({
				sm: {
					width: "40px",
					height: "40px",
					fontSize: "@font-size.sm",
					borderRadius: "@border-radius.sm",
				},
				md: {
					width: "48px",
					height: "48px",
					fontSize: "@font-size.md",
					borderRadius: "@border-radius.md",
				},
				lg: {
					width: "56px",
					height: "56px",
					fontSize: "@font-size.lg",
					borderRadius: "@border-radius.md",
				},
			});
		});

		it("should have invalid boolean variants", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			expect(recipe.variants!.invalid).toEqual({
				true: {},
				false: {},
			});
		});

		it("should have disabled boolean variants", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			expect(recipe.variants!.disabled).toEqual({
				true: {},
				false: {},
			});
		});

		it("should not declare a readonly axis", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			expect(recipe.variants).not.toHaveProperty("readonly");
		});
	});

	it("should have correct default variants", () => {
		const s = createInstance();
		const recipe = useOtpCellRecipe(s);

		expect(recipe.defaultVariants).toEqual({
			color: "neutral",
			variant: "default",
			size: "md",
			invalid: "false",
			disabled: "false",
		});
	});

	describe("compound variants", () => {
		it("should have 11 compound variants total (9 color×variant + invalid + disabled)", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			expect(recipe.compoundVariants).toHaveLength(11);
		});

		it("should share the neutral default surface with the input recipe", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.color === "neutral" && v.match.variant === "default",
			);

			expect(cv).toEqual({
				match: { color: "neutral", variant: "default" },
				css: {
					background: "@color.white",
					borderColor: "@color.gray-200",
					color: "@color.text",
					"&:hover": {
						borderColor: "@color.gray-300",
					},
					"&:dark": {
						background: "@color.gray-900",
						borderColor: "@color.gray-700",
						color: "@color.white",
					},
					"&:dark:hover": {
						borderColor: "@color.gray-600",
					},
				},
			});
		});

		it("should override the focus-visible ring (not focus-within) when invalid", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.invalid === "true",
			);

			expect(cv).toEqual({
				match: { invalid: "true" },
				css: {
					borderColor: "@color.error",
					"&:hover": {
						borderColor: "@color.error",
					},
					"&:focus-visible": {
						outlineColor: "@color.error",
					},
					"&:dark": {
						borderColor: "@color.error",
					},
					"&:dark:hover": {
						borderColor: "@color.error",
					},
				},
			});
		});

		it("should not include a readonly compound variant", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => (v.match as Record<string, unknown>).readonly === "true",
			);

			expect(cv).toBeUndefined();
		});

		it("should dim and show a not-allowed cursor when disabled", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s);

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

	describe("config overrides", () => {
		it("should allow overriding base styles", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s, {
				base: { textAlign: "left" },
			});

			expect(recipe.base!.textAlign).toBe("left");
		});
	});

	describe("filter", () => {
		it("should filter color variants", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s, {
				filter: { color: ["neutral"] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["neutral"]);
		});

		it("should prune color-scoped compound variants when filtering colors", () => {
			const s = createInstance();
			const recipe = useOtpCellRecipe(s, {
				filter: { color: ["neutral"] },
			});

			expect(
				recipe.compoundVariants!.every(
					(cv) => cv.match.color === undefined || cv.match.color === "neutral",
				),
			).toBe(true);
			expect(recipe.compoundVariants!.length).toBeLessThan(11);
		});
	});
});
