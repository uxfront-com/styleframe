import { styleframe } from "@styleframe/core";
import { wcagContrast } from "culori";
import { useDesignTokensPreset } from "../../presets";
import { overlaySurfaceCompoundVariants } from "./createOverlayRecipes";

type Slot = Record<string, unknown>;

/**
 * WCAG 1.4.3 asks for 4.5:1 between text and its background. The title, the
 * description and the content inherit the panel's text color, so each shared
 * surface is checked in the light theme and, through its `&:dark` slot,
 * against the dark theme's token values. The `light` and `dark` colors keep
 * their look in either theme, so they are checked in both too.
 */
describe("modal contrast", () => {
	const s = styleframe();
	useDesignTokensPreset(s);
	const darkTheme = s.root.themes.find((theme) => theme.name === "dark");

	function resolve(token: string, dark: boolean): string {
		const name = token.slice(1);
		const variable =
			(dark && darkTheme?.variables.find((v) => v.name === name)) ||
			s.root.variables.find((v) => v.name === name);
		if (!variable) {
			throw new Error(`Unknown token ${token}`);
		}
		return String(variable.value);
	}

	const cases = overlaySurfaceCompoundVariants.flatMap((cv) => {
		const css = cv.css as Slot;
		return [
			{ theme: "light", dark: false, declarations: css },
			{ theme: "dark", dark: true, declarations: css["&:dark"] as Slot },
		].map((entry) => ({
			name: `${cv.match.color} ${cv.match.variant} in the ${entry.theme} theme`,
			...entry,
		}));
	});

	it("covers the nine color × variant surfaces in both themes", () => {
		expect(cases).toHaveLength(18);
	});

	it.each(cases)(
		"dialog/contrast gives the text of $name at least 4.5:1 against the panel",
		({ declarations, dark }) => {
			const text = resolve(declarations.color as string, dark);
			const panel = resolve(declarations.background as string, dark);

			expect(wcagContrast(text, panel)).toBeGreaterThanOrEqual(4.5);
		},
	);
});
