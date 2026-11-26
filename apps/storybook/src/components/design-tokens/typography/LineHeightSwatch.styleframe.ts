import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const { lineHeightTight, lineHeightSnug, lineHeightNormal, lineHeightRelaxed, lineHeightLoose } =
	useDesignTokensPreset(s);

selector(".line-height-swatch__preview", {
	color: "@color.text-weakest",
	padding: "@spacing.xs",
	maxWidth: "400px",
});

export const lineHeightSwatch = recipe({
	name: "line-height-swatch",
	base: {},
	variants: {
		variant: {
			tight: {
				lineHeight: ref(lineHeightTight),
			},
			snug: {
				lineHeight: ref(lineHeightSnug),
			},
			normal: {
				lineHeight: ref(lineHeightNormal),
			},
			relaxed: {
				lineHeight: ref(lineHeightRelaxed),
			},
			loose: {
				lineHeight: ref(lineHeightLoose),
			},
		},
	},
	defaultVariants: {
		variant: "normal",
	},
});

export default s;
