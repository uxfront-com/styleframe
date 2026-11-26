import { createUseUtility } from "../../utils";

/**
 * Create text-shadow utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useTextShadowUtility(s, {
 *     sm: '0 1px 2px var(--text-shadow-color, rgb(0 0 0 / 0.05))',
 *     default: '0 1px 3px var(--text-shadow-color, rgb(0 0 0 / 0.1))',
 *     md: '0 2px 4px var(--text-shadow-color, rgb(0 0 0 / 0.1))',
 *     lg: '0 4px 8px var(--text-shadow-color, rgb(0 0 0 / 0.1))',
 *     none: 'none',
 * });
 * ```
 */
export const useTextShadowUtility = createUseUtility("text-shadow", ({ value }) => ({
	textShadow: value,
}));

/**
 * Create text-shadow-color utility classes.
 */
export const useTextShadowColorUtility = createUseUtility("text-shadow-color", ({ value }) => ({
	"--text-shadow-color": value,
}));
