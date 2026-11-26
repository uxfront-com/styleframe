import type { DTCGAnyToken, DTCGDocument } from "@styleframe/dtcg";
import { describe, expect, it } from "vitest";

import type { FigmaExportFormat } from "../../types";
import { toDTCG } from "./to-dtcg";

describe("toDTCG (single-mode)", () => {
	it("emits a token document with no resolver for one mode", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [
				{
					name: "color/primary",
					type: "COLOR",
					values: { Default: { r: 1, g: 0, b: 0, a: 1 } },
				},
			],
		};
		const { tokens, resolver } = toDTCG(data);
		expect(resolver).toBeUndefined();
		expect(tokens.$schema).toBe("https://design-tokens.org/schemas/2025.10/tokens.json");
		expect((tokens.color as DTCGDocument).primary).toMatchObject({
			$type: "color",
			$value: { colorSpace: "srgb", components: [1, 0, 0], hex: "#ff0000" },
		});
	});

	it("respects includeSchema: false", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [],
		};
		const { tokens } = toDTCG(data, { includeSchema: false });
		expect(tokens.$schema).toBeUndefined();
	});

	it("converts dimension floats to {value, unit: 'px'}", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [
				{
					name: "spacing/small",
					type: "FLOAT",
					values: { Default: 4 },
				},
			],
		};
		const { tokens } = toDTCG(data);
		const spacing = (tokens.spacing as DTCGDocument).small as {
			$value: unknown;
		};
		expect(spacing.$value).toEqual({ value: 4, unit: "px" });
	});

	it("preserves descriptions", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [
				{
					name: "color/primary",
					type: "COLOR",
					values: { Default: { r: 0, g: 0, b: 0 } },
					description: "Brand primary",
				},
			],
		};
		const { tokens } = toDTCG(data);
		const primary = (tokens.color as DTCGDocument).primary as {
			$description?: string;
		};
		expect(primary.$description).toBe("Brand primary");
	});

	it("emits aliases as DTCG alias strings", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [
				{
					name: "color/primary",
					type: "COLOR",
					values: { Default: { r: 1, g: 0, b: 0 } },
				},
				{
					name: "color/accent",
					type: "COLOR",
					values: { Default: { type: "VARIABLE_ALIAS", id: "color/primary" } },
					aliasTo: "color/primary",
				},
			],
		};
		const { tokens } = toDTCG(data);
		const accent = (tokens.color as DTCGDocument).accent as { $value: unknown };
		expect(accent.$value).toBe("{color.primary}");
	});

	it("maps BOOLEAN variables to string with dev.styleframe.boolean extension", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [
				{
					name: "feature/enabled",
					type: "BOOLEAN",
					values: { Default: true },
				},
			],
		};
		const { tokens } = toDTCG(data);
		const token = (tokens.feature as DTCGDocument).enabled as DTCGAnyToken;
		expect(token).toBeDefined();
		expect(token.$value).toBe("true");
		expect(token.$type).toBe("string");
		expect((token.$extensions as Record<string, unknown>)?.["dev.styleframe"]).toEqual({
			boolean: true,
		});
	});
});

