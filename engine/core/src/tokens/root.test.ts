import { describe, expect, it } from "vitest";
import type { Root } from "../types";
import { createRoot } from "./root";

describe("createRoot", () => {
	describe("basic functionality", () => {
		it("should create a root object with correct type", () => {
			const root = createRoot();

			expect(root.type).toBe("root");
		});

		it("should create a root object with empty children array", () => {
			const root = createRoot();

			expect(root.children).toEqual([]);
			expect(Array.isArray(root.children)).toBe(true);
			expect(root.children).toHaveLength(0);
		});

		it("should create a root object with correct structure", () => {
			const root = createRoot();

			expect(root).toEqual({
				type: "root",
				id: expect.any(String),
				_registry: expect.any(Map),
				_usage: {
					variables: expect.any(Set),
					utilities: expect.any(Set),
					recipes: expect.any(Set),
					recipeUtilities: expect.any(Map),
				},
				_records: [],
				declarations: {},
				utilities: [],
				modifiers: [],
				recipes: [],
				variables: [],
				children: [],
				themes: [],
			});
		});

		it("should return a Root type", () => {
			const root = createRoot();

			// Type assertion to verify it matches Root interface
			const typedRoot: Root = root;
			expect(typedRoot).toBeDefined();
		});
	});

	describe("multiple instances", () => {
		it("should create independent root instances", () => {
			const root1 = createRoot();
			const root2 = createRoot();

			expect(root1).not.toBe(root2);
			expect(root1.children).not.toBe(root2.children);
		});

		it("should create fresh empty arrays for each instance", () => {
			const root1 = createRoot();
			const root2 = createRoot();

			// Modify one instance
			root1.variables.push({
				type: "variable",
				name: "test",
				value: "test-value",
			} as any);

			// Other instance should remain unaffected
			expect(root1.variables).toHaveLength(1);
			expect(root2.variables).toHaveLength(0);
		});
	});
});
