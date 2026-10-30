import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useDesignTokensPreset } from "./useDesignTokensPreset";
import { useModifiersPreset } from "./useModifiersPreset";
import { useUtilitiesPreset } from "./useUtilitiesPreset";

describe("useModifiersPreset", () => {
	it("should register the accessibility modifiers", () => {
		const s = styleframe();
		const modifiers = useModifiersPreset(s);

		expect(modifiers.hoverCapable?.key).toEqual(["hover-capable"]);
		expect(modifiers.anyPointerCoarse?.key).toEqual(["any-pointer-coarse"]);
		expect(modifiers.ariaInvalid?.key).toEqual(["aria-invalid"]);
		expect(modifiers.readonlyAttr?.key).toEqual(["readonly-attr"]);
		expect(modifiers.dataLoading?.key).toEqual(["data-loading"]);

		const registered = s.root.modifiers.flatMap((modifier) => modifier.key);
		expect(registered).toEqual(
			expect.arrayContaining([
				"hover-capable",
				"any-pointer-coarse",
				"aria-invalid",
				"readonly-attr",
				"data-loading",
			]),
		);
	});

	it("should leave out a category that is set to false", () => {
		const s = styleframe();
		const modifiers = useModifiersPreset(s, { mediaPreferences: false });

		expect(modifiers.hoverCapable).toBeUndefined();
		expect(modifiers.anyPointerCoarse).toBeUndefined();
		expect(modifiers.ariaInvalid).toBeDefined();
	});

	it("should compile chained at-rule modifiers in a recipe to nested CSS", () => {
		const s = styleframe();
		useDesignTokensPreset(s);
		useModifiersPreset(s);
		useUtilitiesPreset(s);

		s.recipe({
			name: "chained",
			base: {
				"&:hover-capable:hover": { background: "blue" },
				"&:dark:hover-capable:hover": { background: "green" },
			},
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(`._hover-capable\\:hover\\:background\\:\\[blue\\] {
	@media (hover: hover) {
		&:hover {
			background: blue;
		}
	}
}`);
		expect(css)
			.toContain(`._dark\\:hover-capable\\:hover\\:background\\:\\[green\\] {
	:is(.dark-theme, [data-theme="dark"]) & {
		@media (hover: hover) {
			&:hover {
				background: green;
			}
		}
	}
}`);
	});
});
