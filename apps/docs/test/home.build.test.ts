import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The homepage is a UXFront page with its own title and description, and it
 * keeps every link main's homepage had, the site's chrome links, and its code
 * samples highlighted in the HTML. Unknown routes get the static host's
 * 404.html.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

const read = (file: string) => readFileSync(join(OUTPUT, file), "utf8");

// The homepage's title and description, as rendered.
const TITLE = "Type-safe Styling Engine for the AI Era - styleframe";
const DESCRIPTION =
	"Styleframe is the type-safe styling engine for the AI era. Author tokens, themes, utilities and recipes in TypeScript, and ship zero-runtime CSS.";

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

// Where the two actions sit in the calls to action.
const ACTIONS = { hero: [0, 2], finale: [-2, undefined] } as const;

// The start of UxStarIcon's path.
const STAR_ICON = 'd="M8 .25a.75.75';

// app.vue's rule that removes the arrow from the kit's linked cards, as the
// build writes it.
const NO_CARD_ARROW =
	/\.ux-traits \.ux-traits__linked \.ux-traits__link strong::?after\{content:none\}/;

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

const LOGIN_URL = "https://app.styleframe.dev";

// What the docs chrome links (its header, footer and table of contents), plus
// the site footer's Log in.
const CHROME_LINKS = [
	"/docs/getting-started/introduction",
	"/changelog",
	LOGIN_URL,
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

	it("has the homepage's title and description", () => {
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

	it.each(Object.entries(ACTIONS))(
		"fills Get started and stars Star on GitHub in the %s",
		(_, [from, to]) => {
			const pills = [
				...content.matchAll(/<a class="ux-pill-link[\s\S]*?<\/a>/g),
			].map(([markup]) => markup);
			const [getStarted, star] = pills.slice(from, to);
			expect(getStarted).toContain("Get started");
			expect(getStarted).toContain("ux-pill-link--filled");
			expect(star).toContain("Star on GitHub");
			expect(star).not.toContain("ux-pill-link--filled");
			expect(star).toContain(STAR_ICON);
			expect(star).not.toContain("ux-pill-link__arrow");
		},
	);

	it.each(FEATURE_LINKS)("links the feature at %s", (link) => {
		expect(content).toContain(`<a class="ux-traits__link" href="${link}"`);
	});

	it("links everything the docs chrome does in its header and footer", () => {
		const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
		const chrome = [...html.matchAll(/<(header|footer)\b[\s\S]*?<\/\1>/g)]
			.map(([markup]) => markup)
			.join("\n");
		for (const link of CHROME_LINKS.slice(0, 4)) {
			if (link !== LOGIN_URL) expect(header).toContain(`href="${link}"`);
		}
		for (const link of CHROME_LINKS) {
			expect(chrome).toContain(`href="${link}"`);
		}
		expect(chrome).toMatch(/Copyright © \d{4} styleframe/);
	});

	it("links Log in from its footer, not its header", () => {
		const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
		const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? "";
		expect(header).not.toBe("");
		expect(header).not.toContain(`href="${LOGIN_URL}"`);
		expect(footer).toContain(`href="${LOGIN_URL}"`);
	});

	it("shows the docs' logotype in its header, with the byline after it", () => {
		const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
		const home =
			header.match(
				/<a\b[^>]*aria-label="styleframe, home"[\s\S]*?<\/a>/,
			)?.[0] ?? "";
		expect(home).not.toBe("");
		expect(home).toMatch(
			/<img\b(?=[^>]*\bsrc="\/logotype-dark\.svg")(?=[^>]*\balt="")[^>]*>/,
		);
		// No mark: neither the old one, nor the UxFrontMark UxHeader defaults to.
		expect(home).not.toContain('src="/logo.svg"');
		expect(home).not.toContain("<svg");
		expect(home).not.toContain("ux-header__mark");
		expect(header.indexOf('href="https://uxfront.com"')).toBeGreaterThan(
			header.indexOf(home),
		);
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
		// @uxfront/layer-ui takes the stylesheets out of the head and loads them
		// after the first paint: the entry one, and the chunk ones the docs make
		// the build write.
		expect(head).not.toMatch(/<link rel="stylesheet"/);
		const deferred = html.match(/\["\/_nuxt\/[^\]]*\.css"\]/)?.[0] ?? "";
		expect(deferred).toMatch(/"\/_nuxt\/entry\.[\w-]+\.css"/);
		expect(deferred).toMatch(/"\/_nuxt\/(?!entry\.)[\w.-]+\.css"/);
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

it.each(["index", "pro"])(
	"%s holds the rule without the cards' arrow",
	(route) => {
		const file = existsSync(join(OUTPUT, `${route}.html`))
			? `${route}.html`
			: `${route}/index.html`;
		expect(read(file)).toMatch(NO_CARD_ARROW);
	},
);

// 404.html is the app's client-side shell: app/error.vue renders the UXFront
// error page in the browser.
it("writes 404.html for unknown routes", () => {
	expect(existsSync(join(OUTPUT, "404.html"))).toBe(true);
});
