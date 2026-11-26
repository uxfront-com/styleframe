import type { Root, TokenValue } from "@styleframe/core";
import { createUtilityFunction } from "@styleframe/core";
import { isKnownCssProperty } from "./properties";
import type { UtilityMatch } from "./types";

/**
 * Autogenerate function for dynamic utilities.
 * Passes values as literal strings instead of token references,
 * since dynamic utilities have no namespace context.
 */
function dynamicAutogenerate(value: TokenValue): Record<string, TokenValue> {
	if (typeof value === "string" && value[0] === "@") {
		const key = value.slice(1);
		return { [key]: key };
	}
	if (typeof value === "string") {
		return { [value]: value };
	}
	return {};
}

/**
 * Create dynamic utility factories for unmatched utilities whose names
 * are valid CSS properties.
 *
 * Mutates the `matches` array: sets `match.factory` for entries that
 * were previously unmatched but correspond to a known CSS property.
 *
 * @returns Number of newly created factories
 */
export function createDynamicUtilities(
	root: Root,
	matches: Array<UtilityMatch>,
): number {
	const unmatched = matches.filter((m) => m.factory === null);
	if (unmatched.length === 0) {
		return 0;
	}

	const utility = createUtilityFunction(root, root);
	const seen = new Set<string>();
	let count = 0;

	for (const match of unmatched) {
		const { name } = match.parsed;

		if (!isKnownCssProperty(name)) {
			continue;
		}

		if (!seen.has(name)) {
			utility(name, ({ value }) => ({ [name]: value }), {
				autogenerate: dynamicAutogenerate,
			});
			seen.add(name);
			count++;
		}

		const factory = root.utilities.find((u) => u.name === name) ?? null;
		match.factory = factory;
	}

	return count;
}
