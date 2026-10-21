# @styleframe/runtime

The small runtime that your recipes call in the browser. A build writes an `index.ts` with one function per recipe, made with `createRecipe()` from this package, which turns the props you pass into a string of class names.

Your app imports it at runtime, through that generated file, so install it as a regular dependency rather than a development one.

## Install

```bash
pnpm add @styleframe/runtime
```

## Documentation

- [Recipe runtime](https://www.styleframe.dev/docs/api/recipes/runtime): how the generated recipe functions resolve variants into class names.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
