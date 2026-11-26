import type { ShorteningMap } from "@styleframe/core";
import type { Root, Utility } from "@styleframe/core";
import { describe, expect, it } from "vitest";

import { shortenUtilityOptions, buildClassNameLookup } from "./shorten";

const map: ShorteningMap = {
	p: {
		"margin-top": "mt",
		"border-width": "bw",
		"font-size": "fs",
		color: "c",
	},
	v: {
		primary: "pr",
		secondary: "se",
		medium: "me",
	},
	m: {
		hover: "h",
		focus: "f",
		"focus-within": "fw",
	},
};

describe("shortenUtilityOptions", () => {
	it("shortens property and value", () => {
		const result = shortenUtilityOptions({ name: "color", value: "primary", modifiers: [] }, map);
		expect(result).toEqual({ name: "c", value: "pr", modifiers: [] });
	});

	it("shortens property only when value is not in map", () => {
		const result = shortenUtilityOptions({ name: "margin-top", value: "2", modifiers: [] }, map);
		expect(result).toEqual({ name: "mt", value: "2", modifiers: [] });
	});

	it("shortens modifiers", () => {
		const result = shortenUtilityOptions(
			{ name: "color", value: "primary", modifiers: ["hover", "focus"] },
			map,
		);
		expect(result).toEqual({ name: "c", value: "pr", modifiers: ["h", "f"] });
	});

	it("shortens three or more modifiers", () => {
		const result = shortenUtilityOptions(
			{
				name: "color",
				value: "primary",
				modifiers: ["hover", "focus", "focus-within"],
			},
			map,
		);
		expect(result).toEqual({
			name: "c",
			value: "pr",
			modifiers: ["h", "f", "fw"],
		});
	});

	it("passes unknown modifiers through unchanged", () => {
		const result = shortenUtilityOptions(
			{ name: "color", value: "primary", modifiers: ["hover", "sm", "dark"] },
			map,
		);
		expect(result).toEqual({
			name: "c",
			value: "pr",
			modifiers: ["h", "sm", "dark"],
		});
	});

	it("preserves default value", () => {
		const result = shortenUtilityOptions({ name: "color", value: "default", modifiers: [] }, map);
		expect(result).toEqual({ name: "c", value: "default", modifiers: [] });
	});

	it("preserves arbitrary values in brackets", () => {
		const result = shortenUtilityOptions(
			{ name: "margin-top", value: "[16px]", modifiers: [] },
			map,
		);
		expect(result).toEqual({ name: "mt", value: "[16px]", modifiers: [] });
	});

	it("preserves hash values", () => {
		const result = shortenUtilityOptions({ name: "color", value: "#1E3A8A", modifiers: [] }, map);
		expect(result).toEqual({ name: "c", value: "#1E3A8A", modifiers: [] });
	});

	it("passes through unknown properties and values unchanged", () => {
		const result = shortenUtilityOptions(
			{ name: "unknown", value: "thing", modifiers: ["custom"] },
			map,
		);
		expect(result).toEqual({
			name: "unknown",
			value: "thing",
			modifiers: ["custom"],
		});
	});
});

describe("buildClassNameLookup", () => {
	function createMockRoot(utilities: Array<Partial<Utility>>): Root {
		return {
			type: "root",
			id: "rt-test",
			declarations: {},
			utilities: [],
			modifiers: [],
			recipes: [],
			variables: [],
			children: utilities.map(
				(u) =>
					({
						type: "utility",
						id: "u-1",
						name: u.name ?? "",
						value: u.value ?? "",
						declarations: {},
						variables: [],
						children: [],
						modifiers: u.modifiers ?? [],
					}) as Utility,
			),
			themes: [],
			_registry: new Map(),
			_usage: {
				variables: new Set(),
				utilities: new Set(),
				recipes: new Set(),
				recipeUtilities: new Map(),
			},
		};
	}

	it("builds a full-to-short lookup from utility instances", () => {
		const root = createMockRoot([
			{ name: "color", value: "primary", modifiers: [] },
			{ name: "margin-top", value: "2", modifiers: [] },
		]);

		const lookup = buildClassNameLookup(root, map);
		expect(lookup["_color:primary"]).toBe("_c:pr");
		expect(lookup["_margin-top:2"]).toBe("_mt:2");
	});

	it("includes utilities with a single modifier", () => {
		const root = createMockRoot([{ name: "color", value: "primary", modifiers: ["hover"] }]);

		const lookup = buildClassNameLookup(root, map);
		expect(lookup["_hover:color:primary"]).toBe("_h:c:pr");
	});

	it("includes utilities with multiple modifiers", () => {
		const root = createMockRoot([
			{ name: "color", value: "primary", modifiers: ["hover", "focus"] },
			{
				name: "border-width",
				value: "medium",
				modifiers: ["hover", "focus", "focus-within"],
			},
		]);

		const lookup = buildClassNameLookup(root, map);
		expect(lookup["_hover:focus:color:primary"]).toBe("_h:f:c:pr");
		expect(lookup["_hover:focus:focus-within:border-width:medium"]).toBe("_h:f:fw:bw:me");
	});

	it("skips entries where full and short names are identical", () => {
		const root = createMockRoot([{ name: "unknown", value: "thing", modifiers: [] }]);

		const lookup = buildClassNameLookup(root, map);
		expect(lookup["_unknown:thing"]).toBeUndefined();
	});

	it("uses custom selector function", () => {
		const root = createMockRoot([{ name: "color", value: "primary", modifiers: [] }]);

		const customFn = (opts: { name: string; value: string; modifiers: Array<string> }) =>
			`u-${opts.name}-${opts.value}`;

		const lookup = buildClassNameLookup(root, map, customFn);
		expect(lookup["u-color-primary"]).toBe("u-c-pr");
	});
});
