---
"@styleframe/config-typescript": patch
---

Extend `@uxfront/typescript-config/library.json` instead of repeating its options, so `@styleframe/config-typescript` now depends on `@uxfront/typescript-config` and sets only `module`, `moduleResolution`, `declarationMap` and `sourceMap` itself. The compiler options are otherwise the same, but the output now goes to the extending project's own `dist`, where before a relative `outDir` resolved inside this package, and the config includes that project's files by default and excludes its `node_modules` and `dist`. If your project sets its own `outDir` or `declarationDir` outside `dist` and keeps the default `include`, its second build now reads the first one's output and stops with `TS5055`, because the inherited `exclude` replaces TypeScript's default one. Add an `exclude` with `node_modules`, `dist` and that folder, like `["node_modules", "dist", "lib"]`, or narrow your `include`, like `["src"]`.
