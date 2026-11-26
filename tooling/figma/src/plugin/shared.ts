import { applyInheritance, isToken, walk } from "@styleframe/dtcg";
import type { DTCGDocument, DTCGResolverDocument } from "@styleframe/dtcg";

/**
 * True iff `data` looks like a DTCG token document. Distinguishes against
 * the legacy Figma export format (which has top-level `collection`,
 * `modes`, and `variables` keys).
 */
export function isDTCGFormat(data: unknown): data is DTCGDocument {
	if (typeof data !== "object" || data === null) {
		return false;
	}
	const obj = data as Record<string, unknown>;
	if ("collection" in obj && "modes" in obj && "variables" in obj) {
		return false;
	}
	if (isDTCGResolver(obj)) {
		return false;
	}
	for (const [key, value] of Object.entries(obj)) {
		if (key.startsWith("$")) {
			continue;
		}
		if (typeof value !== "object" || value === null) {
			continue;
		}
		if (isToken(value)) {
			return true;
		}
		// Check one level deeper to recognise grouped tokens.
		for (const [, nested] of Object.entries(value as Record<string, unknown>)) {
			if (isToken(nested)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * True iff `data` looks like a DTCG Resolver Module document — has
 * `version: "2025.10"` and a `resolutionOrder` array.
 */
export function isDTCGResolver(data: unknown): data is DTCGResolverDocument {
	if (typeof data !== "object" || data === null) {
		return false;
	}
	const obj = data as Record<string, unknown>;
	return obj.version === "2025.10" && Array.isArray(obj.resolutionOrder);
}

export interface PreviewVariable {
	name: string;
	type: string;
}

/**
 * Extract variables from a DTCG document for preview in the plugin UI.
 * Applies inheritance so every variable carries an effective `$type`.
 */
export function extractDTCGVariables(doc: DTCGDocument): Array<PreviewVariable> {
	const inherited = applyInheritance(doc);
	const variables: Array<PreviewVariable> = [];
	for (const { path, token } of walk(inherited)) {
		variables.push({
			name: path.replaceAll(".", "/"),
			type: (token.$type ?? "string").toUpperCase(),
		});
	}
	return variables;
}
