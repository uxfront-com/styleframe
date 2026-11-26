/**
 * Parse a `.resolver.json` document. Performs only structural validation —
 * full semantic validation is in `validate/resolver.ts`.
 */

import { ParseError } from "../parse/errors";
import type { DTCGResolverDocument } from "../types/resolver";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseResolver(input: string | unknown): DTCGResolverDocument {
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
		throw new ParseError("Resolver document root must be a JSON object");
	}
	if (!Array.isArray((parsed as Record<string, unknown>).resolutionOrder)) {
		throw new ParseError(
			"Resolver document must define a resolutionOrder array",
			"resolutionOrder",
		);
	}
	return parsed as unknown as DTCGResolverDocument;
}
