/**
 * Parse a CSS color string into a spec-conformant DTCG color object.
 *
 * Supported inputs include any string culori can parse: `#rrggbb`,
 * `#rrggbbaa`, `rgb(...)`, `hsl(...)`, `hwb(...)`, `lab(...)`, `lch(...)`,
 * `oklab(...)`, `oklch(...)`, `color(display-p3 ...)`, named colors, etc.
 *
 * Returns `undefined` when the string cannot be parsed.
 */

import { parse as parseCss } from "culori";

import type { DTCGColor } from "../types/color";
import { culoriToDtcg } from "./culori-bridge";

export function parse(input: string): DTCGColor | undefined {
	const parsed = parseCss(input);
	if (!parsed) {
		return undefined;
	}
	try {
		return culoriToDtcg(parsed as unknown as Parameters<typeof culoriToDtcg>[0]);
	} catch {
		return undefined;
	}
}
