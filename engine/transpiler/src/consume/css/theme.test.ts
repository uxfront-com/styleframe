import type { Root, StyleframeOptions } from "@styleframe/core";
import {
	createCssFunction,
	createRefFunction,
	createRoot,
	createThemeFunction,
	createVariableFunction,
} from "@styleframe/core";

import { consume } from "./consume";
import { createThemeConsumer } from "./theme";

describe("createThemeConsumer", () => {
	let root: Root;
	let theme: ReturnType<typeof createThemeFunction>;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;
	let css: ReturnType<typeof createCssFunction>;

	const consumeTheme = createThemeConsumer(consume);
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		theme = createThemeFunction(root, root);
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
		css = createCssFunction(root, root);
	});

	it("should convert a basic theme to CSS with default selector format", () => {
		const lightTheme = theme("light", ({ variable: v }) => {
			v("color-primary", "#0066ff");
		});

		expect(consumeTheme(lightTheme, options)).toBe(
			'.light-theme, [data-theme="light"] {\n\t--color-primary: #0066ff;\n}',
		);
	});

	it("should handle themes with multiple variables", () => {
		const darkTheme = theme("dark", ({ variable: v }) => {
			v("color-primary", "#4d9eff");
			v("color-secondary", "#ff6b6b");
			v("background", "#1a1a1a");
		});

		const result = consumeTheme(darkTheme, options);
		expect(result).toEqual(
			'.dark-theme, [data-theme="dark"] {\n\t--color-primary: #4d9eff;\n\t--color-secondary: #ff6b6b;\n\t--background: #1a1a1a;\n}',
		);
	});

	it("should handle themes with nested selectors", () => {
		const themeWithSelectors = theme("colorful", ({ variable: v, selector: s }) => {
			v("primary-color", "#ff0066");
			s(".button", {
				color: ref("primary-color"),
				backgroundColor: "white",
			});
		});

		const result = consumeTheme(themeWithSelectors, options);
		expect(result).toEqual(`.colorful-theme, [data-theme="colorful"] {
\t--primary-color: #ff0066;
\t
\t.button {
\t\tcolor: var(--primary-color);
\t\tbackground-color: white;
\t}
}`);
	});

	it("should respect custom theme selector format", () => {
		const customOptions: StyleframeOptions = {
			themes: {
				selector: ({ name }) => `.theme-${name}`,
			},
		};

		const customTheme = theme("neon", ({ variable: v }) => {
			v("accent-color", "#00ff88");
		});

		expect(consumeTheme(customTheme, customOptions)).toBe(
			".theme-neon {\n\t--accent-color: #00ff88;\n}",
		);
	});

	it("should handle themes with variable prefix", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--app-${name}`,
			},
		};

		const prefixedTheme = theme("branded", ({ variable: v }) => {
			v("brand-color", "#123456");
		});

		expect(consumeTheme(prefixedTheme, prefixOptions)).toBe(
			'.branded-theme, [data-theme="branded"] {\n\t--app-brand-color: #123456;\n}',
		);
	});

	it("should handle empty themes", () => {
		const emptyTheme = theme("empty", () => {});

		expect(consumeTheme(emptyTheme, options)).toBe('.empty-theme, [data-theme="empty"] {}');
	});

	it("should handle themes with only nested children", () => {
		const childrenOnlyTheme = theme("structure", ({ selector: s }) => {
			s(".header", {
				padding: "1rem",
			});

			s(".footer", {
				margin: "2rem 0",
			});
		});

		const result = consumeTheme(childrenOnlyTheme, options);
		expect(result).toEqual(
			`.structure-theme, [data-theme="structure"] {
\t.header {
\t\tpadding: 1rem;
\t}
\t
\t.footer {
\t\tmargin: 2rem 0;
\t}
}`,
		);
	});

	it("should handle themes with complex nested structures", () => {
		const complexTheme = theme("advanced", ({ variable: v, selector: s, css }) => {
			v("spacing-unit", "8px");
			v("primary-hue", "240");

			s(".card", ({ selector: nested }) => {
				nested("&:hover", {
					transform: "translateY(-2px)",
				});

				nested(".card-header", {
					backgroundColor: css`hsl(${ref("primary-hue")}, 70%, 90%)`,
				});

				return {
					padding: ref("spacing-unit"),
					borderRadius: "4px",
				};
			});
		});

		const result = consumeTheme(complexTheme, options);
		expect(result).toEqual(`.advanced-theme, [data-theme="advanced"] {
\t--spacing-unit: 8px;
\t--primary-hue: 240;
\t
\t.card {
\t\tpadding: var(--spacing-unit);
\t\tborder-radius: 4px;
\t\t
\t\t&:hover {
\t\t\ttransform: translateY(-2px);
\t\t}
\t\t
\t\t.card-header {
\t\t\tbackground-color: hsl(var(--primary-hue), 70%, 90%);
\t\t}
\t}
}`);
	});

	it("should handle themes with CSS variable references", () => {
		const baseVar = variable("base-size", "16px");
		const refTheme = theme("referenced", ({ variable: v }) => {
			v("large-size", css`calc(${ref(baseVar)} * 1.5)`);
			v("small-size", css`calc(${ref(baseVar)} * 0.875)`);
		});

		const result = consumeTheme(refTheme, options);
		expect(result).toEqual(`.referenced-theme, [data-theme="referenced"] {
\t--large-size: calc(var(--base-size) * 1.5);
\t--small-size: calc(var(--base-size) * 0.875);
}`);
	});

	it("should handle themes with both custom selector and variable prefix", () => {
		const combinedOptions: StyleframeOptions = {
			themes: {
				selector: ({ name }) => `#theme-${name}`,
			},
			variables: {
				name: ({ name }) => `--ui-${name}`,
			},
		};

		const combinedTheme = theme("custom", ({ variable: v }) => {
			v("text-color", "#333333");
		});

		expect(consumeTheme(combinedTheme, combinedOptions)).toBe(
			"#theme-custom {\n\t--ui-text-color: #333333;\n}",
		);
	});
});
