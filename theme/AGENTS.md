# @styleframe/theme

Design token composables and presets for Styleframe. Provides type-safe functions that create CSS custom properties, utility classes, modifiers, and component recipes for building design systems.

## Package Overview

`@styleframe/theme` is the token layer of Styleframe. It exports composable functions (`use*`) that register design tokens (CSS custom properties), utility classes, modifiers, and recipes on a Styleframe instance. Every composable takes a Styleframe instance `s` as its first argument and returns typed token objects.

**Peer dependency:** `@styleframe/core` (v3.0.1+)
**Dependencies:** `culori` (color conversion), `defu` (object defaults), `scule` (string casing)

---

## Source Structure

```
src/
├── index.ts          # Barrel re-exports (export * from each subdirectory)
├── types.ts          # ExportKeys<Prefix, T, Separator> helper type
├── values/           # Default value constants for all token categories
├── variables/        # use* composables that create CSS custom properties
├── modifiers/        # Pseudo-class, pseudo-element, and state modifiers
├── utilities/        # use*Utility composables that create utility classes
├── recipes/          # useButtonRecipe, useBadgeRecipe
├── presets/          # useDesignTokensPreset, useModifiersPreset, useUtilitiesPreset, useShorthandUtilitiesPreset
└── utils/            # Factory functions (createUseVariable, createUseUtility, etc.)
```

---

## Design Token Variables

Each composable creates CSS custom properties and returns typed token objects. All accept optional custom values and `{ default: true }` for composable-safe registration.

### Colors

```ts
import { useColor, useColorLevel, useColorShade, useColorTint } from '@styleframe/theme';

// Base colors (converted to OKLCH internally)
const { colorPrimary, colorSecondary } = useColor(s, {
    primary: '#006cff',
    secondary: '#6c757d',
} as const);

// Level variants (absolute L channel in OKLCH)
// Returns: colorPrimary50, colorPrimary100, ..., colorPrimary950
const primaryLevels = useColorLevel(s, colorPrimary, colorLevelValues);

// Shade variants (relative: subtracts from L channel - darker)
const { colorPrimaryShade100 } = useColorShade(s, colorPrimary, { 100: 10 } as const);

// Tint variants (relative: adds to L channel - lighter)
const { colorPrimaryTint100 } = useColorTint(s, colorPrimary, { 100: 10 } as const);
```

Default colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`, `white`, `black`.

### Scales

```ts
import { useScale, useScalePowers } from '@styleframe/theme';

const { scale, scalePerfectFourth } = useScale(s, {
    ...defaultScaleValues,
    default: '@minor-third',
});

// Generate multiplier powers: [-3, -2, -1, 0, 1, 2, 3, 4, 5]
const scalePowers = useScalePowers(s, scale, [-3, -2, -1, 0, 1, 2, 3, 4, 5]);
```

Available ratios: `minor-second` (1.067), `major-second` (1.125), `minor-third` (1.2), `major-third` (1.25), `perfect-fourth` (1.333), `augmented-fourth` (1.414), `perfect-fifth` (1.5), `golden` (1.618).

### Spacing

```ts
import { useSpacing, useMultiplier } from '@styleframe/theme';

const { spacing } = useSpacing(s, { default: '1rem' } as const);

const { spacingSm, spacingMd, spacingLg } = useMultiplier(s, spacing, {
    sm: scalePowers[-1],
    md: scalePowers[0],
    lg: scalePowers[1],
});
```

Default sizes: `2xs`, `xs`, `sm`, `md` (default), `lg`, `xl`, `2xl`, `3xl`.

### Typography

```ts
import { useFontFamily, useFontSize, useFontWeight, useFontStyle, useLineHeight, useLetterSpacing } from '@styleframe/theme';

const { fontFamily, fontFamilyMono, fontFamilyPrint } = useFontFamily(s);
const { fontSize } = useFontSize(s, { default: '1rem' } as const);
const { fontWeightNormal, fontWeightBold } = useFontWeight(s);
const { lineHeightTight, lineHeightNormal } = useLineHeight(s);
const { letterSpacingTight, letterSpacingWide } = useLetterSpacing(s);
```

### Borders and Effects

```ts
import { useBorderWidth, useBorderRadius, useBorderStyle, useBorderColor, useBoxShadow } from '@styleframe/theme';

