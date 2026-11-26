/**
 * Convert a DTCG color from one colorSpace to another. Backed by culori's
 * `converter` — out-of-gamut values are NOT clamped (use the optional
 * `clamp` flag if needed).
 */

import { converter, toGamut } from "culori";

import type { DTCGColor, DTCGColorSpace } from "../types/color";
import { culoriToDtcg, dtcgToCulori } from "./culori-bridge";
import { COLOR_SPACES } from "./spaces";

export interface ConvertOptions {
	/** Apply gamut-mapping for the target colorSpace. Defaults to `false`. */
	clamp?: boolean;
}

export function convert(
	color: DTCGColor,
	target: DTCGColorSpace,
	options: ConvertOptions = {},
): DTCGColor {
	if (color.colorSpace === target) {
		return color;
	}
	const meta = COLOR_SPACES[target];
	const convertFn = converter(meta.mode);
	let converted = convertFn(dtcgToCulori(color) as unknown as Parameters<typeof convertFn>[0]);
	if (options.clamp) {
		const gamutFn = toGamut(meta.mode, meta.mode);
		converted = gamutFn(converted as unknown as Parameters<typeof gamutFn>[0]);
	}
	return culoriToDtcg(converted as unknown as Parameters<typeof culoriToDtcg>[0]);
}
