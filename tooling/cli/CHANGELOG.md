# @styleframe/cli

## 4.2.0

### Minor Changes

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `inspect(instance)`, which returns a JSON-serialisable snapshot of what an instance defines: its root variables with the custom property and value they emit, its themes with their selector and overrides, its utilities with their values, class names and modifiers, its modifiers, and its recipes with their variant options and defaults. The CLI gains `styleframe check [entry] [--json]`, which runs `validate()` on your configuration without writing any files and exits with `1` when it finds a problem or the config file doesn't exist. With `--json`, it prints one `{ "ok", "diagnostics" }` document on stdout and nothing else. `styleframe build` now prints one warning line per diagnostic, exits with `1` under `strict: true` without writing anything, and exits with `1` when the build fails, where it used to log the error and exit with `0`. The bundler plugin logs each diagnostic once per build as a warning, so builds that use it, Inkline's included, will start showing them, and under `strict: true` it fails the build, including when it regenerates type declarations in the dev server.

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `styleframe inspect [entry] [section] [--json]`, which lists the variables, themes, utilities, modifiers and recipes your configuration registers, all of them or one section, as readable lists or as one JSON document on stdout, from the snapshot `inspect()` returns. The `check` command gains `--typecheck`, which runs your project's `tsc` on the entry file with the compiler options of its nearest `tsconfig.json` and reports each type error as a diagnostic with the code `typescript`, beside the problems `validate()` finds. The `typescript` package is now an optional peer dependency: without it, `check --typecheck` exits with `1` and says so.

### Patch Changes

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add a `README.md` to each of these packages, so the npm page and the installed package say what the package is, how to install it and where its docs are. Each one links to the new "Using Styleframe with AI agents" page, which covers the `check`, `inspect` and `strict` loop and the mistakes that build without a warning. Until now these packages listed `README.md` in their `files` but shipped none.

- Updated dependencies [[`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d)]:
  - @styleframe/figma@2.1.2

## 4.1.2

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

- Updated dependencies [[`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8)]:
  - @styleframe/figma@2.1.1

## 4.1.1

### Patch Changes

