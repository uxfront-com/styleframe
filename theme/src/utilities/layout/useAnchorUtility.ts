import { createUseUtility } from "../../utils";

/**
 * Create anchor-name utility classes.
 *
 * Escape-hatch tier: a thin property utility for the stable `anchor-name`
 * declaration, exposing an element as a named anchor so anchor-positioned
 * elements can reference it. Names are project-defined, so this utility ships
 * without defaults. The still-moving parts of anchor positioning —
 * `anchor()` expressions, `@position-try`, `position-visibility` — stay on the
 * raw `atRule` hatch.
 */
export const useAnchorNameUtility = createUseUtility(
	"anchor-name",
	({ value }) => ({
		anchorName: value,
	}),
);

/**
 * Create position-anchor utility classes.
 *
 * Escape-hatch tier: a thin property utility for the stable `position-anchor`
 * declaration, binding an anchor-positioned element to its default anchor by
 * name. Anchor names are project-defined, so this utility ships without
 * defaults.
 */
export const usePositionAnchorUtility = createUseUtility(
	"position-anchor",
	({ value }) => ({
		positionAnchor: value,
	}),
);

/**
 * Create position-area utility classes.
 *
 * Escape-hatch tier: a thin property utility for the stable `position-area`
 * declaration, placing an anchor-positioned element on the implicit anchor
 * grid. Area values are project-defined, so this utility ships without
 * defaults.
 */
export const usePositionAreaUtility = createUseUtility(
	"position-area",
	({ value }) => ({
		positionArea: value,
	}),
);

/**
 * Create position-try-fallbacks utility classes.
 *
 * Escape-hatch tier: a thin property utility for the stable
 * `position-try-fallbacks` declaration, listing the positions an
 * anchor-positioned element tries when it overflows, such as `flip-block`.
 * Fallback values are project-defined, so this utility ships without
 * defaults. Custom `@position-try` rules stay on the raw `atRule` hatch.
 */
export const usePositionTryFallbacksUtility = createUseUtility(
	"position-try-fallbacks",
	({ value }) => ({
		positionTryFallbacks: value,
	}),
);
