import { describe, it, expect } from "vitest";

import { isKeyReferenceValue, isTokenValue } from "./typeGuards";
import type { Reference, CSS } from "./types";

describe("isTokenValue", () => {
	it("should return true for primitive token values", () => {
		expect(isTokenValue("string")).toBe(true);
		expect(isTokenValue(42)).toBe(true);
		expect(isTokenValue(true)).toBe(true);
		expect(isTokenValue(null)).toBe(true);
	});

	it("should return true for Reference objects", () => {
		const ref: Reference = { type: "reference", name: "color" };
		expect(isTokenValue(ref)).toBe(true);
	});

	it("should return true for CSS objects", () => {
		const css: CSS = { type: "css", value: ["color", "red"] };
		expect(isTokenValue(css)).toBe(true);
	});

	it("should return true for arrays of token values", () => {
		const ref: Reference = { type: "reference", name: "size" };
		const css: CSS = { type: "css", value: ["margin", "0"] };
		expect(isTokenValue(["foo", ref, css])).toBe(true);
	});

	it("should return false for invalid values", () => {
		expect(isTokenValue({})).toBe(false);
		expect(isTokenValue(["foo", {}])).toBe(false);
	});
});

describe("isKeyReferenceValue", () => {
	it("should return true for strings starting with @", () => {
		expect(isKeyReferenceValue("@color.primary")).toBe(true);
		expect(isKeyReferenceValue("@spacing")).toBe(true);
		expect(isKeyReferenceValue("@")).toBe(true);
	});

	it("should return false for strings not starting with @", () => {
		expect(isKeyReferenceValue("color.primary")).toBe(false);
		expect(isKeyReferenceValue("email@example.com")).toBe(false);
		expect(isKeyReferenceValue("")).toBe(false);
	});

	it("should return false for non-string values", () => {
		expect(isKeyReferenceValue(42)).toBe(false);
		expect(isKeyReferenceValue(null)).toBe(false);
		expect(isKeyReferenceValue(undefined)).toBe(false);
		expect(isKeyReferenceValue({ type: "reference" })).toBe(false);
	});
});
