# @styleframe/transpiler

## 3.5.1

### Patch Changes

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add a `README.md` to each of these packages, so the npm page and the installed package say what the package is, how to install it and where its docs are. Each one links to the new "Using Styleframe with AI agents" page, which covers the `check`, `inspect` and `strict` loop and the mistakes that build without a warning. Until now these packages listed `README.md` in their `files` but shipped none.

## 3.5.0

### Minor Changes

- [#343](https://github.com/uxfront-com/styleframe/pull/343) [`23efb06`](https://github.com/uxfront-com/styleframe/commit/23efb062135ca8e843466da372d90f4cb4173602) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Report token references that resolve to nothing, theme overrides of undefined variables and duplicate variables when the build runs. The new `validate(instance)` returns every problem in one pass as a `Diagnostic` with a `code`, `severity`, `message`, `path` and, when a token name is within two edits, a `suggestion`. It reports an `@token` in a recipe, a utility value or a `css` template literal, and a `ref()` anywhere, that resolves to no variable (`unresolved-reference`), a theme variable that isn't defined at root (`undefined-theme-override`), and two `variable()` calls with the same name and without `default: true` (`duplicate-variable`). A plain `@token` string in a selector or theme declaration still throws when it's defined, as before. `transpile()` runs `validate()` once and returns the diagnostics as `diagnostics` beside `files`, and with the new `strict: true` option on `styleframe()` it throws one error that lists them all instead. Nested at-rules with a hyphen in their name, like `@starting-style` and `@font-feature-values`, now keep the whole name. The theme adds the `z-index.tooltip` token (`700`), which the tooltip recipe already referenced, and the `xs` chip indicator uses `@font-size.3xs` instead of the undefined `@font-size.4xs`. `styleframe` and `@styleframe/transpiler` now accept the `@styleframe/core` release that ships `validate()`.

## 3.4.2

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

## 3.4.1

### Patch Changes

- [#238](https://github.com/styleframe-dev/styleframe/pull/238) [`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Bundle type declarations on build. The shared Vite config now enables `vite-plugin-dts`'s `bundleTypes`, so each package ships a single rolled-up `.d.ts` per entry (via `@microsoft/api-extractor`) instead of a tree of per-file declarations. `@microsoft/api-extractor` is now a peer dependency of `@styleframe/config-vite`.

- Updated dependencies [[`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1)]:
  - @styleframe/core@3.6.1

## 3.4.0

### Minor Changes

- [#234](https://github.com/styleframe-dev/styleframe/pull/234) [`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add recipe-level tree-shaking. Unused recipes and their utility classes are excluded from the CSS and TypeScript consumer module during production builds.
  - **Core**: `Root._usage` gains `recipes` and `recipeUtilities` fields. Recipe utility class names are tracked per-recipe in `recipeUtilities` and promoted to `utilities` via `registerRecipeUtilities()`.
  - **Scanner**: New `scanImports()` and `scanFileImports()` methods use importree v2's `parseImports()` to detect which recipes are imported from `virtual:styleframe`.
  - **Transpiler**: TS and DTS consumers filter recipes by `_usage.recipes` — only emitting used recipes when the set is populated.
  - **Plugin**: Recipe scanning integrated into the build flow after content scanning. Defaults to tree-shaking ON for builds, OFF for dev. Safety: namespace/dynamic imports include all recipes with a warning. `recipes.include` option provides an escape hatch for force-including recipes.

- [#226](https://github.com/styleframe-dev/styleframe/pull/226) [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add build-time utility class name shortening for production builds.

  Generates shortening maps at transpile time with collision-safe abbreviation and built-in defaults for common CSS properties. Hashes long arbitrary values for stable compact names. Supports underscore-as-space in arbitrary values (`_padding:[10px_20px]`). Exposes `minify` plugin option with user-overridable defaults.

- [#224](https://github.com/styleframe-dev/styleframe/pull/224) [`6941920`](https://github.com/styleframe-dev/styleframe/commit/6941920a50e560e4686aebd154bb6aea4c59c258) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Export named Props types from `virtual:styleframe` for each recipe (e.g. `import { button, type ButtonProps } from 'virtual:styleframe'`).

### Patch Changes

- [#235](https://github.com/styleframe-dev/styleframe/pull/235) [`6acd766`](https://github.com/styleframe-dev/styleframe/commit/6acd766eefc82139d8cd98dfb9b553449945d704) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Generate DTS output as two files that describe the virtual modules in two complementary forms. The transpiler's `dts` mode now emits:
  - `styleframe.d.ts` — top-level exports describing the `virtual:styleframe` module
  - `shims.d.ts` — self-contained ambient declarations: a `declare module "virtual:styleframe"` carrying the full typed exports, plus the `virtual:styleframe.css` string shim

  Non-Vue consumers resolve both virtual modules from `shims.d.ts` alone (picked up via the `.styleframe/**/*.d.ts` include) with **zero `paths` configuration**. Vue consumers additionally map `virtual:styleframe` to `styleframe.d.ts` via a `compilerOptions.paths` entry, because `vue-tsc` won't resolve a bare-specifier ambient module imported inside a `.vue` SFC. `styleframe init` detects plain Vue projects (a `vue` dependency without `nuxt`) and writes that `paths` entry only for them, merging into any existing `paths`; non-Vue projects just get the includes. Nuxt is excluded because its module already injects the mapping via `prepare:types`, and writing `paths` into an `extends`-based Nuxt root tsconfig would replace (not merge) Nuxt's inherited aliases.

  The Nuxt module registers the same `virtual:styleframe` path mapping into Nuxt's generated types via the `prepare:types` hook, so imports type-check without manual tsconfig changes. It also fixes the module's `configKey`/`name`, which were leftover `unpluginStarter` placeholders that caused `styleframe: {}` options in `nuxt.config` to be ignored.

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

- Updated dependencies [[`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29), [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412), [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f)]:
  - @styleframe/core@3.6.0

## 3.3.0

### Minor Changes

- [#221](https://github.com/styleframe-dev/styleframe/pull/221) [`6d406c2`](https://github.com/styleframe-dev/styleframe/commit/6d406c289b39c666a3fb7468aa3ec08f5a6d316b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `treeshake` option to remove unused variables from CSS output.

  `root._usage` now tracks both `variables` and `utilities` referenced during config execution and scanner registration. The transpiler's new `treeshake: true` option filters `root.variables` and theme variables down to only those present in `_usage.variables`. The plugin enables treeshaking by default when generating global CSS.

### Patch Changes

- Updated dependencies [[`6d406c2`](https://github.com/styleframe-dev/styleframe/commit/6d406c289b39c666a3fb7468aa3ec08f5a6d316b)]:
  - @styleframe/core@3.5.0

## 3.2.0

### Minor Changes

- [#167](https://github.com/styleframe-dev/styleframe/pull/167) [`179c90d`](https://github.com/styleframe-dev/styleframe/commit/179c90d9f73dadbbeb9159ab9fbd7287ceba1f20) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add boolean support for recipe variant props
  - When a variant defines both `true` and `false` keys, the runtime now accepts boolean `true`/`false` values in addition to string `"true"`/`"false"`
  - Generated `.d.ts` type declarations include `| boolean` in the type union for boolean variants

### Patch Changes

- Updated dependencies [[`b506ea5`](https://github.com/styleframe-dev/styleframe/commit/b506ea5c3c36fa24fea19a69ee3fef7035397dda), [`efd99f7`](https://github.com/styleframe-dev/styleframe/commit/efd99f70a30f9a42c6e1793ed777b1565fb47a82)]:
  - @styleframe/core@3.3.0

## 3.1.0

### Minor Changes

- [#155](https://github.com/styleframe-dev/styleframe/pull/155) [`cc4f170`](https://github.com/styleframe-dev/styleframe/commit/cc4f170c56ad2e246b94ab4d64b7f6c3097c7223) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Refactor recipes, improve modifier at-rule support, and forward variables through modifier factories
  - Refactor recipes and utilities with improved color theming composables
  - Add at-rule support for modifiers (e.g. media preference modifiers)
  - Forward variables and children through all modifier factory functions
  - Restructure docs for components, utilities, and modifiers into composable subdirectories
  - Add Button composable recipe documentation
  - Update plugin scanner for improved recipe handling

### Patch Changes

- Updated dependencies [[`cc4f170`](https://github.com/styleframe-dev/styleframe/commit/cc4f170c56ad2e246b94ab4d64b7f6c3097c7223)]:
  - @styleframe/core@3.2.0

## 3.0.1

### Patch Changes

- [#133](https://github.com/styleframe-dev/styleframe/pull/133) [`ce62d31`](https://github.com/styleframe-dev/styleframe/commit/ce62d318275deed277d828fdd8d2500c1a9d767f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add unique id and parent-child traversal to token types, validate @ references, and resolve utility sibling keys
  - Add unique `id` field to Root, Selector, AtRule, Theme, Utility, Modifier, and Variable token types for stable identity tracking
  - Add `parentId` to track parent-child relationships across the token tree
  - Add `root._registry` for efficient id-based lookups and tree traversal
  - Validate `@`-prefixed string references against root-level variables in `parseDeclarationsBlock`, throwing descriptive errors for undefined variables
  - Add null/undefined guard to `ref()` with clear error messages
  - Support `@`-prefixed values in utility entries that resolve to sibling keys (e.g., `{ default: "@solid", solid: "solid" }`)

- Updated dependencies [[`295f04e`](https://github.com/styleframe-dev/styleframe/commit/295f04e6fdd011df6437986cc179e17efd8cd1be), [`71009c2`](https://github.com/styleframe-dev/styleframe/commit/71009c2c0a07a0bfd240e70e61020c8b7e923edb), [`2610041`](https://github.com/styleframe-dev/styleframe/commit/2610041beb03a8afc8de17af8857b9931f3359b0), [`7a61df0`](https://github.com/styleframe-dev/styleframe/commit/7a61df083bc534caa9271a1ef4535f7be979d7c2), [`ce62d31`](https://github.com/styleframe-dev/styleframe/commit/ce62d318275deed277d828fdd8d2500c1a9d767f)]:
  - @styleframe/core@3.1.0

## 3.0.0

### Major Changes

- [#117](https://github.com/styleframe-dev/styleframe/pull/117) [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Introduce global Styleframe single-instance architecture. Extension files (`*.styleframe.ts`) now share the same instance created in `styleframe.config.ts` instead of creating independent instances. This is a breaking change that affects how styles are imported and composed across files.

### Patch Changes

- Updated dependencies [[`266f961`](https://github.com/styleframe-dev/styleframe/commit/266f96143e9ffb47e0e6326d0e5e7cc9d974ab83), [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118)]:
  - @styleframe/core@3.0.0

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

### Patch Changes

- Updated dependencies [[`8460f16`](https://github.com/styleframe-dev/styleframe/commit/8460f169cec1199810e9203b357dac9f2f128c56)]:
  - @styleframe/core@2.6.0

## 2.5.0

### Minor Changes

- [#72](https://github.com/styleframe-dev/styleframe/pull/72) [`d98b650`](https://github.com/styleframe-dev/styleframe/commit/d98b65030170582ceacfabde3ba9ff7d92105389) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for .styleframe file imports

### Patch Changes

- [#80](https://github.com/styleframe-dev/styleframe/pull/80) [`ff1a689`](https://github.com/styleframe-dev/styleframe/commit/ff1a689f36dc4294b2a7353949c6efd220451e9d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: Expand CSS selector escaping for arbitrary values

  Consolidate escape logic into a single regex and extend escaping to cover additional special characters (#, (, ), %, ,) needed for arbitrary CSS value syntax like `[#1E3A8A]`, `[rgb(255,0,0)]`, and `[calc(100%-20px)]`.

- Updated dependencies [[`d98b650`](https://github.com/styleframe-dev/styleframe/commit/d98b65030170582ceacfabde3ba9ff7d92105389)]:
  - @styleframe/core@2.5.0

## 2.4.0

### Minor Changes

- [#63](https://github.com/styleframe-dev/styleframe/pull/63) [`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add styleframe runtime for recipes

### Patch Changes

- Updated dependencies [[`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c)]:
  - @styleframe/core@2.4.0

## 2.3.0

### Minor Changes

- [#68](https://github.com/styleframe-dev/styleframe/pull/68) [`653d1fc`](https://github.com/styleframe-dev/styleframe/commit/653d1fc4e8fb80f8c3371e728ffc962cf1fb1cec) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for dot notation in variable names

### Patch Changes

- [#65](https://github.com/styleframe-dev/styleframe/pull/65) [`7d32059`](https://github.com/styleframe-dev/styleframe/commit/7d320590a311ace8882a5a29db3a911c24b53710) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: do not generate default keyword for utilities

- Updated dependencies [[`653d1fc`](https://github.com/styleframe-dev/styleframe/commit/653d1fc4e8fb80f8c3371e728ffc962cf1fb1cec)]:
  - @styleframe/core@2.3.0

## 2.2.0

### Minor Changes

- [`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - chore: update dependencies

### Patch Changes

- Updated dependencies [[`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b)]:
  - @styleframe/core@2.2.0

## 2.1.0

### Minor Changes

- [#55](https://github.com/styleframe-dev/styleframe/pull/55) [`1fd348e`](https://github.com/styleframe-dev/styleframe/commit/1fd348e5f379318f76d68055efacd370618f00d6) Thanks [@alexgrozav](https://github.com/alexgrozav)! - refactor: have all styleframe packages as peerDependencies

### Patch Changes

- Updated dependencies [[`1fd348e`](https://github.com/styleframe-dev/styleframe/commit/1fd348e5f379318f76d68055efacd370618f00d6)]:
  - @styleframe/core@2.1.0

## 2.0.2

### Patch Changes

- [`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: update license package version

- [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update package dependencies

- Updated dependencies [[`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182), [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3)]:
  - @styleframe/core@2.0.2

## 2.0.1

### Patch Changes

- [#52](https://github.com/styleframe-dev/styleframe/pull/52) [`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix(cli): update install version

- Updated dependencies [[`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae)]:
  - @styleframe/core@2.0.1

## 1.1.0

### Minor Changes

- [#50](https://github.com/styleframe-dev/styleframe/pull/50) [`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add license check integration

### Patch Changes

- Updated dependencies [[`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356)]:
  - @styleframe/core@1.1.0

## 1.0.3

### Patch Changes

- [#35](https://github.com/styleframe-dev/styleframe/pull/35) [`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: Update published files references in package.json

- Updated dependencies [[`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a)]:
  - @styleframe/core@1.0.2

## 1.0.2

### Patch Changes

- [#30](https://github.com/styleframe-dev/styleframe/pull/30) [`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: Add support for custom transpile functions
  refactor: Separate CSS and TS transpilation

## 1.0.1

### Patch Changes

- Update README.md
- Updated dependencies
  - @styleframe/core@1.0.1

## 1.0.0

### Major Changes

- 8204e6d: Official styleframe release. Start writing modern, clean, composable CSS using TypeScript, with a focus on simplicity and performance.

### Patch Changes

- Updated dependencies [8204e6d]
  - @styleframe/core@1.0.0
