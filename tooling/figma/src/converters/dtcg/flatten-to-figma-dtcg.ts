/**
 * Flatten a spec-conformant DTCG document into Figma-compatible DTCG —
 * one complete document per mode using only the three types Figma
 * understands: `number`, `color`, `string`.
 *
 * For multi-mode configs (base tokens + resolver), the resolver is
 * expanded into per-mode documents first, then each is flattened.
 */

import {
	applyInheritance,
	color as dtcgColor,
	dimension as dtcgDimension,
	isAlias,
	lookupToken,
	parseAlias,
	resolveResolver,
	splitPath,
	walk,
} from "@styleframe/dtcg";
import type {
	DTCGAnyToken,
	DTCGColor,
	DTCGDimension,
	DTCGDocument,
	DTCGDuration,
	DTCGResolverDocument,
	DTCGTokenType,
} from "@styleframe/dtcg";

export type FigmaDTCGType = "number" | "color" | "string";

export interface FlattenToFigmaDTCGOptions {
	defaultModeName?: string;
}

export interface FlattenDiagnostic {
	path: string;
	reason: string;
}

export interface FlattenToFigmaDTCGResult {
	modes: Record<string, DTCGDocument>;
	diagnostics: Array<FlattenDiagnostic>;
}

export async function flattenToFigmaDTCG(
	doc: DTCGDocument,
	resolver?: DTCGResolverDocument,
	options?: FlattenToFigmaDTCGOptions,
): Promise<FlattenToFigmaDTCGResult> {
	const defaultModeName = options?.defaultModeName ?? "Default";
	const diagnostics: Array<FlattenDiagnostic> = [];

	if (!resolver) {
		const flattened = flattenSingleDocument(doc, diagnostics);
		flattened.$extensions = { "com.figma.modeName": defaultModeName };
		return { modes: { [defaultModeName]: flattened }, diagnostics };
	}

	const modes: Record<string, DTCGDocument> = {};
	const themeModifier = findThemeModifier(resolver);
	if (!themeModifier) {
		const flattened = flattenSingleDocument(doc, diagnostics);
		flattened.$extensions = { "com.figma.modeName": defaultModeName };
		return { modes: { [defaultModeName]: flattened }, diagnostics };
	}

	const { name: modifierName, modifier } = themeModifier;
	const contextNames = Object.keys(modifier.contexts);
	const defaultContext = modifier.default ?? contextNames[0]!;

	const orderedContexts = [
		defaultContext,
		...contextNames.filter((c) => c !== defaultContext),
	];

	const fileLoader = async (ref: string) => {
		const base = resolver.resolutionOrder.find(
			(item) =>
				typeof item === "object" &&
				"$ref" in item &&
				!item.$ref.startsWith("#/"),
		);
		if (
			base &&
			typeof base === "object" &&
			"$ref" in base &&
			(base as { $ref: string }).$ref === ref
		) {
			return doc;
		}
		return doc;
	};

	for (const contextName of orderedContexts) {
		const resolved = await resolveResolver(
			resolver,
			{ [modifierName]: contextName },
			fileLoader,
		);
		const modeName =
			contextName === defaultContext
				? defaultModeName
				: capitalise(contextName);
		const flattened = flattenSingleDocument(resolved, diagnostics);
		flattened.$extensions = { "com.figma.modeName": modeName };
		modes[modeName] = flattened;
	}

	return { modes, diagnostics };
}

function findThemeModifier(resolver: DTCGResolverDocument) {
	if (!resolver.modifiers) {
		return undefined;
	}
	for (const [name, modifier] of Object.entries(resolver.modifiers)) {
		if (Object.keys(modifier.contexts).length > 0) {
			return { name, modifier };
		}
	}
	return undefined;
}

