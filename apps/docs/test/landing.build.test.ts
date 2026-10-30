import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Agents get the site's own pages as main gave them: `llms.txt` lists the
 * homepage, the product pages and the legal pages under "Landing", with main's
 * titles and descriptions, and each has its Markdown copy at
 * `/raw/<page>.md`, which `llms-full.txt` holds too. The homepage and the
 * product pages are Vue pages, so their copies come from content/landing/.
 * Every one of those pages, and the 404 page, has main's favicon.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

// Main's "Landing" section in llms.txt: each page's title and description,
// with the homepage's own.
const LANDING = {
	cookies: ["Cookies", ""],
	figma: [
		"Figma Plugin - Design Tokens Sync",
		"Styleframe is the source of truth for your design tokens. Sync variables between code and Figma using the W3C DTCG format, with full multi-mode support.",
	],
	index: [
		"Type-safe Styling Engine for the AI Era",
		"Styleframe is the type-safe styling engine for the AI era. Author tokens, themes, utilities and recipes in TypeScript, and ship zero-runtime CSS.",
	],
	license: ["License", ""],
	pricing: [
		"Pricing",
		"Write composable, type-safe, future-proof Design Systems code using styleframe's powerful TypeScript CSS API.",
	],
	privacy: ["Privacy", ""],
	pro: [
		"styleframe Pro - Premium Design System Tools",
		"Build beautiful design systems in minutes with styleframe Pro's premium composables, advanced features, and mathematical precision.",
	],
	scanner: [
		"Utility Scanner - Automatic CSS Generation",
		"Write utility classes directly in your markup. Styleframe's utility scanner detects them and generates only the CSS you use at build time — type-safe, framework-agnostic, with full HMR support.",
	],
	terms: ["Terms", ""],
};

// A line of each Vue page's own text, which its Markdown copy must say too.
const PAGE_TEXT = {
	index:
		"Skip the breakpoints. Styleframe scales your typography and spacing fluidly from phone to desktop.",
	pro: "| Prioritized feature requests        | Not included | Not included | Included     |",
	pricing:
		"| Number of developers                | 1            | 5            | Unlimited    |",
	scanner:
		"Enable the scanner, register your factories, and let your templates drive your CSS output.",
	figma:
		"Export design tokens directly from your Styleframe config. Run in CI/CD pipelines to keep Figma tokens in sync with every code change.",
};

function read(path: string): string {
	const file = join(OUTPUT, path);
	expect(existsSync(file), `${path} is not in the output`).toBe(true);
	return readFileSync(file, "utf8");
}

/** The links under a `## <title>` section of llms.txt. */
function section(llms: string, title: string): string {
	return (
		llms.split(/^## /m).find((part) => part.startsWith(`${title}\n`)) ?? ""
	);
}

describe("the site's pages for agents", () => {
	it.each(Object.entries(LANDING))(
		"llms.txt lists /raw/%s.md under Landing with main's title and description",
		(page, [title, description]) => {
			const entry = `- [${title}](https://styleframe.dev/raw/${page}.md)`;
			const line = section(read("llms.txt"), "Landing")
				.split("\n")
				.find((item) => item.startsWith(entry));
			expect(line).toBe(description ? `${entry}: ${description}` : entry);
		},
	);

	it.each(Object.entries(PAGE_TEXT))(
		"/raw/%s.md says what the page says",
		(page, text) => {
			const raw = read(`raw/${page}.md`);
			expect(
				raw.startsWith(`# ${LANDING[page as keyof typeof LANDING][0]}\n`),
			).toBe(true);
			expect(raw).toContain(text);
			expect(read("llms-full.txt")).toContain(
				text.startsWith("|") ? text.split("|")[1]!.trim() : text,
			);
		},
	);

	it.each([...Object.keys(LANDING), "404"])("%s has main's favicon", (page) => {
		const file = [`${page}.html`, `${page}/index.html`].find((path) =>
			existsSync(join(OUTPUT, path)),
		);
		expect(file, `${page} is not prerendered`).toBeDefined();
		expect(read(file!)).toContain('<link rel="icon" href="/favicon.ico">');
	});
});
