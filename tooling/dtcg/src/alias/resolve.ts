/**
 * Transitive alias resolution with circular-reference detection.
 *
 * The resolver walks the entire document, replacing every alias value
 * encountered (top-level `$value` and any aliased sub-property of a composite
 * value) with the resolved target value. Chains are followed transitively;
 * cycles throw `CircularReferenceError`.
 *
 * Resolution mutates a deep clone of the input — the original document is
 * never modified.
 */

import { isAlias } from "../guards/alias";
import { isToken } from "../guards/token";
import { CircularReferenceError, UnknownReferenceError } from "../parse/errors";
import type { DTCGAnyToken, DTCGDocument } from "../types/token";
import { lookupToken } from "./lookup";
import { parseAlias } from "./parse";
import { appendPath } from "./path";

interface ResolveOptions {
	/**
	 * When true, missing alias targets throw `UnknownReferenceError`.
	 * When false (default), missing targets are left as-is so the caller
	 * can run `validate(...)` to surface them with full context.
	 */
	strict?: boolean;
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

/**
 * Resolve a single alias to its terminal value, following chains and
 * detecting cycles. The `visited` set records every alias path encountered
 * during the current resolution call.
 */
function resolveValue(
	doc: DTCGDocument,
	value: unknown,
	originPath: string,
	visited: Array<string>,
	strict: boolean,
): unknown {
	if (isAlias(value)) {
		const target = parseAlias(value);
		if (visited.includes(target)) {
			throw new CircularReferenceError([...visited, target]);
		}
		const targetToken = lookupToken(doc, target);
		if (!targetToken) {
			if (strict) {
				throw new UnknownReferenceError(originPath, target);
			}
			return value;
		}
		return resolveValue(
			doc,
			targetToken.$value,
			target,
			[...visited, target],
			strict,
		);
	}

	if (Array.isArray(value)) {
		return value.map((v) => resolveValue(doc, v, originPath, visited, strict));
	}

	if (value !== null && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) {
			out[k] = resolveValue(doc, v, originPath, visited, strict);
		}
		return out;
	}

	return value;
}

function resolveTreeInPlace(
	doc: DTCGDocument,
	node: Record<string, unknown>,
	currentPath: string,
	strict: boolean,
): void {
	if (isToken(node)) {
		(node as DTCGAnyToken).$value = resolveValue(
			doc,
			(node as DTCGAnyToken).$value,
			currentPath,
			[currentPath],
			strict,
		) as DTCGAnyToken["$value"];
		return;
	}

	for (const [key, child] of Object.entries(node)) {
		if (key.startsWith("$")) {
			continue;
		}
		if (child !== null && typeof child === "object" && !Array.isArray(child)) {
			resolveTreeInPlace(
				doc,
				child as Record<string, unknown>,
				appendPath(currentPath, key),
				strict,
			);
		}
	}
}

/**
 * Resolve every alias in `doc`. Returns a new document — the input is not
 * modified. Throws `CircularReferenceError` for cycles. When `strict: true`,
 * also throws `UnknownReferenceError` for missing targets.
 */
export function resolveAliases(
	doc: DTCGDocument,
	options: ResolveOptions = {},
): DTCGDocument {
	const cloned = deepClone(doc);
	resolveTreeInPlace(
		cloned,
		cloned as unknown as Record<string, unknown>,
		"",
		options.strict ?? false,
	);
	return cloned;
}
