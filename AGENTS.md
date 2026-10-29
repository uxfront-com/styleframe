# Guidelines

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.


# Styleframe

Styleframe is a type-safe, composable CSS-in-TypeScript framework for building design systems. It compiles design tokens, utility classes, component recipes, and themes into CSS, TypeScript runtime code, and type declarations.

## Architecture Overview

```
styleframe.config.ts        → Global Styleframe instance (single source of truth)
*.styleframe.ts files       → Extend the global instance (tokens, recipes, utilities)
@styleframe/plugin          → Build tool integration (Vite, Webpack, Nuxt, Astro, etc.)
@styleframe/transpiler      → Compiles AST to CSS + TypeScript + .d.ts
@styleframe/runtime         → Lightweight browser runtime for recipe class generation (~1.4KB)
virtual:styleframe          → Auto-generated TypeScript with recipe functions and selectors
virtual:styleframe.css      → Auto-generated CSS with all styles
```

### Single-Instance Model

All `*.styleframe.ts` extension files share one `Styleframe` instance from `styleframe.config.ts`. Extension files import the instance from `virtual:styleframe`, add tokens/recipes/utilities, and export it as default. Application code imports compiled recipe functions and selectors from `virtual:styleframe`.

---

## Monorepo Package Map

**Engine packages** (`engine/`):
- `core/` — @styleframe/core — Token AST, factory methods (variable, ref, selector, utility, modifier, recipe, theme, css, keyframes, media, atRule, merge)
- `loader/` — @styleframe/loader — Runtime config loading, module loading, HMR, build
- `runtime/` — @styleframe/runtime — Browser-side recipe class name generation
- `scanner/` — @styleframe/scanner — Content scanning for utility class extraction
- `styleframe/` — styleframe — Barrel package re-exporting all engine APIs
- `transpiler/` — @styleframe/transpiler — AST-to-CSS/TS/DTS code generation

**Theme** (`theme/`):
- @styleframe/theme — Design token composables, modifiers, utilities, recipes, presets

**Tooling** (`tooling/`):
- `cli/` — @styleframe/cli — CLI for init, build, and Figma sync
- `figma/` — @styleframe/figma — Bidirectional Figma variable sync via DTCG format
- `plugin/` — @styleframe/plugin — Unplugin build integration (Vite, Webpack, Nuxt, Astro, Rollup, Rspack, esbuild, Farm)

**Config** (`config/`):
- @styleframe/config-typescript, @styleframe/config-vite — Shared build configs

**Applications** (`apps/`):
- `docs/` — Documentation site (Docus on the UXFront layers, Nuxt Content + Markdown)
- `app/` — Customer dashboard (Nuxt 3 + Supabase)
- `shared/` — Shared Nuxt layer for doc apps
- `storybook/` — Storybook 10 + Vue 3 design system showcase

**Testing** (`testing/`):
- `integration/` — Playwright end-to-end tests across Chromium, Firefox, WebKit

**Import rule:** Import from `'styleframe'` (the barrel package), not `@styleframe/*` sub-packages. Use `'styleframe/plugin/vite'` for plugins, `'styleframe/loader'` for loader, `'styleframe/transpiler'` for transpiler.

---

## CRITICAL RULES

### Instance Creation

ALWAYS create a Styleframe instance and destructure the methods:

```ts
import { styleframe } from 'styleframe';

const s = styleframe();
const { variable, ref, selector, utility, modifier, recipe, theme, atRule, keyframes, media, css } = s;

export default s;
```

### Variable Naming Convention

- Use dot notation: `color.primary` becomes CSS `--color--primary`
- ALWAYS use `ref()` to reference variables in declarations
- For string references, use the `@` prefix syntax: `"@spacing.md"`, `"@color.primary"`, `"@font-size.sm"`
- Use `{ default: true }` for variables in reusable composables
- NEVER hardcode values that should be tokens

### Utility Class Format

