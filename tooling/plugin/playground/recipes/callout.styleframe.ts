import { styleframe } from "virtual:styleframe";

const s = styleframe();

const colors = ["success", "warning", "error", "info"] as const;

export const callout = s.recipe({
	name: "callout",
	base: {
		display: "flex",
		alignItems: "flex-start",
		gap: "@0.75",
		paddingTop: "@0.75",
		paddingBottom: "@0.75",
		paddingInline: "@1",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderRadius: "@border-radius.md",
	},
	variants: {
		color: {
			success: {},
			warning: {},
			error: {},
			info: {},
		},
	},
	defaultVariants: {
		color: "info",
	},
	compoundVariants: colors.map((color) => ({
		match: { color },
		css: {
			background: `@color.${color}-50`,
			borderColor: `@color.${color}-200`,
			color: `@color.${color}-800`,
			"&:dark": {
				background: `@color.${color}-950`,
				borderColor: `@color.${color}-800`,
				color: `@color.${color}-200`,
			},
		},
	})),
});

export const calloutIcon = s.recipe({
	name: "callout-icon",
	base: {
		flexShrink: "0",
		fontSize: "@font-size.lg",
		lineHeight: "@line-height.tight",
	},
});

export const calloutContent = s.recipe({
	name: "callout-content",
	base: {
		display: "flex",
		flexDirection: "column",
		flex: "1",
		gap: "@0.25",
		minWidth: "0",
	},
});

export const calloutTitle = s.recipe({
	name: "callout-title",
	base: {
		fontSize: "@font-size.sm",
		fontWeight: "@font-weight.semibold",
		lineHeight: "@line-height.normal",
	},
});

export const calloutDescription = s.recipe({
	name: "callout-description",
	base: {
		fontSize: "@font-size.sm",
		lineHeight: "@line-height.normal",
	},
});

export const calloutDismiss = s.recipe({
	name: "callout-dismiss",
	base: {
		flexShrink: "0",
		paddingInline: "@0.25",
		background: "transparent",
		borderWidth: "0",
		borderRadius: "@border-radius.sm",
		color: "inherit",
		fontSize: "@font-size.md",
		lineHeight: "@line-height.tight",
		cursor: "pointer",
		"&:hover": { opacity: "0.75" },
		"&:focus-visible": {
			outlineWidth: "2px",
			outlineStyle: "solid",
			outlineColor: "@color.focus",
			outlineOffset: "2px",
		},
	},
});

export default s;
