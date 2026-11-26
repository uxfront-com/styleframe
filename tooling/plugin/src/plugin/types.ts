import type { TranspileOptions } from "@styleframe/transpiler";
import type { Extractor, ScannerUtilitiesConfig } from "@styleframe/scanner";

export interface Options {
	/** Entry file for the global config (default: './styleframe.config.ts') */
	entry?: string;
	/** Suppress console output */
	silent?: boolean;
	/** Transpiler options */
	transpiler?: TranspileOptions;
	/** Glob patterns for *.styleframe.ts files (default: ['**\/*.styleframe.ts']) */
	include?: Array<string>;
	/** Glob patterns to exclude (default: node_modules, dist, etc.) */
	exclude?: Array<string>;
	/** File loading order strategy (default: 'alphabetical') */
	loadOrder?: "alphabetical" | "depth-first";
	/** Type declaration generation options */
	dts?: {
		/** Enable type declaration generation (default: true) */
		enabled?: boolean;
		/** Output directory for generated types (default: ".styleframe") */
		outDir?: string;
	};
	/** Module resolution options */
	resolve?: {
		/** Path alias mappings (e.g., { '@styleframe/theme': './theme/src/index.ts' }) */
		alias?: Record<string, string>;
	};
	/** Scanner options for auto-detecting utility classes in content files */
	scanner?: {
		/** Glob patterns for content files to scan for utility class names */
		content: Array<string>;
		/** Custom extractor functions for file types not supported by default */
		extractors?: Array<Extractor>;
		/** Custom utility class syntax configuration */
		utilities?: ScannerUtilitiesConfig;
	};
	/** Recipe tree-shaking options */
	recipes?: {
		/** Enable recipe-level tree-shaking (default: true for build, false for dev) */
		treeshake?: boolean;
		/** Recipe names to always include, even if not detected as imported */
		include?: Array<string>;
	};
	/** Shorten utility class names in production builds (default: true when building) */
	minify?:
		| boolean
		| {
				/** Override default short names for properties */
				properties?: Record<string, string>;
				/** Override default short names for values */
				values?: Record<string, string>;
				/** Override default short names for modifiers */
				modifiers?: Record<string, string>;
		  };
}
