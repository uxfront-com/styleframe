import { describe, expect, it } from "vitest";
import { flattenNavigation } from "../app/utils/flattenNavigation";

describe("flattenNavigation", () => {
	it("turns a group holding only itself back into a page", () => {
		expect(
			flattenNavigation([
				{
					title: "Design Tokens",
					path: "/docs/theme/design-tokens",
					children: [
						{
							title: "Z-Index",
							path: "/docs/theme/design-tokens/z-index",
							stem: "docs/3.theme/03.design-tokens/13.z-index",
							children: [
								{
									title: "Z-Index",
									path: "/docs/theme/design-tokens/z-index",
									stem: "docs/3.theme/03.design-tokens/13.z-index",
								},
							],
						},
					],
				},
			]),
		).toEqual([
			{
				title: "Design Tokens",
				path: "/docs/theme/design-tokens",
				children: [
					{
						title: "Z-Index",
						path: "/docs/theme/design-tokens/z-index",
						stem: "docs/3.theme/03.design-tokens/13.z-index",
						children: undefined,
					},
				],
			},
		]);
	});

	it("keeps a folder whose index page is one of several children", () => {
		const tree = [
			{
				title: "Fluid Design",
				path: "/docs/theme/design-tokens/fluid-design",
				children: [
					{
						title: "Fluid Design",
						path: "/docs/theme/design-tokens/fluid-design",
					},
					{
						title: "Viewport",
						path: "/docs/theme/design-tokens/fluid-design/viewport",
					},
				],
			},
		];
		expect(flattenNavigation(tree)).toEqual(tree);
	});
});
