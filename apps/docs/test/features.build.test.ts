import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The homepage's config section fits one screen, with its six features in a
 * strip below it (SiteFeatures): columns of a title over muted text, each
 * linking to its docs page. The other sections with features keep the kit's
 * UxTraits. The landing Markdown says what the strip says.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));
const LANDING = fileURLToPath(
	new URL("../content/landing/index.md", import.meta.url),
);

const FEATURES = [
	{
		title: "The compiler is your reviewer",
		text: "Rename a token and the build fails at the reference, not in production.",
		href: "/docs/api",
	},
	{
		title: "Composable",
		text: "Compose and reuse styles with functions, variables, arrays or objects.",
		href: "/docs/api/composables",
	},
	{
		title: "Built-in Theming",
		text: "Light, dark and custom themes, all from the same tokens.",
		href: "/docs/api/themes",
	},
	{
		title: "One plugin, every major bundler",
		text: "The same config drives Vite, Nuxt, Webpack, esbuild, Astro and more.",
		href: "/docs/getting-started/installation",
	},
	{
		title: "Fully Configurable",
		text: "Every option is typed and in one place.",
		href: "/docs/api/instance#configuration-options",
	},
	{
		title: "Intuitive Developer Experience",
		text: "Autocomplete, in-editor docs and static analysis for your CSS.",
		href: "/docs/getting-started/guides",
	},
];

// The sections that keep UxTraits.
const WITH_TRAITS = ["compose", "themes", "output", "scanner", "figma", "ai"];

const html = existsSync(join(OUTPUT, "index.html"))
	? readFileSync(join(OUTPUT, "index.html"), "utf8")
	: "";

// The <section> around the element with the chapter's id: a UxSplit puts
// the id on its stage, inside the section.
const sectionEnd = (id: string) => {
	const at = html.indexOf(` id="${id}"`);
	return at < 0 ? -1 : html.indexOf("</section>", at) + "</section>".length;
};
const section = (id: string) => {
	const at = html.indexOf(` id="${id}"`);
	return at < 0
		? ""
		: html.slice(html.lastIndexOf("<section", at), sectionEnd(id));
};

describe("the config section's features", () => {
	const after = html.slice(sectionEnd("config"));
	const strip = after.match(/^<ul\b[\s\S]*?<\/ul>/)?.[0] ?? "";
	const cells = strip.match(/<li\b[\s\S]*?<\/li>/g) ?? [];

	it("holds no UxTraits in the section", () => {
		expect(section("config")).not.toBe("");
		expect(section("config")).not.toContain("ux-traits");
	});

	it("follows the section, labelled by its heading", () => {
		expect(strip).toMatch(/^<ul\b[^>]*\bclass="site-features"/);
		expect(strip).toMatch(/^<ul\b[^>]*\baria-labelledby="config-title"/);
	});

	it("lists the six features, each a link", () => {
		expect(
			cells.map((cell) => ({
				title: cell.match(/<strong\b[^>]*>([^<]*)<\/strong>/)?.[1],
				text: cell.match(/<span\b[^>]*>([^<]*)<\/span>/)?.[1],
				href: cell.match(/<a class="site-features__link" href="([^"]*)"/)?.[1],
			})),
		).toEqual(FEATURES);
	});

	it.each(WITH_TRAITS)("keeps UxTraits in #%s", (id) => {
		expect(section(id)).toContain('class="ux-traits"');
	});

	it.each(FEATURES)("says $title in the landing Markdown", (feature) => {
		const lines = readFileSync(LANDING, "utf8").split("\n");
		expect(lines).toContain(
			`- **[${feature.title}](${feature.href})**: ${feature.text}`,
		);
	});
});
