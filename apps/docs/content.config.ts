import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { DOCS_FOLDERS, docsFolderPrefix } from "./app/constants/sections";

// Nuxt Content merges these with the collections Docus defines. `docs` replaces
// Docus's, which serves content/docs/ at its file paths: here each folder is
// served under its section, as app/constants/sections.ts maps them, so
// 03.design-tokens/06.colors.md is at /docs/theme/design-tokens/colors. Keep
// the name: Docus's pages, server/lib/docs.ts and the sitemap query it.
export default defineContentConfig({
	collections: {
		docs: defineCollection({
			type: "page",
			source: DOCS_FOLDERS.map((folder) => ({
				include: `docs/${folder}/**`,
				prefix: docsFolderPrefix(folder),
			})),
			// Docus's schema: buttons in the page header.
			schema: z.object({
				links: z
					.array(
						z.object({
							label: z.string(),
							icon: z.string(),
							to: z.string(),
							target: z.string().optional(),
						}),
					)
					.optional(),
			}),
		}),
		// One entry per release, in content/changelog/, listed at /changelog and
		// served at /changelog/<version>.
		changelog: defineCollection({
			type: "page",
			source: "changelog/*.md",
			schema: z.object({
				version: z.string(),
				// The day it was released, as in 2026-06-14.
				date: z.string(),
				// The GitHub release, for the two earliest, whose tags predate
				// `styleframe@<version>` (see useChangelogReleaseUrl).
				releaseUrl: z.string().url().optional(),
			}),
		}),
		// The site's own pages, as llms.txt lists them under "Landing", as on
		// main. The legal pages, word for word as on main, are rendered at
		// /license, /privacy, /terms and /cookies by app/pages/. The homepage and
		// the product pages are Vue pages: their Markdown in content/landing/ only
		// feeds llms.txt, llms-full.txt and /raw/<page>.md.
		landing: defineCollection({
			type: "page",
			source: [
				{ include: "legal/*.md", prefix: "/" },
				{ include: "landing/*.md", prefix: "/" },
			],
		}),
		// The homepage's code samples, one per file, so Nuxt Content highlights
		// them when the site is built and the page ships no highlighter. Data,
		// not pages, so they get no route and stay out of llms.txt.
		home: defineCollection({
			type: "data",
			source: "home/*.md",
			schema: z.object({
				title: z.string(),
				body: z.object({}).passthrough(),
			}),
		}),
	},
});
