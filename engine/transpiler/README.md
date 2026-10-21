# @styleframe/transpiler

Turns a Styleframe instance into the files a build writes: the CSS, and the TypeScript that holds your recipes. Its `transpile()` function also runs `validate()` on the instance and returns what it finds as `diagnostics`. When the instance sets `strict: true`, it throws one error that lists them instead.

Most projects get it with the `styleframe` package, which re-exports it from `styleframe/transpiler`.

## Install

```bash
pnpm add -D @styleframe/transpiler
```

## Documentation

- [Recipe output format](https://www.styleframe.dev/docs/api/recipes/output-format): the class names and values the transpiler emits for a recipe.
- [The `strict` option](https://www.styleframe.dev/docs/api/instance#strict): what `transpile()` does with the problems it finds.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
