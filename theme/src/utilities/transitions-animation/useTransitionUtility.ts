import { createUseUtility } from "../../utils";
import { transitionPropertyValues, transitionBehaviorValues } from "../../values";

/**
 * Create transition utility classes.
 */
export const useTransitionUtility = createUseUtility("transition", ({ value }) => ({
	transition: value,
}));

/**
 * Create transition-property utility classes.
 */
export const useTransitionPropertyUtility = createUseUtility(
	"transition-property",
	({ value }) => ({
		transitionProperty: value,
		transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
		transitionDuration: "@duration.fast",
	}),
	{ defaults: transitionPropertyValues },
);

/**
 * Create transition-behavior utility classes.
 */
export const useTransitionBehaviorUtility = createUseUtility(
	"transition-behavior",
	({ value }) => ({
		transitionBehavior: value,
	}),
	{ defaults: transitionBehaviorValues },
);

/**
 * Create transition-duration utility classes.
 */
export const useTransitionDurationUtility = createUseUtility(
	"transition-duration",
	({ value }) => ({
		transitionDuration: value,
	}),
	{ namespace: "duration" },
);

/**
 * Create transition-timing-function utility classes.
 */
export const useTransitionTimingFunctionUtility = createUseUtility(
	"transition-timing-function",
	({ value }) => ({
		transitionTimingFunction: value,
	}),
	{ namespace: "easing" },
);

/**
 * Create transition-delay utility classes.
 */
export const useTransitionDelayUtility = createUseUtility(
	"transition-delay",
	({ value }) => ({
		transitionDelay: value,
	}),
	{ namespace: "duration" },
);
