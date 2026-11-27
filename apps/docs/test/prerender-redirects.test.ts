import { describe, expect, it, vi } from "vitest";

/**
 * The static hosts serve a redirect's prerendered refresh page, so the build
 * must write one for every redirect in `routeRules`. The prerender crawler
 * writes a page only when a link leads to it, and nothing on the site links
 * to a redirect, so each one is listed in `nitro.prerender.routes`.
 */

// Nuxt defines `defineNuxtConfig` as a global when it loads the config.
vi.stubGlobal("defineNuxtConfig", (config: unknown) => config);

const { default: config } = await import("../nuxt.config");

const redirects = Object.entries(config.routeRules ?? {})
	.filter(([, rule]) => rule.redirect)
	.map(([path]) => path);
const prerendered = config.nitro?.prerender?.routes ?? [];

describe("the redirects", () => {
	it("include the 44 former component pages and their index", () => {
		expect(redirects.filter((path) => path.startsWith("/docs/theme/components"))).toHaveLength(45);
	});

	it.each(redirects)("prerenders %s", (path) => {
		expect(prerendered).toContain(path);
	});

	it("lists each prerendered route once", () => {
		expect(prerendered).toHaveLength(new Set(prerendered).size);
	});
});
