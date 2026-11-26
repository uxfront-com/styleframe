import { createUseUtility } from "../../utils";
import { outlineStyleValues } from "../../values";

/**
 * Create outline shorthand utility classes.
 */
export const useOutlineUtility = createUseUtility("outline", ({ value }) => ({
	outline: value,
}));

/**
 * Create outline-width utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useOutlineWidthUtility(s, {
 *     '0': '0px',
 *     '1': '1px',
 *     '2': '2px',
 *     '4': '4px',
 *     '8': '8px',
 * });
 * ```
 */
export const useOutlineWidthUtility = createUseUtility("outline-width", ({ value }) => ({
	outlineWidth: value,
}));

/**
 * Create outline-color utility classes.
 */
export const useOutlineColorUtility = createUseUtility(
	"outline-color",
	({ value }) => ({
		outlineColor: value,
	}),
	{ namespace: ["outline-color", "color"] },
);

/**
 * Create outline-style utility classes.
 */
export const useOutlineStyleUtility = createUseUtility(
	"outline-style",
	({ value }) => ({
		outlineStyle: value,
	}),
	{ defaults: outlineStyleValues },
);

/**
 * Create outline-offset utility classes.
 */
export const useOutlineOffsetUtility = createUseUtility("outline-offset", ({ value }) => ({
	outlineOffset: value,
}));
