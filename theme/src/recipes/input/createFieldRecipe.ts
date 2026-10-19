import type { Styleframe, VariantDeclarationsBlock } from "@styleframe/core";
import {
	type RecipeConfig,
	createUseRecipe,
} from "../../utils/createUseRecipe";

/**
 * The shared field surface as a compound-variant array: the nine color×variant
 * combinations plus the `invalid` and `disabled` state overrides, and
 * optionally the `readonly` state. Extracted so sibling recipes can paint the
 * exact same surface without re-declaring it — the Input/Textarea wrappers
 * consume it with the `:focus-within` ring and the read-only state, while the
 * OTP cell consumes it directly on the `<input>` with a `:focus-visible` ring
 * and no read-only state.
 *
 * Order matters: `invalid` precedes `readonly`/`disabled` so its error border
 * wins over the color/variant rules but can still be dimmed by the disabled
 * state. Like the builders below, it is intentionally not re-exported from the
 * package barrel — it is internal to the field recipes family.
 */
export function fieldSurfaceCompoundVariants({
	focusModifier = "focus-within",
	includeReadonly = true,
}: {
	focusModifier?: "focus-within" | "focus-visible";
	includeReadonly?: boolean;
} = {}): NonNullable<RecipeConfig["compoundVariants"]> {
	return [
		// Light color (fixed across themes)
		{
			match: { color: "light", variant: "default" },
			css: {
				background: "@color.white",
				borderColor: "@color.gray-200",
				color: "@color.text",
				"&:hover": {
					borderColor: "@color.gray-300",
				},
				"&:dark": {
					background: "@color.white",
					borderColor: "@color.gray-200",
					color: "@color.text-inverted",
				},
				"&:dark:hover": {
					borderColor: "@color.gray-300",
				},
			},
		},
		{
			match: { color: "light", variant: "soft" },
			css: {
				background: "@color.gray-100",
				borderColor: "@color.gray-200",
				color: "@color.text",
				"&:hover": {
					borderColor: "@color.gray-300",
				},
				"&:dark": {
					background: "@color.gray-100",
					borderColor: "@color.gray-200",
					color: "@color.text-inverted",
				},
				"&:dark:hover": {
					borderColor: "@color.gray-300",
				},
			},
		},
		{
			match: { color: "light", variant: "ghost" },
			css: {
				background: "transparent",
				borderColor: "transparent",
				color: "@color.text",
				"&:dark": {
					background: "transparent",
					borderColor: "transparent",
					color: "@color.text-inverted",
				},
			},
		},

		// Dark color (fixed across themes)
		{
			match: { color: "dark", variant: "default" },
			css: {
				background: "@color.gray-900",
				borderColor: "@color.gray-700",
				color: "@color.white",
				"&:hover": {
					borderColor: "@color.gray-600",
				},
				"&:dark": {
					background: "@color.gray-900",
					borderColor: "@color.gray-700",
					color: "@color.white",
				},
				"&:dark:hover": {
					borderColor: "@color.gray-600",
				},
			},
		},
		{
			match: { color: "dark", variant: "soft" },
			css: {
				background: "@color.gray-800",
				borderColor: "@color.gray-700",
				color: "@color.gray-300",
				"&:hover": {
					borderColor: "@color.gray-600",
				},
				"&:dark": {
					background: "@color.gray-800",
					borderColor: "@color.gray-700",
					color: "@color.gray-300",
				},
				"&:dark:hover": {
					borderColor: "@color.gray-600",
				},
			},
		},
		{
			match: { color: "dark", variant: "ghost" },
			css: {
				background: "transparent",
				borderColor: "transparent",
				color: "@color.gray-300",
				"&:dark": {
					background: "transparent",
					borderColor: "transparent",
					color: "@color.gray-300",
				},
			},
		},

		// Neutral color (adaptive: light in light mode, dark in dark mode)
		{
			match: { color: "neutral", variant: "default" },
			css: {
				background: "@color.white",
				borderColor: "@color.gray-200",
				color: "@color.text",
				"&:hover": {
					borderColor: "@color.gray-300",
				},
				"&:dark": {
					background: "@color.gray-900",
					borderColor: "@color.gray-700",
					color: "@color.white",
				},
				"&:dark:hover": {
					borderColor: "@color.gray-600",
				},
			},
		},
		{
			match: { color: "neutral", variant: "soft" },
			css: {
				background: "@color.gray-100",
				borderColor: "@color.gray-200",
				color: "@color.text",
				"&:hover": {
					borderColor: "@color.gray-300",
				},
				"&:dark": {
					background: "@color.gray-800",
					borderColor: "@color.gray-700",
					color: "@color.gray-300",
				},
				"&:dark:hover": {
					borderColor: "@color.gray-600",
				},
			},
		},
		{
			match: { color: "neutral", variant: "ghost" },
			css: {
				background: "transparent",
				borderColor: "transparent",
				color: "@color.text",
				"&:dark": {
					background: "transparent",
					borderColor: "transparent",
					color: "@color.white",
				},
			},
		},

		// Invalid state — overrides border and focus ring to error color.
		{
			match: { invalid: "true" },
			css: {
				borderColor: "@color.error",
				"&:hover": {
					borderColor: "@color.error",
				},
				[`&:${focusModifier}`]: {
					outlineColor: "@color.error",
				},
				"&:dark": {
					borderColor: "@color.error",
				},
				"&:dark:hover": {
					borderColor: "@color.error",
				},
			},
		},

		// Read-only state — subtle background shift, default cursor.
		...(includeReadonly
			? [
					{
						match: { readonly: "true" },
						css: {
							background: "@color.gray-50",
							cursor: "default",
							"&:dark": {
								background: "@color.gray-800",
							},
						},
					},
				]
			: []),

		// Disabled state — dim, not-allowed cursor. No `pointer-events: none`:
		// it would hide the cursor too.
		{
			match: { disabled: "true" },
			css: {
				opacity: "0.5",
				cursor: "not-allowed",
			},
		},
	];
}

