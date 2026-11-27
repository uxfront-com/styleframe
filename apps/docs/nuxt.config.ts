import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import { createResolver } from "@nuxt/kit";

import { SECURITY_HEADERS } from "./server/lib/headers";

const { resolve } = createResolver(import.meta.url);
const require = createRequire(import.meta.url);

const SITE_URL = "https://styleframe.dev";

// The AI crawlers robots.txt names, each allowed in: the answer engines' search
// and user agents, and the training crawlers.
const AI_CRAWLERS = [
	"OAI-SearchBot",
	"ChatGPT-User",
	"PerplexityBot",
	"Claude-SearchBot",
	"Claude-User",
	"GPTBot",
	"ClaudeBot",
	"Google-Extended",
	"CCBot",
];

// Docus reads the site URL from the environment: for canonical URLs, robots.txt
// and llms.txt at build time, and for the sitemap when it's prerendered.
process.env.NUXT_SITE_URL ||= SITE_URL;

// Without a preset, Nitro detects Workers Builds and picks cloudflare-module,
// whose generated wrangler.json replaces wrangler.jsonc and points at a server
// entry that this static build never writes. An explicit NITRO_PRESET still wins.
if (process.env.WORKERS_CI) {
	process.env.NITRO_PRESET ||= "cloudflare_pages_static";
}

// One prerendered route per changelog entry. Their slugs, like /changelog/3.9.0,
// end in what the prerender crawler reads as a file extension, so it skips them
// when it follows the links on /changelog.
const changelogRoutes = readdirSync(resolve("./content/changelog"))
	.filter((file) => file.endsWith(".md"))
	.map((file) => `/changelog/${file.replace(/\.md$/, "")}`);

// The Markdown copies of the homepage and the product pages, which llms.txt
// links and nothing on the site does (see server/middleware/raw-markdown.ts).
const landingRawRoutes = readdirSync(resolve("./content/landing"))
	.filter((file) => file.endsWith(".md"))
	.map((file) => `/raw/${file}`);