- Generated format: `_property-name:value` (e.g., `_margin:md`)
- Modifier prefix format: `_modifier:property:value` (e.g., `_hover:background:primary`)
- Boolean true omits value: `_display`
- Multiple modifiers chain: `_dark:hover:background:primary`

### Theme Selector

- Default: `[data-theme="name"]`
- Apply themes via `data-theme` attribute on HTML elements

### File Conventions

- `styleframe.config.ts` — Global config at project root. MUST export instance as default.
- `*.styleframe.ts` — Extension files that extend the global instance. Import from `virtual:styleframe`.
- `.styleframe/` — Auto-generated type declarations directory. Add to `.gitignore`.

---

## API QUICK REFERENCE

### variable(name, value, options?)

Creates a CSS custom property. Dot notation in `name` becomes `--` in CSS.

```ts
const colorPrimary = variable('color.primary', '#006cff');
const spacing = variable('spacing', '1rem', { default: true }); // For composables
const colorAccent = variable('color.accent', ref(colorPrimary)); // Reference another variable
```

### ref(variable, fallback?)

Creates a `var(--name)` reference. Accepts a Variable token or dot-notation string.

```ts
backgroundColor: ref(colorPrimary)
color: ref('color.text', '#000') // String ref with fallback
color: "@color.primary"          // @-prefixed string ref (shorthand)
```

### selector(query, declarations | callback)

Creates a CSS selector rule. Supports nested selectors (`&:hover`), nested `@media`, and callback form.

```ts
selector('.button', {
    padding: ref(spacing),
    '&:hover': { opacity: 0.9 },
    '@media (min-width: 768px)': { padding: '2rem' },
});

// Callback form for complex nesting
selector('.container', ({ selector, media }) => {
    selector('.inner', { padding: '1rem' });
    return { display: 'flex' };
});
```

### utility(name, factory, options?) → createUtility(values, modifiers?)

Creates a utility class generator. Returns a **creator function** that MUST be called.

```ts
const createPadding = utility('padding', ({ value }) => ({ padding: value }));

// Object syntax (explicit keys)
createPadding({ sm: ref(spacingSm), md: ref(spacingMd) });

// Array syntax (auto-generated keys)
createPadding([ref(spacingSm), '@spacing.md', '1rem']);

// With modifiers
createPadding({ sm: ref(spacingSm) }, [hover, focus]);
```

> **Critical:** Always invoke the creator function. Defining a utility without calling it produces no CSS.

### modifier(name, factory)

Creates a reusable modifier that wraps utility declarations.

```ts
const hover = modifier('hover', ({ declarations }) => ({
    '&:hover': declarations,
}));

// Multi-key modifier (for breakpoints)
const responsive = modifier(['sm', 'md', 'lg'], ({ key, declarations }) => ({
    [`@media (min-width: ${breakpoints[key]}px)`]: declarations,
}));
```

### recipe({ name, base, variants, defaultVariants?, compoundVariants? })

Creates a component variant system. At runtime, `recipe({ color: 'primary' })` returns a class string.

```ts
recipe({
    name: 'button',
    base: { borderWidth: ref(borderWidthThin), borderStyle: 'solid' },
    variants: {
        color: {
            primary: { background: ref(colorPrimary), color: ref(colorWhite) },
            secondary: { background: ref(colorSecondary) },
        },
        size: {
            sm: { padding: ref(spacingSm) },
            md: { padding: ref(spacingMd) },
        },
    },
    defaultVariants: { color: 'primary', size: 'md' },
    compoundVariants: [
        {
            match: { color: 'primary', disabled: false },
            css: { hover: { background: '@color.primary-dark' } },
        },
    ],
});
```

### theme(name, callback)

Creates a theme variant scoped to `[data-theme="name"]`.

```ts
theme('dark', (ctx) => {
    ctx.variable(colorBackground, '#18181b');
    ctx.variable(colorText, '#ffffff');
    ctx.selector('.card', { boxShadow: '0 4px 6px rgba(0,0,0,0.3)' });
});
```

