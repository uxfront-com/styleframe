import {
	useCardBodyRecipe,
	useCardFooterRecipe,
	useCardHeaderRecipe,
	useCardRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

// Basic example configuration for the Card recipe.
// Edit the base styles or default variants below to customize every <Card>.
// Anything you leave out falls back to the Styleframe theme defaults.
export const cardRecipe = useCardRecipe(s, {
	base: {
		boxShadow: "@box-shadow.md",
	},
	defaultVariants: {
		color: "light",
		variant: "solid",
		size: "md",
	},
});
export const cardHeaderRecipe = useCardHeaderRecipe(s);
export const cardBodyRecipe = useCardBodyRecipe(s);
export const cardFooterRecipe = useCardFooterRecipe(s);
