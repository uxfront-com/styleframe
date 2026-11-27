import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Every page describes itself once. The site sets each page's structured data
 * (useSiteHead, useDocsHead), so no module may add a second WebSite, or a
 * WebPage beside a page's own WebPage or TechArticle, which search engines
 * would read as two sites or two pages.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

// The types that describe the page itself.
const PAGE_TYPES = new Set(["WebPage", "TechArticle"]);

const pages = (dir: string): Array<string> =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			return entry.name.startsWith("_") ? [] : pages(path);
		}
		return entry.name.endsWith(".html") ? [path] : [];
	});

const types = (html: string): Array<string> =>
	[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(
		(match) => {
			const data = JSON.parse(match[1]!) as {
				"@graph"?: Array<{ "@type": string }>;
				"@type"?: string;
			};
			return (data["@graph"] ?? [data]).map((node) => String(node["@type"]));
		},
	);

describe("structured data", () => {
	const files = pages(OUTPUT);

	it("finds the pages in the build", () => {
		expect(files.length).toBeGreaterThan(100);
	});

	it.each(files.map((file) => relative(OUTPUT, file)))(
		"%s describes one site and one page",
		(file) => {
			const found = types(readFileSync(join(OUTPUT, file), "utf8"));
			expect(found.filter((type) => type === "WebSite").length).toBeLessThanOrEqual(1);
			expect(found.filter((type) => PAGE_TYPES.has(type)).length).toBeLessThanOrEqual(1);
		},
	);
});
