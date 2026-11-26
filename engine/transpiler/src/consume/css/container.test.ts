import type { DeclarationsBlock, Root, StyleframeOptions } from "@styleframe/core";
import {
	createRefFunction,
	createRoot,
	createSelectorFunction,
	createVariableFunction,
} from "@styleframe/core";

import { consume } from "./consume";
import { createContainerConsumer } from "./container";

describe("createContainerConsumer", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;
	let selector: ReturnType<typeof createSelectorFunction>;

	const consumeContainer = createContainerConsumer(consume);
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
		selector = createSelectorFunction(root, root);
	});

	it("should handle empty container with only query", () => {
		const result = consumeContainer(
			".test",
			{
				variables: [],
				declarations: {},
				children: [],
			},
			options,
		);
		expect(result).toBe(".test {}");
	});

	it("should handle container with only variables", () => {
		const colorVar = variable("color", "#ff0000");
		const result = consumeContainer(
			".test",
			{
				variables: [colorVar],
				declarations: {},
				children: [],
			},
			options,
		);
		expect(result).toBe(`.test {
\t--color: #ff0000;
}`);
	});

	it("should handle container with only declarations", () => {
		const declarations: DeclarationsBlock = {
			color: "red",
			"font-size": "16px",
		};
		const result = consumeContainer(
			".test",
			{
				variables: [],
				declarations,
				children: [],
			},
			options,
		);
		expect(result).toBe(`.test {
\tcolor: red;
\tfont-size: 16px;
}`);
	});

	it("should handle container with only children", () => {
		const childSelector = selector("&:hover", {
			color: "blue",
		});
		const result = consumeContainer(
			".test",
			{
				variables: [],
				declarations: {},
				children: [childSelector],
			},
			options,
		);
		expect(result).toBe(`.test {
\t&:hover {
\t\tcolor: blue;
\t}
}`);
	});

	it("should handle container with variables and declarations", () => {
		const colorVar = variable("primary", "#0066ff");
		const declarations: DeclarationsBlock = {
			color: ref(colorVar),
		};
		const result = consumeContainer(
			".button",
			{
				variables: [colorVar],
				declarations,
				children: [],
			},
			options,
		);
		expect(result).toBe(`.button {
\t--primary: #0066ff;
\t
\tcolor: var(--primary);
}`);
	});

	it("should handle container with variables and children", () => {
		const colorVar = variable("hover-color", "#ff6b6b");
		const childSelector = selector("&:hover", {
			color: ref(colorVar),
		});
		const result = consumeContainer(
			".card",
			{
				variables: [colorVar],
				declarations: {},
				children: [childSelector],
			},
			options,
		);
		expect(result).toBe(`.card {
\t--hover-color: #ff6b6b;
\t
\t&:hover {
\t\tcolor: var(--hover-color);
\t}
}`);
	});

	it("should handle container with declarations and children", () => {
		const declarations: DeclarationsBlock = {
			display: "flex",
			"align-items": "center",
		};
		const childSelector = selector("&:focus", {
			outline: "2px solid blue",
		});
		const result = consumeContainer(
			".component",
			{
				variables: [],
				declarations,
				children: [childSelector],
			},
			options,
		);
		expect(result).toBe(`.component {
\tdisplay: flex;
\talign-items: center;
\t
\t&:focus {
\t\toutline: 2px solid blue;
\t}
}`);
	});

	it("should handle container with variables, declarations, and children", () => {
		const sizeVar = variable("size", "1rem");
		const colorVar = variable("text-color", "#333");
		const declarations: DeclarationsBlock = {
			"font-size": ref(sizeVar),
			color: ref(colorVar),
		};
		const hoverSelector = selector("&:hover", {
			transform: "scale(1.05)",
		});
		const focusSelector = selector("&:focus", {
			outline: "2px solid currentColor",
		});

		const result = consumeContainer(
			".interactive",
			{
				variables: [sizeVar, colorVar],
				declarations,
				children: [hoverSelector, focusSelector],
			},
			options,
		);

		const expected = `.interactive {
\t--size: 1rem;
\t--text-color: #333;
\t
\tfont-size: var(--size);
\tcolor: var(--text-color);
\t
\t&:hover {
\t\ttransform: scale(1.05);
\t}
\t
\t&:focus {
\t\toutline: 2px solid currentColor;
\t}
}`;
		expect(result).toBe(expected);
	});

	it("should handle multiple variables of same type", () => {
		const primaryVar = variable("primary", "#0066ff");
		const secondaryVar = variable("secondary", "#ff6b6b");
		const accentVar = variable("accent", "#00cc66");

		const result = consumeContainer(
			".theme",
			{
				variables: [primaryVar, secondaryVar, accentVar],
				declarations: {},
				children: [],
			},
			options,
		);

		const expected = `.theme {
\t--primary: #0066ff;
\t--secondary: #ff6b6b;
\t--accent: #00cc66;
}`;
		expect(result).toBe(expected);
	});

	it("should handle multiple children selectors", () => {
		const child1 = selector("& > .item", {
			margin: "0.5rem",
		});
		const child2 = selector("& .nested", {
			padding: "1rem",
		});
		const child3 = selector("&::before", {
			content: '""',
			position: "absolute",
		});

		const result = consumeContainer(
			".container",
			{
				variables: [],
				declarations: {},
				children: [child1, child2, child3],
			},
			options,
		);

		const expected = `.container {
\t& > .item {
\t\tmargin: 0.5rem;
\t}
\t
\t& .nested {
\t\tpadding: 1rem;
\t}
\t
\t&::before {
\t\tcontent: "";
\t\tposition: absolute;
\t}
}`;
		expect(result).toBe(expected);
	});

	it("should handle complex query strings", () => {
		const result = consumeContainer(
			"@media (min-width: 768px) and (max-width: 1024px)",
			{
				variables: [],
				declarations: { display: "grid" },
				children: [],
			},
			options,
		);
		expect(result).toBe(`@media (min-width: 768px) and (max-width: 1024px) {
\tdisplay: grid;
}`);
	});

	it("should handle nested container structures", () => {
		const parentChild = selector("& .parent", ({ selector }) => {
			selector("& .deeply-nested", {
				"font-weight": "bold",
			});

			return {
				position: "relative",
			};
		});

		const result = consumeContainer(
			".root",
			{
				variables: [],
				declarations: {},
				children: [parentChild],
			},
			options,
		);

		const expected = `.root {
\t& .parent {
\t\tposition: relative;
\t\t
\t\t& .deeply-nested {
\t\t\tfont-weight: bold;
\t\t}
\t}
}`;
		expect(result).toBe(expected);
	});

	it("should handle container with custom options prefix", () => {
		const prefixOptions: StyleframeOptions = {
			variables: {
				name: ({ name }) => `--sf-${name}`,
			},
		};
		const colorVar = variable("primary", "#0066ff");
		const declarations: DeclarationsBlock = {
			color: ref(colorVar),
		};

		const result = consumeContainer(
			".component",
			{
				variables: [colorVar],
				declarations,
				children: [],
			},
			prefixOptions,
		);

		expect(result).toBe(`.component {
\t--sf-primary: #0066ff;
\t
\tcolor: var(--sf-primary);
}`);
	});

	it("should handle variables with complex values", () => {
		const gradientVar = variable("gradient", "linear-gradient(45deg, #ff0000, #0000ff)");
		const shadowVar = variable(
			"shadow",
			"0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
		);

		const result = consumeContainer(
			".complex",
			{
				variables: [gradientVar, shadowVar],
				declarations: {},
				children: [],
			},
			options,
		);

		const expected = `.complex {
\t--gradient: linear-gradient(45deg, #ff0000, #0000ff);
\t--shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
}`;
		expect(result).toBe(expected);
	});

	it("should handle declarations with reference values", () => {
		const sizeVar = variable("base-size", "16px");
		const declarations: DeclarationsBlock = {
			"font-size": ref(sizeVar),
			"line-height": ref("line-height-normal", "1.5"),
			padding: ref("spacing", "1rem"),
		};

		const result = consumeContainer(
			".text",
			{
				variables: [sizeVar],
				declarations,
				children: [],
			},
			options,
		);

		const expected = `.text {
\t--base-size: 16px;
\t
\tfont-size: var(--base-size);
\tline-height: var(--line-height-normal, 1.5);
\tpadding: var(--spacing, 1rem);
}`;
		expect(result).toBe(expected);
	});

	it("should handle :root selector specially", () => {
		const colorVar = variable("primary", "#0066ff");
		const childSelector = selector(".button", {
			color: ref(colorVar),
		});

		const result = consumeContainer(
			":root",
			{
				variables: [colorVar],
				declarations: { fontSize: "16px" },
				children: [childSelector],
			},
			options,
		);

		const expected = `:root {
\t--primary: #0066ff;
\t
\tfont-size: 16px;
}

.button {
\tcolor: var(--primary);
}`;
		expect(result).toBe(expected);
	});

	it("should handle :root with only variables", () => {
		const colorVar = variable("primary", "#0066ff");

		const result = consumeContainer(
			":root",
			{
				variables: [colorVar],
				declarations: {},
				children: [],
			},
			options,
		);

		const expected = `:root {
\t--primary: #0066ff;
}`;
		expect(result).toBe(expected);
	});

	it("should handle :root with only declarations", () => {
		const result = consumeContainer(
			":root",
			{
				variables: [],
				declarations: { fontSize: "16px" },
				children: [],
			},
			options,
		);

		const expected = `:root {
\tfont-size: 16px;
}`;
		expect(result).toBe(expected);
	});

	it("should handle :root with only children", () => {
		const childSelector = selector(".button", {
			color: "red",
		});

		const result = consumeContainer(
			":root",
			{
				variables: [],
				declarations: {},
				children: [childSelector],
			},
			options,
		);

		const expected = `.button {
\tcolor: red;
}`;
		expect(result).toBe(expected);
	});

	it("should handle container with undefined properties gracefully", () => {
		const result = consumeContainer(
			".test",
			{
				// All properties are optional, so we can omit them
			},
			options,
		);
		expect(result).toBe(".test {}");
	});
});
