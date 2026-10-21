# Styleframe Documentation Site

This directory contains the Styleframe documentation site, styleframe.dev. It runs on the same setup as the Open Components site: [Docus](https://docus.dev) renders the Markdown in `content/docs/`, on top of the `@uxfront/layer-ui` and `@uxfront/layer-docs` layers. An AI agent working here should understand the site's structure, formatting conventions and content patterns, so the pages it writes or changes are indistinguishable from the existing ones.

## How the site is built

- **Docus only on the docs and the changelog.** `app/app.vue` mounts Docus's shell (header, sidebar, search) on `/docs/**` and `/changelog/**`. Every other page brings its own layout, built from the UXFront kit (`@uxfront/ui`, `@uxfront/scene`).
- **URLs come from `app/constants/sections.ts`.** `content.config.ts` replaces Docus's `docs` collection with one source per folder, so `03.design-tokens/06.colors.md` is served at `/docs/theme/design-tokens/colors`. Keep the collection name `docs`: Docus's pages, `server/lib/docs.ts` and the sitemap query it. `modules/nonRouteCategories.ts` gives each page a `stem` from its file with its section in front (`docsStem()`), because Nuxt Content orders the sidebar and the previous and next links by stem.
- **Category folders aren't in the URL.** A folder whose `.navigation.yml` sets `route: false`, like `05.components/02.actions/`, is a sidebar group only: `modules/nonRouteCategories.ts` drops it from its pages' paths, and `app/utils/foldNonRouteCategories.ts` groups the sidebar by it again.
- **Sections are tabs below the header.** `useDocsSections()` turns the navigation into Getting Started, API Reference and Theme's four sub-sections (Design Tokens, Elements, Components, Utilities), and the overrides of Docus's `AppHeaderBottom`, `DocsAsideLeftBody` and `DocsAsideMobileBar` show them.
- **The header and page menu are ours.** `app/components/app/` adds the Docs, Changelog and Log in links (`useHeaderLinks()`), and `DocsPageHeaderLinks.vue` leaves out Docus's MCP items, since the static site serves no MCP server. Shared URLs live in `app/data/site.ts`.
- **The framework switcher comes from `@uxfront/layer-docs`.** `docsTheme.frameworks` in `app/app.config.ts` lists React, Vanilla (`other`) and Vue, which are the slot names `::framework-switcher` blocks use.
- **The product and legal pages** (`/pro`, `/pricing`, `/scanner`, `/figma`, `/license`, `/privacy`, `/terms`, `/cookies`) are Vue pages in `app/pages/`, built from the UXFront kit and the site's header, footer and sections in `app/components/site/`. The legal pages render their Markdown from `content/legal/` word for word. `app/components/app/AppFooterLeft.vue` gives the docs footer the same legal links and credit.
- **The changelog** is `content/changelog/<version>.md`, rendered by `app/pages/changelog/`. `nuxt.config.ts` lists every entry for prerendering, because the crawler skips links like `/changelog/3.9.0`.
- **Agents and SEO.** Docus writes `llms.txt`, `llms-full.txt` and the social cards, and `server/middleware/raw-markdown.ts` serves each page's source at `/raw/<path>.md`. `server/routes/sitemap.xml.ts` lists the site's own pages from `server/lib/pages.ts`, then the docs and the changelog.
- **Styling.** Docus's pages use Tailwind and Nuxt UI, with the brand teal in `app/app.css`. The site's UXFront pages use scoped CSS on the kit's `--ux-*` tokens: that's the owner's exception to "All apps must use Styleframe for styling" (`.claude/rules/apps.md`), until UXFront itself moves to Styleframe.

### Commands

Run them from `apps/docs/`:

- `pnpm build` runs `nuxt generate` and writes the static site to `.output/public`.
- `pnpm test` runs the unit tests, and `pnpm test:build` checks the built site: every prerendered page has a 1200 × 630 social card, and the product and legal pages keep main's titles, links and Markdown copies (`test/pages.build.test.ts`).
- `pnpm typecheck` checks the app's types. It leaves out errors inside Docus's own files, as Open Components does.
- If a build fails with 500s on `/raw/…` pages after a change to how pages are parsed (like the stems in `modules/nonRouteCategories.ts`), delete `.data/`. Nuxt Content caches parsed pages there by their content, so the cache keeps the old stems.

## Directory Structure

```
content/docs/
├── 01.getting-started/     # Introduction, installation, guides, comparisons, licensing
├── 02.api/                 # Core API reference (variables, selectors, utilities, recipes, etc.)
├── 03.design-tokens/       # Color, spacing, typography, scale, breakpoint tokens
├── 04.elements/            # HTML element base styles, in category folders (base, typography, …)
├── 05.components/          # Component recipes, in category folders (actions, navigation, …)
├── 06.utilities/           # Utility categories (spacing, layout, typography, etc.)
├── 07.modifiers/           # Pseudo-state, form-state, aria, structural, etc.
├── 08.tooling/             # CLI and scanner
├── 09.integrations/        # DTCG, Figma plugin, Storybook
└── 10.migration/           # Migrating from other tools
content/changelog/          # One release per file, at /changelog/<version>
content/legal/              # The legal pages, at /license, /privacy, /terms and /cookies
```

**Navigation sections:** The docs site groups these folders into three top-level navigation sections (see `apps/docs/app/constants/sections.ts`):

- **Getting Started** → `01.getting-started/`, with `08.tooling/`, `09.integrations/` and `10.migration/` below it
- **API Reference** → `02.api/`
- **Theme** → `03.design-tokens/`, `04.elements/`, `05.components/`, `06.utilities/` and `07.modifiers/`, shown as four tabs: Design Tokens, Elements, Components, and Utilities (with Modifiers)

**Numbering convention:** Directories and files use `NN.` prefixes for ordering (e.g., `01.introduction.md`, `06.colors.md`). Index files use `00.index.md`. Subdirectories follow the same pattern.

---

## Frontmatter Format

Every page starts with YAML frontmatter:

```yaml
---
title: Page Title
description: A brief description of the page content.
navigation:
    icon: i-lucide-icon-name
---
```

- `title` — Page title (required). Do NOT use H1 headings in the body; the title is rendered from frontmatter.
- `description` — Brief description (required). Used for SEO and page previews.
- `navigation.icon` — Lucide icon identifier (optional). Format: `i-lucide-<icon-name>`.

---

## Page Structure Convention

Most documentation pages follow this consistent section order:

1. **Overview** (`## Overview`) — 1-3 sentences explaining what the feature is.
2. **Why use [feature]?** (`## Why Use [Feature]?` or `## Why use [feature]?`) — Bulleted list of benefits, each with a bold lead phrase.
3. **Feature content** — The main documentation. Structure varies by section type (see below).
4. **Examples** (`## Examples`) — Real-world usage examples with tabbed code blocks.
5. **Best Practices** (`## Best Practices`) — Bulleted list of do's and don'ts.
6. **FAQ** (`## FAQ`) — Accordion-style Q&A section.

Not every page has all sections. Simpler pages may omit Examples or FAQ.

---

## Heading Hierarchy

- **H1 (`#`)** — NEVER used in page body. Title comes from frontmatter.
- **H2 (`##`)** — Main sections: `Overview`, `Why Use X?`, function names (`` ## `useColorDesignTokens` ``), `Examples`, `Best Practices`, `FAQ`.
- **H3 (`###`)** — Subsections within H2: `Naming Convention`, `Default Values`, `Creating Custom X`.
- **H4 (`####`)** — Rare. Used inside `::steps{level="4"}` blocks.

---

## Code Examples

### Tabbed Code Blocks

The primary pattern for code examples uses tabs with Code, Output, and optionally Usage:

```markdown
::tabs
:::tabs-item{icon="i-lucide-code" label="Code"}

\`\`\`ts [styleframe.config.ts]
import { styleframe } from "styleframe";
// code here
export default s;
\`\`\`

:::
:::tabs-item{icon="i-lucide-file-input" label="Output"}

\`\`\`css [styleframe/index.css]
:root {
    --color--primary: #006cff;
}
\`\`\`

:::
:::tabs-item{icon="i-lucide-layout" label="Usage"}

\`\`\`html
<div class="_background-color:primary">Content</div>
\`\`\`

:::
::
```

**Key rules:**
- Code blocks include file path labels in square brackets: `` ```ts [styleframe.config.ts] ```, `` ```css [styleframe/index.css] ```.
- The Code tab shows TypeScript (the Styleframe config). The Output tab shows the generated CSS. The Usage tab shows HTML with utility classes.
- Use `"styleframe"` for core imports and `"@styleframe/theme"` for theme composables.
- Always end config files with `export default s;`.
- Use 4-space indentation inside CSS output blocks.

### Inline Code

- Use backticks for: variable names (`` `colorPrimary` ``), CSS properties (`` `--color--primary` ``), function names (`` `useColorDesignTokens()` ``), class names (`` `_margin:md` ``), values (`` `'1rem'` ``).

---

## Special Components

### Tips

```markdown
::tip
**Pro tip:** Description of helpful advice here.
::
```

### Notes

```markdown
::note
**Good to know:** Informational content here.
::
```

### Steps

```markdown
::steps{level="4"}

#### Step Title
Step content here.

#### Another Step
More content.

::
```

### Story Previews (Component demos)

```markdown
::story-preview
---
story: theme-recipes-feedback-badge--default
panel: true
---
::
```

### Accordion (FAQ)

```markdown
::accordion

:::accordion-item{label="Question text here?" icon="i-lucide-circle-help"}
Answer text here.
:::

:::accordion-item{label="Another question?" icon="i-lucide-circle-help"}
Another answer.
:::

::
```

---

## Content Patterns by Section Type

### API Pages (`02.api/`)

Document core Styleframe methods. Each method gets an H2 heading with the function signature. Show tabbed Code/Output examples for each. Include a "Naming Convention" or similar subsection when the method has naming rules. End with Best Practices and FAQ.

### Design Token Pages (`03.design-tokens/`)

Document `@styleframe/theme` composables. Each composable (e.g., `useColorDesignTokens`, `useColorLevelDesignTokens`) gets its own H2 section. Show:
1. Default usage with tabbed Code/Output
2. Custom values variant
3. Extending defaults variant

Include default value tables and tips about `as const` usage. End with Best Practices and FAQ.

### Utility Pages (`06.utilities/`)

Document utility composables. Show:
1. Basic usage with the utility creator function
2. Directional variants (for spacing, border, etc.) in a reference table
3. Modifier integration (hover, focus, etc.)
4. HTML Usage tab with class name examples

Class name format: `_property-name:value` (e.g., `_margin:sm`), with modifier prefix: `_hover:margin:sm`.

### Modifier Pages (`07.modifiers/`)

Document modifier composables. Each modifier gets its own H2 with tabbed Code/Output/Usage. Include:
1. Individual modifier functions (e.g., `useHoverModifier`)
2. Batch function (e.g., `usePseudoStateModifiers`)
3. CSS selector mapping table
4. Combined modifier examples

### Component Pages (`05.components/`)

Document pre-built recipes. Include:
1. Registration with `useButtonRecipe(s)` etc.
2. Story preview component for visual demo
3. Variant tables (colors, sizes, styles)
4. Framework-specific usage tabs (React, Vue)
5. Accessibility section with WCAG guidelines
6. Customization and filtering options

---

## Cross-References

Use relative paths starting with `/docs/`:

```markdown
[Learn more about variables →](/docs/api/variables)
[See the recipes API](/docs/api/recipes)
```

Do NOT invent cross-references. Only link to pages that exist in the directory structure.

---

## Voice and Tone

- **Second person** — "You define a variable using..." not "One defines..."
- **Imperative for instructions** — "Create a spacing variable" not "A spacing variable should be created"
- **Direct and concise** — No filler words ("simply", "just", "obviously", "it should be noted that")
- **Bold lead phrases** in bulleted lists — `**Create consistent spacing**: Reference design tokens for...`
- **Moderate formality** — Technical but approachable. Not overly casual.

---

## Best Practices for Writing Documentation

1. **Match existing patterns exactly.** Read 2-3 similar pages before writing a new one.
2. **Every code example must be syntactically correct** and use real Styleframe APIs.
3. **Show Code AND Output** — Always pair TypeScript config with generated CSS.
4. **Use `as const`** on value objects in all composable examples.
5. **Include the full import chain** — Show all necessary imports at the top of each code block.
6. **Document edge cases** in FAQ sections, not inline.
7. **Keep descriptions grounded in source code** — Do not invent behaviors, parameters, or return values.
8. **Use semantic color/token names** in examples — `primary`, `secondary`, not `blue`, `gray`.
9. **Preserve `export default s;`** at the end of every `styleframe.config.ts` example.
10. **Use 4-space indentation** in CSS output blocks to match existing convention.
