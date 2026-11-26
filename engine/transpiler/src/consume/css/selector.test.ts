import type { Root, StyleframeOptions } from "@styleframe/core";
import {
	createCssFunction,
	createRefFunction,
	createRoot,
	createSelectorFunction,
	createVariableFunction,
	isSelector,
} from "@styleframe/core";

import { consume } from "./consume";
import { createSelectorConsumer } from "./selector";

describe("createSelectorConsumer", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;
	let selector: ReturnType<typeof createSelectorFunction>;
	let css: ReturnType<typeof createCssFunction>;

	const consumeSelector = createSelectorConsumer(consume);
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
		selector = createSelectorFunction(root, root);
		css = createCssFunction(root, root);
	});

	it("should create a basic selector with declarations", () => {
		const buttonSelector = selector(".button", {
			padding: "0.5rem 1rem",
			backgroundColor: "#006cff",
			color: "white",
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\tpadding: 0.5rem 1rem;
\tbackground-color: #006cff;
\tcolor: white;
}`);
	});

	it("should create a selector with variables", () => {
		const buttonSelector = selector(".button", ({ variable }) => {
			variable("button-color", "#006cff");

			return {
				padding: "0.5rem 1rem",
			};
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\t--button-color: #006cff;
\t
\tpadding: 0.5rem 1rem;
}`);
	});

	it("should create a selector with child selectors", () => {
		const buttonSelector = selector(".button", ({ selector }) => {
			selector("&:hover", {
				backgroundColor: "#0056cc",
			});

			return {
				padding: "0.5rem 1rem",
				backgroundColor: "#006cff",
			};
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\tpadding: 0.5rem 1rem;
\tbackground-color: #006cff;
\t
\t&:hover {
\t\tbackground-color: #0056cc;
\t}
}`);
	});

	it("should create a selector with variables, declarations and children", () => {
		const buttonSelector = selector(".button", ({ variable, selector }) => {
			const colorVar = variable("button-color", "#006cff");
			const hoverVar = variable("button-hover-color", "#0056cc");

			selector("&:hover", {
				backgroundColor: ref(hoverVar),
			});

			return {
				padding: "0.5rem 1rem",
				backgroundColor: ref(colorVar),
			};
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\t--button-color: #006cff;
\t--button-hover-color: #0056cc;
\t
\tpadding: 0.5rem 1rem;
\tbackground-color: var(--button-color);
\t
\t&:hover {
\t\tbackground-color: var(--button-hover-color);
\t}
}`);
	});

	it("should handle empty declarations", () => {
		const buttonSelector = selector(".button", ({ selector }) => {
			selector("&:hover", {
				backgroundColor: "#0056cc",
			});
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\t&:hover {
\t\tbackground-color: #0056cc;
\t}
}`);
	});

	it("should handle empty variables", () => {
		const buttonSelector = selector(".button", {
			padding: "0.5rem 1rem",
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\tpadding: 0.5rem 1rem;
}`);
	});

	it("should handle empty children", () => {
		const buttonSelector = selector(".button", ({ variable }) => {
			variable("button-color", "#006cff");

			return {
				padding: "0.5rem 1rem",
			};
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\t--button-color: #006cff;
\t
\tpadding: 0.5rem 1rem;
}`);
	});

	it("should handle completely empty selector", () => {
		const emptySelector = selector(".empty", {});

		const result = consumeSelector(emptySelector, options);

		expect(result).toBe(`.empty {}`);
	});

	it("should respect custom indentation in options", () => {
		const customOptions: StyleframeOptions = {
			indent: "    ", // 4 spaces instead of default 2
		};

		const buttonSelector = selector(".button", {
			padding: "0.5rem 1rem",
			backgroundColor: "#006cff",
		});

		const result = consumeSelector(buttonSelector, customOptions);

		expect(result).toBe(`.button {
\tpadding: 0.5rem 1rem;
\tbackground-color: #006cff;
}`);
	});

	it("should handle nested children multiple levels deep", () => {
		const buttonSelector = selector(".button", ({ selector }) => {
			selector("&:hover", ({ selector }) => {
				selector("&:active", {
					transform: "scale(0.98)",
				});

				return {
					backgroundColor: "#0056cc",
				};
			});

			return {
				padding: "0.5rem 1rem",
				backgroundColor: "#006cff",
			};
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\tpadding: 0.5rem 1rem;
\tbackground-color: #006cff;
\t
\t&:hover {
\t\tbackground-color: #0056cc;
\t\t
\t\t&:active {
\t\t\ttransform: scale(0.98);
\t\t}
\t}
}`);
	});

	it("should handle complex nested selector structures", () => {
		const buttonSelector = selector(".button", ({ selector, variable }) => {
			const colorVar = variable("button-color", "#006cff");

			selector("&:hover", ({ selector }) => {
				selector("&:active", {
					transform: "scale(0.98)",
				});

				return {
					backgroundColor: "#0056cc",
				};
			});

			selector("& > .icon", {
				marginRight: "0.5rem",
			});

			return {
				padding: "0.5rem 1rem",
				backgroundColor: ref(colorVar),
				display: "flex",
				alignItems: "center",
			};
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\t--button-color: #006cff;
\t
\tpadding: 0.5rem 1rem;
\tbackground-color: var(--button-color);
\tdisplay: flex;
\talign-items: center;
\t
\t&:hover {
\t\tbackground-color: #0056cc;
\t\t
\t\t&:active {
\t\t\ttransform: scale(0.98);
\t\t}
\t}
\t
\t& > .icon {
\t\tmargin-right: 0.5rem;
\t}
}`);
	});

	it("should handle selectors with inline nesting syntax", () => {
		const cardSelector = selector(".card", {
			padding: "1rem",
			borderRadius: "8px",

			// Inline nested selectors
			".card-title": {
				fontSize: "1.5rem",
				fontWeight: "bold",
			},

			".card-content": {
				marginTop: "0.5rem",
			},
		});

		// Extract the created nested selectors
		const nestedSelectors = cardSelector.children.filter((child) => isSelector(child));

		// Confirm we have the expected nested selectors
		expect(nestedSelectors.length).toBe(2);

		const result = consumeSelector(cardSelector, options);

		expect(result).toBe(`.card {
\tpadding: 1rem;
\tborder-radius: 8px;
\t
\t.card-title {
\t\tfont-size: 1.5rem;
\t\tfont-weight: bold;
\t}
\t
\t.card-content {
\t\tmargin-top: 0.5rem;
\t}
}`);
	});

	it("should handle selectors with pseudo-classes", () => {
		const buttonSelector = selector(".button", {
			padding: "0.5rem 1rem",
			backgroundColor: "#006cff",
			color: "white",
			transition: "background-color 0.2s",

			"&:hover": {
				backgroundColor: "#0056cc",
			},

			"&:active": {
				backgroundColor: "#004099",
			},

			"&::before": {
				content: '""',
				display: "inline-block",
				marginRight: "0.5rem",
			},
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\tpadding: 0.5rem 1rem;
\tbackground-color: #006cff;
\tcolor: white;
\ttransition: background-color 0.2s;
\t
\t&:hover {
\t\tbackground-color: #0056cc;
\t}
\t
\t&:active {
\t\tbackground-color: #004099;
\t}
\t
\t&::before {
\t\tcontent: "";
\t\tdisplay: inline-block;
\t\tmargin-right: 0.5rem;
\t}
}`);
	});

	it("should handle selectors with variable references for consistent theming", () => {
		const buttonSelector = selector(".button", ({ variable }) => {
			const borderRadiusSm = variable("border-radius-sm", "4px");
			const colorPrimary = variable("color-primary", "#006cff");
			const colorPrimaryDark = variable("color-primary-dark", "#0056cc");
			const spacingMd = variable("spacing-md", "1rem");

			return {
				backgroundColor: ref(colorPrimary),
				borderRadius: ref(borderRadiusSm),
				color: "white",
				padding: ref(spacingMd),

				"&:hover": {
					backgroundColor: ref(colorPrimaryDark),
				},
			};
		});

		const result = consumeSelector(buttonSelector, options);

		expect(result).toBe(`.button {
\t--border-radius-sm: 4px;
\t--color-primary: #006cff;
\t--color-primary-dark: #0056cc;
\t--spacing-md: 1rem;
\t
\tbackground-color: var(--color-primary);
\tborder-radius: var(--border-radius-sm);
\tcolor: white;
\tpadding: var(--spacing-md);
\t
\t&:hover {
\t\tbackground-color: var(--color-primary-dark);
\t}
}`);
	});

	it("should handle selectors with media query nesting", () => {
		const cardSelector = selector(".card", {
			width: "100%",
			padding: "1rem",

			"@media (min-width: 768px)": {
				width: "50%",
				padding: "2rem",
			},
		});

		const result = consumeSelector(cardSelector, options);

		expect(result).toBe(`.card {
\twidth: 100%;
\tpadding: 1rem;
\t
\t@media (min-width: 768px) {
\t\twidth: 50%;
\t\tpadding: 2rem;
\t}
}`);
	});

	it("should handle selectors with calc() expressions", () => {
		const spacingBase = variable("spacing-base", "8px");

		const containerSelector = selector(".container", {
			padding: "calc(2 * 1rem)",
			margin: css`calc(${ref(spacingBase)} * 2)`,
			width: "calc(100% - 2rem)",
		});

		const result = consumeSelector(containerSelector, options);

		expect(result).toBe(`.container {
\tpadding: calc(2 * 1rem);
\tmargin: calc(var(--spacing-base) * 2);
\twidth: calc(100% - 2rem);
}`);
	});
});
