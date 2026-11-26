import type {
	ModifierFactory,
	Styleframe,
	TokenValue,
	UtilityCallbackFn,
	UtilityCreatorFn,
} from "@styleframe/core";

export interface UseUtilityOptions {
	/** Override the utility name (CSS class prefix) */
	name?: string;
}

export interface CreateUseUtilityOptions<
	Defaults extends Record<string, TokenValue>,
> {
	/** Default values for the utility */
	defaults?: Defaults;
	/** Whether to merge user values with defaults (true) or replace them (false) */
	mergeDefaults?: boolean;
	/**
	 * Optional namespace for token references in autogenerate.
	 * When set, "@sm" in array syntax resolves to ref("namespace.sm").
	 */
	namespace?: string | Array<string>;
}

/**
 * Creates a generic composable function for a CSS utility.
 *
 * This factory function generates `use*Utility` composables (like `useMarginUtility`, `usePaddingUtility`, etc.)
 * from a utility name and factory function.
 *
 * @param utilityName - The utility name (e.g., 'margin', 'padding')
 * @param factory - Function that receives { value } and returns CSS declarations
 * @param options - Configuration options
 * @returns A composable function that creates utilities for the given property
 *
 * @example
 * ```typescript
 * // Create a useMarginUtility composable
 * export const useMarginUtility = createUseUtility(
 *     'm',
 *     ({ value }) => ({ margin: value })
 * );
 *
 * // Usage
 * const s = styleframe();
 * const createMargin = useMarginUtility(s, {
 *     sm: '0.5rem',
 *     md: '1rem',
 *     lg: '1.5rem',
 * });
 * ```
 */
export function createUseUtility<
	UtilityName extends string,
	Defaults extends Record<string, TokenValue> = Record<string, TokenValue>,
>(
	utilityName: UtilityName,
	factory: UtilityCallbackFn,
	options: CreateUseUtilityOptions<Defaults> = {},
) {
	const { defaults, mergeDefaults = false, namespace } = options;

	return function useUtility<T extends Record<string, TokenValue> = Defaults>(
		s: Styleframe,
		values?: T,
		modifiers?: Array<ModifierFactory | Array<ModifierFactory>>,
		utilityOptions?: UseUtilityOptions,
	): UtilityCreatorFn {
		const resolvedName = utilityOptions?.name ?? utilityName;
		const createUtility = s.utility(resolvedName, factory, { namespace });

		// Only call creator if values are provided (or defaults exist)
		const resolvedValues = mergeDefaults
			? { ...defaults, ...values }
			: (values ?? defaults);

		if (resolvedValues && Object.keys(resolvedValues).length > 0) {
			createUtility(resolvedValues as Record<string, TokenValue>, modifiers);
		}

		return createUtility;
	};
}
