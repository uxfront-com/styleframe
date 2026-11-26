/**
 * Definitions of every spec colorSpace, including its mapping to culori's
 * internal mode names and the per-component scaling that converts between
 * culori's normalised storage and the DTCG spec's authored ranges.
 */

import type { DTCGColorSpace } from "../types/color";

/**
 * culori's internal mode identifier corresponding to a DTCG colorSpace.
 */
export type CuloriMode =
	| "rgb"
	| "lrgb"
	| "hsl"
	| "hwb"
	| "lab"
	| "lch"
	| "oklab"
	| "oklch"
	| "p3"
	| "a98"
	| "prophoto"
	| "rec2020"
	| "xyz50"
	| "xyz65";

/**
 * Per-color-space metadata: which culori mode it maps to, the property
 * names culori uses for each of its three components (in DTCG order), and
 * a scale factor applied when converting culori → DTCG (DTCG → culori is
 * the inverse).
 *
 * Scale `1` means culori's stored value equals the DTCG component.
 * Scale `100` means the DTCG component is `culoriValue * 100` (used for
 * percentage components in HSL/HWB which culori normalises to 0–1).
 */
export interface DTCGColorSpaceMeta {
	mode: CuloriMode;
	componentKeys: readonly [string, string, string];
	componentScales: readonly [number, number, number];
}

const RGB_LIKE = (mode: CuloriMode): DTCGColorSpaceMeta => ({
	mode,
	componentKeys: ["r", "g", "b"],
	componentScales: [1, 1, 1],
});

const XYZ_LIKE = (mode: CuloriMode): DTCGColorSpaceMeta => ({
	mode,
	componentKeys: ["x", "y", "z"],
	componentScales: [1, 1, 1],
});

export const COLOR_SPACES: Readonly<Record<DTCGColorSpace, DTCGColorSpaceMeta>> = {
	srgb: RGB_LIKE("rgb"),
	"srgb-linear": RGB_LIKE("lrgb"),
	"display-p3": RGB_LIKE("p3"),
	"a98-rgb": RGB_LIKE("a98"),
	"prophoto-rgb": RGB_LIKE("prophoto"),
	rec2020: RGB_LIKE("rec2020"),
	hsl: {
		mode: "hsl",
		componentKeys: ["h", "s", "l"],
		componentScales: [1, 100, 100],
	},
	hwb: {
		mode: "hwb",
		componentKeys: ["h", "w", "b"],
		componentScales: [1, 100, 100],
	},
	lab: {
		mode: "lab",
		componentKeys: ["l", "a", "b"],
		componentScales: [1, 1, 1],
	},
	lch: {
		mode: "lch",
		componentKeys: ["l", "c", "h"],
		componentScales: [1, 1, 1],
	},
	oklab: {
		mode: "oklab",
		componentKeys: ["l", "a", "b"],
		componentScales: [1, 1, 1],
	},
	oklch: {
		mode: "oklch",
		componentKeys: ["l", "c", "h"],
		componentScales: [1, 1, 1],
	},
	"xyz-d50": XYZ_LIKE("xyz50"),
	"xyz-d65": XYZ_LIKE("xyz65"),
};

const REVERSE_MODE_MAP: Record<CuloriMode, DTCGColorSpace> = {
	rgb: "srgb",
	lrgb: "srgb-linear",
	hsl: "hsl",
	hwb: "hwb",
	lab: "lab",
	lch: "lch",
	oklab: "oklab",
	oklch: "oklch",
	p3: "display-p3",
	a98: "a98-rgb",
	prophoto: "prophoto-rgb",
	rec2020: "rec2020",
	xyz50: "xyz-d50",
	xyz65: "xyz-d65",
};

export function culoriModeToColorSpace(mode: string): DTCGColorSpace | undefined {
	return REVERSE_MODE_MAP[mode as CuloriMode];
}
