# @styleframe/storybook

Interactive design system showcase and testing environment for Styleframe. Uses Storybook 10 with Vue 3 to visualize design tokens, elements, states and utility classes through interactive stories. The component recipes and their stories moved to Inkline with `@inkline/theme` in 4.0.0.

## Package Info

- **Name:** `@styleframe/storybook` (private)
- **Type:** ES Module
- **Framework:** Storybook 10 + Vue 3 + Vite
- **Dev server:** `storybook dev -p 6006`
- **Build:** `storybook build` (outputs to `storybook-static/`)
- **Dependencies:** `styleframe`, `@styleframe/core`, `@styleframe/runtime`, `@styleframe/theme`, `@styleframe/plugin`, `vue`

---

## Source Structure

```
apps/storybook/
├── styleframe.config.ts          # Global Styleframe instance with presets
├── vite.config.ts                # Vite config with Styleframe plugin + Vitest
├── .storybook/
│   ├── main.ts                   # Storybook config: story globs, addons, framework
│   ├── preview.ts                # Global preview settings, dark mode, a11y, CSS import
│   ├── theme.ts                  # Custom Storybook UI themes (light/dark)
│   └── vitest.setup.ts           # Vitest + Storybook portable stories setup
├── .styleframe/
│   └── styleframe.d.ts           # Auto-generated types for virtual:styleframe
└── src/
    ├── theme/
    │   ├── index.ts              # Barrel export for global styles
    │   └── useGlobalStyles.ts    # Body reset, font smoothing, box-sizing
    ├── design-tokens/            # 16 story files for each token category
    │   ├── color.stories.ts
    │   ├── color-shade.stories.ts
    │   ├── color-tint.stories.ts
    │   ├── color-level.stories.ts
    │   ├── font-size.stories.ts
    │   ├── font-weight.stories.ts
    │   ├── font-family.stories.ts
    │   ├── line-height.stories.ts
    │   ├── letter-spacing.stories.ts
    │   ├── spacing.stories.ts
    │   ├── border-radius.stories.ts
    │   ├── border-width.stories.ts
    │   ├── border-style.stories.ts
    │   ├── box-shadow.stories.ts
    │   ├── breakpoint.stories.ts
    │   └── scale.stories.ts
    ├── components/
    │   ├── StoryGrid.vue          # Reusable grid/list layout for items
    │   ├── StoryGrid.styleframe.ts
    │   ├── ColorSwatch.vue        # Color token visualization with contrast ratio
    │   ├── ColorShadeSwatch.vue   # Color shade variant swatch
    │   ├── ColorTintSwatch.vue    # Color tint variant swatch
    │   ├── ColorLevelSwatch.vue
    │   ├── FontSizeSwatch.vue
    │   ├── FontWeightSwatch.vue
    │   ├── FontFamilySwatch.vue
    │   ├── LineHeightSwatch.vue
    │   ├── LetterSpacingSwatch.vue
    │   ├── SpacingSwatch.vue
    │   ├── BorderRadiusSwatch.vue
    │   ├── BorderWidthSwatch.vue
    │   ├── BorderStyleSwatch.vue
    │   ├── BoxShadowSwatch.vue
    │   ├── ScaleSwatch.vue
    │   └── primitives/
    │       ├── SwatchCard.vue     # Card wrapper with preview/name/label slots
    │       ├── SwatchRow.vue      # Horizontal name/value display
    │       ├── ProgressBar.vue    # Visual bar component
    │       ├── BarChart.vue       # Chart visualization
    │       ├── tokens.styleframe.ts  # Shared swatch design tokens
    │       └── index.ts           # Barrel export
    └── assets/                    # Static images (SVG, PNG, AVIF)
```

---

## Configuration

### styleframe.config.ts

The global Styleframe instance applies three presets and global styles:

