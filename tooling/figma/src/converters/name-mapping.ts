/**
 * Convert Styleframe variable name to Figma format
 * @example "color.primary" → "color/primary"
 */
export function styleframeToFigmaName(name: string): string {
	return name.replaceAll(".", "/");
}

/**
 * Convert Figma variable name to Styleframe format
 * @example "color/primary" → "color.primary"
 */
export function figmaToStyleframeName(name: string): string {
	return name.replaceAll("/", ".");
}

/**
 * Extract the category (first segment) from a variable name
 * @example "color.primary.500" → "color"
 * @example "color/primary/500" → "color"
 */
export function extractCategory(name: string): string {
	const separator = name.includes("/") ? "/" : ".";
	return name.split(separator)[0] ?? "";
}

/**
 * Extract the key (last segment) from a variable name
 * @example "color.primary.500" → "500"
 * @example "spacing.md" → "md"
 */
export function extractKey(name: string): string {
	const separator = name.includes("/") ? "/" : ".";
	const parts = name.split(separator);
	return parts.at(-1) ?? "";
}

/**
 * Convert a Styleframe variable name to a camelCase JavaScript identifier
 * @example "color.primary" → "colorPrimary"
 * @example "spacing.md" → "spacingMd"
 */
export function toVariableIdentifier(name: string): string {
	const styleframeName = name.includes("/")
		? figmaToStyleframeName(name)
		: name;
	return styleframeName
		.split(".")
		.map((part, index) =>
			index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
		)
		.join("");
}

/**
 * Convert a CSS custom property name to Styleframe format
 * @example "--color--primary" → "color.primary"
 */
export function cssVariableToStyleframeName(cssName: string): string {
	return cssName.replace(/^--/, "").replaceAll("--", ".");
}

/**
 * Convert a Styleframe name to CSS custom property format
 * @example "color.primary" → "--color--primary"
 */
export function styleframeToCssVariable(name: string): string {
	return `--${name.replaceAll(".", "--")}`;
}
