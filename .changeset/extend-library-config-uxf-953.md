---
"@styleframe/config-typescript": patch
---

Extend `@uxfront/typescript-config/library.json` instead of repeating its options, so `@styleframe/config-typescript` now depends on `@uxfront/typescript-config` and sets only `module`, `moduleResolution`, `declarationMap` and `sourceMap` itself. The output now goes to the extending project's own `dist`, where before a relative `outDir` resolved inside this package. The config includes the extending project's files by default and excludes its `node_modules` and `dist`. The compiler options are otherwise the same.
