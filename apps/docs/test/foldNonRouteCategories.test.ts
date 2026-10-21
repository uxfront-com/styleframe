import type { ContentNavigationItem } from "@nuxt/content";
import { describe, expect, it } from "vitest";
import { foldNonRouteCategories } from "../app/utils/foldNonRouteCategories";

const page = (stem: string, path: string): ContentNavigationItem => ({
	title: path.split("/").pop()!,
	path,
	stem,
});

describe("foldNonRouteCategories", () => {
	it("groups pages by their category folder, after the pages outside one", () => {
		const [components] = foldNonRouteCategories(
			[
				{
					title: "Components",
					path: "/docs/theme/components",
					stem: "docs/theme/components/00.index",
					children: [
						page("docs/theme/components/00.index", "/docs/theme/components"),
						page(
							"docs/theme/components/03.navigation/00.breadcrumb",
							"/docs/theme/components/breadcrumb",
						),
						page(
							"docs/theme/components/02.actions/00.button",
							"/docs/theme/components/button",
						),
					],
				},
			],
			{
				"docs/theme/components/02.actions": { title: "Actions", order: 2 },
				"docs/theme/components/03.navigation": {
					title: "Navigation",
					icon: "i-lucide-navigation",
					defaultOpen: true,
					order: 3,
				},
			},
		);

		expect(
			components!.children!.map(({ title, path, page, children, ...rest }) => ({
				title,
				path,
				page,
				icon: rest.icon,
				pages: children?.map((child) => child.path),
			})),
		).toEqual([
			{
				title: "components",
				path: "/docs/theme/components",
				page: undefined,
				icon: undefined,
				pages: undefined,
			},
			{
				title: "Actions",
				path: "/docs/theme/components/actions",
				page: false,
				icon: undefined,
				pages: ["/docs/theme/components/button"],
			},
			{
				title: "Navigation",
				path: "/docs/theme/components/navigation",
				page: false,
				icon: "i-lucide-navigation",
				pages: ["/docs/theme/components/breadcrumb"],
			},
		]);
	});

	it("leaves a tree with no category folders as it is", () => {
		const tree = [
			{
				title: "API Reference",
				path: "/docs/api",
				children: [page("docs/api/02.variables", "/docs/api/variables")],
			},
		];
		expect(foldNonRouteCategories(tree, {})).toEqual(tree);
	});
});
