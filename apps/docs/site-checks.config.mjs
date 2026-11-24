// The search and AI search checks `pnpm check:seo` runs on the docs build.
// Each setting keeps what the site checked before it moved to
// @uxfront/site-checks, so the site checks no more and no less than it did.
// The package's README lists every rule and option.
import { defineConfig } from "@uxfront/site-checks";

export default defineConfig({
	site: "https://styleframe.dev",
	// How pages are read: tags and attributes as the site's HTML writes them.
	parse: {
		scope: "document",
		titleScope: "head",
		titleTag: "bare",
		trimTitle: "after-decode",
		quotes: "double",
		caseSensitiveTags: true,
		tagEnd: "word",
		metaKey: "name-or-property",
		trimValues: false,
		decode: ["amp", "lt", "gt", "quot", "#39", "#x27", "#x2F"],
		decodeOrder: "one-pass",
		decodeIgnoreCase: false,
		count: "utf-16",
		h1: "anywhere",
		nodes: "graph-or-block",
		typeArrays: true,
		jsonLdType: "exact",
		blankLines: "whitespace",
		trimSitemap: false,
		mergeDuplicateLocs: false,
		headersParser: "lines",
	},
	// The core rules run with their defaults, unless they're set here.
	rules: {
		lastmod: { format: "date", realDate: "none" },
		"sitemap-pages": { paths: "exact" },
		"sitemap-indexable": {
			sources: [
				{
					type: "meta",
					names: ["robots"],
					caseSensitive: true,
					property: true,
				},
				{ type: "refresh" },
				{ type: "files", files: ["200.html", "404.html"] },
				{ type: "under", paths: ["raw/", "_og/"] },
			],
		},
		"sitemap-coverage": true,
		canonical: { exactlyOne: true, rel: "exact" },
		lang: { lang: "en" },
		"open-graph": { url: "loc" },
		"og-image-size-tags": { onHostOnly: true },
		"og-image-file": { types: ["png"], png: "signature" },
		"twitter-text": true,
		"json-ld-types": {
			types: {
				"/": ["WebSite", "Organization", "SoftwareSourceCode"],
				"/docs/*": ["TechArticle"],
			},
		},
		"json-ld-breadcrumbs": {
			scope: ["*"],
			nodes: "all",
			item: ["url"],
			exactType: true,
			nonArray: "iterate",
		},
		"robots-sitemap": { match: "anchored" },
		"robots-crawlers": { allow: false, case: "exact", agents: "lines" },
		"robots-no-disallow": { match: "lines" },
		"robots-wildcard": true,
		llms: { first: "non-empty", nonEmpty: true },
		"llms-summary": { position: "second", nonEmpty: true },
		"llms-links": { scope: ["/docs/*"], form: "parens", minPages: 1 },
		"not-found": true,
	},
});
