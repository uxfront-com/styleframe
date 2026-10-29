import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { useFocusState } from "./useFocusState";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useFocusState", () => {
	it("should create focus variables and selector", () => {
		const s = createInstance();
		const result = useFocusState(s);

		expect(result.focusOutlineColor).toBeDefined();
		expect(result.focusOutlineWidth).toBeDefined();
		expect(result.focusOutlineStyle).toBeDefined();
		expect(result.focusOutlineOffset).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(":focus-visible");
		expect(css).toContain("var(--focus--outline-color)");
		expect(css).toContain("var(--focus--outline-width)");
		expect(css).toContain("var(--focus--outline-style)");
		expect(css).toContain("var(--focus--outline-offset)");
	});

	it("should point the outline color at color.focus by default", () => {
		const s = createInstance();
		const result = useFocusState(s);

		expect(result.focusOutlineColor.value).toEqual({
			type: "reference",
			name: "color.focus",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("--focus--outline-color: var(--color--focus);");
	});

	it("should use custom outline values", () => {
		const s = createInstance();
		const result = useFocusState(s, {
			outlineColor: "#ff0000",
			outlineWidth: "3px",
			outlineStyle: "dashed",
			outlineOffset: "4px",
		});

		expect(result.focusOutlineColor.value).toBe("#ff0000");
		expect(result.focusOutlineWidth.value).toBe("3px");
		expect(result.focusOutlineStyle.value).toBe("dashed");
		expect(result.focusOutlineOffset.value).toBe("4px");
	});
});
