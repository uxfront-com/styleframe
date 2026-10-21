import { defineNuxtModule } from "@nuxt/kit";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/** The longest `src` Vercel's Build Output API accepts in a route. */
export const VERCEL_ROUTE_SRC_LIMIT = 4096;

interface VercelRoute {
	src?: string;
	[key: string]: unknown;
}

/**
 * Splits each route whose `src` is an alternation longer than Vercel accepts,
 * like `^(/a|/b|…)$`, into routes over parts of it, each with the route's other
 * fields. Every other route keeps its place.
 */
export function splitLongRoutes<Route extends VercelRoute>(
	routes: Route[],
): Route[] {
	return routes.flatMap((route) => {
		if (!route.src || route.src.length <= VERCEL_ROUTE_SRC_LIMIT) {
			return [route];
		}

		const alternation = route.src.match(/^\^\(([^()]*)\)\$$/)?.[1];
		if (!alternation) {
			throw new Error(
				`A Vercel route's src is longer than ${VERCEL_ROUTE_SRC_LIMIT} characters and isn't an alternation to split: ${route.src.slice(0, 80)}…`,
			);
		}

		const groups: string[][] = [[]];
		for (const path of alternation.split("|")) {
			const group = groups.at(-1)!;
			if (`^(${[...group, path].join("|")})$`.length > VERCEL_ROUTE_SRC_LIMIT) {
				groups.push([path]);
			} else {
				group.push(path);
			}
		}

		return groups.map((group) => ({ ...route, src: `^(${group.join("|")})$` }));
	});
}

/**
 * Keeps the Vercel build's routes under Vercel's limit. Docus's
 * vercel-markdown-rewrite module writes one `vary` route over every page that
 * also answers in Markdown, and with every docs page in it, its `src` is too
 * long: Vercel rejects the whole build. This runs after Docus has written it.
 */
export default defineNuxtModule({
	meta: { name: "vercel-route-limit" },
	setup(_options, nuxt) {
		// Registered once every module is set up, so its `compiled` hook runs after
		// the one Docus registers.
		nuxt.hook("modules:done", () => {
			nuxt.hook("nitro:init", (nitro) => {
				if (nitro.options.dev || !nitro.options.preset.includes("vercel")) {
					return;
				}

				nitro.hooks.hook("compiled", async () => {
					const file = join(nitro.options.output.dir, "config.json");
					const config = JSON.parse(await readFile(file, "utf8"));
					config.routes = splitLongRoutes(config.routes);
					await writeFile(file, JSON.stringify(config, null, 2), "utf8");
				});
			});
		});
	},
});
