# @styleframe/loader

Loads a `styleframe.config.ts` file and builds it into CSS and TypeScript files. The Styleframe CLI and the bundler plugin both use it. Use it yourself when a Node.js script needs to load or build a config, through `loadConfiguration()` and `build()`.

Most projects get it with the `styleframe` package, which re-exports it from `styleframe/loader`.

## Install

```bash
pnpm add -D @styleframe/loader
```

## Documentation

- [CLI reference](https://www.styleframe.dev/docs/getting-started/tooling/cli): the `build` command that runs on this package.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
