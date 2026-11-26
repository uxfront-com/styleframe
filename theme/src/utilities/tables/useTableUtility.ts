import { createUseUtility } from "../../utils";
import { borderCollapseValues, tableLayoutValues, captionSideValues } from "../../values";

/**
 * Create border-collapse utility classes.
 */
export const useBorderCollapseUtility = createUseUtility(
	"border-collapse",
	({ value }) => ({
		borderCollapse: value,
	}),
	{ defaults: borderCollapseValues },
);

/**
 * Create border-spacing utility classes.
 */
export const useBorderSpacingUtility = createUseUtility("border-spacing", ({ value }) => ({
	borderSpacing: value,
}));

/**
 * Create border-spacing-x utility classes.
 */
export const useBorderSpacingXUtility = createUseUtility("border-spacing-x", ({ value }) => ({
	borderSpacing: `${value} var(--border-spacing-y, 0)`,
}));

/**
 * Create border-spacing-y utility classes.
 */
export const useBorderSpacingYUtility = createUseUtility("border-spacing-y", ({ value }) => ({
	borderSpacing: `var(--border-spacing-x, 0) ${value}`,
}));

/**
 * Create table-layout utility classes.
 */
export const useTableLayoutUtility = createUseUtility(
	"table-layout",
	({ value }) => ({
		tableLayout: value,
	}),
	{ defaults: tableLayoutValues },
);

/**
 * Create caption-side utility classes.
 */
export const useCaptionSideUtility = createUseUtility(
	"caption-side",
	({ value }) => ({
		captionSide: value,
	}),
	{ defaults: captionSideValues },
);
