import { useSpinnerCircleRecipe, useSpinnerRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

// Basic example configuration for the Spinner recipe.
// Edit the default variants below to customize every <Spinner>.
// Anything you leave out falls back to the Styleframe theme defaults.
export const spinnerRecipe = useSpinnerRecipe(s, {
	defaultVariants: {
		color: "primary",
		size: "md",
	},
});
export const spinnerCircleRecipe = useSpinnerCircleRecipe(s, {
	defaultVariants: {
		size: "md",
	},
});
