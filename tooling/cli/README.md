# @styleframe/cli

The `styleframe` command. It sets up a project, builds your config into CSS and TypeScript, checks it for problems without writing files, lists what it registers, and imports and exports design tokens.

You run it through the `styleframe` package, which depends on this one and provides the `styleframe` binary.

## Install

```bash
pnpm add -D styleframe
```

## Usage

```bash
styleframe init                      # set up styleframe.config.ts and your dependencies
styleframe build                     # write styleframe/index.css and styleframe/index.ts
styleframe check --typecheck --json  # report every problem, write nothing
styleframe inspect --json            # list the variables, themes, utilities, modifiers and recipes
```

## Documentation

- [CLI reference](https://www.styleframe.dev/docs/getting-started/tooling/cli): every command, its options and its exit codes.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
