import type { DTCGDuration } from "../types/duration";

const DURATION_PATTERN = /^(-?\d*\.?\d+)(ms|s)$/;

/**
 * Parse a CSS duration string into a DTCG `{value, unit}` object. Only
 * `"ms"` and `"s"` are accepted per Format Module §6.5.
 */
export function parse(input: string): DTCGDuration | undefined {
	const match = input.trim().match(DURATION_PATTERN);
	if (!match) {
		return undefined;
	}
	const value = Number.parseFloat(match[1] as string);
	if (!Number.isFinite(value)) {
		return undefined;
	}
	return { value, unit: match[2] as DTCGDuration["unit"] };
}
