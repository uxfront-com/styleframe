import { describe, expect, it } from "vitest";

import { ValidationError } from "../../src/parse/errors";
import { resolve } from "../../src/resolver/resolve";
import type { DTCGFileLoader, DTCGResolverDocument } from "../../src/types/resolver";

function loaderFor(map: Record<string, unknown>): DTCGFileLoader {
	return async (ref) => {
		if (!(ref in map)) {
			throw new Error(`unknown ref ${ref}`);
		}
		return map[ref];
	};
}

describe("resolve", () => {
	it("merges sets in order", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			sets: {
				base: { sources: [{ $ref: "base.json" }] },
				overrides: { sources: [{ $ref: "overrides.json" }] },
			},
			resolutionOrder: [{ $ref: "#/sets/base" }, { $ref: "#/sets/overrides" }],
		};
		const loader = loaderFor({
			"base.json": {
				color: {
					primary: {
						$type: "color",
						$value: { colorSpace: "srgb", components: [1, 0, 0] },
					},
				},
			},
			"overrides.json": {
				color: {
					primary: {
						$type: "color",
						$value: { colorSpace: "srgb", components: [0, 1, 0] },
					},
				},
			},
		});
		const out = await resolve(doc, {}, loader);
		expect((out.color as unknown as Record<string, any>).primary.$value.components).toEqual([
			0, 1, 0,
		]);
	});

	it("applies a modifier with explicit input", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			sets: { base: { sources: [{ $ref: "base.json" }] } },
			modifiers: {
				theme: {
					contexts: {
						light: [{ $ref: "light.json" }],
						dark: [{ $ref: "dark.json" }],
					},
				},
			},
			resolutionOrder: [{ $ref: "#/sets/base" }, { $ref: "#/modifiers/theme" }],
		};
		const loader = loaderFor({
			"base.json": {
				color: {
					bg: {
						$type: "color",
						$value: { colorSpace: "srgb", components: [1, 1, 1] },
					},
				},
			},
			"light.json": {},
			"dark.json": {
				color: {
					bg: {
						$type: "color",
						$value: { colorSpace: "srgb", components: [0, 0, 0] },
					},
				},
			},
		});
		const out = await resolve(doc, { theme: "dark" }, loader);
		expect((out.color as unknown as Record<string, any>).bg.$value.components).toEqual([0, 0, 0]);
	});

	it("uses modifier default when input is missing", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: {
				theme: {
					contexts: {
						light: [{ $ref: "light.json" }],
						dark: [{ $ref: "dark.json" }],
					},
					default: "light",
				},
			},
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};
		const loader = loaderFor({
			"light.json": { x: { $type: "number", $value: 1 } },
			"dark.json": { x: { $type: "number", $value: 2 } },
		});
		const out = await resolve(doc, {}, loader);
		expect((out as unknown as Record<string, any>).x.$value).toBe(1);
	});

	it("throws when no input and no default", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: {
				theme: { contexts: { light: [], dark: [] } },
			},
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};
		await expect(resolve(doc, {}, loaderFor({}))).rejects.toThrow(ValidationError);
	});

	it("throws on unknown modifier in inputs", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: { theme: { contexts: { a: [] }, default: "a" } },
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};
		await expect(resolve(doc, { unknown: "x" }, loaderFor({}))).rejects.toThrow(ValidationError);
	});

	it("throws on unknown context value", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: { theme: { contexts: { light: [], dark: [] } } },
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};
		await expect(resolve(doc, { theme: "frosted" }, loaderFor({}))).rejects.toThrow(
			ValidationError,
		);
	});

	it("resolves aliases after merging", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			sets: {
				base: { sources: [{ $ref: "base.json" }, { $ref: "semantic.json" }] },
			},
			resolutionOrder: [{ $ref: "#/sets/base" }],
		};
		const loader = loaderFor({
			"base.json": {
				palette: {
					red: {
						$type: "color",
						$value: { colorSpace: "srgb", components: [1, 0, 0] },
					},
				},
			},
			"semantic.json": {
				color: { danger: { $type: "color", $value: "{palette.red}" } },
			},
		});
		const out = await resolve(doc, {}, loader);
		expect((out.color as unknown as Record<string, any>).danger.$value).toEqual({
			colorSpace: "srgb",
			components: [1, 0, 0],
		});
	});

	it("supports inline tokens via inline source objects", async () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			sets: {
				base: {
					sources: [{ x: { $type: "number", $value: 1 } } as unknown as Record<string, any>],
				},
			},
			resolutionOrder: [{ $ref: "#/sets/base" }],
		};
		const out = await resolve(doc, {}, loaderFor({}));
		expect((out as unknown as Record<string, any>).x.$value).toBe(1);
	});
});
