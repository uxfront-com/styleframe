/**
 * Iterate every token in a DTCG document with its dot-notation path. Groups
 * are visited but not yielded — only leaf tokens are yielded.
 */

import { appendPath } from "../alias/path";
import { isToken } from "../guards/token";
import type { DTCGAnyToken, DTCGDocument } from "../types/token";

export interface WalkEntry {
	path: string;
	token: DTCGAnyToken;
}

export function* walk(doc: DTCGDocument): Generator<WalkEntry> {
	yield* walkNode(doc as unknown as Record<string, unknown>, "");
}

function* walkNode(node: Record<string, unknown>, currentPath: string): Generator<WalkEntry> {
	if (isToken(node)) {
		yield { path: currentPath, token: node };
		return;
	}
	// `$root` is the spec's reserved name for a token that lives alongside
	// sibling tokens inside a group. Yield it at the parent's path so
	// consumers see the parent variable as if it were a leaf.
	const rootToken = node.$root;
	if (
		rootToken !== undefined &&
		typeof rootToken === "object" &&
		rootToken !== null &&
		!Array.isArray(rootToken) &&
		"$value" in (rootToken as object)
	) {
		yield { path: currentPath, token: rootToken as DTCGAnyToken };
	}
	for (const [key, child] of Object.entries(node)) {
		if (key.startsWith("$")) {
			continue;
		}
		if (child !== null && typeof child === "object" && !Array.isArray(child)) {
			yield* walkNode(child as Record<string, unknown>, appendPath(currentPath, key));
		}
	}
}
