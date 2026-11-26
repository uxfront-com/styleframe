/**
 * Generates a deterministic, CSS-safe hash string from an arbitrary value.
 * Uses DJB2 algorithm for fast, low-collision hashing.
 *
 * @param value - The string value to hash
 * @returns A lowercase hex string of 7 characters (e.g., "a1b2c3d")
 */
export function hashValue(value: string): string {
	let hash = 5381;
	for (let i = 0; i < value.length; i++) {
		hash = ((hash << 5) + hash + value.charCodeAt(i)) & 0xff_ff_ff_ff;
	}
	return (hash >>> 0).toString(16).padStart(7, "0").slice(0, 7);
}
