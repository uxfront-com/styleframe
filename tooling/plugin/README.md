# @styleframe/plugin

Builds your Styleframe config as part of your app's build, so your styles update while you work. It runs on Vite, Webpack, Rollup, Rspack, esbuild, Farm, Bun, Nuxt and Astro, and serves the result as the `virtual:styleframe.css` and `virtual:styleframe` modules.

Most projects get it with the `styleframe` package, which re-exports the bundler entries, like `styleframe/plugin/vite`. Running `styleframe init` adds it to a Vite or Nuxt config for you.

## Install

```bash
pnpm add -D @styleframe/plugin
```

## Documentation

- [Vite installation](https://www.styleframe.dev/docs/getting-started/installation/vite): adding the plugin and importing its CSS.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
