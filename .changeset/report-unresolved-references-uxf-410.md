---
"@styleframe/core": minor
"@styleframe/transpiler": minor
"@styleframe/theme": minor
"styleframe": patch
---

Report unresolved token references, theme overrides of undefined variables, and duplicate variables at build time.

- `@styleframe/core` adds `validate(instance)`, which returns every problem in one pass as `Diagnostic` objects (`code`, `severity`, `message`, `path` and an optional `suggestion`): an `@token` or `ref()` in a recipe, utility, selector or theme that resolves to no variable (`unresolved-reference`), a theme variable that isn't defined at root (`undefined-theme-override`), and two `variable()` calls with the same name and without `default: true` (`duplicate-variable`). The new `strict` option on `styleframe()` turns them into errors. Nested at-rules with a hyphen in their name, like `@starting-style` and `@font-feature-values`, now keep the whole name.
- `@styleframe/transpiler`'s `transpile()` runs `validate()` once and returns the diagnostics as `diagnostics` beside `files`. Under `strict: true`, it throws one error that lists them all instead.
- `@styleframe/theme` adds the `z-index.tooltip` token (`700`), which the tooltip recipe already referenced, and the `xs` chip indicator now uses `@font-size.3xs` instead of the undefined `@font-size.4xs`.
- `styleframe` and `@styleframe/transpiler` now accept the `@styleframe/core` release that ships `validate()`.
