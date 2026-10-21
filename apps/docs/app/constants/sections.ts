export const DOCS_SECTIONS = [
	{
		key: "gettingStarted",
		slug: "getting-started",
		folder: [
			"01.getting-started",
			"08.tooling",
			"09.integrations",
			"10.migration",
		],
		rootFolder: 0,
		label: "Getting Started",
		icon: "i-lucide-rocket",
	},
	{
		key: "api",
		slug: "api",
		folder: "02.api",
		label: "API Reference",
		icon: "i-lucide-code-xml",
	},
	{
		key: "theme",
		slug: "theme",
		folder: [
			"03.design-tokens",
			"04.elements",
			"05.components",
			"06.utilities",
			"07.modifiers",
		],
		label: "Theme",
		icon: "i-lucide-palette",
	},
] as const;

export type DocsSection = (typeof DOCS_SECTIONS)[number];
export type DocsSectionKey = DocsSection["key"];
export type DocsSectionSlug = DocsSection["slug"];

export const DOCS_SECTION_SLUGS = DOCS_SECTIONS.map(
	(section) => section.slug,
) as readonly DocsSectionSlug[];

export function findDocsSectionBySlug(slug: string): DocsSection | undefined {
	return DOCS_SECTIONS.find((section) => section.slug === slug);
}

/** Every folder in `content/docs/`, in section order. */
export const DOCS_FOLDERS = DOCS_SECTIONS.flatMap(
	(section): readonly string[] =>
		typeof section.folder === "string" ? [section.folder] : section.folder,
);

/**
 * The URL a folder in `content/docs/` is served at. A section with one folder,
 * and its `rootFolder`, mount at `/docs/<slug>`; every other folder mounts below
 * it, without its number: `08.tooling` is at `/docs/getting-started/tooling`.
 */
export function docsFolderPrefix(folder: string): string | undefined {
	for (const section of DOCS_SECTIONS) {
		const folders: readonly string[] =
			typeof section.folder === "string" ? [section.folder] : section.folder;
		const index = folders.indexOf(folder);
		if (index === -1) continue;
		const base = `/docs/${section.slug}`;
		const rootFolder = "rootFolder" in section ? section.rootFolder : -1;
		return folders.length === 1 || index === rootFolder
			? base
			: `${base}/${folder.replace(/^\d+\./, "")}`;
	}
	return undefined;
}

/**
 * The `stem` a docs page gets (see `modules/nonRouteCategories.ts`): its file,
 * without its extension, with its section in front, numbered in section order.
 * `docs/08.tooling/01.cli` becomes `docs/1.getting-started/08.tooling/01.cli`.
 * Nuxt Content orders the sidebar and the previous and next links by stem, so
 * pages follow their files, and each section's pages stay together, though
 * `08.tooling` is numbered after `02.api`. Works for folders too.
 */
export function docsStem(file: string): string {
	const [root, folder, ...rest] = file.split("/");
	const index = DOCS_SECTIONS.findIndex((section) =>
		(typeof section.folder === "string"
			? [section.folder]
			: (section.folder as readonly string[])
		).includes(folder ?? ""),
	);
	if (root !== "docs" || index === -1) return file;
	return [
		root,
		`${index + 1}.${DOCS_SECTIONS[index]!.slug}`,
		folder,
		...rest,
	].join("/");
}

/** The file of a docs page, without its extension, from its `stem` (see docsStem). */
export function docsSourceStem(stem: string): string {
	const [root, , ...rest] = stem.split("/");
	return [root, ...rest].join("/");
}

/**
 * Sub-tabs rendered for the `theme` section. The single `theme` content
 * collection and its `/docs/theme/...` URLs are unchanged; these descriptors
 * only split the subnav into separate tabs, each rendering a slice of the
 * theme navigation tree. `folders` are the URL segments after `theme`.
 */
export const THEME_SUBSECTIONS = [
	{
		slug: "design-tokens",
		label: "Design Tokens",
		icon: "i-lucide-palette",
		folders: ["design-tokens"],
	},
	{
		slug: "elements",
		label: "Elements",
		icon: "i-lucide-type",
		folders: ["elements"],
	},
	{
		slug: "components",
		label: "Components",
		icon: "i-lucide-box",
		folders: ["components"],
	},
	{
		slug: "utilities",
		label: "Utilities",
		icon: "i-lucide-wrench",
		folders: ["utilities", "modifiers"],
	},
] as const;

export type ThemeSubsection = (typeof THEME_SUBSECTIONS)[number];

/** Segment after `/docs/theme/`, robust to an i18n locale prefix. */
export function themeSegmentFromPath(path: string): string | undefined {
	return path.match(/\/docs\/theme\/([^/]+)/)?.[1];
}

export function findThemeSubsection(path: string): ThemeSubsection {
	const segment = themeSegmentFromPath(path);
	return (
		THEME_SUBSECTIONS.find((sub) =>
			(sub.folders as readonly string[]).includes(segment ?? ""),
		) ?? THEME_SUBSECTIONS[0]
	);
}
