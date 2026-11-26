import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const {
	letterSpacingTighter,
	letterSpacingTight,
	letterSpacingNormal,
	letterSpacingWide,
	letterSpacingWider,
} = useDesignTokensPreset(s);

selector(".letter-spacing-swatch__preview", {
	color: "@color.text-weakest",
	padding: "@spacing.xs",
});

export const letterSpacingSwatch = recipe({
	name: "letter-spacing-swatch",
	base: {},
	variants: {
		variant: {
			tighter: {
				letterSpacing: ref(letterSpacingTighter),
			},
			tight: {
				letterSpacing: ref(letterSpacingTight),
			},
			normal: {
				letterSpacing: ref(letterSpacingNormal),
			},
			wide: {
				letterSpacing: ref(letterSpacingWide),
			},
			wider: {
				letterSpacing: ref(letterSpacingWider),
			},
		},
	},
	defaultVariants: {
		variant: "normal",
	},
});

export default s;
