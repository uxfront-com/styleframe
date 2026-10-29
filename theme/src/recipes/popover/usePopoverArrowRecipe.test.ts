import { styleframe } from "@styleframe/core";
import type { Selector } from "@styleframe/core";
import {
	useDarkModifier,
	useForcedColorsModifier,
} from "../../modifiers/useMediaPreferenceModifiers";
import { useAfterModifier } from "../../modifiers/usePseudoElementModifiers";
import { usePopoverArrowRecipe } from "./index";

const sides = ["Top", "Bottom", "InlineStart", "InlineEnd"] as const;

function createInstance() {
	const s = styleframe();
	for (const name of [
		"position",
		"width",
		"height",
		...sides.flatMap((side) => [
			`border${side}Width`,
			`border${side}Style`,
			`border${side}Color`,
		]),
		"zIndex",
		"insetInlineStart",
		"top",
		"color",
		"display",
	]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
	useDarkModifier(s);
	useAfterModifier(s);
	useForcedColorsModifier(s);
	return s;
}

function findSelector(
	s: ReturnType<typeof createInstance>,
	query: string,
): Selector | undefined {
	return s.root.children.find(
		(child): child is Selector =>
			child.type === "selector" && child.query === query,
	);
}

describe("usePopoverArrowRecipe", () => {
	it("should create a recipe with correct metadata", () => {
		const s = createInstance();
		const recipe = usePopoverArrowRecipe(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("popover-arrow");
	});

	it("should have correct base styles", () => {
		const s = createInstance();
		const recipe = usePopoverArrowRecipe(s);

		expect(recipe.base).toEqual({
			width: "0",
			height: "0",
			position: "absolute",
			zIndex: "@z-index.popover",
			"&:after": {
				position: "absolute",
				zIndex: "0",
			},
			"&:forced-colors": {
				display: "none",
			},
		});
	});

	describe("variants", () => {
		it("should have all color variants", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"light",
				"dark",
				"neutral",
			]);
		});

		it("should have all style variants", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			expect(Object.keys(recipe.variants!.variant)).toEqual([
				"solid",
				"soft",
				"subtle",
			]);
		});

		it("should keep the downward arrow as the top placement", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			expect(recipe.variants!.placement.top).toEqual({
				borderInlineStartWidth: "calc(@popover.arrow.size + 1px)",
				borderInlineStartStyle: "@border-style.solid",
				borderInlineStartColor: "transparent",
				borderInlineEndWidth: "calc(@popover.arrow.size + 1px)",
				borderInlineEndStyle: "@border-style.solid",
				borderInlineEndColor: "transparent",
				borderTopWidth: "calc(@popover.arrow.size + 1px)",
				borderTopStyle: "@border-style.solid",
				borderTopColor: "currentColor",
				"&:after": {
					borderInlineStartWidth: "@popover.arrow.size",
					borderInlineStartStyle: "@border-style.solid",
					borderInlineStartColor: "transparent",
					borderInlineEndWidth: "@popover.arrow.size",
					borderInlineEndStyle: "@border-style.solid",
					borderInlineEndColor: "transparent",
					borderTopWidth: "@popover.arrow.size",
					borderTopStyle: "@border-style.solid",
					borderTopColor: "currentColor",
					insetInlineStart: "calc(@popover.arrow.size * -1)",
					top: "calc(@popover.arrow.size * -1 - 1px)",
				},
			});
		});
	});

	it("should have correct default variants", () => {
		const s = createInstance();
		const recipe = usePopoverArrowRecipe(s);

		expect(recipe.defaultVariants).toEqual({
			color: "neutral",
			variant: "solid",
			placement: "top",
		});
	});

	describe("compound variants", () => {
		it("should have 13 compound variants total", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			// 3 colors × 3 variants + 4 placements = 13
			expect(recipe.compoundVariants).toHaveLength(13);
		});

		it("should have correct neutral solid compound variant", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			const neutralSolid = recipe.compoundVariants!.find(
				(cv) => cv.match.color === "neutral" && cv.match.variant === "solid",
			);

			expect(neutralSolid).toEqual({
				match: { color: "neutral", variant: "solid" },
				css: {
					color: "@color.gray-200",
					"&:after": {
						color: "@color.white",
					},
					"&:dark": {
						color: "@color.gray-700",
					},
					"&:dark:after": {
						color: "@color.gray-900",
					},
				},
			});
		});

		it("should have correct light soft compound variant", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			const lightSoft = recipe.compoundVariants!.find(
				(cv) => cv.match.color === "light" && cv.match.variant === "soft",
			);

			expect(lightSoft).toEqual({
				match: { color: "light", variant: "soft" },
				css: {
					color: "@color.gray-50",
					"&:after": {
						color: "@color.gray-50",
					},
					"&:dark": {
						color: "@color.gray-50",
					},
					"&:dark:after": {
						color: "@color.gray-50",
					},
				},
			});
		});

		it("should have correct dark subtle compound variant", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			const darkSubtle = recipe.compoundVariants!.find(
				(cv) => cv.match.color === "dark" && cv.match.variant === "subtle",
			);

			expect(darkSubtle).toEqual({
				match: { color: "dark", variant: "subtle" },
				css: {
					color: "@color.gray-700",
					"&:after": {
						color: "@color.gray-800",
					},
					"&:dark": {
						color: "@color.gray-700",
					},
					"&:dark:after": {
						color: "@color.gray-800",
					},
				},
			});
		});
	});

	describe("Open Components rules", () => {
		// The side drawn in `currentColor` is the one the arrow points away from.
		const drawn = {
			top: "Top",
			bottom: "Bottom",
			start: "InlineStart",
			end: "InlineEnd",
		} as const;

		it.each(Object.entries(drawn))(
			"popover/points-at-trigger turns the arrow back at the anchor for %s",
			(placement, colored) => {
				const s = createInstance();
				const recipe = usePopoverArrowRecipe(s);
				const block = recipe.variants!.placement[
					placement as keyof typeof drawn
				] as Record<string, unknown>;
				const after = block["&:after"] as Record<string, unknown>;

				for (const side of sides) {
					const expected =
						side === colored
							? "currentColor"
							: block[`border${side}Width`]
								? "transparent"
								: undefined;
					expect(block[`border${side}Color`]).toBe(expected);
					expect(after[`border${side}Color`]).toBe(expected);
				}
				expect(
					recipe.compoundVariants!.find(
						(cv) => cv.match.placement === placement,
					),
				).toEqual({
					match: { placement },
					className: `-placement-${placement}`,
				});
			},
		);

		it("popover/points-at-trigger sits on the edge that faces the anchor inside a top-layer popover", () => {
			const s = createInstance();
			usePopoverArrowRecipe(s);

			// Calculated values resolve to `css` tokens, so the test reads their keys.
			const centred = expect.objectContaining({ type: "css" });
			expect(
				findSelector(s, ".popover[popover] > .popover-arrow.-placement-top")
					?.declarations,
			).toEqual({ top: "100%", insetInlineStart: centred });
			expect(
				findSelector(s, ".popover[popover] > .popover-arrow.-placement-bottom")
					?.declarations,
			).toEqual({ bottom: "100%", insetInlineStart: centred });
			expect(
				findSelector(s, ".popover[popover] > .popover-arrow.-placement-start")
					?.declarations,
			).toEqual({ top: centred, insetInlineStart: "100%" });
			expect(
				findSelector(s, ".popover[popover] > .popover-arrow.-placement-end")
					?.declarations,
			).toEqual({ top: centred, insetInlineEnd: "100%" });
		});

		it("popover/follows-direction places the arrow with logical properties only", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			expect(JSON.stringify(recipe)).not.toMatch(
				/"(left|right|border(Left|Right)\w*)"/,
			);
		});

		it("popover/forced-colors hides the border-drawn arrow rather than drawing a block", () => {
			const s = createInstance();
			const recipe = usePopoverArrowRecipe(s);

			expect(recipe.base!["&:forced-colors"]).toEqual({ display: "none" });
		});

		it("popover/resizable sizes the arrow in rem", () => {
			const s = createInstance();
			usePopoverArrowRecipe(s);

			expect(
				s.root.variables.find((v) => v.name === "popover.arrow.size")?.value,
			).toBe("0.375rem");
		});
	});
});
