import { kebabCase, camelCase } from "scule";
import type { KebabCase, CamelCase } from "scule";

import { DEFAULT_INDENT } from "./constants";

export function addIndentToLine(line: string): string {
	return `${DEFAULT_INDENT}${line}`;
}

export function indentLines(lines: string): string {
	return lines
		.split("\n")
		.map((line) => addIndentToLine(line))
		.join("\n");
}

export function isUppercase(char: string): boolean {
	return char === char.toUpperCase();
}

export function toCamelCase<S extends string>(str: S): CamelCase<S> {
	return camelCase(str);
}

export function toKebabCase<S extends string>(str: S): KebabCase<S> {
	return kebabCase(str);
}
