import path from "node:path";

import type { Styleframe } from "@styleframe/core";
import { isRecipe, isSelector, isStyleframe } from "@styleframe/core";
import { createJiti } from "jiti";

import type {
	ExportInfo,
	LoadExtensionModuleResult,
	LoadModuleOptions,
	LoadModuleResult,
} from "./types";

/**
 * Create a jiti instance with standard configuration.
 *
 * @param basePath - Directory to resolve imports from
 * @param alias - Optional alias configuration for virtual modules
 */
export function createLoader(basePath: string, alias?: Record<string, string>) {
	return createJiti(basePath, {
		fsCache: false,
		moduleCache: false,
		alias,
	});
}

/**
 * Track _exportName on recipes and selectors in a module.
 * Returns a map of export info for recipes and selectors.
 */
export function trackExports(module: Record<string, unknown>): Map<string, ExportInfo> {
	const exports = new Map<string, ExportInfo>();

	for (const [name, value] of Object.entries(module)) {
		if (name === "default") {
			continue;
		}

		let type: "recipe" | "selector" | null = null;

		if (isRecipe(value)) {
			type = "recipe";
			value._exportName = name;
		} else if (isSelector(value)) {
			type = "selector";
			value._exportName = name;
		}

		if (type) {
			exports.set(name, { name, type });
		}
	}

	return exports;
}

/**
 * Load a TypeScript/JavaScript module using jiti.
 * Tracks _exportName on recipes/selectors and validates the default export.
 *
 * @param filePath - Absolute path to the module file
 * @param options - Loading options
 */
export async function loadModule(
	filePath: string,
	options: LoadModuleOptions = {},
): Promise<LoadModuleResult> {
	const { alias, validateInstance = true, jiti: sharedJiti } = options;

	const jiti = sharedJiti ?? createLoader(path.dirname(filePath), alias);
	const module = (await jiti.import(filePath)) as Record<string, unknown>;

	if (!module.default) {
		throw new Error(`Missing default export in ${filePath}. Expected a Styleframe instance.`);
	}

	if (validateInstance && !isStyleframe(module.default)) {
		throw new Error(
			`Invalid default export in ${filePath}. Expected a Styleframe instance created with styleframe().`,
		);
	}

	const exports = trackExports(module);

	return {
		module,
		instance: module.default as Styleframe,
		exports,
	};
}

/**
 * Load a module without validating the default export.
 * Useful for extension files that may not have a default export.
 *
 * @param filePath - Absolute path to the module file
 * @param options - Loading options (without validateInstance)
 */
export async function loadExtensionModule(
	filePath: string,
	options: Omit<LoadModuleOptions, "validateInstance"> = {},
): Promise<LoadExtensionModuleResult> {
	const { alias, jiti: sharedJiti } = options;

	const jiti = sharedJiti ?? createLoader(path.dirname(filePath), alias);
	const module = (await jiti.import(filePath)) as Record<string, unknown>;

	const exports = trackExports(module);

	return { module, exports };
}
