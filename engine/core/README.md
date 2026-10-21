# @styleframe/core

The core of Styleframe: the `styleframe()` instance you write your design system with, and the functions it gives you, like `variable()`, `ref()`, `selector()`, `utility()`, `recipe()` and `theme()`. It also exports `validate()`, which reports in one pass the token references it finds that resolve to nothing, the theme overrides of undefined tokens and the duplicate tokens, and `inspect()`, which lists what an instance registers.

Most projects don't import it directly. The `styleframe` package re-exports it, so you write `import { styleframe } from "styleframe"`.

## Install

```bash
pnpm add -D styleframe
```

To use the core on its own, without the CLI and the build tools, install it and import from `@styleframe/core` instead of `styleframe`:

```bash
pnpm add -D @styleframe/core
```

## Usage

```ts
import { styleframe } from "styleframe";

const s = styleframe();
const { variable, ref, utility } = s;

const spacingMd = variable("spacing.md", "1rem");

const createMarginUtility = utility("margin", ({ value }) => ({
	margin: value,
}));

createMarginUtility({ md: ref(spacingMd) });

export default s;
```

## Documentation

- [The Styleframe instance](https://www.styleframe.dev/docs/api/instance): every function the instance gives you, its options, `strict` and `inspect()`.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