HTML: `<div data-theme="dark">Dark themed content</div>`

### css template literal

Interpolates token values into CSS strings for complex expressions.

```ts
padding: css`${ref(spacingSm)} ${ref(spacingMd)}`
width: css`calc(100% - ${ref(sidebarWidth)})`
background: css`linear-gradient(135deg, ${ref(colorPrimary)} 0%, ${ref(colorSecondary)} 100%)`
```

### keyframes(name, frames)

Defines a CSS `@keyframes` animation. Returns an AtRule token with `.rule` for the animation name.

```ts
const fadeIn = keyframes('fade-in', {
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

selector('.animated', {
    animation: `${fadeIn.rule} 0.3s ease-out`,
});
```

### media(query, callback | declarations)

Creates `@media` rules. Also usable inline in selectors via object keys.

```ts
media('(min-width: 768px)', ({ selector }) => {
    selector('.container', { maxWidth: '750px' });
});
```

### atRule(rule, query, declarations/callback)

Creates arbitrary CSS at-rules (`@supports`, `@font-face`, `@layer`, `@container`, `@property`).

```ts
atRule('supports', '(display: grid)', ({ selector }) => {
    selector('.grid', { display: 'grid' });
});
```

### merge(base, ...instances)

Combines multiple Styleframe instances. Variables override; arrays (utilities, modifiers, recipes) concatenate; same-name themes merge.

```ts
import { merge } from 'styleframe';
const s = merge(base, components, themes); // General → specific
```

---

## DESIGN TOKENS (@styleframe/theme)

### Quick Start with Presets

```ts
import { styleframe } from 'styleframe';
import { useDesignTokensPreset, useModifiersPreset, useUtilitiesPreset } from '@styleframe/theme';

const s = styleframe();

const { colorPrimary, spacingMd } = useDesignTokensPreset(s); // Flat — all tokens directly
const modifiers = useModifiersPreset(s);   // All pseudo-state/element/media modifiers
useUtilitiesPreset(s);                      // All utility classes

export default s;
```

### Token Composables

| Category | Composables |
|----------|-------------|
| **Colors** | `useColorDesignTokens`, `useColorLevelDesignTokens`, `useColorShadeDesignTokens`, `useColorTintDesignTokens` |
| **Scales** | `useScaleDesignTokens`, `useScalePowersDesignTokens` |
| **Spacing** | `useSpacingDesignTokens`, `useMultiplierDesignTokens` |
| **Typography** | `useFontFamilyDesignTokens`, `useFontSizeDesignTokens`, `useFontWeightDesignTokens`, `useFontStyleDesignTokens`, `useLineHeightDesignTokens`, `useLetterSpacingDesignTokens` |
| **Borders/Effects** | `useBorderWidthDesignTokens`, `useBorderRadiusDesignTokens`, `useBorderStyleDesignTokens`, `useBorderColorDesignTokens`, `useBoxShadowDesignTokens` |
| **Breakpoints** | `useBreakpointDesignTokens` |
| **Easing** | `useEasingDesignTokens` |
| **Duration** | `useDurationDesignTokens` |
| **Z-Index** | `useZIndexDesignTokens` |

All composables take `s` (Styleframe instance) as first argument, accept optional custom values, and return typed token objects.

```ts
import { useColorDesignTokens, useSpacingDesignTokens, useMultiplierDesignTokens, useScaleDesignTokens, useScalePowersDesignTokens } from '@styleframe/theme';

const { colorPrimary } = useColorDesignTokens(s, { primary: '#006cff' } as const);
const { spacing } = useSpacingDesignTokens(s, { default: '1rem' } as const);
const { scale } = useScaleDesignTokens(s, { default: '@minor-third' });
const scalePowers = useScalePowersDesignTokens(s, scale);
const { spacingSm, spacingMd } = useMultiplierDesignTokens(s, spacing, {
    sm: scalePowers[-1],
    md: scalePowers[0],
});
```