```ts
import { useDesignTokensPreset, useModifiersPreset, useUtilitiesPreset } from '@styleframe/theme';
import { styleframe } from 'styleframe';
import { useGlobalStyles } from './src/theme';

const s = styleframe();

useDesignTokensPreset(s);
useUtilitiesPreset(s);
useModifiersPreset(s);
useGlobalStyles(s);

export default s;
```

### Storybook Addons

Seven addons configured in `.storybook/main.ts`:

| Addon | Purpose |
|-------|---------|
| `@chromatic-com/storybook` | Visual regression testing |
| `@storybook/addon-vitest` | Vitest integration for story testing |
| `@storybook/addon-a11y` | Accessibility violation detection |
| `@storybook/addon-docs` | Auto-generated documentation |
| `@storybook/addon-onboarding` | Onboarding UI |
| `@storybook/addon-themes` | Theme switching |
| `@vueless/storybook-dark-mode` | Dark mode toggle |

### Preview Settings

- **Layout:** centered
- **A11y:** `test: "todo"` (shows violations in test UI, does not fail CI)
- **Dark mode:** `darkClass: "dark-theme"`, `lightClass: "default-theme"`
- **CSS:** Imports `virtual:styleframe.css` for all design tokens

### Vite Config

- **Plugins:** `@styleframe/plugin` (Styleframe Vite integration), `@vitejs/plugin-vue`
- **Alias:** `@styleframe/theme` resolves to `../../theme/src` (local development)
- **Vitest:** Browser testing with Playwright (Chromium, headless)

---

## Story Conventions

### Story File Pattern

Stories live in `src/**/*.stories.ts` and follow Storybook's CSF (Component Story Format):

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Component from './components/Component.vue';

