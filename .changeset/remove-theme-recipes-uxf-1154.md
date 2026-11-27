---
"@styleframe/theme": major
---

Move the component recipes (`useButtonRecipe` and the rest) out of `@styleframe/theme` and into `@inkline/theme`, so the theme package keeps to the design tokens, elements, modifiers, utilities and presets that every Styleframe project uses. The package keeps `createUseRecipe` and everything else it exports as they were, so you can still write your own recipes with it or with `recipe()`. **Breaking:** install `@inkline/theme` and import the recipes from it instead, with the same names and options.
