/**
 * Convert a raw class name to a CSS selector by adding a `.` prefix
 * and escaping special characters.
 */
export function classNameToCssSelector(className: string): string {
	return `.${className.replaceAll(/[[\].#()%,:/]/g, String.raw`\$&`)}`;
}
