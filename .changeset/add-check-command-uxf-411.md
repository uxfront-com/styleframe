---
"@styleframe/core": minor
"@styleframe/cli": minor
"@styleframe/plugin": minor
---

Add `inspect(instance)`, which returns a JSON-serialisable snapshot of what an instance defines: its root variables with the custom property and value they emit, its themes with their selector and overrides, its utilities with their values, class names and modifiers, its modifiers, and its recipes with their variant options and defaults. The CLI gains `styleframe check [entry] [--json]`, which runs `validate()` on your configuration without writing any files and exits with `1` when it finds a problem or the config file doesn't exist. With `--json`, it prints one `{ "ok", "diagnostics" }` document on stdout and nothing else. `styleframe build` now prints one warning line per diagnostic, exits with `1` under `strict: true` without writing anything, and exits with `1` when the build fails, where it used to log the error and exit with `0`. The bundler plugin logs each diagnostic once per build as a warning, so builds that use it, Inkline's included, will start showing them, and under `strict: true` it fails the build, including when it regenerates type declarations in the dev server.
