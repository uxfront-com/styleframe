/**
 * Parse a CSS `cubic-bezier(...)` string into the DTCG 4-tuple form.
 * Returns `undefined` when the input does not match the grammar.
 */

import type { DTCGCubicBezier } from "../types/cubic-bezier";

export const CUBIC_BEZIER_PATTERN =
	/^\s*cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)\s*$/i;

export function parseCubicBezier(input: string): DTCGCubicBezier | undefined {
	const match = input.match(CUBIC_BEZIER_PATTERN);
	if (!match) {
		return undefined;
	}
	const nums = [match[1], match[2], match[3], match[4]].map((s) => Number.parseFloat(s as string));
	if (nums.some((n) => !Number.isFinite(n))) {
		return undefined;
	}
	return [nums[0], nums[1], nums[2], nums[3]] as unknown as DTCGCubicBezier;
}
