import { createUseUtility } from "../../utils";

/**
 * Create text-indent utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useTextIndentUtility(s, {
 *     '0': '0px',
 *     '1': '0.25rem',
 *     '2': '0.5rem',
 *     '4': '1rem',
 * });
 * ```
 */
export const useTextIndentUtility = createUseUtility("text-indent", ({ value }) => ({
	textIndent: value,
}));