const meta = {
    title: 'Category/Subcategory/Name',
    component: Component,
    tags: ['autodocs'],
    argTypes: { /* control definitions */ },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { /* default prop values */ },
};
```

### Story Organization

| Category | Path Pattern | Description |
|----------|-------------|-------------|
| `Design Tokens/Colors/*` | `src/design-tokens/color*.stories.ts` | Color token visualization |
| `Design Tokens/Typography/*` | `src/design-tokens/font*.stories.ts` | Typography tokens |
| `Design Tokens/Spacing` | `src/design-tokens/spacing.stories.ts` | Spacing tokens |
| `Design Tokens/Borders/*` | `src/design-tokens/border*.stories.ts` | Border tokens |
| `Design Tokens/Effects/*` | `src/design-tokens/box-shadow.stories.ts` | Effect tokens |

### Design Token Story Pattern

Each design token story imports values from `@styleframe/theme`, renders a grid of swatch components:

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorValues } from '@styleframe/theme';
import ColorSwatch from '../components/ColorSwatch.vue';
import StoryGrid from '../components/StoryGrid.vue';

const meta = {
    title: 'Design Tokens/Colors/Color',
    component: ColorSwatch,
    tags: ['autodocs'],
    argTypes: {
        value: { control: 'select', options: Object.keys(colorValues) },
    },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: StoryObj = {
    render: () => ({
        components: { ColorSwatch, StoryGrid },
        setup() {
            return { items: Object.keys(colorValues) };
        },
        template: `
            <StoryGrid :items="items">
                <template #default="{ item }">
                    <ColorSwatch :name="item" :value="item" :label="item" />
                </template>
            </StoryGrid>
        `,
    }),
};

export const Primary: Story = {
    args: { name: 'primary', value: 'primary' },
};
```

---

## Component Patterns

### Recipe Components

A component imports its recipe function from `virtual:styleframe` and applies it with `:class`. The swatches work this way, like `BreakpointSwatch.vue`, and a button would look like this:

```vue
<script setup lang="ts">
import { button } from 'virtual:styleframe';

const props = withDefaults(defineProps<{
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
    variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    label?: string;
    disabled?: boolean;
}>(), {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    label: 'Button',
    disabled: false,
});
</script>

<template>
    <button
        :class="button({ color: props.color, variant: props.variant, size: props.size })"
        :disabled="props.disabled"
    >
        {{ props.label }}
    </button>
</template>
```

### Styleframe Files (`.styleframe.ts`)

Each component's styles live in a co-located `.styleframe.ts` file:

```ts
import { styleframe } from 'virtual:styleframe';

const s = styleframe();
const { recipe, selector } = s;

export const button = recipe({
    name: 'button',
    base: { paddingInline: '@0.75', borderRadius: '@border-radius.md' },
    variants: {
        color: { primary: { background: '@color.primary', color: '@color.white' } },
    },
});

selector('.button-grid', {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '@spacing.md',
    padding: '@spacing.md',
    alignItems: 'center',
});

export default s;
```

### Swatch Components

Swatch components visualize individual design token values. Each follows this pattern:

1. Accept `name` and `value` props
2. Import a recipe from `virtual:styleframe`
3. Wrap content in `SwatchCard` primitive
4. Display the token value visually (color preview, font rendering, spacing bars, etc.)

### Primitive Components

Reusable building blocks in `src/components/primitives/`:

| Component | Purpose |
|-----------|---------|
| `SwatchCard` | Card with slots: default (preview), `#name`, `#label` |
| `SwatchRow` | Horizontal row with name and value display |
| `ProgressBar` | Visual bar for proportional values |
| `BarChart` | Chart for comparative values |

Shared tokens for primitives are in `primitives/tokens.styleframe.ts` (colors, spacing, typography, dimensions used across all swatch components).

---

## Virtual Module

The `virtual:styleframe` module is auto-generated by `@styleframe/plugin`. It provides:

- `styleframe()` — Returns the configured Styleframe instance
- Swatch recipes: `colorSwatch()`, `fontSizeSwatch()`, `spacingSwatch()`, etc.
- CSS import: `virtual:styleframe.css`

Type definitions are in `.styleframe/styleframe.d.ts`.

---

## Testing

### Vitest + Storybook

Stories are testable via Vitest with Storybook's portable stories:

- **Setup:** `.storybook/vitest.setup.ts` applies annotations and a11y config
- **Browser:** Playwright (Chromium, headless)
- **A11y:** Addon checks accessibility violations per story

### Running Tests

```sh
pnpm vitest          # Run story tests
pnpm storybook dev   # Start dev server on port 6006
pnpm storybook build # Build static site
```

---

## Key Conventions

1. **Co-locate styles with components** — every Vue component has a matching `.styleframe.ts` file.
2. **Import from `virtual:styleframe`** in `.styleframe.ts` files, not from `styleframe` directly.
3. **Import from `styleframe`** only in `styleframe.config.ts` (the global config).
4. **Use `@`-prefixed string refs** for token references in selectors: `'@spacing.md'`, `'@color.primary'`.
5. **Use `satisfies Meta<typeof Component>`** on story meta objects for type safety.
6. **Tag stories with `['autodocs']`** to auto-generate documentation pages.
7. **Export `default` for meta** and **named exports for individual stories** in story files.
8. **Use `StoryGrid` component** for rendering collections of token swatches.
9. **Use `as const`** on value arrays/objects for TypeScript inference.
10. **Always export the Styleframe instance as default** from `.styleframe.ts` files.

---

## Adding New Content

### New Design Token Story

1. Create swatch component: `src/components/<Token>Swatch.vue` + `.styleframe.ts`
2. Create story: `src/design-tokens/<token>.stories.ts`
3. Import token values from `@styleframe/theme` (e.g., `<token>Values`)
4. Use `StoryGrid` for the "All" story, individual stories with `args`

### New Primitive

1. Add to `src/components/primitives/`
2. Create both `.vue` and `.styleframe.ts` files
3. Use shared tokens from `primitives/tokens.styleframe.ts`
4. Export from `primitives/index.ts`
