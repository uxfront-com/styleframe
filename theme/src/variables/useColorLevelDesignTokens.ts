import { createUseDerivedVariable } from "../utils";
import { computeLightnessColor, parseOklch } from "../utils/oklchGamut";
import { colorLevelValues } from "../values";
/**
 * Create a set of lightness levels for a color variable.
 *
 * @usage
 * ```typescript
 * import { styleframe } from "styleframe";
 * import { useColors } from "styleframe/theme";
 *
 * const s = styleframe();
 *
 * const { colorPrimary } = useColorDesignTokens(s, { primary: "#007bff" });
 *
 * const {
 *   colorPrimary100, // Variable<'color.primary-100'>
 *   colorPrimary200, // Variable<'color.primary-200'>
 *   colorPrimary300, // Variable<'color.primary-300'>
 *   ...
 * } = useColorLevelDesignTokens(s, colorPrimary, {
 *   100: 0.93,
 *   200: 0.85,
 *   300: 0.75,
 *   ...
 * });
 * ```
 */
export const useColorLevelDesignTokens = createUseDerivedVariable({
	defaults: colorLevelValues,
	delimiter: "-",
	transform: (value: number, { s, parent }) => {
		if (typeof value !== "number") {
			return 0;
		}

		const parsed = parseOklch(String(parent.value));
		if (!parsed) {
			return s.ref(parent);
		}

		return computeLightnessColor(parsed.l, parsed.c, parsed.h, parsed.alpha, value);
	},
});
