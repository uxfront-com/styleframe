import { useDesignTokensPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { ref, selector, recipe } = s;

useUtilitiesPreset(s);

const {
	borderStyleNone,
	borderStyleSolid,
	borderStyleDashed,
	borderStyleDotted,
	borderStyleDouble,
	borderStyleGroove,
	borderStyleInset,
	borderStyleOutset,
} = useDesignTokensPreset(s);

selector(".border-style-swatch__preview", {
	width: "calc(@spacing * 6)",
	height: "calc(@spacing * 6)",
	background: "@color.surface",
	borderColor: "@color.primary",
	borderWidth: "3px",
});

export const borderStyleSwatch = recipe({
	name: "border-style-swatch",
	base: {},
	variants: {
		variant: {
			none: {
				borderStyle: ref(borderStyleNone),
			},
			solid: {
				borderStyle: ref(borderStyleSolid),
			},
			dashed: {
				borderStyle: ref(borderStyleDashed),
			},
			dotted: {
				borderStyle: ref(borderStyleDotted),
			},
			double: {
				borderStyle: ref(borderStyleDouble),
			},
			groove: {
				borderStyle: ref(borderStyleGroove),
			},
			inset: {
				borderStyle: ref(borderStyleInset),
			},
			outset: {
				borderStyle: ref(borderStyleOutset),
			},
		},
	},
	defaultVariants: {
		variant: "solid",
	},
});

export default s;