### Modifier Categories

| Composable | Examples |
|------------|---------|
| `usePseudoStateModifiers` | hover, focus, focusWithin, focusVisible, active, visited |
| `usePseudoElementModifiers` | before, after, placeholder, selection, firstLetter |
| `useFormStateModifiers` | disabled, enabled, checked, required, valid, invalid |
| `useAriaStateModifiers` | ariaExpanded, ariaSelected, ariaDisabled, ariaPressed |
| `useMediaPreferenceModifiers` | dark, motionSafe, motionReduce, contrastMore, print |
| `useStructuralModifiers` | first, last, only, odd, even, empty |
| `useDirectionalModifiers` | rtl, ltr |

### Utility Categories (80+)

Typography, Backgrounds, Borders, Effects, Filters, Flexbox & Grid, Layout, Sizing, Interactivity, Transforms, Transitions, Accessibility, SVG, Tables.

### Recipes

```ts
import { useButtonRecipe, useBadgeRecipe } from '@styleframe/theme';

useButtonRecipe(s);  // Colors: primary/secondary/success/info/warning/error
                     // Variants: solid/outline/soft/subtle/ghost/link
                     // Sizes: xs/sm/md/lg/xl

useBadgeRecipe(s);   // Colors: same, Variants: solid/outline/soft/subtle, Sizes: same
```

### Shorthand Utilities

```ts
import { useShorthandUtilitiesPreset } from '@styleframe/theme';
useShorthandUtilitiesPreset(s); // Tailwind-style: m, p, w, text, etc.
```

---

## BUILD TOOL INTEGRATION

### Plugin Setup

Each bundler has a dedicated adapter. Plugins are default exports.

```ts
// vite.config.ts
import styleframe from 'styleframe/plugin/vite';
export default defineConfig({ plugins: [styleframe()] });

// nuxt.config.ts
export default defineNuxtConfig({ modules: ['styleframe/plugin/nuxt'] });

// astro.config.mjs
import styleframe from 'styleframe/plugin/astro';
export default { integrations: [styleframe()] };
```

### Plugin Options

```ts
styleframe({
    entry: './styleframe.config.ts',       // Config file path
    include: ['**/*.styleframe.ts'],       // Extension file globs
    loadOrder: 'alphabetical',             // or 'depth-first'
    dts: { enabled: true, outDir: '.styleframe' },
    scanner: {
        content: ['./src/**/*.{html,jsx,tsx,vue}'],  // Enable utility class auto-detection
    },
});
```

### Virtual Modules

| Import | Context | Returns |
|--------|---------|---------|
| `virtual:styleframe` | From `*.styleframe.ts` | Global instance factory for extending |
| `virtual:styleframe` | From app code | Compiled recipe functions and selector constants |
| `virtual:styleframe.css` | Any | All compiled CSS styles |

### Extension File Pattern

```ts
// button.styleframe.ts
import { styleframe } from 'virtual:styleframe';
import { useButtonRecipe } from '@styleframe/theme';

const s = styleframe();
const { selector } = s;

export const button = useButtonRecipe(s);

selector('.button-grid', {
    display: 'flex',
    gap: '@spacing.md',
});

export default s;
```

### Consuming in Application Code

```ts
import { button } from 'virtual:styleframe';
import 'virtual:styleframe.css';

const classes = button({ color: 'primary', size: 'md' });
// => "button _border-width:thin _cursor:pointer _background:primary ..."
```

---

## COMPOSABLE NAMING CONVENTIONS

| Type | Pattern | Example |
|------|---------|---------|
| Variables | `use<Context>Variables()` | `useColorVariables(s)` |
| Selectors | `use<Context>Selectors()` | `useButtonSelectors(s)` |
| Utilities | `use<Context>Utilities()` | `useSpacingUtilities(s)` |
| Recipes | `use<Context>Recipe()` | `useButtonRecipe(s)` |

