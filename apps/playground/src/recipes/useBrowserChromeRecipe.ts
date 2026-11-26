import { createUseRecipe } from "@styleframe/theme";

export const useBrowserChromeRecipe = createUseRecipe("pg-browser-chrome", {
	base: {
		display: "flex",
		alignItems: "center",
		gap: "@0.75",
		paddingTop: "@0.375",
		paddingBottom: "@0.375",
		paddingLeft: "@0.75",
		paddingRight: "@0.75",
		background: "@color.gray-50",
		borderBottomWidth: "@border-width.thin",
		borderBottomStyle: "@border-style.solid",
		borderBottomColor: "@color.gray-200",
		"&:dark": {
			background: "@color.gray-900",
			borderBottomColor: "@color.gray-800",
		},
	},
});

export const useBrowserDotsRecipe = createUseRecipe("pg-browser-dots", {
	base: {
		display: "inline-flex",
		alignItems: "center",
		gap: "@0.25",
		flex: "0 0 auto",
	},
});

export const useBrowserDotRecipe = createUseRecipe("pg-browser-dot", {
	base: {
		width: "12px",
		height: "12px",
		borderRadius: "@border-radius.full",
		background: "@color.gray-300",
		"&:dark": {
			background: "@color.gray-700",
		},
	},
	variants: {
		tone: {
			red: {
				background: "#ff5f57",
				"&:dark": { background: "#ff5f57" },
			},
			yellow: {
				background: "#febc2e",
				"&:dark": { background: "#febc2e" },
			},
			green: {
				background: "#28c840",
				"&:dark": { background: "#28c840" },
			},
		},
	},
});

export const useBrowserUrlRecipe = createUseRecipe("pg-browser-url", {
	base: {
		flex: "1 1 auto",
		display: "inline-flex",
		alignItems: "center",
		gap: "@0.375",
		minWidth: "0",
		paddingTop: "@0.25",
		paddingBottom: "@0.25",
		paddingLeft: "@0.5",
		paddingRight: "@0.5",
		fontSize: "@font-size.xs",
		color: "@color.gray-500",
		background: "@color.white",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderColor: "@color.gray-200",
		borderRadius: "@border-radius.md",
		"&:dark": {
			color: "@color.gray-400",
			background: "@color.gray-950",
			borderColor: "@color.gray-800",
		},
	},
});

export const useBrowserUrlTextRecipe = createUseRecipe("pg-browser-url-text", {
	base: {
		flex: "1 1 auto",
		minWidth: "0",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});

export const useBrowserActionsRecipe = createUseRecipe("pg-browser-actions", {
	base: {
		display: "inline-flex",
		alignItems: "center",
		gap: "@0.25",
		flex: "0 0 auto",
		color: "@color.gray-500",
		"&:dark": {
			color: "@color.gray-400",
		},
	},
});

export const useBrowserActionRecipe = createUseRecipe("pg-browser-action", {
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: "@1.5",
		height: "@1.5",
		padding: "0",
		color: "inherit",
		background: "transparent",
		borderWidth: "@border-width.none",
		borderRadius: "@border-radius.sm",
		cursor: "pointer",
		transitionProperty: "color, background-color",
		transitionDuration: "@duration.fast",
		"&:hover": {
			color: "@color.gray-900",
			background: "@color.gray-200",
		},
		"&:dark:hover": {
			color: "@color.white",
			background: "@color.gray-800",
		},
	},
});

export const useHmrIndicatorRecipe = createUseRecipe("pg-hmr-indicator", {
	base: {
		display: "inline-flex",
		alignItems: "center",
		gap: "@0.25",
		fontSize: "@font-size.xs",
		fontWeight: "@font-weight.medium",
		color: "@color.gray-500",
		"&:dark": {
			color: "@color.gray-400",
		},
	},
});

export const useHmrDotRecipe = createUseRecipe("pg-hmr-dot", {
	base: {
		width: "6px",
		height: "6px",
		borderRadius: "@border-radius.full",
		background: "@color.success",
	},
});

export const useBrowserViewportRecipe = createUseRecipe("pg-browser-viewport", {
	base: {
		flex: "1 1 auto",
		minHeight: "0",
		display: "flex",
		justifyContent: "center",
		alignItems: "stretch",
		background: "@color.gray-100",
		"&:dark": {
			background: "@color.gray-900",
		},
	},
});

export const useBrowserViewportFrameRecipe = createUseRecipe("pg-browser-viewport-frame", {
	base: {
		width: "100%",
		height: "100%",
		minHeight: "0",
		background: "@color.white",
		transitionProperty: "max-width",
		transitionDuration: "@duration.fast",
		"&:dark": {
			background: "@color.gray-950",
		},
	},
	variants: {
		size: {
			mobile: { maxWidth: "375px" },
			tablet: { maxWidth: "768px" },
			desktop: { maxWidth: "none" },
		},
	},
	defaultVariants: {
		size: "desktop",
	},
});
