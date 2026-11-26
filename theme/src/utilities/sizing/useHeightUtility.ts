import { createUseSpacingUtility } from "../../utils";

/**
 * Create height utility classes with multiplier support.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const createHeight = useHeightUtility(s, {
 *     full: '100%',
 *     screen: '100vh',
 *     auto: 'auto',
 *     '1/2': '50%',
 * });
 *
 * // Add multiplier values (with @ prefix):
 * createHeight(["@1", "@2", "@4"]);
 * // Generates:
 * // ._height:1 { height: calc(var(--spacing) * 1); }
 * // ._height:2 { height: calc(var(--spacing) * 2); }
 * // ._height:4 { height: calc(var(--spacing) * 4); }
 * ```
 */
export const useHeightUtility = createUseSpacingUtility("height", ({ value }) => ({
	height: value,
}));

/**
 * Create min-height utility classes with multiplier support.
 */
export const useMinHeightUtility = createUseSpacingUtility("min-height", ({ value }) => ({
	minHeight: value,
}));

/**
 * Create max-height utility classes with multiplier support.
 */
export const useMaxHeightUtility = createUseSpacingUtility("max-height", ({ value }) => ({
	maxHeight: value,
}));