describe("toDTCG (multi-mode)", () => {
	it("emits a token doc + resolver doc for >1 mode", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["light", "dark"],
			variables: [
				{
					name: "color/bg",
					type: "COLOR",
					values: {
						light: { r: 1, g: 1, b: 1, a: 1 },
						dark: { r: 0, g: 0, b: 0, a: 1 },
					},
				},
			],
		};
		const { tokens, resolver } = toDTCG(data);
		expect(resolver).toBeDefined();
		expect(resolver?.version).toBe("2025.10");
		expect(resolver?.modifiers?.theme?.default).toBe("light");
		const darkContext = resolver?.modifiers?.theme?.contexts.dark?.[0] as DTCGDocument;
		const darkBg = (darkContext.color as DTCGDocument).bg as {
			$value: unknown;
		};
		expect(darkBg.$value).toMatchObject({
			colorSpace: "srgb",
			components: [0, 0, 0],
		});
		// default mode lives in the main token doc
		const lightBg = (tokens.color as DTCGDocument).bg as { $value: unknown };
		expect(lightBg.$value).toMatchObject({
			colorSpace: "srgb",
			components: [1, 1, 1],
		});
	});

	it("does not include override entries identical to the default", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["light", "dark"],
			variables: [
				{
					name: "color/border",
					type: "COLOR",
					values: {
						light: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
						dark: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
					},
				},
			],
		};
		const { resolver } = toDTCG(data);
		const darkCtx = resolver?.modifiers?.theme?.contexts.dark?.[0] as Record<string, unknown>;
		expect(Object.keys(darkCtx)).toHaveLength(0);
	});

	it("supports a custom modifier name", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["sm", "lg"],
			variables: [
				{
					name: "spacing/gap",
					type: "FLOAT",
					values: { sm: 4, lg: 16 },
				},
			],
		};
		const { resolver } = toDTCG(data, { modifierName: "size" });
		expect(resolver?.modifiers?.size?.contexts.lg).toBeDefined();
		expect(resolver?.resolutionOrder[0]).toEqual({ $ref: "#/modifiers/size" });
	});
});

describe("toDTCG ($root handling)", () => {
	it("promotes group-level alias to $root when children exist", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [
				{
					name: "scale",
					type: "FLOAT",
					values: {
						Default: { type: "VARIABLE_ALIAS", id: "scale/minor-third" },
					},
					aliasTo: "scale/minor-third",
				},
				{
					name: "scale/minor-third",
					type: "FLOAT",
					values: { Default: 1.2 },
				},
				{
					name: "scale/major-third",
					type: "FLOAT",
					values: { Default: 1.25 },
				},
			],
		};
		const { tokens } = toDTCG(data);
		const scale = tokens.scale as Record<string, unknown>;
		expect(scale.$root).toBeDefined();
		expect((scale.$root as DTCGAnyToken).$value).toBe("{scale.minor-third}");
		expect(scale["minor-third"]).toBeDefined();
		expect(scale["major-third"]).toBeDefined();
	});

	it("promotes to $root when children are placed before the group-level token", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["Default"],
			variables: [
				{
					name: "spacing/sm",
					type: "FLOAT",
					values: { Default: 4 },
				},
				{
					name: "spacing/md",
					type: "FLOAT",
					values: { Default: 8 },
				},
				{
					name: "spacing",
					type: "FLOAT",
					values: {
						Default: { type: "VARIABLE_ALIAS", id: "spacing/md" },
					},
					aliasTo: "spacing/md",
				},
			],
		};
		const { tokens } = toDTCG(data);
		const spacing = tokens.spacing as Record<string, unknown>;
		expect(spacing.$root).toBeDefined();
		expect((spacing.$root as DTCGAnyToken).$value).toBe("{spacing.md}");
		expect(spacing.sm).toBeDefined();
		expect(spacing.md).toBeDefined();
	});
});

describe("toDTCG round-trip", () => {
	it("FigmaExportFormat → toDTCG → resolver-shape preserves color components", () => {
		const data: FigmaExportFormat = {
			collection: "X",
			modes: ["light", "dark"],
			variables: [
				{
					name: "color/bg",
					type: "COLOR",
					values: {
						light: { r: 1, g: 1, b: 1, a: 1 },
						dark: { r: 0, g: 0, b: 0, a: 1 },
					},
				},
			],
		};
		const { tokens, resolver } = toDTCG(data);
		// Only the non-default override is emitted as a context entry
		expect(Object.keys(resolver?.modifiers?.theme?.contexts ?? {})).toEqual(["dark"]);
		// The default value lives in tokens
		const lightBg = (tokens.color as DTCGDocument).bg as {
			$value: { components: Array<number> };
		};
		expect(lightBg.$value.components).toEqual([1, 1, 1]);
	});
});
