---
"@styleframe/cli": minor
---

Add `styleframe inspect [entry] [section] [--json]`, which lists the variables, themes, utilities, modifiers and recipes your configuration registers, all of them or one section, as readable lists or as one JSON document on stdout, from the snapshot `inspect()` returns. The `check` command gains `--typecheck`, which runs your project's `tsc` on the entry file with the compiler options of its nearest `tsconfig.json` and reports each type error as a diagnostic with the code `typescript`, beside the problems `validate()` finds. The `typescript` package is now an optional peer dependency: without it, `check --typecheck` exits with `1` and says so.
