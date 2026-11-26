import { useCalloutRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

// Basic example configuration for the Callout recipe.
// Edit the base styles or default variants below to customize every <Callout>.
// Anything you leave out falls back to the Styleframe theme defaults.
export const calloutRecipe = useCalloutRecipe(s, {
	base: {
		borderRadius: "@border-radius.lg",
	},
	defaultVariants: {
		color: "neutral",
		variant: "subtle",
		size: "md",
	},
});
