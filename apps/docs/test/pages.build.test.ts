import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The product and legal pages are prerendered at main's URLs with main's
 * titles, each with one <main>, and the site's chrome keeps its links: the
 * docs footer links the legal pages, and every page's header and footer link
 * everything the docs header, footer and table of contents do. The legal
 * pages' Markdown copies, which llms.txt links, are in the output too.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

// <title> on main's rendered pages.
const PAGES = {
	pro: "styleframe Pro - Premium Design System Tools - styleframe",
	pricing: "Pricing - styleframe",
	scanner: "Utility Scanner - Automatic CSS Generation - styleframe",
	figma: "Figma Plugin - Design Tokens Sync - styleframe",
	license: "License - styleframe",
	privacy: "Privacy - styleframe",
	terms: "Terms - styleframe",
	cookies: "Cookies - styleframe",
};

const LEGAL_LINKS = ['href="/privacy"', 'href="/terms"', 'href="/license"'];

const CHROME_LINKS = [
	'href="/docs/getting-started/introduction"',
	'href="/changelog"',
	'href="https://app.styleframe.dev"',
	'href="https://github.com/uxfront-com/styleframe"',
	'href="https://x.com/styleframe_dev"',
	'href="https://discord.com/invite/KCVwuGz44M"',
	'href="https://storybook.styleframe.dev"',
	'href="https://play.styleframe.dev"',
	...LEGAL_LINKS,
];

// The site header's own links, beside the footer's copies.
const HEADER_LINKS = CHROME_LINKS.slice(0, 4);

// The links each product page must keep from main.
const PAGE_LINKS = {
	pro: [
		'href="/pricing"',
		'href="https://buy.polar.sh/polar_cl_Emg2oNVEHjBUEHvxleSZxjHaCmlT9fgYtrACU4QVLUm"',
		'href="https://buy.polar.sh/polar_cl_IiKynjOnqr8efgtVhbSaNSvWt6G6LbHW2Oqpq4KLobS"',
	],
	pricing: [
		'href="https://buy.polar.sh/polar_cl_Emg2oNVEHjBUEHvxleSZxjHaCmlT9fgYtrACU4QVLUm"',
		'href="https://buy.polar.sh/polar_cl_IiKynjOnqr8efgtVhbSaNSvWt6G6LbHW2Oqpq4KLobS"',
		'href="mailto:support@styleframe.dev"',
	],
	scanner: ['href="/docs/getting-started/tooling/scanner"'],
	figma: [
		'href="https://www.figma.com/community/plugin/1597716416772135340/styleframe"',
	],
};

const CREDIT = /Copyright © \d{4} styleframe/;

/** A page's HTML, in either of the layouts Nitro writes. */
function readPage(route: string): string {
	const file = [`${route}.html`, `${route}/index.html`]
		.map((path) => join(OUTPUT, path))
		.find((path) => existsSync(path));
	expect(file, `${route} is not prerendered`).toBeDefined();
	return readFileSync(file!, "utf8");
}

/** The markup inside the page's <header> and <footer> elements. */
function chrome(html: string): string {
	return [...html.matchAll(/<(header|footer)\b[\s\S]*?<\/\1>/g)]
		.map(([markup]) => markup)
		.join("\n");
}

describe("product and legal pages", () => {
	it.each(Object.entries(PAGES))(
		"%s keeps main's title and has one <main>",
		(route, title) => {
			const html = readPage(route);
			expect(html).toContain(`<title>${title}</title>`);
			expect(html.match(/<main\b/g)).toHaveLength(1);
		},
	);

	it.each(Object.keys(PAGES))(
		"%s links everything the docs chrome does",
		(route) => {
			const html = readPage(route);
			const markup = chrome(html);
			for (const link of CHROME_LINKS) expect(markup).toContain(link);
			expect(markup).toMatch(CREDIT);
			const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
			for (const link of HEADER_LINKS) expect(header).toContain(link);
		},
	);

	it.each(Object.keys(PAGES))(
		"%s shows the docs' logotype in its header, with the byline after it",
		(route) => {
			const header =
				readPage(route).match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
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
		},
	);

	it.each(Object.entries(PAGE_LINKS))(
		"%s keeps main's checkout, plugin and docs links",
		(route, links) => {
			const html = readPage(route);
			for (const link of links) expect(html).toContain(link);
		},
	);

	it.each(["license", "privacy", "terms", "cookies"])(
		"%s has its Markdown copy at /raw/%s.md",
		(route) => {
			expect(existsSync(join(OUTPUT, "raw", `${route}.md`))).toBe(true);
		},
	);

	it("the docs footer links the legal pages, with main's credit", () => {
		const html = readPage("docs/api/variables");
		const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? "";
		for (const link of LEGAL_LINKS) expect(footer).toContain(link);
		expect(footer).toMatch(CREDIT);
	});
});
