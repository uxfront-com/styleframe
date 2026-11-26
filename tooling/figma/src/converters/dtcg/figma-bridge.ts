/**
 * Figma-specific helpers for converting between spec-conformant DTCG values
 * and Figma's flatter variable model. Figma's `Variable` API only supports
 * COLOR, FLOAT, STRING, and BOOLEAN — DTCG primitives map to a subset of
 * those, and DTCG composites have no Figma equivalent (we emit them only
 * on export, never import them as variables).
 */

import {
	classifyValue,
	color as dtcgColor,
	dimension as dtcgDimension,
	duration as dtcgDuration,
	isAlias,
} from "@styleframe/dtcg";
import type {
	Classification,
	DTCGAlias,
	DTCGColor,
	DTCGDimension,
	DTCGDuration,
	DTCGTokenType,
} from "@styleframe/dtcg";

import type { FigmaExportVariable, FigmaRGBA, FigmaVariableType } from "../../types";

/**
 * Map a DTCG `$type` to the closest Figma variable type. Composite types
 * have no native Figma equivalent and resolve to `STRING` (serialised JSON).
 */
export function dtcgTypeToFigma(dtcgType: DTCGTokenType | undefined): FigmaVariableType {
	switch (dtcgType) {
		case "color":
			return "COLOR";
		case "dimension":
		case "duration":
		case "number":
		case "fontWeight":
			return "FLOAT";
		case "fontFamily":
		case "cubicBezier":
		case "border":
		case "strokeStyle":
		case "transition":
		case "shadow":
		case "gradient":
		case "typography":
			return "STRING";
		default:
			return "STRING";
	}
}

/**
 * Map a Figma variable type to a DTCG `$type` based on its raw shape alone.
 * Returns `undefined` for STRING and BOOLEAN — neither maps unambiguously
 * to a single DTCG type. Use `classifyFigmaVariable` instead when the
 * variable's name is available, since it disambiguates via path heuristics
 * (e.g. `duration/fast` → duration, `font-family/body` → fontFamily).
 */
export function figmaTypeToDtcg(figmaType: FigmaVariableType): DTCGTokenType | undefined {
	switch (figmaType) {
		case "COLOR":
			return "color";
		case "FLOAT":
			return "dimension";
		case "STRING":
		case "BOOLEAN":
			return undefined;
	}
}

/**
 * Classify a Figma variable into its DTCG `{type, value}` pair, using the
 * variable name as a path hint. This is the preferred entry point for
 * `Figma → DTCG` because it handles the cases `figmaTypeToDtcg` cannot:
 *
 *   - FLOAT under `duration/*` → duration
 *   - FLOAT under `font-weight/*` → fontWeight
 *   - STRING under `easing/*` with a known easing keyword → cubicBezier
 *   - STRING under `font-family/*` → fontFamily
 *   - STRING with a `cubic-bezier(...)` literal → cubicBezier
 *   - STRING with a strokeStyle keyword → strokeStyle
 *
 * Returns `undefined` when no DTCG type can be inferred (caller should
 * either skip the variable or attach a `dev.styleframe.unknownType`
 * extension).
 */
export function classifyFigmaVariable(
	variable: FigmaExportVariable,
	modeValue: unknown,
): Classification | undefined {
	if (isAlias(modeValue)) {
		return undefined;
	}
	// Convert Figma RGBA to canonical DTCG color first so the classifier
	// recognises it as a color.
	const normalised = isFigmaRgbaShape(modeValue) ? figmaRgbaToDtcgColor(modeValue) : modeValue;
	const classification = classifyValue(normalised, {
		path: figmaPathToDtcg(variable.name),
	});
	// Figma FLOATs are intrinsically pixel-based — no path hint can pull a
	// raw `42` into the right type. When the classifier defaults to `number`
	// for a FLOAT variable, promote to a px dimension since that's the
	// dominant case in design systems.
	if (
		variable.type === "FLOAT" &&
		classification?.type === "number" &&
		typeof classification.value === "number"
	) {
		return {
			type: "dimension",
			value: floatToDtcgDimension(classification.value),
		};
	}
	return classification;
}

