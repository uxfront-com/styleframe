import { describe, expect, it } from "vitest";
import type { ModifierFactory, Root, UtilityFactory } from "@styleframe/core";
import type { ParsedUtility } from "./types";
import {
	createUtilityFilter,
	filterUtilities,
	classNameFromUtilityOptions,
	generateUtilitySelector,
	getUsedClassNames,
	matchUtilities,
} from "./matcher";

function createMockRoot(
	utilities: Array<UtilityFactory> = [],
	modifiers: Array<ModifierFactory> = [],
): Root {
	return {
		type: "root",
		id: "test-id",
		_registry: new Map(),
		_usage: {
			variables: new Set(),
			utilities: new Set(),
			recipes: new Set(),
			recipeUtilities: new Map(),
		},
		declarations: {},
		utilities,
		modifiers,
		recipes: [],
		variables: [],
		children: [],
		themes: [],
	};
}

function createMockUtilityFactory(
	name: string,
	values: Array<{ key: string; modifiers: Array<string> }> = [],
): UtilityFactory {
	return {
		type: "utility",
		name,
		factory: () => ({}),
		values: values.map((v) => ({ ...v, value: v.key })),
		autogenerate: () => ({}),
		create: () => {},
	};
}

function createMockModifier(keys: Array<string>): ModifierFactory {
	return {
		type: "modifier",
		key: keys,
		factory: () => ({}),
	};
}

describe("matchUtilities", () => {
	it("should match parsed utility to factory", () => {
		const parsed: Array<ParsedUtility> = [
			{
				raw: "_margin:sm",
				name: "margin",
				value: "sm",
				modifiers: [],
				isArbitrary: false,
			},
		];

		const marginFactory = createMockUtilityFactory("margin", [
			{ key: "sm", modifiers: [] },
		]);

		const root = createMockRoot([marginFactory]);
		const matches = matchUtilities(parsed, root);

		expect(matches).toHaveLength(1);
		expect(matches[0]?.factory).toBe(marginFactory);
		expect(matches[0]?.exists).toBe(true);
	});

	it("should return null factory when utility not found", () => {
		const parsed: Array<ParsedUtility> = [
			{
				raw: "_unknown:value",
				name: "unknown",
				value: "value",
				modifiers: [],
				isArbitrary: false,
			},
		];

		const root = createMockRoot();
		const matches = matchUtilities(parsed, root);

		expect(matches).toHaveLength(1);
		expect(matches[0]?.factory).toBeNull();
		expect(matches[0]?.exists).toBe(false);
	});

	it("should match modifiers", () => {
		const parsed: Array<ParsedUtility> = [
			{
				raw: "_hover:margin:sm",
				name: "margin",
				value: "sm",
				modifiers: ["hover"],
				isArbitrary: false,
			},
		];

		const marginFactory = createMockUtilityFactory("margin", [
			{ key: "sm", modifiers: ["hover"] },
		]);

		const hoverModifier = createMockModifier(["hover"]);
		const root = createMockRoot([marginFactory], [hoverModifier]);
		const matches = matchUtilities(parsed, root);

		expect(matches).toHaveLength(1);
		expect(matches[0]?.modifierFactories).toHaveLength(1);
		expect(matches[0]?.modifierFactories[0]).toBe(hoverModifier);
		expect(matches[0]?.exists).toBe(true);
	});

	it("should handle multi-key modifiers", () => {
		const parsed: Array<ParsedUtility> = [
			{
				raw: "_sm:margin:md",
				name: "margin",
				value: "md",
				modifiers: ["sm"],
				isArbitrary: false,
			},
		];

		const marginFactory = createMockUtilityFactory("margin", [
			{ key: "md", modifiers: ["sm"] },
		]);

		// Breakpoint modifier with multiple keys
		const breakpointModifier = createMockModifier(["sm", "md", "lg"]);
		const root = createMockRoot([marginFactory], [breakpointModifier]);
		const matches = matchUtilities(parsed, root);

		expect(matches).toHaveLength(1);
		expect(matches[0]?.modifierFactories).toHaveLength(1);
		expect(matches[0]?.modifierFactories[0]).toBe(breakpointModifier);
	});

	it("should mark non-existent value as not existing", () => {
		const parsed: Array<ParsedUtility> = [
			{
				raw: "_margin:xl",
				name: "margin",
				value: "xl",
				modifiers: [],
				isArbitrary: false,
			},
		];

		const marginFactory = createMockUtilityFactory("margin", [
			{ key: "sm", modifiers: [] },
			{ key: "md", modifiers: [] },
		]);

		const root = createMockRoot([marginFactory]);
		const matches = matchUtilities(parsed, root);

		expect(matches).toHaveLength(1);
		expect(matches[0]?.factory).toBe(marginFactory);
		expect(matches[0]?.exists).toBe(false);
	});
});

