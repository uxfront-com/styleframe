import { describe, expect, it } from "vitest";
import { resolveAliases } from "../../src/alias/resolve";
import {
	CircularReferenceError,
	UnknownReferenceError,
} from "../../src/parse/errors";
import type { DTCGDocument } from "../../src/types/token";

describe("resolveAliases", () => {
	it("resolves a one-hop alias", () => {
		const doc: DTCGDocument = {
			color: {
				primary: {
					$type: "color",
					$value: { colorSpace: "srgb", components: [1, 0, 0] },
				},
				accent: { $type: "color", $value: "{color.primary}" },
			},
		};
		const out = resolveAliases(doc);
		expect(
			(out.color as unknown as Record<string, any>)["accent"].$value,
		).toEqual({
			colorSpace: "srgb",
			components: [1, 0, 0],
		});
	});

	it("resolves a transitive A→B→C chain", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: 42 },
			b: { $type: "number", $value: "{a}" },
			c: { $type: "number", $value: "{b}" },
		};
		const out = resolveAliases(doc);
		expect((out as unknown as Record<string, any>)["c"].$value).toBe(42);
		expect((out as unknown as Record<string, any>)["b"].$value).toBe(42);
	});

	it("does not mutate the input document", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: 1 },
			b: { $type: "number", $value: "{a}" },
		};
		const original = JSON.parse(JSON.stringify(doc));
		resolveAliases(doc);
		expect(doc).toEqual(original);
	});

	it("detects A→A self-cycles", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: "{a}" },
		};
		expect(() => resolveAliases(doc)).toThrow(CircularReferenceError);
	});

	it("detects A→B→A cycles", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: "{b}" },
			b: { $type: "number", $value: "{a}" },
		};
		expect(() => resolveAliases(doc)).toThrow(CircularReferenceError);
	});

	it("detects A→B→C→A cycles", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: "{b}" },
			b: { $type: "number", $value: "{c}" },
			c: { $type: "number", $value: "{a}" },
		};
		try {
			resolveAliases(doc);
			expect.fail("expected CircularReferenceError");
		} catch (error) {
			expect(error).toBeInstanceOf(CircularReferenceError);
			expect((error as CircularReferenceError).cycle).toContain("a");
			expect((error as CircularReferenceError).cycle).toContain("b");
			expect((error as CircularReferenceError).cycle).toContain("c");
		}
	});

	it("resolves aliases in nested groups", () => {
		const doc: DTCGDocument = {
			color: {
				palette: {
					red: {
						$type: "color",
						$value: { colorSpace: "srgb", components: [1, 0, 0] },
					},
				},
				semantic: {
					danger: { $type: "color", $value: "{color.palette.red}" },
				},
			},
		};
		const out = resolveAliases(doc);
		const danger = (out.color as unknown as Record<string, any>)["semantic"]
			.danger;
		expect(danger.$value).toEqual({
			colorSpace: "srgb",
			components: [1, 0, 0],
		});
	});

	it("resolves aliases inside composite values", () => {
		const doc: DTCGDocument = {
			color: {
				border: {
					$type: "color",
					$value: { colorSpace: "srgb", components: [0, 0, 0] },
				},
			},
			width: {
				thin: { $type: "dimension", $value: { value: 1, unit: "px" } },
			},
			border: {
				default: {
					$type: "border",
					$value: {
						color: "{color.border}",
						width: "{width.thin}",
						style: "solid",
					},
				},
			},
		};
		const out = resolveAliases(doc);
		const border = (out.border as unknown as Record<string, any>)["default"]
			.$value;
		expect(border.color).toEqual({ colorSpace: "srgb", components: [0, 0, 0] });
		expect(border.width).toEqual({ value: 1, unit: "px" });
		expect(border.style).toBe("solid");
	});

	it("leaves unknown aliases as-is in non-strict mode", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: "{missing.token}" },
		};
		const out = resolveAliases(doc);
		expect((out as unknown as Record<string, any>)["a"].$value).toBe(
			"{missing.token}",
		);
	});

	it("throws UnknownReferenceError in strict mode", () => {
		const doc: DTCGDocument = {
			a: { $type: "number", $value: "{missing.token}" },
		};
		expect(() => resolveAliases(doc, { strict: true })).toThrow(
			UnknownReferenceError,
		);
	});

	it("ignores metadata keys when walking", () => {
		const doc: DTCGDocument = {
			$schema: "https://example",
			$description: "test",
			color: {
				$description: "group desc",
				primary: {
					$type: "color",
					$value: { colorSpace: "srgb", components: [0, 0, 1] },
				},
			},
		};
		expect(() => resolveAliases(doc)).not.toThrow();
	});
});
