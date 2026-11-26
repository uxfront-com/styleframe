import { styleframe } from "@styleframe/core";
import { describe, expect, it } from "vitest";

import { createDynamicUtilities } from "./dynamic";
import { matchUtilities } from "./matcher";
import { registerMatchedUtilities } from "./register";
import type { ParsedUtility, UtilityMatch } from "./types";

function createParsedUtility(
	overrides: Partial<ParsedUtility> & { name: string; value: string },
): ParsedUtility {
	return {
		raw: `_${overrides.modifiers?.length ? `${overrides.modifiers.join(":")}:` : ""}${overrides.name}:${overrides.value}`,
		modifiers: [],
		isArbitrary: false,
		...overrides,
	};
}

function createUnmatchedMatch(parsed: ParsedUtility): UtilityMatch {
	return {
		parsed,
		factory: null,
		modifierFactories: [],
		exists: false,
	};
}

describe("createDynamicUtilities", () => {
	it("creates a factory for a valid CSS property", () => {
		const s = styleframe();
		const parsed = createParsedUtility({
			name: "background",
			value: "[red]",
			isArbitrary: true,
			arbitraryValue: "red",
		});
		const matches: Array<UtilityMatch> = [createUnmatchedMatch(parsed)];

		const count = createDynamicUtilities(s.root, matches);

		expect(count).toBe(1);
		expect(matches[0]?.factory).not.toBeNull();
		expect(matches[0]?.factory?.name).toBe("background");
		expect(s.root.utilities.some((u) => u.name === "background")).toBe(true);
	});

	it("skips non-CSS-property names", () => {
		const s = styleframe();
		const parsed = createParsedUtility({ name: "unknown-thing", value: "sm" });
		const matches: Array<UtilityMatch> = [createUnmatchedMatch(parsed)];

		const count = createDynamicUtilities(s.root, matches);

		expect(count).toBe(0);
		expect(matches[0]?.factory).toBeNull();
	});

	it("creates one factory for multiple matches with the same property", () => {
		const s = styleframe();
		const matches: Array<UtilityMatch> = [
			createUnmatchedMatch(
				createParsedUtility({
					name: "display",
					value: "flex",
				}),
			),
			createUnmatchedMatch(
				createParsedUtility({
					name: "display",
					value: "grid",
				}),
			),
		];

		const count = createDynamicUtilities(s.root, matches);

		expect(count).toBe(1);
		expect(matches[0]?.factory).not.toBeNull();
		expect(matches[1]?.factory).not.toBeNull();
		expect(matches[0]?.factory).toBe(matches[1]?.factory);
	});

	it("does not recreate factory if already registered", () => {
		const s = styleframe();
		const { utility } = s;
		utility("margin", ({ value }) => ({ margin: value }));

		const parsed = createParsedUtility({ name: "margin", value: "sm" });
		const matches: Array<UtilityMatch> = [
			{
				parsed,
				factory: s.root.utilities.find((u) => u.name === "margin")!,
				modifierFactories: [],
				exists: false,
			},
		];

		const count = createDynamicUtilities(s.root, matches);

		expect(count).toBe(0);
		expect(s.root.utilities.filter((u) => u.name === "margin").length).toBe(1);
	});

	it("skips matches that already have a factory", () => {
		const s = styleframe();
		const { utility } = s;
		utility("display", ({ value }) => ({ display: value }));

		const factory = s.root.utilities.find((u) => u.name === "display")!;
		const matches: Array<UtilityMatch> = [
			{
				parsed: createParsedUtility({ name: "display", value: "flex" }),
				factory,
				modifierFactories: [],
				exists: false,
			},
		];

		const count = createDynamicUtilities(s.root, matches);

		expect(count).toBe(0);
	});

	it("returns 0 when all matches have factories", () => {
		const s = styleframe();
		const count = createDynamicUtilities(s.root, []);
		expect(count).toBe(0);
	});
});

describe("dynamic utilities end-to-end", () => {
	it("registers arbitrary value for a dynamic CSS property", () => {
		const s = styleframe();
		const parsed: Array<ParsedUtility> = [
			createParsedUtility({
				name: "background",
				value: "[red]",
				isArbitrary: true,
				arbitraryValue: "red",
			}),
		];

		const matches = matchUtilities(parsed, s.root);
		const registered = registerMatchedUtilities(s.root, matches);

		expect(registered).toBe(1);
		const factory = s.root.utilities.find((u) => u.name === "background");
		expect(factory).toBeDefined();
		expect(factory?.values.some((v) => v.key === "[red]")).toBe(true);
	});

	it("registers non-arbitrary literal CSS values", () => {
		const s = styleframe();
		const parsed: Array<ParsedUtility> = [
			createParsedUtility({
				name: "display",
				value: "flex",
			}),
		];

		const matches = matchUtilities(parsed, s.root);
		const registered = registerMatchedUtilities(s.root, matches);

		expect(registered).toBe(1);
		const factory = s.root.utilities.find((u) => u.name === "display");
		expect(factory).toBeDefined();
		expect(factory?.values.some((v) => v.key === "flex")).toBe(true);
	});

	it("preserves modifiers through dynamic creation", () => {
		const s = styleframe();
		const { modifier } = s;
		modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));

		const parsed: Array<ParsedUtility> = [
			createParsedUtility({
				name: "opacity",
				value: "[0.5]",
				modifiers: ["hover"],
				isArbitrary: true,
				arbitraryValue: "0.5",
				raw: "_hover:opacity:[0.5]",
			}),
		];

		const matches = matchUtilities(parsed, s.root);
		const registered = registerMatchedUtilities(s.root, matches);

		expect(registered).toBe(1);
		const factory = s.root.utilities.find((u) => u.name === "opacity");
		expect(factory).toBeDefined();
		expect(
			factory?.values.some(
				(v) => v.key === "[0.5]" && v.modifiers.length === 1 && v.modifiers[0] === "hover",
			),
		).toBe(true);
	});

	it("tracks dynamic utilities in _usage.utilities", () => {
		const s = styleframe();
		const parsed: Array<ParsedUtility> = [
			createParsedUtility({
				name: "cursor",
				value: "pointer",
			}),
		];

		const matches = matchUtilities(parsed, s.root);
		registerMatchedUtilities(s.root, matches);

		expect(s.root._usage.utilities.has("_cursor:pointer")).toBe(true);
	});

	it("does not create factories for non-CSS-property names", () => {
		const s = styleframe();
		const parsed: Array<ParsedUtility> = [
			createParsedUtility({
				name: "not-a-property",
				value: "something",
			}),
		];

		const matches = matchUtilities(parsed, s.root);
		registerMatchedUtilities(s.root, matches);

		expect(s.root.utilities.some((u) => u.name === "not-a-property")).toBe(false);
	});

	it("handles underscore-to-space conversion in arbitrary values", () => {
		const s = styleframe();
		const parsed: Array<ParsedUtility> = [
			createParsedUtility({
				name: "padding",
				value: "[10px_20px]",
				isArbitrary: true,
				arbitraryValue: "10px_20px",
			}),
		];

		const matches = matchUtilities(parsed, s.root);
		registerMatchedUtilities(s.root, matches);

		const factory = s.root.utilities.find((u) => u.name === "padding");
		expect(factory).toBeDefined();
		const entry = factory?.values.find((v) => v.key === "[10px_20px]");
		expect(entry).toBeDefined();
		expect(entry?.value).toBe("10px 20px");
	});
});
