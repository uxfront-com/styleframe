import {
	useButtonRecipe,
	useDesignTokensPreset,
	useModifiersPreset,
	useUtilitiesPreset,
} from "@styleframe/theme";
import { styleframe } from "styleframe";
import { describe, expect, it } from "vitest";

import { transpileStyleframe } from "@/pipeline/transpileStyleframe";

describe("transpileStyleframe", () => {
	it("produces CSS and TS from an in-memory Styleframe instance", async () => {
		const s = styleframe();
		useDesignTokensPreset(s);
		useUtilitiesPreset(s);
		useModifiersPreset(s);
		useButtonRecipe(s);
		const result = await transpileStyleframe(s);
		expect(result.css).toContain(":root");
		expect(result.ts).toContain("createRecipe");
		expect(result.ts).toContain("@styleframe/runtime");
		expect(result.ts).toContain("button");
	});
});
