import type { Styleframe } from "@styleframe/core";

import {
	useSanitizeBaseSelectors,
	useSanitizeFormsSelectors,
	useSanitizeReduceMotionSelectors,
	useSanitizeTypographySelectors,
} from "../sanitize";

/**
 * Configuration for which sanitize.css categories to apply.
 *
 * - Omit or set to `undefined` to enable the category (default)
 * - Set to `false` to disable a specific category
 */
export interface SanitizeConfig {
	/** Base normalization rules (box-sizing, margins, etc.) */
	base?: boolean;
	/** Form element normalization (appearance, typography inheritance, etc.) */
	forms?: boolean;
	/** System font stack defaults for UI and monospace text */
	typography?: boolean;
	/** Disable animations and transitions for prefers-reduced-motion */
	reduceMotion?: boolean;
}

/**
 * Applies sanitize.css normalization rules as Styleframe selectors.
 *
 * Implements the full sanitize.css library:
 * - Base: Cross-browser defaults and normalization
 * - Forms: Consistent form element styling
 * - Typography: System font stacks
 * - Reduce Motion: Respects prefers-reduced-motion preference
 *
 * Each category can be individually enabled (default) or disabled
 * by setting its config key to `false`.
 *
 * @param s - The Styleframe instance to register selectors with
 * @param config - Configuration for which categories to apply
 */
export function useSanitizePreset(s: Styleframe, config: SanitizeConfig = {}): void {
	if (config.base !== false) {
		useSanitizeBaseSelectors(s);
	}
	if (config.forms !== false) {
		useSanitizeFormsSelectors(s);
	}
	if (config.typography !== false) {
		useSanitizeTypographySelectors(s);
	}
	if (config.reduceMotion !== false) {
		useSanitizeReduceMotionSelectors(s);
	}
}
