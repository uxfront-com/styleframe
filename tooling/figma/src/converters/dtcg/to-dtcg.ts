/**
 * Convert a FigmaExportFormat into a spec-conformant DTCG document, plus
 * an optional Resolver Module document for multi-mode collections.
 *
 *   - A single-mode collection produces a single `DTCGDocument` and no
 *     resolver.
 *   - A multi-mode collection produces:
 *       1. A `DTCGDocument` containing the default-mode values.
 *       2. A `DTCGResolverDocument` declaring a single `theme` modifier
 *          whose contexts each contain the override values for one
 *          non-default mode (inline source objects, not `$ref`s).
 *
 * The Figma BOOLEAN type has no DTCG equivalent and is dropped on export
 * with a console warning.
 */

import { formatAlias } from "@styleframe/dtcg";
import type {
	DTCGAnyToken,
	DTCGDocument,
	DTCGGroup,
	DTCGResolverDocument,
	DTCGTokenValue,
} from "@styleframe/dtcg";

import type { FigmaExportFormat, FigmaExportVariable } from "../../types";
import { classifyFigmaVariable, figmaPathToDtcg } from "./figma-bridge";

export interface ToDTCGOptions {
	/**
	 * URL placed in the `$schema` field of the emitted token document.
	 * Defaults to the W3C Final 2025.10 schema.
	 */
	schemaUrl?: string;
	/**
	 * Whether to emit `$schema`. Defaults to `true`.
	 */
	includeSchema?: boolean;
	/**
	 * Name of the modifier emitted in the resolver document. Defaults to `"theme"`.
	 */
	modifierName?: string;
}

export interface ToDTCGResult {
	tokens: DTCGDocument;
	resolver?: DTCGResolverDocument;
}

const TOKENS_SCHEMA_URL = "https://design-tokens.org/schemas/2025.10/tokens.json";
const RESOLVER_SCHEMA_URL = "https://www.designtokens.org/schemas/2025.10/resolver.json";

function isFigmaAlias(value: unknown): value is { type: "VARIABLE_ALIAS"; id: string } {
	return (
		typeof value === "object" &&
		value !== null &&
		(value as { type?: string }).type === "VARIABLE_ALIAS"
	);
}

/**
 * Convert one Figma per-mode value to a DTCG `{type, value}` pair using the
 * variable's name as a path hint. Returns `undefined` when no DTCG type can
 * be inferred — caller should attach a `dev.styleframe.unknownType`
 * extension instead of dropping the variable silently.
 */
function classifyFigmaValue(
	variable: FigmaExportVariable,
	value: unknown,
): { type?: string; value: DTCGTokenValue } | undefined {
	if (isFigmaAlias(value)) {
		return { value: formatAlias(figmaPathToDtcg(value.id)) };
	}
	const classification = classifyFigmaVariable(variable, value);
	if (classification) {
		return { type: classification.type, value: classification.value };
	}
	if (typeof value === "string") {
		return { value };
	}
	return undefined;
}

function setNestedToken(doc: DTCGDocument, figmaName: string, token: DTCGAnyToken): void {
	const segments = figmaName.split("/");
	if (segments.length === 0) {
		return;
	}

	let cursor = doc as unknown as Record<string, unknown>;
	for (let i = 0; i < segments.length - 1; i++) {
		const segment = segments[i] as string;
		const existing = cursor[segment];
		if (existing === undefined || typeof existing !== "object" || existing === null) {
			cursor[segment] = {} as DTCGGroup;
		} else if ("$value" in (existing as object)) {
			cursor[segment] = { $root: existing };
		}
		cursor = cursor[segment] as Record<string, unknown>;
	}

	const leafKey = segments.at(-1) as string;
	const existing = cursor[leafKey];
	if (
		existing !== undefined &&
		typeof existing === "object" &&
		existing !== null &&
		!Array.isArray(existing) &&
		!("$value" in (existing as object))
	) {
		(existing as Record<string, unknown>).$root = token;
	} else {
		cursor[leafKey] = token as never;
	}
}

function setNestedOverride(
	context: Record<string, unknown>,
	dtcgPath: string,
	value: DTCGTokenValue,
): void {
	const segments = dtcgPath.split(".");
	let cursor = context;
	for (let i = 0; i < segments.length - 1; i++) {
		const segment = segments[i] as string;
		const next = cursor[segment];
		if (
			typeof next !== "object" ||
			next === null ||
			Array.isArray(next) ||
			"$value" in (next as object)
		) {
			cursor[segment] = {};
		}
		cursor = cursor[segment] as Record<string, unknown>;
	}
	cursor[segments.at(-1) as string] = { $value: value };
}

