---
name: docs-craft
description: Institutional knowledge for the Styleframe documentation site (apps/docs, Nuxt Content) — content structure and numbered categories, link/route resolution quirks, component-doc anatomy and reference pages, runnable-example rules, voice, framework switcher, and the no-changeset rule for docs. Consult before every apps/docs task.
---

# Docs craft

The docs are a versioned product (`@styleframe/docs`, v2.x) built on Nuxt Content. The reader is smart, busy, and new. Every page is part of one curriculum: page 40 must never contradict page 4.

## Content structure

Markdown lives in `apps/docs/content/docs/`, categories numbered for order:

```
01.getting-started/   02.api/   03.design-tokens/   04.elements/
05.components/        06.utilities/   07.modifiers/
08.tooling/           09.integrations/
```

- Component (recipe) docs: `05.components/<category>/` where category ∈ actions, navigation, feedback, forms, overlays, layout, ai-chat. (Older references to a `04.components/02.composables/` path are stale — do not use it.)
- Vue demo components: `apps/docs/app/components/` (note the Pro components under `pro/`). Pages in `apps/docs/app/pages/`, and the site chrome (header, footer, sections) in `apps/docs/app/components/site/`; config `nuxt.config.ts`.

## Anatomy of a component doc page

Mirror the best existing sibling, chosen by the recipe's color pattern:

- **Full color pattern** (all 6 colors × variants) → mirror `badge.md`
- **Container pattern** → mirror `card.md`
- **Minimal pattern** → mirror `spinner.md`

Structure: intro sentence → basic usage → one section per variant axis (with live demo + code) → sizes → multi-part anatomy (if any) → props/API tables → theming notes. Ground every claim in the recipe's TypeScript source in `theme/src/recipes/<name>/` — never write from memory of how recipes usually work.

## Links break silently — verify them

Internal doc routes are rewritten at build time: theme-related docs keep the `/docs/theme/` prefix, and component/element subcategories are **flattened** out of the URL (the folder nesting does not match the route). After adding or moving links, verify each resolved route — the content database at `apps/docs/.data/content/contents.sqlite` (path column) is the source of truth for what routes exist. Two 100+ page link sweeps have already been needed in this repo's history; do not create the third.

## Example rules (non-negotiable)

1. **Every example compiles against the current API.** Check the real source (`theme/`, `engine/core`) — instance destructuring (`const { variable, ref, selector } = s`), `ref()` for every token reference, `{ default: true }` in composables, `export default s`.
2. **Framework switcher:** where usage differs by framework, provide Vue, React, and Vanilla variants — the switcher component exists; use it rather than picking one framework.
3. **No inline `style=""`** in demo components — Styleframe utility classes, arbitrary values as `_max-width:[320px]`. The docs dogfood what they teach.
4. Examples must be minimal *and honest*: show the import lines, show the config file when one is needed, never elide a step the reader cannot guess.

## Voice

- Plain words, short sentences, second person, present tense. Explain **why** before **how**.
- Never start a sentence with inline code: "The `useButtonRecipe` composable returns…", not "`useButtonRecipe` returns…".
- One concept per section; delete throat-clearing ("In this section we will…").
- Semantic, not promotional: the docs sell by being useful.

## Process notes

- Docs-only changes ship no changeset — `@styleframe/docs` is in the changesets ignore list; its version is bumped manually.
- Verify with `pnpm --filter @styleframe/docs build` (Nuxt build type-checks the app) plus a dev-server check of the touched pages; paste outcomes in the final comment.
- An API that resists clear explanation is a product finding — file it for the owning seat (@mere, @roux, @tournant) rather than writing around it. Prose cannot fix a confusing API, only hide it until support finds it.
