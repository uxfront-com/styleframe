# @styleframe/plugin

## 3.5.0

### Minor Changes

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `inspect(instance)`, which returns a JSON-serialisable snapshot of what an instance defines: its root variables with the custom property and value they emit, its themes with their selector and overrides, its utilities with their values, class names and modifiers, its modifiers, and its recipes with their variant options and defaults. The CLI gains `styleframe check [entry] [--json]`, which runs `validate()` on your configuration without writing any files and exits with `1` when it finds a problem or the config file doesn't exist. With `--json`, it prints one `{ "ok", "diagnostics" }` document on stdout and nothing else. `styleframe build` now prints one warning line per diagnostic, exits with `1` under `strict: true` without writing anything, and exits with `1` when the build fails, where it used to log the error and exit with `0`. The bundler plugin logs each diagnostic once per build as a warning, so builds that use it, Inkline's included, will start showing them, and under `strict: true` it fails the build, including when it regenerates type declarations in the dev server.

### Patch Changes

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add a `README.md` to each of these packages, so the npm page and the installed package say what the package is, how to install it and where its docs are. Each one links to the new "Using Styleframe with AI agents" page, which covers the `check`, `inspect` and `strict` loop and the mistakes that build without a warning. Until now these packages listed `README.md` in their `files` but shipped none.

- Updated dependencies [[`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d)]:
  - @styleframe/loader@3.0.5
  - @styleframe/transpiler@3.5.1
  - @styleframe/scanner@3.2.3

## 3.4.2

### Patch Changes

- [#273](https://github.com/uxfront-com/styleframe/pull/273) [`04dcb53`](https://github.com/uxfront-com/styleframe/commit/04dcb53c6ae7e2bfdb3785231c02cd0863fcda61) Thanks [@jaasieldelgado131](https://github.com/jaasieldelgado131)! - Publish the `@styleframe/plugin/types` entry point.

- Updated dependencies [[`23efb06`](https://github.com/uxfront-com/styleframe/commit/23efb062135ca8e843466da372d90f4cb4173602)]:
  - @styleframe/transpiler@3.5.0

## 3.4.1

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

- Updated dependencies [[`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8)]:
  - @styleframe/loader@3.0.4
  - @styleframe/scanner@3.2.2
  - @styleframe/transpiler@3.4.2

## 3.4.0

### Minor Changes

