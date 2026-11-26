import { createUseRecipe } from "@styleframe/theme";

export const useFileTreeRecipe = createUseRecipe("pg-file-tree", {
	base: {
		display: "flex",
		flexDirection: "column",
		flex: "0 0 auto",
		width: "220px",
		minHeight: "0",
		height: "100%",
		background: "@color.gray-50",
		borderLeftWidth: "@border-width.thin",
		borderLeftStyle: "@border-style.solid",
		borderLeftColor: "@color.gray-200",
		"&:dark": {
			background: "@color.gray-900",
			borderLeftColor: "@color.gray-800",
		},
	},
});

export const useFileTreeHeaderRecipe = createUseRecipe("pg-file-tree-header", {
	base: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "@0.5",
		paddingTop: "@0.5",
		paddingBottom: "@0.5",
		paddingLeft: "@0.75",
		paddingRight: "@0.5",
		fontSize: "@font-size.xs",
		fontWeight: "@font-weight.medium",
		textTransform: "uppercase",
		color: "@color.gray-500",
		borderBottomWidth: "@border-width.thin",
		borderBottomStyle: "@border-style.solid",
		borderBottomColor: "@color.gray-200",
		"&:dark": {
			color: "@color.gray-400",
			borderBottomColor: "@color.gray-800",
		},
	},
});

export const useFileTreeListRecipe = createUseRecipe("pg-file-tree-list", {
	base: {
		display: "flex",
		flexDirection: "column",
		flex: "1 1 auto",
		minHeight: "0",
		overflowY: "auto",
		paddingTop: "@0.25",
		paddingBottom: "@0.25",
	},
});

export const useFileTreeItemRecipe = createUseRecipe("pg-file-tree-item", {
	base: {
		display: "flex",
		alignItems: "center",
		gap: "@0.375",
		width: "100%",
		paddingTop: "@0.25",
		paddingBottom: "@0.25",
		paddingRight: "@0.5",
		fontSize: "@font-size.sm",
		fontFamily: "inherit",
		color: "@color.gray-700",
		background: "transparent",
		borderWidth: "@border-width.none",
		textAlign: "left",
		whiteSpace: "nowrap",
		cursor: "pointer",
		"&:hover": {
			background: "@color.gray-100",
		},
		"&:dark": {
			color: "@color.gray-300",
		},
		"&:dark:hover": {
			background: "@color.gray-800",
		},
	},
	variants: {
		state: {
			inactive: {},
			active: {
				background: "@color.gray-200",
				color: "@color.gray-900",
				"&:hover": {
					background: "@color.gray-200",
				},
				"&:dark": {
					background: "@color.gray-800",
					color: "@color.white",
				},
				"&:dark:hover": {
					background: "@color.gray-800",
				},
			},
		},
	},
	defaultVariants: {
		state: "inactive",
	},
});

export const useFileTreeLabelRecipe = createUseRecipe("pg-file-tree-label", {
	base: {
		flex: "1 1 auto",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
});

export const useFileTreeIconRecipe = createUseRecipe("pg-file-tree-icon", {
	base: {
		flex: "0 0 auto",
		color: "@color.gray-500",
		"&:dark": {
			color: "@color.gray-400",
		},
	},
});

export const useFileTreeTwistyRecipe = createUseRecipe("pg-file-tree-twisty", {
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		flex: "0 0 auto",
		width: "16px",
		height: "16px",
		color: "@color.gray-400",
		"&:dark": {
			color: "@color.gray-500",
		},
	},
});

export const useFileTreeActionRecipe = createUseRecipe("pg-file-tree-action", {
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		flex: "0 0 auto",
		width: "20px",
		height: "20px",
		padding: "0",
		color: "@color.gray-500",
		background: "transparent",
		borderWidth: "@border-width.none",
		borderRadius: "@border-radius.sm",
		cursor: "pointer",
		"&:hover": {
			background: "@color.gray-200",
			color: "@color.gray-900",
		},
		"&:dark:hover": {
			background: "@color.gray-700",
			color: "@color.white",
		},
	},
});

export const useFileTreeInputRecipe = createUseRecipe("pg-file-tree-input", {
	base: {
		width: "100%",
		marginTop: "@0.25",
		marginBottom: "@0.25",
		marginLeft: "@0.5",
		marginRight: "@0.5",
		paddingTop: "@0.25",
		paddingBottom: "@0.25",
		paddingLeft: "@0.5",
		paddingRight: "@0.5",
		fontSize: "@font-size.sm",
		fontFamily: "inherit",
		color: "@color.gray-900",
		background: "@color.white",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderColor: "@color.primary",
		borderRadius: "@border-radius.sm",
		outline: "none",
		"&:dark": {
			color: "@color.white",
			background: "@color.gray-950",
		},
	},
});

export const useFileTreeMenuRecipe = createUseRecipe("pg-file-tree-menu", {
	base: {
		position: "fixed",
		zIndex: "50",
		display: "flex",
		flexDirection: "column",
		minWidth: "168px",
		paddingTop: "@0.25",
		paddingBottom: "@0.25",
		background: "@color.white",
		borderWidth: "@border-width.thin",
		borderStyle: "@border-style.solid",
		borderColor: "@color.gray-200",
		borderRadius: "@border-radius.md",
		boxShadow: "@box-shadow.lg",
		"&:dark": {
			background: "@color.gray-900",
			borderColor: "@color.gray-700",
		},
	},
});

export const useFileTreeMenuItemRecipe = createUseRecipe("pg-file-tree-menu-item", {
	base: {
		display: "flex",
		alignItems: "center",
		gap: "@0.5",
		width: "100%",
		paddingTop: "@0.375",
		paddingBottom: "@0.375",
		paddingLeft: "@0.75",
		paddingRight: "@0.75",
		fontSize: "@font-size.sm",
		fontFamily: "inherit",
		textAlign: "left",
		color: "@color.gray-700",
		background: "transparent",
		borderWidth: "@border-width.none",
		cursor: "pointer",
		whiteSpace: "nowrap",
		"&:hover": {
			background: "@color.gray-100",
		},
		"&:dark": {
			color: "@color.gray-300",
		},
		"&:dark:hover": {
			background: "@color.gray-800",
		},
	},
	variants: {
		tone: {
			default: {},
			danger: {
				color: "@color.error",
				"&:hover": {
					background: "@color.error",
					color: "@color.white",
				},
				"&:dark": {
					color: "@color.error-300",
				},
				"&:dark:hover": {
					background: "@color.error",
					color: "@color.white",
				},
			},
		},
	},
	defaultVariants: {
		tone: "default",
	},
});
