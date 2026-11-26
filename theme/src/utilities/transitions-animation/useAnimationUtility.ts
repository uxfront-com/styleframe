import { createUseUtility } from "../../utils";
import { animationValues } from "../../values";

/**
 * Create animation utility classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useAnimationUtility(s);
 * // Uses defaults: ._animate:none, ._animate:spin, etc.
 * ```
 */
export const useAnimationUtility = createUseUtility(
	"animation",
	({ value }) => ({
		animation: value,
	}),
	{ defaults: animationValues },
);

/**
 * Create animation-name utility classes.
 */
export const useAnimationNameUtility = createUseUtility("animation-name", ({ value }) => ({
	animationName: value,
}));

/**
 * Create animation-duration utility classes.
 */
export const useAnimationDurationUtility = createUseUtility(
	"animation-duration",
	({ value }) => ({
		animationDuration: value,
	}),
	{ namespace: "duration" },
);

/**
 * Create animation-timing-function utility classes.
 */
export const useAnimationTimingFunctionUtility = createUseUtility(
	"animation-timing-function",
	({ value }) => ({
		animationTimingFunction: value,
	}),
	{ namespace: "easing" },
);

/**
 * Create animation-iteration-count utility classes.
 */
export const useAnimationIterationCountUtility = createUseUtility(
	"animation-iteration-count",
	({ value }) => ({
		animationIterationCount: value,
	}),
);