const { borderWidthThin } = useBorderWidth(s);
const { borderRadiusSm, borderRadiusMd } = useBorderRadius(s);
const { boxShadowSm, boxShadowMd } = useBoxShadow(s);
```

### Breakpoints and Easing

```ts
import { useBreakpoint, useEasing } from '@styleframe/theme';

const { breakpointSm, breakpointMd, breakpointLg } = useBreakpoint(s);
const { easingEaseOut, easingSpring } = useEasing(s);
```

Default breakpoints: `xs` (0), `sm` (576), `md` (768), `lg` (992), `xl` (1200), `2xl` (1440).

---

## Modifiers

Modifier composables return factory objects used with utility classes.

```ts
import {
    usePseudoStateModifiers,    // hover, focus, focusWithin, focusVisible, active, visited, target
    usePseudoElementModifiers,  // before, after, placeholder, selection, firstLetter, firstLine, marker, backdrop, file
    useFormStateModifiers,      // disabled, enabled, checked, indeterminate, required, optional, valid, invalid, placeholderShown, autofill, readOnly, readonly, readonlyAttr
    useAriaStateModifiers,      // ariaBusy, ariaChecked, ariaDisabled, ariaExpanded, ariaHidden, ariaInvalid, ariaPressed, ariaReadonly, ariaRequired, ariaSelected
    useMediaPreferenceModifiers,// dark, motionSafe, motionReduce, contrastMore, contrastLess, portrait, landscape, print, forcedColors, hoverCapable, anyPointerCoarse
    useStructuralModifiers,     // first, last, only, odd, even, firstOfType, lastOfType, onlyOfType, empty
    useDirectionalModifiers,    // rtl, ltr
    useOtherStateModifiers,     // open, inert, dataLoading
} from '@styleframe/theme';

const { hover, focus, active } = usePseudoStateModifiers(s);
const { dark, motionReduce } = useMediaPreferenceModifiers(s);
```

---

## Utilities

Utility composables create CSS utility class generators. Each returns a creator function that must be invoked with values.

### Spacing Utilities (with multiplier support)

```ts
import { useMarginUtility, usePaddingUtility, useGapUtility, useSpaceUtility } from '@styleframe/theme';

const createMargin = useMarginUtility(s, { sm: ref(spacingSm), md: ref(spacingMd) });

// Multiplier values generate calc() expressions
createMargin(["@1.5", "@2", "@0.5"]);
// Produces: calc(var(--spacing) * 1.5), etc.
```

Directional variants: `useMarginTopUtility`, `useMarginInlineUtility`, `usePaddingBlockUtility`, etc.

### All Utility Categories

| Category | Composables |
|----------|-------------|
| **Typography** | `useColorUtility`, `useTextColorUtility`, `useFontFamilyUtility`, `useFontSizeUtility`, `useFontWeightUtility`, `useLineHeightUtility`, `useLetterSpacingUtility`, `useTextAlignUtility`, `useTextDecorationUtility`, `useTextTransformUtility`, `useTextOverflowUtility`, `useTextWrapUtility`, `useWhitespaceUtility`, `useWordBreakUtility`, `useFontStyleUtility`, `useLineClampUtility`, `useContentUtility`, `useVerticalAlignUtility` |
| **Backgrounds** | `useBackgroundColorUtility`, `useBackgroundAttachmentUtility`, `useBackgroundClipUtility`, `useBackgroundImageUtility`, `useBackgroundPositionUtility`, `useBackgroundRepeatUtility`, `useBackgroundSizeUtility` |
| **Borders** | `useBorderWidthUtility`, `useBorderColorUtility`, `useBorderStyleUtility`, `useBorderRadiusUtility`, `useRingUtility`, `useDivideUtility`, `useOutlineUtility` |
| **Effects** | `useBoxShadowUtility`, `useOpacityUtility`, `useTextShadowUtility`, `useMixBlendModeUtility`, `useBackgroundBlendModeUtility` |
| **Filters** | `useFilterUtility`, `useBackdropFilterUtility` |
| **Flexbox & Grid** | `useFlexUtility`, `useFlexDirectionUtility`, `useFlexWrapUtility`, `useGapUtility`, `useAlignUtility`, `useJustifyUtility`, `useOrderUtility`, `usePlaceUtility`, `useGridUtility` |
| **Layout** | `useDisplayUtility`, `usePositionUtility`, `useInsetUtility`, `useZIndexUtility`, `useFloatUtility`, `useOverflowUtility`, `useAspectRatioUtility`, `useBoxUtility`, `useColumnsUtility`, `useObjectFitUtility`, `useObjectPositionUtility` |
| **Sizing** | `useWidthUtility`, `useHeightUtility`, `useSizeUtility` |
| **Interactivity** | `useInteractivityUtility`, `useScrollUtility`, `useScrollSnapUtility` |
| **Transforms** | `useTransformUtility` |
| **Transitions** | `useTransitionUtility`, `useAnimationUtility` |
| **Accessibility** | `useAccessibilityUtility` |
| **SVG** | `useSvgUtility` |
| **Tables** | `useTableUtility` |

---

## Recipes

Pre-built component recipes with color, variant, and size support.

```ts
import { useButtonRecipe, useBadgeRecipe } from '@styleframe/theme';

