import type { ScanResult } from "./types";

/**
 * Cache for compiled glob patterns.
 * Maps normalized glob pattern strings to compiled RegExp objects.
 * Null values indicate non-glob patterns or invalid patterns.
 */
const compiledPatternCache = new Map<string, RegExp | null>();

/**
 * Get or compile a glob pattern to regex.
 * Returns null if the pattern is not a glob or is invalid.
 */
function getCompiledPattern(pattern: string): RegExp | null {
	const normalized = pattern.replaceAll("\\", "/");

	if (compiledPatternCache.has(normalized)) {
		return compiledPatternCache.get(normalized)!;
	}

	// Check if it's a glob pattern
	if (!normalized.includes("**") && !normalized.includes("*") && !normalized.includes("?")) {
		compiledPatternCache.set(normalized, null);
		return null;
	}

	try {
		const regexStr = globToRegex(normalized);
		const regex = new RegExp(`^${regexStr}$`);
		compiledPatternCache.set(normalized, regex);
		return regex;
	} catch {
		compiledPatternCache.set(normalized, null);
		return null;
	}
}

/**
 * Callback type for file change events
 */
export type WatchCallback = (result: ScanResult) => void;

/**
 * Options for creating a watcher
 */
export interface WatcherOptions {
	/** Debounce time in milliseconds (default: 100) */
	debounce?: number;
}

/**
 * Simple debounce utility
 */
export function debounce<T extends (...args: Array<unknown>) => void>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			fn(...args);
			timeoutId = null;
		}, delay);
	};
}

/**
 * Create a file change handler with debouncing.
 *
 * This is a utility for integrating with external file watchers.
 * The actual file watching should be done at the plugin level
 * using Vite's HMR or chokidar.
 *
 * @param callback Function to call when files change
 * @param options Watcher options
 * @returns A debounced change handler
 */
export function createChangeHandler(
	callback: (changedFiles: Array<string>) => void,
	options: WatcherOptions = {},
): {
	onChange: (filePath: string) => void;
	flush: () => void;
} {
	const { debounce: debounceMs = 100 } = options;
	const changedFiles = new Set<string>();
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const flush = () => {
		if (changedFiles.size > 0) {
			const files = [...changedFiles];
			changedFiles.clear();
			callback(files);
		}
	};

	const onChange = (filePath: string) => {
		changedFiles.add(filePath);

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			flush();
			timeoutId = null;
		}, debounceMs);
	};

	return { onChange, flush };
}

/**
 * Escape special regex characters in a string.
 * Escapes: . + ^ $ { } ( ) | [ ] \
 */
function escapeRegexChars(str: string): string {
	return str.replaceAll(/[.+^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Convert a glob pattern to a regex string.
 * Handles **, *, and ? wildcards.
 */
function globToRegex(pattern: string): string {
	// Replace glob wildcards with placeholders, escape regex chars, then restore as regex equivalents
	return pattern
		.replaceAll("**", "<<<GLOBSTAR>>>")
		.replaceAll("*", "<<<STAR>>>")
		.replaceAll("?", "<<<QUESTION>>>")
		.split("<<<GLOBSTAR>>>")
		.map(escapeRegexChars)
		.join(".*")
		.replaceAll("<<<STAR>>>", "[^/]*")
		.replaceAll("<<<QUESTION>>>", ".");
}

/**
 * Check if a file path matches any of the given glob patterns.
 *
 * This is a simple check that looks for common pattern matches.
 * For full glob support, use a library like micromatch.
 */
export function matchesPatterns(filePath: string, patterns: Array<string>): boolean {
	const normalizedPath = filePath.replaceAll("\\", "/");

	for (const pattern of patterns) {
		const compiledRegex = getCompiledPattern(pattern);

		if (compiledRegex !== null) {
			// Glob pattern - use cached regex
			if (compiledRegex.test(normalizedPath)) {
				return true;
			}
		} else {
			// Exact match for non-glob patterns
			const normalizedPattern = pattern.replaceAll("\\", "/");
			if (normalizedPath === normalizedPattern) {
				return true;
			}
		}
	}

	return false;
}
