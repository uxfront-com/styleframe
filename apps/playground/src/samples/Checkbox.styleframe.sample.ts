import { useCheckboxFieldRecipe, useCheckboxRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

// Basic example configuration for the Checkbox recipe.
// Edit the base styles or default variants below to customize every <Checkbox>.
// Anything you leave out falls back to the Styleframe theme defaults.
export const checkboxRecipe = useCheckboxRecipe(s, {
	defaultVariants: {
		size: "md",
	},
});
export const checkboxFieldRecipe = useCheckboxFieldRecipe(s, {
	base: {
		borderRadius: "@border-radius.sm",
	},
	defaultVariants: {
		size: "md",
	},
});
