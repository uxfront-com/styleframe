import { styleframe } from "virtual:styleframe";

const s = styleframe();

const { selector } = s;

// Page scaffold
selector(".ui-kit", {
	minHeight: "100vh",
	background: "@color.background",
	color: "@color.text",
	paddingTop: "calc(@spacing * 2)",
	paddingBottom: "calc(@spacing * 2)",
});

selector(".ui-kit-inner", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.2xl",
	maxWidth: "60rem",
	marginLeft: "auto",
	marginRight: "auto",
	paddingLeft: "@spacing.lg",
	paddingRight: "@spacing.lg",
});

// Header
selector(".ui-kit-header", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.2xs",
});

selector(".ui-kit-title", {
	margin: "0",
	fontSize: "@font-size.2xl",
	fontWeight: "@font-weight.bold",
});

selector(".ui-kit-subtitle", {
	margin: "0",
	fontSize: "@font-size.md",
	color: "@color.text-weak",
});

// Sections
selector(".ui-kit-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.sm",
});

selector(".ui-kit-section-title", {
	margin: "0",
	paddingBottom: "@spacing.xs",
	fontSize: "@font-size.lg",
	fontWeight: "@font-weight.semibold",
	borderBottomWidth: "@border-width.thin",
	borderBottomStyle: "@border-style.solid",
	borderBottomColor: "@color.gray-200",
});

selector('[data-theme="dark"] .ui-kit-section-title', {
	borderBottomColor: "@color.gray-800",
});

selector(".ui-kit-row", {
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "@spacing.sm",
});

selector(".ui-kit-label", {
	minWidth: "5rem",
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.medium",
	color: "@color.text-weak",
});

selector(".ui-kit-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
});

// Token swatches
selector(".ui-kit-swatch", {
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	gap: "@spacing.2xs",
});

selector(".ui-kit-caption", {
	fontSize: "@font-size.xs",
	color: "@color.text-weak",
	fontFamily: "@font-family.mono",
});

// Color scales — one individual square swatch per level.
selector(".ui-kit-ramp-row", {
	display: "flex",
	alignItems: "center",
	gap: "@spacing.sm",
});

selector(".ui-kit-ramp", {
	display: "flex",
	flexWrap: "wrap",
	flex: "1 1 auto",
	minWidth: "0",
	gap: "@spacing.2xs",
});

selector(".ui-kit-ramp-cell", {
	flex: "0 0 auto",
	width: "28px",
	height: "28px",
	borderRadius: "@border-radius.sm",
	borderWidth: "@border-width.thin",
	borderStyle: "@border-style.solid",
	borderColor: "@color.gray-200",
});

selector('[data-theme="dark"] .ui-kit-ramp-cell', {
	borderColor: "@color.gray-800",
});
