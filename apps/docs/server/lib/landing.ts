import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { H3Event } from "h3";

// The fields read below, as in server/lib/docs.ts.
interface LandingPage {
	stem: string;
	extension: string;
	title: string;
	description: string;
}

/**
 * Finds the homepage or product page served at `path`, like `/pro`, and reads
 * its Markdown from content/landing/. Those pages are Vue pages, and the
 * Markdown says what they say, for agents. The legal pages, in the same
 * collection but in content/legal/, are left to Nuxt Content's route, which
 * writes them as on main. A page's `stem` is its file name: the collection's
 * sources mount both folders at the root.
 */
export async function readLandingPage(event: H3Event, path: string) {
	const page = (await queryCollection(event, "landing" as never)
		.path(path)
		.first()) as LandingPage | null;
	if (!page) return;

	const file = join(
		process.cwd(),
		"content",
		"landing",
		`${page.stem}.${page.extension}`,
	);
	if (!existsSync(file)) return;

	return { page, source: await readFile(file, "utf8") };
}
