<div align="center">
  <img src="https://www.styleframe.dev/logotype-light.svg" alt="Styleframe" width="320" height="120">

**Type-safe Composable CSS in TypeScript**

From simple UI styles to full Design Systems, write code using Styleframe's powerful TypeScript CSS API.

[![npm version](https://img.shields.io/npm/v/styleframe.svg)](https://www.npmjs.com/package/styleframe)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/styleframe-dev/styleframe/blob/main/LICENSE)
[![Discord](https://img.shields.io/discord/1395724958919032943?label=Discord&logo=discord)](https://discord.gg/KCVwuGz44M)

[Homepage](https://styleframe.dev) · [Documentation](https://styleframe.dev/docs) · [Discord](https://discord.gg/KCVwuGz44M)

</div>

---

## Features

- **Type-safe CSS API** — All styles are validated at compile time. No typos, no runtime surprises.
- **Composable architecture** — Mix, match, and reuse style logic using functions, variables, and composables. Build your design system from ready-made parts.
- **Zero-runtime by default** — CSS is generated at build time for maximum performance. An optional lightweight runtime handles [Recipes](https://styleframe.dev/docs/api/recipes) (component variants).
- **Built-in theming** — Create light, dark, and custom themes with a few lines of code using the `data-theme` attribute.
- **Design token composables** — 200+ utility and 50+ modifier composables from [`@styleframe/theme`](https://styleframe.dev/docs/design-tokens) for colors, spacing, typography, breakpoints, and more.
- **Framework agnostic** — Works with React, Vue, Svelte, Solid, Astro, and any modern frontend stack.
- **Figma sync** — Free, bidirectional design token sync between code and Figma using the [W3C DTCG format](https://styleframe.dev/docs/tooling/figma-plugin).

## Quick Start

Use the CLI to initialize Styleframe in your project:

```bash
# pnpm
pnpx styleframe init
pnpm install

# npm
npx styleframe init
npm install

# yarn
yarn create styleframe
yarn install

# bun
bunx styleframe init
bun install
```

The CLI will:

- Install all `styleframe` packages as dependencies
- Create a `styleframe.config.ts` configuration file
- Create or update `tsconfig.json` with Styleframe includes
- Add the Styleframe plugin to Vite or Nuxt, if detected

Then import the generated CSS in your entry file:

```ts
// main.ts
import 'virtual:styleframe.css';
```

## Usage

```typescript
import { styleframe } from 'styleframe';
import { useColor } from '@styleframe/theme';

const s = styleframe();
const { variable, ref, selector, theme } = s;

// Use design token composables
const { colorPrimary } = useColor(s, {
    primary: '#318fa0',
});

// Define custom tokens
const spacing = variable('spacing', '1rem');

// Create type-safe selectors
selector('.button', {
    backgroundColor: ref(colorPrimary),
    padding: ref(spacing),
    borderRadius: '4px',
    color: 'white',

    '&:hover': {
        opacity: 0.9,
    },
});

// Add a dark theme
theme('dark', (ctx) => {
    ctx.variable(colorPrimary, '#60a5fa');
});

export default s;
```

## How It Works

Styleframe is a **transpiler-first system**. You define design tokens, selectors, utilities, and recipes in TypeScript. The transpiler generates **dual outputs**:

- **CSS** — Variables, selectors, utilities, themes, keyframes
- **TypeScript** — Typed recipe functions with full IDE autocomplete

This architecture gives you complete type safety, IDE auto-complete, and static analysis for your CSS — while producing zero-runtime overhead for base styles.

## Integrations

Styleframe works with any modern frontend framework and build tool.

**Build tools** (via native plugin or [unplugin](https://github.com/unjs/unplugin)):

| Tool | Integration |
|------|------------|
| Vite | Native plugin |
| Nuxt | Native module |
| Webpack | Via unplugin |
| Rollup | Via unplugin |
| esbuild | Via unplugin |
| Rspack | Via unplugin |
| Farm | Via unplugin |
| Astro | Via unplugin |

**Frameworks**: React, Vue, Svelte, Solid, Astro — any framework that consumes CSS.

See the [installation guide](https://styleframe.dev/docs/getting-started/installation) for setup instructions.

## Figma Integration

Sync design tokens between your code and Figma — free, with no seat limits.

- **Bidirectional sync** — Export tokens from code to Figma, or import Figma Variables back to TypeScript
- **Multi-mode support** — Light, dark, and custom themes preserved as Figma modes
- **W3C DTCG format** — Compatible with Style Dictionary, Tokens Studio, and other DTCG tools
- **CI/CD ready** — Run `styleframe dtcg export` in your build pipeline to keep Figma in sync automatically

```bash
# Export design tokens to spec-conformant DTCG JSON
npx styleframe dtcg export \
    --config styleframe.config.ts \
    --output tokens.json \
    --collection "Design Tokens"
```

Learn more about the [Figma plugin](https://styleframe.dev/figma).

## Documentation

- **[Introduction](https://styleframe.dev/docs/getting-started/introduction)** — What Styleframe is and how it works
- **[Installation](https://styleframe.dev/docs/getting-started/installation)** — Setup guides for Vite, Nuxt, and custom builds
- **[API Reference](https://styleframe.dev/docs/api)** — Variables, selectors, utilities, recipes, themes, and more
- **[Design Tokens](https://styleframe.dev/docs/design-tokens)** — Colors, spacing, typography, borders, breakpoints
- **[Tooling](https://styleframe.dev/docs/tooling)** — Figma plugin and utility scanner
- **[Guides](https://styleframe.dev/docs/resources/guides)** — Build a design system in under 15 minutes

## Community

- **[Discord](https://discord.gg/KCVwuGz44M)** — Chat with the community
- **[GitHub Issues](https://github.com/styleframe-dev/styleframe/issues)** — Report bugs or request features
- **[Discussions](https://github.com/styleframe-dev/styleframe/discussions)** — Ask questions and share ideas

## Styleframe Pro

Looking for advanced features? Check out [Styleframe Pro](https://styleframe.dev/pricing) for:

- Premium composables and design tokens
- Advanced theming capabilities
- Priority support
- Commercial licenses

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v22.0.0 or higher
- [pnpm](https://pnpm.io/) v10.7.1 or higher

### Getting Started

```bash
# Clone the repository
git clone https://github.com/styleframe-dev/styleframe.git
cd styleframe

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build

# Start development server (docs + storybook)
pnpm dev:docs
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## License

Styleframe is [MIT licensed](https://github.com/styleframe-dev/styleframe/blob/main/LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/styleframe-dev">Styleframe</a></sub>
</div>
