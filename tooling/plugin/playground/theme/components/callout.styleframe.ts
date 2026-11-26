import { styleframe } from "virtual:styleframe";

import { useTokens } from "../useTokens";

const s = styleframe();
const { ref, selector, css } = s;

const {
	colorWhite,
	fadeIn,
	spacingXs,
	spacingSm,
	spacingMd,
	borderRadiusLg,
	borderRadiusMd,
	borderWidthThin,
	fontSizeSm,
	fontSizeMd,
	fontWeightSemibold,
	lineHeightNormal,
	colorSuccess,
	colorWarning,
	colorError,
	colorInfo,
} = useTokens(s);

// Callout structure
selector(".callout", {
	display: "flex",
	gap: ref(spacingSm),
	padding: ref(spacingMd),
	borderRadius: ref(borderRadiusLg),
	borderWidth: ref(borderWidthThin),
	borderStyle: "solid",
	borderColor: "transparent",
	lineHeight: ref(lineHeightNormal),
	animation: css`${fadeIn.name} 200ms ease-out`,
	"@media (prefers-reduced-motion: reduce)": {
		animation: "none",
	},
});

selector(".callout__icon", {
	flexShrink: "0",
	width: "20px",
	height: "20px",
	marginTop: "2px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
});

selector(".callout__content", {
	flex: "1",
	minWidth: "0",
});

selector(".callout__title", {
	fontWeight: ref(fontWeightSemibold),
	fontSize: ref(fontSizeMd),
	margin: "0",
});

selector(".callout__description", {
	fontSize: ref(fontSizeSm),
	marginTop: ref(spacingXs),
	margin: "0",
});

selector(".callout__dismiss", {
	flexShrink: "0",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	width: "24px",
	height: "24px",
	borderRadius: ref(borderRadiusMd),
	border: "none",
	background: "transparent",
	cursor: "pointer",
	opacity: "0.6",
	transition: "opacity 150ms ease",
	"&:hover": {
		opacity: "1",
	},
});

// Callout color recipe
export const playgroundCalloutRecipe = s.recipe({
	name: "playground-callout",
	base: {},
	variants: {
		color: {
			success: {
				backgroundColor: ref(colorSuccess),
				color: ref(colorWhite),
				borderColor: ref(colorSuccess),
			},
			warning: {
				backgroundColor: ref(colorWarning),
				color: ref(colorWhite),
				borderColor: ref(colorWarning),
			},
			error: {
				backgroundColor: ref(colorError),
				color: ref(colorWhite),
				borderColor: ref(colorError),
			},
			info: {
				backgroundColor: ref(colorInfo),
				color: ref(colorWhite),
				borderColor: ref(colorInfo),
			},
		},
	},
	defaultVariants: {
		color: "info",
	},
});

export default s;
