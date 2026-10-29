import type { ContentNavigationItem } from "@nuxt/content";
import type { NonRouteCategoryMeta } from "../types/non-route-categories";

/**
 * Groups the sidebar by the category folders whose names aren't in their pages'
 * URLs (`route: false` in their `.navigation.yml`). Nuxt Content builds the
 * navigation from the URLs, so it lists those pages straight under their
 * section, like Components. This puts each one back under a group for its
 * folder, matched by its `stem`, which keeps the folder, and orders the groups
 * by the folders' numbers, after the pages that have none.
 */
export function foldNonRouteCategories(
	items: ContentNavigationItem[],
	categories: Record<string, NonRouteCategoryMeta>,
): ContentNavigationItem[] {
	return items.map((node) => {
		if (!node.children?.length) {
			return node;
		}
		const passthrough: ContentNavigationItem[] = [];
		const groups = new Map<
			string,
			{ meta: NonRouteCategoryMeta; children: ContentNavigationItem[] }
		>();
		for (const child of node.children) {
			const dir = child.stem
				? child.stem.split("/").slice(0, -1).join("/")
				: "";
			const meta = categories[dir];
			if (meta && child.page !== false) {
				const group = groups.get(dir) ?? { meta, children: [] };
				group.children.push(child);
				groups.set(dir, group);
			} else {
				passthrough.push(foldNonRouteCategories([child], categories)[0]!);
			}
		}
		const groupNodes = [...groups.entries()]
			.sort(
				([, a], [, b]) =>
					a.meta.order - b.meta.order ||
					a.meta.title.localeCompare(b.meta.title),
			)
			.map(([dir, { meta, children }]) => ({
				title: meta.title,
				// A group isn't a page, but the navigation keys its items by path.
				path: `${node.path}/${dir
					.split("/")
					.pop()!
					.replace(/^\d+\./, "")}`,
				...(meta.icon ? { icon: meta.icon } : {}),
				...(meta.defaultOpen !== undefined
					? { defaultOpen: meta.defaultOpen }
					: {}),
				page: false as const,
				children,
			}));
		return { ...node, children: [...passthrough, ...groupNodes] };
	});
}
