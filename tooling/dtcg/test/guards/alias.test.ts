import { describe, expect, it } from "vitest";

import { isAlias } from "../../src/guards/alias";

describe("isAlias", () => {
	it("accepts a simple alias", () => {
		expect(isAlias("{color.primary}")).toBe(true);
	});

	it("accepts a deeply nested path", () => {
		expect(isAlias("{a.b.c.d.e}")).toBe(true);
	});

	it("rejects an empty body", () => {
		expect(isAlias("{}")).toBe(false);
	});

	it("rejects strings with embedded braces", () => {
		expect(isAlias("{a.{b}}")).toBe(false);
		expect(isAlias("{a}{b}")).toBe(false);
	});

	it("rejects unbraced strings", () => {
		expect(isAlias("color.primary")).toBe(false);
		expect(isAlias("{color.primary")).toBe(false);
		expect(isAlias("color.primary}")).toBe(false);
	});

	it("rejects non-strings", () => {
		expect(isAlias(undefined)).toBe(false);
		expect(isAlias(null)).toBe(false);
		expect(isAlias(42)).toBe(false);
		expect(isAlias({})).toBe(false);
		expect(isAlias([])).toBe(false);
	});
});
