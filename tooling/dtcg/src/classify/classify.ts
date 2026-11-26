/**
 * Classify a raw value into a `{type, value}` pair using the DTCG type system.
 *
 * Strategy:
 *   1. Already-canonical objects (DTCGColor / DTCGDimension / etc.) are
 *      detected by their structural shape and pass through.
 *   2. Strings are run through value detectors (color, cubic-bezier,
 *      duration, dimension, stroke-style, font-weight) in order.
 *   3. When value detection is ambiguous or returns nothing, the optional
 *      `path` hint is consulted as a tiebreaker (e.g. a numeric `200`
 *      under `duration/fast` is a duration in milliseconds).
 *   4. Aliases are returned as `undefined` — callers must stamp the type
 *      from the alias target's classification.
 *
 * Returns `undefined` when no DTCG type can be inferred (caller should
 * either skip or attach a `dev.styleframe.unknownType` extension).
 */

import { isAlias } from "../guards/alias";
import {
	isBorderValue,
	isColorValue,
	isCubicBezierValue,
	isDimensionValue,
	isDurationValue,
	isGradientValue,
	isShadowValue,
	isTransitionValue,
	isTypographyValue,
} from "../guards/values";
import { parse as parseColor } from "../color/parse";
import { parse as parseDimension } from "../dimension/parse";
import { parse as parseDuration } from "../duration/parse";
import type { DTCGTokenType, DTCGTokenValue } from "../types/values";
import { CUBIC_BEZIER_PATTERN, parseCubicBezier } from "./cubic-bezier";
import { easingKeywordToBezier } from "./easing";

export interface ClassifyOptions {
	/**
	 * Dot-notation path to the token. Used as a tiebreaker when value
	 * detection alone is ambiguous (e.g. `200` could be a `number`,
	 * `duration`, or `fontWeight`).
	 */
	path?: string;
}

export interface Classification {
	type: DTCGTokenType;
	value: DTCGTokenValue;
}

const STROKE_STYLE_KEYWORDS: ReadonlySet<string> = new Set([
	"solid",
	"dashed",
	"dotted",
	"double",
	"groove",
	"ridge",
	"outset",
	"inset",
]);

const FONT_WEIGHT_KEYWORDS: ReadonlySet<string> = new Set([
	"thin",
	"hairline",
	"extra-light",
	"ultra-light",
	"light",
	"normal",
	"regular",
	"book",
	"medium",
	"semi-bold",
	"demi-bold",
	"bold",
	"extra-bold",
	"ultra-bold",
	"black",
	"heavy",
	"extra-black",
	"ultra-black",
]);

/**
 * Normalise dot- and slash-notation paths to a single dot-notation form
 * lowercased. We accept both because the CLI uses dot-notation while the
 * Figma plugin emits slash-notation.
 */
function normalisePath(path: string | undefined): string {
	return (path ?? "").toLowerCase().replaceAll("/", ".");
}

function pathHasSegment(path: string | undefined, segment: string): boolean {
	const l = normalisePath(path);
	if (l.length === 0) {
		return false;
	}
	return (
		l === segment ||
		l.startsWith(`${segment}.`) ||
		l.includes(`.${segment}.`) ||
		l.endsWith(`.${segment}`)
	);
}

function pathContains(path: string | undefined, needle: string): boolean {
	return normalisePath(path).includes(needle);
}

function numericPathType(path: string | undefined): DTCGTokenType | undefined {
	if (!path) {
		return undefined;
	}
	if (pathHasSegment(path, "duration")) {
		return "duration";
	}
	if (pathContains(path, "font-weight") || pathContains(path, "fontweight")) {
		return "fontWeight";
	}
	if (
		pathContains(path, "line-height") ||
		pathContains(path, "opacity") ||
		pathContains(path, "z-index") ||
		pathContains(path, "scale")
	) {
		return "number";
	}
	return undefined;
}

function classifyStringByPath(
	value: string,
	path: string | undefined,
): Classification | undefined {
	if (!path) {
		return undefined;
	}
	if (pathContains(path, "font-family") || pathContains(path, "fontfamily")) {
		return { type: "fontFamily", value };
	}
	if (pathContains(path, "easing")) {
		const bezier = easingKeywordToBezier(value);
		if (bezier) {
			return {
				type: "cubicBezier",
				value: bezier as unknown as DTCGTokenValue,
			};
		}
	}
	if (
		pathContains(path, "border-style") ||
		pathContains(path, "outline-style")
	) {
		if (STROKE_STYLE_KEYWORDS.has(value)) {
			return { type: "strokeStyle", value };
		}
	}
	return undefined;
}

