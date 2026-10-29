import { createUseRecipe } from "../../utils/createUseRecipe";

/**
 * Card media recipe for an image at the top of the card, edge to edge.
 *
 * It's shown first while it comes after the header in the DOM, so heading
 * navigation lands at the start of the card. Its aspect ratio holds its space
 * while the image loads, and the text always sits below it.
 */
export const useCardMediaRecipe = createUseRecipe(
	"card-media",
	{
		base: {
			order: "-1",
			overflow: "hidden",
			aspectRatio: "16 / 9",
			background: "color-mix(in srgb, currentColor 8%, transparent)",
			borderStartStartRadius: "calc(@border-radius.md - @border-width.thin)",
			borderStartEndRadius: "calc(@border-radius.md - @border-width.thin)",
		},
		variants: {
			color: {
				light: {},
				dark: {},
				neutral: {},
			},
			variant: {
				solid: {},
				soft: {},
				subtle: {},
			},
			size: {
				sm: {
					borderStartStartRadius:
						"calc(@border-radius.sm - @border-width.thin)",
					borderStartEndRadius: "calc(@border-radius.sm - @border-width.thin)",
				},
				md: {
					borderStartStartRadius:
						"calc(@border-radius.md - @border-width.thin)",
					borderStartEndRadius: "calc(@border-radius.md - @border-width.thin)",
				},
				lg: {
					borderStartStartRadius:
						"calc(@border-radius.lg - @border-width.thin)",
					borderStartEndRadius: "calc(@border-radius.lg - @border-width.thin)",
				},
			},
		},
		defaultVariants: {
			color: "neutral",
			variant: "solid",
			size: "md",
		},
	},
	(s) => {
		// The image fills the media's space, whatever its own size.
		s.selector(".card-media > :is(img, picture, video, svg)", {
			display: "block",
			width: "100%",
			height: "100%",
			objectFit: "cover",
		});
	},
);
