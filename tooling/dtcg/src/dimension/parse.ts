import type { DTCGDimension } from "../types/dimension";

const DIMENSION_PATTERN = /^(-?\d*\.?\d+)([a-zA-Z%]+)$/;

/**
 * Parse a CSS dimension string ("16px", "1.5rem", "100%") into a
 * DTCG `{value, unit}` object. Returns `undefined` when the input does not
 * match the dimension grammar.
 *
 * The DTCG spec does not restrict units to a fixed list — anything that
 * matches `<number><unit>` is accepted.
 */
export function parse(input: string): DTCGDimension | undefined {
	const match = input.trim().match(DIMENSION_PATTERN);
	if (!match) {
		return undefined;
	}
	const value = Number.parseFloat(match[1] as string);
	if (!Number.isFinite(value)) {
		return undefined;
	}
	return { value, unit: match[2] as string };
}
