/**
 * The site's pages outside the docs and the changelog, which the sitemap lists
 * first, each with the files its content comes from, by their path from the
 * app's directory. Its `<lastmod>` is the last commit that changed any of them.
 * `/pro` and `/pricing` are in it, though the header and footer don't link them.
 */
export const SITE_PAGES: { path: string; sources: string[] }[] = [
	{ path: "/", sources: ["app/pages/index.vue", "content/landing/index.md"] },
	...["scanner", "figma", "pro", "pricing"].map((page) => ({
		path: `/${page}`,
		sources: [`app/pages/${page}.vue`, `content/landing/${page}.md`],
	})),
	...["license", "privacy", "terms", "cookies"].map((page) => ({
		path: `/${page}`,
		sources: [`app/pages/${page}.vue`, `content/legal/${page}.md`],
	})),
];

/** The latest of the dates, as YYYY-MM-DD, or undefined when there's none. */
export function latestDate(dates: (string | undefined)[]): string | undefined {
	return dates.filter(Boolean).sort().at(-1);
}
