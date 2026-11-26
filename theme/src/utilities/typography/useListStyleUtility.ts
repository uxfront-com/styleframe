import { createUseUtility } from "../../utils";
import { listStylePositionValues, listStyleTypeValues } from "../../values";

/**
 * Create list-style shorthand utility classes.
 */
export const useListStyleUtility = createUseUtility("list-style", ({ value }) => ({
	listStyle: value,
}));

/**
 * Create list-style-image utility classes.
 */
export const useListStyleImageUtility = createUseUtility("list-style-image", ({ value }) => ({
	listStyleImage: value,
}));

/**
 * Create list-style-position utility classes.
 */
export const useListStylePositionUtility = createUseUtility(
	"list-style-position",
	({ value }) => ({
		listStylePosition: value,
	}),
	{ defaults: listStylePositionValues },
);

/**
 * Create list-style-type utility classes.
 */
export const useListStyleTypeUtility = createUseUtility(
	"list-style-type",
	({ value }) => ({
		listStyleType: value,
	}),
	{ defaults: listStyleTypeValues },
);
