import { useButtonRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

// Basic example configuration for the Button recipe.
// Edit the base styles or default variants below to customize every <Button>.
// Anything you leave out falls back to the Styleframe theme defaults.
export const buttonRecipe = useButtonRecipe(s, {
	base: {
		fontWeight: "@font-weight.medium",
		borderRadius: "@border-radius.md",
	},
	defaultVariants: {
		color: "neutral",
		variant: "solid",
		size: "md",
	},
});
