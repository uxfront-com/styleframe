import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { recipe } = s;

const colors = ["primary", "secondary", "success", "error"] as const;

// The Button recipe, written with recipe(). Edit the base styles, add a
// variant or change the defaults below to restyle every <Button>.
export const buttonRecipe = recipe({
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
			neutral: {},
		},
		variant: {
			solid: {},
			outline: {},
			soft: {},
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
		color: "neutral",
		variant: "solid",
		size: "md",
	},
	compoundVariants: [
		// One compound per color and variant pair.
		...colors.flatMap((color) => [
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
				},
			},
			{
				match: { color, variant: "soft" as const },
				css: {
					background: `@color.${color}-100`,
					borderColor: "transparent",
					color: `@color.${color}-700`,
					"&:hover": { background: `@color.${color}-150` },
					"&:dark": {
						background: `@color.${color}-850`,
						color: `@color.${color}-200`,
					},
				},
			},
		]),
		{
			match: { color: "neutral" as const, variant: "solid" as const },
			css: {
				background: "@color.surface",
				borderColor: "@color.gray-300",
				color: "@color.text",
				"&:hover": { background: "@color.gray-100" },
				"&:dark": { borderColor: "@color.gray-700" },
			},
		},
		{
			match: { color: "neutral" as const, variant: "outline" as const },
			css: {
				background: "transparent",
				borderColor: "@color.gray-300",
				color: "@color.text",
				"&:dark": { borderColor: "@color.gray-700" },
			},
		},
		{
			match: { color: "neutral" as const, variant: "soft" as const },
			css: {
				background: "@color.gray-100",
				borderColor: "transparent",
				color: "@color.text",
				"&:dark": { background: "@color.gray-850" },
			},
		},
	],
});
