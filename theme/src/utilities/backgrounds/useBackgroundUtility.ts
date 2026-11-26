import { createUseUtility } from "../../utils";

/**
 * Create background shorthand utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useBackgroundUtility(s, {
 *     none: 'none',
 *     cover: 'center / cover no-repeat',
 *     contain: 'center / contain no-repeat',
 * });
 * ```
 */
export const useBackgroundUtility = createUseUtility("background", ({ value }) => ({
	background: value,
}));
