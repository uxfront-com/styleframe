import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * The component recipe pages moved to Inkline's docs with @inkline/theme in
 * @styleframe/theme 4.0.0, so each former page, and their index, redirects to
 * its own page there (`routeRules` in nuxt.config.ts). Links to the old pages,
 * from search results, bookmarks and other sites, keep working.
 *
 * The prerendered pages redirect with a refresh, which the static hosts serve.
 * The Workers build also writes each redirect to dist/_redirects, with a 301,
 * so that part runs only after `WORKERS_CI=1 pnpm build`. A Workers build
 * writes its pages to dist/ too, so after one alone, the test reads them there.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const STATIC = fileURLToPath(new URL("../.output/public", import.meta.url));
const WORKERS = fileURLToPath(new URL("../dist", import.meta.url));
const OUTPUT = existsSync(STATIC) ? STATIC : WORKERS;
const REDIRECTS = join(WORKERS, "_redirects");

const INKLINE = "https://inkline.io/docs/react/recipes";

// The 44 component pages styleframe.dev served before 4.0.0, at
// /docs/theme/components/<slug>. Inkline's docs keep the same slugs.
const SLUGS = [
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

// Each former URL, with the page it now redirects to.
const MOVED: Array<[string, string]> = [
	["/docs/theme/components", INKLINE],
	...SLUGS.map((slug): [string, string] => [
		`/docs/theme/components/${slug}`,
		`${INKLINE}/${slug}`,
	]),
];

const read = (path: string) => {
	const file = [`${path}.html`, `${path}/index.html`]
		.map((page) => join(OUTPUT, page))
		.find((page) => existsSync(page));
	return file ? readFileSync(file, "utf8") : "";
};

describe("the former component pages", () => {
	it("lists the 44 pages and the index", () => {
		expect(new Set(SLUGS).size).toBe(44);
		expect(MOVED).toHaveLength(45);
	});

	it.each(MOVED)("%s redirects to %s", (from, to) => {
		const target = read(from).match(/<meta http-equiv="refresh" content="0; url=([^"]+)"/)?.[1];
		expect(target).toBe(to);
	});
});

describe.runIf(existsSync(REDIRECTS))("the Workers build's _redirects", () => {
	const rules = existsSync(REDIRECTS) ? readFileSync(REDIRECTS, "utf8").split("\n") : [];

	it.each(MOVED)("redirects %s to %s with a 301", (from, to) => {
		expect(rules).toContain(`${from}\t${to}\t301`);
	});

	it("has no wildcard target, which Cloudflare would serve as it's written", () => {
		expect(rules.filter((rule) => rule.includes("**"))).toEqual([]);
	});
});
