import { createUseUtility } from "../../utils";
import {
	backfaceVisibilityValues,
	perspectiveOriginValues,
	transformOriginValues,
	transformStyleValues,
} from "../../values";

/**
 * Create backface-visibility utility classes.
 */
export const useBackfaceVisibilityUtility = createUseUtility(
	"backface-visibility",
	({ value }) => ({
		backfaceVisibility: value,
	}),
	{ defaults: backfaceVisibilityValues },
);

/**
 * Create perspective utility classes.
 */
export const usePerspectiveUtility = createUseUtility("perspective", ({ value }) => ({
	perspective: value,
}));

/**
 * Create perspective-origin utility classes.
 */
export const usePerspectiveOriginUtility = createUseUtility(
	"perspective-origin",
	({ value }) => ({
		perspectiveOrigin: value,
	}),
	{ defaults: perspectiveOriginValues },
);

/**
 * Create rotate utility classes.
 */
export const useRotateUtility = createUseUtility("rotate", ({ value }) => ({
	"--transform-rotate": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create rotate-x utility classes.
 */
export const useRotateXUtility = createUseUtility("rotate-x", ({ value }) => ({
	"--transform-rotate-x": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) rotateX(var(--transform-rotate-x)) rotateY(var(--transform-rotate-y)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create rotate-y utility classes.
 */
export const useRotateYUtility = createUseUtility("rotate-y", ({ value }) => ({
	"--transform-rotate-y": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) rotateX(var(--transform-rotate-x)) rotateY(var(--transform-rotate-y)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create scale utility classes.
 */
export const useScaleUtility = createUseUtility("scale", ({ value }) => ({
	"--transform-scale-x": value,
	"--transform-scale-y": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create scale-x utility classes.
 */
export const useScaleXUtility = createUseUtility("scale-x", ({ value }) => ({
	"--transform-scale-x": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create scale-y utility classes.
 */
export const useScaleYUtility = createUseUtility("scale-y", ({ value }) => ({
	"--transform-scale-y": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create skew-x utility classes.
 */
export const useSkewXUtility = createUseUtility("skew-x", ({ value }) => ({
	"--transform-skew-x": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create skew-y utility classes.
 */
export const useSkewYUtility = createUseUtility("skew-y", ({ value }) => ({
	"--transform-skew-y": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create transform-origin utility classes.
 */
export const useTransformOriginUtility = createUseUtility(
	"transform-origin",
	({ value }) => ({
		transformOrigin: value,
	}),
	{ defaults: transformOriginValues },
);

/**
 * Create transform-style utility classes.
 */
export const useTransformStyleUtility = createUseUtility(
	"transform-style",
	({ value }) => ({
		transformStyle: value,
	}),
	{ defaults: transformStyleValues },
);

/**
 * Create translate utility classes (both x and y).
 */
export const useTranslateUtility = createUseUtility("translate", ({ value }) => ({
	"--transform-translate-x": value,
	"--transform-translate-y": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create translate-x utility classes.
 */
export const useTranslateXUtility = createUseUtility("translate-x", ({ value }) => ({
	"--transform-translate-x": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create translate-y utility classes.
 */
export const useTranslateYUtility = createUseUtility("translate-y", ({ value }) => ({
	"--transform-translate-y": value,
	transform:
		"translate(var(--transform-translate-x), var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create translate-z utility classes.
 */
export const useTranslateZUtility = createUseUtility("translate-z", ({ value }) => ({
	"--transform-translate-z": value,
	transform:
		"translate3d(var(--transform-translate-x), var(--transform-translate-y), var(--transform-translate-z)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
}));

/**
 * Create transform utility classes.
 */
export const useTransformUtility = createUseUtility("transform", ({ value }) => ({
	transform: value,
}));
