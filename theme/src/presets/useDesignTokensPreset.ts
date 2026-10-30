import {
	isKeyReferenceValue,
	type DeclarationsCallbackContext,
	type Styleframe,
	type TokenValue,
	type Variable,
} from "@styleframe/core";
import { defu } from "defu";
import type { CamelCase } from "scule";
import { camelCase } from "scule";
import type { ExportKeys } from "../types";
import {
	borderColorValues,
	borderRadiusValues,
	borderStyleValues,
	borderWidthValues,
	boxShadowValues,
	breakpointValues,
	colorLevelValues,
	colorShadeValues,
	colorTintValues,
	colorValues,
	darkModeBorderColorValues,
	darkModeColorValues,
	durationValues,
	easingValues,
	fluidFontSizeBaseValues,
	fluidScalePowerByKey,
	fluidScaleValues,
	fluidViewportValues,
	fontFamilyValues,
	fontSizeStaticValues,
	fontStyleValues,
	fontWeightValues,
	letterSpacingValues,
	lineHeightValues,
	scalePowerValues,
	scaleValues,
	spacingValues,
	zIndexValues,
} from "../values";
import type { FontSizeFluidDefaults, FontSizeValue } from "../values/fontSize";
import {
	useBorderColorDesignTokens,
	useBorderRadiusDesignTokens,
	useBorderStyleDesignTokens,
	useBorderWidthDesignTokens,
	useBoxShadowDesignTokens,
	useBreakpointDesignTokens,
	useColorDesignTokens,
	useColorLevelDesignTokens,
	useColorShadeDesignTokens,
	useColorTintDesignTokens,
	useDurationDesignTokens,
	useEasingDesignTokens,
	useFluidViewportDesignTokens,
	useFontFamilyDesignTokens,
	useFontSizeDesignTokens,
	useFontStyleDesignTokens,
	useFontWeightDesignTokens,
	useLetterSpacingDesignTokens,
	useLineHeightDesignTokens,
	useScaleDesignTokens,
	useScalePowersDesignTokens,
	useSpacingDesignTokens,
	useZIndexDesignTokens,
} from "../variables";

// =============================================================================
// Domain Registry (single source of truth for types and runtime)
// =============================================================================

interface DomainProcessContext {
	result: Record<string, Variable | TokenValue>;
	config: DesignTokensPresetConfig<boolean>;
}

type DomainComposable = (
	s: DeclarationsCallbackContext,
	values: Record<string, TokenValue>,
	options: { default: boolean },
	context: DomainProcessContext,
) => Record<string, Variable | TokenValue> | undefined;

interface Domain<
	K extends string = string,
	D extends Record<string, TokenValue> = Record<string, TokenValue>,
	C extends boolean | undefined = boolean | undefined,
> {
	key: K;
	defaults: D;
	composable: DomainComposable;
	themes?: Record<string, Record<string, TokenValue>>;
	configurable: C;
	/**
	 * Predicate to determine whether this domain is enabled given the config.
	 * Defaults to `config[camelCase(key)] !== false`. Override for domains
	 * whose enablement is gated by a different config key (e.g., the
	 * `fluid-scale` and `fluid-font-size` domains gate on `fluidFontSize`).
	 */
	enabled?: (config: DesignTokensPresetConfig<boolean>) => boolean;
	/**
	 * Camel-case config keys this domain requires to be enabled (not `false`).
	 * Validated only when this domain is itself enabled. A failed dependency
	 * surfaces as an error so invalid configurations are caught up front
	 * rather than producing silent partial output.
	 */
	requires?: ReadonlyArray<keyof DesignTokensPresetConfig>;
}

/**
 * Defines a domain entry, preserving literal types for `key`, `defaults`,
 * and `configurable` while widening `composable` to `DomainComposable`.
 */
function defineDomain<
	K extends string,
	D extends Record<string, TokenValue>,
	C extends boolean | undefined = undefined,
