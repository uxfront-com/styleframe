import { styleframe } from "@styleframe/core";

import { createMultiplierAutogenerate, isNumericValue } from "./createMultiplierAutogenerate";

describe("isNumericValue", () => {
	describe("should return true for", () => {
		it("positive integers", () => {
			expect(isNumericValue("1")).toBe(true);
			expect(isNumericValue("10")).toBe(true);
			expect(isNumericValue("100")).toBe(true);
			expect(isNumericValue(1)).toBe(true);
			expect(isNumericValue(10)).toBe(true);
		});

		it("decimals", () => {
			expect(isNumericValue("1.5")).toBe(true);
			expect(isNumericValue("0.5")).toBe(true);
			expect(isNumericValue(".5")).toBe(true);
			expect(isNumericValue("1.25")).toBe(true);
			expect(isNumericValue(1.5)).toBe(true);
			expect(isNumericValue(0.5)).toBe(true);
		});

		it("negative numbers", () => {
			expect(isNumericValue("-1")).toBe(true);
			expect(isNumericValue("-1.5")).toBe(true);
			expect(isNumericValue("-0.5")).toBe(true);
			expect(isNumericValue("-.5")).toBe(true);
			expect(isNumericValue(-1)).toBe(true);
			expect(isNumericValue(-1.5)).toBe(true);
		});

		it("zero", () => {
			expect(isNumericValue("0")).toBe(true);
			expect(isNumericValue(0)).toBe(true);
		});

		it("numbers with whitespace", () => {
			expect(isNumericValue(" 1 ")).toBe(true);
			expect(isNumericValue(" 1.5 ")).toBe(true);
		});
	});

	describe("should return false for", () => {
		it("named tokens", () => {
			expect(isNumericValue("sm")).toBe(false);
			expect(isNumericValue("md")).toBe(false);
			expect(isNumericValue("primary")).toBe(false);
		});

		it("CSS units", () => {
			expect(isNumericValue("1rem")).toBe(false);
			expect(isNumericValue("1px")).toBe(false);
			expect(isNumericValue("1em")).toBe(false);
			expect(isNumericValue("100%")).toBe(false);
		});

		it("CSS keywords", () => {
			expect(isNumericValue("auto")).toBe(false);
			expect(isNumericValue("inherit")).toBe(false);
			expect(isNumericValue("initial")).toBe(false);
		});

		it("variable references", () => {
			expect(isNumericValue("@spacing")).toBe(false);
			expect(isNumericValue("@spacing.sm")).toBe(false);
		});

		it("other types", () => {
			expect(isNumericValue(null)).toBe(false);
			expect(isNumericValue(undefined)).toBe(false);
			expect(isNumericValue({})).toBe(false);
			expect(isNumericValue([])).toBe(false);
			expect(isNumericValue(true)).toBe(false);
		});

		it("empty values", () => {
			expect(isNumericValue("")).toBe(false);
			expect(isNumericValue(" ")).toBe(false);
		});

		it("invalid number formats", () => {
			expect(isNumericValue("1.2.3")).toBe(false);
			expect(isNumericValue("1-2")).toBe(false);
			expect(isNumericValue("1+2")).toBe(false);
		});
	});
});

