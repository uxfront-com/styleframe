import { describe, it, expect } from "vitest";

import { hashValue } from "./hash";

describe("hashValue", () => {
	it("should produce a 7-character hex string", () => {
		const result = hashValue("all 0.3s ease");
		expect(result).toMatch(/^[0-9a-f]{7}$/);
	});

	it("should be deterministic (same input = same output)", () => {
		const a = hashValue("all 0.3s ease");
		const b = hashValue("all 0.3s ease");
		expect(a).toBe(b);
	});

	it("should produce different hashes for different inputs", () => {
		const a = hashValue("all 0.3s ease");
		const b = hashValue("all 0.5s linear");
		expect(a).not.toBe(b);
	});

	it("should handle empty string", () => {
		const result = hashValue("");
		expect(result).toMatch(/^[0-9a-f]{7}$/);
	});

	it("should handle single space", () => {
		const result = hashValue(" ");
		expect(result).toMatch(/^[0-9a-f]{7}$/);
	});

	it("should handle strings with various whitespace types", () => {
		const tab = hashValue("a\tb");
		const space = hashValue("a b");
		const newline = hashValue("a\nb");
		expect(tab).toMatch(/^[0-9a-f]{7}$/);
		expect(space).toMatch(/^[0-9a-f]{7}$/);
		expect(newline).toMatch(/^[0-9a-f]{7}$/);
		expect(new Set([tab, space, newline]).size).toBe(3);
	});

	it("should handle long strings", () => {
		const long = "a".repeat(10_000);
		const result = hashValue(long);
		expect(result).toMatch(/^[0-9a-f]{7}$/);
	});

	it("should handle CSS transition values", () => {
		const result = hashValue("all 0.3s ease");
		expect(result).toMatch(/^[0-9a-f]{7}$/);
		expect(result).not.toContain(" ");
	});

	it("should produce different hashes for similar CSS values", () => {
		const values = [
			"all 0.3s ease",
			"all 0.3s ease-in",
			"all 0.3s ease-out",
			"opacity 0.3s ease",
			"all 0.5s ease",
		];
		const hashes = values.map(hashValue);
		expect(new Set(hashes).size).toBe(values.length);
	});
});
