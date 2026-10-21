# @styleframe/app-shared

Shared Nuxt layer for Styleframe documentation apps. Provides auto-configured site metadata, SEO, i18n routing, analytics, UI theming, and reusable components across all Styleframe doc sites.

## Package Overview

`@styleframe/app-shared` is a Nuxt layer that documentation apps extend via `extends` in their `nuxt.config.ts`. It eliminates boilerplate by automatically inferring site metadata from `package.json` and git, configuring SEO, registering i18n locales, and providing shared UI defaults built on Nuxt UI.

**Runtime:** Nuxt 3 (compatibility date 2025-07-22)
**Key dependencies:** `@nuxt/ui`, `@nuxt/image`, `@nuxt/content`, `@nuxtjs/i18n`, `@nuxtjs/robots`, `nuxt-og-image`, `nuxt-llms`, `posthog-js`, `tailwindcss`, `zod`

---

## Source Structure

```
apps/shared/
├── nuxt.config.ts               # Module registration and base Nuxt config
├── modules/
│   ├── config.ts                # Auto-configures site metadata, SEO, git, i18n
│   └── routing.ts               # Registers useDocusI18n composable
├── app/
│   ├── app.config.ts            # Default app configuration (SEO, header, footer, UI)
│   ├── assets/css/main.css      # Tailwind + Nuxt UI imports, teal theme overrides
│   ├── components/
│   │   └── MorphingGradientBackground.vue  # Animated gradient background
│   └── plugins/
│       ├── i18n.ts              # Locale redirect middleware
│       └── posthog.client.ts    # PostHog analytics (production only)
└── utils/
    ├── git.ts                   # Git repository info extraction
    └── meta.ts                  # Site URL inference and package.json reading
```

---

## Modules

### Config Module (`modules/config.ts`)

Runs at build time. Automatically populates Nuxt runtime configuration by:

1. **Inferring site URL** from environment variables (`NUXT_SITE_URL`, Vercel, Netlify, Gitlab Pages, Cloudflare Pages)
2. **Reading `package.json`** from the app's root directory for `name` and `description`
3. **Extracting git info** from local `.git/config` or CI environment variables (Vercel, GitHub, GitLab, Netlify)
4. **Configuring** `nuxt.options.llms`, `nuxt.options.site`, `appConfig.header`, `appConfig.seo`, `appConfig.github` using `defu` merges (app-level values take precedence)
5. **Filtering i18n locales** — only registers locales that have both a JSON locale file (`i18n/locales/{code}.json`) and a content folder (`content/{code}/`). Missing locales are skipped with a console warning.

### Routing Module (`modules/routing.ts`)

Registers the `useDocusI18n` composable as an auto-import via Nuxt's `imports:extend` hook.

---

## Utilities

### `utils/meta.ts`

| Export | Signature | Description |
|--------|-----------|-------------|
| `inferSiteURL` | `() => string \| undefined` | Returns site URL from environment variables. Checks `NUXT_SITE_URL`, `NEXT_PUBLIC_VERCEL_URL`, `URL` (Netlify), `CI_PAGES_URL` (GitLab), `CF_PAGES_URL` (Cloudflare) in order. |
| `getPackageJsonMetadata` | `(dir: string) => Promise<{ name: string; description?: string }>` | Reads `package.json` from `dir` and returns `name` and `description`. Falls back to `{ name: 'docs' }` on error. |

### `utils/git.ts`

| Export | Signature | Description |
|--------|-----------|-------------|
| `GitInfo` | `interface` | `{ name: string; owner: string; url: string }` |
| `getGitBranch` | `() => string` | Returns current branch from CI env vars or `git rev-parse`. Falls back to `"main"`. |
| `getLocalGitInfo` | `(rootDir: string) => Promise<GitInfo \| undefined>` | Parses git remote origin URL using `git-url-parse` and `pkg-types`. Returns `undefined` if no remote found. |
| `getGitEnv` | `() => GitInfo` | Extracts repo info from CI/deployment environment variables (Vercel, GitHub, GitLab, Netlify). |

---

## App Configuration (`app/app.config.ts`)

**Neutral defaults only — this layer ships NO product branding.** Consuming apps
supply branding (title, logos, socials, GitHub, footer, TOC links, palette) via
their own `app.config.ts`, merged over these defaults by `defu` (consumer wins).
`modules/config.ts` also fills `seo`/`header`/`github` from the consumer's
`package.json` + git as fallbacks.

| Section | Key Fields |
|---------|-----------|
| `toc` | `title` ("On this page") — neutral default; consumers add `bottom.*` links |
| `analytics` | `enabled` (default `true`) — opt-out flag for the PostHog plugin |
| `i18nRedirect` | `enabled` (default `true`) — opt-out flag for the locale-redirect plugin |
| `ui` | Neutral Nuxt UI Pro slot overrides (`commandPalette`, `contentNavigation`, `pageLinks`, `pageCard`, `pricingTable`) — reusable shell polish every consumer inherits |

