/// <reference types="@figma/plugin-typings" />

import type { DTCGDocument, DTCGResolverDocument } from "@styleframe/dtcg";
import { fromDTCG, fromDTCGResolver } from "../converters/dtcg/from-dtcg";
import { toDTCG } from "../converters/dtcg/to-dtcg";
import {
	figmaToStyleframeName,
	styleframeToFigmaName,
} from "../converters/name-mapping";
import type {
	FigmaExportFormat,
	FigmaExportVariable,
	FigmaRGBA,
} from "../types";
import { isDTCGFormat } from "./shared";

/**
 * Message types for plugin <-> UI communication
 */
interface ImportMessage {
	type: "import";
	data?: FigmaExportFormat | DTCGDocument;
	/** Per-mode token documents (from `styleframe figma export`). */
	modes?: Record<string, DTCGDocument>;
	resolver?: DTCGResolverDocument;
	tokensRef?: string;
}

interface ExportMessage {
	type: "export";
	collectionId?: string;
	modeId?: string;
}

interface GetCollectionsMessage {
	type: "get-collections";
}

interface CloseMessage {
	type: "close";
}

type PluginMessage =
	| ImportMessage
	| ExportMessage
	| GetCollectionsMessage
	| CloseMessage;

/**
 * Show the plugin UI
 */
figma.showUI(__html__, {
	width: 520,
	height: 640,
	themeColors: true,
});

/**
 * Handle the initial command
 */
figma.on("run", ({ command }) => {
	figma.ui.postMessage({ type: "set-mode", mode: command });
});

/**
 * Handle messages from the UI
 */
