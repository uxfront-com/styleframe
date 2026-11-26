import { describe, expect, it } from "vitest";

import { isDocument, isGroup, isToken } from "../../src/guards/token";

describe("isToken", () => {
	it("accepts an object with $value", () => {
		expect(isToken({ $value: "anything" })).toBe(true);
		expect(isToken({ $value: { colorSpace: "srgb", components: [1, 0, 0] } })).toBe(true);
	});

	it("rejects objects without $value", () => {
		expect(isToken({ $type: "color" })).toBe(false);
		expect(isToken({})).toBe(false);
	});

	it("rejects arrays and primitives", () => {
		expect(isToken([])).toBe(false);
		expect(isToken("foo")).toBe(false);
		expect(isToken(42)).toBe(false);
		expect(isToken(null)).toBe(false);
		expect(isToken(undefined)).toBe(false);
	});
});

describe("isGroup", () => {
	it("accepts plain objects without $value", () => {
		expect(isGroup({})).toBe(true);
		expect(isGroup({ $type: "color" })).toBe(true);
		expect(isGroup({ primary: { $value: "x" } })).toBe(true);
	});

	it("rejects objects with $value", () => {
		expect(isGroup({ $value: "x" })).toBe(false);
	});

	it("rejects arrays and primitives", () => {
		expect(isGroup([])).toBe(false);
		expect(isGroup(null)).toBe(false);
		expect(isGroup("foo")).toBe(false);
	});
});

describe("isDocument", () => {
	it("accepts plain objects (root structure)", () => {
		expect(
			isDocument({
				$schema: "https://...",
				color: { primary: { $value: "x" } },
			}),
		).toBe(true);
	});
});