All composable variables MUST use `{ default: true }`:

```ts
export function useColorVariables(s: Styleframe) {
    const { variable, ref } = s;
    const colorPrimary = variable('color.primary', '#006cff', { default: true });
    return { colorPrimary };
}
```

---

## CLI

```bash
styleframe init [cwd]              # Scaffold project, install deps, configure build tool
styleframe build [entry]           # Compile config to CSS/TS/DTS output
styleframe dtcg export             # Export variables to spec-conformant DTCG JSON
styleframe dtcg import -i in.json  # Generate Styleframe code from DTCG JSON
```

---

## COMMON ANTI-PATTERNS

1. **NEVER hardcode colors, spacing, or sizes** — Use variables and `ref()`
2. **NEVER use `ref()` without destructuring it from the instance**
3. **NEVER forget `{ default: true }` in composable variables**
4. **NEVER define utilities without calling the creator function** — `utility()` returns a function
5. **NEVER use arbitrary CSS values without `css` template literal** for complex expressions
6. **NEVER forget to export the Styleframe instance as default**
7. **NEVER use appearance-based names** — Use semantic names (`color.primary` not `color.blue`)
8. **NEVER use named exports in index files** — Use `export *` for all re-exports
9. **NEVER import from `virtual:styleframe` in non-`*.styleframe.ts` files** expecting the global instance — only extension files get the extension face
10. **NEVER import from `@styleframe/*` sub-packages** — Import from `'styleframe'` barrel package

---

## Code Intelligence

Prefer LSP over Grep/Glob/Read for code navigation:
- `goToDefinition` / `goToImplementation` to jump to source
- `findReferences` to see all usages across the codebase
- `workspaceSymbol` to find where something is defined
- `documentSymbol` to list all symbols in a file
- `hover` for type info without reading the file
- `incomingCalls` / `outgoingCalls` for call hierarchy

Before renaming or changing a function signature, use `findReferences` to find all call sites first. Use Grep/Glob only for text/pattern searches where LSP does not help. After writing or editing code, check LSP diagnostics before moving on.

---

## Local Tooling

**GitHub Actions linting:** Editing files under `.github/workflows/` runs [actionlint](https://github.com/rhysd/actionlint) via lint-staged on pre-commit. Install it once locally so the hook can run:

- macOS: `brew install actionlint`
- Other platforms: see https://github.com/rhysd/actionlint/blob/main/docs/install.md

Run `pnpm lint:actions` to lint all workflows manually.

---

## Package-Specific Guides

Each package has its own AGENTS.md with detailed API reference, types, and conventions:

| Package | AGENTS.md Path |
|---------|---------------|
| Core engine | `engine/core/AGENTS.md` |
| Barrel package | `engine/styleframe/AGENTS.md` |
| Loader | `engine/loader/AGENTS.md` |
| Transpiler | `engine/transpiler/AGENTS.md` |
| Runtime | `engine/runtime/AGENTS.md` |
| Scanner | `engine/scanner/AGENTS.md` |
| Theme | `theme/AGENTS.md` |
| Build plugin | `tooling/plugin/AGENTS.md` |
| CLI | `tooling/cli/AGENTS.md` |
| Figma | `tooling/figma/AGENTS.md` |
| Integration tests | `testing/integration/AGENTS.md` |
| Storybook | `apps/storybook/AGENTS.md` |
| Documentation site | `apps/docs/AGENTS.md` |
| Customer app | `apps/app/AGENTS.md` |
| Shared Nuxt layer | `apps/shared/AGENTS.md` |
| Build config | `config/AGENTS.md` |

## Reference Files

- `.claude/styleframe-api.md` — Complete API reference
- `.claude/styleframe-patterns.md` — Common patterns and examples
- `.claude/styleframe-recipes.md` — Recipe system guide
- `.claude/styleframe-tokens.md` — Design token composables
