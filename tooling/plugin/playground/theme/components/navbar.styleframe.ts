import { styleframe } from "virtual:styleframe";

import { useTokens } from "../useTokens";

const s = styleframe();
const { ref, selector, css } = s;

const {
	colorBackground,
	colorText,
	colorTextMuted,
	colorBorder,
	colorPrimary,
	spacingXs,
	spacingSm,
	spacingMd,
	spacingXl,
	borderWidthThin,
	boxShadowXs,
	fontSizeSm,
	fontSizeLg,
	fontWeightBold,
	fontWeightMedium,
} = useTokens(s);

selector(".navbar", {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: css`${ref(spacingMd)} ${ref(spacingXl)}`,
	backgroundColor: ref(colorBackground),
	borderBottom: css`${ref(borderWidthThin)} solid ${ref(colorBorder)}`,
	boxShadow: ref(boxShadowXs),
});

selector(".navbar__brand", {
	fontSize: ref(fontSizeLg),
	fontWeight: ref(fontWeightBold),
	color: ref(colorPrimary),
	textDecoration: "none",
});

selector(".navbar__nav", {
	display: "flex",
	alignItems: "center",
	gap: ref(spacingXs),
});

selector(".navbar__link", {
	fontSize: ref(fontSizeSm),
	fontWeight: ref(fontWeightMedium),
	color: ref(colorTextMuted),
	textDecoration: "none",
	padding: css`${ref(spacingXs)} ${ref(spacingSm)}`,
	borderRadius: "4px",
	transition: "color 150ms ease, background-color 150ms ease",
	"&:hover": {
		color: ref(colorText),
		backgroundColor: css`oklch(from ${ref(colorPrimary)} l c h / 0.06)`,
	},
});

selector(".navbar__link--active", {
	color: ref(colorPrimary),
	backgroundColor: css`oklch(from ${ref(colorPrimary)} l c h / 0.08)`,
});

export default s;
