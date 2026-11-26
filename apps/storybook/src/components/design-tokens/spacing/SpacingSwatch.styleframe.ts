import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const {
	spacing2xs,
	spacingXs,
	spacingSm,
	spacingMd,
	spacingLg,
	spacingXl,
	spacing2xl,
	spacing3xl,
} = useDesignTokensPreset(s);

selector(".spacing-swatch__preview", {
	background: "@color.primary",
	borderRadius: "@border-radius",
});

export const spacingSwatch = recipe({
	name: "spacing-swatch",
	base: {},
	variants: {
		variant: {
			"2xs": {
				width: ref(spacing2xs),
				height: ref(spacing2xs),
			},
			xs: {
				width: ref(spacingXs),
				height: ref(spacingXs),
			},
			sm: {
				width: ref(spacingSm),
				height: ref(spacingSm),
			},
			md: {
				width: ref(spacingMd),
				height: ref(spacingMd),
			},
			lg: {
				width: ref(spacingLg),
				height: ref(spacingLg),
			},
			xl: {
				width: ref(spacingXl),
				height: ref(spacingXl),
			},
			"2xl": {
				width: ref(spacing2xl),
				height: ref(spacing2xl),
			},
			"3xl": {
				width: ref(spacing3xl),
				height: ref(spacing3xl),
			},
		},
	},
	defaultVariants: {
		variant: "md",
	},
});

export default s;