export function classifyValue(
	raw: unknown,
	options: ClassifyOptions = {},
): Classification | undefined {
	if (raw === null || raw === undefined) {
		return undefined;
	}

	// Aliases carry no inherent type — caller must stamp from target.
	if (isAlias(raw)) {
		return undefined;
	}

	// Canonical-shape objects come first so we don't re-parse them.
	if (isColorValue(raw)) {
		return { type: "color", value: raw };
	}
	if (isDimensionValue(raw)) {
		return { type: "dimension", value: raw };
	}
	if (isDurationValue(raw)) {
		return { type: "duration", value: raw };
	}
	if (isCubicBezierValue(raw)) {
		return { type: "cubicBezier", value: raw as unknown as DTCGTokenValue };
	}
	if (isShadowValue(raw)) {
		return { type: "shadow", value: raw };
	}
	if (isGradientValue(raw)) {
		return { type: "gradient", value: raw };
	}
	if (isBorderValue(raw)) {
		return { type: "border", value: raw };
	}
	if (isTransitionValue(raw)) {
		return { type: "transition", value: raw };
	}
	if (isTypographyValue(raw)) {
		return { type: "typography", value: raw };
	}

	if (typeof raw === "number" && Number.isFinite(raw)) {
		return { type: numericPathType(options.path) ?? "number", value: raw };
	}

	if (typeof raw === "string") {
		// Empty string → cannot classify
		if (raw.length === 0) {
			return undefined;
		}

		// Path hint can override value detection in narrow, well-defined cases:
		// a numeric font-weight string like "700" under font-weight/* should be
		// fontWeight, not dimension.
		const pathHint = options.path;
		if (pathHint && pathContains(pathHint, "font-weight")) {
			const num = Number(raw);
			if (Number.isFinite(num)) {
				return { type: "fontWeight", value: num };
			}
			if (FONT_WEIGHT_KEYWORDS.has(raw)) {
				return { type: "fontWeight", value: raw };
			}
		}

		// Only forward to culori strings that structurally resemble a CSS color:
		// hex (#…), function notation (rgb(…), oklch(…), …), or an alphabetic
		// named color keyword. Plain numerics like "100" would be misinterpreted
		// by culori as 3-digit shorthand hex (#100 = a dark red).
		const colorParsed =
			raw[0] === "#" || raw.includes("(") || /^[a-zA-Z]/.test(raw)
				? parseColor(raw)
				: undefined;
		if (colorParsed) {
			return { type: "color", value: colorParsed };
		}

		if (CUBIC_BEZIER_PATTERN.test(raw)) {
			const bezier = parseCubicBezier(raw);
			if (bezier) {
				return {
					type: "cubicBezier",
					value: bezier as unknown as DTCGTokenValue,
				};
			}
		}

		const duration = parseDuration(raw);
		if (duration) {
			return { type: "duration", value: duration };
		}

		// Dimension is matched after duration so "200ms" doesn't fall through
		// to dimension matching (the dimension regex would also accept it).
		const dimension = parseDimension(raw);
		if (dimension) {
			return { type: "dimension", value: dimension };
		}

		// Keyword classification is path-conditional: many CSS keywords are
		// valid in multiple contexts (`"normal"` works for font-weight,
		// letter-spacing, font-style, line-height; `"thin"`/`"medium"`/
		// `"thick"` are font-weight names AND CSS border-width shorthand
		// keywords). Without path agreement, classifying by value alone
		// produces false positives. We allow no-path callers to keep the
		// keyword-based behaviour for back-compat.
		if (STROKE_STYLE_KEYWORDS.has(raw) && hasStrokeStylePath(pathHint)) {
			return { type: "strokeStyle", value: raw };
		}

		if (FONT_WEIGHT_KEYWORDS.has(raw) && hasFontWeightPath(pathHint)) {
			return { type: "fontWeight", value: raw };
		}

		return classifyStringByPath(raw, pathHint);
	}

	// Booleans, arrays, objects we don't recognise — caller's problem.
	return undefined;
}

function hasStrokeStylePath(path: string | undefined): boolean {
	if (path === undefined) {
		return true;
	} // back-compat: pure-value detection
	if (isLikelyFontFamily(path)) {
		return false;
	}
	return (
		pathContains(path, "border-style") ||
		pathContains(path, "outline-style") ||
		pathContains(path, "stroke")
	);
}

function hasFontWeightPath(path: string | undefined): boolean {
	if (path === undefined) {
		return true;
	} // back-compat: pure-value detection
	return pathContains(path, "font-weight") || pathContains(path, "fontweight");
}

function isLikelyFontFamily(path: string | undefined): boolean {
	return pathContains(path, "font-family") || pathContains(path, "fontfamily");
}
