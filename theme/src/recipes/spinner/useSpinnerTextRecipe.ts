import { createUseRecipe } from "../../utils/createUseRecipe";

/**
 * Spinner text recipe.
 * Positions the label text centered over the spinner circle.
 */
export const useSpinnerTextRecipe = createUseRecipe("spinner-text", {
	base: {
		position: "absolute",
		top: "0",
		right: "0",
		bottom: "0",
		left: "0",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		lineHeight: "@line-height.normal",
	},
	variants: {
		size: {
			auto: {},
			sm: {
				fontSize: "@font-size.2xs",
			},
			md: {
				fontSize: "@font-size.xs",
			},
			lg: {
				fontSize: "@font-size.sm",
			},
			em: {},
		},
	},
	defaultVariants: {
		size: "md",
	},
});
