import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Every chapter with a code sample shows its copy and its code side by side
 * (SiteSplit.vue), with the code open: a <pre> in the code column, behind no
 * "View code" disclosure.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

const read = (page: string) => {
	const file = [`${page}.html`, `${page}/index.html`]
		.map((path) => join(OUTPUT, path))
		.find((path) => existsSync(path));
	return file ? readFileSync(file, "utf8") : "";
};

// The chapters with a code sample, by page and section id.
const CHAPTERS: Record<string, string[]> = {
	index: ["config", "compose", "themes", "output", "scanner"],
	scanner: ["templates", "output"],
	figma: ["cli"],
};

describe.each(Object.entries(CHAPTERS))("/%s", (page, ids) => {
	const html = read(page);

	it("is prerendered", () => {
		expect(html).not.toBe("");
	});

	it.each(ids)("shows #%s side by side, with its code open", (id) => {
		const section =
			html.match(
				new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?</section>`),
			)?.[0] ?? "";
		expect(section).toMatch(/^<section\b[^>]*\bclass="site-split\b/);
		expect(section).toMatch(/<div class="site-split__code"[^>]*>[\s\S]*<pre\b/);
		expect(section).not.toContain("<details");
	});
});
