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
	colorError,
	spacingXs,
	spacingSm,
	spacingMd,
	borderRadiusMd,
	borderWidthThin,
	fontSizeXs,
	fontSizeSm,
	fontSizeMd,
	fontWeightMedium,
	lineHeightNormal,
} = useTokens(s);

// Input group structure
selector(".input-group", {
	display: "flex",
	flexDirection: "column",
	gap: ref(spacingXs),
});

selector(".input-group__label", {
	fontSize: ref(fontSizeSm),
	fontWeight: ref(fontWeightMedium),
	color: ref(colorText),
});

selector(".input-group__input", {
	width: "100%",
	padding: css`${ref(spacingSm)} ${ref(spacingMd)}`,
	fontSize: ref(fontSizeMd),
	lineHeight: ref(lineHeightNormal),
	color: ref(colorText),
	backgroundColor: ref(colorBackground),
	borderWidth: ref(borderWidthThin),
	borderStyle: "solid",
	borderColor: ref(colorBorder),
	borderRadius: ref(borderRadiusMd),
	outline: "none",
	boxSizing: "border-box",
	transition: "border-color 150ms ease, box-shadow 150ms ease",
	"&:hover": {
		borderColor: ref(colorTextMuted),
	},
	"&:focus": {
		borderColor: ref(colorPrimary),
		boxShadow: css`0 0 0 3px oklch(from ${ref(colorPrimary)} l c h / 0.15)`,
	},
	"&:disabled": {
		opacity: "0.5",
		cursor: "not-allowed",
	},
	"&::placeholder": {
		color: ref(colorTextMuted),
	},
});

selector(".input-group__helper", {
	fontSize: ref(fontSizeXs),
	color: ref(colorTextMuted),
	margin: "0",
});

selector(".input-group__error", {
	fontSize: ref(fontSizeXs),
	color: css`${ref(colorError)}`,
	margin: "0",
});

export default s;
