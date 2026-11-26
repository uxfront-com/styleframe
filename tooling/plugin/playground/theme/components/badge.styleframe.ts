import { styleframe } from "virtual:styleframe";

import { useTokens } from "../useTokens";

const s = styleframe();
const { ref } = s;

// Register tokens so recipe can reference them
const {
	colorWhite,
	colorPrimary,
	colorSecondary,
	colorSuccess,
	colorWarning,
	colorError,
	colorInfo,
	spacing2xs,
	spacingXs,
	spacingSm,
	borderWidthThin,
	borderRadiusFull,
	fontSizeXs,
	fontSizeSm,
	fontSizeMd,
	fontWeightMedium,
	fontWeightSemibold,
	lineHeightTight,
} = useTokens(s);

export const playgroundBadgeRecipe = s.recipe({
	name: "playground-badge",
	base: {
		display: "inline-flex",
		alignItems: "center",
		gap: ref(spacing2xs),
		borderRadius: ref(borderRadiusFull),
		fontWeight: ref(fontWeightMedium),
		lineHeight: ref(lineHeightTight),
		whiteSpace: "nowrap",
		borderWidth: ref(borderWidthThin),
		borderStyle: "solid",
		borderColor: "transparent",
	},
	variants: {
		color: {
			primary: {
				backgroundColor: ref(colorPrimary),
				color: ref(colorWhite),
			},
			secondary: {
				backgroundColor: ref(colorSecondary),
				color: ref(colorWhite),
			},
			success: {
				backgroundColor: ref(colorSuccess),
				color: ref(colorWhite),
			},
			warning: {
				backgroundColor: ref(colorWarning),
				color: ref(colorWhite),
			},
			error: {
				backgroundColor: ref(colorError),
				color: ref(colorWhite),
			},
			info: {
				backgroundColor: ref(colorInfo),
				color: ref(colorWhite),
			},
		},
		size: {
			sm: {
				paddingBlock: ref(spacing2xs),
				paddingInline: ref(spacingXs),
				fontSize: ref(fontSizeXs),
			},
			md: {
				paddingBlock: ref(spacing2xs),
				paddingInline: ref(spacingSm),
				fontSize: ref(fontSizeSm),
			},
			lg: {
				paddingBlock: ref(spacingXs),
				paddingInline: ref(spacingSm),
				fontSize: ref(fontSizeMd),
				fontWeight: ref(fontWeightSemibold),
			},
		},
		variant: {
			solid: {},
			outline: {
				backgroundColor: "transparent",
			},
		},
	},
	defaultVariants: {
		color: "primary",
		size: "md",
		variant: "solid",
	},
	compoundVariants: [
		{
			match: { color: "primary", variant: "outline" },
			css: { color: ref(colorPrimary), borderColor: ref(colorPrimary) },
		},
		{
			match: { color: "secondary", variant: "outline" },
			css: {
				color: ref(colorSecondary),
				borderColor: ref(colorSecondary),
			},
		},
		{
			match: { color: "success", variant: "outline" },
			css: { color: ref(colorSuccess), borderColor: ref(colorSuccess) },
		},
		{
			match: { color: "warning", variant: "outline" },
			css: { color: ref(colorWarning), borderColor: ref(colorWarning) },
		},
		{
			match: { color: "error", variant: "outline" },
			css: { color: ref(colorError), borderColor: ref(colorError) },
		},
		{
			match: { color: "info", variant: "outline" },
			css: { color: ref(colorInfo), borderColor: ref(colorInfo) },
		},
	],
});

export default s;