describe("createMultiplierAutogenerate", () => {
	it("should generate calc expression for @-prefixed integer multipliers", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate("@2");
		expect(result).toHaveProperty("2");
		expect(result["2"]).toEqual({
			type: "css",
			value: [
				"calc(",
				{ type: "reference", name: "spacing", fallback: undefined },
				" * ",
				"2",
				")",
			],
		});
	});

	it("should generate calc expression for @-prefixed decimal multipliers", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate("@1.5");
		expect(result).toHaveProperty("1.5");
		expect(result["1.5"]).toEqual({
			type: "css",
			value: [
				"calc(",
				{ type: "reference", name: "spacing", fallback: undefined },
				" * ",
				"1.5",
				")",
			],
		});
	});

	it("should handle @-prefixed negative multipliers", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate("@-1");
		expect(result).toHaveProperty("-1");
		expect(result["-1"]).toEqual({
			type: "css",
			value: [
				"calc(",
				{ type: "reference", name: "spacing", fallback: undefined },
				" * ",
				"-1",
				")",
			],
		});
	});

	it("should treat plain numeric strings as arbitrary values", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate("1.5");
		// Without @ prefix, should be treated as arbitrary value
		expect(result).toHaveProperty("[1.5]");
		expect(result["[1.5]"]).toBe("1.5");
	});

	it("should treat number type values as arbitrary values", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate(1.5);
		// Number types should fall back to default (arbitrary)
		expect(result).toHaveProperty("[1.5]");
	});

	it("should trim whitespace from @-prefixed numeric values", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate("@ 1.5 ");
		// Key should be trimmed
		expect(result).toHaveProperty("1.5");
		expect(result).not.toHaveProperty(" 1.5 ");
	});

	it("should treat leading whitespace before @ as arbitrary value", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate(" @1.5");
		// Leading whitespace means value[0] !== "@", so falls back to arbitrary value (trimmed)
		expect(result).toHaveProperty("[@1.5]");
		expect(result["[@1.5]"]).toBe(" @1.5");
	});

	it("should fall back to default behavior for @ variable references", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate("@spacing.sm");
		expect(result).toHaveProperty("spacing.sm");
		expect(result["spacing.sm"]).toEqual({
			type: "reference",
			name: "spacing.sm",
		});
	});

	it("should fall back to default behavior for Reference objects", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const ref = { type: "reference" as const, name: "spacing.md" };
		const result = autogenerate(ref);
		expect(result).toHaveProperty("spacing.md");
		expect(result["spacing.md"]).toBe(ref);
	});

	it("should fall back to default behavior for arbitrary string values", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
		});

		const result = autogenerate("auto");
		expect(result).toHaveProperty("[auto]");
		expect(result["[auto]"]).toBe("auto");
	});

	it("should use Variable object as base", () => {
		const s = styleframe();
		const spacingVar = s.variable("spacing", "1rem");
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: spacingVar,
		});

		const result = autogenerate("@2");
		expect(result["2"]).toEqual({
			type: "css",
			value: [
				"calc(",
				{ type: "reference", name: "spacing", fallback: undefined },
				" * ",
				"2",
				")",
			],
		});
	});

	it("should use custom base variable name", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "custom-spacing",
		});

		const result = autogenerate("@1.5");
		expect(result["1.5"]).toEqual({
			type: "css",
			value: [
				"calc(",
				{ type: "reference", name: "custom-spacing", fallback: undefined },
				" * ",
				"1.5",
				")",
			],
		});
	});

	it("should use fallback value when provided", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
			fallback: "1rem",
		});

		const result = autogenerate("@2");
		expect(result["2"]).toEqual({
			type: "css",
			value: ["calc(", { type: "reference", name: "spacing", fallback: "1rem" }, " * ", "2", ")"],
		});
	});

	it("should apply namespace to non-numeric @ values", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
			namespace: "spacing",
		});

		const result = autogenerate("@sm");
		expect(result).toEqual({
			sm: {
				type: "reference",
				name: "spacing.sm",
			},
		});
	});

	it("should not apply namespace to numeric multiplier values", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
			namespace: "spacing",
		});

		const result = autogenerate("@1.5");
		expect(result).toHaveProperty("1.5");
		expect(result["1.5"]).toEqual({
			type: "css",
			value: [
				"calc(",
				{ type: "reference", name: "spacing", fallback: undefined },
				" * ",
				"1.5",
				")",
			],
		});
	});

	it("should work with both namespace and replacer", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
			namespace: "spacing",
			replacer: (key) => key.toUpperCase(),
		});

		const result = autogenerate("@md");
		expect(result).toEqual({
			MD: {
				type: "reference",
				name: "spacing.md",
			},
		});
	});

	it("should accept custom replacer function for non-multiplier values", () => {
		const s = styleframe();
		const autogenerate = createMultiplierAutogenerate({
			s,
			baseVariable: "spacing",
			replacer: (key) => key.split(".").pop() ?? key,
		});

		const result = autogenerate("@spacing.md");
		// Custom replacer extracts just "md" from "spacing.md"
		expect(result).toHaveProperty("md");
		expect(result.md).toEqual({
			type: "reference",
			name: "spacing.md",
		});
	});
});
