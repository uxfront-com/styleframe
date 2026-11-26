/**
 * Apply a Resolver Module document to produce a single resolved token
 * document for a given set of modifier inputs.
 *
 * Algorithm (per Resolver Module 2025.10):
 *   1. Validate inputs against the declared modifiers and contexts.
 *   2. Walk `resolutionOrder` in declared order. For each entry:
 *        - If a set, load every source and merge them in array order.
 *        - If a modifier, look up the input value (or default), load every
 *          source for that context, and merge in array order.
 *      Each entry merges onto the running accumulator (later wins on
 *      conflict).
 *   3. Resolve all aliases in the final document.
 *   4. Return the resolved document.
 *
 * Source loading is delegated to a consumer-supplied `fileLoader` so this
 * module stays runtime-agnostic.
 */

import { resolveAliases } from "../alias/resolve";
import { ParseError, ValidationError } from "../parse/errors";
import type {
	DTCGFileLoader,
	DTCGModifier,
	DTCGRef,
	DTCGResolutionItem,
	DTCGResolverDocument,
	DTCGResolverInputs,
	DTCGSet,
	DTCGSource,
} from "../types/resolver";
import type { DTCGDocument } from "../types/token";
import { mergeDocuments } from "./merge";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRef(value: unknown): value is DTCGRef {
	return isPlainObject(value) && typeof value.$ref === "string";
}

function lookupInternalRef(doc: DTCGResolverDocument, pointer: string): unknown {
	if (!pointer.startsWith("#/")) {
		return undefined;
	}
	const segments = pointer
		.slice(2)
		.split("/")
		.map((s) => s.replaceAll("~1", "/").replaceAll("~0", "~"));
	let cursor: unknown = doc;
	for (const seg of segments) {
		if (!isPlainObject(cursor)) {
			return undefined;
		}
		cursor = (cursor as Record<string, unknown>)[seg];
	}
	return cursor;
}

async function loadSource(
	source: DTCGSource,
	doc: DTCGResolverDocument,
	loader: DTCGFileLoader,
): Promise<DTCGDocument> {
	if (isRef(source)) {
		if (source.$ref.startsWith("#/")) {
			const target = lookupInternalRef(doc, source.$ref);
			if (!isPlainObject(target)) {
				throw new ParseError(`Internal $ref "${source.$ref}" did not resolve to an object`);
			}
			return target as DTCGDocument;
		}
		const loaded = await loader(source.$ref);
		if (!isPlainObject(loaded)) {
			throw new ParseError(`fileLoader for "${source.$ref}" did not return an object`);
		}
		return loaded as DTCGDocument;
	}
	return source as DTCGDocument;
}

async function applySet(
	set: DTCGSet,
	doc: DTCGResolverDocument,
	loader: DTCGFileLoader,
	accumulator: DTCGDocument,
): Promise<DTCGDocument> {
	let current = accumulator;
	for (const source of set.sources) {
		const loaded = await loadSource(source, doc, loader);
		current = mergeDocuments(current, loaded);
	}
	return current;
}

async function applyModifier(
	modifier: DTCGModifier,
	contextName: string,
	doc: DTCGResolverDocument,
	loader: DTCGFileLoader,
	accumulator: DTCGDocument,
): Promise<DTCGDocument> {
	const sources = modifier.contexts[contextName];
	if (!sources) {
		throw new ValidationError(
			`Modifier context "${contextName}" is not defined`,
			"",
			Object.keys(modifier.contexts).join(" | "),
			contextName,
		);
	}
	let current = accumulator;
	for (const source of sources) {
		const loaded = await loadSource(source, doc, loader);
		current = mergeDocuments(current, loaded);
	}
	return current;
}

function resolveResolutionItem(
	item: DTCGResolutionItem,
	doc: DTCGResolverDocument,
):
	| { kind: "set"; value: DTCGSet; name?: string }
	| { kind: "modifier"; value: DTCGModifier; name?: string } {
	if (isRef(item)) {
		const target = lookupInternalRef(doc, item.$ref);
		if (!isPlainObject(target)) {
			throw new ParseError(`resolutionOrder $ref "${item.$ref}" did not resolve to an object`);
		}
		const ref = item.$ref;
		const isModifierRef = ref.startsWith("#/modifiers/");
		const isSetRef = ref.startsWith("#/sets/");
		if (!isModifierRef && !isSetRef) {
			throw new ParseError(
				`resolutionOrder $ref must point to #/sets/* or #/modifiers/* (got "${ref}")`,
			);
		}
		const name = ref.split("/").pop();
		return isModifierRef
			? { kind: "modifier", value: target as unknown as DTCGModifier, name }
			: { kind: "set", value: target as unknown as DTCGSet, name };
	}
	if (item.type === "set") {
		return { kind: "set", value: item };
	}
	return { kind: "modifier", value: item };
}

function validateInputs(doc: DTCGResolverDocument, inputs: DTCGResolverInputs): void {
	const declaredModifiers = new Set<string>();
	for (const item of doc.resolutionOrder) {
		const { kind, name } = resolveResolutionItem(item, doc);
		if (kind === "modifier" && name) {
			declaredModifiers.add(name);
		}
	}
	if (doc.modifiers) {
		for (const name of Object.keys(doc.modifiers)) {
			declaredModifiers.add(name);
		}
	}

	for (const key of Object.keys(inputs)) {
		if (!declaredModifiers.has(key)) {
			throw new ValidationError(
				`Unknown modifier "${key}"`,
				"",
				[...declaredModifiers].join(" | ") || "(none defined)",
				key,
			);
		}
	}

	for (const [name, modifier] of Object.entries(doc.modifiers ?? {})) {
		const value = inputs[name];
		if (value === undefined) {
			if (modifier.default === undefined) {
				throw new ValidationError(`Modifier "${name}" has no default — input value required`, name);
			}
			continue;
		}
		if (!Object.hasOwn(modifier.contexts, value)) {
			throw new ValidationError(
				`Modifier "${name}" has no context "${value}"`,
				name,
				Object.keys(modifier.contexts).join(" | "),
				value,
			);
		}
	}
}

export async function resolve(
	doc: DTCGResolverDocument,
	inputs: DTCGResolverInputs,
	fileLoader: DTCGFileLoader,
): Promise<DTCGDocument> {
	validateInputs(doc, inputs);
	let accumulator: DTCGDocument = {};
	for (const item of doc.resolutionOrder) {
		const resolved = resolveResolutionItem(item, doc);
		if (resolved.kind === "set") {
			accumulator = await applySet(resolved.value, doc, fileLoader, accumulator);
		} else {
			const modifierName = resolved.name;
			if (!modifierName) {
				throw new ParseError("Inline modifier in resolutionOrder requires a name");
			}
			const contextName = inputs[modifierName] ?? resolved.value.default;
			if (!contextName) {
				throw new ValidationError(
					`Modifier "${modifierName}" has no input value and no default`,
					modifierName,
				);
			}
			accumulator = await applyModifier(resolved.value, contextName, doc, fileLoader, accumulator);
		}
	}
	return resolveAliases(accumulator);
}