- [#234](https://github.com/styleframe-dev/styleframe/pull/234) [`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add recipe-level tree-shaking. Unused recipes and their utility classes are excluded from the CSS and TypeScript consumer module during production builds.
  - **Core**: `Root._usage` gains `recipes` and `recipeUtilities` fields. Recipe utility class names are tracked per-recipe in `recipeUtilities` and promoted to `utilities` via `registerRecipeUtilities()`.
  - **Scanner**: New `scanImports()` and `scanFileImports()` methods use importree v2's `parseImports()` to detect which recipes are imported from `virtual:styleframe`.
  - **Transpiler**: TS and DTS consumers filter recipes by `_usage.recipes` — only emitting used recipes when the set is populated.
  - **Plugin**: Recipe scanning integrated into the build flow after content scanning. Defaults to tree-shaking ON for builds, OFF for dev. Safety: namespace/dynamic imports include all recipes with a warning. `recipes.include` option provides an escape hatch for force-including recipes.

- [#226](https://github.com/styleframe-dev/styleframe/pull/226) [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add build-time utility class name shortening for production builds.

  Generates shortening maps at transpile time with collision-safe abbreviation and built-in defaults for common CSS properties. Hashes long arbitrary values for stable compact names. Supports underscore-as-space in arbitrary values (`_padding:[10px_20px]`). Exposes `minify` plugin option with user-overridable defaults.

### Patch Changes

- [#235](https://github.com/styleframe-dev/styleframe/pull/235) [`6acd766`](https://github.com/styleframe-dev/styleframe/commit/6acd766eefc82139d8cd98dfb9b553449945d704) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Generate DTS output as two files that describe the virtual modules in two complementary forms. The transpiler's `dts` mode now emits:
  - `styleframe.d.ts` — top-level exports describing the `virtual:styleframe` module
  - `shims.d.ts` — self-contained ambient declarations: a `declare module "virtual:styleframe"` carrying the full typed exports, plus the `virtual:styleframe.css` string shim

  Non-Vue consumers resolve both virtual modules from `shims.d.ts` alone (picked up via the `.styleframe/**/*.d.ts` include) with **zero `paths` configuration**. Vue consumers additionally map `virtual:styleframe` to `styleframe.d.ts` via a `compilerOptions.paths` entry, because `vue-tsc` won't resolve a bare-specifier ambient module imported inside a `.vue` SFC. `styleframe init` detects plain Vue projects (a `vue` dependency without `nuxt`) and writes that `paths` entry only for them, merging into any existing `paths`; non-Vue projects just get the includes. Nuxt is excluded because its module already injects the mapping via `prepare:types`, and writing `paths` into an `extends`-based Nuxt root tsconfig would replace (not merge) Nuxt's inherited aliases.

  The Nuxt module registers the same `virtual:styleframe` path mapping into Nuxt's generated types via the `prepare:types` hook, so imports type-check without manual tsconfig changes. It also fixes the module's `configKey`/`name`, which were leftover `unpluginStarter` placeholders that caused `styleframe: {}` options in `nuxt.config` to be ignored.

- [#232](https://github.com/styleframe-dev/styleframe/pull/232) [`83d39dd`](https://github.com/styleframe-dev/styleframe/commit/83d39ddaf1739a22d2cc8b4a6a509fa490e30fee) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Update importree from v1 to v2. Adapt dependency graph merging to the new `ImportEdge[]` type in `graph` and `reverseGraph`.

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

- Updated dependencies [[`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29), [`770ecca`](https://github.com/styleframe-dev/styleframe/commit/770ecca2dbf3cb4afa7406e310ba74b0dfcfdad7), [`6acd766`](https://github.com/styleframe-dev/styleframe/commit/6acd766eefc82139d8cd98dfb9b553449945d704), [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412), [`6941920`](https://github.com/styleframe-dev/styleframe/commit/6941920a50e560e4686aebd154bb6aea4c59c258), [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f)]:
  - @styleframe/scanner@3.2.0
  - @styleframe/transpiler@3.4.0
  - @styleframe/loader@3.0.2

## 3.3.0

### Minor Changes

- [#221](https://github.com/styleframe-dev/styleframe/pull/221) [`6d406c2`](https://github.com/styleframe-dev/styleframe/commit/6d406c289b39c666a3fb7468aa3ec08f5a6d316b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `treeshake` option to remove unused variables from CSS output.

  `root._usage` now tracks both `variables` and `utilities` referenced during config execution and scanner registration. The transpiler's new `treeshake: true` option filters `root.variables` and theme variables down to only those present in `_usage.variables`. The plugin enables treeshaking by default when generating global CSS.

### Patch Changes

- Updated dependencies [[`6d406c2`](https://github.com/styleframe-dev/styleframe/commit/6d406c289b39c666a3fb7468aa3ec08f5a6d316b)]:
  - @styleframe/transpiler@3.3.0
  - @styleframe/scanner@3.1.2

## 3.2.0

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
  - @styleframe/transpiler@3.1.0

## 3.1.0

### Minor Changes

- [#129](https://github.com/styleframe-dev/styleframe/pull/129) [`2610041`](https://github.com/styleframe-dev/styleframe/commit/2610041beb03a8afc8de17af8857b9931f3359b0) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add custom utility syntax support and separate class name generation from CSS escaping
  - Extract `defaultUtilitySelectorFn` to `@styleframe/core` returning raw class names; add `classNameToCssSelector` for consistent CSS escaping
  - Add `ScannerUtilitiesConfig` with pluggable `pattern`, `parse`, and `selector` functions for custom utility naming conventions
  - Thread custom utilities config through extractor, matcher, scanner, and plugin layers

- [#135](https://github.com/styleframe-dev/styleframe/pull/135) [`228b0c0`](https://github.com/styleframe-dev/styleframe/commit/228b0c0bc36332d371dd8a7ca430ebe2be3ac046) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Implement importree-based HMR with selective cache invalidation
  - Replace full-reload HMR with importree-powered dependency graph for selective Jiti cache invalidation
  - Use persistent shared Jiti instance with `moduleCache: true` so unchanged dependencies stay cached across reloads
  - Add `dependency-graph` module that builds merged forward/reverse import trees for cross-entry dependency tracking
  - Export `createSharedJiti`, `clearJitiCache`, and `clearAllJitiCache` from `@styleframe/loader`
  - Remove `resolve.alias` option in favor of automatic dependency detection via importree

- [#137](https://github.com/styleframe-dev/styleframe/pull/137) [`8d6e731`](https://github.com/styleframe-dev/styleframe/commit/8d6e7316dff6ebd0ed5cc29a4061c50786e9e8f5) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `resolve.alias` option to plugin for custom path resolution
  - Add `resolve.alias` option to plugin types for configuring module path alias mappings
  - Resolve relative alias paths to absolute paths relative to the plugin working directory
  - Pass aliases through to Jiti loader and importree dependency graph for proper module resolution and HMR tracking

### Patch Changes

- Updated dependencies [[`2610041`](https://github.com/styleframe-dev/styleframe/commit/2610041beb03a8afc8de17af8857b9931f3359b0), [`ce62d31`](https://github.com/styleframe-dev/styleframe/commit/ce62d318275deed277d828fdd8d2500c1a9d767f)]:
  - @styleframe/scanner@3.1.0
  - @styleframe/transpiler@3.0.1

## 3.0.0

### Major Changes

- [#117](https://github.com/styleframe-dev/styleframe/pull/117) [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Introduce global Styleframe single-instance architecture. Extension files (`*.styleframe.ts`) now share the same instance created in `styleframe.config.ts` instead of creating independent instances. This is a breaking change that affects how styles are imported and composed across files.

### Patch Changes

- Updated dependencies [[`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118)]:
  - @styleframe/transpiler@3.0.0
  - @styleframe/loader@3.0.0
  - @styleframe/scanner@3.0.0

## 2.4.1

### Patch Changes

- [#113](https://github.com/styleframe-dev/styleframe/pull/113) [`b73095f`](https://github.com/styleframe-dev/styleframe/commit/b73095f114ef41158ab552e2784500215393b294) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Improve color previews and HMR handling
  - Fix caching configuration in loader to use fsCache and moduleCache options
  - Add HMR refetch handling for .styleframe.css virtual imports
  - Update SwatchCard styling with proper footer alignment and better contrast

- [#111](https://github.com/styleframe-dev/styleframe/pull/111) [`152d221`](https://github.com/styleframe-dev/styleframe/commit/152d221934ed3c86e76c31229a8925152081243c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix HMR for virtual imports by normalizing file paths and adding fallback full-reload

- Updated dependencies [[`b73095f`](https://github.com/styleframe-dev/styleframe/commit/b73095f114ef41158ab552e2784500215393b294)]:
  - @styleframe/loader@2.4.1

## 2.4.0

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

- [`4e06424`](https://github.com/styleframe-dev/styleframe/commit/4e064245e78903307e6996eebf3f6dae5565de5f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: add Nuxt 4 compatibility

  Updated `@nuxt/kit` and `@nuxt/schema` dependencies to v4.1.3 via the nuxt catalog. Peer dependencies now accept both `^3 || ^4` to support Nuxt 3 and Nuxt 4 projects.

- Updated dependencies [[`8460f16`](https://github.com/styleframe-dev/styleframe/commit/8460f169cec1199810e9203b357dac9f2f128c56)]:
  - @styleframe/loader@2.4.0
  - @styleframe/transpiler@2.6.0

## 2.3.1

### Patch Changes

- [#88](https://github.com/styleframe-dev/styleframe/pull/88) [`0b20658`](https://github.com/styleframe-dev/styleframe/commit/0b20658bb2b8362286ac8d955dfbc961b68d4aec) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: add Nuxt 4 compatibility

  Updated `@nuxt/kit` and `@nuxt/schema` dependencies to v4.1.3 via the nuxt catalog. Peer dependencies now accept both `^3 || ^4` to support Nuxt 3 and Nuxt 4 projects.

## 2.3.0

### Minor Changes

- [#72](https://github.com/styleframe-dev/styleframe/pull/72) [`d98b650`](https://github.com/styleframe-dev/styleframe/commit/d98b65030170582ceacfabde3ba9ff7d92105389) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for .styleframe file imports

### Patch Changes

- Updated dependencies [[`ff1a689`](https://github.com/styleframe-dev/styleframe/commit/ff1a689f36dc4294b2a7353949c6efd220451e9d), [`d98b650`](https://github.com/styleframe-dev/styleframe/commit/d98b65030170582ceacfabde3ba9ff7d92105389)]:
  - @styleframe/transpiler@2.5.0
  - @styleframe/loader@2.3.0

## 2.2.0

### Minor Changes

- [#63](https://github.com/styleframe-dev/styleframe/pull/63) [`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add styleframe runtime for recipes

### Patch Changes

- Updated dependencies [[`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c)]:
  - @styleframe/transpiler@2.4.0

## 2.1.0

### Minor Changes

- [`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - chore: update dependencies

### Patch Changes

- Updated dependencies [[`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b)]:
  - @styleframe/transpiler@2.2.0
  - @styleframe/loader@2.2.0

## 2.0.2

### Patch Changes

- [`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: update license package version

- [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update package dependencies

- Updated dependencies [[`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182), [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3)]:
  - @styleframe/loader@2.0.2
  - @styleframe/transpiler@2.0.2

## 2.0.1

### Patch Changes

- [#52](https://github.com/styleframe-dev/styleframe/pull/52) [`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix(cli): update install version

- Updated dependencies [[`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae)]:
  - @styleframe/loader@2.0.1
  - @styleframe/transpiler@2.0.1

## 1.1.0

### Minor Changes

- [#50](https://github.com/styleframe-dev/styleframe/pull/50) [`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add license check integration

### Patch Changes

- Updated dependencies [[`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356)]:
  - @styleframe/transpiler@1.1.0
  - @styleframe/loader@1.1.0

## 1.0.1

### Patch Changes

- [#35](https://github.com/styleframe-dev/styleframe/pull/35) [`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: Update published files references in package.json

- Updated dependencies [[`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a)]:
  - @styleframe/loader@1.0.3
  - @styleframe/transpiler@1.0.3

## 1.0.0

### Major Changes

- [#30](https://github.com/styleframe-dev/styleframe/pull/30) [`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: Initial release. Add `unplugin` instance with dedicated Vite support

### Patch Changes

- Updated dependencies [[`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35), [`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35)]:
  - @styleframe/loader@1.0.2
  - @styleframe/transpiler@1.0.2
