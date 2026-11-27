import { styleframe } from "virtual:styleframe";

const s = styleframe();

const colors = ["primary", "secondary", "success", "warning", "error", "info"] as const;

// Warning is a light color, so a white label on it would fall below 4.5:1.
const solidLabel = (color: (typeof colors)[number]) =>
	color === "warning" ? "@color.warning-900" : "@color.white";

export const badge = s.recipe({
	name: "badge",
	base: {
		display: "inline-flex",
		alignItems: "center",
		fontWeight: "@font-weight.medium",
		lineHeight: "@line-height.normal",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderRadius: "@border-radius.md",
	},
	variants: {
		color: {
			primary: {},
			secondary: {},
			success: {},
			warning: {},
			error: {},
			info: {},
		},
		variant: {
			solid: {},
			outline: {},
		},
		size: {
			sm: {
				fontSize: "@font-size.2xs",
				paddingInline: "@0.25",
			},
			md: {
				fontSize: "@font-size.xs",
				paddingTop: "@0.125",
				paddingBottom: "@0.125",
				paddingInline: "@0.375",
			},
			lg: {
				fontSize: "@font-size.sm",
				paddingTop: "@0.25",
				paddingBottom: "@0.25",
				paddingInline: "@0.5",
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
				color: solidLabel(color),
			},
		},
		{
			match: { color, variant: "outline" as const },
			css: {
				background: "transparent",
				borderColor: `@color.${color}`,
				color: color === "warning" ? "@color.warning-700" : `@color.${color}`,
			},
		},
	]),
});

export default s;
