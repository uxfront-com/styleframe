import { defineNuxtModule, createResolver } from "@nuxt/kit";
import { readdirSync } from "node:fs";

/**
 * Prerenders `/raw/changelog/<version>.md` for every changelog entry. Nuxt
 * Content's raw route answers them, and `llms.txt` links them, but nothing on
 * the site does, so the crawler never reaches them. On Vercel, Docus also
 * sends `curl` and `Accept: text/markdown` requests for `/changelog/<version>`
 * to these files, which a static site has to have on disk.
 */
export default defineNuxtModule({
	meta: { name: "raw-changelog" },
	setup(_options, nuxt) {
		const { resolve } = createResolver(nuxt.options.rootDir);
		const routes = readdirSync(resolve("content/changelog"))
			.filter((file) => file.endsWith(".md"))
			.map((file) => `/raw/changelog/${file}`);

		nuxt.hook("nitro:config", (config) => {
			config.prerender ||= {};
			config.prerender.routes = [...(config.prerender.routes ?? []), ...routes];
		});
	},
});
