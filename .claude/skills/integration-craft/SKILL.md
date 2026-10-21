---
name: integration-craft
description: Institutional knowledge for Styleframe's tooling and seams — plugin architecture (virtual modules, importree HMR, recipe tree-shaking) across 9 bundlers, CLI conventions, DTCG/Figma sync, the changesets release train, packaging traps, and deploy configs. Consult before every tooling/**, config/**, .github/**, or release task.
---

# Integration craft

Styleframe's promise is "works with your stack." This skill maps every seam where that promise is kept — and where it has historically broken.

This seat also owns the root workspace config (`package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`): dependency and orchestration changes route here. Other seats' PRs may update the lockfile as a side effect of their own dependency changes; structural root-config changes are yours.

## Plugin (`tooling/plugin`) — the unplugin core

- One unplugin factory (`src/plugin.ts`), virtual-module resolution in `src/virtual-modules.ts`, per-bundler adapters: **vite, webpack, rollup, esbuild, nuxt, astro, rspack, farm, bun** — adapters are default exports, consumed as `styleframe/plugin/<bundler>`.
- Two virtual modules with **context-dependent faces**: `virtual:styleframe` resolves to the global-instance factory when imported from `*.styleframe.ts` extension files, but to compiled recipe functions/selector constants when imported from app code. `virtual:styleframe.css` is the compiled stylesheet. Bugs that "make no sense" here are usually a face served to the wrong importer.
- **HMR** uses importree-based cache invalidation (importree v2): edits to any `*.styleframe.ts` must invalidate the virtual modules while preserving component state where possible. Test HMR changes against a live dev server — production builds cannot catch HMR regressions.
- **Recipe-level tree-shaking** exists (unused recipes drop from output); when touching codegen or the plugin, verify both that used recipes survive and unused ones disappear.
- A fix for one bundler is a question about eight others: state in the PR which adapters are affected and how you know the others are not.

## CLI (`tooling/cli`) — commander-based

- Commands: `init` (scaffold config, tsconfig includes, detect + wire Vite/Nuxt, install deps), `build`, `dtcg export` / `dtcg import`, `figma` (generate Styleframe code from Figma export).
- Error messages are UI: every failure path says what went wrong **and** what to do next. A stack trace reaching the user is a bug.
- The CLI is the top-of-funnel (`pnpx styleframe init` is the first thing every new user runs) — treat init-flow regressions as P0.

## Token interchange

- `tooling/dtcg` — standalone W3C DTCG library (alias resolution, classification, color/dimension/duration parsing, composite types, inheritance, guards). Heavily tested (23 test files); keep it spec-conformant — it is what makes Styleframe interoperable with Style Dictionary and Tokens Studio.
- `tooling/figma` — bidirectional Figma Variables ↔ DTCG ↔ Styleframe. Name mapping across three conventions (dot / slash / CSS var), multi-mode themes preserved as Figma modes. Preserve token *relationships* (aliases), not just values, in both directions.

## Packaging traps (these broke CI once already)

- tsdown-built packages need `fixedExtension: false` or output silently flips `.js`→`.mjs` / `.d.ts`→`.d.mts`, breaking `bin` and `exports` targets.
- `platform: "node"` entries default to `.mjs` — same failure. After any build-config change: build, then verify every `package.json` `exports`/`bin` path exists in `dist/`.
- Known gap (verified 2026-07-11): `@styleframe/plugin` exports a `bun` adapter, but the `styleframe` barrel does not re-export it (`engine/styleframe/src/plugin/` has no `bun.ts`, no `./plugin/bun` export) — so the sanctioned import path `styleframe/plugin/bun` fails. When adding any adapter, wire it through **both** packages.

## Release train

- Changesets: `pnpm ci:changeset` (author), CI runs `ci:version` (version PR: `changeset version` + lockfile refresh) and `ci:publish` (`build:nodocs` then publish). Publishable: `engine/*`, `theme`, `tooling/*`. Private: apps, testing, config.
- Every behavior change in a publishable package carries a changeset in the same PR — nudge authors in review when missing.
- Release notes get @mise approval before publish; anything commercial (license, Pro) also goes to Alex.

## CI and deploy

- CI: build/test/typecheck/lint on PRs; actionlint gates workflow edits (lint-staged pre-commit + `pnpm lint:actions`); codecov patch coverage gates all packages.
- Deploys: `apps/docs` to Vercel as a static site — `apps/docs/vercel.json` runs the turbo docs build with `NITRO_PRESET=vercel_static`, which writes the Build Output to `apps/docs/.vercel/output` with no serverless function (turbo caches it); `NUXT_PUBLIC_*` are build-time env on the Vercel project. `apps/storybook` (Dokploy) — static build behind nginx, full install + turbo build of workspace deps. `apps/playground` and `apps/storybook` also carry nixpacks configs. Deploy config changes are `build(deploy):` commits.
