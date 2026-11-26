import type { AtRule, Root, StyleframeOptions, Variable } from "@styleframe/core";
import { createPropertyFunction, createRoot } from "@styleframe/core";

import { consume } from "./consume";

describe("property() CSS output", () => {
	let root: Root;
	let property: ReturnType<typeof createPropertyFunction>;
	const options: StyleframeOptions = {};

	beforeEach(() => {
		root = createRoot();
		property = createPropertyFunction(root, root);
	});

	function propertyRule(name: string): AtRule {
		const rule = root.children.find(
			(child): child is AtRule =>
				child.type === "at-rule" && child.identifier === "property" && child.rule === name,
		);
		if (!rule) {
			throw new Error(`missing @property rule ${name}`);
		}
		return rule;
	}

	it("emits the @property registration block", () => {
		property("space", "0px", { syntax: "<length>" });

		expect(consume(propertyRule("--space"), options)).toBe(`@property --space {
\tsyntax: "<length>";
\tinherits: false;
\tinitial-value: 0px;
}`);
	});

	it("emits the value declaration through the normal variable path", () => {
		const instance = property("space", "0px", {
			syntax: "<length>",
		}) as Variable;

		expect(consume(instance, options)).toBe("--space: 0px;");
	});
});
