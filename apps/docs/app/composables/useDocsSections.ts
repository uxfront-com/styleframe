import type { ContentNavigationItem } from "@nuxt/content";

/** A tab below the header, and the pages its sidebar shows. */
export interface DocsSectionTab {
	label: string;
	icon: string;
	to: string;
	active: boolean;
	navigation: ContentNavigationItem[];
}

/** The first page in a navigation tree, depth first. */
function firstPagePath(
	items: ContentNavigationItem[] | undefined,
): string | undefined {
	for (const item of items ?? []) {
		if (item.page !== false && item.path) return item.path;
		const nested = firstPagePath(item.children);
		if (nested) return nested;
	}
	return undefined;
}

/**
 * The docs' sections, as tabs below the header, and the sidebar of the one the
 * reader is in. Docus makes a tab of each top-level folder of the navigation:
 * Getting Started, API Reference and Theme. Theme splits into its four
 * sub-sections here (`THEME_SUBSECTIONS`), each with its own sidebar, and the
 * sidebar groups pages by their category folders (`foldNonRouteCategories`)
 * and lists a page like Z-Index as a page, not a group (`flattenNavigation`).
 * The overrides of Docus's `AppHeaderBottom`, `DocsAsideLeftBody` and
 * `DocsAsideMobileBar` read them.
 */
export function useDocsSections() {
	const route = useRoute();
	const appConfig = useAppConfig();
	const navigation =
		inject<Ref<ContentNavigationItem[] | null | undefined>>("navigation");

	const isIn = (path: string) =>
		route.path === path || route.path.startsWith(`${path}/`);

	const sections = computed<DocsSectionTab[]>(() => {
		const tree = navigation?.value ?? [];
		return DOCS_SECTIONS.flatMap((section): DocsSectionTab[] => {
			const base = `/docs/${section.slug}`;
			const node = tree.find((item) => item.path === base);
			const children = node?.children ?? [];

			if (section.key === "theme") {
				const segment = themeSegmentFromPath(route.path) ?? "";
				return THEME_SUBSECTIONS.map((sub) => {
					const folders: readonly string[] = sub.folders;
					const groups = children.filter((group) =>
						folders.includes(themeSegmentFromPath(group.path) ?? ""),
					);
					return {
						label: sub.label,
						icon: sub.icon,
						to: firstPagePath(groups) ?? `${base}/${sub.folders[0]}`,
						active: isIn(base) && folders.includes(segment),
						navigation: groups,
					};
				});
			}

			return [
				{
					label: section.label,
					icon: section.icon,
					to: firstPagePath(children) ?? base,
					active: isIn(base),
					// The section's folder, so the sidebar opens with its title.
					navigation: node ? [{ ...node, children }] : [],
				},
			];
		});
	});

	const tabs = computed(() =>
		sections.value.map(({ navigation: _, ...tab }) => tab),
	);

	const currentSection = computed(() =>
		sections.value.find((section) => section.active),
	);

	const sidebarNavigation = computed(() =>
		flattenNavigation(
			foldNonRouteCategories(
				currentSection.value?.navigation ?? [],
				appConfig.nonRouteCategories ?? {},
			),
		),
	);

	return { tabs, currentSection, sidebarNavigation };
}
