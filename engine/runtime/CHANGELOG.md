# @styleframe/runtime

## 3.2.3

### Patch Changes

- [#348](https://github.com/uxfront-com/styleframe/pull/348) [`e614db7`](https://github.com/uxfront-com/styleframe/commit/e614db75f3e192c8a19801c17ed057be37989c0d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add a `README.md` to each of these packages, so the npm page and the installed package say what the package is, how to install it and where its docs are. Each one links to the new "Using Styleframe with AI agents" page, which covers the `check`, `inspect` and `strict` loop and the mistakes that build without a warning. Until now these packages listed `README.md` in their `files` but shipped none.

## 3.2.2

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

## 3.2.1

### Patch Changes

- [#238](https://github.com/styleframe-dev/styleframe/pull/238) [`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Bundle type declarations on build. The shared Vite config now enables `vite-plugin-dts`'s `bundleTypes`, so each package ships a single rolled-up `.d.ts` per entry (via `@microsoft/api-extractor`) instead of a tree of per-file declarations. `@microsoft/api-extractor` is now a peer dependency of `@styleframe/config-vite`.

- Updated dependencies [[`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1)]:
  - @styleframe/core@3.6.1

## 3.2.0

### Minor Changes

- [#226](https://github.com/styleframe-dev/styleframe/pull/226) [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add build-time utility class name shortening for production builds.

  Generates shortening maps at transpile time with collision-safe abbreviation and built-in defaults for common CSS properties. Hashes long arbitrary values for stable compact names. Supports underscore-as-space in arbitrary values (`_padding:[10px_20px]`). Exposes `minify` plugin option with user-overridable defaults.

### Patch Changes

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

- Updated dependencies [[`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29), [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412), [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f)]:
  - @styleframe/core@3.6.0

## 3.1.0

### Minor Changes

- [#164](https://github.com/styleframe-dev/styleframe/pull/164) [`efd99f7`](https://github.com/styleframe-dev/styleframe/commit/efd99f70a30f9a42c6e1793ed777b1565fb47a82) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add className support for compound variants in recipes
  - Add optional `className` field to compound variants, appended to output when conditions match
  - Make `css` optional on compound variants, allowing className-only compound variants

- [#167](https://github.com/styleframe-dev/styleframe/pull/167) [`179c90d`](https://github.com/styleframe-dev/styleframe/commit/179c90d9f73dadbbeb9159ab9fbd7287ceba1f20) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add boolean support for recipe variant props
  - When a variant defines both `true` and `false` keys, the runtime now accepts boolean `true`/`false` values in addition to string `"true"`/`"false"`
  - Generated `.d.ts` type declarations include `| boolean` in the type union for boolean variants

### Patch Changes

- Updated dependencies [[`b506ea5`](https://github.com/styleframe-dev/styleframe/commit/b506ea5c3c36fa24fea19a69ee3fef7035397dda), [`efd99f7`](https://github.com/styleframe-dev/styleframe/commit/efd99f70a30f9a42c6e1793ed777b1565fb47a82)]:
  - @styleframe/core@3.3.0

## 3.0.0

### Major Changes

- [#117](https://github.com/styleframe-dev/styleframe/pull/117) [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Introduce global Styleframe single-instance architecture. Extension files (`*.styleframe.ts`) now share the same instance created in `styleframe.config.ts` instead of creating independent instances. This is a breaking change that affects how styles are imported and composed across files.

### Patch Changes

- Updated dependencies [[`266f961`](https://github.com/styleframe-dev/styleframe/commit/266f96143e9ffb47e0e6326d0e5e7cc9d974ab83), [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118)]:
  - @styleframe/core@3.0.0

## 2.0.0

### Major Changes

- [#63](https://github.com/styleframe-dev/styleframe/pull/63) [`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add styleframe runtime for recipes

### Patch Changes

- Updated dependencies [[`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c)]:
  - @styleframe/core@2.4.0
