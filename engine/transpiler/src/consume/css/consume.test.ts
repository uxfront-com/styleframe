import type { Root, StyleframeOptions } from "@styleframe/core";
import {
	createAtRuleFunction,
	createCssFunction,
	createRefFunction,
	createRoot,
	createSelectorFunction,
	createThemeFunction,
	createUtilityFunction,
	createVariableFunction,
	isUtility,
} from "@styleframe/core";

import { consume } from "./consume";

describe("consume", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;
	let css: ReturnType<typeof createCssFunction>;
	let selector: ReturnType<typeof createSelectorFunction>;
	let theme: ReturnType<typeof createThemeFunction>;
	let atRule: ReturnType<typeof createAtRuleFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;

	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
		css = createCssFunction(root, root);
		selector = createSelectorFunction(root, root);
		theme = createThemeFunction(root, root);
		atRule = createAtRuleFunction(root, root);
		utility = createUtilityFunction(root, root);
	});

	it("should consume a variable instance", () => {
		const colorVar = variable("primary-color", "#006cff");
		const result = consume(colorVar, options);

		expect(result).toBe("--primary-color: #006cff;");
	});

	it("should consume a reference instance", () => {
		const colorRef = ref("primary-color");
		const result = consume(colorRef, options);

		expect(result).toBe("var(--primary-color)");
	});

	it("should consume a CSS instance", () => {
		const cssValue = css`16px solid #000`;
		const result = consume(cssValue, options);

		expect(result).toBe("16px solid #000");
	});

	it("should consume a selector instance", () => {
		const buttonSelector = selector(".button", {
			padding: "0.5rem 1rem",
			backgroundColor: "#006cff",
		});

		const result = consume(buttonSelector, options);

		expect(result).toEqual(`.button {
\tpadding: 0.5rem 1rem;
\tbackground-color: #006cff;
}`);
	});

	it("should consume a theme instance", () => {
		const lightTheme = theme("light", ({ variable: v }) => {
			v("background-color", "#ffffff");
			v("text-color", "#000000");
		});

		const result = consume(lightTheme, options);

		expect(result).toEqual(`.light-theme, [data-theme="light"] {
\t--background-color: #ffffff;
\t--text-color: #000000;
}`);
	});

	it("should consume an at-rule instance", () => {
		const mediaRule = atRule("media", "(min-width: 768px)", {
			fontSize: "18px",
		});

		const result = consume(mediaRule, options);

		expect(result).toEqual(`@media (min-width: 768px) {
\tfont-size: 18px;
}`);
	});

	it("should consume a utility instance", () => {
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility({
			sm: "8px",
			md: "16px",
		});

		const marginUtility = root.children.find((u) => isUtility(u) && u.name === "margin");
		const result = consume(marginUtility, options);

		expect(result).toEqual(`._margin\\:sm {
\tmargin: 8px;
}`);
	});

	it("should consume primitive values", () => {
		expect(consume("test string", options)).toBe("test string");
		expect(consume(42, options)).toBe("42");
		expect(consume(true, options)).toBe("true");
		expect(consume(false, options)).toBe("false");
		expect(consume(null, options)).toBe("");
		expect(consume(undefined, options)).toBe("");
	});

	it("should consume complex nested structures", () => {
		variable("card-bg", "#ffffff");
		variable("card-shadow", "0 2px 4px rgba(0,0,0,0.1)");

		selector(".card", ({ variable, selector }) => {
			const colorVar = variable("card-bg", "#ffffff");
			const shadowVar = variable("card-shadow", "0 2px 4px rgba(0,0,0,0.1)");

			selector("&:hover", {
				transform: "translateY(-2px)",
				boxShadow: ref(shadowVar),
			});

			return {
				backgroundColor: ref(colorVar),
				borderRadius: "8px",
				padding: "1rem",
			};
		});

		theme("dark", ({ variable, selector }) => {
			const colorVar = variable("card-bg", "#333");
			variable("card-shadow", "0 2px 4px rgba(0,0,0,0.2)");

			selector(".card", ({ variable, selector }) => {
				variable("shadow", ref(colorVar));

				selector("&:hover", {
					transform: "translateY(-6px)",
				});

				return {
					boxShadow: ref("shadow"),
					border: "1px solid #ccc",
				};
			});
		});

		const result = consume(root, options);
		const expected = `:root {
\t--card-bg: #ffffff;
\t--card-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card {
\t--card-bg: #ffffff;
\t--card-shadow: 0 2px 4px rgba(0,0,0,0.1);
\t
\tbackground-color: var(--card-bg);
\tborder-radius: 8px;
\tpadding: 1rem;
\t
\t&:hover {
\t\ttransform: translateY(-2px);
\t\tbox-shadow: var(--card-shadow);
\t}
}

.dark-theme, [data-theme="dark"] {
\t--card-bg: #333;
\t--card-shadow: 0 2px 4px rgba(0,0,0,0.2);
\t
\t.card {
\t\t--shadow: var(--card-bg);
\t\t
\t\tbox-shadow: var(--shadow);
\t\tborder: 1px solid #ccc;
\t\t
\t\t&:hover {
\t\t\ttransform: translateY(-6px);
\t\t}
\t}
}`;

		expect(result).toEqual(expected);
	});

	it("should preserve variable references across different instance types", () => {
		const colorVar = variable("brand-color", "#006cff");

		// Test in selector
		const buttonSelector = selector(".button", {
			backgroundColor: ref(colorVar),
		});

		// Test in CSS
		const borderStyle = css`2px solid ${ref(colorVar)}`;

		// Test in theme
		const brandTheme = theme("brand", ({ selector }) => {
			selector(".accent", {
				color: ref(colorVar),
			});
		});

		const selectorResult = consume(buttonSelector, options);
		const cssResult = consume(borderStyle, options);
		const themeResult = consume(brandTheme, options);

		expect(selectorResult).toEqual(`.button {
\tbackground-color: var(--brand-color);
}`);
		expect(cssResult).toBe("2px solid var(--brand-color)");
		expect(themeResult).toContain("color: var(--brand-color);");
	});

	it("should handle options consistently across all instance types", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--app-${name}`,
			},
		};

		const colorVar = variable("primary", "#006cff");
		const colorRef = ref("secondary");
		const buttonSelector = selector(".button", {
			backgroundColor: ref(colorVar),
			color: colorRef,
		});

		const varResult = consume(colorVar, prefixOptions);
		const refResult = consume(colorRef, prefixOptions);
		const selectorResult = consume(buttonSelector, prefixOptions);

		expect(varResult).toBe("--app-primary: #006cff;");
		expect(refResult).toBe("var(--app-secondary)");
		expect(selectorResult).toEqual(`.button {
\tbackground-color: var(--app-primary);
\tcolor: var(--app-secondary);
}`);
	});
});
