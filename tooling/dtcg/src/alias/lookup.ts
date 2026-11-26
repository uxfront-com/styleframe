import { isToken } from "../guards/token";
import type { DTCGAnyToken, DTCGDocument } from "../types/token";
import { splitPath } from "./path";

/**
 * Look up a token by its dot-notation path within a document. Returns
 * `undefined` if the path does not resolve to a token (or resolves to a
 * group / metadata field).
 */
export function lookupToken(
	doc: DTCGDocument,
	path: string,
): DTCGAnyToken | undefined {
	const segments = splitPath(path);
	if (segments.length === 0) {
		return undefined;
	}

	let cursor: unknown = doc;
	for (const segment of segments) {
		if (
			cursor === null ||
			typeof cursor !== "object" ||
			Array.isArray(cursor)
		) {
			return undefined;
		}
		cursor = (cursor as Record<string, unknown>)[segment];
	}
	return isToken(cursor) ? cursor : undefined;
}
