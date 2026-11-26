/**
 * Parse a DTCG `.tokens.json` document from a JSON string or already-parsed
 * value. The parser performs only structural validation:
 *
 *   - Input is a JSON object (not an array, primitive, or null).
 *   - Reserved keys (`$schema`, `$description`, `$extensions`) have the
 *     correct primitive types when present.
 *
 * Per-token shape validation is performed by `validate(...)` from the
 * `validate/` module. Parsing is deliberately permissive so a document with
 * a single bad token can still be partially inspected.
 */

import type { DTCGDocument } from "../types/token";
import { ParseError } from "./errors";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parse(input: string | unknown): DTCGDocument {
	let parsed: unknown;
	if (typeof input === "string") {
		try {
			parsed = JSON.parse(input);
		} catch (error) {
			throw new ParseError(
				`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	} else {
		parsed = input;
	}

	if (!isPlainObject(parsed)) {
		throw new ParseError("DTCG document root must be a JSON object");
	}

	if (parsed.$schema !== undefined && typeof parsed.$schema !== "string") {
		throw new ParseError("$schema must be a string", "$schema");
	}
	if (
		parsed.$description !== undefined &&
		typeof parsed.$description !== "string"
	) {
		throw new ParseError("$description must be a string", "$description");
	}
	if (parsed.$extensions !== undefined && !isPlainObject(parsed.$extensions)) {
		throw new ParseError("$extensions must be an object", "$extensions");
	}

	return parsed as DTCGDocument;
}
