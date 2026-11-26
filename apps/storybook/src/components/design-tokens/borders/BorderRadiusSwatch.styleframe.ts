import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe, css } = s;

useUtilitiesPreset(s);

const {
	borderRadiusNone,
	borderRadiusSm,
	borderRadiusMd,
	borderRadiusLg,
	borderRadiusXl,
	borderRadius2xl,
	borderRadiusFull,
} = useDesignTokensPreset(s);

selector(".border-radius-swatch__preview", {
	width: "calc(@spacing * 6)",
	height: "calc(@spacing * 6)",
	background: css`@color.surface`,
	border: css`1px solid @color.primary`,
});

export const borderRadiusSwatch = recipe({
	name: "border-radius-swatch",
	base: {},
	variants: {
		variant: {
			none: {
				borderRadius: ref(borderRadiusNone),
			},
			sm: {
				borderRadius: ref(borderRadiusSm),
			},
			md: {
				borderRadius: ref(borderRadiusMd),
			},
			lg: {
				borderRadius: ref(borderRadiusLg),
			},
			xl: {
				borderRadius: ref(borderRadiusXl),
			},
			"2xl": {
				borderRadius: ref(borderRadius2xl),
			},
			full: {
				borderRadius: ref(borderRadiusFull),
			},
		},
	},
	defaultVariants: {
		variant: "md",
	},
});

export default s;
