/**
 * Regex pattern to match Styleframe utility class names.
 *
 * Matches patterns like:
 * - _margin:sm (base utility)
 * - _hover:margin:sm (with modifier)
 * - _dark:hover:background:primary (multiple modifiers)
 * - _margin:[16px] (arbitrary value)
 * - _background:[#1E3A8A] (arbitrary color)
 * - _hidden (default value, no suffix)
 * - _background:color.primary (dotted reference)
 *
 * Pattern breakdown:
 * - `_` - Required prefix
 * - `[a-zA-Z][a-zA-Z0-9-]*` - First segment (modifier or name)
 * - `(?::[a-zA-Z0-9._-]+|\:\[[^\]]+\])*` - Additional segments with `:` separator
 */
export const UTILITY_CLASS_PATTERN = /_[a-zA-Z][a-zA-Z0-9-]*(?::[a-zA-Z0-9._-]+|:\[[^\]]+\])*/g;

/**
 * Pattern to extract the value from an arbitrary value bracket notation.
 * Matches: [16px], [#1E3A8A], [10px_20px], etc.
 */
export const ARBITRARY_VALUE_PATTERN = /^\[(.+)\]$/;

/**
 * Default file extensions to scan for utility classes
 */
export const DEFAULT_EXTENSIONS = [
	"html",
	"htm",
	"vue",
	"svelte",
	"jsx",
	"tsx",
	"js",
	"ts",
	"astro",
	"mdx",
	"php",
	"erb",
	"twig",
	"blade.php",
];

/**
 * Glob patterns to ignore when scanning
 */
export const DEFAULT_IGNORE_PATTERNS = [
	"**/node_modules/**",
	"**/.git/**",
	"**/dist/**",
	"**/build/**",
	"**/.next/**",
	"**/.nuxt/**",
	"**/coverage/**",
];
