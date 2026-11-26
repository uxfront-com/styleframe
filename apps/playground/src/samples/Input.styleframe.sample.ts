import { useInputRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

// Basic example configuration for the Input recipe.
// Edit the base styles or default variants below to customize every <Input>.
// Anything you leave out falls back to the Styleframe theme defaults.
export const inputRecipe = useInputRecipe(s, {
	base: {
		borderRadius: "@border-radius.md",
	},
	defaultVariants: {
		color: "neutral",
		variant: "default",
		size: "md",
	},
});
