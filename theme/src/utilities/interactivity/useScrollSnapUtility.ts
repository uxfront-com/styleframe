import { createUseUtility } from "../../utils";
import { scrollSnapAlignValues, scrollSnapStopValues, scrollSnapTypeValues } from "../../values";

/**
 * Create scroll-snap-align utility classes.
 */
export const useScrollSnapAlignUtility = createUseUtility(
	"scroll-snap-align",
	({ value }) => ({
		scrollSnapAlign: value,
	}),
	{ defaults: scrollSnapAlignValues },
);

/**
 * Create scroll-snap-stop utility classes.
 */
export const useScrollSnapStopUtility = createUseUtility(
	"scroll-snap-stop",
	({ value }) => ({
		scrollSnapStop: value,
	}),
	{ defaults: scrollSnapStopValues },
);

/**
 * Create scroll-snap-type utility classes.
 */
export const useScrollSnapTypeUtility = createUseUtility(
	"scroll-snap-type",
	({ value }) => {
		if (value === "mandatory" || value === "proximity") {
			return {
				"--scroll-snap-type-strictness": value,
			};
		}
		return {
			scrollSnapType: value,
		};
	},
	{ defaults: scrollSnapTypeValues },
);