// The component recipe pages moved to Inkline's docs with @inkline/theme in
// @styleframe/theme 4.0.0. Each former page, and the index, keeps its own 301
// to its new page, with no wildcard: the Cloudflare preset copies a `/**`
// target into _redirects as it's written, so a wildcard rule would send every
// page to a literal `/recipes/**`. React is the first framework Inkline's docs
// list, as its own /docs redirect has it.
const INKLINE_RECIPES_URL = "https://inkline.io/docs/react/recipes";
const MOVED_COMPONENT_PAGES = [
	"accordion",
	"avatar",
	"avatar-group",
	"badge",
	"breadcrumb",
	"button",
	"calendar",
	"callout",
	"card",
	"chat-message",
	"checkbox",
	"checkbox-group",
	"chip",
	"color-picker",
	"context-menu",
	"drawer",
	"dropdown",
	"field-group",
	"hamburger-menu",
	"input",
	"input-date",
	"media",
	"modal",
	"nav",
	"otp",
	"page-hero",
	"pagination",
	"placeholder",
	"popover",
	"progress",
	"radio",
	"radio-group",
	"select",
	"sidebar",
	"skeleton",
	"slider",
	"spinner",
	"switch",
	"tabs",
	"textarea",
	"toast",
	"toggle",
	"toggle-group",
	"tooltip",
];
const componentRedirects = Object.fromEntries([
	["/docs/theme/components", { redirect: { to: INKLINE_RECIPES_URL, statusCode: 301 } }],
	...MOVED_COMPONENT_PAGES.map((slug) => [
		`/docs/theme/components/${slug}`,
		{ redirect: { to: `${INKLINE_RECIPES_URL}/${slug}`, statusCode: 301 } },
	]),
]);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	ssr: true,

	app: {
		head: {
			htmlAttrs: { lang: "en" },
			// Main's favicon, here so the UXFront pages and the 404.html shell
			// have it too. Docus adds it on the pages it mounts.
			link: [{ rel: "icon", href: "/favicon.ico" }],
		},
	},

	extends: [
		// The homepage kit: components, fonts, head helpers and critical-path loading.
		"@uxfront/layer-ui",
		// The docs theme: Docus, which renders content/docs/ at /docs (see app/app.vue),
		// plus the framework switcher (`docsTheme.frameworks` in app/app.config.ts).
		"@uxfront/layer-docs",
	],

	// Docus installs the modules it runs, like @nuxt/ui and nuxt-og-image, at its
	// own versions. The workspace's other apps use older ones, which pnpm hoists,
	// and Nuxt looks a module up from this app first, then from its own package,
	// which finds the hoisted ones. So look them up from Docus's package second.
	modulesDir: [join(dirname(require.resolve("docus/package.json")), "node_modules")],

	modules: [
		// Drops the category folders under Elements and Components from the URLs,
		// and keeps them as sidebar groups.
		resolve("./modules/nonRouteCategories"),
		// The changelog's raw Markdown, which llms.txt links and nothing crawls.
		resolve("./modules/rawChangelog"),
		// Docus's Markdown routes, split to fit Vercel's 4096-character limit.
		resolve("./modules/vercelRouteLimit"),
		// The Cloudflare build's _redirects, without the 404 fallback Workers reject,
		// and the _headers rule that keeps preview hosts out of search results.
		resolve("./modules/workersRedirects"),
		// Each page's last commit, for the sitemap's <lastmod> and dateModified.
		resolve("./modules/gitDates"),
	],

	// The docs sections in app/constants/sections.ts, auto-imported for the
	// sidebar and the section tabs.
	imports: {
		dirs: ["constants"],
	},

	runtimeConfig: {
		public: {
			siteUrl: SITE_URL,
			// Set from NUXT_PUBLIC_POSTHOG_*. Without a key, PostHog doesn't load
			// (app/plugins/posthog.client.ts).
			posthog: {
				key: "",
				host: "https://eu.i.posthog.com",
				defaults: "2025-05-24",
			},
		},
	},

	// The title template and the social cards' site name.
	site: {
		name: "Styleframe",
	},

	// robots.txt: Docus's one group lets every crawler in, and these name the AI
	// crawlers. Nothing is disallowed, not even /raw/, so crawlers can read the
	// noindex those pages send. It names only the site's own AI crawlers and
	// says nothing about AI training, so Docus's agent discovery adds neither
	// its crawler groups nor a Content-Signal line.
	robots: {
		groups: AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
	},
	agentDiscovery: {
		robots: { aiPolicy: false },
	},

	llms: {
		domain: SITE_URL,
		title: "Styleframe",
		// The summary under the title, in llms.txt's `> ` blockquote.
		description:
			"Styleframe is an open-source, type-safe styling engine for design systems. You write design tokens, themes, utilities and recipes in TypeScript, and it generates the CSS at build time, with an optional runtime for recipe variants.",
	},

	content: {
		build: {
			markdown: {
				highlight: {
					// On top of Docus's and the layer's languages.
					langs: ["tsx"],
				},
			},
		},
	},

	docus: {
		// The assistant answers from a server, and the site is static.
		assistant: { enabled: false },
	},

	// Docus's MCP server needs a server too.
	mcp: {
		enabled: false,
	},

	// Every page sets its own structured data (useSiteHead, useDocsHead), so
	// Docus's nuxt-schema-org adds no default WebSite and WebPage beside it.
	schemaOrg: {
		defaults: false,
	},

	// Images are served as they are. The site is static, and IPX, which resizes
	// them otherwise, never answers the prerenderer, so the build stops before
	// it writes the site.
	image: {
		provider: "none",
	},

	// Social cards at the size crawlers crop to. nuxt-og-image draws 1200×600
	// by default.
	ogImage: {
		defaults: { width: 1200, height: 630 },
	},

	experimental: {
		// Inline the payload on first load, and extract it for client-side
		// navigation between docs pages.
		payloadExtraction: "client",
	},

	routeRules: {
		// The docs open on the introduction, for good.
		"/docs": {
			redirect: { to: "/docs/getting-started/introduction", statusCode: 301 },
		},
		...componentRedirects,
		// The pages' Markdown copies, for agents, stay out of search results:
		// the pages themselves are the ones to rank.
		"/raw/**": { headers: { "X-Robots-Tag": "noindex" } },
		// Hashed build assets never change, so cache them forever.
		"/_nuxt/**": {
			headers: { "cache-control": "public, max-age=31536000, immutable" },
		},
		"/**": {
			headers: SECURITY_HEADERS,
		},
	},

	nitro: {
		prerender: {
			crawlLinks: true,
			// /docs only redirects, so crawling the docs starts from the introduction.
			routes: [
				"/",
				"/docs",
				"/docs/getting-started/introduction",
				"/changelog",
				...changelogRoutes,
				...landingRawRoutes,
				// Nothing links /pro, or /pricing, which only /pro links. The homepage
				// links /scanner and /figma; they're listed so they don't depend on
				// the crawl. The legal pages are crawled from the footers.
				"/pro",
				"/pricing",
				"/scanner",
				"/figma",
				// Nothing links the former component pages either, so the crawler
				// would find their refresh pages only by chance. They come from
				// the same list as their routeRules, so the two can't drift.
				...Object.keys(componentRedirects),
			],
			failOnError: true,
		},
	},
});