- [#238](https://github.com/styleframe-dev/styleframe/pull/238) [`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Bundle type declarations on build. The shared Vite config now enables `vite-plugin-dts`'s `bundleTypes`, so each package ships a single rolled-up `.d.ts` per entry (via `@microsoft/api-extractor`) instead of a tree of per-file declarations. `@microsoft/api-extractor` is now a peer dependency of `@styleframe/config-vite`.

- Updated dependencies [[`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1)]:
  - @styleframe/loader@3.0.3

## 4.1.0

### Minor Changes

- [#229](https://github.com/styleframe-dev/styleframe/pull/229) [`19e9866`](https://github.com/styleframe-dev/styleframe/commit/19e986618c669546972924840189fc5f16f1a1cd) Thanks [@alexgrozav](https://github.com/alexgrozav)! - **Fix:** Resolve critical token loss bug in Figma plugin export where 121 of 464 variables were dropped due to `setNestedToken` overwriting group subtrees instead of promoting parent tokens to `$root`.

  **Feature:** Add mode selector dropdown to Figma plugin Export tab for filtering variables by specific theme/mode before export.

  **Feature:** Add CLI commands for Figma-compatible DTCG sync: `figma export` and `figma import` enable bidirectional token synchronization between Figma collections and design token files.

  **Improvement:** Embed collection metadata in DTCG output via `$extensions.dev.styleframe.collection` for better round-trip awareness.

  **Improvement:** Restore BOOLEAN variable support by converting to string type with `dev.styleframe.boolean: true` extension metadata.

  **Fix:** Correct UI variable count display to read from `msg.result.tokens` instead of wrapper object, ensuring accurate exported variable count and collection name extraction.

### Patch Changes

- [#231](https://github.com/styleframe-dev/styleframe/pull/231) [`c0cfbdc`](https://github.com/styleframe-dev/styleframe/commit/c0cfbdc65ddca0b5ea4a420902be2a23580b392f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Update `styleframe init` to install v3.x dependencies instead of v2.x. Remove `@styleframe/pro` from scaffolded dependencies.

- [#235](https://github.com/styleframe-dev/styleframe/pull/235) [`6acd766`](https://github.com/styleframe-dev/styleframe/commit/6acd766eefc82139d8cd98dfb9b553449945d704) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Generate DTS output as two files that describe the virtual modules in two complementary forms. The transpiler's `dts` mode now emits:
  - `styleframe.d.ts` — top-level exports describing the `virtual:styleframe` module
  - `shims.d.ts` — self-contained ambient declarations: a `declare module "virtual:styleframe"` carrying the full typed exports, plus the `virtual:styleframe.css` string shim

  Non-Vue consumers resolve both virtual modules from `shims.d.ts` alone (picked up via the `.styleframe/**/*.d.ts` include) with **zero `paths` configuration**. Vue consumers additionally map `virtual:styleframe` to `styleframe.d.ts` via a `compilerOptions.paths` entry, because `vue-tsc` won't resolve a bare-specifier ambient module imported inside a `.vue` SFC. `styleframe init` detects plain Vue projects (a `vue` dependency without `nuxt`) and writes that `paths` entry only for them, merging into any existing `paths`; non-Vue projects just get the includes. Nuxt is excluded because its module already injects the mapping via `prepare:types`, and writing `paths` into an `extends`-based Nuxt root tsconfig would replace (not merge) Nuxt's inherited aliases.

  The Nuxt module registers the same `virtual:styleframe` path mapping into Nuxt's generated types via the `prepare:types` hook, so imports type-check without manual tsconfig changes. It also fixes the module's `configKey`/`name`, which were leftover `unpluginStarter` placeholders that caused `styleframe: {}` options in `nuxt.config` to be ignored.

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

- Updated dependencies [[`19e9866`](https://github.com/styleframe-dev/styleframe/commit/19e986618c669546972924840189fc5f16f1a1cd), [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f)]:
  - @styleframe/figma@2.1.0
  - @styleframe/loader@3.0.2

## 4.0.0

### Major Changes

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - **BREAKING**: rename `styleframe figma export` → `styleframe dtcg export`.

  The CLI command now lives under a top-level `dtcg` subcommand to reflect that it produces a generic spec-conformant DTCG document, not a Figma-specific format. The DTCG → Figma value conversion (rem→px, ms passthrough, etc.) lives in the `@styleframe/figma` plugin, which consumes the JSON.

  `styleframe figma import` is unchanged — it generates Styleframe TypeScript code from a Figma-flavoured DTCG export.

  Migration:

  ```diff
  - styleframe figma export -o tokens.json
  + styleframe dtcg export -o tokens.json
  ```

  The `--baseFontSize` flag has been removed from the export — base font size is applied by the Figma plugin during import (default 16). Any CI scripts referring to the old command must be updated.

### Minor Changes

- [#213](https://github.com/styleframe-dev/styleframe/pull/213) [`24eebba`](https://github.com/styleframe-dev/styleframe/commit/24eebba87c8fa6fc6822e18d67f4c0412192e793) Thanks [@alexgrozav](https://github.com/alexgrozav)! - **BREAKING**: rename `styleframe figma import` → `styleframe dtcg import`.

  The CLI command now lives under the `dtcg` subcommand alongside `dtcg export`. The command takes a generic spec-conformant DTCG JSON file (whether produced by the `@styleframe/figma` plugin or any other DTCG-compatible tool) and generates Styleframe TypeScript code — there is nothing Figma-specific about it. The top-level `figma` subcommand has been removed; the namespace is reserved for future commands that genuinely interact with the Figma API.

  All flags are unchanged (`--input`/`-i`, `--output`/`-o`, `--composables`, `--rem`, `--baseFontSize`, `--instanceName`).

  Migration:

  ```diff
  - styleframe figma import -i tokens.json
  + styleframe dtcg import -i tokens.json
  ```

  Any CI scripts referring to the old command must be updated.

### Patch Changes

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix DTCG export from `@styleframe/cli`: variables now get the correct `$type` and references are preserved as aliases.

  The previous CLI flow piped Styleframe AST through a lossy `FigmaExportFormat` intermediate, then through `figmaTypeToDtcg("STRING") → "fontFamily"` — so most variables ended up tagged as `fontFamily` in the resulting JSON. References were silently replaced with empty strings, and CSS template expressions like `${ref(a)} * ${ref(b)}` were joined into garbage like `" * "`.

  **`@styleframe/dtcg`** gains a new `classifyValue(value, {path?})` helper plus `parseCubicBezier` and `easingKeywordToBezier`. The classifier combines value-content detection with optional path heuristics so callers get a single canonical `{type, value}` pair without per-package guessing.

  **`@styleframe/cli`** now builds the DTCG document directly from the Styleframe `Root`. A small evaluator pre-resolves `Reference` chains and pure-arithmetic CSS templates so computed variables (e.g. `scale.min-powers.*`) emit concrete numbers instead of being skipped or corrupted. Unevaluable expressions (involving `clamp()`, `vw`, etc.) are preserved with a `dev.styleframe.expression` extension, surfaced in a diagnostics summary at the end of the run.

  **`@styleframe/figma`** uses the same classifier with the Figma variable name as a path hint. `figmaTypeToDtcg("STRING")` no longer claims everything is a `fontFamily`; instead callers should use the new `classifyFigmaVariable(variable, value)` which correctly identifies durations under `duration/*`, easings under `easing/*`, stroke styles, and font weights. STRING values whose name gives no usable hint are emitted with a `dev.styleframe.unknownType` extension rather than silently mistyped.

  Round-trip lossiness across Styleframe ↔ DTCG ↔ Figma is now documented in `tooling/dtcg/AGENTS.md`.

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix `dtcg export`: fluid font-size tokens (and any other tokens whose value reduces to a `calc()` mixing `100vw`, `rem`, and `px` literals) are now normalised to a concrete pixel value using the project's `fluid.max-width` (default 1440) instead of being emitted as opaque `calc(...)` expressions with a `dev.styleframe.unknownType` extension.

  Previously every `font-size.*` token in a config that used `useFluidFontSizeDesignTokens` shipped to Figma as a useless `STRING` variable holding the raw `calc(...)` formula. They now ship as spec-conformant `dimension` tokens (`{value, unit: "px"}`) that the Figma plugin renders as real numeric variables (`font-size/md = 18`, `font-size/lg = 22.5`, etc.).

  The substitution runs only as a fallback after the standard arithmetic check fails, so well-formed numeric expressions are unaffected. Affected tokens carry a `dev.styleframe.fluidBound: "max"` extension so the derivation is auditable. The export run reports `Normalised <n> fluid token(s) using max viewport (<n>px).`

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix dark mode round-trip from Styleframe → DTCG → Figma.

  Previously, `styleframe dtcg export` emitted a `tokens.resolver.json` that the Figma plugin had no way to consume — the plugin UI accepted only one file and its import handler always called the single-mode `fromDTCG()`. As a result, dark mode values never reached Figma. The exported resolver was also malformed: `default` referenced a non-existent context, and the resolver lacked a `set` linking to the base `tokens.json`, so any spec-conformant consumer would have failed too.

  **`@styleframe/cli`** — `buildDTCG` now emits a self-contained resolver: `resolutionOrder` begins with a `set` referencing the base tokens file (controllable via `tokensSourceRef`), every theme contributes a capitalized context (`dark` → `Dark`), and a `Default` context (with no overrides) covers the unthemed mode. `default` correctly points at `Default`. Override tokens also carry `$type` so the `mergeDocuments` token-level replacement preserves typing — without this, dark color values lost their `color` type and downstream consumers (e.g. Figma) couldn't convert them, falling back to default white.

  **`@styleframe/figma`** — the plugin UI exposes a second drop slot for `tokens.resolver.json`. When a resolver is provided, `code.ts` routes through `fromDTCGResolver` with an in-memory file loader so each declared context becomes a Figma mode populated with the correct per-mode values.

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix two regressions in DTCG export uncovered by dogfooding the storybook config:

  **Keyword-classification ambiguity.** The previous classifier matched `FONT_WEIGHT_KEYWORDS` and `STROKE_STYLE_KEYWORDS` on value content alone — but `"normal"` is a perfectly valid value for `letter-spacing`, `font-style`, and `line-height`, not just `font-weight`. Same for `"thin"`/`"medium"`/`"thick"` which are CSS border-width shorthand keywords. The result was that `border-width`, `font-style`, `letter-spacing`, and similar tokens were misclassified as `fontWeight` whenever their alias chain bottomed out at one of these CSS keywords.

  The fix: keyword-based detectors now only fire when the path also indicates the corresponding category (`font-weight` segment for fontWeight, `border-style`/`outline-style`/`stroke` for strokeStyle, `font-family` for fontFamily). Callers that don't supply a path still get the keyword-based behaviour for back-compat. Tokens with no resolvable type emit a `dev.styleframe.unknownType` extension instead of a wrong `$type`.

  **Parent/child path collisions wiped out children.** Styleframe configs commonly define both a parent variable (e.g. `border-width` aliased to `border-width.thin`) AND its child variants (`border-width.thin`, `border-width.medium`, `border-width.thick`). The previous `setNestedToken` logic unconditionally overwrote the slot, so depending on processing order either the parent or all the children were silently lost.

  The fix: `setNestedToken` now uses the spec's reserved `$root` slot for parent tokens that coexist with siblings — a pattern explicitly defined in the Format Module 2025.10 for "group with a base value plus variants". Children survive alongside the parent, and the walker / validator / Figma plugin import all recognise `$root` as the parent's effective leaf.

  The CLI also gains a one-line tip in its diagnostic output explaining that "untyped" tokens are usually CSS keywords with no DTCG equivalent.

  **Numeric-string misclassification as colour.** `classifyValue("100")` and similar 3-character numeric strings were incorrectly classified as `$type: "color"` because culori's `parse()` interprets them as shorthand CSS hex (`"100"` → `#100`). Z-index tokens like `z-index.dropdown = "100"` consequently appeared as sRGB color variables in the exported JSON.

  The fix: `classifyValue` now only forwards strings to culori that structurally look like CSS colors — those starting with `#`, containing `(` (function notation), or beginning with an ASCII letter (named color). Plain numeric strings are excluded before reaching the parser.

  **Plugin import crash on viewport-relative units.** Importing a `tokens.json` that contained any `{value: 100, unit: "vw"}` dimension token caused the entire Figma plugin import to throw `Cannot convert "100vw" to a Figma FLOAT`. The exception propagated through the entire import, leaving all variables (including colors) at their default `#FFFFFF`.

  The fix: `dtcgDimensionToFloat` now returns `undefined` for unsupported units (vw, vh, dvw, svw, etc.) instead of throwing, and `fromDTCG` silently skips variables whose value cannot be converted rather than crashing the whole batch. Colors and other tokens now import correctly even when the document contains fluid/viewport tokens.

  **Out-of-gamut sRGB clamping.** Converting oklch colours to Figma's sRGB RGBA could produce slightly negative channel values (e.g. `r = -4.21e-15`) due to floating-point rounding in the matrix multiplication. The fix clamps `r`, `g`, and `b` to `[0, 1]` in `dtcgColorToFigmaRgba`.

- Updated dependencies [[`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f)]:
  - @styleframe/dtcg@1.1.0
  - @styleframe/figma@2.0.0

## 3.0.0

### Major Changes

- [#117](https://github.com/styleframe-dev/styleframe/pull/117) [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Introduce global Styleframe single-instance architecture. Extension files (`*.styleframe.ts`) now share the same instance created in `styleframe.config.ts` instead of creating independent instances. This is a breaking change that affects how styles are imported and composed across files.

### Patch Changes

- Updated dependencies [[`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118)]:
  - @styleframe/loader@3.0.0
  - @styleframe/figma@1.0.1

## 2.4.0

### Minor Changes

- [#83](https://github.com/styleframe-dev/styleframe/pull/83) [`6deddfd`](https://github.com/styleframe-dev/styleframe/commit/6deddfd7a97df13a7fcb865dbf088995f79bd4f3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Figma plugin for syncing Styleframe variables with Figma variables and CLI commands for Figma import/export

## 2.3.3

### Patch Changes

- [#102](https://github.com/styleframe-dev/styleframe/pull/102) [`90c3ae8`](https://github.com/styleframe-dev/styleframe/commit/90c3ae8dd19a688f88d1b362af6bef732de988d6) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@styleframe/license` dependency and move runtime to production dependencies in init command

## 2.3.2

### Patch Changes

- [#100](https://github.com/styleframe-dev/styleframe/pull/100) [`6ae30fd`](https://github.com/styleframe-dev/styleframe/commit/6ae30fdd281033eb3a37c0a0b0388692506a0e58) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@styleframe/license` as a dependency to the main `styleframe` package and update the CLI init command to add `@styleframe/runtime` as a production dependency instead of a dev dependency.

## 2.3.1

### Patch Changes

- [`1f60314`](https://github.com/styleframe-dev/styleframe/commit/1f60314cde97278294f06e248682026eb53a8af9) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update cli dependency

- Updated dependencies [[`8460f16`](https://github.com/styleframe-dev/styleframe/commit/8460f169cec1199810e9203b357dac9f2f128c56)]:
  - @styleframe/loader@2.4.0

## 2.3.0

### Minor Changes

- [#63](https://github.com/styleframe-dev/styleframe/pull/63) [`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add styleframe runtime for recipes

## 2.2.0

### Minor Changes

- [`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - chore: update dependencies

### Patch Changes

- [`48ea659`](https://github.com/styleframe-dev/styleframe/commit/48ea659789c9cdaf64a86bad7b05f38562d987c9) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update cli version

- Updated dependencies [[`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b)]:
  - @styleframe/loader@2.2.0

## 2.1.0

### Minor Changes

- [#55](https://github.com/styleframe-dev/styleframe/pull/55) [`1fd348e`](https://github.com/styleframe-dev/styleframe/commit/1fd348e5f379318f76d68055efacd370618f00d6) Thanks [@alexgrozav](https://github.com/alexgrozav)! - refactor: have all styleframe packages as peerDependencies

### Patch Changes

- Updated dependencies [[`1fd348e`](https://github.com/styleframe-dev/styleframe/commit/1fd348e5f379318f76d68055efacd370618f00d6)]:
  - @styleframe/loader@2.1.0

## 2.0.2

### Patch Changes

- [`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: update license package version

- [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update package dependencies

- Updated dependencies [[`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182), [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3)]:
  - @styleframe/loader@2.0.2

## 2.0.1

### Patch Changes

- [#52](https://github.com/styleframe-dev/styleframe/pull/52) [`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix(cli): update install version

- Updated dependencies [[`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae)]:
  - @styleframe/loader@2.0.1

## 1.1.0

### Minor Changes

- [#50](https://github.com/styleframe-dev/styleframe/pull/50) [`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add license check integration

### Patch Changes

- Updated dependencies [[`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356)]:
  - @styleframe/loader@1.1.0

## 1.0.5

### Patch Changes

- [#43](https://github.com/styleframe-dev/styleframe/pull/43) [`7e3d008`](https://github.com/styleframe-dev/styleframe/commit/7e3d00849067618802334d5e6823fc31f3aa2612) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for generic records in createUseVariable

## 1.0.4

### Patch Changes

- [#40](https://github.com/styleframe-dev/styleframe/pull/40) [`1787ee2`](https://github.com/styleframe-dev/styleframe/commit/1787ee2b19740e077431b5196a3676ba8543838b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add @styleframe/pro to dependencies

## 1.0.3

### Patch Changes

- [#35](https://github.com/styleframe-dev/styleframe/pull/35) [`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: Update generated init code

- Updated dependencies [[`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a)]:
  - @styleframe/loader@1.0.3

## 1.0.2

### Patch Changes

- [#30](https://github.com/styleframe-dev/styleframe/pull/30) [`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: Add support for modifying Vite and Nuxt configuration files
  feat: Add fallback installation guide links
- Updated dependencies [[`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35)]:
  - @styleframe/loader@1.0.2

## 1.0.1

### Patch Changes

- Update README.md
- Updated dependencies
  - @styleframe/loader@1.0.1

## 1.0.0

### Major Changes

- 8204e6d: Official styleframe release. Start writing modern, clean, composable CSS using TypeScript, with a focus on simplicity and performance.

### Patch Changes

- Updated dependencies [8204e6d]
  - @styleframe/loader@1.0.0
