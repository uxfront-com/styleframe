import { createFieldRecipe } from "../input/createFieldRecipe";

/**
 * Textarea wrapper recipe. The `.textarea` class sits on a wrapper element that
 * contains an optional inline `#prefix` slot, a nested
 * `<textarea class="textarea-field">`, and an optional inline `#suffix` slot.
 * The wrapper owns the visual field (border, background, padding, focus ring via
 * `:focus-within`); the nested textarea is transparent and inherits typography.
 *
 * Mirrors the Input recipe — color (light, dark, neutral), variant (default,
 * soft, ghost), size, and the `invalid` / `disabled` / `readonly` boolean axes
 * that map to the equivalent native `<textarea>` attributes — and adds a
 * `resize` axis (none, vertical, horizontal, both). Built from the same shared
 * field surface as Input (`../input/createFieldRecipe`); the textarea wrapper is
 * a top-aligned block (flex, flex-start). Because `resize` must apply to the
 * real `<textarea>`, each value adds a marker class on the wrapper and the setup
 * maps it onto the nested `.textarea-field`.
 */
export const useTextareaRecipe = createFieldRecipe(
	"textarea",
	{
		base: {
			display: "flex",
			alignItems: "flex-start",
		},
		variants: {
			resize: {
				none: {},
				vertical: {},
				horizontal: {},
				both: {},
			},
		},
		compoundVariants: [
			{ match: { resize: "none" }, className: "-resize-none" },
			{ match: { resize: "vertical" }, className: "-resize-vertical" },
			{ match: { resize: "horizontal" }, className: "-resize-horizontal" },
			{ match: { resize: "both" }, className: "-resize-both" },
		],
		defaultVariants: {
			resize: "vertical",
		},
	},
	(s) => {
		const { selector } = s;

		selector(".textarea.-resize-none .textarea-field", { resize: "none" });
		selector(".textarea.-resize-vertical .textarea-field", {
			resize: "vertical",
		});
		selector(".textarea.-resize-horizontal .textarea-field", {
			resize: "horizontal",
		});
		selector(".textarea.-resize-both .textarea-field", { resize: "both" });
		// Same specificity as the resize selectors, so it wins by coming last.
		selector(".textarea .textarea-field:disabled", { resize: "none" });
	},
);
