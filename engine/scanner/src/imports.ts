import { parseImports } from "importree";
import type { ImportEdge } from "importree";

export interface ImportScanResult {
	specifiers: Set<string>;
	hasNamespace: boolean;
	hasDynamic: boolean;
}

export function createEmptyImportScanResult(): ImportScanResult {
	return {
		specifiers: new Set(),
		hasNamespace: false,
		hasDynamic: false,
	};
}

export function mergeImportScanResults(target: ImportScanResult, source: ImportScanResult): void {
	for (const specifier of source.specifiers) {
		target.specifiers.add(specifier);
	}
	if (source.hasNamespace) {
		target.hasNamespace = true;
	}
	if (source.hasDynamic) {
		target.hasDynamic = true;
	}
}

export function scanFileImports(filePath: string, moduleId: string): ImportScanResult {
	const result = createEmptyImportScanResult();
	let edges: Array<ImportEdge>;

	try {
		edges = parseImports(filePath);
	} catch {
		return result;
	}

	for (const edge of edges) {
		if (edge.path !== moduleId) {
			continue;
		}

		if (edge.isNamespace) {
			result.hasNamespace = true;
		}
		if (edge.isDynamic) {
			result.hasDynamic = true;
		}
		if (edge.specifiers) {
			for (const specifier of edge.specifiers) {
				result.specifiers.add(specifier);
			}
		}
	}

	return result;
}
