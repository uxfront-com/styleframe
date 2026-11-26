/**
 * Apply $type and $deprecated inheritance through the document tree.
 *
 * Per the spec:
 *   - A token without `$type` inherits the nearest ancestor group's `$type`.
 *   - A group's `$deprecated` flag propagates to all descendant tokens
 *     unless the descendant explicitly sets its own value (boolean or string).
 *
 * Returns a new document — input is never mutated. Tokens that explicitly
 * set their own `$type` or `$deprecated` are preserved unchanged.
 */

import { isToken } from "../guards/token";
import type { DTCGAnyToken, DTCGDeprecated, DTCGDocument } from "../types/token";
import type { DTCGTokenType } from "../types/values";

interface InheritedContext {
	type?: DTCGTokenType;
	deprecated?: DTCGDeprecated;
}

function deepClone<T>(value: T): T {
	if (value === null || typeof value !== "object") {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map((v) => deepClone(v)) as unknown as T;
	}
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(value)) {
		out[k] = deepClone(v);
	}
	return out as T;
}

function applyToTree(node: Record<string, unknown>, ctx: InheritedContext): void {
	const ownType = node["$type"] as DTCGTokenType | undefined;
	const ownDeprecated = node["$deprecated"] as DTCGDeprecated | undefined;
	const nextCtx: InheritedContext = {
		type: ownType ?? ctx.type,
		deprecated: ownDeprecated ?? ctx.deprecated,
	};

	if (isToken(node)) {
		const token = node as DTCGAnyToken;
		if (token.$type === undefined && nextCtx.type !== undefined) {
			token.$type = nextCtx.type;
		}
		if (token.$deprecated === undefined && nextCtx.deprecated !== undefined) {
			token.$deprecated = nextCtx.deprecated;
		}
		return;
	}

	for (const [key, child] of Object.entries(node)) {
		if (key.startsWith("$")) {
			continue;
		}
		if (child !== null && typeof child === "object" && !Array.isArray(child)) {
			applyToTree(child as Record<string, unknown>, nextCtx);
		}
	}
}

export function applyInheritance(doc: DTCGDocument): DTCGDocument {
	const cloned = deepClone(doc);
	applyToTree(cloned as unknown as Record<string, unknown>, {});
	return cloned;
}
