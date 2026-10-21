# Applications Rules

**Scope:** `apps/**/*`

## Documentation Site (`apps/docs/`)

- Docus on `@uxfront/layer-ui` and `@uxfront/layer-docs`, the same setup as the Open Components site
- Content: `apps/docs/content/docs/` (Markdown files); release notes: `apps/docs/content/changelog/`
- URLs and sections: `apps/docs/app/constants/sections.ts` and `apps/docs/content.config.ts`
- Pages: `apps/docs/app/pages/` (Vue components)
- Components: `apps/docs/app/components/` (Nuxt components; `app/` and `docs/` override Docus's)
- Server routes: `apps/docs/server/` (raw Markdown, sitemap)
- Config: `apps/docs/nuxt.config.ts`, `apps/docs/app/app.config.ts`
- Code examples must be runnable and tested
- Public assets: `apps/docs/public/`
- The site's UXFront pages use scoped CSS on `--ux-*` tokens, by the owner's decision, until UXFront moves to Styleframe
- See `apps/docs/AGENTS.md`

## Storybook (`apps/storybook/`)

- Stories in `apps/storybook/src/stories/`
- Each recipe needs a corresponding story
- Use Storybook 10 + Vue 3
- Stories should showcase all variants
- See `apps/storybook/AGENTS.md`

## Customer Dashboard (`apps/app/`)

- Nuxt 3 + Supabase
- Use Styleframe for all styling (dogfooding)
- See `apps/app/AGENTS.md`

## Shared Layer (`apps/shared/`)

- Shared Nuxt layer for doc apps
- Reusable components and composables
- See `apps/shared/AGENTS.md`

## General Rules

- All apps must use Styleframe for styling
- Document new features in docs site when adding them
- Update Storybook stories when updating recipes
