import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The prerendered docs pages Lighthouse audits (lighthouserc.json), with the
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
		const id = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const named = html.match(
			new RegExp(`<[a-z]+[^>]*\\sid="${id}"[^>]*>([^<]*)<`),
		);
		expect(named?.[1]?.trim(), label).toBe("Framework");
	});

	// The browser sets the tabs' aria-controls once the page has loaded, so
	// Lighthouse (lighthouserc.json) checks those: here, any the page has.
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
	// app/app.css caps each token's OKLCH lightness in light mode and raises it
	// in dark mode, important to outrank Docus's own important colours.
	const css = readFileSync(new URL("../app/app.css", import.meta.url), "utf8");
	const light = Number(
		css.match(/var\(--shiki-light\) min\(l, ([\d.]+)\) c h\) !important/)?.[1],
	);
	const dark = Number(
		css.match(/var\(--shiki-dark\) max\(l, ([\d.]+)\) c h\) !important/)?.[1],
	);

	// Every token colour the built pages use.
	const html = readdirSync(join(OUTPUT, "docs"), { recursive: true })
		.filter((file) => String(file).endsWith(".html"))
		.map((file) => readFileSync(join(OUTPUT, "docs", String(file)), "utf8"))
		.join("");
	const colours = (mode: string) => [
		...new Set(
			[
				...html.matchAll(new RegExp(`--shiki-${mode}:(#[0-9a-fA-F]{6})`, "g")),
			].map((m) => m[1]!),
		),
	];

	// The code blocks' backgrounds: zinc 50, and zinc 800 in dark mode.
	const ZINC_50 = hexToRgb("#fafafa");
	const ZINC_800 = hexToRgb("#27272a");

	it("are capped in light mode and raised in dark mode", () => {
		expect(light).toBeGreaterThan(0);
		expect(dark).toBeGreaterThan(0);
	});

	it("pass WCAG AA on the light code blocks", () => {
		expect(colours("light").length).toBeGreaterThan(0);
		for (const colour of colours("light")) {
			const [l, a, b] = toOklab(hexToRgb(colour));
			const shown = fromOklab([Math.min(l, light), a, b]);
			expect(contrast(shown, ZINC_50), colour).toBeGreaterThanOrEqual(4.5);
		}
	});

	it("pass WCAG AA on the dark code blocks", () => {
		expect(colours("dark").length).toBeGreaterThan(0);
		for (const colour of colours("dark")) {
			const [l, a, b] = toOklab(hexToRgb(colour));
			const shown = fromOklab([Math.max(l, dark), a, b]);
			expect(contrast(shown, ZINC_800), colour).toBeGreaterThanOrEqual(4.5);
		}
	});
});

type Triple = [number, number, number];

function hexToRgb(hex: string): Triple {
	return [1, 3, 5].map(
		(i) => parseInt(hex.slice(i, i + 2), 16) / 255,
	) as Triple;
}

const toLinear = (c: number) =>
	c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const fromLinear = (c: number) =>
	c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function toOklab(rgb: Triple): Triple {
	const [r, g, b] = rgb.map(toLinear) as Triple;
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
}

function fromOklab([L, a, b]: Triple): Triple {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	].map((c) => fromLinear(Math.min(1, Math.max(0, c)))) as Triple;
}

function contrast(a: Triple, b: Triple) {
	const luminance = (rgb: Triple) =>
		rgb
			.map(toLinear)
			.reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!, 0);
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light! + 0.05) / (dark! + 0.05);
}