figma.ui.onmessage = async (msg: PluginMessage) => {
	try {
		switch (msg.type) {
			case "import":
				await handleImport(
					msg.data,
					msg.resolver,
					msg.tokensRef,
					msg.modes as Record<string, DTCGDocument> | undefined,
				);
				break;
			case "export":
				await handleExport(msg.collectionId, msg.modeId);
				break;
			case "get-collections":
				await sendCollections();
				break;
			case "close":
				figma.closePlugin();
				break;
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		figma.ui.postMessage({ type: "error", message: errorMessage });
	}
};

/**
 * Send available collections to the UI
 */
async function sendCollections(): Promise<void> {
	const collections = await figma.variables.getLocalVariableCollectionsAsync();
	const collectionData = collections.map((c) => ({
		id: c.id,
		name: c.name,
		modes: c.modes.map((m) => ({ id: m.modeId, name: m.name })),
		variableCount: c.variableIds.length,
	}));

	figma.ui.postMessage({ type: "collections", collections: collectionData });
}

/**
 * Import variables from JSON data (supports both DTCG and legacy formats)
 */
async function handleImport(
	rawData: FigmaExportFormat | DTCGDocument | undefined,
	resolver?: DTCGResolverDocument,
	tokensRef?: string,
	perModeDocs?: Record<string, DTCGDocument>,
): Promise<void> {
	let data: FigmaExportFormat;

	if (perModeDocs && Object.keys(perModeDocs).length > 0) {
		const modeNames = Object.keys(perModeDocs);
		const allModes: Array<string> = [];
		const variableMap = new Map<string, FigmaExportVariable>();

		for (const modeName of modeNames) {
			const modeDoc = perModeDocs[modeName]!;
			const modeData = fromDTCG(modeDoc, { defaultModeName: modeName });
			if (!allModes.includes(modeName)) {
				allModes.push(modeName);
			}
			for (const v of modeData.variables) {
				const existing = variableMap.get(v.name);
				if (existing) {
					Object.assign(existing.values, v.values);
				} else {
					variableMap.set(v.name, { ...v, values: { ...v.values } });
				}
			}
		}

		data = {
			collection: fromDTCG(perModeDocs[modeNames[0]!]!).collection,
			modes: allModes,
			variables: [...variableMap.values()],
		};
	} else if (!rawData) {
		throw new Error("No token data provided");
	} else if (resolver && isDTCGFormat(rawData)) {
		// Multi-mode flow: every resolver context becomes a Figma mode. The
		// resolver references the base tokens by `$ref` (typically
		// "tokens.json"); the Figma plugin sandbox can't fetch URLs, so we
		// satisfy the ref from the in-memory uploaded document.
		const baseRef = tokensRef ?? "tokens.json";
		const fileLoader = async (ref: string): Promise<unknown> => {
			if (ref === baseRef) {
				return rawData;
			}
			throw new Error(
				`Resolver references "${ref}" but only "${baseRef}" was uploaded`,
			);
		};
		data = await fromDTCGResolver(resolver, { fileLoader });
	} else if (isDTCGFormat(rawData)) {
		data = fromDTCG(rawData);
	} else {
		data = rawData as FigmaExportFormat;
	}

	const { collection: collectionName, modes, variables } = data;

	// Create or get the collection
	const existingCollections =
		await figma.variables.getLocalVariableCollectionsAsync();
	let collection = existingCollections.find((c) => c.name === collectionName);

	if (!collection) {
		collection = figma.variables.createVariableCollection(collectionName);
	}

	// Setup modes
	const modeIdMap = new Map<string, string>();
	const existingModes = collection.modes;

	// Map first mode to default or rename
	if (modes.length > 0) {
		const defaultMode = existingModes[0];
		if (defaultMode) {
			collection.renameMode(defaultMode.modeId, modes[0] ?? "Default");
			modeIdMap.set(modes[0] ?? "Default", defaultMode.modeId);
		}
	}

	// Add additional modes
	for (let i = 1; i < modes.length; i++) {
		const modeName = modes[i];
		if (!modeName) {
			continue;
		}

		const existingMode = existingModes.find((m) => m.name === modeName);
		if (existingMode) {
			modeIdMap.set(modeName, existingMode.modeId);
		} else {
			const newModeId = collection.addMode(modeName);
			modeIdMap.set(modeName, newModeId);
		}
	}

	// Get existing variables once
	const existingVariables = await figma.variables.getLocalVariablesAsync();

	// Create a map to track created variables for alias resolution.
	// Seed with ALL existing local variables so that alias targets in
	// other collections (e.g. primitives imported separately) and alias
	// variables processed later in the second pass can be found.
	const variableMap = new Map<string, Variable>();
	for (const fv of existingVariables) {
		variableMap.set(fv.name, fv);
	}

	// First pass: create all non-alias variables
	for (const v of variables) {
		if (v.aliasTo) {
			continue;
		} // Skip aliases for now

		const desiredType = getResolvedType(v.type);
		const existing = existingVariables.find(
			(fv) => fv.name === v.name && fv.variableCollectionId === collection.id,
		);

		let figmaVar: Variable;
		if (existing && existing.resolvedType === desiredType) {
			figmaVar = existing;
		} else {
			// Either the variable doesn't exist or it was previously created with
			// a different `resolvedType` (Figma variables can't change type once
			// created — a stale STRING `spacing/md` would silently reject a FLOAT
			// `setValueForMode` and leave the displayed value at 0). Remove the
			// stale binding and recreate with the desired type.
			if (existing) {
				existing.remove();
			}
			figmaVar = figma.variables.createVariable(
				v.name,
				collection,
				desiredType,
			);
		}

		// Set values for each mode. `from-dtcg` downgrades the variable type
		// to STRING whenever the DTCG value can't be represented as the
		// requested Figma type, so by the time we get here `value` and
		// `v.type` should already match. If they ever don't (bug or external
		// caller), surface a warning rather than silently leaving the
		// variable at its default 0/empty.
		for (const [modeName, value] of Object.entries(v.values)) {
			const modeId = modeIdMap.get(modeName);
			if (!modeId) {
				continue;
			}

			if (isVariableAlias(value)) {
				const aliasTarget = variableMap.get(value.id);
				if (aliasTarget) {
					figmaVar.setValueForMode(modeId, {
						type: "VARIABLE_ALIAS",
						id: aliasTarget.id,
					});
				} else {
					console.warn(
						`Alias target "${value.id}" not found for "${v.name}" mode "${modeName}"`,
					);
				}
			} else {
				const figmaValue = convertToFigmaValue(value, v.type);
				if (figmaValue !== null) {
					figmaVar.setValueForMode(modeId, figmaValue);
				} else {
					console.warn(
						`Skipped value for "${v.name}" (mode "${modeName}"): cannot store ${typeof value} in a ${v.type} variable`,
					);
				}
			}
		}

		variableMap.set(v.name, figmaVar);
	}

	// Second pass: create alias variables
	for (const v of variables) {
		if (!v.aliasTo) {
			continue;
		}

		const targetVar = variableMap.get(styleframeToFigmaName(v.aliasTo));
		if (!targetVar) {
			console.warn(`Alias target not found: ${v.aliasTo}`);
			continue;
		}

		const existing = existingVariables.find(
			(fv) => fv.name === v.name && fv.variableCollectionId === collection.id,
		);

		let figmaVar: Variable;
		if (existing) {
			figmaVar = existing;
		} else {
			figmaVar = figma.variables.createVariable(
				v.name,
				collection,
				targetVar.resolvedType,
			);
		}

		for (const [modeName, value] of Object.entries(v.values)) {
			const modeId = modeIdMap.get(modeName);
			if (!modeId) {
				continue;
			}

			if (isVariableAlias(value)) {
				const modeTargetVar = variableMap.get(value.id);
				if (modeTargetVar) {
					figmaVar.setValueForMode(modeId, {
						type: "VARIABLE_ALIAS",
						id: modeTargetVar.id,
					});
				} else {
					console.warn(
						`Alias target "${value.id}" not found for "${v.name}" mode "${modeName}"`,
					);
				}
			} else {
				const figmaValue = convertToFigmaValue(value, v.type);
				if (figmaValue !== null) {
					figmaVar.setValueForMode(modeId, figmaValue);
				} else {
					console.warn(
						`Skipped value for "${v.name}" (mode "${modeName}"): cannot store ${typeof value} in a ${v.type} variable`,
					);
				}
			}
		}

		variableMap.set(v.name, figmaVar);
	}

	figma.ui.postMessage({
		type: "import-complete",
		result: {
			collection: collectionName,
			variablesCreated: variables.length,
		},
	});

	figma.notify(`Imported ${variables.length} variables to "${collectionName}"`);
}

/**
 * Export variables to JSON format
 */
async function handleExport(
	collectionId?: string,
	modeId?: string,
): Promise<void> {
	const collections = await figma.variables.getLocalVariableCollectionsAsync();
	let collection: VariableCollection | undefined;

	if (collectionId) {
		collection = collections.find((c) => c.id === collectionId);
	} else {
		collection = collections[0];
	}

	if (!collection) {
		throw new Error("No variable collection found");
	}

	const exportModes = modeId
		? collection.modes.filter((m) => m.modeId === modeId)
		: collection.modes;
	const modes = exportModes.map((m) => m.name);
	const modeIdToName = new Map(exportModes.map((m) => [m.modeId, m.name]));

	const variables: Array<FigmaExportVariable> = [];
	const variableIdToName = new Map<string, string>();

	// First pass: build ID to name map
	for (const varId of collection.variableIds) {
		const figmaVar = await figma.variables.getVariableByIdAsync(varId);
		if (!figmaVar) {
			continue;
		}
		variableIdToName.set(figmaVar.id, figmaVar.name);
	}

	// Second pass: export variables
	for (const varId of collection.variableIds) {
		const figmaVar = await figma.variables.getVariableByIdAsync(varId);
		if (!figmaVar) {
			continue;
		}

		const values: Record<string, unknown> = {};
		let aliasTo: string | undefined;

		for (const [valModeId, value] of Object.entries(figmaVar.valuesByMode)) {
			const modeName = modeIdToName.get(valModeId);
			if (!modeName) {
				continue;
			}

			if (isVariableAlias(value)) {
				const targetName = variableIdToName.get(value.id);
				if (targetName) {
					aliasTo = figmaToStyleframeName(targetName);
				}
				values[modeName] = value;
			} else {
				values[modeName] = convertFromFigmaValue(value, figmaVar.resolvedType);
			}
		}

		variables.push({
			name: figmaVar.name,
			styleframeName: figmaToStyleframeName(figmaVar.name),
			type: figmaVar.resolvedType,
			values: values as Record<string, FigmaExportVariable["values"][string]>,
			aliasTo,
			description: figmaVar.description || undefined,
		});
	}

	const intermediateData: FigmaExportFormat = {
		collection: collection.name,
		modes,
		variables,
	};

	// Convert to DTCG format
	const exportData = toDTCG(intermediateData);

	figma.ui.postMessage({
		type: "export-complete",
		result: exportData,
	});
}

/**
 * Convert Figma resolved type string
 */
function getResolvedType(type: string): VariableResolvedDataType {
	switch (type) {
		case "COLOR":
			return "COLOR";
		case "FLOAT":
			return "FLOAT";
		case "STRING":
			return "STRING";
		case "BOOLEAN":
			return "BOOLEAN";
		default:
			return "STRING";
	}
}

/**
 * Check if a value is a variable alias
 */
function isVariableAlias(value: unknown): value is VariableAlias {
	return (
		typeof value === "object" &&
		value !== null &&
		"type" in value &&
		(value as { type: string }).type === "VARIABLE_ALIAS"
	);
}

/**
 * Convert a value to Figma format
 */
function convertToFigmaValue(
	value: unknown,
	type: string,
): VariableValue | null {
	if (value === null || value === undefined) {
		return null;
	}

	switch (type) {
		case "COLOR": {
			if (typeof value === "object" && "r" in value) {
				const rgba = value as FigmaRGBA;
				return {
					r: rgba.r,
					g: rgba.g,
					b: rgba.b,
					a: rgba.a ?? 1,
				};
			}
			return null;
		}
		case "FLOAT": {
			// `0` is a legal FLOAT — only return null when the runtime type
			// truly disagrees, never on falsy-zero.
			return typeof value === "number" && Number.isFinite(value) ? value : null;
		}
		case "BOOLEAN": {
			return typeof value === "boolean" ? value : null;
		}
		case "STRING":
		default: {
			return String(value);
		}
	}
}

/**
 * Convert a Figma value to export format
 */
function convertFromFigmaValue(
	value: VariableValue,
	type: VariableResolvedDataType,
): FigmaRGBA | number | string | boolean {
	switch (type) {
		case "COLOR": {
			const rgba = value as RGBA;
			return {
				r: rgba.r,
				g: rgba.g,
				b: rgba.b,
				a: rgba.a,
			};
		}
		case "FLOAT": {
			return value as number;
		}
		case "BOOLEAN": {
			return value as boolean;
		}
		case "STRING":
		default: {
			return String(value);
		}
	}
}
