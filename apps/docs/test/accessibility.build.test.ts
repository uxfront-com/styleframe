import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The prerendered docs pages Lighthouse audits (lighthouserc.mjs), with the
 * fluid design page and the installation pages, keep what their accessibility
 * score needs: named header and page-menu buttons, panels that name their
 * tabs, one <h1> and no skipped heading level, and code that every token
 * colour of the highlight themes draws at WCAG AA contrast.
 *
 * Requires a prior build, like og-images.build.test.ts.
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

const AUDITED = [
	"docs/getting-started/introduction",
	"docs/getting-started/installation/vite",
	"docs/api/variables",
	"docs/theme/design-tokens/colors",
	"docs/getting-started/comparisons/tailwind",
];

const HEADINGS = [
	...AUDITED,
	"docs/theme/design-tokens/fluid-design",
	"docs/getting-started/installation/nuxt",
	"docs/getting-started/installation/custom",
	"docs/getting-started/installation/manual/vite",
	"docs/getting-started/installation/manual/nuxt",
];

const read = (page: string) =>
	readFileSync(join(OUTPUT, `${page}.html`), "utf8");

const tags = (html: string, pattern: RegExp) => html.match(pattern) ?? [];
const attr = (tag: string, name: string) =>
	tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

describe.each(AUDITED)("/%s", (page) => {
	const html = read(page);
	const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

	it("names the header's menu button", () => {
		expect(html).toMatch(/<button[^>]*aria-label="Open menu"/);
	});

	it("names the page menu's trigger", () => {
		expect(html).toMatch(
			/<button[^>]*id="reka-dropdown-menu-trigger[^"]*"[^>]*aria-label="[^"]+"/,
		);
	});

	it("names the sidebar's framework select by its label", () => {
		const select = html.match(/<button[^>]*role="combobox"[^>]*>/)?.[0] ?? "";
		const label = attr(select, "aria-labelledby") ?? "";
		const id = label.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
		const named = html.match(
			new RegExp(`<[a-z]+[^>]*\\sid="${id}"[^>]*>([^<]*)<`),
		);
		expect(named?.[1]?.trim(), label).toBe("Framework");
	});

	// The browser sets the tabs' aria-controls once the page has loaded, so
	// Lighthouse (lighthouserc.mjs) checks those: here, any the page has.
	it("points tabs at panels on the page, and back", () => {
		for (const tab of tags(html, /<button[^>]*role="tab"[^>]*>/g)) {
			const panel = attr(tab, "aria-controls");
			if (panel) {
				expect(ids, tab).toContain(panel);
			}
		}
		for (const panel of tags(html, /<[a-z]+[^>]*role="tabpanel"[^>]*>/g)) {
			expect(ids, panel).toContain(attr(panel, "aria-labelledby"));
		}
	});
});

describe.each(HEADINGS)("/%s", (page) => {
	const html = read(page);
	const main = html.slice(html.indexOf("<main"));
	const levels = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));

	it("has one <h1>", () => {
		expect(levels.filter((level) => level === 1)).toHaveLength(1);
	});

	it("skips no heading level", () => {
		levels.forEach((level, index) => {
			expect(level).toBeLessThanOrEqual((levels[index - 1] ?? 0) + 1);
		});
	});
});

describe("code colours", () => {
	// The highlight themes come from @uxfront/layer-docs. Each token colour
	// sits in a declaration block, a class rule in a <style> or a span's
	// style, as --shiki-light, --shiki-default and --shiki-dark. A block that
	// also sets a --shiki-*-bg draws its own background, so it's left out.
	const html = readdirSync(join(OUTPUT, "docs"), { recursive: true })
		.filter((file) => String(file).endsWith(".html"))
		.map((file) => readFileSync(join(OUTPUT, "docs", String(file)), "utf8"))
		.join("");
	const blocks = [...html.matchAll(/[{"]([^{}"]*--shiki-[^{}"]*)[}"]/g)]
		.map((m) => m[1]!)
		.filter((block) => !/--shiki-[a-z]+-bg:/.test(block));
	const colours = (...modes: Array<string>) => [
		...new Set(
			blocks.flatMap((block) =>
				[
					...block.matchAll(
						new RegExp(`--shiki-(?:${modes.join("|")}):(#[0-9a-fA-F]{6})`, "g"),
					),
				].map((m) => m[1]!.toLowerCase()),
			),
		),
	];

	// The code blocks' backgrounds: zinc 50, and zinc 800 in dark mode.
	const ZINC_50 = hexToRgb("#fafafa");
	const ZINC_800 = hexToRgb("#27272a");

	it("pass WCAG AA on the light code blocks", () => {
		const light = colours("light", "default");
		expect(light.length).toBeGreaterThan(0);
		for (const colour of light) {
			expect(
				contrast(hexToRgb(colour), ZINC_50),
				colour,
			).toBeGreaterThanOrEqual(4.5);
		}
	});

	it("pass WCAG AA on the dark code blocks", () => {
		const dark = colours("dark");
		expect(dark.length).toBeGreaterThan(0);
		for (const colour of dark) {
			expect(
				contrast(hexToRgb(colour), ZINC_800),
				colour,
			).toBeGreaterThanOrEqual(4.5);
		}
	});
});

type Triple = [number, number, number];

function hexToRgb(hex: string): Triple {
	return [1, 3, 5].map(
		(i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255,
	) as Triple;
}

const toLinear = (c: number) =>
	c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

function contrast(a: Triple, b: Triple) {
	const luminance = (rgb: Triple) =>
		rgb
			.map(toLinear)
			.reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!, 0);
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light! + 0.05) / (dark! + 0.05);
}
