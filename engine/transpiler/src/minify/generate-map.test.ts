import type { Root } from "@styleframe/core";
import { describe, expect, it } from "vitest";

import { generateShorteningMap } from "./generate-map";

function mockUtility(
	name: string,
	values: Array<{ key: string; value: string; modifiers: Array<string> }> = [],
) {
	return {
		type: "utility" as const,
		name,
		values,
		factory: () => ({}),
		autogenerate: () => ({}),
		create: () => {},
	};
}

function createMockRoot(
	overrides: {
		utilities?: Array<ReturnType<typeof mockUtility>>;
		modifiers?: Root["modifiers"];
	} = {},
): Root {
	return {
		type: "root",
		id: "rt-test",
		declarations: {},
		utilities: overrides.utilities ?? [],
		modifiers: overrides.modifiers ?? [],
		recipes: [],
		variables: [],
		children: [],
		themes: [],
		_registry: new Map(),
		_usage: {
			variables: new Set(),
			utilities: new Set(),
			recipes: new Set(),
			recipeUtilities: new Map(),
		},
	};
}

describe("generateShorteningMap", () => {
	it("abbreviates property names by first letter of each kebab segment", () => {
		const root = createMockRoot({
			utilities: [mockUtility("margin-top"), mockUtility("border-width"), mockUtility("font-size")],
		});

		const map = generateShorteningMap(root);
		expect(map.p["margin-top"]).toBe("mt");
		expect(map.p["border-width"]).toBe("bw");
		expect(map.p["font-size"]).toBe("fs");
	});

	it("resolves property name collisions by extending last segment", () => {
		const root = createMockRoot({
			utilities: [mockUtility("border-width"), mockUtility("border-wrap")],
		});

		const map = generateShorteningMap(root);
		// First alphabetically gets the base abbreviation
		expect(map.p["border-width"]).toBe("bw");
		expect(map.p["border-wrap"]).toBe("bwr");
	});

	it("resolves three-way collisions", () => {
		const root = createMockRoot({
			utilities: [
				mockUtility("border-width"),
				mockUtility("border-wrap"),
				mockUtility("border-widget"),
			],
		});

		// border-width gets "bw" from defaults, so the other two compete for algorithmic names
		const map = generateShorteningMap(root, { properties: {} });
		expect(map.p["border-widget"]).toBe("bw");
		expect(map.p["border-width"]).toBe("bwi");
		expect(map.p["border-wrap"]).toBe("bwr");
	});

	it("abbreviates value keys", () => {
		const root = createMockRoot({
			utilities: [
				mockUtility("color", [
					{ key: "primary", value: "#007A99", modifiers: [] },
					{ key: "secondary", value: "#006cff", modifiers: [] },
					{ key: "sm", value: "small", modifiers: [] },
				]),
			],
		});

		const map = generateShorteningMap(root);
		expect(map.v["primary"]).toBe("p");
		expect(map.v["secondary"]).toBe("s");
		expect(map.v["sm"]).toBeUndefined();
	});

	it("resolves value collisions by extending", () => {
		const root = createMockRoot({
			utilities: [
				mockUtility("color", [
					{ key: "padding", value: "#2", modifiers: [] },
					{ key: "primary", value: "#1", modifiers: [] },
				]),
			],
		});

		const map = generateShorteningMap(root);
		// Alphabetical: padding first
		expect(map.v["padding"]).toBe("p");
		expect(map.v["primary"]).toBe("pr");
	});

	it("abbreviates modifier keys", () => {
		const root = createMockRoot({
			modifiers: [
				{ type: "modifier", key: ["hover"], factory: () => ({}) },
				{ type: "modifier", key: ["focus-within"], factory: () => ({}) },
			],
		});

		const map = generateShorteningMap(root);
		expect(map.m["hover"]).toBe("h");
		expect(map.m["focus-within"]).toBe("fw");
	});

	it("handles multiple modifier keys from a single modifier factory", () => {
		const root = createMockRoot({
			modifiers: [
				{
					type: "modifier",
					key: ["sm", "md", "lg", "xl"],
					factory: () => ({}),
				},
				{ type: "modifier", key: ["hover"], factory: () => ({}) },
				{
					type: "modifier",
					key: ["focus", "focus-within", "focus-visible"],
					factory: () => ({}),
				},
			],
		});

		const map = generateShorteningMap(root);
		expect(map.m["hover"]).toBe("h");
		expect(map.m["focus"]).toBe("f");
		expect(map.m["focus-within"]).toBe("fw");
		expect(map.m["focus-visible"]).toBe("fv");
		expect(map.m["sm"]).toBe("s");
		expect(map.m["md"]).toBe("m");
		expect(map.m["lg"]).toBe("l");
		expect(map.m["xl"]).toBe("x");
	});

	it("resolves modifier collisions by extending", () => {
		const root = createMockRoot({
			modifiers: [
				{ type: "modifier", key: ["focus-within"], factory: () => ({}) },
				{ type: "modifier", key: ["font-weight"], factory: () => ({}) },
			],
		});

		const map = generateShorteningMap(root);
		// "focus-within" is first alphabetically -> gets "fw"
		// "font-weight" extends last segment: "w" -> "we"
		expect(map.m["focus-within"]).toBe("fw");
		expect(map.m["font-weight"]).toBe("fwe");
	});

	it("skips values that are already short", () => {
		const root = createMockRoot({
			utilities: [
				mockUtility("padding", [
					{ key: "sm", value: "0.5rem", modifiers: [] },
					{ key: "2", value: "0.5rem", modifiers: [] },
				]),
			],
		});

		const map = generateShorteningMap(root);
		expect(map.v["sm"]).toBeUndefined();
		expect(map.v["2"]).toBeUndefined();
	});

	it("hashes long arbitrary bracket values", () => {
		const root = createMockRoot({
			utilities: [
				mockUtility("box-shadow", [
					{
						key: "[0_4px_6px_rgba(0,0,0,0.1)]",
						value: "0 4px 6px rgba(0,0,0,0.1)",
						modifiers: [],
					},
					{
						key: "[10px_20px_30px]",
						value: "10px 20px 30px",
						modifiers: [],
					},
				]),
			],
		});

		const map = generateShorteningMap(root);
		expect(map.v["[0_4px_6px_rgba(0,0,0,0.1)]"]).toMatch(/^\[[0-9a-f]{7}\]$/);
		expect(map.v["[10px_20px_30px]"]).toMatch(/^\[[0-9a-f]{7}\]$/);
	});

	it("skips hashing short arbitrary values where hash would be longer", () => {
		const root = createMockRoot({
			utilities: [
				mockUtility("padding", [
					{ key: "[16px]", value: "16px", modifiers: [] },
					{ key: "#1E3A8A", value: "#1E3A8A", modifiers: [] },
				]),
			],
		});

		const map = generateShorteningMap(root);
		expect(map.v["[16px]"]).toBeUndefined();
		expect(map.v["#1E3A8A"]).toBeUndefined();
	});

	it("produces deterministic output regardless of input order", () => {
		const makeRoot = (names: Array<string>) =>
			createMockRoot({
				utilities: names.map((name) => mockUtility(name)),
			});

		const map1 = generateShorteningMap(makeRoot(["margin-top", "margin-bottom", "margin-left"]));
		const map2 = generateShorteningMap(makeRoot(["margin-left", "margin-top", "margin-bottom"]));

		expect(map1.p).toEqual(map2.p);
	});

	it("does not shorten single-segment names that are already short", () => {
		const root = createMockRoot({
			utilities: [mockUtility("m"), mockUtility("p")],
		});

		const map = generateShorteningMap(root);
		expect(map.p["m"]).toBeUndefined();
		expect(map.p["p"]).toBeUndefined();
	});

	it("abbreviates hyphenated values like kebab properties", () => {
		const root = createMockRoot({
			utilities: [
				mockUtility("color", [
					{ key: "primary-shade", value: "#1", modifiers: [] },
					{ key: "primary-tint", value: "#2", modifiers: [] },
				]),
			],
		});

		const map = generateShorteningMap(root);
		expect(map.v["primary-shade"]).toBe("ps");
		expect(map.v["primary-tint"]).toBe("pt");
	});

	describe("defaults", () => {
		it("uses default short names for known properties", () => {
			const root = createMockRoot({
				utilities: [
					mockUtility("border-color"),
					mockUtility("background-color"),
					mockUtility("font-size"),
				],
			});

			const map = generateShorteningMap(root);
			expect(map.p["border-color"]).toBe("bc");
			expect(map.p["background-color"]).toBe("bgc");
			expect(map.p["font-size"]).toBe("fs");
		});

		it("does not assign default short names for properties not in input", () => {
			const root = createMockRoot({
				utilities: [mockUtility("font-size")],
			});

			const map = generateShorteningMap(root);
			expect(map.p["font-size"]).toBe("fs");
			expect(map.p["border-color"]).toBeUndefined();
		});

		it("algorithmic entries avoid short names taken by defaults", () => {
			const root = createMockRoot({
				utilities: [mockUtility("border-color"), mockUtility("backdrop-contrast")],
			});

			const map = generateShorteningMap(root);
			// border-color gets "bc" from defaults
			expect(map.p["border-color"]).toBe("bc");
			// backdrop-contrast can't use "bc", falls through to algorithm
			expect(map.p["backdrop-contrast"]).not.toBe("bc");
		});

		it("accepts user-provided defaults that override built-ins", () => {
			const root = createMockRoot({
				utilities: [mockUtility("border-color"), mockUtility("font-size")],
			});

			const map = generateShorteningMap(root, {
				properties: { "border-color": "bcolor", "font-size": "fsize" },
			});
			expect(map.p["border-color"]).toBe("bcolor");
			expect(map.p["font-size"]).toBe("fsize");
		});

		it("uses default short names for known modifiers", () => {
			const root = createMockRoot({
				modifiers: [
					{ type: "modifier", key: ["hover"], factory: () => ({}) },
					{ type: "modifier", key: ["focus-within"], factory: () => ({}) },
				],
			});

			const map = generateShorteningMap(root);
			expect(map.m["hover"]).toBe("h");
			expect(map.m["focus-within"]).toBe("fw");
		});
	});
});
