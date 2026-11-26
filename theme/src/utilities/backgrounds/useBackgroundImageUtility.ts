import { createUseUtility } from "../../utils";
import { backgroundImageValues } from "../../values";

/**
 * Create background-image utility classes.
 */
export const useBackgroundImageUtility = createUseUtility(
	"background-image",
	({ value }) => ({
		backgroundImage: value,
	}),
	{ defaults: backgroundImageValues },
);

/**
 * Create gradient from-color utility classes.
 */
export const useGradientFromUtility = createUseUtility("gradient-from", ({ value }) => ({
	"--background-image-gradient-from": `${value} var(--background-image-gradient-from-position)`,
	"--background-image-gradient-to": `transparent var(--background-image-gradient-to-position)`,
	"--background-image-gradient-stops":
		"var(--background-image-gradient-from), var(--background-image-gradient-to)",
}));

/**
 * Create gradient via-color utility classes.
 */
export const useGradientViaUtility = createUseUtility("gradient-via", ({ value }) => ({
	"--background-image-gradient-to": "transparent var(--background-image-gradient-to-position)",
	"--background-image-gradient-stops": `var(--background-image-gradient-from), ${value} var(--background-image-gradient-via-position), var(--background-image-gradient-to)`,
}));

/**
 * Create gradient to-color utility classes.
 */
export const useGradientToUtility = createUseUtility("gradient-to", ({ value }) => ({
	"--background-image-gradient-to": `${value} var(--background-image-gradient-to-position)`,
}));
