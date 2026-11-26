/**
 * DTCG font primitive types.
 * Format Module §6.3 (fontFamily) and §6.4 (fontWeight).
 */

/**
 * Font family is a single string or an ordered fallback array of strings.
 */
export type DTCGFontFamily = string | Array<string>;

/**
 * Numeric weights live in the 1–1000 range per CSS — the spec defers to
 * common 100-step keywords listed below for string forms.
 */
export type DTCGFontWeightKeyword =
	| "thin"
	| "hairline"
	| "extra-light"
	| "ultra-light"
	| "light"
	| "normal"
	| "regular"
	| "book"
	| "medium"
	| "semi-bold"
	| "demi-bold"
	| "bold"
	| "extra-bold"
	| "ultra-bold"
	| "black"
	| "heavy"
	| "extra-black"
	| "ultra-black";

export type DTCGFontWeight = number | DTCGFontWeightKeyword;
