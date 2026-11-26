/**
 * Generates a random ID string
 *
 * @param length - The length of the random ID to generate (default: 8)
 * @param prefix - Optional prefix to prepend to the random ID
 * @returns A random alphanumeric string with optional prefix
 */
export function generateRandomId(prefix?: string, length: number = 8): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}

	return prefix ? `${prefix}${result}` : result;
}