function variableToToken(
	variable: FigmaExportVariable,
	defaultMode: string,
): DTCGAnyToken | undefined {
	if (variable.type === "BOOLEAN") {
		if (variable.aliasTo !== undefined) {
			const token: DTCGAnyToken = {
				$value: formatAlias(figmaPathToDtcg(variable.aliasTo)),
				$extensions: { "dev.styleframe": { boolean: true } },
			};
			if (variable.description !== undefined) {
				token.$description = variable.description;
			}
			return token;
		}
		const defaultValue = variable.values[defaultMode];
		const token: DTCGAnyToken = {
			$value: String(defaultValue ?? false),
			$type: "string" as DTCGAnyToken["$type"],
			$extensions: { "dev.styleframe": { boolean: true } },
		};
		if (variable.description !== undefined) {
			token.$description = variable.description;
		}
		return token;
	}

	if (variable.aliasTo !== undefined) {
		// Aliases carry no inherent type — a future improvement could look up
		// the target's classification, but Figma alone doesn't have the type
		// information needed without re-walking the entire collection.
		const token: DTCGAnyToken = {
			$value: formatAlias(figmaPathToDtcg(variable.aliasTo)),
		};
		if (variable.description !== undefined) {
			token.$description = variable.description;
		}
		return token;
	}

	const defaultValue = variable.values[defaultMode];
	const classified = classifyFigmaValue(variable, defaultValue);
	if (!classified) {
		return undefined;
	}

	const token: DTCGAnyToken = { $value: classified.value };
	if (classified.type !== undefined) {
		token.$type = classified.type as DTCGAnyToken["$type"];
	} else {
		// Preserve the value but flag it for round-trip awareness.
		token.$extensions = { "dev.styleframe": { unknownType: true } };
	}
	if (variable.description !== undefined) {
		token.$description = variable.description;
	}
	return token;
}

function valuesEqual(a: DTCGTokenValue, b: DTCGTokenValue): boolean {
	if (a === b) {
		return true;
	}
	if (typeof a !== typeof b) {
		return false;
	}
	if (typeof a === "object") {
		return JSON.stringify(a) === JSON.stringify(b);
	}
	return false;
}

export function toDTCG(data: FigmaExportFormat, options: ToDTCGOptions = {}): ToDTCGResult {
	const includeSchema = options.includeSchema ?? true;
	const schemaUrl = options.schemaUrl ?? TOKENS_SCHEMA_URL;
	const modifierName = options.modifierName ?? "theme";
	const defaultMode = data.modes[0] ?? "Default";
	const overrideModes = data.modes.slice(1);

	const tokens: DTCGDocument = {};
	if (includeSchema) {
		tokens.$schema = schemaUrl;
	}
	tokens.$extensions = {
		"dev.styleframe": { collection: data.collection },
	};

	// One context per non-default mode. Each context holds an inline source
	// document containing only the override values.
	const contexts: Record<string, DTCGDocument> = {};
	for (const mode of overrideModes) {
		contexts[mode] = {};
	}

	for (const variable of data.variables) {
		const token = variableToToken(variable, defaultMode);
		if (!token) {
			continue;
		}
		setNestedToken(tokens, variable.name, token);

		if (variable.aliasTo !== undefined) {
			continue;
		}

		const defaultDtcgValue = token.$value as DTCGTokenValue;
		for (const mode of overrideModes) {
			const modeValue = variable.values[mode];
			if (modeValue === undefined) {
				continue;
			}

			let overrideValue: DTCGTokenValue | undefined;
			if (variable.type === "BOOLEAN") {
				overrideValue = String(modeValue);
			} else {
				const classified = classifyFigmaValue(variable, modeValue);
				if (classified) {
					overrideValue = classified.value;
				}
			}

			if (overrideValue === undefined) {
				continue;
			}
			if (valuesEqual(overrideValue, defaultDtcgValue)) {
				continue;
			}
			const dtcgPath = figmaPathToDtcg(variable.name);
			setNestedOverride(
				contexts[mode] as unknown as Record<string, unknown>,
				dtcgPath,
				overrideValue,
			);
		}
	}

	if (overrideModes.length === 0) {
		return { tokens };
	}

	const resolver: DTCGResolverDocument = {
		$schema: RESOLVER_SCHEMA_URL,
		version: "2025.10",
		modifiers: {
			[modifierName]: {
				contexts: Object.fromEntries(Object.entries(contexts).map(([mode, ctx]) => [mode, [ctx]])),
				default: defaultMode,
			},
		},
		resolutionOrder: [{ $ref: `#/modifiers/${modifierName}` }],
	};

	return { tokens, resolver };
}