/**
 * Builds a field-wrapper recipe (`.input` / `.textarea`). Merges the shared
 * field surface with per-field `extras` (e.g. the `display`/`alignItems` base
 * deltas, or textarea's `resize` axis) and registers the transparent nested
 * `.${name}-field` reset. The optional `setup` runs additional rules after the
 * field reset (e.g. textarea's resize selectors).
 *
 * Generic over the extra variant axes so the merged variants flow into the
 * recipe's type — `useTextareaRecipe(...)` keeps a precise `resize` axis.
 */
export function createFieldRecipe<
	const ExtraVariants extends Record<
		string,
		Record<string, VariantDeclarationsBlock>
	> = Record<string, Record<string, VariantDeclarationsBlock>>,
>(
	name: string,
	extras: {
		base?: VariantDeclarationsBlock;
		variants?: ExtraVariants;
		compoundVariants?: RecipeConfig["compoundVariants"];
		defaultVariants?: Record<string, string>;
	} = {},
	setup?: (s: Styleframe) => void,
) {
	/** Shared variant axes: color, visual style, size, and the three boolean states. */
	const fieldRecipeVariants = {
		color: {
			light: {},
			dark: {},
			neutral: {},
		},
		variant: {
			default: {},
			soft: {},
			ghost: {},
		},
		size: {
			sm: {
				fontSize: "@font-size.xs",
				paddingTop: "@0.375",
				paddingBottom: "@0.375",
				paddingLeft: "@0.625",
				paddingRight: "@0.625",
				borderRadius: "@border-radius.sm",
			},
			md: {
				fontSize: "@font-size.sm",
				paddingTop: "@0.5",
				paddingBottom: "@0.5",
				paddingLeft: "@0.75",
				paddingRight: "@0.75",
				borderRadius: "@border-radius.md",
			},
			lg: {
				fontSize: "@font-size.md",
				paddingTop: "@0.625",
				paddingBottom: "@0.625",
				paddingLeft: "@0.875",
				paddingRight: "@0.875",
				borderRadius: "@border-radius.md",
			},
		},
		invalid: {
			true: {},
			false: {},
		},
		disabled: {
			true: {},
			false: {},
		},
		readonly: {
			true: {},
			false: {},
		},
	};

	return createUseRecipe(
		name,
		{
			/**
			 * Shared field-recipe definitions for the Input and Textarea families.
			 *
			 * Input is the canonical field recipe; Textarea extends the same surface. Both
			 * the input and textarea recipe files build their parts from the factories
			 * below, so the color/variant/size/state system lives in a single place. These
			 * builders are intentionally not re-exported from the package barrel &mdash;
			 * they are internal to the field recipes.
			 *
			 * Common field-wrapper base, minus `display`/`alignItems` (each field sets its
			 * own: inline-flex/center for input, flex/flex-start for textarea).
			 */
			base: {
				fontFamily: "inherit",
				fontSize: "@font-size.sm",
				fontWeight: "@font-weight.normal",
				lineHeight: "@line-height.normal",
				borderWidth: "@border-width.thin",
				borderStyle: "@border-style.solid",
				borderColor: "transparent",
				borderRadius: "@border-radius.md",
				paddingTop: "@0.5",
				paddingBottom: "@0.5",
				paddingLeft: "@0.75",
				paddingRight: "@0.75",
				background: "transparent",
				color: "@color.text",
				outline: "none",
				transitionProperty: "color, background-color, border-color",
				transitionTimingFunction: "@easing.ease-in-out",
				transitionDuration: "150ms",
				"&:focus-within": {
					outlineWidth: "2px",
					outlineStyle: "solid",
					outlineColor: "@color.primary",
					outlineOffset: "2px",
				},
				...extras.base,
			},
			variants: {
				...fieldRecipeVariants,
				...extras.variants,
			} as typeof fieldRecipeVariants & ExtraVariants,
			/**
			 * The 12 compound variants: 9 color×variant combinations plus the invalid,
			 * read-only, and disabled state overrides, from the shared field surface
			 * (`:focus-within` ring, read-only included), then any per-field extras.
			 */
			compoundVariants: [
				...fieldSurfaceCompoundVariants(),
				...(extras.compoundVariants ?? []),
			],
			/** Shared default selections (everything except textarea's `resize`). */
			defaultVariants: {
				color: "neutral",
				variant: "default",
				size: "md",
				invalid: "false",
				disabled: "false",
				readonly: "false",
				...extras.defaultVariants,
			},
		},
		(s) => {
			useFieldSelector(s, `.${name}-field`);
			setup?.(s);
		},
	);
}

