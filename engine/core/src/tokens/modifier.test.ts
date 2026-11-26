import { beforeEach, describe, expect, it } from "vitest";
import type { ModifierFactory, Root } from "../types";
import { applyModifiers, createModifierFunction } from "./modifier";
import { createRoot } from "./root";

describe("applyModifiers", () => {
	let root: Root;

	beforeEach(() => {
		root = createRoot();
		root.id = "base-id";
		root.declarations = { color: "red" };
	});

	it("should return instance with empty modifiers when no modifiers provided", () => {
		const modifiers = new Map<string, ModifierFactory>();

		const result = applyModifiers(root, root, modifiers);

		expect(result.modifiers).toEqual([]);
		expect(result.declarations).toEqual({ color: "red" });
	});

	it("should generate a new id for the instance", () => {
		const modifiers = new Map<string, ModifierFactory>();

		const result = applyModifiers(root, root, modifiers);

		expect(result.id).not.toBe("base-id");
		expect(result.id).toEqual(expect.any(String));
	});

	it("should list modifier keys on the result", () => {
		const modifiers = new Map<string, ModifierFactory>([
			["hover", { type: "modifier", key: ["hover"], factory: () => ({}) }],
			["focus", { type: "modifier", key: ["focus"], factory: () => ({}) }],
		]);

		const result = applyModifiers(root, root, modifiers);

		expect(result.modifiers).toEqual(["hover", "focus"]);
	});

	it("should clear base declarations and use modifier result when factory returns", () => {
		const modifiers = new Map<string, ModifierFactory>([
			[
				"hover",
				{
					type: "modifier",
					key: ["hover"],
					factory: () => ({ backgroundColor: "blue" }),
				},
			],
		]);

		const result = applyModifiers(root, root, modifiers);

		expect(result.declarations).toEqual({ backgroundColor: "blue" });
	});

	it("should compose modifiers inside-out (last = innermost, first = outermost)", () => {
		const modifiers = new Map<string, ModifierFactory>([
			[
				"hover",
				{
					type: "modifier",
					key: ["hover"],
					factory: ({ declarations }) => ({
						"&:hover": declarations,
					}),
				},
			],
			[
				"focus",
				{
					type: "modifier",
					key: ["focus"],
					factory: ({ declarations }) => ({
						"&:focus": declarations,
					}),
				},
			],
		]);

		const result = applyModifiers(root, root, modifiers);

		// hover is outermost, focus is innermost
		// Result: &:hover { &:focus { color: red } }
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({
			type: "selector",
			query: "&:hover",
		});
		const hoverChild = result.children[0] as any;
		expect(hoverChild.children).toHaveLength(1);
		expect(hoverChild.children[0]).toMatchObject({
			type: "selector",
			query: "&:focus",
			declarations: { color: "red" },
		});
	});

	it("should preserve base declarations when modifier factory returns undefined", () => {
		const modifiers = new Map<string, ModifierFactory>([
			[
				"hover",
				{
					type: "modifier",
					key: ["hover"],
					factory: () => undefined,
				},
			],
		]);

		const result = applyModifiers(root, root, modifiers);

		expect(result.declarations).toEqual({ color: "red" });
	});

	it("should pass accumulated declarations from inner modifier to outer modifier", () => {
		const receivedDeclarations: Array<any> = [];

		const modifiers = new Map<string, ModifierFactory>([
			[
				"outer",
				{
					type: "modifier",
					key: ["outer"],
					factory: (ctx) => {
						receivedDeclarations.push({ ...ctx.declarations });
						return { wrapped: "outer" };
					},
				},
			],
			[
				"inner",
				{
					type: "modifier",
					key: ["inner"],
					factory: (ctx) => {
						receivedDeclarations.push({ ...ctx.declarations });
						return { wrapped: "inner" };
					},
				},
			],
		]);

		applyModifiers(root, root, modifiers);

		// Inner modifier runs first with original declarations
		expect(receivedDeclarations[0]).toEqual({ color: "red" });
		// Outer modifier receives inner's accumulated result
		expect(receivedDeclarations[1]).toEqual({ wrapped: "inner" });
	});

	it("should not mutate the base instance", () => {
		const baseRoot = createRoot();
		baseRoot.id = "base-id";
		baseRoot.declarations = { color: "red" };

		const modifiers = new Map<string, ModifierFactory>([
			[
				"hover",
				{
					type: "modifier",
					key: ["hover"],
					factory: () => ({ backgroundColor: "blue" }),
				},
			],
		]);

		applyModifiers(baseRoot, baseRoot, modifiers);

		expect(baseRoot.declarations).toEqual({ color: "red" });
		expect(baseRoot.id).toBe("base-id");
	});

	it("should handle single modifier wrapping declarations", () => {
		const modifiers = new Map<string, ModifierFactory>([
			[
				"hover",
				{
					type: "modifier",
					key: ["hover"],
					factory: ({ declarations }) => ({
						"&:hover": declarations,
					}),
				},
			],
		]);

		const result = applyModifiers(root, root, modifiers);

		// Declarations parsed into selector child
		expect(result.declarations).toEqual({});
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({
			type: "selector",
			query: "&:hover",
			declarations: { color: "red" },
		});
	});
});

describe("createModifierFunction", () => {
	let root: Root;

	beforeEach(() => {
		root = createRoot();
	});

	it("should create a modifier and add it to root.modifiers", () => {
		const modifier = createModifierFunction(root, root);
		const factory = () => ({});

		modifier("hover", factory);

		expect(root.modifiers).toHaveLength(1);
		expect(root.modifiers[0]).toEqual({
			type: "modifier",
			key: ["hover"],
			factory,
		});
	});

	it("should accept an array of keys", () => {
		const modifier = createModifierFunction(root, root);
		const factory = () => ({});

		modifier(["hover", "focus"], factory);

		expect(root.modifiers[0]?.key).toEqual(["hover", "focus"]);
	});

	it("should wrap a single string key in an array", () => {
		const modifier = createModifierFunction(root, root);

		modifier("active", () => ({}));

		expect(root.modifiers[0]?.key).toEqual(["active"]);
	});
});
