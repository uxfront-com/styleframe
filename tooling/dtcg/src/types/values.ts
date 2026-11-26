/**
 * DTCG token type identifiers and the union of all possible token values.
 * Format Module §6 (primitives) and §7 (composites).
 */

import type { DTCGAlias } from "./alias";
import type { DTCGColor } from "./color";
import type {
	DTCGBorder,
	DTCGGradient,
	DTCGShadow,
	DTCGStrokeStyle,
	DTCGTransition,
	DTCGTypography,
} from "./composite";
import type { DTCGCubicBezier } from "./cubic-bezier";
import type { DTCGDimension } from "./dimension";
import type { DTCGDuration } from "./duration";
import type { DTCGFontFamily, DTCGFontWeight } from "./font";

/**
 * Primitive token type identifiers.
 */
export type DTCGPrimitiveTokenType =
	| "color"
	| "dimension"
	| "fontFamily"
	| "fontWeight"
	| "duration"
	| "cubicBezier"
	| "number";

/**
 * Composite token type identifiers.
 */
export type DTCGCompositeTokenType =
	| "border"
	| "strokeStyle"
	| "transition"
	| "shadow"
	| "gradient"
	| "typography";

/**
 * Union of every spec-defined `$type` value.
 */
export type DTCGTokenType = DTCGPrimitiveTokenType | DTCGCompositeTokenType;

/**
 * Map a `$type` to the concrete shape its `$value` must match.
 * Each entry MAY also be an alias to another token of the same type.
 */
export interface DTCGTokenValueMap {
	color: DTCGColor;
	dimension: DTCGDimension;
	fontFamily: DTCGFontFamily;
	fontWeight: DTCGFontWeight;
	duration: DTCGDuration;
	cubicBezier: DTCGCubicBezier;
	number: number;
	border: DTCGBorder;
	strokeStyle: DTCGStrokeStyle;
	transition: DTCGTransition;
	shadow: DTCGShadow;
	gradient: DTCGGradient;
	typography: DTCGTypography;
}

/**
 * Type-narrowed token value for a given `$type`. An alias is always allowed
 * in place of a concrete value.
 */
export type DTCGTokenValueOf<T extends DTCGTokenType> = DTCGTokenValueMap[T] | DTCGAlias;

/**
 * Loose union of every possible value at the JSON level. Useful when the
 * `$type` of a token has not yet been determined.
 */
export type DTCGTokenValue = DTCGTokenValueMap[DTCGTokenType] | DTCGAlias | number | string;
