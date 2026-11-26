import path from "node:path";

import { glob } from "tinyglobby";

import { DEFAULT_IGNORE_PATTERNS } from "./constants";

export interface DiscoveryOptions {
	/** Base directory for glob resolution */
	cwd: string;
	/** Glob patterns for files to include */
	include: Array<string>;
	/** Glob patterns for files to exclude */
	exclude: Array<string>;
}

/**
 * Discover all *.styleframe.ts files in the project
 */
export async function discoverStyleframeFiles(options: DiscoveryOptions): Promise<Array<string>> {
	const patterns = options.include.length > 0 ? options.include : ["**/*.styleframe.ts"];

	const files = await glob(patterns, {
		cwd: options.cwd,
		absolute: true,
		ignore: [...DEFAULT_IGNORE_PATTERNS, ...options.exclude],
	});

	return files;
}

/**
 * Sort files by the specified load order strategy
 */
export function sortByLoadOrder(
	files: Array<string>,
	strategy: "alphabetical" | "depth-first",
): Array<string> {
	const sorted = [...files];

	switch (strategy) {
		case "alphabetical":
			return sorted.sort((a, b) => a.localeCompare(b));

		case "depth-first":
			// Shorter paths first (closer to root), then alphabetical
			return sorted.sort((a, b) => {
				const depthA = a.split(path.sep).length;
				const depthB = b.split(path.sep).length;
				if (depthA !== depthB) {
					return depthA - depthB;
				}
				return a.localeCompare(b);
			});

		default: {
			const _exhaustive: never = strategy;
			throw new Error(`Unknown load order strategy: ${_exhaustive}`);
		}
	}
}
