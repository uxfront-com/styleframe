import type {
	ModifierFactory,
	Root,
	Utility,
	UtilityFactory,
	UtilitySelectorFn,
	UtilitySelectorOptions,
} from "@styleframe/core";

import type { ImportScanResult } from "./imports";

export type { UtilitySelectorFn, UtilitySelectorOptions };

/**
 * Function that parses a class name string into its structured components.
 * Returns null if the string is not a valid utility class.
 */
export type UtilityClassParseFn = (className: string) => ParsedUtility | null;

/**
 * Configuration for custom utility class syntax.
 * All fields are optional — defaults match the `_modifier:property:value` format.
 */
export interface ScannerUtilitiesConfig {
	/** Regex pattern to extract utility class candidates from content strings. Must use the global (`g`) flag. */
	pattern?: RegExp;
	/** Parse a matched class name into its components (name, value, modifiers) */
	parse?: UtilityClassParseFn;
	/** Generate a raw class name from components (inverse of parse) */
	selector?: UtilitySelectorFn;
}

/**
 * Configuration for the content scanner
 */
export interface ScannerConfig {
	/** Glob patterns for files to scan */
	content: Array<string>;
	/** Custom extraction functions */
	extractors?: Array<Extractor>;
	/** Base directory for glob resolution (defaults to process.cwd()) */
	cwd?: string;
	/** Custom utility class syntax configuration */
	utilities?: ScannerUtilitiesConfig;
}

/**
 * Parsed utility class structure
 */
export interface ParsedUtility {
	/** Original class name as found in content (e.g., "_margin:sm") */
	raw: string;
	/** Utility name (e.g., "margin", "background") */
	name: string;
	/** Value key (e.g., "sm", "primary", "[16px]") */
	value: string;
	/** Applied modifiers in order (e.g., ["hover", "dark"]) */
	modifiers: Array<string>;
	/** Whether this uses arbitrary value syntax [value] */
	isArbitrary: boolean;
	/** The arbitrary value if isArbitrary is true (e.g., "16px") */
	arbitraryValue?: string;
}

/**
 * Match result between a parsed class and a utility factory
 */
export interface UtilityMatch {
	/** The parsed utility class */
	parsed: ParsedUtility;
	/** The matched utility factory, or null if not found */
	factory: UtilityFactory | null;
	/** Matched modifier factories */
	modifierFactories: Array<ModifierFactory>;
	/** Whether the utility value exists in the factory */
	exists: boolean;
}

/**
 * Scan result for a single file
 */
export interface FileScanResult {
	/** Absolute file path */
	path: string;
	/** Set of raw class names found */
	classes: Set<string>;
	/** Parsed utility classes */
	parsed: Array<ParsedUtility>;
	/** Timestamp of last scan */
	lastScanned: number;
}

/**
 * Complete scan result across all files
 */
export interface ScanResult {
	/** Map of file path to scan result */
	files: Map<string, FileScanResult>;
	/** All unique class names found */
	allClasses: Set<string>;
	/** All parsed utilities */
	allParsed: Array<ParsedUtility>;
}

/**
 * Custom extractor function type
 */
export type Extractor = (content: string, filePath: string) => Array<string>;

/**
 * Cache entry for a scanned file
 */
export interface CacheEntry {
	/** Content hash for change detection */
	hash: string;
	/** Cached scan result */
	result: FileScanResult;
	/** Cache timestamp */
	timestamp: number;
}

/**
 * Scanner cache interface
 */
export interface ScannerCache {
	/** Get cached result for a file */
	get(filePath: string): FileScanResult | null;
	/** Cache a scan result */
	set(filePath: string, result: FileScanResult, contentHash: string): void;
	/** Check if a file has valid cache */
	isValid(filePath: string, contentHash: string): boolean;
	/** Get cached result if valid, null otherwise (single lookup) */
	getIfValid(filePath: string, contentHash: string): FileScanResult | null;
	/** Invalidate cache for a file */
	invalidate(filePath: string): void;
	/** Clear all cache entries */
	clear(): void;
}

/**
 * Scanner instance interface
 */
export interface Scanner {
	/** Scan all content files */
	scan(): Promise<ScanResult>;
	/** Scan a single file */
	scanFile(filePath: string): Promise<FileScanResult>;
	/** Scan content string directly */
	scanContent(content: string, filePath?: string): Array<ParsedUtility>;
	/** Match parsed utilities against a root instance */
	match(parsed: Array<ParsedUtility>, root: Root): Array<UtilityMatch>;
	/** Scan all content files for imports of a specific module */
	scanImports(moduleId: string): Promise<ImportScanResult>;
	/** Scan a single file for imports of a specific module */
	scanFileImports(filePath: string, moduleId: string): ImportScanResult;
	/** Start watching content files for changes */
	watch(callback: (result: ScanResult) => void): () => void;
	/** Invalidate cache for a file or all files */
	invalidate(filePath?: string): void;
}

/**
 * Filter function for utilities
 */
export type UtilityFilterFn = (utility: Utility) => boolean;
