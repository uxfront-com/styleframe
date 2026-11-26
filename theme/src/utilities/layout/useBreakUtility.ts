import { createUseUtility } from "../../utils";
import { breakAfterValues, breakBeforeValues, breakInsideValues } from "../../values";

/**
 * Create break-after utility classes.
 */
export const useBreakAfterUtility = createUseUtility(
	"break-after",
	({ value }) => ({
		breakAfter: value,
	}),
	{ defaults: breakAfterValues },
);

/**
 * Create break-before utility classes.
 */
export const useBreakBeforeUtility = createUseUtility(
	"break-before",
	({ value }) => ({
		breakBefore: value,
	}),
	{ defaults: breakBeforeValues },
);

/**
 * Create break-inside utility classes.
 */
export const useBreakInsideUtility = createUseUtility(
	"break-inside",
	({ value }) => ({
		breakInside: value,
	}),
	{ defaults: breakInsideValues },
);
