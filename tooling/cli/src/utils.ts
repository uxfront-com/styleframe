import { access } from "node:fs/promises";
import { constants } from "node:fs";
import type { Diagnostic } from "@styleframe/core";

export async function fileExists(path: string) {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

/**
 * Parse a JSONC string (JSON with comments and trailing commas).
 * Handles single-line comments, multi-line comments, and trailing commas.
 */
export function parseJsonc(text: string): unknown {
	let result = "";
	let i = 0;
	let inString = false;

	while (i < text.length) {
		const char = text[i]!;
		const next = text[i + 1];

		if (inString) {
			if (char === "\\" && i + 1 < text.length) {
				result += char + next;
				i += 2;
				continue;
			}
			if (char === '"') {
				inString = false;
			}
			result += char;
			i++;
		} else {
			if (char === '"') {
				inString = true;
				result += char;
				i++;
			} else if (char === "/" && next === "/") {
				// Single-line comment: skip until end of line
				while (i < text.length && text[i] !== "\n") {
					i++;
				}
			} else if (char === "/" && next === "*") {
				// Multi-line comment: skip until */
				i += 2;
				while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) {
					i++;
				}
				i += 2;
			} else {
				result += char;
				i++;
			}
		}
	}

	// Remove trailing commas before } or ]
	result = result.replace(/,(\s*[}\]])/g, "$1");

	return JSON.parse(result);
}

/**
 * Format a diagnostic as one line: its code, where it was made, and the
 * message, which carries the did-you-mean.
 */
export function formatDiagnostic({ code, path, message }: Diagnostic): string {
	return `${code} ${path}: ${message}`;
}

export function pluralize(count: number, word: string): string {
	return `${count} ${count === 1 ? word : `${word}s`}`;
}
