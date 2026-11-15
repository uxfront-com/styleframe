<div align="center">
  <img src="https://www.styleframe.dev/logotype-light.svg" alt="Styleframe" width="320" height="120">

**Type-safe, Composable CSS in TypeScript**

From simple UI styles to full Design Systems, write code using Styleframe’s powerful TypeScript CSS API — AI-ready by design.

[![npm version](https://img.shields.io/npm/v/styleframe.svg)](https://www.npmjs.com/package/styleframe)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/styleframe-dev/styleframe/blob/main/LICENSE)
[![Discord](https://img.shields.io/discord/1395724958919032943?label=Discord&logo=discord)](https://discord.gg/KCVwuGz44M)

[Homepage](https://styleframe.dev) · [Documentation](https://styleframe.dev/docs)

</div>

---

# styleframe

## ✨ Features

- **🛡️ Type-safe CSS API** - Catch style bugs at compile time with full TypeScript support
- **🧩 Composable & Modular** - Build design systems from reusable, composable functions
- **🎨 Built-in Theming** - Create light/dark modes and custom themes effortlessly
- **⚡ Framework Agnostic** - Works with React, Vue, Svelte, Solid, Astro, and more
- **🔥 First-class DX** - IDE auto-complete, in-editor docs, and static analysis

## 🚀 Quick Start

### Installation

```bash
# npm
npx styleframe init && npm install

# pnpm
pnpx styleframe init && pnpm install

# yarn
yarn styleframe init && yarn install

# bun
bunx styleframe init && bun install
```

Using the CLI command above, it will:

- Install `styleframe` as a development dependency to your project
- Add the `styleframe` plugin to Vite, if possible
- Create a new `styleframe.config.ts` file

## 💡 Usage

```typescript
import { styleframe } from "styleframe";

const s = styleframe();
const { variable, ref, selector, theme } = s;

// Define design tokens
const colorPrimary = variable("color--primary", "#006cff");
const spacing = variable("spacing--md", "1rem");

// Create styles
selector(".button", {
    backgroundColor: ref(colorPrimary),
    padding: ref(spacing),
    borderRadius: "4px",
    color: "white",

    "&:hover": {
        opacity: 0.9,
    },
});

// Add dark theme
theme("dark", (ctx) => {
    ctx.variable(colorPrimary, "#60a5fa");
});

export default s;
```

## 📚 Documentation

Styleframe is extremely powerful and flexible. The code preview above is just a small example of what you can achieve with styleframe.

Read the full documentation at [https://styleframe.dev](https://styleframe.dev).

## 🎯 Why styleframe?

After over 10 years of working on Design Systems for successful companies, we've learned a lot about what makes a great Design System. Styleframe is built on these learnings and is designed to help you easily build your own.

[Read more](https://styleframe.dev/docs) about styleframe's philosophy and design principles.

## 🔗 Framework Integration

Styleframe works seamlessly with any framework:

- **Vite** - Native plugin support
- **React** - Perfect for component libraries
- **Vue** - Full SFC compatibility
- **Svelte** - Works out of the box
- **Astro** - Static site ready
- **Solid** - Reactive styling

See the [installation guide](https://styleframe.dev/docs/getting-started/installation/vite) for framework-specific setup.

## 📖 Documentation

- **[Getting Started](https://styleframe.dev/docs/getting-started/introduction)** - Learn the basics
- **[API Reference](https://styleframe.dev/docs/api/variables)** - Complete API documentation
- **[Guides](https://styleframe.dev/docs/resources/guides)** - Step-by-step tutorials
- **[Examples](https://github.com/styleframe-dev/examples)** - Real-world examples

## 🤝 Community

- **[Discord](https://discord.gg/KCVwuGz44M)** - Chat with the community
- **[GitHub Issues](https://github.com/styleframe-dev/styleframe/issues)** - Report bugs or request features
- **[Discussions](https://github.com/styleframe-dev/styleframe/discussions)** - Ask questions and share ideas

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/styleframe-dev/styleframe.git

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build
```

## 📝 License

Styleframe is [MIT licensed](https://github.com/styleframe-dev/styleframe/blob/main/LICENSE).

## 💎 Styleframe Pro

Looking for advanced features? Check out [Styleframe Pro](https://styleframe.dev/pricing) for:

- Premium composables and design tokens
- Advanced theming capabilities
- Priority support
- Commercial licenses

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/styleframe-dev">styleframe</a></sub>
</div>
