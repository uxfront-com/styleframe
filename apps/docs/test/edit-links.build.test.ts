import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Every docs page's "Edit this page" link opens a file in the repository.
 * Docus builds the link from the page's `stem`, which carries the section in
 * front for the sidebar's order (see docsStem), so app/pages/[[lang]]/[...slug].vue
 * builds it from the file instead.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));
const CONTENT = fileURLToPath(new URL("../content", import.meta.url));

const EDIT_PREFIX =
	"https://github.com/uxfront-com/styleframe/edit/main/apps/docs/content/";

function editLinks(): [string, string][] {
	const docs = join(OUTPUT, "docs");
	if (!existsSync(docs)) {
		return [];
	}

	return readdirSync(docs, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
		.map((entry) => join(entry.parentPath, entry.name))
		.flatMap((file): [string, string][] => {
			const href = readFileSync(file, "utf8").match(
				/href="([^"]*\/edit\/[^"]*)"/,
			)?.[1];
			return href ? [[relative(OUTPUT, file), href]] : [];
		})
		.sort();
}

describe("Edit this page", () => {
	const links = editLinks();

	it("finds the docs pages' edit links in the build", () => {
		expect(links.length).toBeGreaterThan(100);
	});

	it.each(links)("%s links its file", (_page, href) => {
		expect(href.startsWith(EDIT_PREFIX)).toBe(true);
		expect(existsSync(join(CONTENT, href.slice(EDIT_PREFIX.length)))).toBe(
			true,
		);
	});
});
