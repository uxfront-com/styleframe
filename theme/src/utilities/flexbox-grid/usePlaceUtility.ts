import { createUseUtility } from "../../utils";
import { placeContentValues, placeItemsValues, placeSelfValues } from "../../values";

/**
 * Create place-content utility classes.
 */
export const usePlaceContentUtility = createUseUtility(
	"place-content",
	({ value }) => ({
		placeContent: value,
	}),
	{ defaults: placeContentValues },
);

/**
 * Create place-items utility classes.
 */
export const usePlaceItemsUtility = createUseUtility(
	"place-items",
	({ value }) => ({
		placeItems: value,
	}),
	{ defaults: placeItemsValues },
);

/**
 * Create place-self utility classes.
 */
export const usePlaceSelfUtility = createUseUtility(
	"place-self",
	({ value }) => ({
		placeSelf: value,
	}),
	{ defaults: placeSelfValues },
);
