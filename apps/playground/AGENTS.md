# Styleframe Playground

Interactive client-side playground for Styleframe. Users edit an arbitrary set of files (React `tsx` components + a `styleframe.config.ts`) in CodeMirror; an iframe renders the live result.

## Package

- **Name:** `@styleframe/playground`
- **Shell:** Vite + Vue 3 (the playground UI is a Vue app; it is invisible to users)
- **Preview:** React 19 + `tsx`, bundled in the browser with `esbuild-wasm`
- **Runs:** fully client-side — no server, no auth, no persistence.
- **Not published to npm.**

## Source Layout

```
apps/playground/
├── styleframe.config.ts         # shell: theme presets + #app / html selectors
├── vite.config.ts               # Styleframe Vite plugin (minify:false) + vue() + React vendoring
├── index.html
├── src/
│   ├── App.vue                  # playground shell root (Editor │ Output │ Tree)
│   ├── main.ts                  # imports virtual:styleframe.css, mounts App
│   ├── recipes/                 # playground-local recipes (pg-*), incl. useFileTreeRecipe
│   │   └── playground.styleframe.ts  # registers recipes into the shell instance
│   ├── components/
│   │   ├── SplitPane.vue        # Editor │ Output split
│   │   ├── FileTree.vue         # project tree (far right): create / rename / delete
│   │   ├── EditorPane.vue       # dynamic, path-keyed CodeMirror editors + tabs
│   │   ├── OutputPane.vue       # Preview / CSS / JS tabs
│   │   ├── PreviewFrame.vue     # iframe + postMessage listener
│   │   └── ErrorBanner.vue
│   ├── editor/
│   │   ├── codemirror.ts        # createEditor(...) + languageForPath() (ts / tsx / css)
│   │   └── theme.ts
│   ├── pipeline/
│   │   ├── esbuild.ts           # lazy esbuild-wasm init (single instance)
│   │   ├── transformTs.ts       # strips TS from the config before eval
│   │   ├── evalUserConfig.ts    # rewrites imports, runs config via new Function
│   │   ├── scanAndRegisterUtilities.ts
│   │   ├── transpileStyleframe.ts
│   │   ├── bundlePreview.ts     # esbuild-wasm bundle of all user files → one ESM module
│   │   ├── buildSrcdoc.ts       # CSS + React vendor + bundle → srcdoc
│   │   └── pipeline.ts          # orchestrator + debounce + PipelineResult
│   ├── samples/                 # default file contents (.tsx + config), imported as ?raw
│   └── state/
│       └── playground.ts        # reactive { files, output, error, active* } + file actions
└── test/                        # Vitest specs for pipeline units
```

## Architecture

**Two Styleframe contexts, isolated by an iframe.**

| Context | Compiled by | Where CSS lives | Runtime |
|---|---|---|---|
| Shell UI | `@styleframe/plugin/vite` at dev/build time | `<style>` in parent document | `@styleframe/runtime` bundled into parent |
| User-edited preview | `esbuild-wasm` + `@styleframe/transpiler` at runtime | `<style>` inside iframe `srcdoc` | React + `@styleframe/runtime` inlined into the preview bundle |

The iframe has `sandbox="allow-scripts allow-same-origin"`. There is **no importmap**: `bundlePreview` resolves everything through an in-memory virtual-FS esbuild plugin and inlines it. React is the one exception — it is vendored once as an IIFE (`vite.config.ts` → `buildReactVendor`) that publishes `globalThis.PGReactVendor`, runs first as a classic `<script>`, and is read by thin shims in the bundle. This keeps a single React instance and the whole preview offline.

The virtual-FS plugin resolves:
- relative imports (`./Card`, `../foo/Bar`) against the in-memory `files` map (trying `.tsx/.ts/.jsx/.js/.css` + `index.*`);
- `virtual:styleframe` → the generated runtime TS module (recipe functions like `button`);
- `virtual:styleframe.css` → empty (the CSS is injected separately);
- `react` / `react-dom/client` / `react/jsx-runtime` / `@styleframe/runtime` → vendored shims/sources.

## Pipeline Stages