>(domain: {
	key: K;
	defaults: D;
	composable: DomainComposable;
	themes?: Record<string, Record<string, TokenValue>>;
	configurable?: C;
	enabled?: (config: DesignTokensPresetConfig<boolean>) => boolean;
	requires?: ReadonlyArray<keyof DesignTokensPresetConfig>;
}): Domain<K, D, C> {
	return domain as Domain<K, D, C>;
}

/**
 * Registry of all domains in application order.
 * Order matters — domains that reference variables from other domains
 * (e.g., border-color references color variables) must come after them.
 *
 * Each domain's `key` is a kebab-case identifier. The camelCase config/result
 * key is derived at runtime via `camelCase(key)`.
 */
const domains = [
	defineDomain({
		key: "scale",
		defaults: scaleValues,
		composable: useScaleDesignTokens,
	}),
	defineDomain({
		key: "spacing",
		defaults: spacingValues,
		composable: useSpacingDesignTokens,
	}),
	defineDomain({
		key: "border-width",
		defaults: borderWidthValues,
		composable: useBorderWidthDesignTokens,
	}),
	defineDomain({
		key: "border-radius",
		defaults: borderRadiusValues,
		composable: useBorderRadiusDesignTokens,
	}),
	defineDomain({
		key: "border-style",
		defaults: borderStyleValues,
		composable: useBorderStyleDesignTokens,
	}),
	defineDomain({
		key: "box-shadow",
		defaults: boxShadowValues,
		composable: useBoxShadowDesignTokens,
	}),
	defineDomain({
		key: "z-index",
		defaults: zIndexValues,
		composable: useZIndexDesignTokens,
	}),
	defineDomain({
		key: "font-family",
		defaults: fontFamilyValues,
		composable: useFontFamilyDesignTokens,
	}),
	defineDomain({
		key: "font-size",
		defaults: fontSizeStaticValues,
		composable: (s, values, options, { config }) => {
			if (!isFluidFontSizeEnabled(config)) {
				return useFontSizeDesignTokens(
					s,
					values as Record<string, FontSizeValue>,
					options,
				) as Record<string, Variable | TokenValue>;
			}

			if (config.fluidViewport === false) {
				throw new Error(
					'[useDesignTokensPreset] The "font-size" domain in fluid mode requires `fluidViewport` to be enabled. Either remove the `false` override for `fluidViewport`, or set `fluidFontSize: false` to use the static font-size domain.',
				);
			}

			const fluidDefaults: Record<string, FontSizeValue> = {
				...fluidFontSizeBaseValues,
			};
			for (const [key, power] of Object.entries(fluidScalePowerByKey) as [
				string,
				number | null,
			][]) {
				fluidDefaults[key] =
					power === null
						? "@font-size.md"
						: [
								s.css`${s.ref("font-size.min")} * ${s.ref(`scale.min-powers.${power}`)}`,
								s.css`${s.ref("font-size.max")} * ${s.ref(`scale.max-powers.${power}`)}`,
							];
			}

			const resolvedValues: Record<string, FontSizeValue> =
				config.fontSize !== undefined
					? config.meta?.merge
						? {
								...fluidDefaults,
								...(values as Record<string, FontSizeValue>),
							}
						: (values as Record<string, FontSizeValue>)
					: fluidDefaults;

			return useFontSizeDesignTokens(s, resolvedValues, options) as Record<
				string,
				Variable | TokenValue
			>;
		},
	}),
	defineDomain({
		key: "font-style",
		defaults: fontStyleValues,
		composable: useFontStyleDesignTokens,
	}),
	defineDomain({
		key: "font-weight",
		defaults: fontWeightValues,
		composable: useFontWeightDesignTokens,
	}),
	defineDomain({
		key: "line-height",
		defaults: lineHeightValues,
		composable: useLineHeightDesignTokens,
	}),
	defineDomain({
		key: "letter-spacing",
		defaults: letterSpacingValues,
		composable: useLetterSpacingDesignTokens,
	}),
	defineDomain({
		key: "breakpoint",
		defaults: breakpointValues,
		composable: useBreakpointDesignTokens,
	}),
	defineDomain({
		key: "easing",
		defaults: easingValues,
		composable: useEasingDesignTokens,
	}),
	defineDomain({
		key: "duration",
		defaults: durationValues,
		composable: useDurationDesignTokens,
	}),
	defineDomain({
		key: "colors",
		defaults: colorValues as Record<string, TokenValue>,
		themes: {
			dark: darkModeColorValues,
		},
		composable: (s, values, options, { config }) => {
			// Partition values into base colors (hex) and reference colors (@...)
			const baseColorValues: Record<string, string> = {};
			const referenceColorValues: Record<string, string> = {};

			for (const [key, value] of Object.entries(values)) {
				if (isKeyReferenceValue(value)) {
					referenceColorValues[key] = value as string;
				} else {
					baseColorValues[key] = value as string;
				}
			}

			// Create base color variables + generate variations
			const baseColors = useColorDesignTokens(s, baseColorValues, options);
			let result: Record<string, Variable> = { ...baseColors };

			const meta = defu(config.meta?.colors ?? {}, defaultColorsMetaConfig);

			for (const colorVariable of Object.values(
				baseColors,
			) as Variable<string>[]) {
				const colorKey = colorVariable.name.slice("color.".length);
				const colorOverride = meta.overrides?.[colorKey];

				if (colorOverride?.generateLevels ?? meta.generateLevels) {
					result = {
						...result,
						...useColorLevelDesignTokens(
							s,
							colorVariable,
							meta.levels,
							options,
						),
					};
				}

				if (colorOverride?.generateShades ?? meta.generateShades) {
					result = {
						...result,
						...useColorShadeDesignTokens(
							s,
							colorVariable,
							meta.shadeLevels,
							options,
						),
					};
				}

				if (colorOverride?.generateTints ?? meta.generateTints) {
					result = {
						...result,
						...useColorTintDesignTokens(
							s,
							colorVariable,
							meta.tintLevels,
							options,
						),
					};
				}
			}

			// Create reference color variables (shade/tint vars now exist)
			if (Object.keys(referenceColorValues).length > 0) {
				const referenceColors = useColorDesignTokens(
					s,
					referenceColorValues,
					options,
				);
				result = { ...result, ...referenceColors };
			}

			return result;
		},
	}),
	defineDomain({
		key: "border-color",
		defaults: borderColorValues,
		composable: useBorderColorDesignTokens,
		themes: { dark: darkModeBorderColorValues },
	}),
	defineDomain({
		key: "fluid-viewport",
		defaults: {} as Record<string, TokenValue>,
		configurable: false,
		composable: (s, _values, _options, { config }) => {
			const viewportConfig = config.fluidViewport;
			const options =
				viewportConfig && typeof viewportConfig === "object"
					? { ...fluidViewportValues, ...viewportConfig }
					: fluidViewportValues;

			return useFluidViewportDesignTokens(s as Styleframe, options) as Record<
				string,
				Variable | TokenValue
			>;
		},
	}),
	defineDomain({
		key: "fluid-scale",
		defaults: {} as Record<string, TokenValue>,
		configurable: false,
		enabled: (config) => isFluidFontSizeEnabled(config),
		requires: ["scale", "fluidViewport"],
		composable: (s, _values, _options, { config }) => {
			const { min, max } = { ...fluidScaleValues, ...config.fluidScale };
			const scaleMin = s.variable("scale.min", min, { default: true });
			const scaleMax = s.variable("scale.max", max, { default: true });

			// Materialize per-power variables so default fluidFontSizeValues
			// can reference them via `@scale.min-powers.<n>` / `@scale.max-powers.<n>`.
			const minPowers = useScalePowersDesignTokens(
				s,
				scaleMin,
				scalePowerValues,
			);
			const maxPowers = useScalePowersDesignTokens(
				s,
				scaleMax,
				scalePowerValues,
			);
			for (const n of scalePowerValues) {
				s.variable(`scale.min-powers.${n}`, minPowers[n], { default: true });
				s.variable(`scale.max-powers.${n}`, maxPowers[n], { default: true });
			}

			return { scaleMin, scaleMax };
		},
	}),
	defineDomain({
		key: "scale-powers",
		defaults: {} as Record<string, TokenValue>,
		configurable: false,
		composable: (s, _values, _options, { result, config }) => {
			const scaleVar = result["scale"];
			if (!scaleVar) return undefined;
			return useScalePowersDesignTokens(
				s,
				scaleVar as Variable,
				config.scalePowers ?? scalePowerValues,
			);
		},
	}),
];

