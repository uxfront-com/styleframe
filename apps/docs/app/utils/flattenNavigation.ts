import type { ContentNavigationItem } from "@nuxt/content";

/**
 * Turns false groups back into pages. Nuxt Content reads a file whose name
 * contains "index", like `13.z-index.md`, as its folder's index page, and makes
 * it a group holding only itself. This replaces each group with a single child
 * at the group's own path by that child.
 */
export function flattenNavigation(
	items: ContentNavigationItem[],
): ContentNavigationItem[] {
	return items.map((item) => {
		if (item.children?.length === 1 && item.children[0]?.path === item.path) {
			const { children: _, ...parent } = item;
			return { ...parent, ...item.children[0], children: undefined };
		}

		if (item.children?.length) {
			return { ...item, children: flattenNavigation(item.children) };
		}

		return item;
	});
}
