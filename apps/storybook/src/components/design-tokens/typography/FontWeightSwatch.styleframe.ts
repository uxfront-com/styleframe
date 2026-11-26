import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const {
	fontWeightExtralight,
	fontWeightLight,
	fontWeightNormal,
	fontWeightMedium,
	fontWeightSemibold,
	fontWeightBold,
	fontWeightBlack,
} = useDesignTokensPreset(s);

selector(".font-weight-swatch__preview", {
	color: "@color.text-weakest",
	padding: "@spacing.xs",
});

export const fontWeightSwatch = recipe({
	name: "font-weight-swatch",
	base: {},
	variants: {
		variant: {
			extralight: {
				fontWeight: ref(fontWeightExtralight),
			},
			light: {
				fontWeight: ref(fontWeightLight),
			},
			normal: {
				fontWeight: ref(fontWeightNormal),
			},
			medium: {
				fontWeight: ref(fontWeightMedium),
			},
			semibold: {
				fontWeight: ref(fontWeightSemibold),
			},
			bold: {
				fontWeight: ref(fontWeightBold),
			},
			black: {
				fontWeight: ref(fontWeightBlack),
			},
		},
	},
	defaultVariants: {
		variant: "normal",
	},
});

export default s;
