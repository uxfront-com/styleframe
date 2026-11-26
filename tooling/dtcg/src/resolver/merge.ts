/**
 * Deep-merge two DTCG documents. Per the Resolver Module:
 *
 *   - When both sides have an object at the same key, recurse.
 *   - When both sides have a token (i.e. both have `$value`), the right
 *     side wins entirely (token-level replacement, not field-level).
 *   - Otherwise the right side overwrites the left.
 *
 * The result is a new object — neither input is mutated.
 */

import { isToken } from "../guards/token";
import type { DTCGDocument } from "../types/token";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeNodes(left: unknown, right: unknown): unknown {
	if (!isPlainObject(left) || !isPlainObject(right)) {
		return right;
	}
	if (isToken(left) || isToken(right)) {
		return right;
	}
	const out: Record<string, unknown> = { ...left };
	for (const [key, rightValue] of Object.entries(right)) {
		if (key in out) {
			out[key] = mergeNodes(out[key], rightValue);
		} else {
			out[key] = rightValue;
		}
	}
	return out;
}

export function mergeDocuments(left: DTCGDocument, right: DTCGDocument): DTCGDocument {
	return mergeNodes(left, right) as DTCGDocument;
}
