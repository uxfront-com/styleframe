# @styleframe/config-vite

## 3.1.2

### Patch Changes

- [#309](https://github.com/uxfront-com/styleframe/pull/309) [`61f23f6`](https://github.com/uxfront-com/styleframe/commit/61f23f6e57c78205f6bc7153e7e06215fc954489) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade the build toolchain to TypeScript 7 (`typescript@^7.0.2`, the native compiler). TS7's package no longer ships the JavaScript Compiler API, which `@microsoft/api-extractor` relies on for its declaration rollup ("Unable to follow symbol"). The shared vite config swaps `vite-plugin-dts` (api-extractor rollup) for `unplugin-dts` (Volar-based per-file emission) and drops the `@microsoft/api-extractor` dependency; `@typescript/typescript6` is added as the Volar JS-API shim.

  **Declaration layout changes; the public type surface does not.** Previously api-extractor flattened each package into a single rolled-up `index.d.ts` with the whole API inlined. It now emits **per-file** `.d.ts` alongside a re-export-barrel `index.d.ts` that mirrors the package's `src/index.ts`. The resolved public type surface is unchanged — a consumer's `import { … } from '@styleframe/core'` resolves the same types (verified symbol-for-symbol, and by a green full-workspace typecheck through the new barrels) — but the on-disk file layout differs.

  Per-file emission is scoped to public source: test files (`**/*.test.*`, `**/__tests__/**`), build-config files (`**/*.config.ts`), and the CLI's `playground/**` scaffolding templates are excluded from declaration output, so the published `dist/` (every package ships `files: ["dist"]`) carries only the consumer-facing declaration set. `.js` bundles are untouched.

## 3.1.1

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

## 3.1.0

### Minor Changes

- [#238](https://github.com/styleframe-dev/styleframe/pull/238) [`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Bundle type declarations on build. The shared Vite config now enables `vite-plugin-dts`'s `bundleTypes`, so each package ships a single rolled-up `.d.ts` per entry (via `@microsoft/api-extractor`) instead of a tree of per-file declarations. `@microsoft/api-extractor` is now a peer dependency of `@styleframe/config-vite`.

## 3.0.1

### Patch Changes

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

## 3.0.0

### Major Changes

- [#117](https://github.com/styleframe-dev/styleframe/pull/117) [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Introduce global Styleframe single-instance architecture. Extension files (`*.styleframe.ts`) now share the same instance created in `styleframe.config.ts` instead of creating independent instances. This is a breaking change that affects how styles are imported and composed across files.

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

## 1.0.1

### Patch Changes

- Update README.md

## 1.0.0

### Major Changes

- Initial release.
