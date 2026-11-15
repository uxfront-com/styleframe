import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The callouts (::tip, ::note, ::warning, ::caution) write their text, links
 * and code in the 800 shade in light mode, which app/app.config.ts sets over
 * Nuxt UI's 600 and 500 shades, and keep Nuxt UI's colours in dark mode. The
 * 800 shade needs WCAG AA contrast (4.5:1) on the callout's background: the
 * 500 shade at 10% on white.
 */

const config = readFileSync(
	new URL("../app/app.config.ts", import.meta.url),
	"utf8",
);

// Tailwind CSS 4's palette, which Nuxt UI's success, info, warning and error
// colours use (green, blue, amber and red).
const PALETTE = {
	success: { 500: [0.723, 0.219, 149.579], 800: [0.448, 0.119, 151.328] },
	info: { 500: [0.623, 0.214, 259.815], 800: [0.424, 0.199, 265.638] },
	warning: { 500: [0.769, 0.188, 70.08], 800: [0.473, 0.137, 46.201] },
	error: { 500: [0.637, 0.237, 25.331], 800: [0.444, 0.177, 26.899] },
} as const;

type Rgb = [number, number, number];

function oklchToRgb([l, c, h]: readonly number[]): Rgb {
	const a = c * Math.cos((h! * Math.PI) / 180);
	const b = c * Math.sin((h! * Math.PI) / 180);
	const lms = [
		(l! + 0.3963377774 * a + 0.2158037573 * b) ** 3,
		(l! - 0.1055613458 * a - 0.0638541728 * b) ** 3,
		(l! - 0.0894841775 * a - 1.291485548 * b) ** 3,
	] as const;
	const linear = [
		4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
		-1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
		-0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
	];
	return linear.map((channel) => {
		const v = Math.min(1, Math.max(0, channel));
		return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
	}) as Rgb;
}

function luminance(rgb: Rgb) {
	const [r, g, b] = rgb.map((c) =>
		c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
	) as Rgb;
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Rgb, b: Rgb) {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light! + 0.05) / (dark! + 0.05);
}

describe("the callouts", () => {
	for (const [color, shades] of Object.entries(PALETTE)) {
		it(`write ${color} text, links and code in the 800 shade in light mode only`, () => {
			for (const target of ["", "[&_a]:", "[&_code]:"]) {
				expect(config).toContain(`${target}text-${color}-800`);
			}
			expect(config).toContain(`dark:text-${color}-300`);
			expect(config).toContain(`dark:[&_a]:text-${color} `);
			expect(config).toContain(`dark:[&_code]:text-${color}-300`);
		});

		it(`pass WCAG AA for ${color} on its tint in light mode`, () => {
			const tint = oklchToRgb(shades[500]).map(
				(channel) => channel * 0.1 + 0.9,
			) as Rgb;
			expect(contrast(oklchToRgb(shades[800]), tint)).toBeGreaterThanOrEqual(
				4.5,
			);
		});
	}
});
