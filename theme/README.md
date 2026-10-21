# @styleframe/theme

Ready-made building blocks for a Styleframe design system: design tokens, element styles, modifiers, utilities and recipes for components like buttons, badges and cards. The presets register each group in one call, so a working system takes a few lines.

## Install

```bash
pnpm add -D styleframe @styleframe/theme
pnpm add @styleframe/runtime
```

Once you use a recipe, the `index.ts` a build writes imports `@styleframe/runtime`, so your app needs it at runtime too.

## Usage

Call the presets before any recipe, with the design tokens first: the utilities reference the token names, and the recipes use the modifiers and utilities.

```ts
import { styleframe } from "styleframe";
import {
	useButtonRecipe,
	useDesignTokensPreset,
	useModifiersPreset,
	useUtilitiesPreset,
} from "@styleframe/theme";

const s = styleframe();

useDesignTokensPreset(s, { colors: { primary: "#4f46e5" } });
useModifiersPreset(s);
useUtilitiesPreset(s);
useButtonRecipe(s);

export default s;
```

## Documentation

- [Design tokens preset](https://www.styleframe.dev/docs/theme/design-tokens/preset): every token it defines, its options and its themes.
- [Utilities preset](https://www.styleframe.dev/docs/theme/utilities/preset): the utilities it registers.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
