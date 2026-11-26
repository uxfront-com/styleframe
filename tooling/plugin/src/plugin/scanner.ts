import { registerMatchedUtilities } from "@styleframe/scanner";
import type {
	Extractor,
	Scanner,
	ScannerUtilitiesConfig,
} from "@styleframe/scanner";
import { createScanner } from "@styleframe/scanner/node";
import { consola } from "consola";
import type { PluginGlobalState } from "./state";

/**
 * Scanner state managed by the plugin
 */
export interface PluginScannerState {
	/** The scanner instance */
	scanner: Scanner;
	/** Set of absolute file paths from the last scan (used for HMR matching) */
	scannedFiles: Set<string>;
}

/**
 * Create a plugin scanner instance.
 *
 * @param contentPatterns Glob patterns for content files to scan
 * @param cwd Working directory for glob resolution
 * @param extractors Custom extractor functions for unsupported file types
 * @param utilities Custom utility class syntax configuration
 * @returns Plugin scanner state
 */
export function createPluginScanner(
	contentPatterns: Array<string>,
	cwd: string,
	extractors?: Array<Extractor>,
	utilities?: ScannerUtilitiesConfig,
): PluginScannerState {
	const scanner = createScanner({
		content: contentPatterns,
		cwd,
		extractors,
		utilities,
	});

	return {
		scanner,
		scannedFiles: new Set(),
	};
}

/**
 * Full scan: scan all content files and register detected utilities.
 *
 * Used at build start and after reloadAll.
 *
 * @param pluginState The plugin global state
 * @param scannerState The scanner state
 * @param options Options for logging
 * @returns Number of newly registered utility values
 */
export async function scanAndRegister(
	pluginState: PluginGlobalState,
	scannerState: PluginScannerState,
	options?: { silent?: boolean },
): Promise<number> {
	if (!pluginState.globalInstance) {
		return 0;
	}

	const result = await scannerState.scanner.scan();

	// Update tracked files
	scannerState.scannedFiles.clear();
	for (const filePath of result.files.keys()) {
		scannerState.scannedFiles.add(filePath);
	}

	const matches = scannerState.scanner.match(
		result.allParsed,
		pluginState.globalInstance.root,
	);

	const registered = registerMatchedUtilities(
		pluginState.globalInstance.root,
		matches,
	);

	if (!options?.silent) {
		const unmatched = matches.filter((m) => m.factory === null);
		if (unmatched.length > 0) {
			const names = [...new Set(unmatched.map((m) => m.parsed.raw))];
			consola.warn(
				`[styleframe] Scanner found ${unmatched.length} utility class(es) without a matching factory: ${names.join(", ")}`,
			);
		}

		if (registered > 0) {
			consola.info(
				`[styleframe] Scanner registered ${registered} utility value(s) from ${result.files.size} content file(s).`,
			);
		}
	}

	return registered;
}

/**
 * Incremental scan: scan a single file and register any new utilities.
 *
 * Used for HMR when a content file changes.
 *
 * @param pluginState The plugin global state
 * @param scannerState The scanner state
 * @param filePath The changed file path
 * @returns true if new values were registered (CSS needs invalidation)
 */
export async function scanFileAndRegister(
	pluginState: PluginGlobalState,
	scannerState: PluginScannerState,
	filePath: string,
): Promise<boolean> {
	if (!pluginState.globalInstance) {
		return false;
	}

	// Invalidate cache for this file and re-scan it
	scannerState.scanner.invalidate(filePath);
	const fileResult = await scannerState.scanner.scanFile(filePath);

	const matches = scannerState.scanner.match(
		fileResult.parsed,
		pluginState.globalInstance.root,
	);

	const registered = registerMatchedUtilities(
		pluginState.globalInstance.root,
		matches,
	);

	return registered > 0;
}

/**
 * Check if a file is a tracked content file.
 */
export function isContentFile(
	scannerState: PluginScannerState | null,
	filePath: string,
): boolean {
	return scannerState?.scannedFiles.has(filePath) ?? false;
}
