import { createUseUtility } from "../../utils";

/**
 * Create border shorthand utility classes.
 */
export const useBorderUtility = createUseUtility("border", ({ value }) => ({
	border: value,
}));

/**
 * Create border-top shorthand utility classes.
 */
export const useBorderTopUtility = createUseUtility("border-top", ({ value }) => ({
	borderTop: value,
}));

/**
 * Create border-right shorthand utility classes.
 */
export const useBorderRightUtility = createUseUtility("border-right", ({ value }) => ({
	borderRight: value,
}));

/**
 * Create border-bottom shorthand utility classes.
 */
export const useBorderBottomUtility = createUseUtility("border-bottom", ({ value }) => ({
	borderBottom: value,
}));

/**
 * Create border-left shorthand utility classes.
 */
export const useBorderLeftUtility = createUseUtility("border-left", ({ value }) => ({
	borderLeft: value,
}));
