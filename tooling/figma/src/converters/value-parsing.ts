import { parse, formatHex, formatHex8 } from "culori";
import type { FigmaRGBA, FigmaVariableType } from "../types";

/**
 * Convert a CSS color string to Figma RGBA format (0-1 range)
 * Supports: hex, rgb(), rgba(), hsl(), hsla(), named colors
 */
export function cssColorToFigma(value: string): FigmaRGBA | null {
	const parsed = parse(value);
	if (!parsed) {
		return null;
	}

	// culori returns values in 0-1 range for r, g, b
	// and alpha is also 0-1
	const rgb = parsed as { r?: number; g?: number; b?: number; alpha?: number };

	return {
		r: rgb.r ?? 0,
		g: rgb.g ?? 0,
		b: rgb.b ?? 0,
		a: rgb.alpha ?? 1,
	};
}

/**
 * Convert Figma RGBA format (0-1 range) to CSS hex color
 */
export function figmaColorToCss(rgba: FigmaRGBA): string {
	const color = {
		mode: "rgb" as const,
		r: rgba.r,
		g: rgba.g,
		b: rgba.b,
		alpha: rgba.a ?? 1,
	};

	// Use hex8 if alpha is not 1, otherwise use hex
	if (rgba.a !== undefined && rgba.a < 1) {
		return formatHex8(color) ?? "#000000";
	}
	return formatHex(color) ?? "#000000";
}

/**
 * Parse a CSS dimension value (e.g., "16px", "1rem", "1.5em")
 */
export interface ParsedDimension {
	value: number;
	unit: string;
}

export function parseDimension(value: string): ParsedDimension | null {
	const match = value.match(/^(-?\d*\.?\d+)(px|rem|em|%|vh|vw|vmin|vmax|ch)?$/);
	if (!match) {
		return null;
	}

	return {
		value: Number.parseFloat(match[1] ?? "0"),
		unit: match[2] ?? "",
	};
}

/**
 * Convert a CSS dimension to a pixel number
 */
export function dimensionToPixels(
	value: string,
	baseFontSize: number = 16,
): number | null {
	const parsed = parseDimension(value);
	if (!parsed) {
		return null;
	}

	switch (parsed.unit) {
		case "px":
		case "":
			return parsed.value;
		case "rem":
		case "em":
			return parsed.value * baseFontSize;
		case "%":
			return parsed.value; // Keep percentage as-is for Figma
		default:
			return null; // Unsupported units (vh, vw, etc.)
	}
}

/**
 * Convert a pixel value to a CSS dimension
 */
export function pixelsToDimension(
	pixels: number,
	unit: string = "px",
	baseFontSize: number = 16,
): string {
	switch (unit) {
		case "rem":
			return `${pixels / baseFontSize}rem`;
		case "em":
			return `${pixels / baseFontSize}em`;
		case "%":
			return `${pixels}%`;
		case "px":
		default:
			return `${pixels}px`;
	}
}

/**
 * Detect if a string value is a color
 */
export function isColorValue(value: string): boolean {
	// Check for common color formats
	if (value.startsWith("#")) {
		return true;
	}
	if (value.startsWith("rgb")) {
		return true;
	}
	if (value.startsWith("hsl")) {
		return true;
	}
	if (value.startsWith("oklch")) {
		return true;
	}
	if (value.startsWith("oklab")) {
		return true;
	}
	if (value.startsWith("lch")) {
		return true;
	}
	if (value.startsWith("lab")) {
		return true;
	}

	// Try to parse with culori
	const parsed = parse(value);
	return parsed !== undefined;
}

/**
 * Detect if a string value is a dimension
 */
export function isDimensionValue(value: string): boolean {
	return parseDimension(value) !== null;
}

/**
 * Detect the Figma variable type from a Styleframe value
 */
export function detectFigmaType(value: unknown): FigmaVariableType {
	if (typeof value === "boolean") {
		return "BOOLEAN";
	}
	if (typeof value === "number") {
		return "FLOAT";
	}
	if (typeof value === "string") {
		if (isColorValue(value)) {
			return "COLOR";
		}
		if (isDimensionValue(value)) {
			return "FLOAT";
		}
		return "STRING";
	}
	return "STRING";
}

/**
 * Convert a Styleframe token value to a Figma-compatible value
 */
export function styleframeValueToFigma(
	value: unknown,
	type: FigmaVariableType,
	baseFontSize: number = 16,
): FigmaRGBA | number | string | boolean | null {
	if (typeof value === "boolean") {
		return value;
	}
	if (typeof value === "number") {
		return value;
	}
	if (typeof value !== "string") {
		return null;
	}

	switch (type) {
		case "COLOR": {
			return cssColorToFigma(value);
		}
		case "FLOAT": {
			const pixels = dimensionToPixels(value, baseFontSize);
			return pixels;
		}
		case "BOOLEAN": {
			return value === "true";
		}
		case "STRING":
		default: {
			return value;
		}
	}
}

/**
 * Convert a Figma variable value to a Styleframe-compatible CSS value
 */
export function figmaValueToStyleframe(
	value: FigmaRGBA | number | string | boolean,
	type: FigmaVariableType,
	useRem: boolean = false,
	baseFontSize: number = 16,
): string | number | boolean {
	switch (type) {
		case "COLOR": {
			if (typeof value === "object" && "r" in value) {
				return figmaColorToCss(value as FigmaRGBA);
			}
			return String(value);
		}
		case "FLOAT": {
			if (typeof value === "number") {
				if (useRem) {
					return `${value / baseFontSize}rem`;
				}
				return `${value}px`;
			}
			return typeof value === "string" ? value : String(value);
		}
		case "BOOLEAN": {
			return Boolean(value);
		}
		case "STRING":
		default: {
			return String(value);
		}
	}
}
