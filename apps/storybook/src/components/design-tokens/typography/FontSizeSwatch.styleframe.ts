import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const {
	fontSizeXs,
	fontSizeSm,
	fontSizeMd,
	fontSizeLg,
	fontSizeXl,
	fontSize2xl,
	fontSize3xl,
	fontSize4xl,
} = useDesignTokensPreset(s);

selector(".font-size-swatch__preview", {
	color: "@color.text-weakest",
	padding: "@spacing.xs",
});

export const fontSizeSwatch = recipe({
	name: "font-size-swatch",
	base: {},
	variants: {
		variant: {
			xs: {
				fontSize: ref(fontSizeXs),
			},
			sm: {
				fontSize: ref(fontSizeSm),
			},
			md: {
				fontSize: ref(fontSizeMd),
			},
			lg: {
				fontSize: ref(fontSizeLg),
			},
			xl: {
				fontSize: ref(fontSizeXl),
			},
			"2xl": {
				fontSize: ref(fontSize2xl),
			},
			"3xl": {
				fontSize: ref(fontSize3xl),
			},
			"4xl": {
				fontSize: ref(fontSize4xl),
			},
		},
	},
	defaultVariants: {
		variant: "md",
	},
});

export default s;