describe("generateUtilitySelector", () => {
	it("should generate selector for simple utility", () => {
		const selector = generateUtilitySelector({
			name: "margin",
			value: "sm",
			modifiers: [],
		});

		expect(selector).toBe(String.raw`._margin\:sm`);
	});

	it("should generate selector with default value", () => {
		const selector = generateUtilitySelector({
			name: "hidden",
			value: "default",
			modifiers: [],
		});

		expect(selector).toBe("._hidden");
	});

	it("should generate selector with modifier", () => {
		const selector = generateUtilitySelector({
			name: "margin",
			value: "sm",
			modifiers: ["hover"],
		});

		expect(selector).toBe(String.raw`._hover\:margin\:sm`);
	});

	it("should escape special characters", () => {
		const selector = generateUtilitySelector({
			name: "margin",
			value: "[16px]",
			modifiers: [],
		});

		expect(selector).toBe(String.raw`._margin\:\[16px\]`);
	});
});

describe("classNameFromUtilityOptions", () => {
	it("should generate class name without CSS escaping", () => {
		const className = classNameFromUtilityOptions({
			name: "margin",
			value: "sm",
			modifiers: [],
		});

		expect(className).toBe("_margin:sm");
	});

	it("should generate class name with modifier", () => {
		const className = classNameFromUtilityOptions({
			name: "margin",
			value: "sm",
			modifiers: ["hover"],
		});

		expect(className).toBe("_hover:margin:sm");
	});

	it("should use custom selector function", () => {
		const customFn = ({
			name,
			value,
			modifiers,
		}: {
			name: string;
			value: string;
			modifiers: Array<string>;
		}) => {
			const parts = [
				...modifiers,
				name,
				...(value === "default" ? [] : [value]),
			];
			return `sf-${parts.join("-")}`;
		};

		const className = classNameFromUtilityOptions(
			{ name: "margin", value: "sm", modifiers: [] },
			customFn,
		);
		expect(className).toBe("sf-margin-sm");
	});

	it("should use custom selector function with modifiers", () => {
		const customFn = ({
			name,
			value,
			modifiers,
		}: {
			name: string;
			value: string;
			modifiers: Array<string>;
		}) => {
			const parts = [
				...modifiers,
				name,
				...(value === "default" ? [] : [value]),
			];
			return `sf-${parts.join("-")}`;
		};

		const className = classNameFromUtilityOptions(
			{ name: "margin", value: "sm", modifiers: ["hover"] },
			customFn,
		);
		expect(className).toBe("sf-hover-margin-sm");
	});
});

describe("generateUtilitySelector", () => {
	it("should derive selector from custom selector function", () => {
		const customFn = ({
			name,
			value,
		}: {
			name: string;
			value: string;
			modifiers: Array<string>;
		}) => `sf-${name}-${value}`;

		const selector = generateUtilitySelector(
			{ name: "margin", value: "sm", modifiers: [] },
			customFn,
		);
		expect(selector).toBe(".sf-margin-sm");
	});
});

