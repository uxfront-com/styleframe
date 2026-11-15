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
 * The rules for the Worker's hosts, which `_headers` must start with. Cloudflare
 * applies its rules in file order, and `! X-Robots-Tag` removes only what an
 * earlier rule added, so the order is the point:
 *
 * 1. Every `workers.dev` host, like a PR's Preview URL and each deployment's
 *    version URL, `main`'s too, gets `noindex`.
 * 2. Every custom-domain Preview, a one-label host like
 *    `<branch>.styleframe.dev` or `<deployment>.styleframe.dev`, gets
 *    `noindex`. Cloudflare adds it to `workers.dev` Previews itself, but not to
 *    custom-domain ones.
 * 3. `www.styleframe.dev` matches the rule above, so it's detached again: until
 *    it redirects to the apex, it may serve the site.
 * 4. The apex is detached too, as a guard: the production host must never
 *    send `noindex`.
 *
 * Nitro's path rules follow, so `/raw/*` adds `noindex` again on every host.
 * A host placeholder matches up to a `.`. A new production host on this
 * Worker, like `docs.styleframe.dev`, needs a detach of its own here.
 * https://developers.cloudflare.com/workers/static-assets/headers/
 */
export const HOST_RULES = [
	"https://:version.:subdomain.workers.dev/*",
	"  X-Robots-Tag: noindex",
	"",
	"https://:preview.styleframe.dev/*",
	"  X-Robots-Tag: noindex",
	"",
	"https://www.styleframe.dev/*",
	"  ! X-Robots-Tag",
	"",
	"https://styleframe.dev/*",
	"  ! X-Robots-Tag",
].join("\n");

/**
 * Puts the host rules at the start of `_headers`, once. robots.txt never blocks
 * these hosts, since a crawler that may not fetch a page can't read its
 * `noindex`, and can still index it from links.
 */
export function addHostRules(headers: string): string {
	if (headers.startsWith(HOST_RULES)) {
		return headers;
	}
	const rest = headers.trim();
	return rest ? `${HOST_RULES}\n${rest}\n` : `${HOST_RULES}\n`;
}

/**
 * Makes the Cloudflare build's `_redirects` one that Workers accepts. Nitro's
 * cloudflare-pages-static preset ends it with `/* /404.html 404`, a fallback
 * Pages takes and Workers static assets reject: they only redirect, so the
 * upload of the whole Worker fails. Workers serve 404.html for unknown routes
 * already (`not_found_handling` in wrangler.jsonc). Then puts the host rules
 * at the start of `_headers`, which Nitro writes from `routeRules` and so with
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
				await writeFile(headersFile, addHostRules(headers), "utf8");
			});
		});
	},
});
