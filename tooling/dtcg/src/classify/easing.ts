/**
 * CSS easing keyword → cubic-bezier 4-tuple, per CSS Easing Level 1.
 * Returns `undefined` for unknown keywords.
 *
 * @see https://www.w3.org/TR/css-easing-1/#valdef-easing-function-ease
 */

import type { DTCGCubicBezier } from "../types/cubic-bezier";

const KEYWORD_TO_BEZIER: Readonly<Record<string, DTCGCubicBezier>> = {
	linear: [0, 0, 1, 1] as unknown as DTCGCubicBezier,
	ease: [0.25, 0.1, 0.25, 1] as unknown as DTCGCubicBezier,
	"ease-in": [0.42, 0, 1, 1] as unknown as DTCGCubicBezier,
	"ease-out": [0, 0, 0.58, 1] as unknown as DTCGCubicBezier,
	"ease-in-out": [0.42, 0, 0.58, 1] as unknown as DTCGCubicBezier,
};

export function easingKeywordToBezier(keyword: string): DTCGCubicBezier | undefined {
	return KEYWORD_TO_BEZIER[keyword.trim().toLowerCase()];
}

export function isEasingKeyword(value: string): boolean {
	return easingKeywordToBezier(value) !== undefined;
}
