import type { ContentNavigationItem } from "@nuxt/content";
import { existsSync, readFileSync } from "node:fs";
import { computed, ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	DOCS_SECTIONS,
	THEME_SUBSECTIONS,
	themeSegmentFromPath,
} from "../app/constants/sections";
import { flattenNavigation } from "../app/utils/flattenNavigation";
import { foldNonRouteCategories } from "../app/utils/foldNonRouteCategories";

/**
 * The docs header's menu (AppHeaderBody) lists the sections the tabs below
 * the header (AppHeaderBottom) show, from the same `useDocsSections()`,
 * wherever the tabs are hidden: the tabs show from Nuxt UI's `lg`, and the
 * menu only opens below it, so the menu's list has no breakpoint of its own.
 * Each section in the menu holds the tree its sidebar (DocsAsideLeftBody)
 * shows, rendered the same way. Above them, the menu keeps the header links
 * and Framework select of @uxfront/layer-docs, which also shows the links in
 * the header bar.
 */

const read = (name: string) =>
	readFileSync(
		new URL(`../app/components/${name}.vue`, import.meta.url),
		"utf8",
	);

// The function the variable `tabs` comes from.
const tabsSource = (source: string) =>
	source.match(/const \{ tabs \} = (\w+)\(\);/)?.[1];

// The props of a <UContentNavigation>, without the tree it shows and its name.
const contentNavProps = (source: string) =>
	(source.match(/<UContentNavigation\b([^>]*)\/>/)?.[1] ?? "")
		.split(/\s+/)
		.filter(
			(prop) =>
				prop &&
				!prop.startsWith(":navigation=") &&
				!prop.startsWith(":aria-label="),
		);

describe("the header's links", () => {
	const body = read("app/AppHeaderBody");

	// app.config.ts with Nuxt's auto-import in place.
	const appConfig = async () => {
		vi.stubGlobal("defineAppConfig", <T>(config: T) => config);
		const { default: config } = await import("../app/app.config");
		vi.unstubAllGlobals();
		return config;
	};

	it("are the layer's docsTheme.headerLinks, each marking the part of the site it stands for", async () => {
		const { docsTheme } = await appConfig();
		expect(docsTheme.headerLinks).toEqual([
			{
				label: "Docs",
				to: "/docs/getting-started/introduction",
				activeFor: "/docs",
			},
			{ label: "Changelog", to: "/changelog", activeFor: "/changelog" },
			{ label: "Log in", to: "https://app.styleframe.dev" },
		]);
	});

	it("show in the bar from the layer's own AppHeaderCTA", () => {
		expect(
			existsSync(
				new URL("../app/components/app/AppHeaderCTA.vue", import.meta.url),
			),
		).toBe(false);
	});

	it("start the menu below md, then the Framework select, then the sections", () => {
		const links = body.indexOf(
			'<AppHeaderLinks orientation="vertical" class="mb-4 -mx-2.5 md:hidden" />',
		);
		const framework = body.indexOf("<AppHeaderFramework />");
		const sections = body.indexOf('<nav aria-label="Sections"');
		expect(links).toBeGreaterThan(-1);
		expect(framework).toBeGreaterThan(links);
		expect(sections).toBeGreaterThan(framework);
	});
});

describe("the docs' sections", () => {
	const body = read("app/AppHeaderBody");

	it("come from useDocsSections() in the tabs and in the menu", () => {
		expect(tabsSource(read("app/AppHeaderBottom"))).toBe("useDocsSections");
		expect(body).toMatch(/const \{ sidebars \} = useDocsSections\(\);/);
	});

	it("show as tabs from lg, and in the menu at every width it opens", () => {
		expect(read("app/AppHeaderBottom")).toMatch(
			/<UContainer class="hidden lg:flex[^"]*">\s*<UNavigationMenu\b[^>]*:items="tabs"/,
		);
		const sections =
			body.match(
				/<nav aria-label="Sections"[^>]*>\s*<div\s+v-for="section in sidebars"[^>]*>/,
			)?.[0] ?? "";
		expect(sections).not.toBe("");
		expect(sections).not.toMatch(/\bhidden\b/);
	});

	it("link to their first page in the menu", () => {
		expect(body).toMatch(
			/<UButton\s+:to="section\.to"\s+:label="section\.label"\s+:icon="section\.icon"/,
		);
	});

	it("open in the menu on the reader's section only", () => {
		expect(body).toMatch(/<UCollapsible\b[^>]*:default-open="section\.active"/);
	});

	it("hold their sidebar's tree in the menu, rendered as the sidebar renders it", () => {
		const sidebar = read("docs/DocsAsideLeftBody");
		expect(body).toMatch(
			/<UContentNavigation\b[^>]*:navigation="section\.navigation"/,
		);
		expect(contentNavProps(body)).toEqual(contentNavProps(sidebar));
		expect(contentNavProps(body)).not.toEqual([]);
	});
});