`runPipeline(input)` runs these sequentially, and returns `{ ok: false, stage, error }` if any step throws. `input` is `{ files, configPath, entryPath }`.

| Stage | Input | Output |
|---|---|---|
| `config-transform` | the `configPath` file's source | compiled JS |
| `config-eval` | compiled JS | `Styleframe` instance |
| `styleframe` | every `*.styleframe.ts` file (sorted) | recipes registered on the shared instance |
| `scan` | every file except the config and `*.styleframe.ts` | utility classes registered on the instance |
| `transpile` | `Styleframe` instance | `{ css, ts }` from `@styleframe/transpiler` |
| `bundle` | all files + `entryPath` + generated runtime TS | one ESM preview module |
| `assemble` | CSS + preview bundle + React vendor IIFE | `srcdoc` string |

`*.styleframe.ts` extension files are evaluated like `@styleframe/plugin` loads them: `import { styleframe } from "virtual:styleframe"` returns the same instance the config created (`evalStyleframeFile` shims `styleframe()` to return it), so each file's recipe registrations mutate the shared instance. They are authoring-only — never scanned or bundled into the preview.

`transpileStyleframe` runs with `treeshake: false` so the preview shows the **complete** generated CSS — the scanner cannot see runtime recipe calls, so tree-shaking would drop recipe/utility CSS the rendered components depend on.

On success, the parent assigns `iframe.srcdoc = srcdoc` and revokes the previous run's blob URLs.

## Key Conventions

1. **Shell styling is via Styleframe only.** No inline styles except a handful of layout-critical resets in `App.vue` (`flex: 1`, `min-height: 0`). All chrome comes from the recipes in `src/recipes/`.
2. **User code mirrors a real Styleframe app.** The default project lives under `src/`, with each component in `src/components/<Name>/` paired with a `<Name>.styleframe.ts` extension file that registers its recipe(s). Components import the compiled recipes from `"virtual:styleframe"`; `styleframe.config.ts` (root) holds presets only and exports the instance as default. `src/App.tsx` is the entry — its default export is the preview root.
3. **Dynamic files and folders.** `state/playground.ts` keys files by path and exposes `createFile` / `createFolder` / `renameFile` / `deleteFile` / `deleteFolder` (the config and entry files, and any folder containing them, are protected). Empty folders are tracked in `state.folders`. `FileTree.vue` drives them.
4. **Sample files are in `src/samples/`** (`.tsx`, `.styleframe.sample.ts`, config), imported via `?raw`, and excluded from the shell `tsconfig` (they target the user's `virtual:styleframe`, not the shell's). The `.styleframe.sample.ts` suffix keeps them from matching the shell plugin's `**/*.styleframe.ts` glob.
5. **CodeMirror 6 used directly.** Language per file via `languageForPath` (`@codemirror/lang-javascript` with `jsx` for `.tsx`, plain `ts`, or `@codemirror/lang-css`).
6. **Parent never evaluates untrusted code.** Only the config runs in `new Function(...)`; components run only inside the iframe.
7. **The last valid preview stays on screen.** Blob URLs from the previous successful run are revoked only when the next run succeeds.

## Testing

```sh
pnpm test --filter @styleframe/playground     # Vitest unit tests (jsdom)
pnpm typecheck --filter @styleframe/playground
```

> Adding a `pg-*` recipe requires running `pnpm dev:playground` (or `build`) once so the plugin regenerates `.styleframe/styleframe.d.ts` before `typecheck` passes.

Manual verification: run `pnpm dev:playground`, create a file from the tree, import it into `App.tsx`, press Ctrl/Cmd+S, and confirm the preview, CSS, and JS tabs update.

## Related

- `src/samples/Button.styleframe.sample.ts`: the default project's one recipe, written with `recipe()`.
- `engine/transpiler/src/transpile.ts` — `transpile(instance)` consumed by `src/pipeline/transpileStyleframe.ts`.
- `engine/runtime/src/runtime.ts` — `createRecipe` consumed by the preview's generated runtime module.
- `apps/storybook/` — mirror setup for Vite + Vue + `@styleframe/plugin`.
