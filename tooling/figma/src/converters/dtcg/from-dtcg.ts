/**
 * Convert a spec-conformant DTCG document (with optional resolver) into
 * the FigmaExportFormat consumed by the plugin.
 *
 * Input shape:
 *   - A single token document → produces one Figma mode named "Default".
 *   - A token document + resolver → resolves the resolver across every
 *     declared modifier context, treating each context as a Figma mode.
 *     The default context becomes the first (default) mode.
 *
 * The legacy `$extensions["dev.styleframe"].modes` format and the
 * historical `$modifiers` placement inside token documents are NOT
 * supported. Documents using the legacy shape will be parsed (since the
 * shape is just JSON) but mode information will be ignored — callers
 * should migrate to the resolver flow.
 */

import { applyInheritance, resolveResolver, walk } from "@styleframe/dtcg";
import type {
	DTCGAnyToken,
	DTCGDocument,
	DTCGFileLoader,
	DTCGResolverDocument,
} from "@styleframe/dtcg";
import type {
	FigmaExportFormat,
	FigmaExportVariable,
	FigmaVariableType,
	FigmaVariableValue,
} from "../../types";
import {
	dtcgPathToFigma,
	dtcgTypeToFigma,
	dtcgValueToFigma,
} from "./figma-bridge";

export interface FromDTCGOptions {
	/** Collection name. Defaults to `"Design Tokens"`. */
	collectionName?: string;
	/** Default mode name when the input has no resolver. Defaults to `"Default"`. */
	defaultModeName?: string;
}

export interface FromDTCGResolverOptions extends FromDTCGOptions {
	fileLoader: DTCGFileLoader;
	/**
	 * Name of the modifier whose contexts become Figma modes. Defaults to
	 * `"theme"`. The modifier's `default` (or its first context) becomes
	 * the Figma default mode.
	 */
	modeModifier?: string;
}

interface VariableAccumulator {
	variable: FigmaExportVariable;
}

function pathToFigmaName(path: string): string {
	return dtcgPathToFigma(path);
}

function isBooleanToken(token: DTCGAnyToken): boolean {
	const ext = token.$extensions as Record<string, unknown> | undefined;
	const sf = ext?.["dev.styleframe"] as Record<string, unknown> | undefined;
	return sf?.boolean === true;
}

function tokenToFigmaVariable(
	path: string,
	token: DTCGAnyToken,
	modeName: string,
): FigmaExportVariable {
	const figmaName = pathToFigmaName(path);

	if (isBooleanToken(token)) {
		const conversion = dtcgValueToFigma(token.$value, "STRING");
		const values: Record<string, FigmaVariableValue> = {};
		let aliasTo: string | undefined;
		if (conversion.kind === "alias") {
			values[modeName] = { type: "VARIABLE_ALIAS", id: conversion.id };
			aliasTo = conversion.id;
		} else {
			const raw =
				conversion.kind === "value" ? conversion.value : conversion.value;
			values[modeName] = (raw === "true") as FigmaVariableValue;
		}
		const variable: FigmaExportVariable = {
			name: figmaName,
			styleframeName: path,
			type: "BOOLEAN",
			values,
		};
		if (token.$description !== undefined) {
			variable.description = token.$description;
		}
		if (aliasTo !== undefined) {
			variable.aliasTo = aliasTo;
		}
		return variable;
	}

	const requestedType = dtcgTypeToFigma(token.$type);
	const conversion = dtcgValueToFigma(token.$value, requestedType);

	const values: Record<string, FigmaVariableValue> = {};
	let resolvedType: FigmaVariableType = requestedType;
	let aliasTo: string | undefined;

	if (conversion.kind === "alias") {
		values[modeName] = { type: "VARIABLE_ALIAS", id: conversion.id };
		aliasTo = conversion.id;
	} else if (conversion.kind === "value") {
		resolvedType = conversion.figmaType;
		values[modeName] = conversion.value as FigmaVariableValue;
	} else {
		resolvedType = "STRING";
		values[modeName] = conversion.value;
	}

	const variable: FigmaExportVariable = {
		name: figmaName,
		styleframeName: path,
		type: resolvedType,
		values,
	};
	if (token.$description !== undefined) {
		variable.description = token.$description;
	}
	if (aliasTo !== undefined) {
		variable.aliasTo = aliasTo;
	}
	return variable;
}

