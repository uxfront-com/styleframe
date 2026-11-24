# @styleframe/config-typescript

## 3.0.2

### Patch Changes

- [#416](https://github.com/uxfront-com/styleframe/pull/416) [`e727598`](https://github.com/uxfront-com/styleframe/commit/e72759859ee00934b87b21f1d953a82d19394cb3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Extend `@uxfront/typescript-config/library.json` instead of repeating its options, so `@styleframe/config-typescript` now depends on `@uxfront/typescript-config` and sets only `module`, `moduleResolution`, `declarationMap` and `sourceMap` itself. The compiler options are otherwise the same, but the output now goes to the extending project's own `dist`, where before a relative `outDir` resolved inside this package, and the config includes that project's files by default and excludes its `node_modules` and `dist`. If your project sets its own `outDir` or `declarationDir` outside `dist` and keeps the default `include`, its second build now reads the first one's output and stops with `TS5055`, because the inherited `exclude` replaces TypeScript's default one. Add an `exclude` with `node_modules`, `dist` and that folder, like `["node_modules", "dist", "lib"]`, or narrow your `include`, like `["src"]`.

## 3.0.1

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

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
