import type { Styleframe } from "@styleframe/core";
import type { ExportInfo } from "@styleframe/loader";

/**
 * Information about a discovered *.styleframe.ts file
 */
export interface StyleframeFileInfo {
	/** Absolute path to the file */
	path: string;
	/** Order in which file was loaded (for deterministic variable precedence) */
	loadOrder: number;
	/** Named exports from this file */
	exports: Map<string, ExportInfo>;
	/** Last modification timestamp */
	lastModified: number;
}

/**
 * Global state for the plugin
 */
export interface PluginGlobalState {
	/** The global styleframe instance (from config) */
	globalInstance: Styleframe | null;
	/** Config file info */
	configFile: StyleframeFileInfo | null;
	/** All discovered *.styleframe.ts files (ordered by load order) */
	files: Map<string, StyleframeFileInfo>;
	/** Files currently being loaded (for circular dependency detection) */
	loadingFiles: Set<string>;
	/** Whether initial discovery has completed */
	initialized: boolean;
	/** Full-to-short class name lookup (populated during minified builds) */
	classNameLookup: Record<string, string> | null;
	/** Diagnostics already logged in the current build, keyed by code and path */
	reportedDiagnostics: Set<string>;
}

/**
 * Create a new plugin state instance
 */
export function createPluginState(configPath: string): PluginGlobalState {
	return {
		globalInstance: null,
		configFile: {
			path: configPath,
			loadOrder: -1,
			exports: new Map(),
			lastModified: 0,
		},
		files: new Map(),
		loadingFiles: new Set(),
		initialized: false,
		classNameLookup: null,
		reportedDiagnostics: new Set(),
	};
}

/**
 * Find if an export name is already used by another file.
 * Returns the source file path if collision found, null otherwise.
 */
export function findExportCollision(
	state: PluginGlobalState,
	exportName: string,
	excludeFile: string,
): string | null {
	// Check config file
	if (
		state.configFile &&
		state.configFile.path !== excludeFile &&
		state.configFile.exports.has(exportName)
	) {
		return state.configFile.path;
	}

	// Check other files
	for (const [filePath, fileInfo] of state.files) {
		if (filePath === excludeFile) continue;
		if (fileInfo.exports.has(exportName)) {
			return filePath;
		}
	}
	return null;
}

/**
 * Reset all state (used when config changes)
 */
export function resetState(state: PluginGlobalState): void {
	state.globalInstance = null;
	if (state.configFile) {
		state.configFile.exports.clear();
		state.configFile.lastModified = 0;
	}
	state.files.clear();
	state.loadingFiles.clear();
	state.initialized = false;
	state.classNameLookup = null;
}
