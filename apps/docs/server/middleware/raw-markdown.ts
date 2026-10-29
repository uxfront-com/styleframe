import { readDocsPage } from "../lib/docs";
import { readLandingPage } from "../lib/landing";
import { rawPage } from "../lib/raw";

/**
 * Serves `/raw/<path>.md`, the markdown copy of a docs page, from the page's own
 * source file. Nuxt Content's route rebuilds the markdown from the parsed page
 * and writes every table as HTML, unescaped: a `<button>` in a table cell comes
 * out as a tag, and the file doubles in length. Agents read these files (so does
 * "Copy page"), so they get the markdown as written: the title and description,
 * then the page without its frontmatter (see rawPage in server/lib/raw.ts).
 *
 * The homepage and the product pages get theirs from content/landing/ the same
 * way, at `/raw/index.md`, `/raw/pro.md` and so on (see readLandingPage).
 *
 * Runs before Nuxt Content's route, which still answers for anything else.
 */
export default defineEventHandler(async (event) => {
	const match = event.path.match(/^\/raw(\/.+?)(?:\/index)?\.md$/);
	if (!match?.[1]) return;

	const path = match[1] === "/index" ? "/" : match[1];
	const found =
		(await readDocsPage(event, path)) ?? (await readLandingPage(event, path));
	if (!found) return;

	setHeader(event, "Content-Type", "text/markdown; charset=utf-8");
	return rawPage(found.page, found.source);
});
