import type { Styleframe, TokenValue, UtilityAutogenerateFn, Variable } from "@styleframe/core";
import { transformUtilityKey } from "@styleframe/core";

/**
 * Check if a value is a numeric string or number (including negative numbers and decimals).
 *
 * @example
 * isNumericValue(1) // true
 * isNumericValue("1.5") // true
 * isNumericValue("-0.5") // true
 * isNumericValue(".5") // true
 * isNumericValue("sm") // false
 * isNumericValue("1rem") // false
 */
export function isNumericValue(value: unknown): value is string | number {
	if (typeof value === "number") {
		return true;
	}
	if (typeof value === "string") {
		// Match integers, decimals, and negative numbers: 1, 1.5, -1, -0.5, .5
		return /^-?\d*\.?\d+$/.test(value.trim());
	}
	return false;
}

export interface CreateMultiplierAutogenerateOptions {
	/** The Styleframe instance (required for css template literal) */
	s: Styleframe;
	/** The base variable to multiply against (variable object or variable name string) */
	baseVariable: Variable | string;
	/** Fallback value if the base variable is not defined (e.g., "1rem") */
	fallback?: string;
	/** Optional key replacer function for non-multiplier values */
	replacer?: (key: string) => string;
	/** Optional namespace for token references (e.g., "spacing" makes "@sm" resolve to ref("spacing.sm")) */
	namespace?: string | Array<string>;
}

/**
 * Creates an autogenerate function that handles @-prefixed numeric multiplier values.
 *
 * When a value like "@1.5" is detected (@ prefix + numeric), it generates:
 * - key: the numeric value as string (e.g., "1.5")
 * - value: calc(var(--baseVariable, fallback) * multiplier)
 *
 * Non-multiplier values fall back to the default transformUtilityKey behavior.
 *
 * @example
 * ```typescript
 * const autogenerate = createMultiplierAutogenerate({
 *     s,
 *     baseVariable: "spacing",
 *     fallback: "1rem",
 * });
 *
 * // Usage with utility:
 * const createMargin = s.utility("margin", ({ value }) => ({ margin: value }), { autogenerate });
 * createMargin(["@1.5", "@2", "@-1"]);
 * // Generates:
 * // ._margin:1.5 { margin: calc(var(--spacing, 1rem) * 1.5); }
 * // ._margin:2 { margin: calc(var(--spacing, 1rem) * 2); }
 * // ._margin:-1 { margin: calc(var(--spacing, 1rem) * -1); }
 * ```
 */
export function createMultiplierAutogenerate(
	options: CreateMultiplierAutogenerateOptions,
): UtilityAutogenerateFn {
	const { s, baseVariable, fallback, replacer = (v) => v, namespace } = options;
	const defaultAutogenerate = transformUtilityKey(namespace ? { replacer, namespace } : replacer);

	return (value: TokenValue): Record<string, TokenValue> => {
		// Handle @-prefixed numeric multiplier values (e.g., "@1.5", "@2", "@-1")
		if (typeof value === "string" && value[0] === "@") {
			const unprefixed = value.slice(1);
			if (isNumericValue(unprefixed)) {
				const multiplier = unprefixed.trim();
				const calcValue = s.css`calc(${s.ref(baseVariable, fallback)} * ${multiplier})`;
				return {
					[multiplier]: calcValue,
				};
			}
		}

		// Fall back to default behavior for non-multiplier values
		return defaultAutogenerate(value);
	};
}
