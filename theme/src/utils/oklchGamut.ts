import { rgb, oklch as toOklch } from "culori";

type OklchComponents = ReturnType<typeof toOklch>;

/**
 * Parse a color string (hex, rgb, oklch, etc.) into OKLCH components.
 */
export function parseOklch(value: string): OklchComponents | undefined {
	const parsed = toOklch(value);
	if (!parsed || parsed.l == null || parsed.c == null) {
		return undefined;
	}

	return {
		l: parsed.l,
		c: parsed.c,
		h: parsed.h ?? 0,
		alpha: parsed.alpha ?? 1,
	};
}

/**
 * Check if an OKLCH color is displayable in sRGB gamut.
 */
function isInSrgbGamut(l: number, c: number, h: number): boolean {
	const converted = rgb({ mode: "oklch", l, c, h });
	if (!converted) {
		return false;
	}
	const { r, g, b } = converted;
	const epsilon = 1e-4;
	return (
		r >= -epsilon &&
		r <= 1 + epsilon &&
		g >= -epsilon &&
		g <= 1 + epsilon &&
		b >= -epsilon &&
		b <= 1 + epsilon
	);
}

const BINARY_SEARCH_ITERATIONS = 20;
const MAX_CHROMA = 0.4;

/**
 * Find the maximum displayable chroma in sRGB at a given OKLCH lightness and hue.
 * Uses binary search over the chroma range [0, 0.4].
 */
export function findMaxChroma(l: number, h: number): number {
	let lo = 0;
	let hi = MAX_CHROMA;

	for (let i = 0; i < BINARY_SEARCH_ITERATIONS; i++) {
		const mid = (lo + hi) / 2;
		if (isInSrgbGamut(l, mid, h)) {
			lo = mid;
		} else {
			hi = mid;
		}
	}

	return lo;
}

const ACHROMATIC_THRESHOLD = 0.001;

/**
 * Compute a gamut-aware OKLCH color at a target lightness, preserving the
 * proportional chroma relative to the gamut boundary.
 *
 * Algorithm:
 * 1. Find max displayable chroma at the base color's L/H
 * 2. Find max displayable chroma at the target L/H
 * 3. Scale base chroma proportionally: scaledC = baseC * (maxTarget / maxBase)
 * 4. Format as oklch() CSS string
 */
export function computeLightnessColor(
	baseL: number,
	baseC: number,
	baseH: number,
	baseAlpha: number,
	targetL: number,
): string {
	let scaledC: number;

	if (baseC < ACHROMATIC_THRESHOLD) {
		scaledC = 0;
	} else {
		const maxChromaAtBase = findMaxChroma(baseL, baseH);
		const maxChromaAtTarget = findMaxChroma(targetL, baseH);

		if (maxChromaAtBase < ACHROMATIC_THRESHOLD) {
			scaledC = 0;
		} else {
			scaledC = baseC * (maxChromaAtTarget / maxChromaAtBase);
			// Clamp to max displayable chroma at target lightness
			scaledC = Math.min(scaledC, maxChromaAtTarget);
		}
	}

	return formatOklch(targetL, scaledC, baseH, baseAlpha);
}

/**
 * Compute a gamut-aware OKLCH color at a relative lightness offset from the base color.
 * Positive offset = lighter (tint), negative offset = darker (shade).
 */
export function computeRelativeColor(
	baseL: number,
	baseC: number,
	baseH: number,
	baseAlpha: number,
	offset: number,
): string {
	const targetL = Math.max(0, Math.min(1, baseL + offset));
	return computeLightnessColor(baseL, baseC, baseH, baseAlpha, targetL);
}

/**
 * Format OKLCH components as a CSS oklch() string with consistent precision.
 */
export function formatOklch(
	l: number,
	c: number,
	h: number,
	alpha: number,
): string {
	const lStr = round(l, 4);
	const cStr = round(c, 4);
	const hStr = round(h, 2);
	const aStr = round(alpha, 4);

	return `oklch(${lStr} ${cStr} ${hStr} / ${aStr})`;
}

function round(value: number, decimals: number): string {
	return Number(value.toFixed(decimals)).toString();
}