describe("useDocsSections().sidebars", () => {
	const page = (path: string, stem: string): ContentNavigationItem => ({
		title: path.split("/").pop()!,
		path,
		stem,
	});

	// A navigation tree with every section, and Components' pages in their
	// category folders, as Nuxt Content builds it from the URLs.
	const navigation: ContentNavigationItem[] = [
		{
			title: "Getting Started",
			path: "/docs/getting-started",
			stem: "docs/1.getting-started",
			children: [
				page(
					"/docs/getting-started/introduction",
					"docs/1.getting-started/01.getting-started/01.introduction",
				),
			],
		},
		{
			title: "API",
			path: "/docs/api",
			stem: "docs/2.api",
			children: [page("/docs/api/variables", "docs/2.api/02.api/01.variables")],
		},
		{
			title: "Theme",
			path: "/docs/theme",
			stem: "docs/3.theme",
			children: [
				"design-tokens",
				"elements",
				"components",
				"utilities",
				"modifiers",
			].map((folder, index) => ({
				title: folder,
				path: `/docs/theme/${folder}`,
				stem: `docs/3.theme/0${index + 3}.${folder}`,
				children: [
					page(
						`/docs/theme/${folder}/overview`,
						`docs/3.theme/0${index + 3}.${folder}/00.index`,
					),
					page(
						`/docs/theme/${folder}/button`,
						`docs/3.theme/0${index + 3}.${folder}/02.actions/01.button`,
					),
				],
			})),
		},
	];
	const nonRouteCategories = Object.fromEntries(
		["design-tokens", "elements", "components", "utilities", "modifiers"].map(
			(folder, index) => [
				`docs/3.theme/0${index + 3}.${folder}/02.actions`,
				{ title: "Actions", order: 2 },
			],
		),
	);

	// useDocsSections() on `path`, with Nuxt's auto-imports in place.
	const sectionsAt = async (path: string) => {
		vi.resetModules();
		vi.stubGlobal("computed", computed);
		vi.stubGlobal("inject", () => ref(navigation));
		vi.stubGlobal("useRoute", () => ({ path }));
		vi.stubGlobal("useAppConfig", () => ({ nonRouteCategories }));
		vi.stubGlobal("DOCS_SECTIONS", DOCS_SECTIONS);
		vi.stubGlobal("THEME_SUBSECTIONS", THEME_SUBSECTIONS);
		vi.stubGlobal("themeSegmentFromPath", themeSegmentFromPath);
		vi.stubGlobal("flattenNavigation", flattenNavigation);
		vi.stubGlobal("foldNonRouteCategories", foldNonRouteCategories);
		const { useDocsSections } =
			await import("../app/composables/useDocsSections");
		return useDocsSections();
	};

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	// A page in each section, the way the reader reaches its sidebar.
	const pages = {
		"Getting Started": "/docs/getting-started/introduction",
		"API Reference": "/docs/api/variables",
		"Design Tokens": "/docs/theme/design-tokens/overview",
		Elements: "/docs/theme/elements/overview",
		Components: "/docs/theme/components/button",
		Utilities: "/docs/theme/utilities/overview",
	};

	it("lists every section, with only the reader's open", async () => {
		const { sidebars } = await sectionsAt(pages.Components);
		expect(sidebars.value.map((section) => section.label)).toEqual(
			Object.keys(pages),
		);
		expect(
			sidebars.value
				.filter((section) => section.active)
				.map((section) => section.label),
		).toEqual(["Components"]);
	});

	it.each(Object.entries(pages))(
		"gives %s the tree its sidebar shows",
		async (label, path) => {
			const { sidebarNavigation } = await sectionsAt(path);
			const menu = await sectionsAt(pages["Getting Started"]);
			const section = menu.sidebars.value.find((item) => item.label === label);
			expect(sidebarNavigation.value).not.toEqual([]);
			expect(section?.navigation).toEqual(sidebarNavigation.value);
		},
	);
});
