import type { Root, Selector, StyleframeOptions } from "@styleframe/core";
import { createRoot, createSelectorFunction } from "@styleframe/core";
import { createSelectorConsumer } from "./selector";

describe("createSelectorConsumer", () => {
	const mockConsume = vi.fn();
	const consumeSelector = createSelectorConsumer(mockConsume);
	const options: StyleframeOptions = {};

	let root: Root;
	let selector: ReturnType<typeof createSelectorFunction>;

	beforeEach(() => {
		mockConsume.mockClear();
		root = createRoot();
		selector = createSelectorFunction(root, root);
	});

	it("should return empty string for selector without _exportName", () => {
		const instance = selector(".button", {
			background: "blue",
			color: "white",
		});

		const result = consumeSelector(instance, options);

		expect(result).toEqual("");
	});

	it("should generate export for selector with _exportName", () => {
		const instance = selector(".button", {
			background: "blue",
			color: "white",
		});
		instance._exportName = "buttonSelector";

		const result = consumeSelector(instance, options);

		expect(result).toEqual(`export const buttonSelector = ".button";
`);
	});

	it("should handle selector with complex query", () => {
		const instance = selector(".button:hover, .button:focus", {
			opacity: "0.8",
		});
		instance._exportName = "buttonHoverSelector";

		const result = consumeSelector(instance, options);

		expect(result).toEqual(
			`export const buttonHoverSelector = ".button:hover, .button:focus";
`,
		);
	});

	it("should properly escape special characters in query via JSON.stringify", () => {
		const instance = selector('.button[data-value="test"]', {
			display: "block",
		});
		instance._exportName = "dataSelector";

		const result = consumeSelector(instance, options);

		// JSON.stringify will escape the inner quotes
		expect(result).toEqual(
			`export const dataSelector = ".button[data-value=\\"test\\"]";
`,
		);
	});

	it("should handle selector with newlines in query", () => {
		const instance: Selector = {
			type: "selector",
			id: "test-id",
			query: ".button,\n.link",
			declarations: {},
			variables: [],
			children: [],
			_exportName: "multilineSelector",
		};

		const result = consumeSelector(instance, options);

		// JSON.stringify escapes newlines as \n
		expect(result).toEqual(
			`export const multilineSelector = ".button,\\n.link";
`,
		);
	});

	it("should handle selector with backslashes in query", () => {
		const instance: Selector = {
			type: "selector",
			id: "test-id",
			query: String.raw`.icon\:home`,
			declarations: {},
			variables: [],
			children: [],
			_exportName: "escapedSelector",
		};

		const result = consumeSelector(instance, options);

		// JSON.stringify will escape backslashes
		expect(result).toEqual(
			`export const escapedSelector = ".icon\\\\:home";
`,
		);
	});

	it("should handle PascalCase export names", () => {
		const instance = selector(".Button", {
			padding: "1rem",
		});
		instance._exportName = "ButtonSelector";

		const result = consumeSelector(instance, options);

		expect(result).toEqual(`export const ButtonSelector = ".Button";
`);
	});

	it("should handle camelCase export names", () => {
		const instance = selector(".primary-button", {
			padding: "1rem",
		});
		instance._exportName = "primaryButtonSelector";

		const result = consumeSelector(instance, options);

		expect(result).toEqual(
			`export const primaryButtonSelector = ".primary-button";
`,
		);
	});

	it("should not call the consume function parameter", () => {
		const instance = selector(".test", {});
		instance._exportName = "testSelector";

		consumeSelector(instance, options);

		expect(mockConsume).not.toHaveBeenCalled();
	});

	it("should handle empty query string", () => {
		const instance: Selector = {
			type: "selector",
			id: "test-id",
			query: "",
			declarations: {},
			variables: [],
			children: [],
			_exportName: "emptySelector",
		};

		const result = consumeSelector(instance, options);

		expect(result).toEqual(`export const emptySelector = "";
`);
	});

	it("should handle id selector", () => {
		const instance = selector("#main-content", {
			width: "100%",
		});
		instance._exportName = "mainContentSelector";

		const result = consumeSelector(instance, options);

		expect(result).toEqual(
			`export const mainContentSelector = "#main-content";
`,
		);
	});

	it("should handle attribute selector with single quotes", () => {
		const instance: Selector = {
			type: "selector",
			id: "test-id",
			query: "[data-theme='dark']",
			declarations: {},
			variables: [],
			children: [],
			_exportName: "darkThemeSelector",
		};

		const result = consumeSelector(instance, options);

		expect(result).toEqual(
			`export const darkThemeSelector = "[data-theme='dark']";
`,
		);
	});

	it("should handle pseudo-element selector", () => {
		const instance = selector(".button::before", {
			content: '""',
		});
		instance._exportName = "buttonBeforeSelector";

		const result = consumeSelector(instance, options);

		expect(result).toEqual(
			`export const buttonBeforeSelector = ".button::before";
`,
		);
	});
});
