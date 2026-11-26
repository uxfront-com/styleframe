export type CapitalizeFirst<T extends string> = T extends `${infer First}${infer Rest}`
	? `${Uppercase<First>}${Rest}`
	: T;

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
