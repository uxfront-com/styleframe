import type { RuntimeVariantDeclarationsBlock } from "@styleframe/core";
export type {
	PrimitiveTokenValue,
	TokenValue,
	RecipeRuntime,
	RuntimeModifierDeclarationsBlock,
	RuntimeVariantDeclarationsBlock,
	RuntimeVariantDeclarationsValue,
	ShorteningMap,
} from "@styleframe/core";

/**
 * Represents a mapping of variant option names to their runtime declarations.
 * Used for cleaner type assertions when iterating over variant options.
 */
export type RuntimeVariantOptions = Record<string, RuntimeVariantDeclarationsBlock | undefined>;

/**
 * Extracts the variant props type from a RecipeRuntime.
 * Maps each variant key to its possible option values.
 *
 * @example
 * ```ts
 * const runtime = {
 *     variants: {
 *         color: { primary: {...}, secondary: {...} },
 *         size: { sm: {...}, md: {...} },
 *     },
 * } as const;
 *
 * type Props = RecipeVariantProps<typeof runtime>;
 * // { color?: 'primary' | 'secondary', size?: 'sm' | 'md' }
 * ```
 */
export type RecipeVariantProps<R> = R extends {
	variants?: infer V;
}
	? V extends Record<string, Record<string, unknown> | undefined>
		? string extends keyof V
			? // Generic RecipeRuntime with string index - fall back to Record<string, string>
				Record<string, string>
			: // Specific type with literal keys - extract exact variant keys and options
				{
					[K in keyof V]?: V[K] extends Record<string, unknown>
						? "true" extends keyof V[K]
							? "false" extends keyof V[K]
								? (keyof V[K] & string) | boolean
								: keyof V[K] & string
							: keyof V[K] & string
						: never;
				}
		: Record<string, string>
	: Record<string, string>;
