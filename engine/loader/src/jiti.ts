import { createJiti } from "jiti";
import type { Jiti, JitiOptions } from "jiti";
import path from "node:path";

export type { Jiti, JitiOptions };

/**
 * Creates a shared jiti instance with module caching enabled.
 * Use this when loading multiple styleframe config files to avoid
 * re-compiling shared dependencies.
 *
 * @example
 * ```ts
 * const jiti = createSharedJiti();
 *
 * // Both loads will share cached modules
 * const config1 = await loadConfigurationFromPath('./button.styleframe.ts', { jiti });
 * const config2 = await loadConfigurationFromPath('./badge.styleframe.ts', { jiti });
 *
 * // Invalidate cache when files change (for HMR)
 * clearJitiCache(jiti, './theme/useTokens.ts');
 * ```
 */
export function createSharedJiti(options: JitiOptions = {}): Jiti {
	return createJiti(process.cwd(), {
		interopDefault: true,
		moduleCache: true, // Enable module caching for shared dependencies
		...options,
	});
}

/**
 * Clears specific modules from the jiti cache.
 * Call this when a file changes to ensure it's reloaded on next import.
 *
 * @param jiti - The jiti instance to clear cache from
 * @param filePaths - Absolute paths of files to invalidate
 */
export function clearJitiCache(jiti: Jiti, ...filePaths: Array<string>): void {
	const cache = jiti.cache;
	if (!cache) {
		return;
	}

	for (const filePath of filePaths) {
		const normalizedPath = path.resolve(filePath);

		// Clear from module cache
		if (typeof cache === "object" && cache !== null) {
			// jiti cache is a Map-like structure
			if (cache instanceof Map) {
				// Try various path formats that might be used as keys
				cache.delete(normalizedPath);
				cache.delete(`file://${normalizedPath}`);
			} else if (typeof cache === "object") {
				// Object-based cache
				delete (cache as Record<string, unknown>)[normalizedPath];
				delete (cache as Record<string, unknown>)[`file://${normalizedPath}`];
			}
		}
	}
}

/**
 * Clears the entire jiti module cache.
 * Useful for full rebuilds or when dependency graph is unclear.
 */
export function clearAllJitiCache(jiti: Jiti): void {
	const cache = jiti.cache;
	if (!cache) {
		return;
	}

	if (cache instanceof Map) {
		cache.clear();
	} else if (typeof cache === "object") {
		for (const key of Object.keys(cache)) {
			delete (cache as Record<string, unknown>)[key];
		}
	}
}
