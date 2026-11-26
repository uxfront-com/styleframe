import type { AtRule, Root } from "../types";
import { createPropertyFunction } from "./property";
import { createRoot } from "./root";
import { createSelectorFunction } from "./selector";

function findPropertyRule(root: Root, name: string): AtRule | undefined {
	return root.children.find(
		(child): child is AtRule =>
			child.type === "at-rule" && child.identifier === "property" && child.rule === name,
	);
}

describe("createPropertyFunction", () => {
	let root: Root;
	let property: ReturnType<typeof createPropertyFunction>;

	beforeEach(() => {
		root = createRoot();
		property = createPropertyFunction(root, root);
	});

	it("should create the underlying variable and return it", () => {
		const result = property("space", "0px", { syntax: "<length>" });

		expect(result).toEqual({
			type: "variable",
			id: expect.any(String),
			name: "space",
			value: "0px",
			parentId: expect.any(String),
		});
		expect(root.variables).toHaveLength(1);
		expect(root.variables[0]).toBe(result);
	});

	it("should register an @property at-rule on root", () => {
		property("space", "0px", { syntax: "<length>" });

		const rule = findPropertyRule(root, "--space");
		expect(rule).toBeDefined();
		expect(rule?.declarations).toEqual({
			syntax: '"<length>"',
			inherits: "false",
			"initial-value": "0px",
		});
	});

	it("should default inherits to false and honor inherits: true", () => {
		property("a", "0px", { syntax: "<length>" });
		property("b", "0px", { syntax: "<length>", inherits: true });

		expect(findPropertyRule(root, "--a")?.declarations.inherits).toBe("false");
		expect(findPropertyRule(root, "--b")?.declarations.inherits).toBe("true");
	});

	it("should default initial-value to the variable value", () => {
		property("brand", "#006cff", { syntax: "<color>" });

		expect(findPropertyRule(root, "--brand")?.declarations["initial-value"]).toBe("#006cff");
	});

	it("should honor an explicit initialValue", () => {
		property("space", "1rem", { syntax: "<length>", initialValue: "0px" });

		const rule = findPropertyRule(root, "--space");
		expect(rule?.declarations["initial-value"]).toBe("0px");
		expect(root.variables[0]?.value).toBe("1rem");
	});

	it("should register the @property block only once per name", () => {
		property("space", "0px", { syntax: "<length>" });
		const updated = property("space", "4px", { syntax: "<length>" });

		const propertyRules = root.children.filter(
			(child) => child.type === "at-rule" && child.identifier === "property",
		);
		expect(propertyRules).toHaveLength(1);
		// The value declaration still updates through the variable factory.
		expect(updated.value).toBe("4px");
		expect(root.variables).toHaveLength(1);
	});

	it("should support numeric values", () => {
		property("z", 10, { syntax: "<number>" });

		expect(findPropertyRule(root, "--z")?.declarations["initial-value"]).toBe(10);
	});

	it("should keep the value declaration local while hoisting @property to root", () => {
		const selector = createSelectorFunction(root, root);
		const card = selector(".card", ({ property }) => {
			property("card-space", "4px", { syntax: "<length>" });
			return {};
		});

		// The value declaration lives in the calling container.
		expect(card.variables).toHaveLength(1);
		expect(card.variables[0]?.name).toBe("card-space");

		// The @property registration hoists to root, not the child container.
		expect(findPropertyRule(root, "--card-space")).toBeDefined();
		expect(
			card.children.some((child) => child.type === "at-rule" && child.identifier === "property"),
		).toBe(false);
	});
});
