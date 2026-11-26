import type { TokenValue } from "@styleframe/core";

import type { RangeInput } from "../utils/normalizeRange";

export type FontSizeValue = TokenValue | RangeInput<TokenValue>;

export const fontSizeStaticValues = {
	default: "@font-size.md",
	"3xs": "0.5rem",
	"2xs": "0.625rem",
	xs: "0.75rem",
	sm: "0.875rem",
	md: "1rem",
	lg: "1.125rem",
	xl: "1.25rem",
	"2xl": "1.5rem",
	"3xl": "1.875rem",
	"4xl": "2.25rem",
} as const;

export const fluidFontSizeBaseValues = {
	min: 16,
	max: 18,
} as const satisfies {
	min: number;
	max: number;
};

/**
 * Map from fluid font-size keys to their scale power. `null` is the special
 * `default` key, which references `@font-size.md` rather than a power.
 */
export const fluidScalePowerByKey = {
	default: null,
	"3xs": -4,
	"2xs": -3,
	xs: -2,
	sm: -1,
	md: 0,
	lg: 1,
	xl: 2,
	"2xl": 3,
	"3xl": 4,
	"4xl": 5,
} as const satisfies Record<string, number | null>;

export type FontSizeFluidKey = keyof typeof fluidScalePowerByKey;
export type FontSizeFluidDefaults = Record<FontSizeFluidKey, FontSizeValue>;
