/**
 * Convert a loaded Styleframe `Root` directly to a spec-conformant DTCG
 * tokens document (and optional resolver document for themed configs).
 *
 * The two-pass strategy:
 *   1. **Type map pass** — evaluate every variable's default-mode value to
 *      a primitive, classify it, and record `{name → DTCGTokenType}`. This
 *      lets aliases stamp their `$type` from the resolved target type.
 *   2. **Document pass** — walk variables again; emit alias tokens (with
 *      stamped type) when `aliasTarget` is set, or classify the resolved
 *      primitive otherwise. Themes become resolver modifier contexts.
 *
 * Bypasses `FigmaExportFormat` entirely — that intermediate is only used by
 * the Figma plugin runtime and is too narrow to carry DTCG semantics.
 */

import type { Root, Theme, Variable } from "@styleframe/core";
import { classifyValue, formatAlias } from "@styleframe/dtcg";
import type {
	Classification,
	DTCGAnyToken,
	DTCGDocument,
	DTCGGroup,
	DTCGResolverDocument,
	DTCGSource,
	DTCGTokenType,
	DTCGTokenValue,
} from "@styleframe/dtcg";
import { evaluateValue } from "./evaluate";
import type { EvaluateContext, EvaluatedValue } from "./evaluate";

const TOKENS_SCHEMA_URL =
	"https://design-tokens.org/schemas/2025.10/tokens.json";
const RESOLVER_SCHEMA_URL =
	"https://www.designtokens.org/schemas/2025.10/resolver.json";

export interface BuildDTCGOptions {
	collectionName?: string;
	defaultModeName?: string;
	modifierName?: string;
	includeSchema?: boolean;
	schemaUrl?: string;
	/**
	 * Filename referenced as the base `set` in the resolver's `resolutionOrder`.
	 * Resolver consumers must be able to load this path via their `fileLoader`.
	 * Defaults to `"tokens.json"`.
	 */
	tokensSourceRef?: string;
}

export interface BuildDiagnostic {
	name: string;
	level: "warn" | "info";
	reason: string;
}

export interface BuildDTCGResult {
	tokens: DTCGDocument;
	resolver?: DTCGResolverDocument;
	diagnostics: Array<BuildDiagnostic>;
	emittedCount: number;
	/**
	 * Number of tokens whose final value was derived via fluid-unit
	 * substitution (`100vw` → max viewport, `rem` → px) rather than direct
	 * arithmetic. Useful for the export CLI's diagnostic summary.
	 */
	fluidNormalisedCount: number;
	/** Max viewport (in px) used when substituting `100vw` for fluid tokens. */
	maxViewport: number;
}

interface ProcessedVariable {
	name: string;
	evaluation: EvaluatedValue;
	classification?: Classification;
}

function buildVariableMap(root: Root): Map<string, Variable> {
	const map = new Map<string, Variable>();
	for (const v of root.variables) {
		map.set(v.name, v);
	}
	for (const theme of root.themes) {
		for (const v of theme.variables) {
			// Default-mode value wins when multiple variables share a name across
			// themes — themes only override per-mode, not the canonical type.
			if (!map.has(v.name)) {
				map.set(v.name, v);
			}
		}
	}
	return map;
}

function processVariable(
	variable: Variable,
	context: EvaluateContext,
): ProcessedVariable {
	const evaluation = evaluateValue(variable.value, context);
	const classification = classifyValueForVariable(variable.name, evaluation);
	return { name: variable.name, evaluation, classification };
}

function classifyValueForVariable(
	name: string,
	evaluation: EvaluatedValue,
): Classification | undefined {
	if (evaluation.resolved === null) {
		return undefined;
	}
	return classifyValue(evaluation.resolved, { path: name });
}

