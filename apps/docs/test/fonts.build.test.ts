import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * The UXFront pages paint their text in metric-matched fallbacks, and
 * @uxfront/layer-ui's critical-path plugin loads the web fonts after the
 * first paint. It only moves the `@font-face` rules whose files sit under
 * `/_fonts/`, so a @nuxt/fonts that writes them elsewhere, like 1.x's
 * `/_nuxt/fonts/`, puts them back in the head.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

const read = (page: string) => {
	const file = [`${page}.html`, `${page}/index.html`]
		.map((path) => join(OUTPUT, path))
		.find((path) => existsSync(path));
	return file ? readFileSync(file, "utf8") : "";
};

// A web font's `@font-face` rule, wherever @nuxt/fonts writes its files.
const WEB_FONT_FACE = /@font-face\{[^}]*url\([^)]*\/(?:_nuxt\/)?_?fonts\/[^}]*\}/g;

describe("web fonts", () => {
	it.each([
		"index",
		"figma",
		"pricing",
		"pro",
		"scanner",
		"cookies",
		"license",
		"privacy",
		"terms",
	])("/%s loads its web fonts after the first paint", (page) => {
		const html = read(page);
		const head = html.slice(0, html.indexOf("</head>"));
		expect(head).not.toBe("");
		const styles = [...head.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(
			(match) => match[1],
		);
		expect(styles.join("").match(WEB_FONT_FACE) ?? []).toEqual([]);
		const loader =
			html.match(
				/<script>\s*\(function \(entry, preloads, stylesheets, fonts\)[\s\S]*?<\/script>/,
			)?.[0] ?? "";
		expect(loader.match(WEB_FONT_FACE)?.length ?? 0).toBeGreaterThan(0);
	});
});
