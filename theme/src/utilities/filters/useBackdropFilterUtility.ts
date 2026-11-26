import { createUseUtility } from "../../utils";

/**
 * Create backdrop-blur utility classes.
 */
export const useBackdropBlurUtility = createUseUtility("backdrop-blur", ({ value }) => ({
	"--backdrop-filter-blur": `blur(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));

/**
 * Create backdrop-brightness utility classes.
 */
export const useBackdropBrightnessUtility = createUseUtility(
	"backdrop-brightness",
	({ value }) => ({
		"--backdrop-filter-brightness": `brightness(${value})`,
		backdropFilter:
			"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
	}),
);

/**
 * Create backdrop-contrast utility classes.
 */
export const useBackdropContrastUtility = createUseUtility("backdrop-contrast", ({ value }) => ({
	"--backdrop-filter-contrast": `contrast(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));

/**
 * Create backdrop-grayscale utility classes.
 */
export const useBackdropGrayscaleUtility = createUseUtility("backdrop-grayscale", ({ value }) => ({
	"--backdrop-filter-grayscale": `grayscale(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));

/**
 * Create backdrop-hue-rotate utility classes.
 */
export const useBackdropHueRotateUtility = createUseUtility("backdrop-hue-rotate", ({ value }) => ({
	"--backdrop-filter-hue-rotate": `hue-rotate(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));

/**
 * Create backdrop-invert utility classes.
 */
export const useBackdropInvertUtility = createUseUtility("backdrop-invert", ({ value }) => ({
	"--backdrop-filter-invert": `invert(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));

/**
 * Create backdrop-opacity utility classes.
 */
export const useBackdropOpacityUtility = createUseUtility("backdrop-opacity", ({ value }) => ({
	"--backdrop-filter-opacity": `opacity(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));

/**
 * Create backdrop-saturate utility classes.
 */
export const useBackdropSaturateUtility = createUseUtility("backdrop-saturate", ({ value }) => ({
	"--backdrop-filter-saturate": `saturate(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));

/**
 * Create backdrop-sepia utility classes.
 */
export const useBackdropSepiaUtility = createUseUtility("backdrop-sepia", ({ value }) => ({
	"--backdrop-filter-sepia": `sepia(${value})`,
	backdropFilter:
		"var(--backdrop-filter-blur) var(--backdrop-filter-brightness) var(--backdrop-filter-contrast) var(--backdrop-filter-grayscale) var(--backdrop-filter-hue-rotate) var(--backdrop-filter-invert) var(--backdrop-filter-opacity) var(--backdrop-filter-saturate) var(--backdrop-filter-sepia)",
}));