/**
 * Place a token at `dotPath` in `doc`. Two collision cases need handling:
 *
 *   1. **Token at a path whose group already has children.** If we set
 *      `border-width = {...token}` after `border-width.thin = {...}` was
 *      written, a naive overwrite drops the children. Instead, we promote
 *      the parent token into a `$root` slot inside the existing group.
 *   2. **Children written into a slot that's already a token.** Reverse
 *      ordering: if `border-width = {...token}` was written first and we
 *      now need to add `border-width.thin = {...}`, we move the existing
 *      token into `$root` and continue descending into the new group.
 *
 * Both cases are handled by checking whether the slot looks like a token
 * (`$value` present) or a group, and by upgrading to `$root` whenever a
 * token coexists with siblings at the same path.
 */
function setNestedToken(
	doc: DTCGDocument,
	dotPath: string,
	token: DTCGAnyToken,
): void {
	const segments = dotPath.split(".");
	let cursor = doc as unknown as Record<string, unknown>;
	for (let i = 0; i < segments.length - 1; i++) {
		const segment = segments[i] as string;
		const next = cursor[segment];
		if (typeof next !== "object" || next === null || Array.isArray(next)) {
			cursor[segment] = {} as DTCGGroup;
		} else if ("$value" in (next as object)) {
			// Existing token blocks descent — promote it to $root inside a new group.
			cursor[segment] = { $root: next };
		}
		cursor = cursor[segment] as Record<string, unknown>;
	}
	const leaf = segments.at(-1) as string;
	const existing = cursor[leaf];
	if (
		typeof existing === "object" &&
		existing !== null &&
		!Array.isArray(existing) &&
		!("$value" in (existing as object))
	) {
		// Slot is already a group with children — emit the token under $root.
		(existing as Record<string, unknown>).$root = token;
	} else {
		cursor[leaf] = token as never;
	}
}

function hasRootToken(doc: DTCGDocument, dotPath: string): boolean {
	const segments = dotPath.split(".");
	let cursor: unknown = doc;
	for (const segment of segments) {
		if (
			typeof cursor !== "object" ||
			cursor === null ||
			Array.isArray(cursor)
		) {
			return false;
		}
		cursor = (cursor as Record<string, unknown>)[segment];
	}
	return (
		typeof cursor === "object" &&
		cursor !== null &&
		!Array.isArray(cursor) &&
		"$root" in (cursor as object)
	);
}

function setNestedOverride(
	context: Record<string, unknown>,
	dotPath: string,
	value: DTCGTokenValue,
	type?: DTCGTokenType,
): void {
	const segments = dotPath.split(".");
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
	const token: DTCGAnyToken = { $value: value };
	// Carry `$type` through the resolver merge — `mergeDocuments` does
	// token-level replacement, so an override that omits `$type` would strip
	// the typing inherited from the base, breaking COLOR/FLOAT detection in
	// downstream consumers (e.g. the Figma plugin).
	if (type !== undefined) {
		token.$type = type;
	}
	cursor[segments.at(-1) as string] = token;
}

function makeAliasToken(
	target: string,
	type: DTCGTokenType | undefined,
	description?: string,
): DTCGAnyToken {
	const token: DTCGAnyToken = { $value: formatAlias(target) };
	if (type !== undefined) {
		token.$type = type;
	}
	if (description) {
		token.$description = description;
	}
	return token;
}

function makeValueToken(
	classification: Classification,
	description?: string,
	fluidBound?: "max",
): DTCGAnyToken {
	const token: DTCGAnyToken = {
		$value: classification.value,
		$type: classification.type,
	};
	if (description) {
		token.$description = description;
	}
	if (fluidBound) {
		token.$extensions = {
			"dev.styleframe": { fluidBound },
		};
	}
	return token;
}

