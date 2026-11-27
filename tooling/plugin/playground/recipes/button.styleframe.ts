import { styleframe } from "virtual:styleframe";

const s = styleframe();

const colors = ["primary", "secondary", "success", "error"] as const;

export const button = s.recipe({
	name: "button",
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "@0.375",
		fontWeight: "@font-weight.medium",
		lineHeight: "@line-height.normal",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderColor: "transparent",
		borderRadius: "@border-radius.md",
		cursor: "pointer",
		"&:focus-visible": {
			outlineWidth: "2px",
			outlineStyle: "solid",
			outlineColor: "@color.focus",
			outlineOffset: "2px",
		},
		"&:disabled": {
			cursor: "not-allowed",
			opacity: "0.75",
		},
	},
	variants: {
		color: {
			primary: {},
			secondary: {},
			success: {},
			error: {},
		},
		variant: {
			solid: {},
			outline: {},
			ghost: {},
		},
		size: {
			sm: {
				fontSize: "@font-size.xs",
				paddingTop: "@0.25",
				paddingBottom: "@0.25",
				paddingInline: "@0.5",
			},
			md: {
				fontSize: "@font-size.sm",
				paddingTop: "@0.5",
				paddingBottom: "@0.5",
				paddingInline: "@0.75",
			},
			lg: {
				fontSize: "@font-size.md",
				paddingTop: "@0.625",
				paddingBottom: "@0.625",
				paddingInline: "@1",
			},
		},
	},
	defaultVariants: {
		color: "primary",
		variant: "solid",
		size: "md",
	},
	compoundVariants: colors.flatMap((color) => [
		{
			match: { color, variant: "solid" as const },
			css: {
				background: `@color.${color}`,
				borderColor: `@color.${color}`,
				color: "@color.white",
				"&:hover": { background: `@color.${color}-shade-50` },
			},
		},
		{
			match: { color, variant: "outline" as const },
			css: {
				background: "transparent",
				borderColor: `@color.${color}`,
				color: `@color.${color}`,
				"&:hover": { background: `@color.${color}-50` },
				"&:dark": { color: `@color.${color}-300` },
			},
		},
		{
			match: { color, variant: "ghost" as const },
			css: {
				background: "transparent",
				color: `@color.${color}`,
				"&:hover": { background: `@color.${color}-50` },
				"&:dark": { color: `@color.${color}-300` },
			},
		},
	]),
});

export default s;
