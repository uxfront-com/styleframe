import { describe, expect, it } from "vitest";

import { format } from "../../src/duration/format";
import { parse } from "../../src/duration/parse";

describe("duration.parse", () => {
	it("parses ms and s", () => {
		expect(parse("100ms")).toEqual({ value: 100, unit: "ms" });
		expect(parse("0.5s")).toEqual({ value: 0.5, unit: "s" });
	});

	it("rejects other units", () => {
		expect(parse("100us")).toBeUndefined();
		expect(parse("1px")).toBeUndefined();
		expect(parse("100")).toBeUndefined();
	});
});

describe("duration.format", () => {
	it("round-trips with parse", () => {
		expect(format({ value: 100, unit: "ms" })).toBe("100ms");
		expect(format({ value: 0.5, unit: "s" })).toBe("0.5s");
	});
});
