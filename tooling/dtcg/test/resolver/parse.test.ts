import { describe, expect, it } from "vitest";

import { ParseError } from "../../src/parse/errors";
import { parseResolver } from "../../src/resolver/parse";

describe("parseResolver", () => {
	it("parses a JSON string", () => {
		const json = JSON.stringify({
			version: "2025.10",
			resolutionOrder: [{ $ref: "#/sets/x" }],
		});
		const doc = parseResolver(json);
		expect(doc.version).toBe("2025.10");
	});

	it("accepts an object", () => {
		const obj = { version: "2025.10", resolutionOrder: [] };
		expect(parseResolver(obj)).toBe(obj);
	});

	it("throws on missing resolutionOrder", () => {
		expect(() => parseResolver({ version: "2025.10" })).toThrow(ParseError);
	});

	it("throws on invalid JSON", () => {
		expect(() => parseResolver("not json")).toThrow(ParseError);
	});
});
