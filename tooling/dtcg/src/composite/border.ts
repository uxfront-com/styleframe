/**
 * Border composite parsing and serialization.
 *
 * Inputs may be the canonical object form already, or an array of
 * `[width, style, color]` style values. Output is always the canonical
 * object form.
 */

import { isAlias } from "../guards/alias";
import {
	isColorValue,
	isDimensionValue,
	isStrokeStyleValue,
} from "../guards/values";
import type { DTCGBorder } from "../types/composite";

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parse(value: unknown): DTCGBorder | undefined {
	if (!isObject(value)) {
		return undefined;
	}
	const color = value.color;
	const width = value.width;
	const style = value.style;
	if (!isAlias(color) && !isColorValue(color)) {
		return undefined;
	}
	if (!isAlias(width) && !isDimensionValue(width)) {
		return undefined;
	}
	if (!isAlias(style) && !isStrokeStyleValue(style)) {
		return undefined;
	}
	return value as unknown as DTCGBorder;
}

export function format(border: DTCGBorder): string {
	return JSON.stringify(border);
}
