import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useDesignTokensPreset } from "./useDesignTokensPreset";
import { useUtilitiesPreset } from "./useUtilitiesPreset";

describe("useUtilitiesPreset", () => {
	it("should register position-try-fallbacks without defaults", () => {
		const s = styleframe();
		useDesignTokensPreset(s);
		const utilities = useUtilitiesPreset(s);

		expect(utilities.createPositionTryFallbacksUtility).toBeTypeOf("function");
		expect(consumeCSS(s.root, s.options)).not.toContain(
			"position-try-fallbacks:",
		);
	});

	it("should emit configured position-try-fallbacks values", () => {
		const s = styleframe();
		useDesignTokensPreset(s);
		useUtilitiesPreset(s, {
			positionTryFallbacks: { flip: "flip-block, flip-inline" },
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._position-try-fallbacks\\:flip {");
		expect(css).toContain("position-try-fallbacks: flip-block, flip-inline;");
	});
});
