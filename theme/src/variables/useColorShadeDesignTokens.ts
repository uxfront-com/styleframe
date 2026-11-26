import { createUseDerivedVariable } from "../utils";
import { computeRelativeColor, parseOklch } from "../utils/oklchGamut";
import { colorShadeValues } from "../values";
/**
 * Create a set of relative color shade (darker) levels
 *
 * @usage
 * const s = styleframe();
 *
 * const { colorPrimary } = useColorDesignTokens(s, { primary: "#007bff" });
 *
 * const {
 *   colorPrimaryShade50, // Variable<'color.primary-shade-50'>
 *   colorPrimaryShade100, // Variable<'color.primary-shade-100'>
 *   colorPrimaryShade150, // Variable<'color.primary-shade-150'>
 *   ...
 * } = useColorShadeDesignTokens(s, colorPrimary, {
 *   "shade-50": 5,
 *   "shade-100": 10,
 *   "shade-150": 15,
 *   ...
 * });
 * ```
 */
export const useColorShadeDesignTokens = createUseDerivedVariable({
	defaults: colorShadeValues,
	delimiter: "-",
	transform: (value: number, { s, parent }) => {
		if (typeof value !== "number") {
			return 0;
		}

		const parsed = parseOklch(String(parent.value));
		if (!parsed) {
			return s.ref(parent);
		}

		return computeRelativeColor(parsed.l, parsed.c, parsed.h, parsed.alpha, -(value / 100));
	},
});
