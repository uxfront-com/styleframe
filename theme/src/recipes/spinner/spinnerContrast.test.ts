import { styleframe } from "@styleframe/core";
import { wcagContrast } from "culori";
import { useDarkModifier } from "../../modifiers/useMediaPreferenceModifiers";
import { useDesignTokensPreset } from "../../presets";
import { colorValues, darkModeColorValues } from "../../values";
import { useSpinnerRecipe } from "./useSpinnerRecipe";

type Slot = Record<string, unknown>;

/**
 * The Spinner page asks for 3:1 between the indicator and what's behind it
 * (WCAG 1.4.11). The spinner has no fill of its own, so each color is checked
 * against both page backgrounds of the light and the dark theme. The `dark`
 * color is for dark surfaces, like the overlay's backdrop, in either theme, so
 * it is checked against the dark theme's backgrounds in both.
 */
describe("spinner contrast", () => {
	const s = styleframe();
	useDesignTokensPreset(s);
	for (const name of [
		"display",
		"position",
		"alignItems",
		"justifyContent",
		"flexShrink",
		"fontSize",
		"lineHeight",
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

	const cases = useSpinnerRecipe(s).compoundVariants!.flatMap((cv) => {
		const css = cv.css as Slot;
		const inDark = { ...css, ...(css["&:dark"] as Slot) };
		return (["light", "dark"] as const).map((theme) => ({
			name: `${cv.match.color} in the ${theme} theme`,
			indicator: resolve(
				(theme === "light" ? css : inDark).color as string,
				theme,
			),
			pages:
				cv.match.color === "dark"
					? [themes.dark.background!, themes.dark.surface!]
					: [themes[theme].background!, themes[theme].surface!],
		}));
	});

	it("covers the four colors in both themes", () => {
		expect(cases).toHaveLength(8);
	});

	it.each(cases)(
		"spinner/contrast gives the indicator of $name at least 3:1 against what's behind it",
		({ indicator, pages }) => {
			for (const page of pages) {
				expect(wcagContrast(indicator, page), page).toBeGreaterThanOrEqual(3);
			}
		},
	);
});
