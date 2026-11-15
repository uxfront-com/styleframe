import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

/**
 * The search and AI search rules every indexable page keeps, checked on the
 * built site the way a crawler reads it.
 *
 * It starts from `sitemap.xml`: every `<loc>` is on the production host, has a
 * `<lastmod>`, and is exactly the set of prerendered pages a search engine may
 * index. Then each of those pages has the tags search results and social cards
 * read, and structured data that parses. `robots.txt` lets every crawler in,
 * the AI crawlers by name, and `llms.txt` links the Markdown copy of every docs
 * page on the production host.
 *
 * Requires a prior build; runs via `test:build` (see `vitest.build.config.ts`).
 * It prints a one-line summary of the pages it checked and the rules they break.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

const SITE = "https://www.styleframe.dev";

/** The AI crawlers robots.txt names, each allowed in. */
const AI_CRAWLERS = [
	"OAI-SearchBot",
	"ChatGPT-User",
	"PerplexityBot",
	"Claude-SearchBot",
	"Claude-User",
	"GPTBot",
	"ClaudeBot",
	"Google-Extended",
	"CCBot",
];

const PNG_SIGNATURE = Buffer.from([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const ENTITIES: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
	"&#x27;": "'",
	"&#x2F;": "/",
};

function decode(value: string): string {
	return value.replace(/&(?:amp|lt|gt|quot|#39|#x27|#x2F);/g, (entity) => {
		return ENTITIES[entity]!;
	});
}

function read(file: string): string {
	const path = join(OUTPUT, file);
	return existsSync(path) ? readFileSync(path, "utf8") : "";
}

interface SitemapUrl {
	loc: string;
	lastmod: string | undefined;
}

function readSitemap(): SitemapUrl[] {
	return [...read("sitemap.xml").matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
		([, url]) => ({
			loc: decode(url!.match(/<loc>([^<]*)<\/loc>/)?.[1] ?? ""),
			lastmod: url!.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1],
		}),
	);
}

/** The prerendered file a URL on the site is served from. */
function pageFile(loc: string): string | undefined {
	const path = decodeURIComponent(new URL(loc).pathname).replace(/\/$/, "");
	return [`${path}.html`, `${path}/index.html`]
		.map((file) => join(OUTPUT, file))
		.find((file) => existsSync(file));
}

/** The path a prerendered file is served at: `docs/api.html` is `/docs/api`. */
function servedPath(file: string): string {
	const path = `/${relative(OUTPUT, file)}`
		.replace(/(^|\/)index\.html$/, "")
		.replace(/\.html$/, "");
	return path || "/";
}

type Attributes = Record<string, string>;

function attributes(tag: string): Attributes {
	return Object.fromEntries(
		[...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [
			name!.toLowerCase(),
			decode(value!),
		]),
	);
}

function tags(html: string, name: string): Attributes[] {
	return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(([tag]) =>
		attributes(tag),
	);
}

/** The `content` of every `<meta>` whose `name` or `property` is `key`. */
function meta(html: string, key: string): string[] {
	return tags(html, "meta")
		.filter((tag) => tag.name === key || tag.property === key)
		.map((tag) => tag.content ?? "");
}

function isNoindex(html: string): boolean {
	return meta(html, "robots").some((content) => content.includes("noindex"));
}

function title(html: string): string {
	const head = html.slice(0, html.indexOf("</head>"));
	return decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").trim();
}

function description(html: string): string {
	return meta(html, "description")[0] ?? "";
}

/** Every JSON-LD block, parsed, or the parse error. */
function jsonLd(html: string): (unknown | Error)[] {
	return [
		...html.matchAll(
			/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
		),
	].map(([, body]) => {
		try {
			return JSON.parse(body!) as unknown;
		} catch (error) {
			return error as Error;
		}
	});
}

type Node = Record<string, unknown>;

/** The nodes of the JSON-LD blocks, with the nodes of each `@graph`. */
function nodes(blocks: unknown[]): Node[] {
	return blocks.flatMap((block) => {
		if (!block || typeof block !== "object" || block instanceof Error) {
			return [];
		}
		const graph = (block as Node)["@graph"];
		return Array.isArray(graph) ? (graph as Node[]) : [block as Node];
	});
}

