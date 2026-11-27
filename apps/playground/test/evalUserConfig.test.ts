import { describe, expect, it } from "vitest";

import { evalStyleframeFile, evalUserConfig } from "@/pipeline/evalUserConfig";

describe("evalUserConfig", () => {
	it("returns the default-exported Styleframe instance", async () => {
		const compiled = `
			const { styleframe } = __pgModules["styleframe"];
			const s = styleframe();
			__pgOutput.default = s;
		`;
		const instance = await evalUserConfig(compiled);
		expect(instance).toBeTruthy();
		expect(instance.root).toBeTruthy();
	});

	it("rewrites named imports to destructuring assignments", async () => {
		const compiled = `
			import { styleframe } from "styleframe";
			import {
				useDesignTokensPreset,
				useUtilitiesPreset,
				useModifiersPreset,
			} from "@styleframe/theme";
			const s = styleframe();
			useDesignTokensPreset(s);
			useUtilitiesPreset(s);
			useModifiersPreset(s);
			s.recipe({ name: "card", base: { padding: "@1", borderRadius: "@border-radius.md" } });
			export default s;
		`;
		const instance = await evalUserConfig(compiled);
		expect(instance.root.recipes.length).toBeGreaterThan(0);
	});

	it("throws when the default export is missing", async () => {
		const compiled = `const foo = 1;`;
		await expect(evalUserConfig(compiled)).rejects.toThrow(/must export a Styleframe instance/i);
	});
});

describe("evalStyleframeFile", () => {
	it("extends the shared instance through virtual:styleframe", async () => {
		const base = await evalUserConfig(`
			import { styleframe } from "styleframe";
			import { useDesignTokensPreset, useUtilitiesPreset, useModifiersPreset } from "@styleframe/theme";
			const s = styleframe();
			useDesignTokensPreset(s);
			useUtilitiesPreset(s);
			useModifiersPreset(s);
			export default s;
		`);
		const before = base.root.recipes.length;

		evalStyleframeFile(
			`
			import { styleframe } from "virtual:styleframe";
			const s = styleframe();
			export const cardRecipe = s.recipe({
				name: "card",
				base: { padding: "@1", borderRadius: "@border-radius.md" },
			});
		`,
			base,
		);

		expect(base.root.recipes.length).toBeGreaterThan(before);
		expect(base.root.recipes.some((r) => r.name === "card")).toBe(true);
	});
});
