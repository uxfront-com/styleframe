import { createUseUtility } from "../../utils";
import { alignContentValues, alignItemsValues, alignSelfValues } from "../../values";

/**
 * Create align-content utility classes.
 */
export const useAlignContentUtility = createUseUtility(
	"align-content",
	({ value }) => ({
		alignContent: value,
	}),
	{ defaults: alignContentValues },
);

/**
 * Create align-items utility classes.
 */
export const useAlignItemsUtility = createUseUtility(
	"align-items",
	({ value }) => ({
		alignItems: value,
	}),
	{ defaults: alignItemsValues },
);

/**
 * Create align-self utility classes.
 */
export const useAlignSelfUtility = createUseUtility(
	"align-self",
	({ value }) => ({
		alignSelf: value,
	}),
	{ defaults: alignSelfValues },
);
