import { createUseSpacingUtility } from "../../utils";

/**
 * Create width utility classes with multiplier support.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const createWidth = useWidthUtility(s, {
 *     full: '100%',
 *     screen: '100vw',
 *     auto: 'auto',
 *     '1/2': '50%',
 *     '1/3': '33.333333%',
 * });
 *
 * // Add multiplier values (with @ prefix):
 * createWidth(["@1", "@2", "@4"]);
 * // Generates:
 * // ._width:1 { width: calc(var(--spacing) * 1); }
 * // ._width:2 { width: calc(var(--spacing) * 2); }
 * // ._width:4 { width: calc(var(--spacing) * 4); }
 * ```
 */
export const useWidthUtility = createUseSpacingUtility("width", ({ value }) => ({
	width: value,
}));

/**
 * Create min-width utility classes with multiplier support.
 */
export const useMinWidthUtility = createUseSpacingUtility("min-width", ({ value }) => ({
	minWidth: value,
}));

/**
 * Create max-width utility classes with multiplier support.
 */
export const useMaxWidthUtility = createUseSpacingUtility("max-width", ({ value }) => ({
	maxWidth: value,
}));
