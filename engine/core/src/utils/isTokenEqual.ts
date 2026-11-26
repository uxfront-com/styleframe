import { isCSS, isRef } from "../typeGuards";
import type { TokenValue } from "../types";

export function isTokenEqual(a: TokenValue, b: TokenValue): boolean {
	if (a === b) {
		return true;
	}
	if (typeof a !== typeof b) {
		return false;
	}
	if (a === null || b === null) {
		return a === b;
	}
	if (typeof a !== "object" || typeof b !== "object") {
		return false;
	}

	// Handle arrays
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}

		return a.every((item, index) => isTokenEqual(item, b[index]));
	}

	// Handle Reference objects
	if ("type" in a && "type" in b) {
		if (a.type !== b.type) {
			return false;
		}

		if (isRef(a) && isRef(b)) {
			return a.name === b.name && isTokenEqual(a.fallback, b.fallback);
		} else if (isCSS(a) && isCSS(b)) {
			return isTokenEqual(a.value as TokenValue, b.value as TokenValue);
		}
	}

	return false;
}
