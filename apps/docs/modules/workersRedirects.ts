import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { defineNuxtModule } from "@nuxt/kit";

/** Removes the rules that answer with a 404, and keeps the rest in order. */
export function dropNotFoundRedirects(redirects: string): string {
	return redirects
		.split("\n")
		.filter((line) => line.trim().split(/\s+/)[2] !== "404")
		.join("\n");
}

/**
 * The rules for the Worker's hosts, which `_headers` must end with. Cloudflare
 * stores the rules keyed by their URL and applies them in the keys' sorted
 * order, not in file order (only `wrangler dev` keeps file order). Every path
 * rule, like Nitro's `/raw/*`, starts with `/`, which sorts before `h`, so it
 * runs before every host rule. Keeping the host rules last, and in sorted
 * order, makes the file's order the order Cloudflare applies. `! X-Robots-Tag`
 * removes only what the rules before it added, so on each host:
 *
 * - `<preview>.styleframe.dev`, a custom-domain Preview with one label, like
 *   `<branch>.styleframe.dev` or `<deployment>.styleframe.dev`, sends
 *   `noindex` on every path. Cloudflare adds it to `workers.dev` Previews
 *   itself, but not to custom-domain ones.
 * - Every `workers.dev` host, like a PR's Preview URL and each deployment's
 *   version URL, `main`'s too, sends `noindex` on every path.
 * - `styleframe.dev`, production, drops every `X-Robots-Tag` the path rules
 *   added, as a guard: its pages must never send `noindex`. Then its `/raw/`
 *   Markdown copies get `noindex` again, after the detach.
 * - `www.styleframe.dev` matches the Preview rule, so it's detached the same
 *   way, with `noindex` again on `/raw/`. It redirects to the apex before the
 *   Worker runs, so this only matters if it ever serves the site.
 *
 * A host placeholder matches up to a `.`, so the apex matches no Preview rule.
 * A new production host on this Worker, like `docs.styleframe.dev`, needs a
 * detach and a `/raw/` rule of its own here.
 * https://developers.cloudflare.com/workers/static-assets/headers/
 */
export const HOST_RULES = [
	"https://:preview.styleframe.dev/*",
	"  X-Robots-Tag: noindex",
	"",
	"https://:version.:subdomain.workers.dev/*",
	"  X-Robots-Tag: noindex",
	"",
	"https://styleframe.dev/*",
	"  ! X-Robots-Tag",
	"",
	"https://styleframe.dev/raw/*",
	"  X-Robots-Tag: noindex",
	"",
	"https://www.styleframe.dev/*",
	"  ! X-Robots-Tag",
	"",
	"https://www.styleframe.dev/raw/*",
	"  X-Robots-Tag: noindex",
].join("\n");

/** Cloudflare reads at most 100 rules and drops the rest without failing. */
export const MAX_HEADER_RULES = 100;

/** Counts the rules in a `_headers` file: each starts with a path or a URL. */
export function countHeaderRules(headers: string): number {
	return headers.split("\n").filter((line) => /^(\S+:\/\/|\/)/.test(line.trim())).length;
}

/**
 * Puts the host rules at the end of `_headers`, once. robots.txt never blocks
 * these hosts, since a crawler that may not fetch a page can't read its
 * `noindex`, and can still index it from links. Throws when the file would
 * have more rules than Cloudflare reads, since the host rules come last and
 * would be the ones dropped.
 */
export function addHostRules(headers: string): string {
	const rest = headers.trim();
	if (rest.endsWith(HOST_RULES)) {
		return headers;
	}
	const result = rest ? `${rest}\n\n${HOST_RULES}\n` : `${HOST_RULES}\n`;
	const rules = countHeaderRules(result);
	if (rules > MAX_HEADER_RULES) {
		throw new Error(
			`[workers-redirects] _headers has ${rules} rules, and Cloudflare reads only the first ${MAX_HEADER_RULES}: the host rules at its end would be dropped.`,
		);
	}
	return result;
}

/**
 * Makes the Cloudflare build's `_redirects` one that Workers accepts. Nitro's
 * cloudflare-pages-static preset ends it with `/* /404.html 404`, a fallback
 * Pages takes and Workers static assets reject: they only redirect, so the
 * upload of the whole Worker fails. Workers serve 404.html for unknown routes
 * already (`not_found_handling` in wrangler.jsonc). Then puts the host rules
 * at the end of `_headers`, which Nitro writes from `routeRules` and so with
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
					await writeFile(redirectsFile, dropNotFoundRedirects(redirects), "utf8");
				}

				const headersFile = join(nitro.options.output.dir, "_headers");
				const headers = existsSync(headersFile) ? await readFile(headersFile, "utf8") : "";
				await writeFile(headersFile, addHostRules(headers), "utf8");
			});
		});
	},
});
