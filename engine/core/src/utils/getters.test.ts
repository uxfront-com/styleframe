import { describe, expect, it } from "vitest";

import { createRoot } from "../tokens/root";
import type { Container } from "../types";
import { getVariable, getUtility, getModifier } from "./getters";

describe("getVariable", () => {
	describe("basic functionality", () => {
		it("should return a variable when it exists", () => {
			const container: Container = {
				id: "test-id",
				variables: [
					{
						type: "variable",
						id: "test-id",
						name: "primary-color",
						value: "#007bff",
					},
				],
				declarations: {},
				children: [],
			};

			const result = getVariable(container, "primary-color");

			expect(result).toEqual({
				type: "variable",
				id: "test-id",
				name: "primary-color",
				value: "#007bff",
			});
		});

		it("should return the correct variable when multiple exist", () => {
			const container: Container = {
				id: "test-id",
				variables: [
					{
						type: "variable",
						id: "test-id",
						name: "primary-color",
						value: "#007bff",
					},
					{
						type: "variable",
						id: "test-id",
						name: "secondary-color",
						value: "#6c757d",
					},
					{
						type: "variable",
						id: "test-id",
						name: "spacing",
						value: "1rem",
					},
				],
				declarations: {},
				children: [],
			};

			const result = getVariable(container, "secondary-color");

			expect(result).toEqual({
				type: "variable",
				id: "test-id",
				name: "secondary-color",
				value: "#6c757d",
			});
		});

		it("should throw an error when variable does not exist", () => {
			const container: Container = {
				id: "test-id",
				variables: [
					{
						type: "variable",
						id: "test-id",
						name: "primary-color",
						value: "#007bff",
					},
				],
				declarations: {},
				children: [],
			};

			expect(() => getVariable(container, "non-existent")).toThrow(
				'Variable "non-existent" not found',
			);
		});

		it("should throw an error when variables array is empty", () => {
			const container: Container = {
				id: "test-id",
				variables: [],
				declarations: {},
				children: [],
			};

			expect(() => getVariable(container, "any-variable")).toThrow(
				'Variable "any-variable" not found',
			);
		});
	});

	describe("edge cases", () => {
		it("should handle variables with special characters in names", () => {
			const container: Container = {
				id: "test-id",
				variables: [
					{
						type: "variable",
						id: "test-id",
						name: "color-primary-500",
						value: "#007bff",
					},
				],
				declarations: {},
				children: [],
			};

			const result = getVariable(container, "color-primary-500");

			expect(result.name).toBe("color-primary-500");
		});

		it("should be case-sensitive", () => {
			const container: Container = {
				id: "test-id",
				variables: [
					{
						type: "variable",
						id: "test-id",
						name: "primaryColor",
						value: "#007bff",
					},
				],
				declarations: {},
				children: [],
			};

			expect(() => getVariable(container, "primarycolor")).toThrow(
				'Variable "primarycolor" not found',
			);
		});
	});
});

describe("getUtility", () => {
	const mockAutogenerate = () => ({});
	const mockCreate = () => {};

	describe("basic functionality", () => {
		it("should return a utility when it exists", () => {
			const mockFactory = () => {};
			const root = createRoot();
			root.utilities = [
				{
					type: "utility",
					name: "padding",
					factory: mockFactory,
					values: [],
					autogenerate: mockAutogenerate,
					create: mockCreate,
				},
			];

			const result = getUtility(root, "padding");

			expect(result).toEqual({
				type: "utility",
				name: "padding",
				factory: mockFactory,
				values: [],
				autogenerate: mockAutogenerate,
				create: mockCreate,
			});
		});

		it("should return the correct utility when multiple exist", () => {
			const mockFactory1 = () => {};
			const mockFactory2 = () => {};
			const mockFactory3 = () => {};
			const root = createRoot();
			root.utilities = [
				{
					type: "utility",
					name: "padding",
					factory: mockFactory1,
					values: [],
					autogenerate: mockAutogenerate,
					create: mockCreate,
				},
				{
					type: "utility",
					name: "margin",
					factory: mockFactory2,
					values: [],
					autogenerate: mockAutogenerate,
					create: mockCreate,
				},
				{
					type: "utility",
					name: "display",
					factory: mockFactory3,
					values: [],
					autogenerate: mockAutogenerate,
					create: mockCreate,
				},
			];

			const result = getUtility(root, "margin");

			expect(result).toEqual({
				type: "utility",
				name: "margin",
				factory: mockFactory2,
				values: [],
				autogenerate: mockAutogenerate,
				create: mockCreate,
			});
		});

		it("should throw an error when utility does not exist", () => {
			const root = createRoot();
			root.utilities = [
				{
					type: "utility",
					name: "padding",
					factory: () => {},
					values: [],
					autogenerate: mockAutogenerate,
					create: mockCreate,
				},
			];

			expect(() => getUtility(root, "non-existent")).toThrow('Utility "non-existent" not found');
		});

		it("should throw an error when utilities array is empty", () => {
			const root = createRoot();

			expect(() => getUtility(root, "padding")).toThrow('Utility "padding" not found');
		});
	});

	describe("edge cases", () => {
		it("should handle utilities with hyphenated names", () => {
			const mockFactory = () => {};
			const root = createRoot();
			root.utilities = [
				{
					type: "utility",
					name: "flex-direction",
					factory: mockFactory,
					values: [],
					autogenerate: mockAutogenerate,
					create: mockCreate,
				},
			];

			const result = getUtility(root, "flex-direction");

			expect(result.name).toBe("flex-direction");
		});

		it("should be case-sensitive", () => {
			const root = createRoot();
			root.utilities = [
				{
					type: "utility",
					name: "padding",
					factory: () => {},
					values: [],
					autogenerate: mockAutogenerate,
					create: mockCreate,
				},
			];

			expect(() => getUtility(root, "Padding")).toThrow('Utility "Padding" not found');
		});
	});
});

