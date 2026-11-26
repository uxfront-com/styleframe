import type { DeclarationsCallbackContext, TokenValue, Variable } from "@styleframe/core";
import { isVariable } from "@styleframe/core";

import { normalizeRange } from "../../utils/normalizeRange";
import type { RangeInput } from "../../utils/normalizeRange";

/**
 * Create a fluid value that interpolates between a min and max as the
 * viewport scales. Reads `fluid.breakpoint` (set up via
 * `useFluidViewportDesignTokens`) by default; pass a `Variable` or
 * `TokenValue` as the third argument to use a custom interpolator.
 *
 * Ranges accept either a tuple `[min, max]` or an object `{ min, max }`.
 *
 * For typography systems, prefer passing the same range types directly to
 * `useFontSizeDesignTokens` — it routes range values through this function
 * automatically. Use `useFluidClamp` directly for one-off fluid values on
 * any other CSS property.
 *
 * @usage
 * ```typescript
 * import { styleframe } from "styleframe";
 * import {
 *   useFluidViewportDesignTokens,
 *   useFluidClamp,
 *   useSpacingDesignTokens,
 * } from "styleframe/theme";
 *
 * const s = styleframe();
 *
 * useFluidViewportDesignTokens(s);
 *
 * const { spacingLg } = useSpacingDesignTokens(s, {
 *   lg: useFluidClamp(s, [16, 32]),
 * });
 * ```
 */
export function useFluidClamp(
	s: DeclarationsCallbackContext,
	range: RangeInput<Variable | TokenValue>,
	breakpoint: Variable | TokenValue = s.ref("fluid.breakpoint"),
): TokenValue {
	const [rawMin, rawMax] = normalizeRange(range);
	const min = isVariable(rawMin) ? s.ref(rawMin) : rawMin;
	const max = isVariable(rawMax) ? s.ref(rawMax) : rawMax;
	const bp = isVariable(breakpoint) ? s.ref(breakpoint) : breakpoint;

	return s.css`calc((${min} / 16 * 1rem) + (${max} - ${min}) * ${bp})`;
}
