import { describe, expect, it } from "vitest";

import { parse } from "../../src/parse/document";
import { ParseError } from "../../src/parse/errors";
import { walk } from "../../src/parse/walk";

describe("parse", () => {
	it("parses a JSON string", () => {
		const json = JSON.stringify({
			color: {
				primary: {
					$type: "color",
					$value: { colorSpace: "srgb", components: [1, 0, 0] },
				},
			},
		});
		const doc = parse(json);
		expect(doc.color).toBeDefined();
	});

	it("accepts an already-parsed object", () => {
		const obj = { x: { $value: 1 } };
		expect(parse(obj)).toBe(obj);
	});

	it("throws ParseError on invalid JSON", () => {
		expect(() => parse("{not json")).toThrow(ParseError);
	});

	it("throws ParseError on non-object root", () => {
		expect(() => parse('"foo"')).toThrow(ParseError);
		expect(() => parse("[]")).toThrow(ParseError);
		expect(() => parse("null")).toThrow(ParseError);
	});

	it("validates reserved-key types", () => {
		expect(() => parse({ $schema: 42 })).toThrow(ParseError);
		expect(() => parse({ $description: 42 })).toThrow(ParseError);
		expect(() => parse({ $extensions: "no" })).toThrow(ParseError);
	});

	it("accepts a document with no children", () => {
		expect(parse({})).toEqual({});
	});
});

describe("walk", () => {
	it("yields every leaf token with its path", () => {
		const doc = {
			color: {
				$type: "color",
				primary: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
				palette: {
					red: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
					blue: { $value: { colorSpace: "srgb", components: [0, 0, 1] } },
				},
			},
			spacing: {
				small: { $type: "dimension", $value: { value: 4, unit: "px" } },
			},
		} as const;
		const entries = Array.from(walk(doc as never));
		const paths = entries.map((e) => e.path).sort();
		expect(paths).toEqual([
			"color.palette.blue",
			"color.palette.red",
			"color.primary",
			"spacing.small",
		]);
	});

	it("ignores reserved $-keys at every level", () => {
		const doc = {
			$schema: "https://...",
			$description: "doc",
			color: {
				$type: "color",
				$description: "group",
				primary: { $value: { colorSpace: "srgb", components: [0, 0, 0] } },
			},
		} as const;
		const entries = Array.from(walk(doc as never));
		expect(entries).toHaveLength(1);
		expect(entries[0]?.path).toBe("color.primary");
	});
});
