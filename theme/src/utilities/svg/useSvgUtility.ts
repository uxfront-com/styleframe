import { createUseUtility } from "../../utils";

/**
 * Create fill utility classes for SVG elements.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useFillUtility(s, {
 *     none: 'none',
 *     current: 'currentColor',
 *     inherit: 'inherit',
 * });
 * ```
 */
export const useFillUtility = createUseUtility(
	"fill",
	({ value }) => ({
		fill: value,
	}),
	{ namespace: ["fill", "color"] },
);

/**
 * Create stroke utility classes for SVG elements.
 */
export const useStrokeUtility = createUseUtility(
	"stroke",
	({ value }) => ({
		stroke: value,
	}),
	{ namespace: ["stroke", "color"] },
);

/**
 * Create stroke-width utility classes for SVG elements.
 */
export const useStrokeWidthUtility = createUseUtility("stroke-width", ({ value }) => ({
	strokeWidth: value,
}));
