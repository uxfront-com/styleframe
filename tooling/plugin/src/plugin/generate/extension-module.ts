/**
 * Generate the extension module content.
 * This is what *.styleframe.ts files receive when they import from 'virtual:styleframe'.
 * It imports the config directly and returns the same instance.
 */
export function generateExtensionModule(configPath: string): string {
	const normalizedPath = configPath.replaceAll("\\", "/");
	return `
import config from '${normalizedPath}';

export function styleframe() {
	return config;
}

export default config;
`;
}