/**
 * Returns true unless the user explicitly opted out of fluid font size with `false`.
 * Default (undefined) is treated as enabled.
 */
function isFluidFontSizeEnabled(
	config: DesignTokensPresetConfig<boolean>,
): boolean {
	return config.fluidFontSize !== false;
}

/**
 * Returns true when the given domain is enabled under the supplied config.
 * Uses the domain's custom `enabled` predicate when provided, otherwise
 * falls back to checking that `config[camelCase(key)]` is not `false`.
 */
function isDomainEnabled(
	domain: Domain,
	config: DesignTokensPresetConfig<boolean>,
): boolean {
	if (domain.enabled) return domain.enabled(config);
	const configKey = camelCase(domain.key);
	return (config as Record<string, unknown>)[configKey] !== false;
}

/**
 * Throws when a domain is enabled but a config key listed in its `requires`
 * list is set to `false`. Surfaces invalid combinations (e.g., enabling fluid
 * typography while disabling the scale or viewport it depends on) as a hard
 * error rather than producing partial output.
 */
function assertDomainDependencies(
	domain: Domain,
	config: DesignTokensPresetConfig<boolean>,
): void {
	if (!domain.requires) return;

	const missing = domain.requires.filter(
		(key) => (config as Record<string, unknown>)[key] === false,
	);

	if (missing.length === 0) return;

	const list = missing.map((key) => `\`${String(key)}\``).join(", ");
	throw new Error(
		`[useDesignTokensPreset] The "${domain.key}" domain requires ${list} to be enabled. ` +
			`Either remove the \`false\` overrides for those keys or disable the dependent config (e.g. \`fluidFontSize: false\`).`,
	);
}

