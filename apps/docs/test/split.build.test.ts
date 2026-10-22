import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Every chapter with a code sample or a picture shows it beside its copy
 * (SiteSplit.vue): the code open, a <pre> in the side column, behind no
 * "View code" disclosure, and a video that loads nothing but its poster until
 * it plays. The fluid section on the homepage is a centred SiteSplit.
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

const section = (html: string, id: string) =>
	html.match(
		new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?</section>`),
	)?.[0] ?? "";

// The chapters with a code sample, by page and section id.
const CODE: Record<string, string[]> = {
	index: ["config", "compose", "themes", "output", "scanner"],
	scanner: ["templates", "output"],
	figma: ["cli"],
};

// The chapters with an image or a video, and which of them is a video.
const MEDIA: Record<string, string[]> = {
	index: ["figma", "ai"],
	figma: ["plugin", "import", "export"],
};
const VIDEOS = ["ai", "plugin"];

describe.each(Object.entries(CODE))("/%s", (page, ids) => {
	const html = read(page);

	it("is prerendered", () => {
		expect(html).not.toBe("");
	});

	it.each(ids)("shows #%s side by side, with its code open", (id) => {
		const markup = section(html, id);
		expect(markup).toMatch(/^<section\b[^>]*\bclass="site-split\b/);
		expect(markup).toMatch(/<div class="site-split__aside"[^>]*>[\s\S]*<pre\b/);
		expect(markup).not.toContain("<details");
	});
});

describe.each(Object.entries(MEDIA))("/%s", (page, ids) => {
	const html = read(page);

	it.each(ids)("shows the media of #%s beside its copy", (id) => {
		const markup = section(html, id);
		expect(markup).toMatch(/^<section\b[^>]*\bclass="site-split\b/);
		const aside =
			markup.match(/<div class="site-split__aside"[^>]*>[\s\S]*$/)?.[0] ?? "";
		if (!VIDEOS.includes(id)) {
			expect(aside).toMatch(/<img\b/);
			return;
		}
		const video = aside.match(/<video\b[^>]*>/)?.[0] ?? "";
		expect(video).toContain('preload="none"');
		expect(video).toMatch(/\bposter="[^"]+"/);
	});
});

it("centres the homepage's fluid section", () => {
	const markup = section(read("index"), "fluid");
	expect(markup).toMatch(
		/^<section\b[^>]*\bclass="site-split site-split--center\b/,
	);
	expect(markup).not.toContain("site-split__aside");
});
