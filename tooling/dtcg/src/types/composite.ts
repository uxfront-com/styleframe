/**
 * DTCG composite token value types. Format Module §7.
 *
 * Sub-properties of every composite type may themselves be aliases — see
 * the `DTCGAlias` arms in each interface below.
 */

import type { DTCGAlias } from "./alias";
import type { DTCGColor } from "./color";
import type { DTCGCubicBezier } from "./cubic-bezier";
import type { DTCGDimension } from "./dimension";
import type { DTCGDuration } from "./duration";
import type { DTCGFontFamily, DTCGFontWeight } from "./font";

/**
 * Stroke-style: either a CSS-style keyword or an explicit dash-array object.
 */
export type DTCGStrokeStyleKeyword =
	| "solid"
	| "dashed"
	| "dotted"
	| "double"
	| "groove"
	| "ridge"
	| "outset"
	| "inset";

export interface DTCGStrokeStyleObject {
	dashArray: Array<DTCGDimension | DTCGAlias>;
	lineCap: "round" | "butt" | "square";
}

export type DTCGStrokeStyle = DTCGStrokeStyleKeyword | DTCGStrokeStyleObject;

/**
 * Border. Color, width, and style — each may be a primitive or an alias.
 */
export interface DTCGBorder {
	color: DTCGColor | DTCGAlias;
	width: DTCGDimension | DTCGAlias;
	style: DTCGStrokeStyle | DTCGAlias;
}

/**
 * Transition. duration + timingFunction required, delay optional.
 */
export interface DTCGTransition {
	duration: DTCGDuration | DTCGAlias;
	delay?: DTCGDuration | DTCGAlias;
	timingFunction: DTCGCubicBezier | DTCGAlias;
}

/**
 * Single shadow layer. The spec also allows `$value` to be an array of these
 * (multiple stacked shadows) — that case is the array union below.
 */
export interface DTCGShadowLayer {
	color: DTCGColor | DTCGAlias;
	offsetX: DTCGDimension | DTCGAlias;
	offsetY: DTCGDimension | DTCGAlias;
	blur?: DTCGDimension | DTCGAlias;
	spread?: DTCGDimension | DTCGAlias;
	/** When true, renders as an inset shadow (CSS `inset` keyword). */
	inset?: boolean;
}

export type DTCGShadow = DTCGShadowLayer | Array<DTCGShadowLayer>;

/**
 * Gradient stop. Position is in [0, 1]; when omitted, stops are auto-spaced
 * by the consumer.
 */
export interface DTCGGradientStop {
	color: DTCGColor | DTCGAlias;
	position?: number | DTCGAlias;
}

export type DTCGGradient = Array<DTCGGradientStop>;

/**
 * Typography composite. fontFamily and fontSize are required; everything
 * else is optional. lineHeight may be a unitless number (multiplier of
 * fontSize) or an explicit dimension.
 */
export interface DTCGTypography {
	fontFamily: DTCGFontFamily | DTCGAlias;
	fontSize: DTCGDimension | DTCGAlias;
	fontWeight?: DTCGFontWeight | DTCGAlias;
	letterSpacing?: DTCGDimension | DTCGAlias;
	lineHeight?: number | DTCGDimension | DTCGAlias;
}
