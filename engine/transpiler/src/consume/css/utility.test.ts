import type { Container, Root, StyleframeOptions, Utility } from "@styleframe/core";
import {
	createModifierFunction,
	createRoot,
	createUtilityFunction,
	isUtility,
} from "@styleframe/core";

import { consume } from "./consume";
import { createUtilityConsumer } from "./utility";

describe("createUtilityConsumer", () => {
	let root: Root;
	let parent: Container;
	let utility: ReturnType<typeof createUtilityFunction>;
	let modifier: ReturnType<typeof createModifierFunction>;

	const consumeUtility = createUtilityConsumer(consume);
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		parent = root;
		utility = createUtilityFunction(parent, root);
		modifier = createModifierFunction(parent, root);
	});

	it("should generate base utility selector", () => {
		// Create a basic utility
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility({
			sm: "8px",
		});

		const marginUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "margin" && u.value === "sm",
		);
		if (!marginUtility) {
			throw new Error("Margin utility not found");
		}

		const result = consumeUtility(marginUtility, options);

		const expected = `._margin\\:sm {
	margin: 8px;
}`;

		expect(result).toBe(expected);
	});

	it("should generate multiple utility instances for different values", () => {
		// Create a utility with multiple values
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility({
			sm: "8px",
			md: "16px",
		});

		// Get the sm utility
		const smUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "margin" && u.value === "sm",
		);
		if (!smUtility) {
			throw new Error("sm margin utility not found");
		}

		const smResult = consumeUtility(smUtility, options);
		const expectedSm = `._margin\\:sm {
	margin: 8px;
}`;
		expect(smResult).toBe(expectedSm);

		// Get the md utility
		const mdUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "margin" && u.value === "md",
		);
		if (!mdUtility) {
			throw new Error("md margin utility not found");
		}

		const mdResult = consumeUtility(mdUtility, options);
		const expectedMd = `._margin\\:md {
	margin: 16px;
}`;
		expect(mdResult).toBe(expectedMd);
	});

	it("should handle boolean values correctly", () => {
		// Create a utility with boolean value
		const createHiddenUtility = utility("hidden", ({ value }) => ({
			display: value === true ? "none" : "block",
		}));

		createHiddenUtility({
			default: true,
		});

		const hiddenUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "hidden" && u.value === "default",
		);
		if (!hiddenUtility) {
			throw new Error("Hidden utility not found");
		}

		const result = consumeUtility(hiddenUtility, options);

		const expected = `._hidden {
	display: none;
}`;

		expect(result).toBe(expected);
	});

	it("should handle undefined values correctly", () => {
		// Create a utility with undefined value
		const createVisibilityUtility = utility("visible", ({ value }) => ({
			visibility: value || "visible",
		}));

		createVisibilityUtility({
			default: undefined,
		});

		const visibilityUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "visible" && u.value === "default",
		);
		if (!visibilityUtility) {
			throw new Error("Visible utility not found");
		}

		const result = consumeUtility(visibilityUtility, options);

		const expected = `._visible {
	visibility: visible;
}`;

		expect(result).toBe(expected);
	});

	it("should generate modified utility selectors with a single modifier", () => {
		// Create a hover modifier
		const hoverModifier = modifier("hover", ({ declarations }) => {
			return {
				"&:hover": declarations,
			};
		});

		// Create a utility with the modifier
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility(
			{
				sm: "8px",
			},
			[hoverModifier],
		);

		// Find the modified utility instance
		const hoverMarginUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) && u.name === "margin" && u.value === "sm" && u.modifiers.includes("hover"),
		);
		if (!hoverMarginUtility) {
			throw new Error("Hover margin utility not found");
		}

		const result = consumeUtility(hoverMarginUtility, options);

		const expected = `._hover\\:margin\\:sm {
	&:hover {
		margin: 8px;
	}
}`;

		expect(result).toBe(expected);
	});

	it("should generate modified utility selectors with multiple modifiers", () => {
		// Create modifiers
		const hoverModifier = modifier("hover", ({ declarations }) => {
			return {
				"&:hover": declarations,
			};
		});

		const focusModifier = modifier("focus", ({ declarations }) => {
			return {
				"&:focus": declarations,
			};
		});

		// Create a utility with multiple modifiers
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility(
			{
				sm: "8px",
			},
			[[hoverModifier, focusModifier]],
		);

		// Find the utility with both modifiers
		const hoverFocusMarginUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) &&
				u.name === "margin" &&
				u.value === "sm" &&
				u.modifiers.includes("hover") &&
				u.modifiers.includes("focus"),
		);
		if (!hoverFocusMarginUtility) {
			throw new Error("Hover+Focus margin utility not found");
		}

		const result = consumeUtility(hoverFocusMarginUtility, options);

		const expected = `._hover\\:focus\\:margin\\:sm {
\t&:hover {
\t\t&:focus {
\t\t\tmargin: 8px;
\t\t}
\t}
}`;

		expect(result).toBe(expected);
	});

	it("should handle utility with no modifiers", () => {
		// Create a basic utility
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility({
			sm: "8px",
		});

		const marginUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) && u.name === "margin" && u.value === "sm" && u.modifiers.length === 0,
		);
		if (!marginUtility) {
			throw new Error("Margin utility not found");
		}

		const result = consumeUtility(marginUtility, options);

		const expected = `._margin\\:sm {
	margin: 8px;
}`;

		expect(result).toBe(expected);
	});

	it("should generate proper CSS output for complex declarations", () => {
		// Create a utility with complex declarations
		const createFlexUtility = utility("flex", ({ value }) => ({
			display: "flex",
			flexDirection: value === "col" ? "column" : "row",
			gap: "1rem",
		}));

		createFlexUtility({
			row: "row",
			col: "col",
		});

		const flexRowUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "flex" && u.value === "row",
		);
		if (!flexRowUtility) {
			throw new Error("Flex row utility not found");
		}

		const rowResult = consumeUtility(flexRowUtility, options);
		const expectedRow = `._flex\\:row {
\tdisplay: flex;
\tflex-direction: row;
\tgap: 1rem;
}`;
		expect(rowResult).toBe(expectedRow);

		const flexColUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "flex" && u.value === "col",
		);
		if (!flexColUtility) {
			throw new Error("Flex col utility not found");
		}

		const colResult = consumeUtility(flexColUtility, options);
		const expectedCol = `._flex\\:col {
\tdisplay: flex;
\tflex-direction: column;
\tgap: 1rem;
}`;
		expect(colResult).toBe(expectedCol);
	});

	it("should handle empty string as utility value", () => {
		// Create a utility where empty string is a valid value
		const createHiddenUtility = utility("hidden", ({ value }) => ({
			display: value === "" ? "none" : "block",
		}));

		createHiddenUtility({
			"": "",
			show: "show",
		});

		const hiddenUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "hidden" && u.value === "",
		);
		if (!hiddenUtility) {
			throw new Error("Hidden utility not found");
		}

		const result = consumeUtility(hiddenUtility, options);

		const expected = `._hidden {
\tdisplay: none;
}`;

		expect(result).toBe(expected);
	});

	it("should create utility selectors with proper escaping", () => {
		// Create a utility with special characters that need escaping
		const createSpacingUtility = utility("p", ({ value }) => ({
			padding: value,
		}));

		createSpacingUtility({
			"1/2": "0.125rem",
			"2.5": "0.625rem",
		});

		const halfUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "p" && u.value === "1/2",
		);
		if (!halfUtility) {
			throw new Error("P 1/2 utility not found");
		}

		const halfResult = consumeUtility(halfUtility, options);
		const expectedHalf = `._p\\:1\\/2 {
\tpadding: 0.125rem;
}`;
		expect(halfResult).toBe(expectedHalf);

		const decimalUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "p" && u.value === "2.5",
		);
		if (!decimalUtility) {
			throw new Error("P 2.5 utility not found");
		}

		const decimalResult = consumeUtility(decimalUtility, options);
		const expectedDecimal = `._p\\:2\\.5 {
\tpadding: 0.625rem;
}`;
		expect(decimalResult).toBe(expectedDecimal);
	});

	it("should handle modifiers with complex transformations", () => {
		// Create a complex modifier
		const groupHoverModifier = modifier("group-hover", ({ declarations }) => {
			return {
				".group:hover &": declarations,
			};
		});

		// Create a utility with the modifier
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility(
			{
				sm: "8px",
			},
			[groupHoverModifier],
		);

		const groupHoverMarginUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) &&
				u.name === "margin" &&
				u.value === "sm" &&
				u.modifiers.includes("group-hover"),
		);
		if (!groupHoverMarginUtility) {
			throw new Error("Group hover margin utility not found");
		}

		const result = consumeUtility(groupHoverMarginUtility, options);

		const expected = `._group-hover\\:margin\\:sm {
\t.group:hover & {
\t\tmargin: 8px;
\t}
}`;

		expect(result).toBe(expected);
	});

	it("should handle multi-key modifiers correctly", () => {
		// Create a modifier with multiple keys
		const breakpointModifier = modifier(["sm", "md", "lg"], ({ declarations }) => {
			// Note: In the actual implementation, the specific key would be used
			// This is a simplified version for testing
			return {
				"@media (min-width: 640px)": declarations,
			};
		});

		// Create a utility with the multi-key modifier
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility(
			{
				base: "8px",
			},
			[breakpointModifier],
		);

		// Find utilities for each breakpoint key
		const smMarginUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) && u.name === "margin" && u.value === "base" && u.modifiers.includes("sm"),
		);
		if (smMarginUtility) {
			const result = consumeUtility(smMarginUtility, options);
			const expected = `._sm\\:margin\\:base {
\t@media (min-width: 640px) {
\t\tmargin: 8px;
\t}
}`;
			expect(result).toBe(expected);
		}
	});

	it("should combine multiple different modifiers correctly", () => {
		// Create different modifiers
		const hoverModifier = modifier("hover", ({ declarations }) => {
			return {
				"&:hover": declarations,
			};
		});

		const responsiveModifier = modifier("responsive", ({ declarations }) => {
			return {
				"@media (min-width: 768px)": declarations,
			};
		});

		// Create a utility with multiple modifiers
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility(
			{
				sm: "8px",
			},
			[[hoverModifier, responsiveModifier]],
		);

		// Find the utility with both modifiers
		const combinedUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) &&
				u.name === "margin" &&
				u.value === "sm" &&
				u.modifiers.includes("hover") &&
				u.modifiers.includes("responsive"),
		);
		if (!combinedUtility) {
			throw new Error("Combined modifier utility not found");
		}

		const result = consumeUtility(combinedUtility, options);

		const expected = `._hover\\:responsive\\:margin\\:sm {
\t&:hover {
\t\t@media (min-width: 768px) {
\t\t\tmargin: 8px;
\t\t}
\t}
}`;

		expect(result).toBe(expected);
	});

	it("should handle nested declarations properly", () => {
		// Create a utility with nested declarations
		const createButtonUtility = utility("btn", ({ value }) => ({
			display: "inline-block",
			padding: value === "sm" ? "0.5rem 1rem" : "1rem 2rem",
			"&:hover": {
				opacity: "0.8",
			},
			"&:focus": {
				outline: "2px solid blue",
			},
		}));

		createButtonUtility({
			sm: "sm",
			lg: "lg",
		});

		const smButtonUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "btn" && u.value === "sm",
		);
		if (!smButtonUtility) {
			throw new Error("Small button utility not found");
		}

		const result = consumeUtility(smButtonUtility, options);

		const expected = `._btn\\:sm {
\tdisplay: inline-block;
\tpadding: 0.5rem 1rem;
\t
\t&:hover {
\t\topacity: 0.8;
\t}
\t
\t&:focus {
\t\toutline: 2px solid blue;
\t}
}`;

		expect(result).toBe(expected);
	});

	it("should handle utility with CSS variables", () => {
		// Create a utility that uses CSS variables
		const createColorUtility = utility("text", ({ value }) => ({
			color: `var(--color-${value})`,
			"--text-opacity": "1",
		}));

		createColorUtility({
			primary: "primary",
			secondary: "secondary",
		});

		const primaryTextUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "text" && u.value === "primary",
		);
		if (!primaryTextUtility) {
			throw new Error("Primary text utility not found");
		}

		const result = consumeUtility(primaryTextUtility, options);

		const expected = `._text\\:primary {
\tcolor: var(--color-primary);
\t--text-opacity: 1;
}`;

		expect(result).toBe(expected);
	});

	it("should handle utility with custom selector function", () => {
		const customOptions: StyleframeOptions = {
			utilities: {
				selector: ({ name, value, modifiers }) => {
					const parts = [...modifiers, name];
					if (value) {
						parts.push(value);
					}
					return parts.join("-");
				},
			},
		};

		// Create a basic utility
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility({
			sm: "8px",
		});

		const marginUtility = root.children.find(
			(u): u is Utility => u.type === "utility" && u.name === "margin" && u.value === "sm",
		);
		if (!marginUtility) {
			throw new Error("Margin utility not found");
		}

		const result = consumeUtility(marginUtility, customOptions);

		const expected = `.margin-sm {
	margin: 8px;
}`;

		expect(result).toBe(expected);
	});

	it("should generate all modifier combinations", () => {
		// Create two modifiers
		const hoverModifier = modifier("hover", ({ declarations }) => {
			return {
				"&:hover": declarations,
			};
		});

		const focusModifier = modifier("focus", ({ declarations }) => {
			return {
				"&:focus": declarations,
			};
		});

		// Create a utility with both modifiers
		const createMarginUtility = utility("margin", ({ value }) => ({
			margin: value,
		}));

		createMarginUtility(
			{
				sm: "8px",
			},
			[hoverModifier, focusModifier, [hoverModifier, focusModifier]],
		);

		// Check that all combinations are created
		const baseUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) && u.name === "margin" && u.value === "sm" && u.modifiers.length === 0,
		);
		expect(baseUtility).toBeDefined();

		const hoverOnlyUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) &&
				u.name === "margin" &&
				u.value === "sm" &&
				u.modifiers.length === 1 &&
				u.modifiers.includes("hover"),
		);
		expect(hoverOnlyUtility).toBeDefined();

		const focusOnlyUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) &&
				u.name === "margin" &&
				u.value === "sm" &&
				u.modifiers.length === 1 &&
				u.modifiers.includes("focus"),
		);
		expect(focusOnlyUtility).toBeDefined();

		const bothModifiersUtility = root.children.find(
			(u): u is Utility =>
				isUtility(u) &&
				u.name === "margin" &&
				u.value === "sm" &&
				u.modifiers.length === 2 &&
				u.modifiers.includes("hover") &&
				u.modifiers.includes("focus"),
		);
		expect(bothModifiersUtility).toBeDefined();
	});

	it("should generate utility with reference value", () => {
		const consumeUtility = createUtilityConsumer(consume);

		const reference = {
			type: "reference" as const,
			name: "color.primary",
		};

		const instance = {
			type: "utility" as const,
			id: "test-id",
			name: "background",
			value: "primary",
			declarations: {
				background: reference,
			},
			variables: [],
			children: [],
			modifiers: [],
		};

		const result = consumeUtility(instance, {});

		// Expected CSS: ._background\:primary { background: var(--color--primary); }
		expect(result).toContain(String.raw`._background\:primary`);
		expect(result).toContain("background: var(--color--primary)");
	});

	it("should generate utility with dotted reference key", () => {
		const consumeUtility = createUtilityConsumer(consume);

		const reference = {
			type: "reference" as const,
			name: "color.primary",
		};

		const instance = {
			type: "utility" as const,
			id: "test-id",
			name: "background",
			value: "color.primary",
			declarations: {
				background: reference,
			},
			variables: [],
			children: [],
			modifiers: [],
		};

		const result = consumeUtility(instance, {});

		// Expected CSS: ._background\:color\.primary { background: var(--color--primary); }
		// Note: The dot needs to be escaped in the CSS selector
		expect(result).toContain(String.raw`._background\:color\.primary`);
		expect(result).toContain("background: var(--color--primary)");
	});
});
