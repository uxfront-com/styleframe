# config

Shared build and type-checking configuration packages for the Styleframe monorepo. Contains two packages: `@styleframe/config-typescript` (shared TypeScript compiler settings) and `@styleframe/config-vite` (shared Vite build and Vitest test configuration).

## Package Overview

These packages provide centralized, consistent configuration across all Styleframe engine and theme packages. They are internal infrastructure — not consumed by end users.

---

## @styleframe/config-typescript

Shared `tsconfig.json` base configuration extended by all packages in the monorepo. It extends `@uxfront/typescript-config/library.json`, the library variant of UXFront's shared config, and sets only the options where Styleframe differs from it.

**Package:** `@styleframe/config-typescript`
**Exports:** `tsconfig.json` (the main entry point)
**Extends:** `@uxfront/typescript-config/library.json` (a dependency)
**Peer dependency:** `typescript`

### Usage

Extend from this package in any workspace `tsconfig.json`. The output goes to your own project's `dist`, so you don't need to set `outDir`:

```json
{
    "extends": "@styleframe/config-typescript",
    "include": ["src/**/*.ts"]
}
```

The output keeps the `src` folder, so `tsc -p .` writes `dist/src/index.js`. Add `"rootDir": "src"` under `compilerOptions` for `dist/index.js`, as the [library variant section of the `@uxfront/typescript-config` README](https://www.npmjs.com/package/@uxfront/typescript-config#library-variant) explains.

### Inherited options

The [`@uxfront/typescript-config` README](https://www.npmjs.com/package/@uxfront/typescript-config) lists what the base and its library variant set: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`, `isolatedModules`, `target` (`es2022`), `lib`, `declaration`, `composite` and the rest. The library variant also sets `outDir` to `${configDir}/dist`, so the output lands in the extending project's `dist`, and excludes that project's `node_modules` and `dist`.

### Compiler options

These are the options this package sets on top of the library variant:

| Option | Value | Purpose |
|--------|-------|---------|
| `module` | `esnext` | ESM module system, where the base uses `preserve` |
| `moduleResolution` | `bundler` | Bundler-compatible resolution |
| `declarationMap` | `true` | Generates declaration source maps |
| `sourceMap` | `true` | Generates source maps |

It also sets `"include": ["${configDir}/**/*"]`, every file in the extending project, since the base's own `include` resolves inside `node_modules` and matches nothing there. Set your own `include` to narrow it. Don't set an `exclude` unless you need to, because it replaces the inherited one: if you do, keep `node_modules` and `dist` in it, or a second build reads the first one's output.

The inherited `exclude` also replaces TypeScript's default one, which left out your `outDir`. So if you set your own `outDir` or `declarationDir` outside `dist` and keep the default `include`, the second build reads the first one's output and stops with `TS5055`. Set an `exclude` with `node_modules`, `dist` and that folder, or narrow your `include`, like `["src"]`:

```json
{
    "extends": "@styleframe/config-typescript",
    "compilerOptions": { "outDir": "lib" },
    "exclude": ["node_modules", "dist", "lib"]
}
```

### Best Practices

1. **Always extend this config** — never duplicate compiler options across packages.
2. **Override only what's necessary** — typically `include` and `references`.
3. **Do not weaken strict settings** — the base config enforces `strict`, `noUncheckedIndexedAccess`, and `noImplicitOverride` by design.

---

## @styleframe/config-vite

Shared Vite build configuration and Vitest test setup for all Styleframe library packages.

**Package:** `@styleframe/config-vite`
**Exports:** `createViteConfig` function
**Peer dependencies:** `vite`, `vitest`, `@vitest/coverage-v8`, `vite-plugin-dts`

### Usage

Use in a package's `vite.config.ts`:

```ts
import { createViteConfig } from '@styleframe/config-vite';

export default createViteConfig('package-name', import.meta.dirname);
```

With custom overrides:

```ts
import { createViteConfig } from '@styleframe/config-vite';

export default createViteConfig('package-name', import.meta.dirname, {
    plugins: [customPlugin()],
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/main.ts'),
        },
    },
});
```

### `createViteConfig(name, cwd, options?)`

Creates a Vite configuration object with library build mode and Vitest test settings.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Library name used for build output file naming |
| `cwd` | `string` | Yes | Package root directory (use `import.meta.dirname`) |
| `options` | `UserConfig` | No | Vite config overrides merged into the base config |

**Returns:** `UserConfig` — a Vite configuration object via `defineConfig()`.

**Default configuration:**

| Setting | Value |
|---------|-------|
| Build entry | `src/index.ts` (relative to `cwd`) |
| Build output name | Uses `name` parameter |
| Plugins | `vite-plugin-dts` with `rollupTypes: true` (bundles `.d.ts` output) |
| Test file pattern | `src/**/*.test.{ts,tsx}` |
| Test reporter | `verbose` |
| Coverage provider | `v8` |
| Test globals | `true` (no need to import `describe`, `it`, `expect`) |

**Override behavior:**
- `options.plugins` are appended to the default plugins array (dts plugin is always included).
- `options.build` and `options.build.lib` are shallow-merged with defaults.
- All other Vite config options are spread at the top level.

### Best Practices

1. **Use `import.meta.dirname` for `cwd`** — ensures correct path resolution regardless of how the config is loaded.
2. **Do not override the dts plugin** — it is always included. Add extra plugins via `options.plugins`.
3. **Keep the default entry point** (`src/index.ts`) — only override `build.lib.entry` if the package has a non-standard entry.
4. **Test files follow the convention** `src/**/*.test.{ts,tsx}` — place tests alongside source files, not in a separate directory.
5. **Vitest globals are enabled** — use `describe`, `it`, `expect` without imports. The `@styleframe/config-typescript` base config includes `/// <reference types="vitest/globals" />` via the type declarations.

---

## Anti-Patterns

- Duplicating TypeScript compiler options in individual package `tsconfig.json` files instead of extending the shared config.
- Defining custom Vite build configurations from scratch instead of using `createViteConfig`.
- Removing or weakening strict TypeScript settings in package-level overrides.
- Placing test files outside `src/` — they won't be picked up by the default Vitest include pattern.
- Adding `vite-plugin-dts` manually in overrides — it's already included by default.
