import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useAddressElement } from "./useAddressElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useAddressElement", () => {
	it("should create address variable and selector with defaults", () => {
		const s = createInstance();
		const result = useAddressElement(s);

		expect(result.addressMarginBottom).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("address");
		expect(css).toContain("font-style: normal");
		expect(css).toContain("var(--address--margin-bottom)");
	});

	it("should use custom marginBottom value", () => {
		const s = createInstance();
		const result = useAddressElement(s, { marginBottom: "2rem" });

		expect(result.addressMarginBottom.value).toBe("2rem");
	});
});
