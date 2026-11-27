# Contributing to Styleframe

### Actively participate in the development and the future of Styleframe by contributing regularly.

Open Source projects are maintained and backed by a **wonderful community** of users and collaborators.

We encourage you to actively participate in the development and future of Styleframe by contributing to the source code, improving documentation, reporting potential bugs or testing new features.

### Channels

There are many ways to take part in the Styleframe community.

1. <a href="https://github.com/styleframe-dev/styleframe" rel="nofollow" target="_blank">Github Repositories</a>: Report bugs or create feature requests against the dedicated Styleframe repository.
2. <a href="https://discord.gg/KCVwuGz44M" rel="nofollow" target="_blank">Discord</a>: Join the Discord Server to chat instantly with other developers in the Styleframe community.

## Using the issue tracker

The [issue tracker](https://github.com/styleframe-dev/styleframe/issues) is
the preferred channel for [bug reports](#bug-reports), [feature requests](#feature-requests)
and [submitting pull requests](#pull-requests), but please respect the following
restrictions:

* Please **do not** use the issue tracker for personal support requests.

* Please **do not** get off track in issues. Keep the discussion on topic and
  respect the opinions of others.

* Please **do not** post comments consisting solely of "+1" or ":thumbsup:".
  Use [GitHub's "reactions" feature](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments)
  instead. We reserve the right to delete comments which violate this rule.

## Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful, so thanks!

Guidelines for bug reports:

1. Provide a clear title and description of the issue.
2. Share the version of Styleframe you are using.
3. Add code examples to demonstrate the issue. You can also provide a complete repository to reproduce the issue quickly.

A good bug report shouldn't leave others needing to chase you up for more information. Please try to be as detailed as possible in your report:

- What is your environment? (Node.js version, build tool, OS)
- What steps will reproduce the issue?
- What would you expect to be the outcome?
- If applicable, include a minimal `styleframe.config.ts` and `*.styleframe.ts` file pair that reproduces the problem.

All these details will help us fix any potential bugs. Remember, fixing bugs takes time. We're doing our best!

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being
> reported. This might include the lines of code that you have identified as
> causing the bug, and potential solutions (and your opinions on their
> merits).

## Feature requests

Feature requests are welcome! When opening a feature request, it's up to *you* to make a strong case to convince the project's developers of the merits of this feature. Please provide as much detail and context as possible.

When adding a new feature to the library, make sure you update the documentation package as well.

### Testing

Before providing a pull request be sure to test the feature you are adding. Run `pnpm test` to run all unit tests and `pnpm typecheck` to verify type safety before submitting.

## Pull requests

Good pull requests — patches, improvements, new features — are a fantastic
help. They should remain focused in scope and avoid containing unrelated
commits.

**Please ask first** before starting on any significant pull request (e.g.
implementing features, refactoring code, adding new engine capabilities),
otherwise you might spend a lot of time working on something that the
project's developers might not want to merge into the project.

Please adhere to the [coding guidelines](#code-guidelines) used throughout the
project (indentation, accurate comments, etc.) and any other requirements
(such as test coverage).

**Do not edit files in `dist/` or `.styleframe/` directories
directly!** Those files are automatically generated. You should edit the source files in the respective package's `src/` directory instead.

Adhering to the following process is the best way to get your work
included in the project:

1. [Fork](https://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/styleframe.git

   # Navigate to the newly cloned directory
   cd styleframe

   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/styleframe-dev/styleframe.git
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a new topic branch (off the `main` project branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Make sure your commits are logically structured. Please adhere to these [git commit
   message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html). Use Git's
   [interactive rebase](https://help.github.com/en/github/using-git/about-git-rebase)
   feature to tidy up your commits before making them public.

5. If your changes affect a publishable package, create a changeset:

   ```bash
   pnpm changeset
   ```

   The CLI will prompt you to select which packages are affected, the semver bump type (patch, minor, or major), and a short summary of the change. This creates a `.changeset/<random-name>.md` file that should be committed with your PR.

   You can skip this step if your change only affects non-publishable packages (docs, storybook, app, playground, or integration tests).

6. Locally rebase the upstream main branch into your topic branch:

   ```bash
   git pull --rebase upstream main
   ```

7. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

8. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description against the `main` branch.

**Important!** By submitting a patch, you agree to allow the project owners to
license your work under the terms of the [MIT License](LICENSE).

## Code guidelines

### TypeScript

Adhere to the linting guidelines and the conventions documented in [AGENTS.md](AGENTS.md).

- Use strict TypeScript — no `any`, use `unknown` with type guards instead
- Prefer functional programming patterns over classes in engine packages
- Use `ref()` for variable references, never hardcode token values
- Import from `'styleframe'` barrel package, not `@styleframe/*` sub-packages
- All exports must have explicit TypeScript types

### Formatting

Formatting is handled automatically by [Oxfmt](https://oxc.rs/docs/guide/usage/formatter), with the shared [`@uxfront/oxfmt-config`](https://www.npmjs.com/package/@uxfront/oxfmt-config) in `oxfmt.config.mts`, so Styleframe reads like the other UXFront repositories.

- Tabs for indentation, a print width of 100 and double quotes for strings
- Run `pnpm format` to fix formatting and `pnpm format:check` to check it, as CI does

Styleframe keeps two of its own options:

- **Embedded CSS stays as it is** (`embeddedLanguageFormatting: "off"`). The content of a `css` tagged template is a value the engine parses, so formatting it would change the CSS it emits.
- **Markdown is left out** (`**/*.md`). The docs are MDC, which Oxfmt would rewrite, and Changesets writes `CHANGELOG.md` and `.changeset/*.md`.

The whole repository was reformatted in one commit, listed in `.git-blame-ignore-revs`. GitHub's blame view skips it already. To make your local `git blame` skip it too, run this once in your clone:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

### Linting

Linting is handled by [Oxlint](https://oxc.rs/docs/guide/usage/linter), with the shared [`@uxfront/oxlint-config`](https://www.npmjs.com/package/@uxfront/oxlint-config) in `oxlint.config.mts`. Each rule Styleframe turns off has its reason in a comment beside it.

- Run `pnpm lint` to check for linting issues
- Pre-commit hooks will automatically format and lint staged files

## Local Development

1. First, fork the repository and create a branch as specified in the [Pull Request Guidelines](#pull-requests) above.

2. You'll find a well-structured [pnpm](https://pnpm.io) monorepo powered by [Turbo](https://turbo.build). The project requires **Node.js >= 22.13.0** and **pnpm 11.25.0**. Enable pnpm via Corepack:

   ```bash
   corepack enable && corepack prepare
   ```

3. The monorepo is organized into the following workspaces:

   | Directory | Package | Purpose |
   |-----------|---------|---------|
   | `engine/core` | `@styleframe/core` | Token AST and factory methods |
   | `engine/transpiler` | `@styleframe/transpiler` | AST to CSS/TS/DTS code generation |
   | `engine/loader` | `@styleframe/loader` | Config loading and HMR |
   | `engine/runtime` | `@styleframe/runtime` | Browser-side recipe class generation |
   | `engine/scanner` | `@styleframe/scanner` | Content scanning for utility extraction |
   | `engine/styleframe` | `styleframe` | Barrel package re-exporting all APIs |
   | `theme` | `@styleframe/theme` | Design tokens, modifiers, utilities, presets |
   | `tooling/plugin` | `@styleframe/plugin` | Build tool integration (Vite, Webpack, Nuxt, etc.) |
   | `tooling/cli` | `@styleframe/cli` | CLI for init, build, and DTCG sync |
   | `tooling/figma` | `@styleframe/figma` | Figma variable sync |
   | `tooling/dtcg` | `@styleframe/dtcg` | W3C DTCG format support |
   | `testing/integration` | — | Playwright end-to-end tests |
   | `apps/docs` | — | Documentation site (Nuxt Content) |
   | `apps/storybook` | — | Storybook design system showcase |

   For detailed architecture and per-package conventions, see [`AGENTS.md`](AGENTS.md).

4. Run `pnpm install` to install all dependencies.

5. To build the project, run one of the following:

   ```bash
   pnpm build           # Build everything (engine + theme + tooling + apps)
   pnpm build:nodocs    # Build engine + theme + tooling only (faster)
   ```

6. To start developing, run `pnpm dev` in your command line to run Styleframe in development mode. You can also target specific areas:

   ```bash
   pnpm dev             # Watch mode for all packages
   pnpm dev:docs        # Documentation + Storybook only
   pnpm dev:playground  # Playground only
   ```

7. To test, run `pnpm test` to run all unit tests. You can also run tests for a specific package:

   ```bash
   pnpm test                              # All unit tests
   pnpm --filter @styleframe/core test    # Single package
   pnpm test:integration                  # Playwright end-to-end tests
   pnpm typecheck                         # TypeScript type checking
   ```

   Make sure you run `pnpm build:nodocs && pnpm lint && pnpm typecheck && pnpm test` before creating a pull request.

## License

By contributing your code, you agree to license your contribution under the [MIT License](https://github.com/styleframe-dev/styleframe/tree/main/LICENSE).