// =============================================================================
// Domain Type Maps (derived from the domains tuple)
// =============================================================================

type Domains = typeof domains;
type AllDomains = Domains[number];
type ConfigurableDomain = Exclude<AllDomains, { configurable: false }>;
type SimpleDomain = Exclude<ConfigurableDomain, { key: "colors" }>;
type SimpleDomainKey = SimpleDomain["key"];
type DomainByKey<K extends string> = Extract<SimpleDomain, { key: K }>;

/** Maps each simple domain key to its default values type. */
type DomainDefaultsMap = {
	[K in SimpleDomainKey]: DomainByKey<K>["defaults"];
};

// =============================================================================
// Helper Types
// =============================================================================

/**
 * Extracts a domain's config type from TConfig, falling back to TDefault
 * when the key is not present in TConfig.
 */
type GetDomainConfig<
	TConfig,
	K extends string,
	TDefault,
> = K extends keyof TConfig ? TConfig[K] : TDefault;

/**
 * Extracts the merge flag from config by structural matching.
 * Returns `false` only when config literally has `meta: { merge: false }`.
 * The default is `true` — partial overrides merge with defaults.
 */
type ExtractMerge<T> = T extends { meta: { merge: false } } ? false : true;

/**
 * Resolves which value record to use based on config:
 * - false => never (will be undefined)
 * - undefined => default values
 * - custom record => that record (or merged with defaults if TMerge is true)
 */
type ResolveTokens<
	TConfig,
	TDefault extends Record<string, unknown>,
	TMerge extends boolean = true,
> = TConfig extends false
	? never
	: TConfig extends undefined
		? TDefault
		: TConfig extends Record<string, unknown>
			? [TMerge] extends [true]
				? Omit<TDefault, keyof TConfig> & TConfig
				: TConfig
			: TDefault;

/**
 * Generates ExportKeys or empty object based on config.
 * Returns {} for disabled domains so they contribute no keys to the flat intersection.
 */
