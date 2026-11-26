import { useAvatarRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

// Basic example configuration for the Avatar recipe.
// Edit the base styles or default variants below to customize every <Avatar>.
// Anything you leave out falls back to the Styleframe theme defaults.
export const avatarRecipe = useAvatarRecipe(s, {
	base: {
		fontWeight: "@font-weight.semibold",
	},
	defaultVariants: {
		color: "neutral",
		variant: "soft",
		shape: "circle",
		size: "md",
	},
});
