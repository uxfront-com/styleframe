import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const { fontFamilyBase, fontFamilyPrint, fontFamilyMono } = useDesignTokensPreset(s);

selector(".font-family-swatch__preview", {
	color: "@color.text-weakest",
	padding: "@spacing.xs",
});

export const fontFamilySwatch = recipe({
	name: "font-family-swatch",
	base: {},
	variants: {
		variant: {
			base: {
				fontFamily: ref(fontFamilyBase),
			},
			print: {
				fontFamily: ref(fontFamilyPrint),
			},
			mono: {
				fontFamily: ref(fontFamilyMono),
			},
		},
	},
	defaultVariants: {
		variant: "base",
	},
});

export default s;
