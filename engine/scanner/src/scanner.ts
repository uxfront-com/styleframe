import type { Extractor, ParsedUtility, ScannerUtilitiesConfig } from "./types";
import { extractClasses } from "./extractor";
import { parseUtilityClass } from "./parser";

/**
 * Quick utility to scan content and get parsed utilities.
 *
 * @param content Content string to scan
 * @param filePath Optional file path hint for extractor selection
 * @param utilities Optional custom utility syntax configuration
 * @returns Array of parsed utilities
 */
export function quickScan(
	content: string,
	filePath = "inline.html",
	utilities?: ScannerUtilitiesConfig,
): Array<ParsedUtility> {
	const parseFn = utilities?.parse ?? parseUtilityClass;
	const classNames = extractClasses(
		content,
		filePath,
		undefined,
		utilities?.pattern,
	);
	return classNames.map(parseFn).filter((p): p is ParsedUtility => p !== null);
}

/**
 * Create a scanner that only scans specific content.
 *
 * Useful for testing or one-off scans.
 */
export function createContentScanner(
	customExtractors?: Array<Extractor>,
	utilities?: ScannerUtilitiesConfig,
): (content: string, filePath?: string) => Array<ParsedUtility> {
	const parseFn = utilities?.parse ?? parseUtilityClass;
	return (content: string, filePath = "inline"): Array<ParsedUtility> => {
		const classNames = extractClasses(
			content,
			filePath,
			customExtractors,
			utilities?.pattern,
		);
		return classNames
			.map(parseFn)
			.filter((p): p is ParsedUtility => p !== null);
	};
}
