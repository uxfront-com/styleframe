import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const {
	boxShadowNone,
	boxShadowXs,
	boxShadowSm,
	boxShadowMd,
	boxShadowLg,
	boxShadowXl,
	boxShadow2xl,
	boxShadowInner,
	boxShadowRing,
} = useDesignTokensPreset(s);

selector(".box-shadow-swatch__preview", {
	width: "calc(@spacing * 6)",
	height: "calc(@spacing * 6)",
	background: "@color.surface",
	borderRadius: "@border-radius",
});

export const boxShadowSwatch = recipe({
	name: "box-shadow-swatch",
	base: {},
	variants: {
		variant: {
			none: {
				boxShadow: ref(boxShadowNone),
			},
			xs: {
				boxShadow: ref(boxShadowXs),
			},
			sm: {
				boxShadow: ref(boxShadowSm),
			},
			md: {
				boxShadow: ref(boxShadowMd),
			},
			lg: {
				boxShadow: ref(boxShadowLg),
			},
			xl: {
				boxShadow: ref(boxShadowXl),
			},
			"2xl": {
				boxShadow: ref(boxShadow2xl),
			},
			inner: {
				boxShadow: ref(boxShadowInner),
			},
			ring: {
				boxShadow: ref(boxShadowRing),
			},
		},
	},
	defaultVariants: {
		variant: "md",
	},
});

export default s;
