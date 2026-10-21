import { defineNuxtModule, createResolver } from "@nuxt/kit";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { defu } from "defu";
import { docsFolderPrefix } from "../app/constants/sections";
import type { NonRouteCategoryMeta } from "../app/types/non-route-categories";

/** Minimal reader for the flat `key: value` `.navigation.yml` files we author. */
function readNavigationConfig(text: string): Record<string, string | boolean> {
	const cfg: Record<string, string | boolean> = {};
	for (const line of text.split(/\r?\n/)) {
		const match = line.match(/^([\w-]+):\s*(.*)$/);
		if (!match) continue;
		const value = match[2]!.trim().replace(/^["']|["']$/g, "");
		cfg[match[1]!] =
			value === "true" ? true : value === "false" ? false : value;
	}
	return cfg;
}

/**
 * Convert a filesystem-relative category dir ("docs/05.components/02.actions")
 * to the stem-structured dir nav items carry ("docs/theme/components/02.actions").
 */
function toStemDir(fsDir: string): string | undefined {
	const parts = fsDir.split("/");
	if (parts[0] !== "docs" || parts.length < 3) return undefined;
	const prefix = docsFolderPrefix(parts[1]!)?.slice(1);
	return prefix ? [prefix, ...parts.slice(2)].join("/") : undefined;
}

/**
 * Makes category folders "non-route": a folder whose `.navigation.yml` sets
 * `route: false` still groups its pages in the sidebar, but its name is dropped
 * from the page URL (e.g. `/docs/theme/components/actions/button` -> `/docs/theme/components/button`).
 *
 * The non-route segment is removed from each page's `path` at parse time, and the
 * category metadata is published to `appConfig` so the client can rebuild the
 * groups (see `app/utils/foldNonRouteCategories.ts`).
 */
export default defineNuxtModule({
	meta: { name: "non-route-categories" },
	setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.url);
		const contentRoot = resolve("../content");

		// Scan every `.navigation.yml` for `route: false`.
		const nonRouteDirs = new Set<string>(); // e.g. "docs/05.components/02.actions"
		const categories: Record<string, NonRouteCategoryMeta> = {};
		const walk = (abs: string) => {
			for (const entry of readdirSync(abs, { withFileTypes: true })) {
				if (entry.isDirectory()) {
					walk(join(abs, entry.name));
				} else if (entry.name === ".navigation.yml") {
					const cfg = readNavigationConfig(
						readFileSync(join(abs, entry.name), "utf8"),
					);
					if (cfg.route === false) {
						const dir = relative(contentRoot, abs).replaceAll("\\", "/");
						const last = dir.split("/").pop() ?? "";
						nonRouteDirs.add(dir); // filesystem key, used by the parse hook
						const stemDir = toStemDir(dir); // stem key, used by the client fold
						if (stemDir) {
							categories[stemDir] = {
								title: String(cfg.title ?? last.replace(/^\d+\./, "")),
								icon: cfg.icon as string | false | undefined,
								defaultOpen: cfg.defaultOpen as boolean | undefined,
								order: Number(last.match(/^(\d+)\./)?.[1] ?? 0),
							};
						}
					}
				}
			}
		};
		walk(resolve("../content/docs"));

		// Expose metadata to the client for regrouping. Nuxt serializes
		// `nuxt.options.appConfig` into `#build/app.config.mjs`; defu merges safely.
		nuxt.options.appConfig.nonRouteCategories = defu(
			nuxt.options.appConfig.nonRouteCategories,
			categories,
		);

		// Drop the non-route segment(s) from each page's URL. The folder is matched
		// from the real source path (`ctx.file.path`), since `content.stem` is
		// URL-structured (e.g. "docs/theme/components/02.actions/..") and would not
		// match the filesystem-relative keys collected above.
		nuxt.hook("content:file:afterParse", (ctx) => {
			const content = ctx.content as { path?: string };
			const file = ctx.file as { path?: string } | undefined;
			if (!content.path || !file?.path) {
				return;
			}
			// Source path relative to the content root, sans extension:
			// e.g. "docs/05.components/02.actions/00.button".
			const relParts = relative(contentRoot, file.path)
				.replaceAll("\\", "/")
				.replace(/\.[^/.]+$/, "")
				.split("/");
			// Never rewrite the folder config files themselves.
			if (relParts[relParts.length - 1] === ".navigation") {
				return;
			}
			// Distance-from-end of each non-route ancestor segment in the URL.
			const offsets: number[] = [];
			for (let i = relParts.length - 1; i > 0; i--) {
				if (nonRouteDirs.has(relParts.slice(0, i).join("/"))) {
					offsets.push(relParts.length - i);
				}
			}
			if (!offsets.length) {
				return;
			}
			const parts = content.path.split("/"); // leading "" kept
			const last = parts.length - 1;
			// Resolve to absolute indices and splice high -> low so earlier
			// removals don't shift later ones (correct for nested non-route dirs).
			for (const idx of offsets.map((o) => last - o).sort((a, b) => b - a)) {
				parts.splice(idx, 1);
			}
			content.path = parts.join("/");
		});
	},
});