useButtonRecipe(s);
// Colors: primary, secondary, success, info, warning, error
// Variants: solid, outline, soft, subtle, ghost, link
// Sizes: xs, sm, md, lg, xl
// Defaults: color=primary, variant=solid, size=md

useBadgeRecipe(s);
// Colors: primary, secondary, success, info, warning, error
// Variants: solid, outline, soft, subtle
// Sizes: xs, sm, md, lg, xl
// Defaults: color=primary, variant=solid, size=sm
```

Both accept an optional config object for overriding defaults and a `{ filter }` option to include specific variants.

---

## Presets

Presets compose multiple composables into a single call for rapid setup.

### useDesignTokensPreset

Creates all design token variables at once. Returns a flat object — all variables are directly destructurable.

```ts
import { useDesignTokensPreset } from '@styleframe/theme';

const { colorPrimary, spacingMd, borderRadiusMd } = useDesignTokensPreset(s);

// With custom config
const { colorPrimary, spacingMd } = useDesignTokensPreset(s, {
    colors: { primary: '#006cff', secondary: '#6c757d' },
    spacing: { default: '1rem' },
    fontSize: { default: '1rem' },
    easing: false, // Set false to disable a category
});
```

Config keys: `spacing`, `borderWidth`, `borderRadius`, `borderStyle`, `boxShadow`, `colors`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `lineHeight`, `letterSpacing`, `scale`, `scalePowers`, `breakpoint`, `easing`. Each can be `undefined` (defaults), `false` (skip), or a custom `Record`.

Theme overrides:

```ts
useDesignTokensPreset(s, {
    themes: {
        dark: { colors: { primary: '#60a5fa' } },
    },
});
```

### useModifiersPreset

```ts
import { useModifiersPreset } from '@styleframe/theme';

const modifiers = useModifiersPreset(s, {
    pseudoStates: true,     // hover, focus, active, etc.
    formStates: true,       // disabled, checked, valid, etc.
    structural: true,       // first, last, odd, even, etc.
    pseudoElements: true,   // before, after, placeholder, etc.
    mediaPreferences: true, // dark, motionReduce, etc.
    ariaStates: true,       // ariaExpanded, ariaSelected, etc.
    directional: true,      // rtl, ltr
    otherStates: true,      // open, inert, dataLoading
});
```

### useUtilitiesPreset

```ts
import { useUtilitiesPreset } from '@styleframe/theme';