/**
 * Builds an inline addon recipe (prefix/suffix) rendered inside the field
 * wrapper, sharing its surface. `side` selects the inner padding edge:
 * `paddingRight` for a leading prefix, `paddingLeft` for a trailing suffix.
 */
export function createFieldAddonRecipe(
	name: string,
	side: "paddingLeft" | "paddingRight",
) {
	return createUseRecipe(name, {
		base: {
			display: "inline-flex",
			alignItems: "center",
			flexShrink: "0",
			color: "@color.text-weak",
			whiteSpace: "nowrap",
			userSelect: "none",
			"&:dark": {
				color: "@color.gray-400",
			},
		},
		variants: {
			size: {
				sm: { fontSize: "@font-size.xs", [side]: "@0.375", gap: "@0.25" },
				md: { fontSize: "@font-size.sm", [side]: "@0.5", gap: "@0.375" },
				lg: { fontSize: "@font-size.md", [side]: "@0.625", gap: "@0.5" },
			},
		},
		defaultVariants: {
			size: "md",
		},
	});
}

/**
 * Registers the shared reset for the transparent native control nested inside a
 * field wrapper (`.input-field`, `.textarea-field`). The control is transparent,
 * borderless, and has no padding of its own &mdash; it inherits typography and
 * color from the wrapper, which owns the visual field.
 *
 * The `query` argument lets each field recipe target its own nested element, so
 * the same reset backs both the input and textarea recipes.
 */
export function useFieldSelector(s: Styleframe, query: string) {
	const { selector } = s;

	selector(query, {
		flexGrow: "1",
		minWidth: "0",
		width: "100%",
		background: "transparent",
		border: "none",
		outline: "none",
		padding: "0",
		color: "inherit",
		fontFamily: "inherit",
		fontSize: "inherit",
		fontWeight: "inherit",
		lineHeight: "inherit",
		"&::placeholder": {
			color: "@color.text-weakest",
		},
		"&:disabled": {
			cursor: "not-allowed",
		},
	});
}
