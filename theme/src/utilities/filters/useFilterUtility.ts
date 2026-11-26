import { createUseUtility } from "../../utils";

/**
 * Create filter utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useFilterUtility(s, {
 *     none: 'none',
 *     default: 'blur(8px)',
 * });
 * ```
 */
export const useFilterUtility = createUseUtility("filter", ({ value }) => ({
	filter: value,
}));

/**
 * Create blur utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useBlurUtility(s, {
 *     none: '0',
 *     sm: '4px',
 *     default: '8px',
 *     md: '12px',
 *     lg: '16px',
 *     xl: '24px',
 *     '2xl': '40px',
 *     '3xl': '64px',
 * });
 * ```
 */
export const useBlurUtility = createUseUtility("blur", ({ value }) => ({
	"--filter-blur": `blur(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create brightness utility classes.
 */
export const useBrightnessUtility = createUseUtility("brightness", ({ value }) => ({
	"--filter-brightness": `brightness(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create contrast utility classes.
 */
export const useContrastUtility = createUseUtility("contrast", ({ value }) => ({
	"--filter-contrast": `contrast(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create drop-shadow utility classes.
 */
export const useDropShadowUtility = createUseUtility("drop-shadow", ({ value }) => ({
	"--filter-drop-shadow": `drop-shadow(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create grayscale utility classes.
 */
export const useGrayscaleUtility = createUseUtility("grayscale", ({ value }) => ({
	"--filter-grayscale": `grayscale(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create hue-rotate utility classes.
 */
export const useHueRotateUtility = createUseUtility("hue-rotate", ({ value }) => ({
	"--filter-hue-rotate": `hue-rotate(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create invert utility classes.
 */
export const useInvertUtility = createUseUtility("invert", ({ value }) => ({
	"--filter-invert": `invert(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create saturate utility classes.
 */
export const useSaturateUtility = createUseUtility("saturate", ({ value }) => ({
	"--filter-saturate": `saturate(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));

/**
 * Create sepia utility classes.
 */
export const useSepiaUtility = createUseUtility("sepia", ({ value }) => ({
	"--filter-sepia": `sepia(${value})`,
	filter:
		"var(--filter-blur) var(--filter-brightness) var(--filter-contrast) var(--filter-grayscale) var(--filter-hue-rotate) var(--filter-invert) var(--filter-saturate) var(--filter-sepia) var(--filter-drop-shadow)",
}));
