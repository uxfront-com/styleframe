import { styleframe } from "styleframe";

/**
 * Minimal Styleframe config for the benchmark.
 * Every token is declared explicitly — no presets, no auto-generation.
 * Must match the tokens in tailwind/config.css exactly.
 */
export function createBenchmarkInstance() {
	const s = styleframe();
	const { variable, ref, utility } = s;

	// -------------------------------------------------------------------------
	// Colors
	// -------------------------------------------------------------------------
	const colorPrimary = variable("color.primary", "#2563eb");
	const colorPrimary50 = variable("color.primary-50", "#eff6ff");
	const colorPrimary100 = variable("color.primary-100", "#dbeafe");
	const colorPrimary700 = variable("color.primary-700", "#1d4ed8");
	const colorPrimary800 = variable("color.primary-800", "#1e40af");

	const colorSuccess = variable("color.success", "#16a34a");
	const colorSuccess50 = variable("color.success-50", "#f0fdf4");
	const colorSuccess100 = variable("color.success-100", "#dcfce7");
	const colorSuccess700 = variable("color.success-700", "#15803d");

	const colorError = variable("color.error", "#dc2626");
	const colorError50 = variable("color.error-50", "#fef2f2");
	const colorError100 = variable("color.error-100", "#fee2e2");
	const colorError700 = variable("color.error-700", "#b91c1c");

	const colorNeutral = variable("color.neutral", "#737373");
	const colorNeutral50 = variable("color.neutral-50", "#fafafa");
	const colorNeutral100 = variable("color.neutral-100", "#f5f5f5");
	const colorNeutral200 = variable("color.neutral-200", "#e5e5e5");
	const colorNeutral700 = variable("color.neutral-700", "#404040");
	const colorNeutral800 = variable("color.neutral-800", "#262626");
	const colorNeutral900 = variable("color.neutral-900", "#171717");

	const colorWhite = variable("color.white", "#ffffff");
	const colorBlack = variable("color.black", "#000000");
	const colorBackground = variable("color.background", "#ffffff");
	const colorSurface = variable("color.surface", "#fafafa");
	const colorText = variable("color.text", "#171717");
	const colorTextWeak = variable("color.text-weak", "#525252");

	// -------------------------------------------------------------------------
	// Spacing
	// -------------------------------------------------------------------------
	const spacingXs = variable("spacing.xs", "0.25rem");
	const spacingSm = variable("spacing.sm", "0.5rem");
	const spacingMd = variable("spacing.md", "0.75rem");
	const spacingLg = variable("spacing.lg", "1rem");
	const spacingXl = variable("spacing.xl", "1.5rem");
	const spacing2xl = variable("spacing.2xl", "2rem");

	// -------------------------------------------------------------------------
	// Typography
	// -------------------------------------------------------------------------
	const fontSizeXs = variable("font-size.xs", "0.75rem");
	const fontSizeSm = variable("font-size.sm", "0.875rem");
	const fontSizeMd = variable("font-size.md", "1rem");
	const fontSizeLg = variable("font-size.lg", "1.125rem");

	const fontWeightNormal = variable("font-weight.normal", "400");
	const fontWeightMedium = variable("font-weight.medium", "500");
	const fontWeightSemibold = variable("font-weight.semibold", "600");
	const fontWeightBold = variable("font-weight.bold", "700");

	const lineHeightTight = variable("line-height.tight", "1.25");
	const lineHeightNormal = variable("line-height.normal", "1.5");

	// -------------------------------------------------------------------------
	// Borders
	// -------------------------------------------------------------------------
	const borderWidthThin = variable("border-width.thin", "1px");
	const borderRadiusSm = variable("border-radius.sm", "0.25rem");
	const borderRadiusMd = variable("border-radius.md", "0.375rem");
	const borderRadiusLg = variable("border-radius.lg", "0.5rem");
	const borderRadiusFull = variable("border-radius.full", "9999px");

	// =========================================================================
	// Utilities — auto-generate CSS rules from the tokens above
	// =========================================================================

	const spacingValues = {
		xs: ref(spacingXs),
		sm: ref(spacingSm),
		md: ref(spacingMd),
		lg: ref(spacingLg),
		xl: ref(spacingXl),
		"2xl": ref(spacing2xl),
	};

	const colorValues = {
		primary: ref(colorPrimary),
		"primary-50": ref(colorPrimary50),
		"primary-100": ref(colorPrimary100),
		"primary-700": ref(colorPrimary700),
		"primary-800": ref(colorPrimary800),
		success: ref(colorSuccess),
		"success-50": ref(colorSuccess50),
		"success-100": ref(colorSuccess100),
		"success-700": ref(colorSuccess700),
		error: ref(colorError),
		"error-50": ref(colorError50),
		"error-100": ref(colorError100),
		"error-700": ref(colorError700),
		neutral: ref(colorNeutral),
		"neutral-50": ref(colorNeutral50),
		"neutral-100": ref(colorNeutral100),
		"neutral-200": ref(colorNeutral200),
		"neutral-700": ref(colorNeutral700),
		"neutral-800": ref(colorNeutral800),
		"neutral-900": ref(colorNeutral900),
		white: ref(colorWhite),
		black: ref(colorBlack),
		background: ref(colorBackground),
		surface: ref(colorSurface),
		text: ref(colorText),
		"text-weak": ref(colorTextWeak),
		transparent: "transparent",
	};

	// Layout
	utility("display", ({ value }) => ({ display: value }))({
		flex: "flex",
		block: "block",
		"inline-flex": "inline-flex",
		grid: "grid",
		hidden: "none",
	});

	utility("position", ({ value }) => ({ position: value }))({
		relative: "relative",
		absolute: "absolute",
		fixed: "fixed",
	});

	utility("overflow", ({ value }) => ({ overflow: value }))({
		hidden: "hidden",
		auto: "auto",
	});

	// Flexbox
	utility("flex-direction", ({ value }) => ({ flexDirection: value }))({
		row: "row",
		column: "column",
	});

	utility("align-items", ({ value }) => ({ alignItems: value }))({
		center: "center",
		start: "flex-start",
		end: "flex-end",
		stretch: "stretch",
	});

	utility("justify-content", ({ value }) => ({ justifyContent: value }))({
		center: "center",
		between: "space-between",
		start: "flex-start",
		end: "flex-end",
	});

	utility("flex-wrap", ({ value }) => ({ flexWrap: value }))({
		wrap: "wrap",
	});

	utility("gap", ({ value }) => ({ gap: value }))(spacingValues);

	// Grid
	utility("grid-template-columns", ({ value }) => ({
		gridTemplateColumns: value,
	}))({ "2": "repeat(2, 1fr)", "3": "repeat(3, 1fr)", "4": "repeat(4, 1fr)" });

	// Spacing
	utility("padding", ({ value }) => ({ padding: value }))(spacingValues);
	utility("padding-inline", ({ value }) => ({ paddingInline: value }))(spacingValues);
	utility("padding-block", ({ value }) => ({ paddingBlock: value }))(spacingValues);
	utility("padding-top", ({ value }) => ({ paddingTop: value }))(spacingValues);
	utility("padding-bottom", ({ value }) => ({ paddingBottom: value }))(spacingValues);
	utility("margin", ({ value }) => ({ margin: value }))(spacingValues);
	utility("margin-top", ({ value }) => ({ marginTop: value }))(spacingValues);
	utility("margin-bottom", ({ value }) => ({ marginBottom: value }))(spacingValues);
	utility("margin-block", ({ value }) => ({ marginBlock: value }))(spacingValues);
	utility("margin-inline", ({ value }) => ({ marginInline: value }))({
		auto: "auto",
		...spacingValues,
	});

	// Sizing
	utility("width", ({ value }) => ({ width: value }))({
		full: "100%",
		"60": "15rem",
		...spacingValues,
	});
	utility("max-width", ({ value }) => ({ maxWidth: value }))({
		sm: "24rem",
		md: "28rem",
		lg: "32rem",
		xl: "36rem",
		"2xl": "42rem",
		full: "100%",
	});
	utility("height", ({ value }) => ({ height: value }))({
		full: "100%",
		"fit-content": "fit-content",
		...spacingValues,
	});

	// Typography
	utility("font-size", ({ value }) => ({ fontSize: value }))({
		xs: ref(fontSizeXs),
		sm: ref(fontSizeSm),
		md: ref(fontSizeMd),
		lg: ref(fontSizeLg),
	});
	utility("font-weight", ({ value }) => ({ fontWeight: value }))({
		normal: ref(fontWeightNormal),
		medium: ref(fontWeightMedium),
		semibold: ref(fontWeightSemibold),
		bold: ref(fontWeightBold),
	});
	utility("line-height", ({ value }) => ({ lineHeight: value }))({
		tight: ref(lineHeightTight),
		normal: ref(lineHeightNormal),
	});
	utility("text-align", ({ value }) => ({ textAlign: value }))({
		left: "left",
		center: "center",
		right: "right",
	});
	utility("text-decoration", ({ value }) => ({ textDecoration: value }))({
		none: "none",
		underline: "underline",
		"line-through": "line-through",
	});
	utility("white-space", ({ value }) => ({ whiteSpace: value }))({
		nowrap: "nowrap",
		pre: "pre",
	});

	// Colors
	utility("color", ({ value }) => ({ color: value }))(colorValues);
	utility("background", ({ value }) => ({ backgroundColor: value }))(colorValues);

	// Borders
	utility("border-width", ({ value }) => ({ borderWidth: value }))({
		thin: ref(borderWidthThin),
	});
	utility("border-color", ({ value }) => ({ borderColor: value }))(colorValues);
	utility("border-radius", ({ value }) => ({ borderRadius: value }))({
		sm: ref(borderRadiusSm),
		md: ref(borderRadiusMd),
		lg: ref(borderRadiusLg),
		full: ref(borderRadiusFull),
	});
	utility("border-style", ({ value }) => ({ borderStyle: value }))({
		solid: "solid",
		none: "none",
	});
	utility("border-bottom-width", ({ value }) => ({ borderBottomWidth: value }))({
		thin: ref(borderWidthThin),
	});
	utility("border-bottom-color", ({ value }) => ({ borderBottomColor: value }))(colorValues);
	utility("border-bottom-style", ({ value }) => ({ borderBottomStyle: value }))({
		solid: "solid",
	});
	utility("border-top-width", ({ value }) => ({ borderTopWidth: value }))({
		thin: ref(borderWidthThin),
	});
	utility("border-top-color", ({ value }) => ({ borderTopColor: value }))(colorValues);
	utility("border-top-style", ({ value }) => ({ borderTopStyle: value }))({
		solid: "solid",
	});

	// Misc
	utility("cursor", ({ value }) => ({ cursor: value }))({
		pointer: "pointer",
		default: "default",
	});
	utility("list-style", ({ value }) => ({ listStyle: value }))({
		none: "none",
		disc: "disc",
	});
	utility("opacity", ({ value }) => ({ opacity: value }))({
		"0": "0",
		"50": "0.5",
		"100": "1",
	});

	return s;
}