function capitalise(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function flattenSingleDocument(
	doc: DTCGDocument,
	diagnostics: Array<FlattenDiagnostic>,
): DTCGDocument {
	const inherited = applyInheritance(doc);
	const groupTypeMap = collectGroupTypes(inherited);
	const output: DTCGDocument = {};
	const entries = [...walk(inherited)];
	const flattenedTypeMap = new Map<string, FigmaDTCGType>();

	for (const { path, token } of entries) {
		if (isAlias(token.$value)) {
			continue;
		}
		const richType =
			(token.$type as DTCGTokenType | undefined) ?? groupTypeMap.get(path);
		const { type: figmaType, value: figmaValue } = flattenValue(
			token.$value,
			richType,
			path,
			diagnostics,
		);
		flattenedTypeMap.set(path, figmaType);
		const flat: DTCGAnyToken = {
			$type: figmaType as DTCGAnyToken["$type"],
			$value: figmaValue as DTCGAnyToken["$value"],
		};
		if (token.$extensions) {
			flat.$extensions = token.$extensions;
		}
		setNestedToken(output, path, flat);
	}

	for (const { path, token } of entries) {
		if (!isAlias(token.$value)) {
			continue;
		}
		const aliasPath = parseAlias(token.$value);
		const leafPath = resolveAliasToLeaf(inherited, aliasPath);
		const figmaType =
			flattenedTypeMap.get(leafPath) ??
			richTypeToFigmaDtcg(resolveAliasType(inherited, leafPath));
		const flat: DTCGAnyToken = {
			$type: figmaType as DTCGAnyToken["$type"],
			$value: `{${leafPath}}` as DTCGAnyToken["$value"],
		};
		if (token.$extensions) {
			flat.$extensions = token.$extensions;
		}
		setNestedToken(output, path, flat);
	}

	return output;
}

function collectGroupTypes(doc: DTCGDocument): Map<string, DTCGTokenType> {
	const map = new Map<string, DTCGTokenType>();
	collectGroupTypesRecursive(
		doc as unknown as Record<string, unknown>,
		"",
		undefined,
		map,
	);
	return map;
}

function collectGroupTypesRecursive(
	node: Record<string, unknown>,
	currentPath: string,
	inheritedType: DTCGTokenType | undefined,
	map: Map<string, DTCGTokenType>,
): void {
	if ("$value" in node) {
		return;
	}
	const ownType = (node.$type as DTCGTokenType | undefined) ?? inheritedType;
	if ("$root" in node && currentPath && ownType) {
		map.set(currentPath, ownType);
	}
	for (const [key, child] of Object.entries(node)) {
		if (key.startsWith("$")) {
			continue;
		}
		if (child !== null && typeof child === "object" && !Array.isArray(child)) {
			const childPath = currentPath ? `${currentPath}.${key}` : key;
			collectGroupTypesRecursive(
				child as Record<string, unknown>,
				childPath,
				ownType,
				map,
			);
		}
	}
}

function resolveAliasType(
	doc: DTCGDocument,
	aliasPath: string,
): DTCGTokenType | undefined {
	const target = lookupToken(doc, aliasPath);
	if (!target) {
		return undefined;
	}
	if (isAlias(target.$value)) {
		return resolveAliasType(doc, parseAlias(target.$value));
	}
	return target.$type as DTCGTokenType | undefined;
}

/**
 * Resolve an alias path to a leaf token path. If the target is a group
 * with a `$root` token (i.e. the group IS also a token), follow the
 * `$root`'s alias chain until we reach a leaf token. Figma's native DTCG
 * import only resolves aliases to leaf tokens — `{spacing}` fails when
 * `spacing` is a group, even if it has `$root`.
 */
function resolveAliasToLeaf(
	doc: DTCGDocument,
	aliasPath: string,
	seen = new Set<string>(),
): string {
	if (seen.has(aliasPath)) {
		return aliasPath;
	}
	seen.add(aliasPath);

	const token = lookupToken(doc, aliasPath);
	if (token) {
		return aliasPath;
	}

	const segments = splitPath(aliasPath);
	let cursor: unknown = doc;
	for (const seg of segments) {
		if (typeof cursor !== "object" || cursor === null) {
			return aliasPath;
		}
		cursor = (cursor as Record<string, unknown>)[seg];
	}

	if (
		typeof cursor === "object" &&
		cursor !== null &&
		"$root" in (cursor as object)
	) {
		const root = (cursor as Record<string, unknown>).$root as
			| DTCGAnyToken
			| undefined;
		if (root && isAlias(root.$value)) {
			const nextPath = parseAlias(root.$value);
			return resolveAliasToLeaf(doc, nextPath, seen);
		}
	}

	return aliasPath;
}

function richTypeToFigmaDtcg(
	richType: DTCGTokenType | undefined,
): FigmaDTCGType {
	switch (richType) {
		case "color":
			return "color";
		case "dimension":
		case "duration":
		case "number":
			return "number";
		case "fontWeight":
			return "number";
		default:
			return "string";
	}
}

interface FlattenedToken {
	type: FigmaDTCGType;
	value: unknown;
}

function flattenValue(
	value: unknown,
	richType: DTCGTokenType | undefined,
	path: string,
	diagnostics: Array<FlattenDiagnostic>,
): FlattenedToken {
	switch (richType) {
		case "color":
			return flattenColor(value);
		case "dimension":
			return flattenDimension(value, path, diagnostics);
		case "duration":
			return flattenDuration(value);
		case "number":
			if (isDimensionObject(value)) {
				return flattenDimension(value, path, diagnostics);
			}
			return { type: "number", value };
		case "fontWeight":
			return flattenFontWeight(value);
		case "cubicBezier":
			return {
				type: "string",
				value: Array.isArray(value) ? JSON.stringify(value) : String(value),
			};
		case "fontFamily":
			return {
				type: "string",
				value: Array.isArray(value) ? value.join(", ") : String(value),
			};
		case "strokeStyle":
			return {
				type: "string",
				value: typeof value === "string" ? value : JSON.stringify(value),
			};
		case "border":
		case "transition":
		case "shadow":
		case "gradient":
		case "typography":
			return {
				type: "string",
				value: typeof value === "string" ? value : JSON.stringify(value),
			};
		default:
			if (typeof value === "number") {
				return { type: "number", value };
			}
			if (typeof value === "string") {
				return { type: "string", value };
			}
			diagnostics.push({ path, reason: "Untyped token emitted as string" });
			return {
				type: "string",
				value: typeof value === "string" ? value : JSON.stringify(value),
			};
	}
}

function flattenColor(value: unknown): FlattenedToken {
	if (
		typeof value === "object" &&
		value !== null &&
		"colorSpace" in (value as object)
	) {
		const color = value as DTCGColor;
		const srgb =
			color.colorSpace === "srgb" ? color : dtcgColor.convert(color, "srgb");
		const clamp01 = (n: number | "none") =>
			n === "none" ? 0 : Math.max(0, Math.min(1, n));
		const clamped: DTCGColor = {
			colorSpace: "srgb",
			components: srgb.components.map(clamp01) as [number, number, number],
			alpha: clamp01(srgb.alpha ?? 1),
		};
		clamped.hex = dtcgColor.format(clamped);
		return { type: "color", value: clamped };
	}
	return { type: "string", value: String(value) };
}

function flattenDimension(
	value: unknown,
	path: string,
	diagnostics: Array<FlattenDiagnostic>,
): FlattenedToken {
	if (typeof value === "number") {
		return { type: "number", value };
	}
	if (isDimensionObject(value)) {
		const dim = value as DTCGDimension;
		const px = dimensionToFloat(dim);
		if (px !== undefined) {
			return { type: "number", value: px };
		}
		diagnostics.push({
			path,
			reason: `Unsupported unit "${dim.unit}" — emitted as string`,
		});
		return { type: "string", value: dtcgDimension.format(dim) };
	}
	return { type: "string", value: String(value) };
}

function flattenDuration(value: unknown): FlattenedToken {
	if (typeof value === "number") {
		return { type: "number", value };
	}
	if (isDurationObject(value)) {
		const dur = value as DTCGDuration;
		return {
			type: "number",
			value: durationToMs(dur),
		};
	}
	return { type: "number", value: typeof value === "number" ? value : 0 };
}

function flattenFontWeight(value: unknown): FlattenedToken {
	if (typeof value === "number") {
		return { type: "number", value };
	}
	return { type: "string", value: String(value) };
}

function dimensionToFloat(
	dim: DTCGDimension,
	baseFontSize = 16,
): number | undefined {
	switch (dim.unit) {
		case "px":
			return dim.value;
		case "rem":
		case "em":
			return dim.value * baseFontSize;
		case "%":
			return dim.value;
		default:
			return undefined;
	}
}

function durationToMs(dur: DTCGDuration): number {
	return dur.unit === "s" ? dur.value * 1000 : dur.value;
}

function isDimensionObject(
	value: unknown,
): value is { value: number; unit: string } {
	return (
		typeof value === "object" &&
		value !== null &&
		"value" in value &&
		"unit" in value &&
		typeof (value as { value: unknown }).value === "number" &&
		typeof (value as { unit: unknown }).unit === "string"
	);
}

function isDurationObject(
	value: unknown,
): value is { value: number; unit: string } {
	return isDimensionObject(value);
}

function setNestedToken(
	doc: DTCGDocument,
	dotPath: string,
	token: DTCGAnyToken,
): void {
	const segments = splitPath(dotPath);
	if (segments.length === 0) {
		return;
	}

	let cursor = doc as Record<string, unknown>;
	for (let i = 0; i < segments.length - 1; i++) {
		const key = segments[i]!;
		const existing = cursor[key];
		if (
			existing === undefined ||
			typeof existing !== "object" ||
			existing === null
		) {
			cursor[key] = {};
		} else if ("$value" in (existing as object)) {
			const promoted = { $root: existing };
			cursor[key] = promoted;
		}
		cursor = cursor[key] as Record<string, unknown>;
	}

	const leafKey = segments.at(-1)!;
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
		cursor[leafKey] = token;
	}
}
