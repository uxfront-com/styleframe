/**
 * CSS variable names must start with -- and can only contain:
 * - letters (a-z, A-Z)
 * - digits (0-9)
 * - hyphens (-)
 * - underscores (_)
 * - non-ASCII characters (code points >= 0x80)
 */
export function genSafeVariableName(name: string) {
	// Remove -- prefix if present to normalize
	const normalized = name.startsWith("--") ? name.slice(2) : name;

	// Replace invalid characters with hyphens
	// Keep letters, digits, hyphens, underscores, and non-ASCII chars (>= 0x80)
	const sanitized = normalized.replaceAll(/[^a-zA-Z0-9_\-\u0080-\uFFFF]/g, "-");

	// Ensure we have a valid name (not empty after sanitization)
	const validName = sanitized || "unknown-variable";

	return `--${validName}`;
}