const utilities = useUtilitiesPreset(s, {
    // Enable/disable by category, pass custom values
});
```

### useShorthandUtilitiesPreset

Wraps `useUtilitiesPreset` with Tailwind-style shorthand names (`m` for margin, `p` for padding, `w` for width, `text` for font-size, etc.).

```ts
import { useShorthandUtilitiesPreset } from '@styleframe/theme';

useShorthandUtilitiesPreset(s);
```

---

## Default Value Exports

All default token values are exported as constants for reference or customization:

```ts
import {
    defaultColorValues,
    colorLevelValues,
    defaultColorShadeValues,
    defaultColorTintValues,
    defaultSpacingValues,
    defaultFontFamilyValues,
    defaultFontSizeValues,
    defaultFontWeightValues,
    defaultLineHeightValues,
    defaultLetterSpacingValues,
    defaultBorderWidthValues,
    defaultBorderRadiusValues,
    defaultBorderStyleValues,
    defaultBoxShadowValues,
    defaultBreakpointValues,
    defaultEasingValues,
    defaultScaleValues,
} from '@styleframe/theme';
```

---

## Factory Functions (Advanced)

For building custom composables:

| Factory | Purpose |
|---------|---------|
| `createUseVariable(name, options)` | Create a custom variable composable |
| `createUseUtility(name, factory, options)` | Create a custom utility composable |
| `createUseSpacingUtility(name, factory, options)` | Create a utility with multiplier support |
| `createUseDerivedVariable(options)` | Create derived variables from a parent |
| `createUseRecipe(name, defaults)` | Create a custom recipe composable |
| `createMultiplierAutogenerate(options)` | Add `@`-prefix multiplier support to utilities |

---

## Key Conventions

1. **All composables take `s` (Styleframe instance) as first argument.**
2. **Use `as const` on value objects** for proper TypeScript inference.
3. **The `default` key generates the base variable name** without a suffix (e.g., `useSpacing(s, { default: '1rem' })` returns `{ spacing }`, not `{ spacingDefault }`).
4. **Use `ref()` to reference variables in declarations.** Use `"@token.name"` shorthand for string references.
5. **Utility creators must be invoked.** `useMarginUtility(s, values)` returns a creator function; call it to generate CSS.
6. **Multiplier values use `@` prefix:** `"@1.5"` becomes `calc(var(--spacing) * 1.5)`.
7. **Use semantic names** (`color.primary`, not `color.blue`).
8. **Use `export *` in index files** for re-exports, not named exports.

---

## Common Patterns

### Quick Start with Presets

```ts
import { styleframe } from 'styleframe';
import { useDesignTokensPreset, useModifiersPreset, useUtilitiesPreset } from '@styleframe/theme';

const s = styleframe();

const { colorPrimary, spacingMd, scalePowers } = useDesignTokensPreset(s);
const modifiers = useModifiersPreset(s);
useUtilitiesPreset(s);

export default s;
```

### Manual Token Setup

```ts
import { styleframe } from 'styleframe';
import { useColor, useSpacing, useMultiplier, useScale, useScalePowers } from '@styleframe/theme';

const s = styleframe();
const { ref, selector } = s;

const { scale } = useScale(s, { default: '@minor-third' });
const scalePowers = useScalePowers(s, scale);

const { colorPrimary } = useColor(s, { primary: '#006cff' } as const);
const { spacing } = useSpacing(s, { default: '1rem' } as const);
const { spacingSm, spacingMd, spacingLg } = useMultiplier(s, spacing, {
    sm: scalePowers[-1],
    md: scalePowers[0],
    lg: scalePowers[1],
});

selector('.card', {
    padding: ref(spacingLg),
    backgroundColor: ref(colorPrimary),
});

export default s;
```

### Custom Composable

```ts
import type { Styleframe } from 'styleframe';
import { useColor, useColorLevel, colorLevelValues } from '@styleframe/theme';

export function useThemeColors(s: Styleframe) {
    const { colorPrimary, colorSecondary } = useColor(s, {
        primary: '#006cff',
        secondary: '#6c757d',
    } as const);

    const primaryLevels = useColorLevel(s, colorPrimary, colorLevelValues);

    return { colorPrimary, colorSecondary, ...primaryLevels };
}
```
