import { describe, expect, it } from "vitest";

import type { DTCGResolverDocument } from "../../src/types/resolver";
import { validateResolver } from "../../src/validate/resolver";

describe("validateResolver", () => {
	it("returns no errors for a valid resolver", () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			sets: {
				base: { sources: [{ $ref: "base.json" }] },
			},
			modifiers: {
				theme: {
					contexts: {
						light: [{ $ref: "themes/light.json" }],
						dark: [{ $ref: "themes/dark.json" }],
					},
					default: "light",
				},
			},
			resolutionOrder: [{ $ref: "#/sets/base" }, { $ref: "#/modifiers/theme" }],
		};
		expect(validateResolver(doc)).toEqual([]);
	});

	it("flags wrong version", () => {
		const doc = { version: "1.0" } as unknown as DTCGResolverDocument;
		const errs = validateResolver(doc);
		expect(errs.some((e) => e.message.includes("version"))).toBe(true);
	});

	it("flags empty sources arrays", () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			sets: { base: { sources: [] } },
			resolutionOrder: [{ $ref: "#/sets/base" }],
		};
		const errs = validateResolver(doc);
		expect(errs.some((e) => e.message.includes("must not be empty"))).toBe(true);
	});

	it("flags an unknown default context", () => {
		const doc: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: {
				theme: {
					contexts: { light: [{ $ref: "x" }] },
					default: "dark",
				},
			},
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};
		const errs = validateResolver(doc);
		expect(errs.some((e) => e.message.includes("not a defined context"))).toBe(true);
	});

	it("flags missing or empty resolutionOrder", () => {
		expect(
			validateResolver({
				version: "2025.10",
				resolutionOrder: [],
			} as DTCGResolverDocument).length,
		).toBeGreaterThan(0);
	});

	it("flags inline resolutionOrder entries without type", () => {
		const doc = {
			version: "2025.10",
			resolutionOrder: [{ sources: [{ $ref: "x" }] }],
		} as unknown as DTCGResolverDocument;
		const errs = validateResolver(doc);
		expect(errs.some((e) => e.message.includes("type"))).toBe(true);
	});
});
