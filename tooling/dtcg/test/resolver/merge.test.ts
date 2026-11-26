import { describe, expect, it } from "vitest";

import { mergeDocuments } from "../../src/resolver/merge";
import type { DTCGDocument } from "../../src/types/token";

describe("mergeDocuments", () => {
	it("merges disjoint trees", () => {
		const a: DTCGDocument = { color: { primary: { $value: 1 } } };
		const b: DTCGDocument = { spacing: { small: { $value: 4 } } };
		const out = mergeDocuments(a, b);
		expect((out.color as unknown as Record<string, any>).primary.$value).toBe(1);
		expect((out.spacing as unknown as Record<string, any>).small.$value).toBe(4);
	});

	it("right-side token replaces left-side token entirely", () => {
		const a: DTCGDocument = {
			color: { primary: { $value: 1, $description: "left" } },
		};
		const b: DTCGDocument = {
			color: { primary: { $value: 2 } },
		};
		const out = mergeDocuments(a, b);
		expect((out.color as unknown as Record<string, any>).primary.$value).toBe(2);
		expect((out.color as unknown as Record<string, any>).primary.$description).toBeUndefined();
	});

	it("recurses into groups", () => {
		const a: DTCGDocument = {
			color: { palette: { red: { $value: 1 }, blue: { $value: 2 } } },
		};
		const b: DTCGDocument = {
			color: { palette: { red: { $value: 99 } } },
		};
		const out = mergeDocuments(a, b);
		expect((out.color as unknown as Record<string, any>).palette.red.$value).toBe(99);
		expect((out.color as unknown as Record<string, any>).palette.blue.$value).toBe(2);
	});

	it("does not mutate inputs", () => {
		const a: DTCGDocument = { x: { $value: 1 } };
		const b: DTCGDocument = { x: { $value: 2 } };
		const aCopy = JSON.parse(JSON.stringify(a));
		const bCopy = JSON.parse(JSON.stringify(b));
		mergeDocuments(a, b);
		expect(a).toEqual(aCopy);
		expect(b).toEqual(bCopy);
	});
});
