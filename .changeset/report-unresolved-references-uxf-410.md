---
"@styleframe/core": minor
"@styleframe/transpiler": minor
"@styleframe/theme": minor
"styleframe": patch
---

Report token references that resolve to nothing, theme overrides of undefined variables and duplicate variables when the build runs. The new `validate(instance)` returns every problem in one pass as a `Diagnostic` with a `code`, `severity`, `message`, `path` and, when a token name is within two edits, a `suggestion`. It reports an `@token` in a recipe, a utility value or a `css` template literal, and a `ref()` anywhere, that resolves to no variable (`unresolved-reference`), a theme variable that isn't defined at root (`undefined-theme-override`), and two `variable()` calls with the same name and without `default: true` (`duplicate-variable`). A plain `@token` string in a selector or theme declaration still throws when it's defined, as before. `transpile()` runs `validate()` once and returns the diagnostics as `diagnostics` beside `files`, and with the new `strict: true` option on `styleframe()` it throws one error that lists them all instead. Nested at-rules with a hyphen in their name, like `@starting-style` and `@font-feature-values`, now keep the whole name. The theme adds the `z-index.tooltip` token (`700`), which the tooltip recipe already referenced, and the `xs` chip indicator uses `@font-size.3xs` instead of the undefined `@font-size.4xs`. `styleframe` and `@styleframe/transpiler` now accept the `@styleframe/core` release that ships `validate()`.
