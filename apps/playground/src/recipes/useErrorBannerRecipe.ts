import { createUseRecipe } from "@styleframe/theme";

export const useErrorBannerRecipe = createUseRecipe("pg-error-banner", {
	base: {
		position: "absolute",
		bottom: "calc(@spacing * 0.5)",
		left: "calc(@spacing * 0.5)",
		right: "calc(@spacing * 0.5)",
		display: "flex",
		alignItems: "flex-start",
		gap: "@0.5",
		padding: "@0.75",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderColor: "@color.error",
		borderRadius: "@border-radius.md",
		background: "@color.error",
		color: "@color.white",
		fontSize: "@font-size.sm",
		lineHeight: "@line-height.normal",
		boxShadow: "@box-shadow.md",
		zIndex: "10",
	},
});

export const useErrorBannerMessageRecipe = createUseRecipe("pg-error-banner-message", {
	base: {
		flex: "1 1 auto",
		minWidth: "0",
		whiteSpace: "pre-wrap",
		wordBreak: "break-word",
		fontFamily:
			'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
	},
});

export const useErrorBannerCloseRecipe = createUseRecipe("pg-error-banner-close", {
	base: {
		flex: "0 0 auto",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: "@1.5",
		height: "@1.5",
		padding: "0",
		background: "transparent",
		color: "inherit",
		borderWidth: "@border-width.none",
		borderRadius: "@border-radius.sm",
		cursor: "pointer",
		opacity: "0.8",
		"&:hover": {
			opacity: "1",
		},
	},
});
