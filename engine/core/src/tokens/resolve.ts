import { isCSS, isKeyReferenceValue, isRef } from "../typeGuards";
import type { CSS, Container, Reference, Root, TokenValue } from "../types";

/**
 * Records a variable name in `root._usage.variables` for any Reference
 * embedded in the given value (either the value itself or any Reference
 * parts inside a CSS object).
 */
export function trackReferenceUsage(root: Root, value: TokenValue): void {
	if (isRef(value)) {
		root._usage.variables.add(value.name);
		return;
	}

	if (isCSS(value)) {
		for (const part of value.value) {
			if (isRef(part)) {
				root._usage.variables.add(part.name);
			}
		}
	}
}

export type RefFunction = (variable: string, fallback?: string) => Reference;

// `@` only starts a reference at a non-word boundary. Guarding with `(?<!\w)`
// keeps mid-token literals like a retina URL `url("image@2x.png")` intact
// instead of parsing `@2x.png` as a variable reference (SF-33).
const AT_VARIABLE_REGEX = /(?<!\w)@([\w.-]+)/g;

export function parseAtReferences(str: string): Array<TokenValue> {
	const parts: Array<TokenValue> = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	AT_VARIABLE_REGEX.lastIndex = 0;
	while ((match = AT_VARIABLE_REGEX.exec(str)) !== null) {
		const before = str.slice(lastIndex, match.index);
		if (before !== "") {
			parts.push(before);
		}
		parts.push({ type: "reference", name: match[1] as string } as Reference);
		lastIndex = AT_VARIABLE_REGEX.lastIndex;
	}
	const after = str.slice(lastIndex);
	if (after !== "") {
		parts.push(after);
	}

	return parts;
}

/**
 * Checks whether a variable with the given name exists in the scope chain,
 * walking from the given scope up through ancestors via parentId.
 */
export function findVariableInScope(name: string, scope: Container, root: Root): boolean {
	let current: Container | Root | undefined = scope;
	while (current) {
		if (current.variables.some((v) => v.name === name)) {
			return true;
		}

		if (current.parentId) {
			current = root._registry.get(current.parentId);
		} else {
			break;
		}
	}

	return false;
}

/**
 * Validates that a variable name exists in the scope chain.
 * Walks from the given scope up through ancestors to root.
 * Throws if the variable is not defined.
 */
export function validateReference(name: string, scope: Container, root: Root): void {
	if (!findVariableInScope(name, scope, root)) {
		throw new Error(
			`[styleframe] Variable "${name}" is not defined. Check that the variable exists before referencing it with "@${name}".`,
		);
	}
}

/**
 * Creates a resolver that converts @-prefixed variable references in string values.
 * - Exact match "@name" → Reference object
 * - Embedded "1px solid @name" → CSS object with mixed parts
 * - Non-string or no @ → returns value unchanged
 */
export function createPropertyValueResolver(parent: Container, root: Root) {
	return function resolvePropertyValue(value: TokenValue): TokenValue {
		if (typeof value !== "string" || !value.includes("@")) {
			return value;
		}

		// Exact match: "@color.primary" → direct Reference (single @name, no extra content)
		if (isKeyReferenceValue(value) && /^@[\w.-]+$/.test(value)) {
			const name = value.slice(1);
			validateReference(name, parent, root);
			root._usage.variables.add(name);
			return { type: "reference", name } as Reference;
		}

		// Embedded: "1px solid @color.primary" → CSS object
		const parts = parseAtReferences(value);
		const hasReferences = parts.some((p) => isRef(p));
		if (hasReferences) {
			for (const part of parts) {
				if (isRef(part)) {
					validateReference(part.name, parent, root);
					root._usage.variables.add(part.name);
				}
			}
			return { type: "css", value: parts } as CSS;
		}

		return value;
	};
}
