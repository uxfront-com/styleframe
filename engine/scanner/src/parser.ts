import type { ParsedUtility } from "./types";
import { ARBITRARY_VALUE_PATTERN, UTILITY_CLASS_PATTERN } from "./constants";

/**
 * Parse a utility class name into its components.
 *
 * The utility class format is: _[modifiers:]name[:value]
 *
 * Examples:
 * - "_margin:sm" → { name: "margin", value: "sm", modifiers: [] }
 * - "_hover:margin:sm" → { name: "margin", value: "sm", modifiers: ["hover"] }
 * - "_dark:hover:bg:primary" → { name: "bg", value: "primary", modifiers: ["dark", "hover"] }
 * - "_margin:[16px]" → { name: "margin", value: "[16px]", isArbitrary: true, arbitraryValue: "16px" }
 * - "_hidden" → { name: "hidden", value: "default", modifiers: [] }
 *
 * @param className The utility class name to parse
 * @returns Parsed utility object or null if invalid
 */
export function parseUtilityClass(className: string): ParsedUtility | null {
	// Must start with underscore
	if (!className.startsWith("_")) {
		return null;
	}

	// Remove the leading underscore
	const withoutPrefix = className.slice(1);

	if (!withoutPrefix) {
		return null;
	}

	// Split by colons, but handle arbitrary values which may contain colons
	const segments = splitByColons(withoutPrefix);

	if (segments.length === 0) {
		return null;
	}

	let name: string;
	let value: string;
	let modifiers: Array<string> = [];

	if (segments.length === 1) {
		// Single segment: just the name, value is "default"
		// e.g., "_hidden" → name: "hidden", value: "default"
		name = segments[0]!;
		value = "default";
	} else {
		// Multiple segments: [...modifiers, name, value]
		// e.g., "_hover:margin:sm" → modifiers: ["hover"], name: "margin", value: "sm"
		value = segments.at(-1)!;
		name = segments.at(-2)!;
		modifiers = segments.slice(0, -2);
	}

	// Check for arbitrary value syntax [value]
	let isArbitrary = false;
	let arbitraryValue: string | undefined;

	const arbitraryMatch = value.match(ARBITRARY_VALUE_PATTERN);
	if (arbitraryMatch) {
		isArbitrary = true;
		arbitraryValue = arbitraryMatch[1];
	}

	return {
		raw: className,
		name,
		value,
		modifiers,
		isArbitrary,
		arbitraryValue,
	};
}

/**
 * Split a string by colons while preserving arbitrary value brackets.
 *
 * Handles cases like "margin:[16px:20px]" where colons appear inside brackets.
 * Returns empty array if brackets are unbalanced.
 */
function splitByColons(str: string): Array<string> {
	const segments: Array<string> = [];
	let current = "";
	let bracketDepth = 0;

	for (const char of str) {
		if (char === "[") {
			bracketDepth++;
			current += char;
		} else if (char === "]") {
			bracketDepth--;
			current += char;
		} else if (char === ":" && bracketDepth === 0) {
			if (current) {
				segments.push(current);
			}
			current = "";
		} else {
			current += char;
		}
	}

	// Validate balanced brackets - return empty if unbalanced
	if (bracketDepth !== 0) {
		return [];
	}

	if (current) {
		segments.push(current);
	}

	return segments;
}

/**
 * Extract all utility class names from a content string.
 *
 * @param content The content to search
 * @param pattern Optional custom regex pattern (must use global flag). Defaults to UTILITY_CLASS_PATTERN.
 * @returns Array of unique utility class names found
 */
export function extractUtilityClasses(
	content: string,
	pattern?: RegExp,
): Array<string> {
	// String.match() with global regex handles state correctly
	const matches = content.match(pattern ?? UTILITY_CLASS_PATTERN);
	return matches ? [...new Set(matches)] : [];
}

/**
 * Generate a utility selector string from components.
 * This is the inverse of parseUtilityClass.
 *
 * @param name Utility name
 * @param value Utility value
 * @param modifiers Array of modifier names
 * @returns The utility class name (without CSS escaping)
 */
export function generateUtilityClassName(
	name: string,
	value: string,
	modifiers: Array<string> = [],
): string {
	const parts = [...modifiers, name];

	if (value !== "default") {
		parts.push(value);
	}

	return `_${parts.join(":")}`;
}