function buildSingleModeFormat(
	doc: DTCGDocument,
	modeName: string,
	collectionName: string,
): FigmaExportFormat {
	const inherited = applyInheritance(doc);
	const variables: Array<FigmaExportVariable> = [];
	for (const { path, token } of walk(inherited)) {
		const variable = tokenToFigmaVariable(path, token, modeName);
		if (Object.keys(variable.values).length > 0) {
			variables.push(variable);
		}
	}
	return { collection: collectionName, modes: [modeName], variables };
}

/**
 * Convert a single DTCG document (no resolver) to a single-mode
 * FigmaExportFormat.
 */
export function fromDTCG(
	doc: DTCGDocument,
	options: FromDTCGOptions = {},
): FigmaExportFormat {
	const modeName = options.defaultModeName ?? "Default";
	const collection = options.collectionName ?? "Design Tokens";
	return buildSingleModeFormat(doc, modeName, collection);
}

/**
 * Convert a Resolver Module document (with optional inputs) into a
 * multi-mode FigmaExportFormat. Each declared context of the chosen
 * modifier becomes a Figma mode.
 */
export async function fromDTCGResolver(
	resolver: DTCGResolverDocument,
	options: FromDTCGResolverOptions,
): Promise<FigmaExportFormat> {
	const collection = options.collectionName ?? "Design Tokens";
	const modeModifier = options.modeModifier ?? "theme";
	const modifier = resolver.modifiers?.[modeModifier];
	if (!modifier) {
		throw new Error(
			`Resolver does not define a "${modeModifier}" modifier — cannot derive Figma modes`,
		);
	}
	const contextNames = Object.keys(modifier.contexts);
	const defaultContext = modifier.default ?? contextNames[0];
	if (!defaultContext) {
		throw new Error(`Modifier "${modeModifier}" has no contexts`);
	}
	const orderedModes = [
		defaultContext,
		...contextNames.filter((c) => c !== defaultContext),
	];

	const accumulators = new Map<string, VariableAccumulator>();

	for (const modeName of orderedModes) {
		const resolved = await resolveResolver(
			resolver,
			{ [modeModifier]: modeName },
			options.fileLoader,
		);
		const inherited = applyInheritance(resolved);
		for (const { path, token } of walk(inherited)) {
			const figmaName = pathToFigmaName(path);
			const isBoolean = isBooleanToken(token);
			const requestedType = isBoolean ? "STRING" : dtcgTypeToFigma(token.$type);
			const conversion = dtcgValueToFigma(token.$value, requestedType);

			let acc = accumulators.get(figmaName);
			if (!acc) {
				acc = {
					variable: {
						name: figmaName,
						styleframeName: path,
						type: isBoolean ? "BOOLEAN" : requestedType,
						values: {},
					},
				};
				if (token.$description !== undefined) {
					acc.variable.description = token.$description;
				}
				accumulators.set(figmaName, acc);
			}

			if (conversion.kind === "alias") {
				const aliasValue = {
					type: "VARIABLE_ALIAS" as const,
					id: conversion.id,
				};
				acc.variable.values[modeName] = aliasValue;
				if (modeName === defaultContext) {
					acc.variable.aliasTo = conversion.id;
				}
			} else if (isBoolean) {
				const raw =
					conversion.kind === "value" ? conversion.value : conversion.value;
				acc.variable.values[modeName] = (raw === "true") as FigmaVariableValue;
				if (modeName === defaultContext) {
					acc.variable.type = "BOOLEAN";
				}
			} else if (conversion.kind === "value") {
				if (modeName === defaultContext) {
					acc.variable.type = conversion.figmaType;
				}
				acc.variable.values[modeName] = conversion.value as FigmaVariableValue;
			} else {
				if (modeName === defaultContext) {
					acc.variable.type = "STRING";
				}
				acc.variable.values[modeName] = conversion.value;
			}
		}
	}

	return {
		collection,
		modes: orderedModes,
		variables: [...accumulators.values()].map((a) => a.variable),
	};
}
