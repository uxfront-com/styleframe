import { createUseRecipe } from "@styleframe/theme";

/**
 * The toolbar's "Save and Run" button: a small solid primary button. While a
 * run is going it's disabled and keeps its resting colors.
 */
export const useRunButtonRecipe = createUseRecipe("pg-run-button", {
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "@0.375",
		minHeight: "@2",
		paddingTop: "@0.375",
		paddingBottom: "@0.375",
		paddingInline: "@0.625",
		fontSize: "@font-size.sm",
		fontWeight: "@font-weight.medium",
		lineHeight: "@line-height.normal",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderColor: "@color.primary-shade-50",
		borderRadius: "@border-radius.md",
		background: "@color.primary",
		color: "@color.white",
		cursor: "pointer",
		userSelect: "none",
		transitionProperty: "color, background-color, border-color",
		transitionTimingFunction: "@easing.ease-in-out",
		transitionDuration: "@duration.fast",
		"&:hover-capable:hover": {
			background: "@color.primary-shade-50",
		},
		"&:active": {
			background: "@color.primary-shade-100",
		},
		"&:focus-visible": {
			outlineWidth: "2px",
			outlineStyle: "solid",
			outlineColor: "@color.focus",
			outlineOffset: "2px",
		},
		"&:disabled": {
			cursor: "not-allowed",
			opacity: "0.75",
			background: "@color.primary",
		},
		"&:dark": {
			borderColor: "@color.primary-tint-50",
		},
	},
});
