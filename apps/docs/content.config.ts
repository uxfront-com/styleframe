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
		// The legal pages, word for word as on main, served at /license,
		// /privacy, /terms and /cookies by app/pages/.
		legal: defineCollection({
			type: "page",
			source: { include: "legal/*.md", prefix: "/" },
		}),
	},
});