describe("createUtilityFilter", () => {
	it("should create filter that matches used classes", () => {
		const usedClasses = new Set(["_margin:sm", "_padding:md"]);
		const filter = createUtilityFilter(usedClasses);

		const matchingUtility = {
			type: "utility" as const,
			id: "test-id",
			name: "margin",
			value: "sm",
			modifiers: [],
			declarations: {},
			variables: [],
			children: [],
		};

		const nonMatchingUtility = {
			type: "utility" as const,
			id: "test-id",
			name: "margin",
			value: "lg",
			modifiers: [],
			declarations: {},
			variables: [],
			children: [],
		};

		expect(filter(matchingUtility)).toBe(true);
		expect(filter(nonMatchingUtility)).toBe(false);
	});

	it("should match utilities with modifiers", () => {
		const usedClasses = new Set(["_hover:margin:sm"]);
		const filter = createUtilityFilter(usedClasses);

		const matchingUtility = {
			type: "utility" as const,
			id: "test-id",
			name: "margin",
			value: "sm",
			modifiers: ["hover"],
			declarations: {},
			variables: [],
			children: [],
		};

		expect(filter(matchingUtility)).toBe(true);
	});

	it("should use custom selector function for filtering", () => {
		const customFn = ({
			name,
			value,
			modifiers,
		}: {
			name: string;
			value: string;
			modifiers: Array<string>;
		}) => {
			const parts = [
				...modifiers,
				name,
				...(value === "default" ? [] : [value]),
			];
			return `sf-${parts.join("-")}`;
		};

		const usedClasses = new Set(["sf-margin-sm"]);
		const filter = createUtilityFilter(usedClasses, customFn);

		const matchingUtility = {
			type: "utility" as const,
			id: "test-id",
			name: "margin",
			value: "sm",
			modifiers: [],
			declarations: {},
			variables: [],
			children: [],
		};

		const nonMatchingUtility = {
			type: "utility" as const,
			id: "test-id",
			name: "margin",
			value: "lg",
			modifiers: [],
			declarations: {},
			variables: [],
			children: [],
		};

		expect(filter(matchingUtility)).toBe(true);
		expect(filter(nonMatchingUtility)).toBe(false);
	});
});

describe("filterUtilities", () => {
	it("should filter out unused utilities", () => {
		const root = createMockRoot();
		root.children = [
			{
				type: "utility",
				id: "test-id",
				name: "margin",
				value: "sm",
				modifiers: [],
				declarations: {},
				variables: [],
				children: [],
			},
			{
				type: "utility",
				id: "test-id",
				name: "margin",
				value: "lg",
				modifiers: [],
				declarations: {},
				variables: [],
				children: [],
			},
		];

		const usedClasses = new Set(["_margin:sm"]);
		const filtered = filterUtilities(root, usedClasses);

		expect(filtered).toHaveLength(1);
		expect(filtered[0]?.type).toBe("utility");
		if (filtered[0]?.type === "utility") {
			expect(filtered[0]?.value).toBe("sm");
		}
	});

	it("should keep non-utility children", () => {
		const root = createMockRoot();
		root.children = [
			{
				type: "selector",
				id: "test-id",
				query: ".custom",
				declarations: {},
				variables: [],
				children: [],
			},
			{
				type: "utility",
				id: "test-id",
				name: "margin",
				value: "lg",
				modifiers: [],
				declarations: {},
				variables: [],
				children: [],
			},
		];

		const usedClasses = new Set<string>();
		const filtered = filterUtilities(root, usedClasses);

		expect(filtered).toHaveLength(1);
		expect(filtered[0]?.type).toBe("selector");
	});
});

describe("getUsedClassNames", () => {
	it("should extract unique class names from matches", () => {
		const matches = [
			{
				parsed: {
					raw: "_margin:sm",
					name: "margin",
					value: "sm",
					modifiers: [],
					isArbitrary: false,
				},
				factory: null,
				modifierFactories: [],
				exists: false,
			},
			{
				parsed: {
					raw: "_padding:md",
					name: "padding",
					value: "md",
					modifiers: [],
					isArbitrary: false,
				},
				factory: null,
				modifierFactories: [],
				exists: false,
			},
		];

		const classNames = getUsedClassNames(matches);

		expect(classNames.has("_margin:sm")).toBe(true);
		expect(classNames.has("_padding:md")).toBe(true);
		expect(classNames.size).toBe(2);
	});
});
