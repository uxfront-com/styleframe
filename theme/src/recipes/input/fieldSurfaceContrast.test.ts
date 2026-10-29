import { styleframe } from "@styleframe/core";
import { oklch, rgb, wcagContrast } from "culori";
import { useDesignTokensPreset } from "../../presets";
import { colorValues, darkModeColorValues } from "../../values";
import {
	FIELD_MUTED_TEXT,
	fieldSurfaceCompoundVariants,
} from "./createFieldRecipe";

type Slot = Record<string, unknown>;

/**
 * The Input page asks for 4.5:1 for the value, the placeholder, prefixes and
 * suffixes, and 3:1 for the border and the focus ring (WCAG 1.4.3, 1.4.11).
 * Every color × variant compound of the shared field surface is checked in
 * the light and the dark theme, since the `light` and `dark` colors keep their
 * look in either mode. A transparent fill shows the page, so it is checked
 * against both page backgrounds of its theme.
 */
describe("fieldSurfaceCompoundVariants contrast", () => {
	const s = styleframe();
	useDesignTokensPreset(s);

	const themes = {
		light: colorValues as Record<string, string>,
		dark: darkModeColorValues as Record<string, string>,
	};
	type Theme = keyof typeof themes;

	function resolve(token: string, theme: Theme): string {
		const name = token.slice("@color.".length);
		const themed = themes[theme][name];
		if (themed) {
			return themed.startsWith("@") ? resolve(themed, theme) : themed;
		}
		const variable = s.root.variables.find((v) => v.name === `color.${name}`);
		if (!variable) {
			throw new Error(`Unknown token ${token}`);
		}
		return String(variable.value);
	}

	const pages = (theme: Theme) => [
		themes[theme].background!,
		themes[theme].surface!,
	];

	// The muted text is the text color at this share, composited in sRGB over
	// the fill, as `color-mix(in srgb, currentColor n%, transparent)` paints it.
	const mutedShare =
		Number(/currentColor (\d+)%/.exec(FIELD_MUTED_TEXT)?.[1]) / 100;
	function srgb(color: string) {
		const { l, c, h } = oklch(color);
		return rgb({ mode: "oklch", l, c, h: h || 0 })!;
	}
	function muted(text: string, fill: string) {
		const [fg, bg] = [srgb(text), srgb(fill)];
		const channel = (key: "r" | "g" | "b") => {
			const value = mutedShare * fg[key] + (1 - mutedShare) * bg[key];
			return Math.round(Math.min(1, Math.max(0, value)) * 255)
				.toString(16)
				.padStart(2, "0");
		};
		return `#${channel("r")}${channel("g")}${channel("b")}`;
	}

	const compounds = fieldSurfaceCompoundVariants();
	const invalid = compounds.find((cv) => cv.match.invalid === "true")!
		.css as Slot;

	const cases = compounds
		.filter((cv) => cv.match.color && cv.match.variant)
		.flatMap((cv) => {
			const css = cv.css as Slot;
			const inDark = { ...css, ...(css["&:dark"] as Slot) };
			return (["light", "dark"] as const).map((theme) => {
				const slot = theme === "light" ? css : inDark;
				const hover = (
					theme === "light"
						? css["&:hover-capable:hover"]
						: css["&:dark:hover-capable:hover"]
				) as Slot;
				const fills =
					slot.background === "transparent"
						? pages(theme)
						: [resolve(slot.background as string, theme)];
				const borders = [slot, hover]
					.flatMap((block) => [block.borderColor, block.borderBottomColor])
					.filter(
						(value): value is string =>
							typeof value === "string" && value.startsWith("@color."),
					)
					.map((token) => resolve(token, theme));
				return {
					name: `${cv.match.color} ${cv.match.variant} in the ${theme} theme`,
					theme,
					text: resolve(slot.color as string, theme),
					fills,
					borders,
				};
			});
		});

	it("covers the nine color × variant compounds in both themes", () => {
		expect(cases).toHaveLength(18);
	});

	it.each(cases)(
		"input/contrast gives the value 4.5:1 on $name",
		({ text, fills }) => {
			for (const fill of fills) {
				expect(wcagContrast(text, fill), fill).toBeGreaterThanOrEqual(4.5);
			}
		},
	);

	it.each(cases)(
		"input/contrast gives the placeholder, prefix and suffix 4.5:1 on $name",
		({ text, fills }) => {
			for (const fill of fills) {
				expect(
					wcagContrast(muted(text, fill), fill),
					fill,
				).toBeGreaterThanOrEqual(4.5);
			}
		},
	);

	it.each(cases)(
		"input/boundary-contrast gives the border 3:1 at rest and on hover on $name",
		({ theme, fills, borders }) => {
			expect(borders.length).toBeGreaterThan(0);
			for (const border of borders) {
				for (const neighbour of [...pages(theme), ...fills]) {
					expect(
						wcagContrast(border, neighbour),
						`${border} against ${neighbour}`,
					).toBeGreaterThanOrEqual(3);
				}
			}
		},
	);

	it.each(cases)(
		"input/boundary-contrast gives the invalid border 3:1 on $name",
		({ theme, fills }) => {
			const error = resolve(invalid.borderColor as string, theme);
			for (const neighbour of [...pages(theme), ...fills]) {
				expect(
					wcagContrast(error, neighbour),
					neighbour,
				).toBeGreaterThanOrEqual(3);
			}
		},
	);

	it.each(["light", "dark"] as const)(
		"input/contrast gives the focus ring 3:1 against the %s page",
		(theme) => {
			const focus = resolve("@color.focus", theme);
			for (const page of pages(theme)) {
				expect(wcagContrast(focus, page), page).toBeGreaterThanOrEqual(3);
			}
		},
	);
});
