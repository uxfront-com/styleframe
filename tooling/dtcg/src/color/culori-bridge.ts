/**
 * Convert between DTCG color objects and culori's internal color
 * representation. Internal helper — consumers should call `parse`,
 * `format`, and `convert` from the public API instead.
 */

import type { DTCGColor, DTCGColorComponents } from "../types/color";
import { COLOR_SPACES, culoriModeToColorSpace } from "./spaces";

interface CuloriColor {
	mode: string;
	alpha?: number;
	[component: string]: number | string | undefined;
}

/**
 * `none` keyword maps to culori's `undefined` (powerless component).
 */
function dtcgComponentToNumber(value: number | "none"): number | undefined {
	return value === "none" ? undefined : value;
}

function numberToDtcgComponent(value: number | undefined): number | "none" {
	return value === undefined || Number.isNaN(value) ? "none" : value;
}

/**
 * Convert a DTCG color to a culori-shaped object suitable for passing to
 * `culori.converter`, `formatHex`, etc.
 */
export function dtcgToCulori(color: DTCGColor): CuloriColor {
	const meta = COLOR_SPACES[color.colorSpace];
	const result: CuloriColor = { mode: meta.mode };

	for (let i = 0; i < 3; i++) {
		const dtcgValue = color.components[i];
		if (dtcgValue === undefined) {
			continue;
		}
		const numericValue = dtcgComponentToNumber(dtcgValue);
		if (numericValue !== undefined) {
			const scaled = numericValue / (meta.componentScales[i] ?? 1);
			result[meta.componentKeys[i] as string] = scaled;
		}
	}
	if (color.alpha !== undefined) {
		result.alpha = color.alpha;
	}
	return result;
}

/**
 * Convert a culori color back to a DTCG color. The resulting `colorSpace`
 * is inferred from the culori mode.
 */
export function culoriToDtcg(culori: CuloriColor): DTCGColor {
	const colorSpace = culoriModeToColorSpace(culori.mode);
	if (!colorSpace) {
		throw new Error(`Unsupported culori mode: ${culori.mode}`);
	}
	const meta = COLOR_SPACES[colorSpace];
	const components = meta.componentKeys.map((key, i) => {
		const raw = culori[key] as number | undefined;
		const scaled =
			raw === undefined ? undefined : raw * (meta.componentScales[i] ?? 1);
		return numberToDtcgComponent(scaled);
	}) as unknown as DTCGColorComponents;

	const out: DTCGColor = { colorSpace, components };
	if (culori.alpha !== undefined && culori.alpha !== 1) {
		out.alpha = culori.alpha;
	}
	return out;
}

/**
 * Quickly construct a culori color in a given mode without going through a
 * full DTCG color first — useful for tests and conversion plumbing.
 */
export function makeCuloriColor(
	mode: string,
	values: Record<string, number | undefined>,
): CuloriColor {
	return { mode, ...values };
}

export type { CuloriColor };
