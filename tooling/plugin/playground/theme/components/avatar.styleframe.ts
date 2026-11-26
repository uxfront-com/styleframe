import { styleframe } from "virtual:styleframe";

import { useTokens } from "../useTokens";

const s = styleframe();
const { ref, selector, css } = s;

const {
	colorBackground,
	colorPrimary,
	borderRadiusFull,
	borderRadiusMd,
	fontWeightSemibold,
	fontSizeXs,
	fontSizeSm,
	fontSizeMd,
	fontSizeLg,
} = useTokens(s);

// Avatar structure
selector(".avatar", {
	position: "relative",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	overflow: "hidden",
	backgroundColor: ref(colorPrimary),
	color: ref(colorBackground),
	fontWeight: ref(fontWeightSemibold),
	flexShrink: "0",
	userSelect: "none",
});

selector(".avatar__image", {
	width: "100%",
	height: "100%",
	objectFit: "cover",
});

selector(".avatar__status", {
	position: "absolute",
	bottom: "0",
	right: "0",
	width: "25%",
	height: "25%",
	borderRadius: ref(borderRadiusFull),
	border: css`2px solid ${ref(colorBackground)}`,
});

// Avatar recipe
export const avatarRecipe = s.recipe({
	name: "avatar",
	base: {},
	variants: {
		size: {
			xs: {
				width: "24px",
				height: "24px",
				fontSize: ref(fontSizeXs),
			},
			sm: {
				width: "32px",
				height: "32px",
				fontSize: ref(fontSizeSm),
			},
			md: {
				width: "40px",
				height: "40px",
				fontSize: ref(fontSizeMd),
			},
			lg: {
				width: "48px",
				height: "48px",
				fontSize: ref(fontSizeLg),
			},
			xl: {
				width: "64px",
				height: "64px",
				fontSize: ref(fontSizeLg),
			},
		},
		shape: {
			circle: { borderRadius: ref(borderRadiusFull) },
			rounded: { borderRadius: ref(borderRadiusMd) },
			square: { borderRadius: "0" },
		},
	},
	defaultVariants: {
		size: "md",
		shape: "circle",
	},
});

export default s;
