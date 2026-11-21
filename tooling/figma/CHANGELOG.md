# @styleframe/figma

## 2.1.2

### Patch Changes

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add a `README.md` to each of these packages, so the npm page and the installed package say what the package is, how to install it and where its docs are. Each one links to the new "Using Styleframe with AI agents" page, which covers the `check`, `inspect` and `strict` loop and the mistakes that build without a warning. Until now these packages listed `README.md` in their `files` but shipped none.

- Updated dependencies [[`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d), [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d)]:
  - @styleframe/core@3.8.0

## 2.1.1

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

- Updated dependencies [[`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8)]:
  - @styleframe/core@3.6.2

## 2.1.0

### Minor Changes

- [#229](https://github.com/styleframe-dev/styleframe/pull/229) [`19e9866`](https://github.com/styleframe-dev/styleframe/commit/19e986618c669546972924840189fc5f16f1a1cd) Thanks [@alexgrozav](https://github.com/alexgrozav)! - **Fix:** Resolve critical token loss bug in Figma plugin export where 121 of 464 variables were dropped due to `setNestedToken` overwriting group subtrees instead of promoting parent tokens to `$root`.

  **Feature:** Add mode selector dropdown to Figma plugin Export tab for filtering variables by specific theme/mode before export.

  **Feature:** Add CLI commands for Figma-compatible DTCG sync: `figma export` and `figma import` enable bidirectional token synchronization between Figma collections and design token files.

  **Improvement:** Embed collection metadata in DTCG output via `$extensions.dev.styleframe.collection` for better round-trip awareness.

  **Improvement:** Restore BOOLEAN variable support by converting to string type with `dev.styleframe.boolean: true` extension metadata.

  **Fix:** Correct UI variable count display to read from `msg.result.tokens` instead of wrapper object, ensuring accurate exported variable count and collection name extraction.

### Patch Changes

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

- Updated dependencies [[`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29), [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412), [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f)]:
  - @styleframe/core@3.6.0

## 2.0.0

### Major Changes

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add a new `@styleframe/dtcg` package: a spec-conformant parser, validator, and serializer for the W3C DTCG Format, Color, and Resolver Modules (2025.10).

  The package implements every primitive and composite token type, all 14 color spaces, transitive alias resolution with cycle detection, `$type`/`$deprecated` inheritance, and the full Resolver Module algorithm (sets, modifiers, resolution order, `$ref`-based loading via a consumer-supplied file loader).

  `@styleframe/figma` is rewritten on top of the new package. **Breaking changes:**
  - All token values are now spec-conformant objects: colors are `{colorSpace, components, alpha?, hex?}`, dimensions are `{value, unit}`, durations are `{value, unit}`. CSS strings (`"#006cff"`, `"16px"`) are no longer accepted as `$value`.
  - The legacy `$extensions["dev.styleframe"].modes` and inline `$modifiers` formats are no longer recognised. Multi-mode collections now serialise as a separate `.resolver.json` document; `toDTCG` returns `{ tokens, resolver? }`.
  - Composite token types (`border`, `shadow`, `gradient`, `typography`, etc.) are accepted on import but not represented as native Figma variables.
  - Figma `BOOLEAN` variables are skipped on export (DTCG has no boolean type).

### Patch Changes

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix DTCG export from `@styleframe/cli`: variables now get the correct `$type` and references are preserved as aliases.

  The previous CLI flow piped Styleframe AST through a lossy `FigmaExportFormat` intermediate, then through `figmaTypeToDtcg("STRING") → "fontFamily"` — so most variables ended up tagged as `fontFamily` in the resulting JSON. References were silently replaced with empty strings, and CSS template expressions like `${ref(a)} * ${ref(b)}` were joined into garbage like `" * "`.

  **`@styleframe/dtcg`** gains a new `classifyValue(value, {path?})` helper plus `parseCubicBezier` and `easingKeywordToBezier`. The classifier combines value-content detection with optional path heuristics so callers get a single canonical `{type, value}` pair without per-package guessing.

  **`@styleframe/cli`** now builds the DTCG document directly from the Styleframe `Root`. A small evaluator pre-resolves `Reference` chains and pure-arithmetic CSS templates so computed variables (e.g. `scale.min-powers.*`) emit concrete numbers instead of being skipped or corrupted. Unevaluable expressions (involving `clamp()`, `vw`, etc.) are preserved with a `dev.styleframe.expression` extension, surfaced in a diagnostics summary at the end of the run.

  **`@styleframe/figma`** uses the same classifier with the Figma variable name as a path hint. `figmaTypeToDtcg("STRING")` no longer claims everything is a `fontFamily`; instead callers should use the new `classifyFigmaVariable(variable, value)` which correctly identifies durations under `duration/*`, easings under `easing/*`, stroke styles, and font weights. STRING values whose name gives no usable hint are emitted with a `dev.styleframe.unknownType` extension rather than silently mistyped.

  Round-trip lossiness across Styleframe ↔ DTCG ↔ Figma is now documented in `tooling/dtcg/AGENTS.md`.

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix dark mode round-trip from Styleframe → DTCG → Figma.

  Previously, `styleframe dtcg export` emitted a `tokens.resolver.json` that the Figma plugin had no way to consume — the plugin UI accepted only one file and its import handler always called the single-mode `fromDTCG()`. As a result, dark mode values never reached Figma. The exported resolver was also malformed: `default` referenced a non-existent context, and the resolver lacked a `set` linking to the base `tokens.json`, so any spec-conformant consumer would have failed too.

  **`@styleframe/cli`** — `buildDTCG` now emits a self-contained resolver: `resolutionOrder` begins with a `set` referencing the base tokens file (controllable via `tokensSourceRef`), every theme contributes a capitalized context (`dark` → `Dark`), and a `Default` context (with no overrides) covers the unthemed mode. `default` correctly points at `Default`. Override tokens also carry `$type` so the `mergeDocuments` token-level replacement preserves typing — without this, dark color values lost their `color` type and downstream consumers (e.g. Figma) couldn't convert them, falling back to default white.

  **`@styleframe/figma`** — the plugin UI exposes a second drop slot for `tokens.resolver.json`. When a resolver is provided, `code.ts` routes through `fromDTCGResolver` with an in-memory file loader so each declared context becomes a Figma mode populated with the correct per-mode values.

- [#211](https://github.com/styleframe-dev/styleframe/pull/211) [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix dimension and duration tokens importing as `0` in Figma.

  The Figma plugin's DTCG → Figma converter previously dropped dimension/duration tokens whose unit it couldn't represent as a Figma FLOAT (e.g. `vw`, `vh`), and silently failed to update existing variables whose `resolvedType` no longer matched the incoming token type. Both paths left the affected Figma variable at its default `0`.

  The plugin now:
  - Preserves the original CSS literal as a STRING fallback (e.g. `"100vw"`) instead of dropping the token, so the source value always survives.
  - Detects existing variables whose `resolvedType` differs from the incoming token's type and recreates them so values can be stored. (Figma variables can't change type once created — a previously-imported STRING `spacing/md` would otherwise reject any new FLOAT value.)
  - Emits a console warning when `convertToFigmaValue` cannot store a value, instead of silently leaving the variable at `0`.

  `dtcgValueToFigma` now returns a discriminated union (`{ kind: "value" | "alias" | "fallback" }`) so callers can distinguish a true failure from a legitimate `0`.

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

- Updated dependencies [[`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`c314dbc`](https://github.com/styleframe-dev/styleframe/commit/c314dbc78872df38efe72d7931faf86afce5ffcc)]:
  - @styleframe/dtcg@1.1.0
  - @styleframe/core@3.4.0

## 1.1.0

### Minor Changes

- [#149](https://github.com/styleframe-dev/styleframe/pull/149) [`b9e54ed`](https://github.com/styleframe-dev/styleframe/commit/b9e54eda1acbf1b1b256f96bf6306dc300602618) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Flatten design tokens preset result and rename variable composables
  - Rename all variable composables from `use{Name}` to `use{Name}DesignTokens` for clearer naming
  - Flatten `useDesignTokensPreset` result so variables are directly destructurable instead of nested by domain
  - Add OKLCH gamut mapping utilities for color processing
  - Add color reference value support so colors can reference generated shade/tint variants
  - Add border, transition, and animation utility implementations

### Patch Changes

- Updated dependencies [[`cc4f170`](https://github.com/styleframe-dev/styleframe/commit/cc4f170c56ad2e246b94ab4d64b7f6c3097c7223)]:
  - @styleframe/core@3.2.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`266f961`](https://github.com/styleframe-dev/styleframe/commit/266f96143e9ffb47e0e6326d0e5e7cc9d974ab83), [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118)]:
  - @styleframe/core@3.0.0
