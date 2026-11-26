import { describe, expect, it } from "vitest";

import type { DTCGDocument } from "../../src/types/token";
import { validate } from "../../src/validate/document";

describe("validate", () => {
	it("returns no errors for a valid document", () => {
		const doc: DTCGDocument = {
			$schema: "https://...",
			color: {
				$type: "color",
				primary: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
			},
			spacing: {
				small: { $type: "dimension", $value: { value: 4, unit: "px" } },
			},
		};
		expect(validate(doc)).toEqual([]);
	});

	it("flags unknown $type", () => {
		const doc: DTCGDocument = {
			x: { $type: "magic" as never, $value: "x" },
		};
		const errs = validate(doc);
		expect(errs.length).toBeGreaterThan(0);
		expect(errs[0]?.message).toMatch(/not a recognised DTCG type/);
	});

	it("flags color value mismatched with $type", () => {
		const doc: DTCGDocument = {
			x: { $type: "color", $value: "#ff0000" },
		};
		const errs = validate(doc);
		expect(errs.some((e) => e.message.includes("does not match"))).toBe(true);
	});

	it("flags missing $type without inheritance", () => {
		const doc: DTCGDocument = {
			x: { $value: 42 },
		};
		const errs = validate(doc);
		expect(errs.some((e) => e.message.includes("no $type"))).toBe(true);
	});

	it("uses inherited $type to validate value shape", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
			},
		};
		expect(validate(doc)).toEqual([]);
	});

	it("flags unknown alias targets", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: "{missing}" },
		};
		const errs = validate(doc);
		expect(errs.some((e) => e.message.includes("does not resolve"))).toBe(true);
	});

	it("flags alias type mismatch", () => {
		const doc: DTCGDocument = {
			c: {
				$type: "color",
				$value: { colorSpace: "srgb", components: [0, 0, 0] },
			},
			d: { $type: "dimension", $value: "{c}" },
		};
		const errs = validate(doc);
		expect(errs.some((e) => e.message.includes("type mismatch"))).toBe(true);
	});

	it("flags non-reverse-DNS extension keys", () => {
		const doc: DTCGDocument = {
			$extensions: { invalid: { foo: 1 } },
			x: { $type: "number", $value: 1 },
		};
		const errs = validate(doc);
		expect(errs.some((e) => e.message.includes("not reverse-DNS"))).toBe(true);
	});

	it("flags reserved characters in token names", () => {
		const doc = {
			"bad.name": { $type: "number", $value: 1 },
		} as unknown as DTCGDocument;
		const errs = validate(doc);
		expect(errs.some((e) => e.message.includes("reserved character"))).toBe(true);
	});

	it("validates composite types", () => {
		const doc: DTCGDocument = {
			border: {
				default: {
					$type: "border",
					$value: {
						color: { colorSpace: "srgb", components: [0, 0, 0] },
						width: { value: 1, unit: "px" },
						style: "solid",
					},
				},
			},
		};
		expect(validate(doc)).toEqual([]);
	});
});