type FlatTokenResult<
	TConfig,
	TPrefix extends string,
	TDefault extends Record<string, unknown>,
	TMerge extends boolean = true,
> = TConfig extends false
	? {}
	: ExportKeys<TPrefix, ResolveTokens<TConfig, TDefault, TMerge>>;

/**
 * Helper to convert a union to an intersection
 */
type UnionToIntersection<U> = (
	U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never;

// Variation level types
type DefaultLevelValues = typeof colorLevelValues;
type DefaultShadeLevels = typeof colorShadeValues;
type DefaultTintLevels = typeof colorTintValues;
type DefaultColors = typeof colorValues;

/**
 * Generates all variation keys for a single color name (distributive over K)
 */
type ColorVariationsForKey<K> = K extends string
	? ExportKeys<`color.${K}`, DefaultLevelValues, "-"> &
			ExportKeys<`color.${K}`, DefaultShadeLevels, "-"> &
			ExportKeys<`color.${K}`, DefaultTintLevels, "-">
	: never;

/**
 * Keys of the base colors in the record. Reference colors (`@...`) get no
 * variations, so they are left out.
 */
type BaseColorKeys<TColors extends Record<string, string>> = {
	[K in keyof TColors]: TColors[K] extends `@${string}` ? never : K;
}[keyof TColors];

/**
 * Generates all variation keys for all base colors in the record
 */
type AllColorVariations<TColors extends Record<string, string>> =
	UnionToIntersection<ColorVariationsForKey<BaseColorKeys<TColors>>>;

/**
 * Resolves which color record to use based on config and merge flag.
 */
type ResolvedColors<TColors, TMerge extends boolean = true> =
	TColors extends Record<string, string>
		? [TMerge] extends [true]
			? Omit<DefaultColors, keyof TColors> & TColors
			: TColors
		: DefaultColors;

/**
 * Color result type that strongly types base colors and all variations.
 * Returns {} for disabled colors so they contribute no keys to the flat intersection.
 */
type FlatColorResult<
	TColors,
	TMerge extends boolean = true,
> = TColors extends false
	? {}
	: ExportKeys<"color", ResolvedColors<TColors, TMerge>, "."> &
			AllColorVariations<ResolvedColors<TColors, TMerge>>;

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Per-color generation flags
 */
export interface ColorGenerationFlags {
	generateLevels?: boolean;
	generateShades?: boolean;
	generateTints?: boolean;
}

/**
 * Configuration for color generation behavior
 */
export interface ColorsMetaConfig extends ColorGenerationFlags {
	levels?: Record<string | number, number>;
	shadeLevels?: Record<string | number, number>;
	tintLevels?: Record<string | number, number>;
	overrides?: Record<string, ColorGenerationFlags>;
}

/**
 * Meta configuration for advanced options
 */
export interface MetaConfig {
	/**
	 * Controls how custom domain records combine with defaults.
	 *
	 * - `true` (default): custom values are merged with defaults. Custom values
	 *   override defaults with the same key; default keys not present in the
	 *   custom record are preserved.
	 * - `false`: custom values replace the defaults entirely for any domain
	 *   that is supplied a custom record.
	 */
	merge?: boolean;
	colors?: ColorsMetaConfig;
}

/**
 * Meta configuration with merge option typed for inference
 */
export type MetaConfigWithMerge<TMerge extends boolean = true> = Omit<
	MetaConfig,
	"merge"
> & {
	merge?: TMerge;
};

/**
 * Configuration options for the default design tokens preset.
 *
 * - Omit or set to `undefined` to use default values
 * - Set to `false` to disable the domain entirely
 * - Provide a custom record to merge custom values with defaults
 * - Set `meta.merge` to `false` to replace defaults entirely with the custom record
 */
export interface DesignTokensPresetConfig<TMerge extends boolean = true> {
	spacing?: Record<string, TokenValue> | false;
	borderColor?: Record<string, TokenValue> | false;
	borderWidth?: Record<string, TokenValue> | false;
	borderRadius?: Record<string, TokenValue> | false;
	borderStyle?: Record<string, TokenValue> | false;
	boxShadow?: Record<string, TokenValue> | false;
	zIndex?: Record<string, TokenValue> | false;
	colors?: Record<string, string> | false;
	meta?: MetaConfigWithMerge<TMerge>;
	fontFamily?: Record<string, TokenValue> | false;
	fontSize?: Record<string, TokenValue> | false;
	fontStyle?: Record<string, TokenValue> | false;
	fontWeight?: Record<string, TokenValue> | false;
	lineHeight?: Record<string, TokenValue> | false;
	letterSpacing?: Record<string, TokenValue> | false;
	scale?: Record<string, TokenValue> | false;
	scalePowers?: readonly number[];
	breakpoint?: Record<string, number> | false;
	easing?: Record<string, TokenValue> | false;
	duration?: Record<string, TokenValue> | false;
	/**
	 * Fluid viewport configuration. Creates `fluid.min-width`, `fluid.max-width`,
	 * `fluid.screen`, and `fluid.breakpoint` variables for use with `useFluidClamp`
	 * and other fluid composables.
	 *
	 * - `undefined` (default): enabled with default range (320–1440)
	 * - `true`: same as default (explicit opt-in)
	 * - object: customize `minWidth` and/or `maxWidth`
	 * - `false`: disable. The preset throws unless you also disable the
	 *   dependent fluid domain via `fluidFontSize: false`.
	 */
	fluidViewport?:
		| { minWidth?: TokenValue; maxWidth?: TokenValue }
		| true
		| false;
	/**
	 * Fluid font size configuration. When enabled (the default), the `font-size`
	 * domain emits `--font-size--min` and `--font-size--max` as configurable
	 * pixel-base CSS variables (defaulting to 16/18) and each `font-size.*`
	 * variable interpolates across the viewport via `var(--font-size--min)` /
	 * `var(--font-size--max)`. Pass `false` to fall back to static rems. To
	 * customise individual sizes, pass explicit fluid ranges via the `fontSize`
	 * option (e.g. `fontSize: { md: [16, 18] }`).
	 *
	 * - `undefined` / `true` (default): fluid scale enabled
	 * - `false`: disable. The `font-size` domain falls back to static rems.
	 */
	fluidFontSize?: true | false;
	/**
	 * Min/max scale ratios for fluid font size. Only consumed when
	 * `fluidFontSize` is not explicitly disabled. Creates `scale.min`,
	 * `scale.max`, and per-power variables (`scale.min-powers.<n>`,
	 * `scale.max-powers.<n>`) referenced by the default fluid font size values.
	 *
	 * - `undefined` (default): `{ min: "@scale.major-second", max: "@scale.major-third" }`
	 * - object: customize `min` and/or `max` (numbers or `@scale.<name>` refs)
	 */
	fluidScale?: { min?: TokenValue; max?: TokenValue };
	themes?: Record<string, ThemeTokenOverrides>;
}

/**
 * Per-theme token overrides derived from DesignTokensPresetConfig:
 * - No `meta`, `scalePowers`, or `themes` (shared config, not per-theme)
 */
type ConfigurableDomainKeys = Exclude<
	keyof DesignTokensPresetConfig,
	| "meta"
	| "scalePowers"
	| "themes"
	| "fluidViewport"
	| "fluidFontSize"
	| "fluidScale"
>;

export type ThemeTokenOverrides = {
	[K in ConfigurableDomainKeys]?: DesignTokensPresetConfig[K];
};

// =============================================================================
// Result Type (flat intersection of all domain ExportKeys)
// =============================================================================

/**
 * True unless `fluidFontSize` is explicitly set to `false`. Default (omitted)
 * is enabled.
 */
type IsFluidFontSizeEnabled<TConfig> = TConfig extends {
	fluidFontSize: infer F;
}
	? [F] extends [false]
		? false
		: true
	: true;

/**
 * True unless fluid viewport variables are explicitly disabled.
 */
type IsFluidViewportEnabled<TConfig> = TConfig extends {
	fluidViewport: false;
}
	? false
	: true;

/**
 * Flat result for simple domains — intersection of all ExportKeys for enabled
 * domains. Each domain contributes its variable keys directly (or `{}` if
 * disabled). When `fluidFontSize` is enabled, fluid keys are layered on top
 * via `FluidFontSizeResult`; the static `font-size` keys remain in the type
 * (intersected as compatible `Variable` types).
 */
type FlatSimpleDomainResults<
	TConfig,
	TMerge extends boolean,
> = UnionToIntersection<
	{
		[K in SimpleDomainKey]: FlatTokenResult<
			GetDomainConfig<TConfig, CamelCase<K>, DomainDefaultsMap[K]>,
			K,
			DomainDefaultsMap[K],
			TMerge
		>;
	}[SimpleDomainKey]
>;

/**
 * scalePowers result — stays nested since its keys are numbers.
 */
type ScalePowersResult<TScaleConfig> = TScaleConfig extends false
	? {}
	: { scalePowers: Record<number, TokenValue> };

/**
 * Variables produced by `useFluidViewportDesignTokens`.
 */
type FluidViewportResultKeys = {
	fluidMinWidth: Variable<"fluid.min-width">;
	fluidMaxWidth: Variable<"fluid.max-width">;
	fluidScreen: Variable<"fluid.screen">;
	fluidBreakpoint: Variable<"fluid.breakpoint">;
};

type FluidViewportResult<TConfig> =
	IsFluidViewportEnabled<TConfig> extends true ? FluidViewportResultKeys : {};

type FluidFontSizeResult<TConfig> =
	IsFluidFontSizeEnabled<TConfig> extends true
		? ExportKeys<"font-size", FontSizeFluidDefaults>
		: {};

/**
 * Variables produced by the `fluid-scale` domain when fluid font size is
 * enabled and viewport is not disabled.
 */
type FluidScaleResult<TConfig> =
	IsFluidFontSizeEnabled<TConfig> extends true
		? {
				scaleMin: Variable<"scale.min">;
				scaleMax: Variable<"scale.max">;
			}
		: {};

/**
 * Flat result structure for the design tokens preset.
 * All variable keys are directly accessible (no domain grouping).
 * Only `scalePowers` remains nested (numeric keys).
 */
export type DesignTokensPresetResult<
	TConfig = {},
	TMerge extends boolean = true,
> = FlatSimpleDomainResults<TConfig, TMerge> &
	FlatColorResult<GetDomainConfig<TConfig, "colors", DefaultColors>, TMerge> &
	ScalePowersResult<GetDomainConfig<TConfig, "scale", typeof scaleValues>> &
	FluidViewportResult<TConfig> &
	FluidScaleResult<TConfig> &
	FluidFontSizeResult<TConfig>;

// =============================================================================
// Runtime Helpers
// =============================================================================

/**
 * Default colors meta configuration
 */
export const defaultColorsMetaConfig: Required<ColorsMetaConfig> = {
	generateLevels: true,
	generateShades: true,
	generateTints: true,
	levels: colorLevelValues,
	shadeLevels: colorShadeValues,
	tintLevels: colorTintValues,
	overrides: {
		white: {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
		black: {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
		background: {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
		surface: { generateLevels: false },
		text: {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
		"text-inverted": {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
		"text-weak": {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
		"text-weaker": {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
		"text-weakest": {
			generateLevels: false,
			generateShades: false,
			generateTints: false,
		},
	},
};

/**
 * Collect all unique non-default theme names from config and domain-level defaults.
 */
function collectThemeNames(
	configThemes: Record<string, ThemeTokenOverrides> | undefined,
): Set<string> {
	const names = new Set<string>();

	if (configThemes) {
		for (const name of Object.keys(configThemes)) {
			if (name !== "default") names.add(name);
		}
	}

	for (const { themes: domainThemes } of domains) {
		if (domainThemes) {
			for (const name of Object.keys(domainThemes)) {
				names.add(name);
			}
		}
	}

	return names;
}

// =============================================================================
// Main Preset Function
// =============================================================================

/**
 * Create a complete design token system with sensible defaults.
 *
 * @param s - The Styleframe instance
 * @param config - Configuration options for customizing the preset
 * @returns A flat object containing all generated design token variables
 *
 * @example
 * ```typescript
 * import { styleframe } from "styleframe";
 * import { useDesignTokensPreset } from "@styleframe/theme";
 *
 * const s = styleframe();
 *
 * // Use all defaults — fluid typography is on out of the box
 * const { colorPrimary, spacingMd, borderRadiusMd, fontSizeMd } =
 *     useDesignTokensPreset(s);
 *
 * // Customize specific domains
 * const { colorPrimary, spacingSm } = useDesignTokensPreset(s, {
 *     colors: { primary: "#ff6600", secondary: "#333" },
 *     spacing: { default: "0.5rem", sm: "0.25rem" },
 *     easing: false, // Disable easing entirely
 *     fluidFontSize: false, // Opt out of fluid; use static `fontSize` instead
 * });
 *
 * // scalePowers stays nested (numeric keys)
 * const { scalePowers } = useDesignTokensPreset(s);
 * const power = scalePowers[-1];
 * ```
 */
export function useDesignTokensPreset(
	s: Styleframe,
): DesignTokensPresetResult<{}, true>;
export function useDesignTokensPreset<
	TConfig extends DesignTokensPresetConfig<boolean>,
>(
	s: Styleframe,
	config: TConfig,
): DesignTokensPresetResult<TConfig, ExtractMerge<TConfig>>;
export function useDesignTokensPreset(
	s: Styleframe,
	config: DesignTokensPresetConfig<boolean> = {},
): DesignTokensPresetResult {
	const shouldMerge = config.meta?.merge !== false;
	const defaultThemeOverrides = config.themes?.default;

	const result: Record<string, Variable | TokenValue> = {};
	const context: DomainProcessContext = { result, config };
	const disabledDomains = new Set<string>();

	for (const entry of domains) {
		const configKey = camelCase(entry.key);

		if (!isDomainEnabled(entry, config)) {
			disabledDomains.add(configKey);
			continue;
		}

		assertDomainDependencies(entry, config);

		if (entry.configurable === false) {
			const domainResult = entry.composable(
				s,
				entry.defaults,
				{ default: true },
				context,
			);
			if (domainResult) {
				// scalePowers stays nested (numeric keys)
				if (configKey === "scalePowers") {
					(result as Record<string, unknown>).scalePowers = domainResult;
				} else {
					Object.assign(result, domainResult);
				}
			}
			continue;
		}

		const configValue =
			(config as Record<string, unknown>)[configKey] ??
			defaultThemeOverrides?.[configKey as keyof ThemeTokenOverrides];

		if (configValue === false) {
			disabledDomains.add(configKey);
			continue;
		}

		const values =
			configValue != null
				? shouldMerge
					? {
							...entry.defaults,
							...(configValue as Record<string, TokenValue>),
						}
					: (configValue as Record<string, TokenValue>)
				: entry.defaults;

		const domainResult = entry.composable(
			s,
			values,
			{ default: true },
			context,
		);
		if (domainResult) {
			Object.assign(result, domainResult);
		}
	}

	// Apply non-default themes (from both config and domain-level defaults)
	const allThemeNames = collectThemeNames(config.themes);
	for (const themeName of allThemeNames) {
		s.theme(themeName, (ctx) => {
			const userOverrides =
				config.themes?.[themeName] ?? ({} as ThemeTokenOverrides);

			for (const entry of domains) {
				if (entry.configurable === false) continue;

				const configKey = camelCase(entry.key);

				// Skip domains disabled at root level
				if (disabledDomains.has(configKey)) continue;

				const themeValues =
					userOverrides[configKey as keyof ThemeTokenOverrides] ??
					entry.themes?.[themeName];

				if (themeValues && themeValues !== (false as unknown)) {
					entry.composable(
						ctx,
						themeValues as Record<string, TokenValue>,
						{ default: false },
						{ result: {} as Record<string, Variable | TokenValue>, config },
					);
				}
			}
		});
	}

	return result as unknown as DesignTokensPresetResult;
}
