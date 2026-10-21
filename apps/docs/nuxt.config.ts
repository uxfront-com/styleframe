import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { createResolver } from "@nuxt/kit";
import { SECURITY_HEADERS } from "./server/lib/headers";

const { resolve } = createResolver(import.meta.url);
const require = createRequire(import.meta.url);

const SITE_URL = "https://www.styleframe.dev";

// Docus reads the site URL from the environment: for canonical URLs, robots.txt
// and llms.txt at build time, and for the sitemap when it's prerendered.
process.env.NUXT_SITE_URL ||= SITE_URL;

// One prerendered route per changelog entry. Their slugs, like /changelog/3.9.0,
// end in what the prerender crawler reads as a file extension, so it skips them
// when it follows the links on /changelog.
const changelogRoutes = readdirSync(resolve("./content/changelog"))
	.filter((file) => file.endsWith(".md"))
	.map((file) => `/changelog/${file.replace(/\.md$/, "")}`);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	ssr: true,

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
	modulesDir: [
		join(dirname(require.resolve("docus/package.json")), "node_modules"),
	],

	modules: [
		// Drops the category folders under Elements and Components from the URLs,
		// and keeps them as sidebar groups.
		resolve("./modules/nonRouteCategories"),
		// The changelog's raw Markdown, which llms.txt links and nothing crawls.
		resolve("./modules/rawChangelog"),
		// Docus's Markdown routes, split to fit Vercel's 4096-character limit.
		resolve("./modules/vercelRouteLimit"),
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
		name: "Styleframe — The Design Systems Styling Engine",
	},

	llms: {
		domain: "https://styleframe.dev",
		title: "Styleframe",
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
		// The docs open on the introduction.
		"/docs": { redirect: "/docs/getting-started/introduction" },
		// The homepage isn't rebuilt yet, so the site opens on the docs too.
		"/": { redirect: "/docs/getting-started/introduction" },
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
			],
			failOnError: true,
		},
	},

	hooks: {
		// Every page would otherwise prefetch the docs' lazy chunks, which delays
		// the first page's fonts and stylesheet.
		"build:manifest"(manifest) {
			for (const chunk of Object.values(manifest)) chunk.prefetch = false;
		},
	},
});