function isFigmaRgbaShape(value: unknown): value is FigmaRGBA {
	return (
		typeof value === "object" &&
		value !== null &&
		"r" in (value as object) &&
		"g" in (value as object) &&
		"b" in (value as object)
	);
}

/**
 * Convert a DTCG color into Figma's `{r, g, b, a}` shape. Always emits
 * sRGB — wider-gamut colors are converted via `dtcgColor.convert`.
 */
export function dtcgColorToFigmaRgba(color: DTCGColor): FigmaRGBA {
	const srgb = color.colorSpace === "srgb" ? color : dtcgColor.convert(color, "srgb");
	const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
	const [r, g, b] = srgb.components.map((c: number | "none") => (c === "none" ? 0 : clamp01(c)));
	return {
		r: r as number,
		g: g as number,
		b: b as number,
		a: srgb.alpha ?? 1,
	};
}

/**
 * Convert Figma's `{r, g, b, a}` shape into a spec-conformant sRGB
 * DTCG color. The optional `hex` field is precomputed for tools that
 * cannot consume the object form.
 */
export function figmaRgbaToDtcgColor(rgba: FigmaRGBA): DTCGColor {
	const color: DTCGColor = {
		colorSpace: "srgb",
		components: [rgba.r, rgba.g, rgba.b],
	};
	if (rgba.a !== undefined && rgba.a < 1) {
		color.alpha = rgba.a;
	}
	color.hex = dtcgColor.format(color);
	return color;
}

/**
 * Convert a DTCG dimension to a Figma FLOAT (always pixels). Non-px units
 * are normalised: `rem`/`em` use a 16px base, `%` is passed through as-is.
 * Viewport-relative units (vw, vh, dvw, svw, etc.) have no pixel equivalent
 * and return `undefined` — callers should skip the token rather than crash.
 */
export function dtcgDimensionToFloat(dim: DTCGDimension, baseFontSize = 16): number | undefined {
	switch (dim.unit) {
		case "px":
			return dim.value;
		case "rem":
		case "em":
			return dim.value * baseFontSize;
		case "%":
			return dim.value;
		default:
			return undefined;
	}
}

/**
 * Wrap a Figma FLOAT in a spec-conformant DTCG dimension object. Always
 * uses `px` since Figma's variables are pixel-based.
 */
export function floatToDtcgDimension(value: number, unit = "px"): DTCGDimension {
	return { value, unit };
}

/**
 * Convert a DTCG duration to a Figma FLOAT (always milliseconds).
 */
export function dtcgDurationToFloat(dur: DTCGDuration): number {
	return dur.unit === "s" ? dur.value * 1000 : dur.value;
}

/**
 * Wrap a Figma FLOAT in a DTCG duration object (always milliseconds).
 */
export function floatToDtcgDuration(value: number): DTCGDuration {
	return { value, unit: "ms" };
}

/**
 * Convert a DTCG dot-notation path to Figma's slash-notation.
 *
 * @example dtcgPathToFigma("color.primary") // "color/primary"
 */
export function dtcgPathToFigma(path: string): string {
	return path.replaceAll(".", "/");
}

/**
 * Convert a Figma slash-notation path to DTCG dot-notation.
 *
 * @example figmaPathToDtcg("color/primary") // "color.primary"
 */
export function figmaPathToDtcg(path: string): string {
	return path.replaceAll("/", ".");
}

