import { styleframe } from "virtual:styleframe";

import { useTokens } from "../useTokens";

const s = styleframe();
const { ref, selector, css } = s;

const {
	colorBackground,
	colorText,
	colorTextMuted,
	colorBorder,
	spacingXs,
	spacingSm,
	spacingMd,
	spacingLg,
	borderRadiusLg,
	borderWidthThin,
	boxShadowSm,
	fontSizeSm,
	fontSizeLg,
	fontWeightSemibold,
	lineHeightTight,
	lineHeightNormal,
} = useTokens(s);

export const cardSelector = selector(".card", {
	display: "flex",
	flexDirection: "column",
	backgroundColor: ref(colorBackground),
	borderRadius: ref(borderRadiusLg),
	border: css`${ref(borderWidthThin)} solid ${ref(colorBorder)}`,
	boxShadow: ref(boxShadowSm),
	overflow: "hidden",
});

selector(".card__header", {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: css`${ref(spacingMd)} ${ref(spacingLg)}`,
	borderBottom: css`${ref(borderWidthThin)} solid ${ref(colorBorder)}`,
});

selector(".card__body", {
	flex: "1",
	padding: css`${ref(spacingMd)} ${ref(spacingLg)}`,
});

selector(".card__footer", {
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	gap: ref(spacingSm),
	padding: css`${ref(spacingMd)} ${ref(spacingLg)}`,
	borderTop: css`${ref(borderWidthThin)} solid ${ref(colorBorder)}`,
});

selector(".card__title", {
	fontSize: ref(fontSizeLg),
	fontWeight: ref(fontWeightSemibold),
	lineHeight: ref(lineHeightTight),
	color: ref(colorText),
	margin: "0",
});

selector(".card__description", {
	fontSize: ref(fontSizeSm),
	color: ref(colorTextMuted),
	lineHeight: ref(lineHeightNormal),
	margin: "0",
	marginTop: ref(spacingXs),
});

export default s;
