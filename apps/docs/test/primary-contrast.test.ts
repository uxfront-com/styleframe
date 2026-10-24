import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The docs' links and buttons use `--ui-primary`, which app/app.css points at
 * the teal's 600 shade in light mode and its 400 shade in dark mode. Both need
 * WCAG AA contrast (4.5:1) on the page background.
 */

const css = readFileSync(new URL("../app/app.css", import.meta.url), "utf8");

function shade(step: number): [number, number, number] {
	const match = css.match(
		new RegExp(`--color-teal-${step}:\\s*hsl\\((\\d+) (\\d+)% (\\d+)%\\)`),
	);
	expect(match, `--color-teal-${step} in app/app.css`).toBeTruthy();
	const [h, s, l] = match!.slice(1).map(Number) as [number, number, number];
	return hslToRgb(h, s / 100, l / 100);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return [f(0), f(8), f(4)];
}

function luminance([r, g, b]: [number, number, number]) {
	const linear = (c: number) =>
		c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrast(a: [number, number, number], b: [number, number, number]) {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light! + 0.05) / (dark! + 0.05);
}

// Nuxt UI's backgrounds: white, and the zinc neutral's 900 (#18181b) in dark mode.
const WHITE: [number, number, number] = [1, 1, 1];
const ZINC_900: [number, number, number] = [0x18 / 255, 0x18 / 255, 0x1b / 255];

describe("the primary colour", () => {
	it("maps to the 600 shade in light mode and the 400 shade in dark mode", () => {
		expect(css).toMatch(
			/\.light\s*{\s*--ui-primary: var\(--ui-color-primary-600\)/,
		);
		expect(css).toMatch(
			/\.dark\s*{\s*--ui-primary: var\(--ui-color-primary-400\)/,
		);
	});

	it("passes WCAG AA on white in light mode", () => {
		expect(contrast(shade(600), WHITE)).toBeGreaterThanOrEqual(4.5);
	});

	it("passes WCAG AA on zinc 900 in dark mode", () => {
		expect(contrast(shade(400), ZINC_900)).toBeGreaterThanOrEqual(4.5);
	});
});
