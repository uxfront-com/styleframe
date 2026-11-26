import { createUseUtility } from "../../utils";
import { divideStyleValues } from "../../values";

/**
 * Create divide-x-width utility classes.
 * Adds borders between horizontal children.
 */
export const useDivideXUtility = createUseUtility("divide-x", ({ value }) => ({
	"& > * + *": {
		borderLeftWidth: value,
	},
}));

/**
 * Create divide-y-width utility classes.
 * Adds borders between vertical children.
 */
export const useDivideYUtility = createUseUtility("divide-y", ({ value }) => ({
	"& > * + *": {
		borderTopWidth: value,
	},
}));

/**
 * Create divide-x-reverse utility classes.
 */
export const useDivideXReverseUtility = createUseUtility("divide-x-reverse", ({ value }) => ({
	"& > * + *": {
		borderRightWidth: value,
		borderLeftWidth: 0,
	},
}));

/**
 * Create divide-y-reverse utility classes.
 */
export const useDivideYReverseUtility = createUseUtility("divide-y-reverse", ({ value }) => ({
	"& > * + *": {
		borderBottomWidth: value,
		borderTopWidth: 0,
	},
}));

/**
 * Create divide-color utility classes.
 */
export const useDivideColorUtility = createUseUtility(
	"divide-color",
	({ value }) => ({
		"& > * + *": {
			borderColor: value,
		},
	}),
	{ namespace: ["divide-color", "color"] },
);

/**
 * Create divide-style utility classes.
 */
export const useDivideStyleUtility = createUseUtility(
	"divide-style",
	({ value }) => ({
		"& > * + *": {
			borderStyle: value,
		},
	}),
	{ defaults: divideStyleValues },
);