describe("getModifier", () => {
	describe("basic functionality", () => {
		it("should return a modifier when it exists", () => {
			const mockFactory = () => {};
			const root = createRoot();
			root.modifiers = [
				{
					type: "modifier",
					key: ["hover"],
					factory: mockFactory,
				},
			];

			const result = getModifier(root, "hover");

			expect(result).toEqual({
				type: "modifier",
				key: ["hover"],
				factory: mockFactory,
			});
		});

		it("should return the correct modifier when multiple exist", () => {
			const mockFactory1 = () => {};
			const mockFactory2 = () => {};
			const mockFactory3 = () => {};
			const root = createRoot();
			root.modifiers = [
				{
					type: "modifier",
					key: ["hover"],
					factory: mockFactory1,
				},
				{
					type: "modifier",
					key: ["focus"],
					factory: mockFactory2,
				},
				{
					type: "modifier",
					key: ["active"],
					factory: mockFactory3,
				},
			];

			const result = getModifier(root, "focus");

			expect(result).toEqual({
				type: "modifier",
				key: ["focus"],
				factory: mockFactory2,
			});
		});

		it("should find modifier when name is in key array", () => {
			const mockFactory = () => {};
			const root = createRoot();
			root.modifiers = [
				{
					type: "modifier",
					key: ["sm", "small"],
					factory: mockFactory,
				},
			];

			const result = getModifier(root, "small");

			expect(result).toEqual({
				type: "modifier",
				key: ["sm", "small"],
				factory: mockFactory,
			});
		});

		it("should throw an error when modifier does not exist", () => {
			const root = createRoot();
			root.modifiers = [
				{
					type: "modifier",
					key: ["hover"],
					factory: () => {},
				},
			];

			expect(() => getModifier(root, "non-existent")).toThrow('Modifier "non-existent" not found');
		});

		it("should throw an error when modifiers array is empty", () => {
			const root = createRoot();

			expect(() => getModifier(root, "hover")).toThrow('Modifier "hover" not found');
		});
	});

	describe("edge cases", () => {
		it("should return first matching modifier when multiple keys match", () => {
			const mockFactory1 = () => {};
			const mockFactory2 = () => {};
			const root = createRoot();
			root.modifiers = [
				{
					type: "modifier",
					key: ["hover", "h"],
					factory: mockFactory1,
				},
				{
					type: "modifier",
					key: ["h", "highlight"],
					factory: mockFactory2,
				},
			];

			const result = getModifier(root, "h");

			expect(result.factory).toBe(mockFactory1);
		});

		it("should handle modifiers with multiple keys", () => {
			const mockFactory = () => {};
			const root = createRoot();
			root.modifiers = [
				{
					type: "modifier",
					key: ["sm", "small", "s"],
					factory: mockFactory,
				},
			];

			const result1 = getModifier(root, "sm");
			const result2 = getModifier(root, "small");
			const result3 = getModifier(root, "s");

			expect(result1).toBe(result2);
			expect(result2).toBe(result3);
		});

		it("should be case-sensitive", () => {
			const root = createRoot();
			root.modifiers = [
				{
					type: "modifier",
					key: ["hover"],
					factory: () => {},
				},
			];

			expect(() => getModifier(root, "Hover")).toThrow('Modifier "Hover" not found');
		});
	});
});
