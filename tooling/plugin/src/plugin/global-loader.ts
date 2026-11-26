import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import type { Styleframe } from "@styleframe/core";
import {
	clearJitiCache,
	createSharedJiti,
	loadExtensionModule,
	loadModule,
} from "@styleframe/loader";
import type { ExportInfo } from "@styleframe/loader";
import type { Jiti } from "jiti";

import {
	CircularDependencyError,
	ExportCollisionError,
	GlobalInstanceNotInitializedError,
} from "./errors";
import type { PluginGlobalState } from "./state";
import { findExportCollision, resetState } from "./state";

// Global key for injecting the global instance during loading
// This is necessary because jiti loads files in a separate context,
// and we need a way to pass the global instance to the extension shim
const GLOBAL_INSTANCE_KEY = "__STYLEFRAME_GLOBAL_INSTANCE__";

// Extension shim path - created once per process
let extensionShimPath: string | null = null;

/**
 * Get or create the extension shim file.
 * The shim reads the global instance from globalThis and exports it.
 */
function getExtensionShimPath(): string {
	if (extensionShimPath && fs.existsSync(extensionShimPath)) {
		return extensionShimPath;
	}

	const shimContent = `
export function styleframe() {
	const instance = globalThis["${GLOBAL_INSTANCE_KEY}"];
	if (!instance) {
		throw new Error('[styleframe] Global instance not available during loading');
	}
	return instance;
}

export default { styleframe };
`;

	const tempDir = os.tmpdir();
	extensionShimPath = path.join(tempDir, `styleframe-shim-${process.pid}.mjs`);
	fs.writeFileSync(extensionShimPath, shimContent);

	return extensionShimPath;
}

/**
 * Check exports for collisions and throw if found.
 */
function checkExportCollisions(
	state: PluginGlobalState,
	exports: Map<string, ExportInfo>,
	filePath: string,
): void {
	for (const [name] of exports) {
		const collision = findExportCollision(state, name, filePath);
		if (collision) {
			throw new ExportCollisionError(name, collision, filePath);
		}
	}
}

/**
 * Load the config file and initialize the global instance
 */
export async function loadConfigFile(
	state: PluginGlobalState,
	sharedJiti?: Jiti,
): Promise<Styleframe> {
	if (!state.configFile) {
		throw new Error("[styleframe] Config file not set");
	}

	const configPath = state.configFile.path;

	const { instance, exports } = await loadModule(configPath, {
		jiti: sharedJiti,
	});

	// Check for collisions
	checkExportCollisions(state, exports, configPath);

	state.globalInstance = instance;
	state.configFile.exports = exports;
	state.configFile.lastModified = Date.now();

	return instance;
}

/**
 * Load a single *.styleframe.ts file using the global instance
 */
export async function loadStyleframeFile(
	state: PluginGlobalState,
	filePath: string,
	loadOrder: number,
	sharedJiti?: Jiti,
): Promise<void> {
	if (!state.globalInstance) {
		throw new GlobalInstanceNotInitializedError();
	}

	// Circular dependency detection
	if (state.loadingFiles.has(filePath)) {
		throw new CircularDependencyError(filePath, [...state.loadingFiles]);
	}

	state.loadingFiles.add(filePath);

	try {
		// Set the global instance on globalThis for the extension shim to access
		(globalThis as Record<string, unknown>)[GLOBAL_INSTANCE_KEY] = state.globalInstance;

		const { exports } = await loadExtensionModule(filePath, {
			alias: {
				"virtual:styleframe": getExtensionShimPath(),
			},
			jiti: sharedJiti,
		});

		// Check for collisions
		checkExportCollisions(state, exports, filePath);

		// Update file info
		state.files.set(filePath, {
			path: filePath,
			loadOrder,
			exports,
			lastModified: Date.now(),
		});
	} finally {
		state.loadingFiles.delete(filePath);
		// Clean up globalThis
		delete (globalThis as Record<string, unknown>)[GLOBAL_INSTANCE_KEY];
	}
}

/**
 * Load all styleframe files in order
 */
export async function loadAllStyleframeFiles(
	state: PluginGlobalState,
	files: Array<string>,
	sharedJiti?: Jiti,
): Promise<void> {
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (file) {
			await loadStyleframeFile(state, file, i, sharedJiti);
		}
	}
}

/**
 * Create a persistent shared Jiti instance configured for styleframe loading.
 * Includes the virtual:styleframe alias pointing to the extension shim.
 * Uses moduleCache: true so unchanged dependencies stay cached across reloads.
 */
export function createPersistentJiti(userAliases?: Record<string, string>): Jiti {
	return createSharedJiti({
		alias: {
			"virtual:styleframe": getExtensionShimPath(),
			...userAliases,
		},
	});
}

/**
 * Reload the config and all styleframe files.
 * Selectively clears only affected files from the Jiti cache before reloading,
 * so unchanged dependencies remain cached and don't need re-compilation.
 *
 * If reload fails, restores the previous state so the app continues working.
 *
 * @param state - Plugin global state
 * @param files - All styleframe file paths to reload
 * @param sharedJiti - Persistent shared Jiti instance (with moduleCache: true)
 * @param filesToInvalidate - Files to clear from Jiti cache before reloading
 */
export async function reloadAll(
	state: PluginGlobalState,
	files: Array<string>,
	sharedJiti?: Jiti,
	filesToInvalidate?: Array<string>,
): Promise<void> {
	// Save current state before resetting, so we can restore on failure
	const previousGlobalInstance = state.globalInstance;
	const previousConfigExports = state.configFile ? new Map(state.configFile.exports) : null;
	const previousConfigLastModified = state.configFile?.lastModified ?? 0;
	const previousFiles = new Map(state.files);

	// Use provided Jiti or create a fresh one (fallback for non-HMR usage)
	const jiti = sharedJiti ?? createPersistentJiti();

	// Always invalidate entry files (config + styleframe files) because they have
	// side effects on the Styleframe instance that must re-run on every reload.
	// Additionally invalidate any changed dependencies from the importree graph.
	// Unchanged transitive dependencies (theme composables, etc.) stay cached.
	const configPath = state.configFile?.path;
	const entryFiles = [configPath, ...files].filter(Boolean) as Array<string>;
	const allFilesToInvalidate = filesToInvalidate
		? [...new Set([...entryFiles, ...filesToInvalidate])]
		: entryFiles;
	clearJitiCache(jiti, ...allFilesToInvalidate);

	// Clear all state except configPath
	resetState(state);

	try {
		// Reload config
		await loadConfigFile(state, jiti);

		// Reload all files
		await loadAllStyleframeFiles(state, files, jiti);
	} catch (error) {
		// Restore previous state so the app continues working
		state.globalInstance = previousGlobalInstance;
		if (state.configFile && previousConfigExports) {
			state.configFile.exports = previousConfigExports;
			state.configFile.lastModified = previousConfigLastModified;
		}
		for (const [filePath, fileInfo] of previousFiles) {
			state.files.set(filePath, fileInfo);
		}
		state.initialized = previousGlobalInstance !== null;

		throw error;
	}
}
