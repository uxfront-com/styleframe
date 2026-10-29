import { styleframe } from "@styleframe/core";
import { oklch, rgb, wcagContrast } from "culori";
import { useDarkModifier } from "../../modifiers/useMediaPreferenceModifiers";
import { useDesignTokensPreset } from "../../presets";
import { colorValues, darkModeColorValues } from "../../values";
import { useSpinnerOverlayRecipe } from "./useSpinnerOverlayRecipe";
import { useSpinnerRecipe } from "./useSpinnerRecipe";

type Slot = Record<string, unknown>;

/**
 * The Spinner page asks for 3:1 between the indicator and what's behind it
 * (WCAG 1.4.11), and the label is text, so it needs 4.5:1 (WCAG 1.4.3). The
 * label has no color of its own and takes the spinner's. The spinner has no
 * fill either, so each color is checked against what it sits on, in the light
 * and the dark theme: both page backgrounds, or for `dark`, which is for dark
 * surfaces, the overlay's backdrop over both page backgrounds.
 */
describe("spinner contrast", () => {
	const s = styleframe();
	useDesignTokensPreset(s);
	for (const name of [
		"display",
		"position",
		"top",
		"right",
		"bottom",
		"left",
		"alignItems",
		"justifyContent",
		"flexShrink",
		"fontSize",
		"lineHeight",
		"verticalAlign",
		"background",
		"zIndex",
		"color",
	]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
	useDarkModifier(s);

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

	// The backdrop is translucent, so it's composited over the page in sRGB.
	function srgb(color: string) {
		const { l, c, h } = oklch(color);
		return rgb({ mode: "oklch", l, c, h: h || 0 })!;
	}
	const backdropColor = useSpinnerOverlayRecipe(s).base!.background as string;
	const backdrop = srgb(backdropColor);
	const alpha = oklch(backdropColor).alpha;
	function overlay(page: string): string {
		const under = srgb(page);
		const channel = (key: "r" | "g" | "b") => {
			const value = alpha * backdrop[key] + (1 - alpha) * under[key];
			return Math.round(Math.min(1, Math.max(0, value)) * 255)
				.toString(16)
				.padStart(2, "0");
		};
		return `#${channel("r")}${channel("g")}${channel("b")}`;
	}

	it("composites the overlay's translucent backdrop over the page", () => {
		expect(alpha).toBeGreaterThan(0);
		expect(alpha).toBeLessThan(1);
		expect(overlay("#ffffff")).toBe("#404040");
	});

	const cases = useSpinnerRecipe(s).compoundVariants!.flatMap((cv) => {
		const css = cv.css as Slot;
		const inDark = { ...css, ...(css["&:dark"] as Slot) };
		return (["light", "dark"] as const).map((theme) => {
			const pages = [themes[theme].background!, themes[theme].surface!];
			return {
				name: `${cv.match.color} in the ${theme} theme`,
				color: resolve(
					(theme === "light" ? css : inDark).color as string,
					theme,
				),
				surfaces: cv.match.color === "dark" ? pages.map(overlay) : pages,
			};
		});
	});

	it("covers the four colors in both themes", () => {
		expect(cases).toHaveLength(8);
	});

	it.each(cases)(
		"spinner/contrast gives the indicator of $name at least 3:1 against what it sits on",
		({ color, surfaces }) => {
			for (const surface of surfaces) {
				expect(wcagContrast(color, surface), surface).toBeGreaterThanOrEqual(3);
			}
		},
	);

	it.each(cases)(
		"spinner/contrast gives the label of $name at least 4.5:1 against what it sits on",
		({ color, surfaces }) => {
			for (const surface of surfaces) {
				expect(wcagContrast(color, surface), surface).toBeGreaterThanOrEqual(
					4.5,
				);
			}
		},
	);
});
