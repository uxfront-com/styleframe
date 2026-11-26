import { createUseVariable } from "../utils";
import { letterSpacingValues } from "../values";
/**
 * Create a set of letter-spacing variables for use in a Styleframe instance.
 *
 * @usage
 * ```typescript
 * import { styleframe } from "styleframe";
 * import { useLetterSpacingDesignTokens } from "styleframe/theme";
 *
 * const s = styleframe();
 *
 * const {
 *   letterSpacingTighter,
 *   letterSpacingTight,
 *   letterSpacingNormal,
 *   letterSpacingWide,
 *   letterSpacingWider,
 *   letterSpacing,
 * } = useLetterSpacingDesignTokens(s, {
 *   default: "normal",
 *   tighter: "-0.05em",
 *   tight: "-0.025em",
 *   normal: "normal",
 *   wide: "0.05em",
 *   wider: "0.1em",
 * });
 * ```
 */
export const useLetterSpacingDesignTokens = createUseVariable("letter-spacing", {
	defaults: letterSpacingValues,
});