/**
 * Discriminated result of converting a DTCG `$value` for Figma:
 *
 *   - `value` — a concrete Figma value of the requested `figmaType`.
 *   - `alias` — a Figma `{ type: "VARIABLE_ALIAS", id }` reference.
 *   - `fallback` — the value cannot be represented as the requested
 *     `figmaType` (typically a dimension with an unsupported unit like
 *     `vw`/`vh` or a composite without a Figma equivalent). Carries the
 *     original CSS as a STRING so the caller can downgrade the variable
 *     to STRING and preserve the source value rather than dropping it.
 */
export type DtcgFigmaConversion =
	| {
			kind: "value";
			figmaType: FigmaVariableType;
			value: FigmaRGBA | number | string;
	  }
	| { kind: "alias"; id: string }
	| { kind: "fallback"; figmaType: "STRING"; value: string };

/**
 * Convert a single DTCG `$value` to a Figma value. Aliases produce the
 * `alias` variant. Concrete values are converted per type; if conversion
 * to the requested `figmaType` is impossible we emit a `fallback` STRING
 * carrying the original CSS literal (never `undefined`) so the caller
 * never silently drops a token.
 */
export function dtcgValueToFigma(
	value: unknown,
	figmaType: FigmaVariableType,
): DtcgFigmaConversion {
	if (isAlias(value)) {
		const aliasPath = (value as DTCGAlias).slice(1, -1).replace(/\.\$root$/, "");
		return {
			kind: "alias",
			id: dtcgPathToFigma(aliasPath),
		};
	}

	switch (figmaType) {
		case "COLOR":
			if (typeof value === "object" && value !== null && "colorSpace" in value) {
				return {
					kind: "value",
					figmaType: "COLOR",
					value: dtcgColorToFigmaRgba(value as DTCGColor),
				};
			}
			// Unrecognised color shape — preserve verbatim as a STRING so a
			// downstream import can still see the original CSS.
			return { kind: "fallback", figmaType: "STRING", value: stringify(value) };

		case "FLOAT":
			if (typeof value === "number" && Number.isFinite(value)) {
				return { kind: "value", figmaType: "FLOAT", value };
			}
			if (isDimensionObject(value)) {
				if (value.unit === "ms" || value.unit === "s") {
					return {
						kind: "value",
						figmaType: "FLOAT",
						value: dtcgDurationToFloat(value as DTCGDuration),
					};
				}
				const px = dtcgDimensionToFloat(value as DTCGDimension);
				if (px !== undefined) {
					return { kind: "value", figmaType: "FLOAT", value: px };
				}
				// Unsupported unit (vw, vh, ch, …) — keep the original
				// CSS literal so the variable still exists in Figma as a STRING.
				return {
					kind: "fallback",
					figmaType: "STRING",
					value: dtcgDimensionFormat(value as DTCGDimension),
				};
			}
			return { kind: "fallback", figmaType: "STRING", value: stringify(value) };

		case "STRING":
			return {
				kind: "value",
				figmaType: "STRING",
				value: typeof value === "string" ? value : stringify(value),
			};

		case "BOOLEAN":
			if (typeof value === "boolean") {
				// Currently unused by the importer (variables created here are
				// always non-boolean), but kept for symmetry — emit as STRING
				// fallback so the caller can decide.
				return {
					kind: "fallback",
					figmaType: "STRING",
					value: String(value),
				};
			}
			return { kind: "fallback", figmaType: "STRING", value: stringify(value) };
	}
}

function isDimensionObject(value: unknown): value is { value: number; unit: string } {
	return (
		typeof value === "object" &&
		value !== null &&
		"value" in value &&
		"unit" in value &&
		typeof (value as { value: unknown }).value === "number" &&
		typeof (value as { unit: unknown }).unit === "string"
	);
}

function stringify(value: unknown): string {
	if (typeof value === "string") {
		return value;
	}
	if (value === null || value === undefined) {
		return "";
	}
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

const dtcgDimensionFormat = dtcgDimension.format;

/**
 * Re-exports for callers that want the raw helpers without going through
 * @styleframe/dtcg directly.
 */
export { dtcgColor, dtcgDimension, dtcgDuration };
