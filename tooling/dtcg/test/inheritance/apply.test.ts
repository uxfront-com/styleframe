import { describe, expect, it } from "vitest";

import { applyInheritance } from "../../src/inheritance/apply";
import type { DTCGDocument } from "../../src/types/token";

describe("applyInheritance", () => {
	it("inherits $type from immediate parent group", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
			},
		};
		const out = applyInheritance(doc);
		expect((out.color as unknown as Record<string, any>)["primary"].$type).toBe("color");
	});

	it("inherits transitively through nested groups", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				palette: {
					brand: {
						primary: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
					},
				},
			},
		};
		const out = applyInheritance(doc);
		expect((out.color as unknown as Record<string, any>)["palette"].brand.primary.$type).toBe(
			"color",
		);
	});

	it("preserves explicit $type on tokens", () => {
		const doc: DTCGDocument = {
			mixed: {
				$type: "color",
				explicit: { $type: "dimension", $value: { value: 16, unit: "px" } },
			},
		};
		const out = applyInheritance(doc);
		expect((out.mixed as unknown as Record<string, any>)["explicit"].$type).toBe("dimension");
	});

	it("supports $type override on intermediate group", () => {
		const doc: DTCGDocument = {
			mixed: {
				$type: "color",
				dims: {
					$type: "dimension",
					small: { $value: { value: 4, unit: "px" } },
				},
				colors: {
					primary: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
				},
			},
		};
		const out = applyInheritance(doc);
		expect((out.mixed as unknown as Record<string, any>)["dims"].small.$type).toBe("dimension");
		expect((out.mixed as unknown as Record<string, any>)["colors"].primary.$type).toBe("color");
	});

	it("inherits $deprecated boolean from group", () => {
		const doc: DTCGDocument = {
			legacy: {
				$deprecated: true,
				old: { $value: 1 },
			},
		};
		const out = applyInheritance(doc);
		expect((out.legacy as unknown as Record<string, any>)["old"].$deprecated).toBe(true);
	});

	it("inherits $deprecated string message from group", () => {
		const doc: DTCGDocument = {
			legacy: {
				$deprecated: "Use newColors instead",
				old: { $value: 1 },
			},
		};
		const out = applyInheritance(doc);
		expect((out.legacy as unknown as Record<string, any>)["old"].$deprecated).toBe(
			"Use newColors instead",
		);
	});

	it("preserves explicit $deprecated on tokens", () => {
		const doc: DTCGDocument = {
			legacy: {
				$deprecated: "group",
				old: { $value: 1, $deprecated: "specific message" },
			},
		};
		const out = applyInheritance(doc);
		expect((out.legacy as unknown as Record<string, any>)["old"].$deprecated).toBe(
			"specific message",
		);
	});

	it("does not mutate the input", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: { $value: { colorSpace: "srgb", components: [0, 0, 0] } },
			},
		};
		const original = JSON.parse(JSON.stringify(doc));
		applyInheritance(doc);
		expect(doc).toEqual(original);
	});

	it("leaves tokens untouched when no ancestor sets $type", () => {
		const doc: DTCGDocument = {
			a: { $value: 42 },
		};
		const out = applyInheritance(doc);
		expect((out as unknown as Record<string, any>)["a"].$type).toBeUndefined();
	});
});
