import { useDesignTokensPreset, useModifiersPreset, useUtilitiesPreset } from "@styleframe/theme";
import { styleframe, validate } from "styleframe";
import { describe, expect, it } from "vitest";

import { useRunButtonRecipe } from "@/recipes/useRunButtonRecipe";

describe("useRunButtonRecipe", () => {
	it("uses tokens that resolve, the duration included", () => {
		const s = styleframe();
		useDesignTokensPreset(s);
		useModifiersPreset(s);
		useUtilitiesPreset(s);
		useRunButtonRecipe(s);

		const recipe = s.root.recipes.find((r) => r.name === "pg-run-button");
		expect(recipe?.base?.transitionDuration).toBe("@duration.fast");
		expect(validate(s)).toEqual([]);
	});
});