function makeExpressionToken(
	expression: string,
	description?: string,
): DTCGAnyToken {
	const token: DTCGAnyToken = {
		$value: expression,
		$extensions: {
			"dev.styleframe": { expression },
		},
	};
	if (description) {
		token.$description = description;
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

function capitalizeContextName(name: string): string {
	if (name.length === 0) {
		return name;
	}
	return name.charAt(0).toUpperCase() + name.slice(1);
}

export function buildDTCG(
	root: Root,
	options: BuildDTCGOptions = {},
): BuildDTCGResult {
	const includeSchema = options.includeSchema ?? true;
	const schemaUrl = options.schemaUrl ?? TOKENS_SCHEMA_URL;
	const modifierName = options.modifierName ?? "theme";
	const collectionName = options.collectionName ?? "Design Tokens";
	const defaultModeName = options.defaultModeName ?? "Default";
	const tokensSourceRef = options.tokensSourceRef ?? "tokens.json";

	const variableMap = buildVariableMap(root);

	// Resolve the project's `fluid.max-width` once so fluid expressions
	// (e.g. `useFluidClamp`) reduce to a concrete pixel value at the locked
	// desktop breakpoint. Falls back to the styleframe theme default.
	const fluidMaxVariable = variableMap.get("fluid.max-width");
	const fluidMaxResolved = fluidMaxVariable
		? evaluateValue(fluidMaxVariable.value, { variables: variableMap }).resolved
		: null;
	const maxViewport =
		typeof fluidMaxResolved === "number" ? fluidMaxResolved : 1440;

	const context: EvaluateContext = { variables: variableMap, maxViewport };

	// Pass 1: type map for alias stamping.
	const processed = new Map<string, ProcessedVariable>();
	const typeMap = new Map<string, DTCGTokenType>();
	for (const variable of root.variables) {
		const p = processVariable(variable, context);
		processed.set(variable.name, p);
		if (p.classification) {
			typeMap.set(variable.name, p.classification.type);
		}
	}
	// Resolve alias-of-alias by traversing typeMap if a processed entry
	// pointed at another variable.
	const resolveTypeFromAliasChain = (
		name: string,
		seen: Set<string>,
	): DTCGTokenType | undefined => {
		if (seen.has(name)) {
			return undefined;
		}
		const direct = typeMap.get(name);
		if (direct) {
			return direct;
		}
		const p = processed.get(name);
		if (p?.evaluation.aliasTarget) {
			return resolveTypeFromAliasChain(
				p.evaluation.aliasTarget,
				new Set([...seen, name]),
			);
		}
		return undefined;
	};

	// Pass 2: emit tokens.
	const tokens: DTCGDocument = {};
	if (includeSchema) {
		tokens.$schema = schemaUrl;
	}
	tokens.$extensions = {
		"dev.styleframe": { collection: collectionName },
	};

	const diagnostics: Array<BuildDiagnostic> = [];
	let emittedCount = 0;
	let fluidNormalisedCount = 0;

	for (const variable of root.variables) {
		const p = processed.get(variable.name);
		if (!p) {
			continue;
		}
		const { evaluation, classification } = p;

		if (evaluation.aliasTarget) {
			const targetType = resolveTypeFromAliasChain(
				evaluation.aliasTarget,
				new Set(),
			);
			setNestedToken(
				tokens,
				variable.name,
				makeAliasToken(evaluation.aliasTarget, targetType),
			);
			emittedCount++;
			continue;
		}

		if (classification) {
			const fluidBound =
				evaluation.normalisationSource === "fluid-max" ? "max" : undefined;
			// Fluid substitution always produces a px-equivalent number. The
			// classifier returns `number` for bare numerics under paths it
			// doesn't recognise (e.g. `font-size.md`); promote that to a
			// `dimension` so Figma renders it as a real numeric variable
			// instead of an untyped scalar.
			const promoted: Classification =
				fluidBound &&
				classification.type === "number" &&
				typeof classification.value === "number"
					? {
							type: "dimension",
							value: { value: classification.value, unit: "px" },
						}
					: classification;
			setNestedToken(
				tokens,
				variable.name,
				makeValueToken(promoted, undefined, fluidBound),
			);
			if (fluidBound) {
				fluidNormalisedCount++;
			}
			emittedCount++;
			continue;
		}

		if (evaluation.cssExpression) {
			setNestedToken(
				tokens,
				variable.name,
				makeExpressionToken(evaluation.cssExpression),
			);
			diagnostics.push({
				name: variable.name,
				level: "warn",
				reason:
					evaluation.reason ??
					"Computed expression — preserved as dev.styleframe.expression extension",
			});
			emittedCount++;
			continue;
		}

		// Resolved to a primitive but classifier couldn't tag it AND it isn't
		// a CSS expression — emit untyped string fallback.
		if (
			evaluation.resolved !== null &&
			typeof evaluation.resolved !== "boolean"
		) {
			setNestedToken(tokens, variable.name, {
				$value: String(evaluation.resolved),
				$extensions: { "dev.styleframe": { unknownType: true } },
			});
			diagnostics.push({
				name: variable.name,
				level: "warn",
				reason: "Could not infer DTCG $type — emitted as untyped string",
			});
			emittedCount++;
			continue;
		}

		diagnostics.push({
			name: variable.name,
			level: "warn",
			reason: evaluation.reason ?? "Unrepresentable value — skipped",
		});
	}

	// Themes → resolver contexts.
	const themedThemes: Array<Theme> = root.themes.filter(
		(t) => t.variables.length > 0,
	);
	let resolver: DTCGResolverDocument | undefined;
	if (themedThemes.length > 0) {
		const contexts: Record<string, DTCGDocument> = {};
		for (const theme of themedThemes) {
			const contextDoc: DTCGDocument = {};
			for (const variable of theme.variables) {
				const themeProcessed = processVariable(variable, context);
				const defaultProcessed = processed.get(variable.name);

				let themeValue: DTCGTokenValue | undefined;
				let themeType: DTCGTokenType | undefined;
				if (themeProcessed.evaluation.aliasTarget) {
					themeValue = formatAlias(themeProcessed.evaluation.aliasTarget);
					themeType = resolveTypeFromAliasChain(
						themeProcessed.evaluation.aliasTarget,
						new Set(),
					);
				} else if (themeProcessed.classification) {
					themeValue = themeProcessed.classification.value;
					themeType = themeProcessed.classification.type;
				}

				if (themeValue === undefined) {
					continue;
				}

				let defaultValue: DTCGTokenValue | undefined;
				if (defaultProcessed?.evaluation.aliasTarget) {
					defaultValue = formatAlias(defaultProcessed.evaluation.aliasTarget);
				} else if (defaultProcessed?.classification) {
					defaultValue = defaultProcessed.classification.value;
				}

				if (
					defaultValue !== undefined &&
					valuesEqual(themeValue, defaultValue)
				) {
					continue;
				}

				const overridePath = hasRootToken(tokens, variable.name)
					? `${variable.name}.$root`
					: variable.name;
				setNestedOverride(
					contextDoc as unknown as Record<string, unknown>,
					overridePath,
					themeValue,
					themeType,
				);
			}
			contexts[capitalizeContextName(theme.name)] = contextDoc;
		}

		// Drop any contexts that ended up empty (no overrides differ from default).
		for (const key of Object.keys(contexts)) {
			if (Object.keys(contexts[key] as object).length === 0) {
				delete contexts[key];
			}
		}

		const themeContextNames = Object.keys(contexts);
		if (themeContextNames.length > 0) {
			// `Default` context is empty: the base `set` already supplies all
			// default-mode values, so no overrides are needed for that mode.
			const allContexts: Record<string, Array<DTCGSource>> = {
				[defaultModeName]: [],
			};
			for (const name of themeContextNames) {
				allContexts[name] = [contexts[name] as DTCGDocument];
			}

			resolver = {
				$schema: RESOLVER_SCHEMA_URL,
				version: "2025.10",
				modifiers: {
					[modifierName]: {
						contexts: allContexts,
						default: defaultModeName,
					},
				},
				resolutionOrder: [
					{ type: "set", sources: [{ $ref: tokensSourceRef }] },
					{ $ref: `#/modifiers/${modifierName}` },
				],
			};
		}
	}

	return {
		tokens,
		resolver,
		diagnostics,
		emittedCount,
		fluidNormalisedCount,
		maxViewport,
	};
}
