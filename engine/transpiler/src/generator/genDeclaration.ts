import { genSafePropertyName } from "./genSafePropertyName";

export function genDeclaration(property: string, value: string): string {
	const normalizedProperty = property.startsWith("--") ? property : genSafePropertyName(property);

	return `${normalizedProperty}: ${value};`;
}
