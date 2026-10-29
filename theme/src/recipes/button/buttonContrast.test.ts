import { styleframe } from "@styleframe/core";
import { wcagContrast } from "culori";
import {
	useDesignTokensPreset,
	useModifiersPreset,
	useUtilitiesPreset,
} from "../../presets";
import { colorValues, darkModeColorValues } from "../../values";
import { useButtonRecipe } from "./useButtonRecipe";

type Slot = Record<string, unknown>;
type Theme = "light" | "dark";

const states = [
	{ name: "rest", key: undefined },
	{ name: "hover", key: "&:hover-capable:hover" },
	{ name: "active", key: "&:active" },
	{ name: "pressed", key: "&:aria-pressed" },
] as const;

/**
 * WCAG 1.4.3 asks for 4.5:1 between a label and its background, and WCAG
 * 1.4.11 for 3:1 between the focus ring and the page. Every color × variant
 * compound is checked at rest, on hover, when active and when pressed, in the
 * light and dark themes. A variant without a fill sits on the page: the
 * theme's page for the semantic and `neutral` colors, a dark surface (the dark
 * theme's page, or `gray-900`) for `light` and a light surface for `dark`,
 * since those two keep their look in either theme.
 */
describe("useButtonRecipe contrast", () => {
	const s = styleframe();
	useDesignTokensPreset(s);
	useModifiersPreset(s);
	useUtilitiesPreset(s);
	const recipe = useButtonRecipe(s);
	const darkTheme = s.root.themes.find((theme) => theme.name === "dark");

	function resolve(token: string, theme: Theme): string {
		const name = token.slice(1);
		const variable =
			(theme === "dark" && darkTheme?.variables.find((v) => v.name === name)) ||
			s.root.variables.find((v) => v.name === name);
		if (!variable) {
			throw new Error(`Unknown token ${token}`);
		}
		const value = variable.value as unknown;
		if (
			typeof value === "object" &&
			value !== null &&
			(value as Slot).type === "reference"
		) {
			return resolve(`@${(value as Slot).name}`, theme);
		}
		return String(value);
	}

	const pages: Record<Theme, string[]> = {
		light: [colorValues.background, colorValues.surface],
		dark: [darkModeColorValues.background, darkModeColorValues.surface],
	};

	function surfaces(color: string, theme: Theme): string[] {
		if (color === "light") {
			return [...pages.dark, resolve("@color.gray-900", theme)];
		}
		if (color === "dark") return pages.light;
		return pages[theme];
	}

	const compounds = recipe.compoundVariants!.filter(
		(cv) => cv.match.color && cv.match.variant,
	);

	const cases = compounds.flatMap((cv) => {
		const css = cv.css as Slot;
		const plain = Object.fromEntries(
			Object.entries(css).filter(([, value]) => typeof value !== "object"),
		);
		return (["light", "dark"] as const).flatMap((theme) =>
			states.map((state) => {
				const declarations: Slot = { ...plain };
				if (theme === "dark") Object.assign(declarations, css["&:dark"]);
				if (state.key) Object.assign(declarations, css[state.key]);
				if (theme === "dark" && state.key) {
					Object.assign(declarations, css[state.key.replace("&:", "&:dark:")]);
				}
				return {
					name: `${cv.match.color} ${cv.match.variant} ${state.name} in ${theme}`,
					color: cv.match.color as string,
					theme,
					declarations,
				};
			}),
		);
	});

	it("button/contrast covers the nine colors × six variants in four states and two themes", () => {
		expect(compounds).toHaveLength(54);
		expect(cases).toHaveLength(432);
	});

	it.each(cases)("button/contrast keeps the $name label at 4.5:1", (entry) => {
		const { color, theme, declarations } = entry;
		const label = declarations.color;
		expect(typeof label === "string" && label.startsWith("@color.")).toBe(true);

		const fill = declarations.background;
		const behind =
			typeof fill === "string" && fill.startsWith("@color.")
				? [resolve(fill, theme)]
				: surfaces(color, theme);

		for (const background of behind) {
			expect(
				wcagContrast(resolve(label as string, theme), background),
				`${label} against ${background}`,
			).toBeGreaterThanOrEqual(4.5);
		}
	});

	it("button/contrast resolves every dark state without relying on rule order", () => {
		for (const cv of compounds) {
			const css = cv.css as Slot;
			const dark = (css["&:dark"] ?? {}) as Slot;
			for (const state of states) {
				if (!state.key) continue;
				const block = (css[state.key] ?? {}) as Slot;
				const darkBlock = (css[state.key.replace("&:", "&:dark:")] ??
					{}) as Slot;
				for (const property of Object.keys(block)) {
					if (property in dark) {
						expect(
							darkBlock,
							`${cv.match.color} ${cv.match.variant} ${state.name} ${property}`,
						).toHaveProperty(property);
					}
				}
			}
		}
	});

	it.each(["light", "dark"] as const)(
		"button/contrast keeps the focus ring at 3:1 against every surface in %s",
		(theme) => {
			for (const surface of [...pages.light, ...pages.dark]) {
				expect(
					wcagContrast(resolve("@color.focus", theme), surface),
					`focus against ${surface}`,
				).toBeGreaterThanOrEqual(3);
			}
		},
	);
});
