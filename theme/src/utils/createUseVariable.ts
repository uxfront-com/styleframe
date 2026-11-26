import { isKeyReferenceValue } from "@styleframe/core";
import type {
	DeclarationsCallbackContext,
	Reference,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { CamelCase } from "scule";
import { camelCase } from "scule";
import type { ExportKeys } from "../types";
import { useFluidClamp } from "../variables/fluid/useFluidClamp";
import { isRangeInput } from "./normalizeRange";
import type { RangeInput } from "./normalizeRange";

/**
 * Creates a generic composable function for a CSS property.
 *
 * This factory function generates `use*` composables (like `useFontFamily`, `useLineHeight`, etc.)
 * from a CSS property name string.
 *
 * @param propertyName - The CSS property name (e.g., 'font-family', 'line-height')
 * @returns A composable function that creates variables for the given property
 *
 * @example
 * ```typescript
 * import { styleframe } from "styleframe";
 * import { createUseVariable } from "styleframe/theme";
 *
 * // Create a useFontFamily composable
 * const useFontFamily = createUseVariable("font-family");
 *
 * const s = styleframe();
 * const { fontFamily, fontFamilyMono } = useFontFamily(s, {
 *   default: "Arial, sans-serif",
 *   mono: "Courier, monospace",
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Create a useLineHeight composable
 * const useLineHeight = createUseVariable("line-height");
 *
 * const s = styleframe();
 * const { lineHeight, lineHeightTight, lineHeightLoose } = useLineHeight(s, {
 *   default: "1.5",
 *   tight: "1.25",
 *   loose: "1.75",
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Fluid-aware composable: ranges are clamped between viewport breakpoints.
 * const useFontSize = createUseVariable("font-size", { fluid: true });
 *
 * const s = styleframe();
 * useFluidViewportDesignTokens(s);
 * const { fontSize, fontSizeMd, fontSizeSm } = useFontSize(s, {
 *   default: "@font-size.md",
 *   md: [16, 18],          // fluid: clamp 16px → 18px
 *   sm: "0.8rem",           // fixed
 * });
 * ```
 */
export function createUseVariable<
	PropertyName extends string,
	PropertyType = TokenValue,
	Delimiter extends string = ".",
	Defaults extends Record<string, PropertyType> = Record<string, PropertyType>,
	MergeDefaults extends boolean = false,
	Fluid extends boolean = false,
>(
	propertyName: PropertyName,
	{
		defaults,
		mergeDefaults = false as MergeDefaults,
		transform = (value) => value as TokenValue,
		delimiter = "." as Delimiter,
		fluid = false as Fluid,
	}: {
		defaults?: Defaults;
		mergeDefaults?: MergeDefaults;
		transform?: (value: PropertyType) => TokenValue;
		delimiter?: Delimiter;
		/**
		 * When `true`, tuple `[min, max]` and object `{ min, max }` values are
		 * passed through `useFluidClamp` to produce a viewport-interpolated CSS
		 * expression. Plain values flow through `transform` as usual.
		 *
		 * The composable's call signature gains a `breakpoint?: Variable | Reference`
		 * option (defaulting to `s.ref('fluid.breakpoint')`).
		 */
		fluid?: Fluid;
	} = {},
) {
	type WithDefaults<T> = MergeDefaults extends true ? Defaults & T : T;
	type Value = Fluid extends true
		? PropertyType | RangeInput<PropertyType>
		: PropertyType;
	type DefaultsWidened =
		Defaults extends Record<string, Value> ? Defaults : Record<string, Value>;

	return function useVariable<
		Context extends DeclarationsCallbackContext = DeclarationsCallbackContext,
		T extends Record<string, Value> = DefaultsWidened,
	>(
		s: Context,
		tokens?: T,
		{
			default: isDefault = true,
			breakpoint,
		}: {
			default?: boolean;
			breakpoint?: Variable | Reference;
		} = {},
	): ExportKeys<PropertyName, WithDefaults<T>, Delimiter> {
		const result: Record<string, Variable<string>> = {};

		const resolvedTokens = mergeDefaults
			? ({ ...defaults, ...tokens } as T)
			: ((tokens ?? defaults ?? {}) as T);
		const pairs = Object.entries(resolvedTokens);

		pairs.sort(([_aKey, aValue], [_bKey, bValue]) => {
			if (isKeyReferenceValue(aValue)) {
				return 1;
			}
			if (isKeyReferenceValue(bValue)) {
				return -1;
			}
			return 0;
		});

		const createVariableName = (key: string) =>
			`${propertyName}${key === "default" ? "" : `${delimiter}${key}`}` as const;

		const resolvedBreakpoint = fluid
			? (breakpoint ?? s.ref("fluid.breakpoint"))
			: breakpoint;

		for (const [key, value] of pairs) {
			const variableName = createVariableName(key);
			const exportName: CamelCase<typeof variableName> =
				camelCase(variableName);

			let variableValue: TokenValue;
			if (isKeyReferenceValue(value)) {
				variableValue = value as unknown as TokenValue;
			} else if (fluid && isRangeInput<TokenValue>(value)) {
				variableValue = useFluidClamp(s, value, resolvedBreakpoint);
			} else {
				variableValue = transform(value as PropertyType);
			}

			result[exportName] = s.variable(variableName, variableValue, {
				default: isDefault,
			});
		}

		return result as ExportKeys<PropertyName, WithDefaults<T>, Delimiter>;
	};
}
