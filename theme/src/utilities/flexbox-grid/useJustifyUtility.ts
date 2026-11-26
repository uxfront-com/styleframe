import { createUseUtility } from "../../utils";
import { justifyContentValues, justifyItemsValues, justifySelfValues } from "../../values";

/**
 * Create justify-content utility classes.
 */
export const useJustifyContentUtility = createUseUtility(
	"justify-content",
	({ value }) => ({
		justifyContent: value,
	}),
	{ defaults: justifyContentValues },
);

/**
 * Create justify-items utility classes.
 */
export const useJustifyItemsUtility = createUseUtility(
	"justify-items",
	({ value }) => ({
		justifyItems: value,
	}),
	{ defaults: justifyItemsValues },
);

/**
 * Create justify-self utility classes.
 */
export const useJustifySelfUtility = createUseUtility(
	"justify-self",
	({ value }) => ({
		justifySelf: value,
	}),
	{ defaults: justifySelfValues },
);
