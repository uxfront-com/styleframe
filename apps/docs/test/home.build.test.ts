import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The homepage is a UXFront page with main's title and description, and it
 * keeps every link main's homepage had, the site's chrome links, and its code
 * samples highlighted in the HTML. Unknown routes get the static host's
 * 404.html.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

const read = (file: string) => readFileSync(join(OUTPUT, file), "utf8");

// main's homepage, as rendered.
const TITLE = "The Design Systems Styling Engine - styleframe";
const DESCRIPTION =
	"Styleframe turns your design system into a type-safe TypeScript source of truth and compiles it to CSS — one engine behind tokens, themes, utilities, and recipes.";

// The calls to action, in order: the hero's, one per chapter that had one on
// main (the fluid-design docs page replaces its demo), and the finale's.
// GitHub is at the repository's current home.
const CALLS_TO_ACTION = [
	"/docs/getting-started/introduction",
	"https://github.com/uxfront-com/styleframe",
	"/docs/theme/design-tokens",
	"/docs/api/themes",
	"/docs/api/recipes",
	"/scanner",
	"/figma",
	"/docs/theme/design-tokens/fluid-design",
	"/docs/getting-started/introduction",
	"https://github.com/uxfront-com/styleframe",
];

// The features that linked somewhere on main.
const FEATURE_LINKS = [
	"/docs/api",
	"/docs/api/composables",
	"/docs/api/themes",
	"/docs/getting-started/installation",
	"/docs/api/instance#configuration-options",
	"/docs/getting-started/guides",
	"/docs/api/recipes",
];

// What the docs header, footer and table of contents link.
const CHROME_LINKS = [
	"/docs/getting-started/introduction",
	"/changelog",
	"https://app.styleframe.dev",
	"https://github.com/uxfront-com/styleframe",
	"https://x.com/styleframe_dev",
	"https://discord.com/invite/KCVwuGz44M",
	"https://storybook.styleframe.dev",
	"https://play.styleframe.dev",
	"/privacy",
	"/terms",
	"/license",
];

describe("homepage", () => {
	const html = existsSync(join(OUTPUT, "index.html")) ? read("index.html") : "";
	const head = html.match(/<head\b[\s\S]*?<\/head>/)?.[0] ?? "";
	// The page's own content: <main> without the finale's footer.
	const content = (html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? "").replace(
		/<footer\b[\s\S]*?<\/footer>/g,
		"",
	);

	it("is a page, not a redirect", () => {
		expect(html, "index.html is not prerendered").not.toBe("");
		expect(html).not.toContain('http-equiv="refresh"');
	});

	it("keeps main's title and description", () => {
		expect(html).toContain(`<title>${TITLE}</title>`);
		expect(html).toContain(
			`<meta name="description" content="${DESCRIPTION}">`,
		);
	});

	it("is a UxSite with one <main> and one <h1>", () => {
		expect(html).toContain('class="ux-site');
		expect(html.match(/<main\b/g)).toHaveLength(1);
		expect(html.match(/<h1\b/g)).toHaveLength(1);
	});

	it("keeps main's calls to action", () => {
		const links = [
			...content.matchAll(/<a class="ux-pill-link[^"]*" href="([^"]+)"/g),
		].map(([, href]) => href);
		expect(links).toEqual(CALLS_TO_ACTION);
	});

	it.each(FEATURE_LINKS)("links the feature at %s", (link) => {
		expect(content).toContain(`<a href="${link}" class="site-features__item"`);
	});

	it("links everything the docs chrome does in its header and footer", () => {
		const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
		const chrome = [...html.matchAll(/<(header|footer)\b[\s\S]*?<\/\1>/g)]
			.map(([markup]) => markup)
			.join("\n");
		for (const link of CHROME_LINKS.slice(0, 4)) {
			expect(header).toContain(`href="${link}"`);
		}
		for (const link of CHROME_LINKS) {
			expect(chrome).toContain(`href="${link}"`);
		}
		expect(chrome).toMatch(/Copyright © \d{4} styleframe/);
	});

	// The hero lists the chapters; the header doesn't repeat them.
	it("links no chapter from its header", () => {
		const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
		expect(header).not.toBe("");
		expect(header).not.toMatch(/href="#/);
	});

	it("keeps the AI waitlist and its video", () => {
		expect(html).toContain("Join waitlist for styleframe AI");
		expect(html).toContain('src="/assets/video/styleframe-ai.mp4"');
		expect(html).toContain('poster="/assets/images/styleframe-ai.webp"');
	});

	it("highlights its code samples in the HTML", () => {
		const samples = html.match(/<pre class="[^"]*\bshiki\b[^"]*"><code>/g);
		// Five samples, and the output one has two blocks: its CSS and its recipe.
		expect(samples).toHaveLength(6);
	});

	it("blocks its first paint on no stylesheet", () => {
		// @uxfront/layer-ui takes the entry stylesheet out of the head, and
		// server/plugins/defer-stylesheets.ts defers the chunk ones.
		const links = head.match(/<link rel="stylesheet"[^>]*>/g) ?? [];
		expect(links.length).toBeGreaterThan(0);
		for (const link of links) expect(link).toContain('media="print"');
	});
});

it("leaves the docs pages' stylesheet as it is", () => {
	const html = existsSync(join(OUTPUT, "docs/api/variables.html"))
		? read("docs/api/variables.html")
		: read("docs/api/variables/index.html");
	expect(html).toMatch(
		/<link rel="stylesheet" href="[^"]*\/entry\.[\w-]+\.css"[^>]*crossorigin>/,
	);
	expect(html).not.toContain('media="print"');
});

// 404.html is the app's client-side shell: app/error.vue renders the UXFront
// error page in the browser.
it("writes 404.html for unknown routes", () => {
	expect(existsSync(join(OUTPUT, "404.html"))).toBe(true);
});
