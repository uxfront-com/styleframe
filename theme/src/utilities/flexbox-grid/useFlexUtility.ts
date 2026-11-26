import { createUseUtility } from "../../utils";
import { flexDirectionValues, flexValues, flexWrapValues } from "../../values";

const flexDirectionCssValues = new Set<string>(Object.values(flexDirectionValues));
const flexWrapCssValues = new Set<string>(Object.values(flexWrapValues));

/**
 * Create flex utility classes.
 *
 * The `_flex:` namespace mirrors Tailwind's `flex-*` family, routing each value
 * to the correct CSS property: direction keywords (`row`/`col`/`column`/…) to
 * `flex-direction`, wrap keywords (`wrap`/`nowrap`/`wrap-reverse`) to `flex-wrap`,
 * and everything else (the `flex` shorthand) to `flex`.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * useFlexUtility(s);
 * // ._flex:1 / ._flex:auto / ._flex:none     → flex
 * // ._flex:row / ._flex:col / ._flex:column  → flex-direction
 * // ._flex:wrap / ._flex:nowrap              → flex-wrap
 * ```
 */
export const useFlexUtility = createUseUtility(
	"flex",
	({ value }) => {
		if (typeof value === "string") {
			if (flexDirectionCssValues.has(value)) {
				return { flexDirection: value };
			}
			if (flexWrapCssValues.has(value)) {
				return { flexWrap: value };
			}
		}
		return { flex: value };
	},
	{ defaults: flexValues },
);

/**
 * Create flex-grow utility classes.
 */
export const useFlexGrowUtility = createUseUtility("flex-grow", ({ value }) => ({
	flexGrow: value,
}));

/**
 * Create flex-shrink utility classes.
 */
export const useFlexShrinkUtility = createUseUtility("flex-shrink", ({ value }) => ({
	flexShrink: value,
}));

/**
 * Create flex-basis utility classes.
 */
export const useFlexBasisUtility = createUseUtility("flex-basis", ({ value }) => ({
	flexBasis: value,
}));
