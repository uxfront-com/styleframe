import { describe, expect, it } from "vitest";

import { format } from "../../src/dimension/format";
import { parse } from "../../src/dimension/parse";

describe("dimension.parse", () => {
	it("parses common units", () => {
		expect(parse("16px")).toEqual({ value: 16, unit: "px" });
		expect(parse("1.5rem")).toEqual({ value: 1.5, unit: "rem" });
		expect(parse("100%")).toEqual({ value: 100, unit: "%" });
		expect(parse("100vh")).toEqual({ value: 100, unit: "vh" });
	});

	it("parses negative and decimal values", () => {
		expect(parse("-1.25em")).toEqual({ value: -1.25, unit: "em" });
		expect(parse("0.5px")).toEqual({ value: 0.5, unit: "px" });
	});

	it("accepts unknown units (spec is open-ended)", () => {
		expect(parse("12custom")).toEqual({ value: 12, unit: "custom" });
	});

	it("trims whitespace", () => {
		expect(parse("  16px  ")).toEqual({ value: 16, unit: "px" });
	});

	it("rejects invalid input", () => {
		expect(parse("16")).toBeUndefined();
		expect(parse("px")).toBeUndefined();
		expect(parse("auto")).toBeUndefined();
		expect(parse("")).toBeUndefined();
	});
});

describe("dimension.format", () => {
	it("round-trips with parse", () => {
		const cases = ["16px", "1.5rem", "-2em", "100%"];
		for (const input of cases) {
			const parsed = parse(input);
			expect(parsed).toBeDefined();
			expect(format(parsed!)).toBe(input);
		}
	});
});
