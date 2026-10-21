# @styleframe/core

## 3.7.0

### Minor Changes

- [#301](https://github.com/uxfront-com/styleframe/pull/301) [`e325096`](https://github.com/uxfront-com/styleframe/commit/e3250963c8d3944dc9f36adb634aa3a4d542b9c8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add a first-class `property()` factory for typed custom properties. It composes `variable()` (the value declaration) with an `@property` at-rule (the registration) and returns the same `Variable` — one custom property in the graph, distinct at authoring:

  ```ts
  property("space", "0px", { syntax: "<length>", inherits: false });
  // --space: 0px;
  // @property --space { syntax: "<length>"; inherits: false; initial-value: 0px; }
  ```

  `initialValue` defaults to the value; the `@property` block is registered once per name. Purely additive — the raw `atRule('property', …)` hatch is unchanged, and output is byte-identical when `property()` is unused. The `syntax`→TS-type narrowing is a separate follow-up.

- [#343](https://github.com/uxfront-com/styleframe/pull/343) [`23efb06`](https://github.com/uxfront-com/styleframe/commit/23efb062135ca8e843466da372d90f4cb4173602) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Report token references that resolve to nothing, theme overrides of undefined variables and duplicate variables when the build runs. The new `validate(instance)` returns every problem in one pass as a `Diagnostic` with a `code`, `severity`, `message`, `path` and, when a token name is within two edits, a `suggestion`. It reports an `@token` in a recipe, a utility value or a `css` template literal, and a `ref()` anywhere, that resolves to no variable (`unresolved-reference`), a theme variable that isn't defined at root (`undefined-theme-override`), and two `variable()` calls with the same name and without `default: true` (`duplicate-variable`). A plain `@token` string in a selector or theme declaration still throws when it's defined, as before. `transpile()` runs `validate()` once and returns the diagnostics as `diagnostics` beside `files`, and with the new `strict: true` option on `styleframe()` it throws one error that lists them all instead. Nested at-rules with a hyphen in their name, like `@starting-style` and `@font-feature-values`, now keep the whole name. The theme adds the `z-index.tooltip` token (`700`), which the tooltip recipe already referenced, and the `xs` chip indicator uses `@font-size.3xs` instead of the undefined `@font-size.4xs`. `styleframe` and `@styleframe/transpiler` now accept the `@styleframe/core` release that ships `validate()`.

### Patch Changes

- [#323](https://github.com/uxfront-com/styleframe/pull/323) [`a03a29b`](https://github.com/uxfront-com/styleframe/commit/a03a29b4e44e29f3ffe7acf94f493bed7d82cb02) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Boundary-guard `@`-reference parsing so a `@` mid-token is a literal, not a reference. `AT_VARIABLE_REGEX` matched `@` anywhere in a string, so a retina URL like `url("image@2x.png")` parsed `@2x.png` as a variable reference — silently emitting a dead `var(--2x--png)` before SF-13, and _throwing_ `Variable "2x.png" is not defined` after SF-13 tightened ref validation. The regex now requires a non-word boundary before `@` (`(?<!\w)`), so `@` only starts a reference when not preceded by a word character. Genuine leading-`@` refs (`@color.primary`, `1px solid @spacing.sm`, `@border.width solid @color.primary`) are unchanged, byte for byte; only `@`-mid-token literals change — from broken/throwing to passthrough.

- [#316](https://github.com/uxfront-com/styleframe/pull/316) [`dc08e92`](https://github.com/uxfront-com/styleframe/commit/dc08e92a22db0ec29c2837504d84e3401b0ae9e2) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Validate variable references inside compound `@`-shorthand values. `resolvePropertyValue` already threw `Variable "X" is not defined` for a single exact ref (`padding: "@0.5"`), but the embedded/compound path (`padding: "@0.25 @0.5"`, `border: "1px solid @undefined"`) only recorded usage and skipped `validateReference`, so a compound ref to an undefined variable silently emitted a dead `var(--…)`. The embedded branch now calls `validateReference` for each ref part, matching the single-ref path. Compound refs whose variables are all defined are unchanged (byte-for-byte identical output); only compound refs to undefined variables change — from a silent dead `var(--…)` to a thrown error.

## 3.6.2

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

## 3.6.1

### Patch Changes

- [#238](https://github.com/styleframe-dev/styleframe/pull/238) [`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Bundle type declarations on build. The shared Vite config now enables `vite-plugin-dts`'s `bundleTypes`, so each package ships a single rolled-up `.d.ts` per entry (via `@microsoft/api-extractor`) instead of a tree of per-file declarations. `@microsoft/api-extractor` is now a peer dependency of `@styleframe/config-vite`.

## 3.6.0

### Minor Changes

- [#234](https://github.com/styleframe-dev/styleframe/pull/234) [`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add recipe-level tree-shaking. Unused recipes and their utility classes are excluded from the CSS and TypeScript consumer module during production builds.
  - **Core**: `Root._usage` gains `recipes` and `recipeUtilities` fields. Recipe utility class names are tracked per-recipe in `recipeUtilities` and promoted to `utilities` via `registerRecipeUtilities()`.
  - **Scanner**: New `scanImports()` and `scanFileImports()` methods use importree v2's `parseImports()` to detect which recipes are imported from `virtual:styleframe`.
  - **Transpiler**: TS and DTS consumers filter recipes by `_usage.recipes` — only emitting used recipes when the set is populated.
  - **Plugin**: Recipe scanning integrated into the build flow after content scanning. Defaults to tree-shaking ON for builds, OFF for dev. Safety: namespace/dynamic imports include all recipes with a warning. `recipes.include` option provides an escape hatch for force-including recipes.

- [#226](https://github.com/styleframe-dev/styleframe/pull/226) [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add build-time utility class name shortening for production builds.

  Generates shortening maps at transpile time with collision-safe abbreviation and built-in defaults for common CSS properties. Hashes long arbitrary values for stable compact names. Supports underscore-as-space in arbitrary values (`_padding:[10px_20px]`). Exposes `minify` plugin option with user-overridable defaults.

### Patch Changes

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

## 3.5.0

### Minor Changes

- [#221](https://github.com/styleframe-dev/styleframe/pull/221) [`6d406c2`](https://github.com/styleframe-dev/styleframe/commit/6d406c289b39c666a3fb7468aa3ec08f5a6d316b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `treeshake` option to remove unused variables from CSS output.

  `root._usage` now tracks both `variables` and `utilities` referenced during config execution and scanner registration. The transpiler's new `treeshake: true` option filters `root.variables` and theme variables down to only those present in `_usage.variables`. The plugin enables treeshaking by default when generating global CSS.

## 3.4.0

### Minor Changes

- [#203](https://github.com/styleframe-dev/styleframe/pull/203) [`c314dbc`](https://github.com/styleframe-dev/styleframe/commit/c314dbc78872df38efe72d7931faf86afce5ffcc) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Track variable references in `root._usage.variables` for future transpiler optimizations
  - Add `_usage: { variables: Set<string> }` to `Root` type and initialize in `createRoot()`
  - Record variable names whenever `ref()` is called or `@`-prefixed syntax is resolved

## 3.3.0

### Minor Changes

- [#164](https://github.com/styleframe-dev/styleframe/pull/164) [`efd99f7`](https://github.com/styleframe-dev/styleframe/commit/efd99f70a30f9a42c6e1793ed777b1565fb47a82) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add className support for compound variants in recipes
  - Add optional `className` field to compound variants, appended to output when conditions match
  - Make `css` optional on compound variants, allowing className-only compound variants

### Patch Changes

- [#175](https://github.com/styleframe-dev/styleframe/pull/175) [`b506ea5`](https://github.com/styleframe-dev/styleframe/commit/b506ea5c3c36fa24fea19a69ee3fef7035397dda) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Skeleton recipe with pulse animation and supporting utilities
  - Add `useSkeletonRecipe` with size (`xs`, `sm`, `md`, `lg`, `xl`) and rounded (`true`, `false`) variants, pulse animation, and dark mode support
  - Add granular animation utilities: `useAnimationNameUtility`, `useAnimationDurationUtility`, `useAnimationTimingFunctionUtility`, `useAnimationIterationCountUtility`
  - Switch `useWidthUtility` and `useHeightUtility` to `createUseSpacingUtility` for `@N` multiplier support
  - Add compound keyframe selector support in core engine (e.g. `"0%, 100%"`)
  - Add Skeleton storybook component, grid previews, and stories
  - Add Skeleton documentation page

## 3.2.0

### Minor Changes

- [#155](https://github.com/styleframe-dev/styleframe/pull/155) [`cc4f170`](https://github.com/styleframe-dev/styleframe/commit/cc4f170c56ad2e246b94ab4d64b7f6c3097c7223) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Refactor recipes, improve modifier at-rule support, and forward variables through modifier factories
  - Refactor recipes and utilities with improved color theming composables
  - Add at-rule support for modifiers (e.g. media preference modifiers)
  - Forward variables and children through all modifier factory functions
  - Restructure docs for components, utilities, and modifiers into composable subdirectories
  - Add Button composable recipe documentation
  - Update plugin scanner for improved recipe handling

## 3.1.0

### Minor Changes

- [#129](https://github.com/styleframe-dev/styleframe/pull/129) [`2610041`](https://github.com/styleframe-dev/styleframe/commit/2610041beb03a8afc8de17af8857b9931f3359b0) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add custom utility syntax support and separate class name generation from CSS escaping
  - Extract `defaultUtilitySelectorFn` to `@styleframe/core` returning raw class names; add `classNameToCssSelector` for consistent CSS escaping
  - Add `ScannerUtilitiesConfig` with pluggable `pattern`, `parse`, and `selector` functions for custom utility naming conventions
  - Thread custom utilities config through extractor, matcher, scanner, and plugin layers

- [#133](https://github.com/styleframe-dev/styleframe/pull/133) [`ce62d31`](https://github.com/styleframe-dev/styleframe/commit/ce62d318275deed277d828fdd8d2500c1a9d767f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add unique id and parent-child traversal to token types, validate @ references, and resolve utility sibling keys
  - Add unique `id` field to Root, Selector, AtRule, Theme, Utility, Modifier, and Variable token types for stable identity tracking
  - Add `parentId` to track parent-child relationships across the token tree
  - Add `root._registry` for efficient id-based lookups and tree traversal
  - Validate `@`-prefixed string references against root-level variables in `parseDeclarationsBlock`, throwing descriptive errors for undefined variables
  - Add null/undefined guard to `ref()` with clear error messages
  - Support `@`-prefixed values in utility entries that resolve to sibling keys (e.g., `{ default: "@solid", solid: "solid" }`)

### Patch Changes

- [#141](https://github.com/styleframe-dev/styleframe/pull/141) [`295f04e`](https://github.com/styleframe-dev/styleframe/commit/295f04e6fdd011df6437986cc179e17efd8cd1be) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@variablename` notation support in `css` template literals
  - `@variablename` strings in static parts of `css` template literals are automatically converted to variable references: `` css`1px solid @color.primary` `` resolves `@color.primary` to `ref("color.primary")`
  - Supports dotted names (e.g., `@color.primary.500`) and multiple references per segment (e.g., `` css`@spacing.x @spacing.y` ``)

- [#128](https://github.com/styleframe-dev/styleframe/pull/128) [`71009c2`](https://github.com/styleframe-dev/styleframe/commit/71009c2c0a07a0bfd240e70e61020c8b7e923edb) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add auto-resolve for variables and at-rules in `css` template literal interpolations
  - Variables interpolated directly in `css` are automatically converted to references: `` css`${variable}` `` is equivalent to `` css`${ref(variable)}` ``
  - AtRule and keyframes instances interpolated in `css` resolve to their rule name: `` css`${keyframeInstance}` `` is equivalent to `` css`${keyframeInstance.rule}` ``

- [#140](https://github.com/styleframe-dev/styleframe/pull/140) [`7a61df0`](https://github.com/styleframe-dev/styleframe/commit/7a61df083bc534caa9271a1ef4535f7be979d7c2) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@variablename` reference support in `variable()` values, `ref()` fallbacks, and `selector()` declaration values
  - `variable('name', '1px solid @color.primary')` resolves embedded `@` references to a CSS object with mixed text and reference parts
  - `ref('name', '@fallbackvar')` resolves `@`-prefixed fallback values to nested references
  - `selector({ border: "1px solid @color.primary" })` resolves embedded `@` references in declaration values
  - Extract shared `resolvePropertyValue()` utility for consistent `@` reference resolution across all contexts

## 3.0.1

### Patch Changes

- [#120](https://github.com/styleframe-dev/styleframe/pull/120) [`fa48802`](https://github.com/styleframe-dev/styleframe/commit/fa488027d32956e20fa26dc92ee1a3b3583671ad) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add hash-based utility class names for arbitrary CSS values containing whitespace. Values like `transition: 'all 0.3s ease'` now produce valid CSS class names using a deterministic hash (e.g., `_transition:2f7a3b1`) instead of invalid bracket notation with spaces.

## 3.0.0

### Major Changes

- [#117](https://github.com/styleframe-dev/styleframe/pull/117) [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Introduce global Styleframe single-instance architecture. Extension files (`*.styleframe.ts`) now share the same instance created in `styleframe.config.ts` instead of creating independent instances. This is a breaking change that affects how styles are imported and composed across files.

### Minor Changes

- [#81](https://github.com/styleframe-dev/styleframe/pull/81) [`266f961`](https://github.com/styleframe-dev/styleframe/commit/266f96143e9ffb47e0e6326d0e5e7cc9d974ab83) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add @-prefixed string reference shorthand and fix keyframes object API
  - Add `@`-prefixed string reference shorthand for inline token references in declarations (e.g., `"@color.primary"`)
  - Fix keyframes object API outputting `[object Object]` by parsing percentage, `from`, and `to` keys as nested selectors
  - Prevent namespace double-prepending for `@`-prefixed values in utilities and defaults

## 2.6.0

### Minor Changes

- [#96](https://github.com/styleframe-dev/styleframe/pull/96) [`8460f16`](https://github.com/styleframe-dev/styleframe/commit/8460f169cec1199810e9203b357dac9f2f128c56) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Rename `?recipe` imports to `?ts` and add named selector export support
  - **Breaking:** Renamed import query parameter from `?recipe` to `?ts` for styleframe files
  - Add support for exporting named selectors alongside recipes via `?ts` imports
  - Add `_exportName` property to `Selector` and `Recipe` types for tracking named exports
  - Replace `c12` with `chokidar` + `jiti` for simpler, more reliable config loading
  - Add `onError` callback to `watchConfiguration` for error reporting during file watch
  - Add file deletion detection with `unlink` handler in watch mode
  - Simplify `loadConfiguration` API by merging `loadConfigurationFromPath`
  - Add comprehensive unit tests for TypeScript selector consumer

## 2.5.0

### Minor Changes

- [#72](https://github.com/styleframe-dev/styleframe/pull/72) [`d98b650`](https://github.com/styleframe-dev/styleframe/commit/d98b65030170582ceacfabde3ba9ff7d92105389) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for .styleframe file imports

## 2.4.0

### Minor Changes

- [#63](https://github.com/styleframe-dev/styleframe/pull/63) [`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add styleframe runtime for recipes

## 2.3.0

### Minor Changes

- [#68](https://github.com/styleframe-dev/styleframe/pull/68) [`653d1fc`](https://github.com/styleframe-dev/styleframe/commit/653d1fc4e8fb80f8c3371e728ffc962cf1fb1cec) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for dot notation in variable names

## 2.2.0

### Minor Changes

- [`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - chore: update dependencies

## 2.1.0

### Minor Changes

- [#55](https://github.com/styleframe-dev/styleframe/pull/55) [`1fd348e`](https://github.com/styleframe-dev/styleframe/commit/1fd348e5f379318f76d68055efacd370618f00d6) Thanks [@alexgrozav](https://github.com/alexgrozav)! - refactor: have all styleframe packages as peerDependencies

## 2.0.2

### Patch Changes

- [`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: update license package version

- [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update package dependencies

## 2.0.1

### Patch Changes

- [#52](https://github.com/styleframe-dev/styleframe/pull/52) [`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix(cli): update install version

## 1.1.0

### Minor Changes

- [#50](https://github.com/styleframe-dev/styleframe/pull/50) [`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add license check integration

## 1.0.3

### Patch Changes

- Updated dependencies [[`6700e6f`](https://github.com/styleframe-dev/styleframe/commit/6700e6fa835183ac50808c05d44154c25e85e9e1)]:
  - @styleframe/license@1.0.0

## 1.0.2

### Patch Changes

- [#35](https://github.com/styleframe-dev/styleframe/pull/35) [`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: Update published files references in package.json

## 1.0.1

### Patch Changes

- Update README.md

## 1.0.0

### Major Changes

- 8204e6d: Official styleframe release. Start writing modern, clean, composable CSS using TypeScript, with a focus on simplicity and performance.
