/**
 * Resolver Module 2025.10 types — sets, modifiers, resolution-order.
 */

import type { DTCGExtensions } from "./extensions";
import type { DTCGDocument, DTCGGroup } from "./token";

/**
 * JSON Reference. Per the spec the `$ref` value can be:
 *   - A pointer within the same file:   "#/sets/MySet"
 *   - A relative file path:             "tokens/colors.json"
 *   - A path within a file:             "tokens/colors.json#/scale"
 *   - An absolute URL.
 */
export interface DTCGRef {
	$ref: string;
}

/**
 * A "source" for a set/modifier context: either a `$ref` or an inline
 * tokens document/group.
 */
export type DTCGSource = DTCGRef | DTCGDocument | DTCGGroup;

/**
 * A named set: an ordered list of sources merged in array order.
 * Later sources override earlier ones.
 */
export interface DTCGSet {
	description?: string;
	sources: Array<DTCGSource>;
	$extensions?: DTCGExtensions;
}

/**
 * A modifier defines named contexts that overlay tokens conditionally.
 * `default` MUST refer to one of the contexts when present.
 */
export interface DTCGModifier {
	description?: string;
	contexts: Record<string, Array<DTCGSource>>;
	default?: string;
	$extensions?: DTCGExtensions;
}

/**
 * An item in `resolutionOrder` — either a reference to a defined
 * set/modifier, an inline set, or an inline modifier.
 */
export type DTCGResolutionItem =
	| DTCGRef
	| ({ type: "set" } & DTCGSet)
	| ({ type: "modifier" } & DTCGModifier);

/**
 * A complete `.resolver.json` document.
 */
export interface DTCGResolverDocument {
	$schema?: string;
	name?: string;
	/** Spec literal — exact string match required. */
	version: "2025.10";
	description?: string;
	sets?: Record<string, DTCGSet>;
	modifiers?: Record<string, DTCGModifier>;
	resolutionOrder: Array<DTCGResolutionItem>;
	$extensions?: DTCGExtensions;
}

/**
 * Inputs supplied at resolution time. Each key MUST correspond to a defined
 * modifier; values MUST match a context name on that modifier.
 */
export type DTCGResolverInputs = Record<string, string>;

/**
 * A consumer-supplied loader for `$ref` resolution. Must return the parsed
 * JSON content of the reference target. Async to support filesystem and
 * network loaders.
 */
export type DTCGFileLoader = (ref: string) => Promise<unknown>;
