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
 * Makes the Cloudflare build's `_redirects` one that Workers accepts. Nitro's
 * cloudflare-pages-static preset ends it with `/* /404.html 404`, a fallback
 * Pages takes and Workers static assets reject: they only redirect, so the
 * upload of the whole Worker fails. Workers serve 404.html for unknown routes
 * already (`not_found_handling` in wrangler.jsonc).
 */
export default defineNuxtModule({
	meta: { name: "workers-redirects" },
	setup(_options, nuxt) {
		nuxt.hook("nitro:init", (nitro) => {
			if (nitro.options.dev || !nitro.options.preset.includes("cloudflare")) {
				return;
			}

			// Registered after the preset's own `compiled` hook, which writes the file.
			nitro.hooks.hook("compiled", async () => {
				const file = join(nitro.options.output.dir, "_redirects");
				if (!existsSync(file)) {
					return;
				}

				const redirects = await readFile(file, "utf8");
				await writeFile(file, dropNotFoundRedirects(redirects), "utf8");
			});
		});
	},
});
