import { styleframe } from "@styleframe/core";
import { wcagContrast } from "culori";
import { useDesignTokensPreset } from "../../presets";
import { colorValues, darkModeColorValues } from "../../values";
import { fieldSurfaceCompoundVariants } from "./createFieldRecipe";

type Slot = Record<string, unknown>;

/**
 * WCAG 1.4.11 asks for 3:1 between a control's boundary and the colours next
 * to it. Each border token in the shared field surface is checked against its
 * own fill, the read-only fills, and the light and dark page backgrounds,
 * since the `light` and `dark` colors keep their look in either mode.
 */
describe("fieldSurfaceCompoundVariants contrast", () => {
	const s = styleframe();
	useDesignTokensPreset(s);

	function resolve(token: string): string {
		const name = token.slice(1);
		const variable = s.root.variables.find((v) => v.name === name);
		if (!variable) {
			throw new Error(`Unknown token ${token}`);
		}
		return String(variable.value);
	}

	const compounds = fieldSurfaceCompoundVariants();
	const readonlyCss = compounds.find((cv) => cv.match.readonly === "true")
		?.css as Slot;
	const readonlyFills = [
		readonlyCss.background,
		(readonlyCss["&:dark"] as Slot).background,
	] as string[];
	const pageBackgrounds = [
		colorValues.surface,
		colorValues.background,
		darkModeColorValues.background,
		darkModeColorValues.surface,
	];

	const cases = compounds
		.filter((cv) => cv.match.color && cv.match.variant)
		.flatMap((cv) => {
			const css = cv.css as Slot;
			const dark = css["&:dark"] as Slot;
			return [
				{ slot: "plain", declarations: css, fill: css.background },
				{
					slot: "&:hover",
					declarations: css["&:hover"] as Slot,
					fill: css.background,
				},
				{ slot: "&:dark", declarations: dark, fill: dark.background },
				{
					slot: "&:dark:hover",
					declarations: css["&:dark:hover"] as Slot,
					fill: dark.background,
				},
			].map((entry) => ({
				name: `${cv.match.color} ${cv.match.variant} ${entry.slot}`,
				...entry,
			}));
		});

	it("covers the nine color × variant compounds in four slots", () => {
		expect(cases).toHaveLength(36);
	});

	it.each(cases)("$name has a border of at least 3:1", (entry) => {
		const borders = [
			entry.declarations.borderColor,
			entry.declarations.borderBottomColor,
		].filter(
			(value): value is string =>
				typeof value === "string" && value.startsWith("@color."),
		);
		expect(borders.length).toBeGreaterThan(0);

		const neighbours = [...pageBackgrounds, ...readonlyFills.map(resolve)];
		if (typeof entry.fill === "string" && entry.fill.startsWith("@color.")) {
			neighbours.push(resolve(entry.fill));
		}

		for (const border of borders) {
			for (const neighbour of neighbours) {
				expect(
					wcagContrast(resolve(border), neighbour),
					`${border} against ${neighbour}`,
				).toBeGreaterThanOrEqual(3);
			}
		}
	});
});
