import { readFile } from "node:fs/promises";

import type { Root } from "@styleframe/core";
import fg from "fast-glob";

import { createCache, hashContent } from "./cache";
import { DEFAULT_IGNORE_PATTERNS } from "./constants";
import { extractClasses } from "./extractor";
import type { ImportScanResult } from "./imports";
import {
	scanFileImports as scanFileImportsFn,
	createEmptyImportScanResult,
	mergeImportScanResults,
} from "./imports";
import { matchUtilities } from "./matcher";
import { parseUtilityClass } from "./parser";
import type {
	FileScanResult,
	ParsedUtility,
	Scanner,
	ScannerConfig,
	ScanResult,
	UtilityMatch,
} from "./types";
import { createChangeHandler } from "./watcher";

/**
 * Create a scanner instance for detecting utility classes in content files.
 *
 * @param config Scanner configuration
 * @returns Scanner instance
 *
 * @example
 * ```ts
 * const scanner = createScanner({
 *   content: ['./src/components/*.tsx', './src/pages/*.vue'],
 * });
 *
 * const result = await scanner.scan();
 * const matches = scanner.match(result.allParsed, root);
 * ```
 */
export function createScanner(config: ScannerConfig): Scanner {
	const cache = createCache();
	const cwd = config.cwd ?? process.cwd();
	const customExtractors = config.extractors;
	const utilityPattern = config.utilities?.pattern;
	const utilityParse = config.utilities?.parse ?? parseUtilityClass;

	/**
	 * Get all file paths matching the content patterns.
	 */
	async function getFilePaths(): Promise<Array<string>> {
		return fg(config.content, {
			cwd,
			absolute: true,
			ignore: DEFAULT_IGNORE_PATTERNS,
		});
	}

	/**
	 * Scan a single file for utility classes.
	 */
	async function scanFile(filePath: string): Promise<FileScanResult> {
		const content = await readFile(filePath, "utf8");
		const contentHash = hashContent(content);

		// Check cache with single lookup
		const cached = cache.getIfValid(filePath, contentHash);
		if (cached) {
			return cached;
		}

		// Extract and parse classes
		const classNames = extractClasses(content, filePath, customExtractors, utilityPattern);
		const parsed = classNames.map(utilityParse).filter((p): p is ParsedUtility => p !== null);

		const result: FileScanResult = {
			path: filePath,
			classes: new Set(classNames),
			parsed,
			lastScanned: Date.now(),
		};

		// Update cache
		cache.set(filePath, result, contentHash);

		return result;
	}

	/**
	 * Scan content string directly without file I/O.
	 */
	function scanContent(content: string, filePath = "inline"): Array<ParsedUtility> {
		const classNames = extractClasses(content, filePath, customExtractors, utilityPattern);
		return classNames.map(utilityParse).filter((p): p is ParsedUtility => p !== null);
	}

	/**
	 * Scan all content files.
	 */
	async function scan(): Promise<ScanResult> {
		const filePaths = await getFilePaths();
		const files = new Map<string, FileScanResult>();
		const allClasses = new Set<string>();
		const allParsed: Array<ParsedUtility> = [];

		// Scan files in parallel
		const results = await Promise.all(
			filePaths.map(async (filePath) => {
				try {
					return await scanFile(filePath);
				} catch (error) {
					// Log error but continue scanning other files
					console.warn(`[styleframe/scanner] Failed to scan ${filePath}:`, error);
					return null;
				}
			}),
		);

		// Aggregate results
		for (const result of results) {
			if (result) {
				files.set(result.path, result);
				for (const className of result.classes) {
					allClasses.add(className);
				}
				allParsed.push(...result.parsed);
			}
		}

		return {
			files,
			allClasses,
			allParsed,
		};
	}

	/**
	 * Match parsed utilities against a root instance.
	 */
	function match(parsed: Array<ParsedUtility>, root: Root): Array<UtilityMatch> {
		return matchUtilities(parsed, root);
	}

	/**
	 * Set up file watching with a callback.
	 *
	 * Note: This returns a change handler that should be integrated
	 * with an external file watcher (e.g., Vite's HMR or chokidar).
	 */
	function watch(callback: (result: ScanResult) => void): () => void {
		const { flush } = createChangeHandler(async (changedFiles) => {
			// Invalidate changed files in cache
			for (const filePath of changedFiles) {
				cache.invalidate(filePath);
			}

			// Re-scan all files and notify
			const result = await scan();
			callback(result);
		});

		// Return cleanup function
		// Note: The actual file watcher setup should be done externally
		return () => {
			flush();
		};
	}

	/**
	 * Invalidate cache for a file or all files.
	 */
	function invalidate(filePath?: string): void {
		if (filePath) {
			cache.invalidate(filePath);
		} else {
			cache.clear();
		}
	}

	async function scanImports(moduleId: string): Promise<ImportScanResult> {
		const filePaths = await getFilePaths();
		const result = createEmptyImportScanResult();

		for (const filePath of filePaths) {
			const fileResult = scanFileImportsFn(filePath, moduleId);
			mergeImportScanResults(result, fileResult);
		}

		return result;
	}

	function scanFileImportsMethod(filePath: string, moduleId: string): ImportScanResult {
		return scanFileImportsFn(filePath, moduleId);
	}

	return {
		scan,
		scanFile,
		scanContent,
		match,
		scanImports,
		scanFileImports: scanFileImportsMethod,
		watch,
		invalidate,
	};
}
