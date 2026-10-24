import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { REVEAL_PROPERTY } from "../app/lib/formations/code.shader";

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

// The <section> around the element with the chapter's id: a SiteSplit puts
// the id on its stage, inside the section.
const section = (html: string, id: string) => {
	const at = html.indexOf(` id="${id}"`);
	if (at < 0) return "";
	const start = html.lastIndexOf("<section", at);
	const end = html.indexOf("</section>", at);
	return start < 0 || end < 0
		? ""
		: html.slice(start, end + "</section>".length);
};

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

	// The code formation (code.ts) gathers around the panel, which only fades
	// once the scene draws: the prerendered page shows the code.
	it.each(ids)("marks the code panel of #%s, shown at once", (id) => {
		const markup = section(html, id);
		expect(markup).toMatch(/<figure\b[^>]*\bdata-code-panel\b/);
		expect(markup).not.toMatch(/^<section\b[^>]*\bdata-fade\b/);
	});

	// The formation holds from the stage inside the section, which starts
	// above it, and writes the reveal SiteSplit fades the panel by.
	it.each(ids)("holds #%s's formation from its stage", (id) => {
		const markup = section(html, id);
		expect(markup).not.toMatch(/^<section\b[^>]*\bdata-stage\b/);
		expect(markup).toMatch(/<div [^>]*class="site-split__stage" data-stage\b/);
	});

	it("fades the code panels by the code formation's reveal", () => {
		expect(html).toContain(
			`[data-code-panel]{opacity:var(${REVEAL_PROPERTY},0)}`,
		);
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

// The scene names the active chapter after its stage's id, and the header
// marks the link to it (UxHeader), so the chapter's id is on the stage, not
// on the section around it.
describe.each(
	Object.entries({
		index: [...CODE.index, ...MEDIA.index, "fluid"],
		scanner: CODE.scanner,
		figma: [...CODE.figma, ...MEDIA.figma],
	}),
)("/%s", (page, ids) => {
	const html = read(page);

	it.each(ids)("puts #%s's id on its stage", (id) => {
		const markup = section(html, id);
		expect(markup).toMatch(/^<section\b/);
		expect(markup.match(/^<section\b[^>]*>/)?.[0]).not.toMatch(/\bid=/);
		expect(markup).toMatch(
			new RegExp(`<div id="${id}" class="site-split__stage" data-stage\\b`),
		);
	});
});

it("centres the homepage's fluid section", () => {
	const markup = section(read("index"), "fluid");
	expect(markup).toMatch(
		/^<section\b[^>]*\bclass="site-split site-split--center\b/,
	);
	expect(markup).not.toContain("site-split__aside");
});
