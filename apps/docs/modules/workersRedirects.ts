import { defineNuxtModule } from "@nuxt/kit";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/** Removes the rules that answer with a 404, and keeps the rest in order. */
export function dropNotFoundRedirects(redirects: string): string {
	return redirects
		.split("\n")
		.filter((line) => line.trim().split(/\s+/)[2] !== "404")
		.join("\n");
}

/**
 * Every `workers.dev` host of the Worker: its preview URLs, like a PR's, and
 * the version URL of each build, `main`'s too. The rule's placeholders each
 * match up to a `.`, so it never matches www.styleframe.dev.
 * https://developers.cloudflare.com/workers/static-assets/headers/
 */
export const PREVIEW_HOSTS_RULE = [
	"https://:version.:subdomain.workers.dev/*",
	"  X-Robots-Tag: noindex",
].join("\n");

/**
 * Adds the rule that keeps the preview hosts out of search results, once.
 * Cloudflare already sends `noindex` on preview URLs: this is the site's own
 * guarantee. robots.txt never blocks these hosts, since a crawler that may not
 * fetch a page can't read its `noindex`, and can still index it from links.
 */
export function addPreviewHostsRule(headers: string): string {
	if (headers.includes(PREVIEW_HOSTS_RULE)) {
		return headers;
	}
	return `${headers.trimEnd()}\n${PREVIEW_HOSTS_RULE}\n`.trimStart();
}

/**
 * Makes the Cloudflare build's `_redirects` one that Workers accepts. Nitro's
 * cloudflare-pages-static preset ends it with `/* /404.html 404`, a fallback
 * Pages takes and Workers static assets reject: they only redirect, so the
 * upload of the whole Worker fails. Workers serve 404.html for unknown routes
 * already (`not_found_handling` in wrangler.jsonc). Then adds the preview
 * hosts' rule to `_headers`, which Nitro writes from `routeRules` and so with
 * paths only.
 */
export default defineNuxtModule({
	meta: { name: "workers-redirects" },
	setup(_options, nuxt) {
		nuxt.hook("nitro:init", (nitro) => {
			if (nitro.options.dev || !nitro.options.preset.includes("cloudflare")) {
				return;
			}

			// Registered after the preset's own `compiled` hook, which writes the files.
			nitro.hooks.hook("compiled", async () => {
				const redirectsFile = join(nitro.options.output.dir, "_redirects");
				if (existsSync(redirectsFile)) {
					const redirects = await readFile(redirectsFile, "utf8");
					await writeFile(
						redirectsFile,
						dropNotFoundRedirects(redirects),
						"utf8",
					);
				}

				const headersFile = join(nitro.options.output.dir, "_headers");
				const headers = existsSync(headersFile)
					? await readFile(headersFile, "utf8")
					: "";
				await writeFile(headersFile, addPreviewHostsRule(headers), "utf8");
			});
		});
	},
});
