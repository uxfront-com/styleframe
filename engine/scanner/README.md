# @styleframe/scanner

Finds Styleframe utility class names, like `_margin:md`, in your source files, so a build can generate the CSS for the classes you actually use. The bundler plugin runs it for you once you set its `scanner.content` option to the files to scan.

Most projects get it with `@styleframe/plugin`. Install it directly only to scan files from your own tooling.

## Install

```bash
pnpm add -D @styleframe/scanner
```

## Documentation

- [Utility scanner](https://www.styleframe.dev/docs/getting-started/tooling/scanner): what it detects, how to configure it and the class name syntax it reads.
- [Using Styleframe with AI agents](https://www.styleframe.dev/docs/getting-started/tooling/agents): the commands an agent runs to check its work, and the mistakes that build without a warning.
