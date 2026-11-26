import { createUseUtility } from "../../utils";

/**
 * Create ring-width utility classes.
 * Uses box-shadow to create a ring effect.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useRingWidthUtility(s, {
 *     '0': '0px',
 *     '1': '1px',
 *     '2': '2px',
 *     default: '3px',
 *     '4': '4px',
 *     '8': '8px',
 * });
 * ```
 */
export const useRingWidthUtility = createUseUtility("ring", ({ value }) => ({
	"--box-shadow-ring-offset":
		"var(--box-shadow-ring-inset) 0 0 0 var(--box-shadow-ring-offset-width) var(--box-shadow-ring-offset-color)",
	"--box-shadow-ring": `var(--box-shadow-ring-inset) 0 0 0 calc(${value} + var(--box-shadow-ring-offset-width)) var(--box-shadow-ring-color)`,
	boxShadow: "var(--box-shadow-ring-offset), var(--box-shadow-ring), var(--box-shadow, 0 0 #0000)",
}));

/**
 * Create ring-inset utility classes.
 */
export const useRingInsetUtility = createUseUtility(
	"ring-inset",
	() => ({
		"--box-shadow-ring-inset": "inset",
	}),
	{
		defaults: {
			default: true,
		},
	},
);

/**
 * Create ring-color utility classes.
 */
export const useRingColorUtility = createUseUtility(
	"ring-color",
	({ value }) => ({
		"--box-shadow-ring-color": value,
	}),
	{ namespace: ["ring-color", "color"] },
);

/**
 * Create ring-offset-width utility classes.
 */
export const useRingOffsetWidthUtility = createUseUtility("ring-offset", ({ value }) => ({
	"--box-shadow-ring-offset-width": value,
}));

/**
 * Create ring-offset-color utility classes.
 */
export const useRingOffsetColorUtility = createUseUtility(
	"ring-offset-color",
	({ value }) => ({
		"--box-shadow-ring-offset-color": value,
	}),
	{ namespace: ["ring-offset-color", "color"] },
);
