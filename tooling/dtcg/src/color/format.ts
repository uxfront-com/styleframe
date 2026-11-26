/**
 * Serialize a DTCG color back to a CSS string. The output format is chosen
 * based on the colorSpace:
 *
 *   - sRGB without alpha (or alpha = 1) → 6-digit hex when components are
 *     in-gamut and the optional `hex` field is unset.
 *   - sRGB with alpha → 8-digit hex.
 *   - All other spaces → CSS `color(...)` / `lab(...)` / etc. via culori.
 *
 * If the input carries a precomputed `hex` field, it is preferred for sRGB
 * to preserve byte-exact round-tripping with tools that store both forms.
 */

import { formatCss, formatHex, formatHex8 } from "culori";
import type { DTCGColor } from "../types/color";
import { dtcgToCulori } from "./culori-bridge";

export function format(color: DTCGColor): string {
	if (color.colorSpace === "srgb" && color.hex) {
		return color.hex;
	}
	// culori's formatters accept any of the color-mode interfaces; cast through
	// `any` since our internal `CuloriColor` is structurally compatible but
	// not assignable to the union of every spec mode without a discriminator.
	const culori = dtcgToCulori(color) as unknown as Parameters<
		typeof formatCss
	>[0];
	if (color.colorSpace === "srgb") {
		const hex =
			color.alpha !== undefined && color.alpha < 1
				? formatHex8(culori)
				: formatHex(culori);
		if (hex) {
			return hex;
		}
	}
	const css = formatCss(culori);
	if (!css) {
		throw new Error(`Unable to format color: ${JSON.stringify(color)}`);
	}
	return css;
}
