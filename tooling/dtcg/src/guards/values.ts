/**
 * Per-value-type guards. Each guard inspects the runtime shape of a candidate
 * `$value`. They are intentionally structural (not nominal) so they work on
 * raw JSON parsed from disk.
 */

import type { DTCGColor, DTCGColorSpace } from "../types/color";
import type {
	DTCGBorder,
	DTCGGradient,
	DTCGGradientStop,
	DTCGShadow,
	DTCGShadowLayer,
	DTCGStrokeStyle,
	DTCGStrokeStyleObject,
	DTCGTransition,
	DTCGTypography,
} from "../types/composite";
import type { DTCGCubicBezier } from "../types/cubic-bezier";
import type { DTCGDimension } from "../types/dimension";
import type { DTCGDuration } from "../types/duration";
import type { DTCGFontFamily, DTCGFontWeight } from "../types/font";
import { isAlias } from "./alias";

const COLOR_SPACES: ReadonlySet<DTCGColorSpace> = new Set<DTCGColorSpace>([
	"srgb",
	"srgb-linear",
	"hsl",
	"hwb",
	"lab",
	"lch",
	"oklab",
	"oklch",
	"display-p3",
	"a98-rgb",
	"prophoto-rgb",
	"rec2020",
	"xyz-d50",
	"xyz-d65",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isComponent(value: unknown): boolean {
	return value === "none" || (typeof value === "number" && Number.isFinite(value));
}

export function isColorSpace(value: unknown): value is DTCGColorSpace {
	return typeof value === "string" && COLOR_SPACES.has(value as DTCGColorSpace);
}

export function isColorValue(value: unknown): value is DTCGColor {
	if (!isPlainObject(value)) {
		return false;
	}
	if (!isColorSpace(value.colorSpace)) {
		return false;
	}
	const components = value.components;
	if (!Array.isArray(components) || components.length !== 3) {
		return false;
	}
	if (!components.every(isComponent)) {
		return false;
	}
	if (value.alpha !== undefined) {
		if (typeof value.alpha !== "number" || value.alpha < 0 || value.alpha > 1) {
			return false;
		}
	}
	if (value.hex !== undefined && typeof value.hex !== "string") {
		return false;
	}
	return true;
}

export function isDimensionValue(value: unknown): value is DTCGDimension {
	return (
		isPlainObject(value) &&
		typeof value.value === "number" &&
		Number.isFinite(value.value) &&
		typeof value.unit === "string" &&
		value.unit.length > 0
	);
}

export function isDurationValue(value: unknown): value is DTCGDuration {
	return (
		isPlainObject(value) &&
		typeof value.value === "number" &&
		Number.isFinite(value.value) &&
		(value.unit === "ms" || value.unit === "s")
	);
}

export function isCubicBezierValue(value: unknown): value is DTCGCubicBezier {
	return (
		Array.isArray(value) &&
		value.length === 4 &&
		value.every((n) => typeof n === "number" && Number.isFinite(n))
	);
}

export function isFontFamilyValue(value: unknown): value is DTCGFontFamily {
	if (typeof value === "string") {
		return true;
	}
	return Array.isArray(value) && value.every((v) => typeof v === "string");
}

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

export function isFontWeightValue(value: unknown): value is DTCGFontWeight {
	if (typeof value === "number") {
		return Number.isFinite(value);
	}
	return typeof value === "string" && FONT_WEIGHT_KEYWORDS.has(value);
}

export function isNumberValue(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
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

export function isStrokeStyleObject(value: unknown): value is DTCGStrokeStyleObject {
	if (!isPlainObject(value)) {
		return false;
	}
	if (!Array.isArray(value.dashArray)) {
		return false;
	}
	if (!value.dashArray.every((d) => isAlias(d) || isDimensionValue(d))) {
		return false;
	}
	return value.lineCap === "round" || value.lineCap === "butt" || value.lineCap === "square";
}

export function isStrokeStyleValue(value: unknown): value is DTCGStrokeStyle {
	if (typeof value === "string" && STROKE_STYLE_KEYWORDS.has(value)) {
		return true;
	}
	return isStrokeStyleObject(value);
}

function isColorOrAlias(value: unknown): boolean {
	return isAlias(value) || isColorValue(value);
}

function isDimensionOrAlias(value: unknown): boolean {
	return isAlias(value) || isDimensionValue(value);
}

function isDurationOrAlias(value: unknown): boolean {
	return isAlias(value) || isDurationValue(value);
}

function isStrokeStyleOrAlias(value: unknown): boolean {
	return isAlias(value) || isStrokeStyleValue(value);
}

function isCubicBezierOrAlias(value: unknown): boolean {
	return isAlias(value) || isCubicBezierValue(value);
}

function isFontFamilyOrAlias(value: unknown): boolean {
	return isAlias(value) || isFontFamilyValue(value);
}

function isFontWeightOrAlias(value: unknown): boolean {
	return isAlias(value) || isFontWeightValue(value);
}

export function isBorderValue(value: unknown): value is DTCGBorder {
	return (
		isPlainObject(value) &&
		isColorOrAlias(value.color) &&
		isDimensionOrAlias(value.width) &&
		isStrokeStyleOrAlias(value.style)
	);
}

export function isTransitionValue(value: unknown): value is DTCGTransition {
	if (!isPlainObject(value)) {
		return false;
	}
	if (!isDurationOrAlias(value.duration)) {
		return false;
	}
	if (!isCubicBezierOrAlias(value.timingFunction)) {
		return false;
	}
	if (value.delay !== undefined && !isDurationOrAlias(value.delay)) {
		return false;
	}
	return true;
}

export function isShadowLayer(value: unknown): value is DTCGShadowLayer {
	if (!isPlainObject(value)) {
		return false;
	}
	if (!isColorOrAlias(value.color)) {
		return false;
	}
	if (!isDimensionOrAlias(value.offsetX)) {
		return false;
	}
	if (!isDimensionOrAlias(value.offsetY)) {
		return false;
	}
	if (value.blur !== undefined && !isDimensionOrAlias(value.blur)) {
		return false;
	}
	if (value.spread !== undefined && !isDimensionOrAlias(value.spread)) {
		return false;
	}
	if (value.inset !== undefined && typeof value.inset !== "boolean") {
		return false;
	}
	return true;
}

export function isShadowValue(value: unknown): value is DTCGShadow {
	if (Array.isArray(value)) {
		return value.length > 0 && value.every(isShadowLayer);
	}
	return isShadowLayer(value);
}

export function isGradientStop(value: unknown): value is DTCGGradientStop {
	if (!isPlainObject(value)) {
		return false;
	}
	if (!isColorOrAlias(value.color)) {
		return false;
	}
	if (value.position !== undefined) {
		if (!isAlias(value.position) && typeof value.position !== "number") {
			return false;
		}
	}
	return true;
}

export function isGradientValue(value: unknown): value is DTCGGradient {
	return Array.isArray(value) && value.length > 0 && value.every(isGradientStop);
}

export function isTypographyValue(value: unknown): value is DTCGTypography {
	if (!isPlainObject(value)) {
		return false;
	}
	if (!isFontFamilyOrAlias(value.fontFamily)) {
		return false;
	}
	if (!isDimensionOrAlias(value.fontSize)) {
		return false;
	}
	if (value.fontWeight !== undefined && !isFontWeightOrAlias(value.fontWeight)) {
		return false;
	}
	if (value.letterSpacing !== undefined && !isDimensionOrAlias(value.letterSpacing)) {
		return false;
	}
	if (value.lineHeight !== undefined) {
		const lh = value.lineHeight;
		if (!isAlias(lh) && typeof lh !== "number" && !isDimensionValue(lh)) {
			return false;
		}
	}
	return true;
}
