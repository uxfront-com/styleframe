import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const { borderWidthNone, borderWidthThin, borderWidthMedium, borderWidthThick } =
	useDesignTokensPreset(s);

selector(".border-width-swatch__preview", {
	width: "calc(@spacing * 6)",
	height: "calc(@spacing * 6)",
	background: "@color.surface",
	borderColor: "@color.primary",
	borderStyle: "solid",
});

export const borderWidthSwatch = recipe({
	name: "border-width-swatch",
	base: {},
	variants: {
		variant: {
			none: {
				borderWidth: ref(borderWidthNone),
			},
			thin: {
				borderWidth: ref(borderWidthThin),
			},
			medium: {
				borderWidth: ref(borderWidthMedium),
			},
			thick: {
				borderWidth: ref(borderWidthThick),
			},
		},
	},
	defaultVariants: {
		variant: "thin",
	},
});

export default s;
