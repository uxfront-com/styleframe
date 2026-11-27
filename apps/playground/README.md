# @styleframe/playground

Interactive, client-side-only Styleframe playground. Author React `tsx` components plus a `styleframe.config.ts`, add and remove files from a project tree, and see them compile and render live.

## Run

```sh
pnpm dev --filter @styleframe/playground
# or
pnpm dev:playground
```

Then open http://localhost:5173.

Build a static deployable bundle:

```sh
pnpm build --filter @styleframe/playground
```

## Why this exists

Two reasons, both load-bearing:

1. **Dogfooding.** The playground UI — split pane, tabs, toolbar, editor chrome, file tree, error banner — is styled entirely with Styleframe. The shell's own `apps/playground/styleframe.config.ts` registers a set of playground-local recipes (`pg-tab`, `pg-split-pane`, `pg-file-tree`, …) alongside the standard theme presets, and builds with `minify: false` so its own `_property:value` class names stay readable.
2. **Preview isolation.** The user-edited config generates its own CSS variables, utility classes, and recipe class names. If those were injected into the same document as the shell, they would collide. The preview therefore renders inside an iframe (`srcdoc`, `sandbox="allow-scripts allow-same-origin"`) with its own `<style>` block and its own bundled React + `@styleframe/runtime`. The shell's Styleframe world and the user's Styleframe world never share a document.

## Layout

```
┌──────────────────────── Toolbar ────────────────────────┐
│ Editor (CodeMirror)   │ Output (Preview/CSS/JS)  │ Tree  │
└─────────────────────── Status bar ──────────────────────┘
```

The **project tree** (far right) lists every file. Hovering an item reveals an **⋯ menu**: files offer _Delete_; folders offer _Delete_, _Create new file_, and _Create new folder_ (scoped to that folder). The header has _New file_ / _New folder_ buttons for the root. The config (`styleframe.config.ts`) and entry (`src/App.tsx`) files, and any folder containing them, are protected. New `.tsx` files are seeded with a minimal React component; new `.styleframe.ts` files with an extension stub.

The default project mirrors a real Styleframe app, a small **UI Kit**: `src/App.tsx` is a gallery that lays out the Button's variants, plus a colours and a utility-class section. The Button defines its own recipe with `recipe()`, so you can see and edit every style it uses.

```
styleframe.config.ts                       # the complete default design-token config
src/App.tsx                                # entry — the UI Kit gallery
src/App.styleframe.ts                      # registers the .ui-kit gallery layout styles
src/components/Button/Button.tsx           # component (recipe wrapper)
src/components/Button/Button.styleframe.ts # defines and registers the button recipe
```

## Pipeline

On run (Ctrl/Cmd+S):

1. `esbuild-wasm` strips TypeScript from `styleframe.config.ts`.
2. The compiled config is evaluated in the parent with its imports stubbed to the real `styleframe` / `@styleframe/theme` packages, producing an in-memory `Styleframe` instance.
3. Every `*.styleframe.ts` file is evaluated against that instance — `import { styleframe } from "virtual:styleframe"` returns it — so each extension registers its recipes onto the shared instance, exactly like `@styleframe/plugin`.
4. The scanner registers any utility classes used in the component files.
5. `@styleframe/transpiler`'s `transpile()` returns generated CSS + a TypeScript runtime module (the recipe functions exported by `virtual:styleframe`).
6. `esbuild-wasm` **bundles** all component files into a single ESM preview module. An in-memory virtual-FS plugin resolves cross-file imports, `virtual:styleframe` (→ the runtime module), and `react` / `react-dom/client` / `@styleframe/runtime` (→ inlined vendor code). The config and `*.styleframe.ts` files are never bundled.
7. `buildSrcdoc` assembles the iframe: the generated CSS, the React vendor (a one-time IIFE that publishes `globalThis.PGReactVendor`), and the preview bundle. No importmap is needed.
8. Any failure is caught per-stage; the last valid preview stays on screen and an error banner shows the first failing message. Runtime errors inside the iframe are forwarded to the shell via `postMessage`.

## Notes

- User components import recipes exactly like a real Styleframe app: `import { button } from "virtual:styleframe"`.
- The preview shows the **complete** generated CSS (transpiled with `treeshake: false`), since the scanner can't see runtime recipe calls.
- The preview mirrors the shell's light/dark/system theme: `PreviewFrame` writes the resolved theme to the iframe's `<html data-theme>` on every load and theme change, so the config's `[data-theme="dark"]` styles apply.
- Editor tabs are a real open-files model — only `styleframe.config.ts` is open by default; the tree opens files, and tabs are closable.
- The playground is **not published to npm**. It's a standalone deployable static site.
- `esbuild-wasm` pulls a ~3 MB `.wasm` asset the first time you run — loaded lazily and once per session. Everything else (React, the runtime) is vendored from the parent origin, so the preview works offline.
- This app depends on `@styleframe/plugin` only for the shell's own `styleframe.config.ts` at dev/build time. The user-edited config never goes through the plugin.
