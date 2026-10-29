import { styleframe } from "@styleframe/core";
import {
	useDarkModifier,
	useForcedColorsModifier,
	useHoverCapableModifier,
} from "../../modifiers/useMediaPreferenceModifiers";
import {
	useFocusWithinModifier,
	useHoverModifier,
} from "../../modifiers/usePseudoStateModifiers";
import { useInputDateRecipe } from "./useInputDateRecipe";

function createInstance() {
	const s = styleframe();
	for (const name of [
		"display",
		"alignItems",
		"gap",
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
		"userSelect",
		"outline",
		"outlineWidth",
		"outlineStyle",
		"outlineColor",
		"outlineOffset",
		"cursor",
		"opacity",
		"minHeight",
		"boxShadow",
		"transitionProperty",
		"transitionTimingFunction",
		"transitionDuration",
	]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
	s.variable("color.text-weakest", "#64748B", { default: true });
	s.variable("color.text-weak", "#475569", { default: true });
	s.variable("color.gray-400", "#94A3B8", { default: true });
	s.variable("spacing", "1rem", { default: true });
	s.variable("color.error", "#D22E3E", { default: true });
	s.variable("border-style.dashed", "dashed", { default: true });
	useDarkModifier(s);
	useHoverCapableModifier(s);
	useForcedColorsModifier(s);
	useHoverModifier(s);
	useFocusWithinModifier(s);
	return s;
}

describe("useInputDateRecipe", () => {
	it("should create a recipe with correct metadata", () => {
		const s = createInstance();
		const recipe = useInputDateRecipe(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("input-date");
	});

	it("should have correct base styles with a focus-within ring", () => {
		const s = createInstance();
		const recipe = useInputDateRecipe(s);

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
				outlineColor: "@color.focus",
				outlineOffset: "2px",
			},
			"&:forced-colors:focus-within": {
				outlineColor: "Highlight",
			},
		});
	});

	describe("variants", () => {
		it("should have all color variants", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"light",
				"dark",
				"neutral",
			]);
		});

		it("should have all style variants", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			expect(Object.keys(recipe.variants!.variant)).toEqual([
				"default",
				"soft",
				"ghost",
			]);
		});

		it("should have size variants matching the field family", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			expect(Object.keys(recipe.variants!.size)).toEqual(["sm", "md", "lg"]);
		});

		it("should have invalid boolean variants", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			expect(recipe.variants!.invalid).toEqual({ true: {}, false: {} });
		});

		it("should have disabled boolean variants", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			expect(recipe.variants!.disabled).toEqual({ true: {}, false: {} });
		});

		it("should have readonly boolean variants", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			expect(recipe.variants!.readonly).toEqual({ true: {}, false: {} });
		});
	});

	it("should have correct default variants", () => {
		const s = createInstance();
		const recipe = useInputDateRecipe(s);

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
		it("should have 12 compound variants total (9 color×variant + invalid + readonly + disabled)", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			expect(recipe.compoundVariants).toHaveLength(12);
		});

		it("should share the neutral default surface with the input recipe", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.color === "neutral" && v.match.variant === "default",
			);

			expect(cv).toEqual({
				match: { color: "neutral", variant: "default" },
				css: {
					background: "@color.white",
					borderColor: "@color.gray-450",
					color: "@color.text",
					"&:hover-capable:hover": {
						borderColor: "@color.gray-500",
					},
					"&:dark": {
						background: "@color.gray-900",
						borderColor: "@color.gray-500",
						color: "@color.white",
					},
					"&:dark:hover-capable:hover": {
						borderColor: "@color.gray-450",
					},
				},
			});
		});

		it("should give the neutral ghost compound variant an adaptive bottom border and square bottom corners", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

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
					"&:hover-capable:hover": {
						borderBottomColor: "@color.gray-500",
					},
					"&:dark": {
						background: "transparent",
						borderColor: "transparent",
						borderBottomColor: "@color.gray-500",
						color: "@color.white",
					},
					"&:dark:hover-capable:hover": {
						borderBottomColor: "@color.gray-450",
					},
				},
			});
		});

		it("should paint a ghost invalid bottom border with the error color", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

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
				"&:hover-capable:hover": { borderBottomColor: "@color.error" },
				"&:dark": { borderBottomColor: "@color.error" },
				"&:dark:hover-capable:hover": { borderBottomColor: "@color.error" },
			});
		});

		it("should have correct readonly compound variant with a dashed border", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.readonly === "true",
			);

			expect(cv).toEqual({
				match: { readonly: "true" },
				css: {
					borderStyle: "@border-style.dashed",
					cursor: "default",
				},
			});
		});

		it("should keep the focus-within ring and add an inset error shadow when invalid", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.invalid === "true",
			);

			expect(cv).toEqual({
				match: { invalid: "true" },
				css: {
					borderColor: "@color.error",
					borderBottomColor: "@color.error",
					boxShadow: "inset 0 0 0 1px @color.error",
					"&:hover-capable:hover": {
						borderColor: "@color.error",
						borderBottomColor: "@color.error",
					},
					"&:dark": {
						borderColor: "@color.error",
						borderBottomColor: "@color.error",
					},
					"&:dark:hover-capable:hover": {
						borderColor: "@color.error",
						borderBottomColor: "@color.error",
					},
				},
			});
		});

		it("should dim and show a not-allowed cursor when disabled", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.disabled === "true",
			);

			expect(cv).toEqual({
				match: { disabled: "true" },
				css: {
					opacity: "0.5",
					cursor: "not-allowed",
					"&:forced-colors": {
						borderColor: "GrayText",
						color: "GrayText",
						opacity: "1",
					},
					"&:dark:forced-colors": {
						borderColor: "GrayText",
						color: "GrayText",
					},
				},
			});
		});
	});

	describe("setup callback", () => {
		it("should register a .input-date-field selector", () => {
			const s = createInstance();
			useInputDateRecipe(s);

			const found = s.root.children.find(
				(child) =>
					child.type === "selector" &&
					(child as { query: string }).query === ".input-date-field",
			);

			expect(found).toBeDefined();
		});

		it("should register a .input-date-separator selector", () => {
			const s = createInstance();
			useInputDateRecipe(s);

			const found = s.root.children.find(
				(child) =>
					child.type === "selector" &&
					(child as { query: string }).query === ".input-date-separator",
			);

			expect(found).toBeDefined();
		});

		it("should keep the segments and separators at one font size on touch screens", () => {
			const s = createInstance();
			useInputDateRecipe(s);

			// The touch-screen text size belongs to text inputs. On the segment
			// container it would grow only the separators.
			const touch = (
				s.root.children.filter(
					(child) =>
						child.type === "selector" &&
						(child as { query: string }).query === ".input-date-field",
				) as unknown as {
					children: { rule?: string; declarations: Record<string, unknown> }[];
				}[]
			)
				.flatMap((selector) => selector.children)
				.filter((child) => child.rule === "(any-pointer: coarse)");

			expect(touch.map((child) => child.declarations.fontSize)).toEqual([]);
		});
	});

	describe("filter", () => {
		it("should filter color variants", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s, {
				filter: { color: ["neutral"] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["neutral"]);
		});

		it("should prune color-scoped compound variants when filtering colors", () => {
			const s = createInstance();
			const recipe = useInputDateRecipe(s, {
				filter: { color: ["neutral"] },
			});

			expect(
				recipe.compoundVariants!.every(
					(cv) => cv.match.color === undefined || cv.match.color === "neutral",
				),
			).toBe(true);
			expect(recipe.compoundVariants!.length).toBeLessThan(12);
		});
	});
});
