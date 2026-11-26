import { createUseRecipe } from "@styleframe/theme";

export const useSplitPaneRecipe = createUseRecipe("pg-split-pane", {
	base: {
		display: "flex",
		flexDirection: "row",
		alignItems: "stretch",
		width: "100%",
		height: "100%",
		minHeight: "0",
		overflow: "hidden",
	},
});

export const useSplitPanePaneRecipe = createUseRecipe("pg-split-pane-pane", {
	base: {
		display: "flex",
		flexDirection: "column",
		minWidth: "0",
		minHeight: "0",
		overflow: "hidden",
	},
});

export const useSplitPaneDividerRecipe = createUseRecipe("pg-split-pane-divider", {
	base: {
		flex: "0 0 auto",
		width: "6px",
		cursor: "col-resize",
		background: "@color.gray-200",
		transitionProperty: "background-color",
		transitionDuration: "@duration.fast",
		"&:hover": {
			background: "@color.primary",
		},
		"&:dark": {
			background: "@color.gray-800",
		},
		"&:dark:hover": {
			background: "@color.primary",
		},
	},
});
