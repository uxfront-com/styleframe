import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Every prerendered page has a social card, and the card is in the static
 * output as a 1200×630 PNG, the size crawlers crop to.
 *
 * It reads each page's `og:image`, so it covers every page the build
 * prerenders, whichever renders its card: Docus for the docs, the changelog's
 * own pages, and any page added later. A renderer that fails still lets the
 * prerender exit 0, and leaves the meta tag pointing at a file that isn't
 * there, so the file is what's checked. Redirect pages, `200.html` and
 * `404.html` have no card.
 *
 * Requires a prior build. Excluded from the default `pnpm test` run (see
 * `vitest.config.ts`); runs via `pnpm --filter @styleframe/docs test:build` in
 * the docs build job, against the output that job just produced.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

const PNG_SIGNATURE = Buffer.from([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function findPages(): string[] {
	if (!existsSync(OUTPUT)) {
		return [];
	}

	return readdirSync(OUTPUT, { withFileTypes: true, recursive: true })
		.filter(
			(entry) =>
				entry.isFile() &&
				entry.name.endsWith(".html") &&
				!(
					entry.parentPath === OUTPUT &&
					["200.html", "404.html"].includes(entry.name)
				),
		)
		.map((entry) => join(entry.parentPath, entry.name))
		.filter(
			(file) => !readFileSync(file, "utf8").includes('http-equiv="refresh"'),
		)
		.sort();
}

function readOgImage(html: string): string | undefined {
	const tag = html.match(/<meta[^>]*property="og:image"[^>]*>/)?.[0];
	return tag?.match(/content="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");
}

/** The file an absolute or root-relative image URL points at in the output. */
function toOutputFile(url: string): string {
	return join(OUTPUT, decodeURIComponent(new URL(url, "http://x").pathname));
}

/** Read width and height out of a PNG's IHDR chunk, which is always first. */
function readPngSize(file: string): { width: number; height: number } {
	const header = readFileSync(file).subarray(0, 24);

	expect(
		header.subarray(0, 8).equals(PNG_SIGNATURE),
		`${file} is not a PNG`,
	).toBe(true);

	return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

const pages = findPages();

describe("social cards", () => {
	it("finds the prerendered pages", () => {
		expect(
			pages.length,
			`no pages in ${OUTPUT}: run the build first`,
		).toBeGreaterThan(0);
	});

	it.each(pages.map((file) => [relative(OUTPUT, file), file]))(
		"%s has a 1200×630 PNG card",
		(_name, file) => {
			const image = readOgImage(readFileSync(file, "utf8"));
			expect(image, "no og:image").toBeDefined();

			const card = toOutputFile(image!);
			expect(existsSync(card), `${image} is not in the output`).toBe(true);
			expect(readPngSize(card)).toEqual({ width: 1200, height: 630 });
		},
	);
});
