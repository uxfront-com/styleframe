import { createUseDerivedVariable } from "../utils";
import { computeRelativeColor, parseOklch } from "../utils/oklchGamut";
import { colorTintValues } from "../values";
/**
 * Create a set of relative color tint (lighter) levels
 *
 * @usage
 * const s = styleframe();
 *
 * const { colorPrimary } = useColorDesignTokens(s, { primary: "#007bff" });
 *
 * const {
 *   colorPrimaryTint50, // Variable<'color.primary-tint-50'>
 *   colorPrimaryTint100, // Variable<'color.primary-tint-100'>
 *   colorPrimaryTint150, // Variable<'color.primary-tint-150'>
 *   ...
 * } = useColorTintDesignTokens(s, colorPrimary, {
 *   "tint-50": 5,
 *   "tint-100": 10,
 *   "tint-150": 15,
 *   ...
 * });
 * ```
 */
export const useColorTintDesignTokens = createUseDerivedVariable({
	defaults: colorTintValues,
	delimiter: "-",
	transform: (value: number, { s, parent }) => {
		if (typeof value !== "number") {
			return 0;
		}

		const parsed = parseOklch(String(parent.value));
		if (!parsed) {
			return s.ref(parent);
		}

		return computeRelativeColor(parsed.l, parsed.c, parsed.h, parsed.alpha, value / 100);
	},
});
