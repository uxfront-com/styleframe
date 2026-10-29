---
title: The Design Systems Styling Engine
description: Styleframe turns your design system into a type-safe TypeScript source of truth and compiles it to CSS — one engine behind tokens, themes, utilities, and recipes.
---

## Type-safe Styling Engine for Design Systems

Write tokens, themes, utilities and recipes in TypeScript, and compile them to zero-runtime CSS and types. Catch a renamed token before your users do.

[Get started](/docs/getting-started/introduction) · [Star on GitHub](https://github.com/styleframe-dev/styleframe)

```ts [styleframe.config.ts]
import { styleframe } from 'styleframe';
import { useDesignTokensPreset, useGlobalPreset, useModifiersPreset, useSanitizePreset, useUtilitiesPreset, useButtonRecipe } from '@styleframe/theme';

const s = styleframe();

useDesignTokensPreset(s, {
  colors: {
    primary: '#0066ff',
    secondary: '#7c3aed'
  }
});
useSanitizePreset(s);
useGlobalPreset(s);
useUtilitiesPreset(s);
useModifiersPreset(s);

useButtonRecipe(s);

export default s;
```

## Your whole design system, from one config

Change a token once, and it flows to every selector, theme and recipe that uses it.

- **[The compiler is your design-system reviewer](/docs/api)**: Autocomplete runs from a token to a recipe variant. Rename a token and the build fails at the reference, not in production.
- **[Composable](/docs/api/composables)**: Compose and reuse styles with functions, variables, arrays or objects.
- **[Built-in Theming](/docs/api/themes)**: Light, dark and custom themes, all from the same tokens.
- **[One plugin, every major bundler](/docs/getting-started/installation)**: The same config drives Vite, Nuxt, Webpack, Rollup, esbuild, Rspack, Farm, Astro and Bun. Framework-agnostic output works with React, Vue, Svelte, Solid, Astro and more.
- **[Fully Configurable](/docs/api/instance#configuration-options)**: Every option is typed and in one place.
- **[Intuitive Developer Experience](/docs/getting-started/guides)**: Autocomplete, in-editor docs and static analysis for your CSS.

## Compose your system from existing parts

Build your design system from composables you already have, all resolving through one source.

- **Infinitely Customizable**: Make it your own. Start from the default theme and customize every token.
- **Mix and Match Composables**: Colors from one theme, typography from another.

```ts [styleframe.config.ts]
import { styleframe } from 'styleframe';
import { useColorDesignTokens } from '@styleframe/theme';
import { useTypographyDesignTokens, useSpacingDesignTokens } from '@orgname/theme-minimal';
import { useComponents } from './my-components';

const s = styleframe();

// Colors from the default theme
useColorDesignTokens(s, {
    primary: '#318fa0',
    secondary: '#ff6b6b'
});

// Typography and spacing from another theme
useTypographyDesignTokens(s);
useSpacingDesignTokens(s);

// Plus your custom components
useComponents(s);

export default s;
```

[Explore the default theme](/docs/theme/design-tokens)

## One source, every theme

Light, dark and custom themes come from the same tokens, with no separate stylesheet to keep in sync.

- **[Intuitive API](/docs/api/themes)**: A theme is as easy to write as a variable, with no special syntax or class names to remember.
- **[Mix and Match Themes](/docs/api/themes)**: Take colors from one theme and typography from another.

```ts [styleframe.config.ts]
import { styleframe } from 'styleframe';

const s = styleframe();
const { variable, ref, selector, theme } = s;

const surface = variable('color.surface', '#ffffff');
const text = variable('color.text', '#18181b');

selector('.card', {
    background: ref(surface),
    color: ref(text),
});

// Every theme reuses the same tokens — just override their values
theme('dark', (ctx) => {
    ctx.variable(surface, '#18181b');
    ctx.variable(text, '#ffffff');
});

export default s;
```

[Learn about themes](/docs/api/themes)

## Zero-Runtime by Default, Dynamic When You Need It

Your system compiles to static CSS at build time. When you need prop-based styling, an optional runtime handles Recipes.

- **Static Generation**: Your base styles cost nothing at runtime.
- **[Dual Output](/docs/api/instance#configuration-options)**: The transpiler outputs both CSS and TypeScript, and you control exactly what each token generates.
- **[Optional Runtime](/docs/api/recipes)**: Recipes turn props into dynamic component variants, built on the static CSS.

```css [Output]
/* Static CSS generated at build time */
.button {
    background-color: var(--color--primary);
    padding: var(--spacing);
}
```

```ts [Output]
/* Optional runtime for prop-based Recipes */
recipe({
    name: 'button',
    base: { background: '@color.primary' },
    variants: {
        size: {
            sm: { padding: '@spacing.sm' },
            md: { padding: '@spacing.md' },
            lg: { padding: '@spacing.lg' },
        },
    },
    defaultVariants: { size: 'md' },
});
```

[Learn more about Recipes](/docs/api/recipes)

## Write Markup, Skip the CSS

Our Utility Scanner is like Tailwind JIT, but type-safe and built on your own design system. Write utility classes in your markup, and it generates only the CSS you use.

- **Automatic Detection**: No need to pre-define every value: the scanner matches each class to your factories and resolves your tokens.
- **Framework Agnostic**: Built-in extractors for HTML, Vue, React, Svelte, Astro, MDX and more, or add your own.

```html [Component]
<!-- Write utility classes in your markup -->
<div class="_padding:lg _display:flex _gap:[1rem]">
    <button class="_background:primary _hover:background:secondary _padding:md">
        Click me
    </button>
</div>
```

[Learn more about the Scanner](/scanner)

## Sync Design Tokens with Figma

Export your Styleframe design tokens to the W3C DTCG format and import them into Figma, with a mode for each theme.

![Styleframe - Import Design Tokens into Figma](/assets/images/figma-import.png)

- **Bidirectional Sync**: Import tokens into Figma, or export Figma Variables back to JSON, with structure and aliases intact.
- **Multi-Mode Support**: Light, dark and custom themes become Figma modes, on every sync.

[Learn more about the Figma Plugin](/figma)

## AI that Writes Type-safe Composable CSS

Coming Soon

Delegate work to AI agents, from code generation to other technical tasks.

- **Styleframe MCP**: Connect styleframe to Cursor, Claude, ChatGPT and more.
- **Useful AI, built in**: AI workflows that build your design system for you.

Join waitlist for styleframe AI.

## Typography that flows naturally across every screen size

Skip the breakpoints. Styleframe scales your typography and spacing fluidly from phone to desktop.

1. Set the scale for phones
2. Set the scale for desktops
3. Watch as everything scales fluidly in between
