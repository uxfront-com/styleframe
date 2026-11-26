import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const {
	borderColor,
	borderColorPrimary,
	borderColorSecondary,
	borderColorSuccess,
	borderColorWarning,
	borderColorError,
	borderColorInfo,
} = useDesignTokensPreset(s);

selector(".border-color-swatch__preview", {
	width: "calc(@spacing * 6)",
	height: "calc(@spacing * 6)",
	background: "@color.surface",
	borderWidth: "2px",
	borderStyle: "solid",
});

export const borderColorSwatch = recipe({
	name: "border-color-swatch",
	base: {},
	variants: {
		variant: {
			default: {
				borderColor: ref(borderColor),
			},
			primary: {
				borderColor: ref(borderColorPrimary),
			},
			secondary: {
				borderColor: ref(borderColorSecondary),
			},
			success: {
				borderColor: ref(borderColorSuccess),
			},
			warning: {
				borderColor: ref(borderColorWarning),
			},
			error: {
				borderColor: ref(borderColorError),
			},
			info: {
				borderColor: ref(borderColorInfo),
			},
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export default s;
