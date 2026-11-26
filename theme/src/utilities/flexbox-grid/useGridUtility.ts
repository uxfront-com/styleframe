import { createUseUtility } from "../../utils";
import { gridAutoFlowValues } from "../../values";

/**
 * Create grid-template-columns utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useGridTemplateColumnsUtility(s, {
 *     '1': 'repeat(1, minmax(0, 1fr))',
 *     '2': 'repeat(2, minmax(0, 1fr))',
 *     '3': 'repeat(3, minmax(0, 1fr))',
 *     none: 'none',
 *     subgrid: 'subgrid',
 * });
 * ```
 */
export const useGridTemplateColumnsUtility = createUseUtility(
	"grid-template-columns",
	({ value }) => ({
		gridTemplateColumns: value,
	}),
);

/**
 * Create grid-column utility classes (span).
 */
export const useGridColumnUtility = createUseUtility("grid-column", ({ value }) => ({
	gridColumn: value,
}));

/**
 * Create grid-column-start utility classes.
 */
export const useGridColumnStartUtility = createUseUtility("grid-column-start", ({ value }) => ({
	gridColumnStart: value,
}));

/**
 * Create grid-column-end utility classes.
 */
export const useGridColumnEndUtility = createUseUtility("grid-column-end", ({ value }) => ({
	gridColumnEnd: value,
}));

/**
 * Create grid-template-rows utility classes.
 */
export const useGridTemplateRowsUtility = createUseUtility("grid-template-rows", ({ value }) => ({
	gridTemplateRows: value,
}));

/**
 * Create grid-row utility classes.
 */
export const useGridRowUtility = createUseUtility("grid-row", ({ value }) => ({
	gridRow: value,
}));

/**
 * Create grid-row-start utility classes.
 */
export const useGridRowStartUtility = createUseUtility("grid-row-start", ({ value }) => ({
	gridRowStart: value,
}));

/**
 * Create grid-row-end utility classes.
 */
export const useGridRowEndUtility = createUseUtility("grid-row-end", ({ value }) => ({
	gridRowEnd: value,
}));

/**
 * Create grid-auto-flow utility classes.
 */
export const useGridAutoFlowUtility = createUseUtility(
	"grid-auto-flow",
	({ value }) => ({
		gridAutoFlow: value,
	}),
	{ defaults: gridAutoFlowValues },
);

/**
 * Create grid-auto-columns utility classes.
 */
export const useGridAutoColumnsUtility = createUseUtility("grid-auto-columns", ({ value }) => ({
	gridAutoColumns: value,
}));

/**
 * Create grid-auto-rows utility classes.
 */
export const useGridAutoRowsUtility = createUseUtility("grid-auto-rows", ({ value }) => ({
	gridAutoRows: value,
}));