**The `ui.colors: {}` discriminant.** The layer's `ui` block keeps an *empty*
`colors: {}`. It bakes in **no palette** — it exists purely as a type
discriminant. Nuxt UI's wide `AppConfigUI` type (the one that permits the slot
overrides above) only applies to `ui` when a `colors` key is present; strip it
and the narrow `nuxt.schema.ts` Studio type (`{ colors, icons }`) wins, so the
slot overrides fail excess-property checks. Each consumer supplies the real
palette via its own `ui.colors` (`primary`/`neutral`), merged over the empty
object by Nuxt's `defu` layer merge.

Branding the layer no longer bakes in (supplied per consumer): `seo.title`/
`description`, `header.title`/`logo`, `socials`, `github.url`/`branch`,
`footer.credits`, `toc.bottom.links`, and the palette (`ui.colors` values —
the layer keeps only an empty `colors: {}` discriminant).

---

## Components

### `MorphingGradientBackground`

Animated gradient background with mouse-tracking interactive blob.

**Props:** None
**Slots:** Default slot — receives `{ onMousemove }` handler that the parent must bind to a container for mouse interaction.

```vue
<MorphingGradientBackground v-slot="{ onMousemove }">
  <div @mousemove="onMousemove">
    <!-- Content here -->
  </div>
</MorphingGradientBackground>
```

**CSS custom properties** for theming (override on `.morphing-gradient-background`):

| Variable | Default | Description |
|----------|---------|-------------|
| `--color1` through `--color5` | RGB triplets | Gradient blob colors |
| `--color-interactive` | `140, 100, 255` | Mouse-following blob color |
| `--circle-size` | `80%` | Blob size |
| `--blending` | `hard-light` | Mix blend mode |
| `--intensity` | `0.2` | Gradient opacity |
| `--color-bg1`, `--color-bg2` | `var(--ui-bg)` | Background gradient stops |

**Animations:** `moveInCircle` (360° rotation), `moveVertical` (Y oscillation), `moveHorizontal` (X oscillation) with 20–40s durations. Interactive blob follows the cursor with eased interpolation (divides delta by 20 each frame).

---

## Plugins

### `i18n.ts`

Route middleware that redirects `/` to `/{locale}` based on:
1. `i18n_redirected` cookie value
2. i18n default locale from config
3. Falls back to `"en"`

Only activates when `$config.public.i18n` is present **and** `app.config`
`i18nRedirect.enabled` is truthy (default `true`; set `false` to opt out).

### `posthog.client.ts` (Client-only)

Initializes PostHog analytics in production. Skipped entirely in dev mode
(`import.meta.dev`) and when `app.config` `analytics.enabled` is falsy (default
`true`; set `false` to opt out).

- Reads config from `runtimeConfig.public.posthog` (`key`, `host`, `defaults`)
- Sets `person_profiles: "identified_only"`
- Provides `$posthog` via `useNuxtApp().$posthog()`

---

## Global Styles (`app/assets/css/main.css`)

- Imports Tailwind CSS and `@nuxt/ui`
- Scans content, layers, and app config for Tailwind classes
- Defines `.prose-container` with `--ui-container: 760px`
- **Palette-free.** The brand color scale and `--ui-primary` mapping are
  consumer-supplied: each app's own css entrypoint
  (`apps/app/app/assets/css/main.css`) `@import`s this base and layers its
  `@theme` on top.

---

## Registered Nuxt Modules

The `nuxt.config.ts` registers these modules in order:

1. `./modules/config` — site metadata auto-configuration
2. `./modules/routing` — composable auto-imports
3. `@nuxt/ui` — UI component library
4. `@nuxt/image` — image optimization
5. `@nuxt/scripts` — script management
6. `@nuxt/test-utils` — testing utilities
7. `@nuxtjs/robots` — robots.txt generation
8. `nuxt-og-image` — Open Graph image generation
9. `nuxt-llms` — LLM context page generation

Icon provider: `iconify` (with `lucide`, `simple-icons`, `vscode-icons` icon sets).

---

## Best Practices

1. **Extend, don't duplicate.** Consuming apps should extend this layer and override only what differs via their own `app.config.ts` and `nuxt.config.ts`.
2. **Use `defu` for config merging.** All configuration uses `defu` defaults — app-level values always take precedence over shared defaults.
3. **Add locales correctly.** For a new locale, create both `i18n/locales/{code}.json` and `content/{code}/` in the consuming app. The config module filters locales missing either file.
4. **PostHog config is required in production.** Set `runtimeConfig.public.posthog.key` and `runtimeConfig.public.posthog.host` in the consuming app's environment.
5. **Theme the gradient component via CSS variables.** Override `--color1` through `--color5`, `--color-interactive`, `--intensity`, and `--blending` on `.morphing-gradient-background` rather than editing the component.
6. **Bind the slot prop for mouse interaction.** The `MorphingGradientBackground` default slot provides `onMousemove` — bind it to a container element for the interactive blob to work.