function types(found: Node[]): string[] {
	return found.flatMap((node) => [node["@type"]].flat() as string[]);
}

function readPngSize(file: string): { width: number; height: number } | null {
	const header = readFileSync(file).subarray(0, 24);
	if (!header.subarray(0, 8).equals(PNG_SIGNATURE)) {
		return null;
	}
	return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

/** The prerendered pages a search engine may index. */
function findIndexablePages(): string[] {
	if (!existsSync(OUTPUT)) {
		return [];
	}

	return readdirSync(OUTPUT, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
		.map((entry) => join(entry.parentPath, entry.name))
		.filter((file) => {
			const path = relative(OUTPUT, file);
			return (
				!["200.html", "404.html"].includes(path) &&
				!path.startsWith("raw/") &&
				!path.startsWith("_og/")
			);
		})
		.filter((file) => {
			const html = readFileSync(file, "utf8");
			return !html.includes('http-equiv="refresh"') && !isNoindex(html);
		})
		.map(servedPath)
		.sort();
}

const sitemap = readSitemap();
const locs = new Set(sitemap.map((url) => url.loc));
const pages = sitemap.flatMap(({ loc }) => {
	const file = pageFile(loc);
	return file ? [{ loc, html: readFileSync(file, "utf8") }] : [];
});

// The summary printed at the end: the pages checked and the rules they broke.
const failures: string[] = [];

function check(problems: string[]): void {
	failures.push(...problems);
	expect(problems).toEqual([]);
}

afterAll(() => {
	console.log(
		`SEO: ${pages.length} pages checked, ${failures.length} failures`,
	);
});

describe("sitemap.xml", () => {
	it("lists the site's pages", () => {
		expect(
			sitemap.length,
			`no sitemap in ${OUTPUT}: run the build first`,
		).toBeGreaterThan(0);
	});

	it("lists every URL on the production host, with a lastmod", () => {
		check(
			sitemap.flatMap(({ loc, lastmod }) => [
				...(loc.startsWith(`${SITE}/`) ? [] : [`${loc}: not on ${SITE}`]),
				...(lastmod && /^\d{4}-\d{2}-\d{2}$/.test(lastmod)
					? []
					: [`${loc}: lastmod is ${lastmod ?? "missing"}`]),
			]),
		);
	});

	it("lists exactly the indexable prerendered pages", () => {
		const listed = [...locs].map((loc) => new URL(loc).pathname).sort();
		const indexable = findIndexablePages();
		check([
			...indexable
				.filter((path) => !listed.includes(path))
				.map((path) => `${path}: indexable, not in the sitemap`),
			...listed
				.filter((path) => !indexable.includes(path))
				.map((path) => `${path}: in the sitemap, not an indexable page`),
		]);
	});
});

describe("head tags", () => {
	it("are unique across pages", () => {
		const problems: string[] = [];
		for (const [name, read] of [
			["title", title],
			["description", description],
		] as const) {
			const seen = new Map<string, string>();
			for (const { loc, html } of pages) {
				const value = read(html);
				const first = seen.get(value);
				if (first) {
					problems.push(`${loc}: same ${name} as ${first}`);
				} else {
					seen.set(value, loc);
				}
			}
		}
		check(problems);
	});

	it.each(pages.map(({ loc, html }) => [loc, html]))(
		"%s has the tags search and social cards read",
		(loc, html) => {
			const problems: string[] = [];
			const fail = (problem: string) => problems.push(`${loc}: ${problem}`);

			if (!/<html[^>]*\slang="en"/.test(html)) fail('no <html lang="en">');

			const pageTitle = title(html);
			if (!pageTitle) fail("no title");
			if (pageTitle.length > 60) {
				fail(`title is ${pageTitle.length} characters`);
			}

			const length = description(html).length;
			if (length < 70 || length > 160) {
				fail(`description is ${length} characters`);
			}

			const headings = html.match(/<h1[\s>]/g)?.length ?? 0;
			if (headings !== 1) fail(`${headings} <h1> elements`);

			const canonical = tags(html, "link").filter(
				(tag) => tag.rel === "canonical",
			);
			if (canonical.length !== 1 || canonical[0]!.href !== loc) {
				fail(`canonical is ${canonical.map((tag) => tag.href).join(", ")}`);
			}

			for (const key of [
				"og:title",
				"og:description",
				"og:type",
				"twitter:title",
				"twitter:description",
				"twitter:image",
			]) {
				if (!meta(html, key)[0]) fail(`no ${key}`);
			}
			if (meta(html, "og:url")[0] !== loc) {
				fail(`og:url is ${meta(html, "og:url")[0]}`);
			}
			if (meta(html, "twitter:card")[0] !== "summary_large_image") {
				fail(`twitter:card is ${meta(html, "twitter:card")[0]}`);
			}

			const image = meta(html, "og:image")[0] ?? "";
			if (!image.startsWith(`${SITE}/`)) {
				fail(`og:image is ${image || "missing"}`);
			} else {
				if (
					meta(html, "og:image:width")[0] !== "1200" ||
					meta(html, "og:image:height")[0] !== "630"
				) {
					fail("og:image is not declared 1200×630");
				}
				const file = join(OUTPUT, decodeURIComponent(new URL(image).pathname));
				if (!existsSync(file)) {
					fail(`${image} is not in the output`);
				} else {
					const size = readPngSize(file);
					if (size?.width !== 1200 || size.height !== 630) {
						fail(`${image} is not a 1200×630 PNG`);
					}
				}
			}

			check(problems);
		},
	);
});

describe("structured data", () => {
	it.each(pages.map(({ loc, html }) => [loc, html]))(
		"%s has JSON-LD that parses and fits the page",
		(loc, html) => {
			const problems: string[] = [];
			const fail = (problem: string) => problems.push(`${loc}: ${problem}`);

			const blocks = jsonLd(html);
			for (const block of blocks) {
				if (block instanceof Error) fail(`JSON-LD: ${block.message}`);
			}
			const found = nodes(blocks);
			const present = types(found);

			const path = new URL(loc).pathname;
			const expected =
				path === "/"
					? ["WebSite", "Organization", "SoftwareSourceCode"]
					: path.startsWith("/docs/")
						? ["TechArticle"]
						: [];
			for (const type of expected) {
				if (!present.includes(type)) fail(`no ${type}`);
			}

			for (const node of found.filter(
				(node) => node["@type"] === "BreadcrumbList",
			)) {
				const items = (node.itemListElement ?? []) as Node[];
				for (const item of items) {
					const url = item.item as string | undefined;
					if (!url || !locs.has(url)) {
						fail(`breadcrumb ${item.name} links ${url}, not a sitemap URL`);
					}
				}
			}

			check(problems);
		},
	);
});

describe("robots.txt", () => {
	const robots = read("robots.txt");
	const agents = [...robots.matchAll(/^user-agent:\s*(.+?)\s*$/gim)].map(
		([, agent]) => agent!,
	);

	it("points crawlers at the sitemap on the production host", () => {
		expect(robots).toMatch(new RegExp(`^Sitemap: ${SITE}/sitemap\\.xml$`, "m"));
	});

	it("has one group for every crawler", () => {
		expect(agents.filter((agent) => agent === "*")).toHaveLength(1);
	});

	it.each(AI_CRAWLERS)("has a group for %s", (crawler) => {
		expect(agents).toContain(crawler);
	});

	it("blocks no crawler from the site", () => {
		expect(robots).not.toMatch(/^disallow:\s*\/\s*$/im);
	});
});

describe("llms.txt", () => {
	const llms = read("llms.txt");

	it("opens with the title and the summary", () => {
		const [first, ...rest] = llms.split("\n").filter((line) => line.trim());
		expect(first).toMatch(/^# \S/);
		expect(rest[0]).toMatch(/^> \S/);
	});

	it("links the Markdown copy of every docs page on the production host", () => {
		const docs = [...locs].filter((loc) => loc.startsWith(`${SITE}/docs/`));
		expect(docs.length).toBeGreaterThan(0);
		check(
			docs
				.map((loc) => `${SITE}/raw${new URL(loc).pathname}.md`)
				.filter((link) => !llms.includes(`(${link})`))
				.map((link) => `llms.txt: no link to ${link}`),
		);
	});
});

describe("404 page", () => {
	it("is in the output", () => {
		expect(existsSync(join(OUTPUT, "404.html"))).toBe(true);
	});
});
