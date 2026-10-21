import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The product and legal pages are prerendered at main's URLs with main's
 * titles, each with one <main>, and the site's chrome keeps its links: the
 * docs footer links the legal pages, and the product pages' header and footer
 * link everything the docs header, footer and table of contents do.
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

	it.each(["pro", "pricing", "scanner", "figma"])(
		"%s links everything the docs chrome does",
		(route) => {
			const markup = chrome(readPage(route));
			for (const link of CHROME_LINKS) expect(markup).toContain(link);
			expect(markup).toMatch(CREDIT);
		},
	);

	it("the docs footer links the legal pages, with main's credit", () => {
		const html = readPage("docs/api/variables");
		const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? "";
		for (const link of LEGAL_LINKS) expect(footer).toContain(link);
		expect(footer).toMatch(CREDIT);
	});
});
