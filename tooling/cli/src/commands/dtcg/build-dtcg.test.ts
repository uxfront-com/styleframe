import type { Root, Theme, Variable } from "@styleframe/core";
import type { CSS, Reference, TokenValue } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import {
	useFluidViewportDesignTokens,
	useFontSizeDesignTokens,
} from "@styleframe/theme";
import { describe, expect, it } from "vitest";
import { buildDTCG } from "./build-dtcg";

function v(name: string, value: TokenValue): Variable {
	return { type: "variable", id: name, name, value };
}

function ref(name: string): Reference {
	return { type: "reference", name };
}

function css(...parts: Array<string | TokenValue>): CSS {
	return { type: "css", value: parts as Array<TokenValue> };
}

function theme(name: string, variables: Array<Variable>): Theme {
	return {
		type: "theme",
		id: `theme:${name}`,
		name,
		declarations: { properties: [] } as never,
		variables,
		children: [],
	};
}

function makeRoot(variables: Array<Variable>, themes: Array<Theme> = []): Root {
	return {
		type: "root",
		id: "root",
		declarations: { properties: [] } as never,
		utilities: [],
		modifiers: [],
		recipes: [],
		variables,
		children: [],
		themes,
		_registry: new Map(),
		_usage: {
			variables: new Set(),
			utilities: new Set(),
			recipes: new Set(),
			recipeUtilities: new Map(),
		},
	};
}

describe("buildDTCG", () => {
	it("emits a typed color token", () => {
		const root = makeRoot([v("color.primary", "#ff0000")]);
		const { tokens, resolver, diagnostics } = buildDTCG(root);
		expect(resolver).toBeUndefined();
		expect(diagnostics).toEqual([]);
		const primary = (tokens.color as unknown as Record<string, any>)
			.primary as Record<string, unknown>;
		expect(primary.$type).toBe("color");
	});

	it("emits a dimension token", () => {
		const root = makeRoot([v("spacing.small", "4px")]);
		const { tokens } = buildDTCG(root);
		const small = (tokens.spacing as unknown as Record<string, any>)
			.small as Record<string, unknown>;
		expect(small.$type).toBe("dimension");
		expect(small.$value).toEqual({ value: 4, unit: "px" });
	});

	it("emits an alias with the target's stamped $type", () => {
		const root = makeRoot([
			v("color.primary", "#ff0000"),
			v("color.accent", ref("color.primary")),
		]);
		const { tokens } = buildDTCG(root);
		const accent = (tokens.color as unknown as Record<string, any>)
			.accent as Record<string, unknown>;
		expect(accent.$value).toBe("{color.primary}");
		expect(accent.$type).toBe("color");
	});

	it("evaluates a pure-arithmetic CSS expression to a number", () => {
		const root = makeRoot([
			v("scale.base", 2),
			v("scale.ratio", 1.5),
			v("scale.product", css(ref("scale.base"), " * ", ref("scale.ratio"))),
		]);
		const { tokens } = buildDTCG(root);
		const product = (tokens.scale as unknown as Record<string, any>)
			.product as Record<string, unknown>;
		expect(product.$value).toBe(3);
		expect(product.$type).toBe("number");
	});

	it("classifies a numeric value under duration/ as duration", () => {
		const root = makeRoot([v("duration.fast", 200)]);
		const { tokens } = buildDTCG(root);
		const fast = (tokens.duration as unknown as Record<string, any>)
			.fast as Record<string, unknown>;
		expect(fast.$type).toBe("duration");
	});

	it("emits an unevaluable expression as a dev.styleframe.expression extension", () => {
		const root = makeRoot([
			v("fluid.x", css("clamp(", ref("missing"), ", 1vw, 100px)")),
		]);
		const { tokens, diagnostics } = buildDTCG(root);
		const fluid = (tokens.fluid as unknown as Record<string, any>).x as Record<
			string,
			unknown
		>;
		expect(fluid.$value).toContain("clamp(");
		const ext = (
			fluid.$extensions as unknown as Record<string, Record<string, any>>
		)["dev.styleframe"];
		expect(ext?.expression).toContain("clamp(");
		expect(
			diagnostics.some((d) => d.name === "fluid.x" && d.level === "warn"),
		).toBe(true);
	});

	it("skips boolean variables with a diagnostic", () => {
		const root = makeRoot([v("feature.enabled", true)]);
		const { tokens, diagnostics } = buildDTCG(root);
		expect(tokens.feature).toBeUndefined();
		expect(diagnostics.some((d) => d.name === "feature.enabled")).toBe(true);
	});

	it("emits a resolver document for themed configs", () => {
		const root = makeRoot(
			[v("color.bg", "#ffffff")],
			[theme("dark", [v("color.bg", "#000000")])],
		);
		const { resolver } = buildDTCG(root);
		expect(resolver).toBeDefined();
		// Default context exists with no overrides — base `set` already supplies it.
		expect(resolver?.modifiers?.theme?.contexts.Default).toEqual([]);
		expect(resolver?.modifiers?.theme?.default).toBe("Default");
		// Themed context name is capitalized.
		expect(resolver?.modifiers?.theme?.contexts.Dark).toBeDefined();
		const darkCtx = resolver?.modifiers?.theme?.contexts
			.Dark?.[0] as unknown as Record<string, any>;
		const darkBg = (darkCtx.color as unknown as Record<string, any>)
			.bg as Record<string, unknown>;
		expect(darkBg.$value).toMatchObject({ colorSpace: "srgb" });
		// resolutionOrder begins with a `set` referencing the base tokens file
		// so the resolver merges deltas on top of the full token document.
		expect(resolver?.resolutionOrder[0]).toEqual({
			type: "set",
			sources: [{ $ref: "tokens.json" }],
		});
		expect(resolver?.resolutionOrder[1]).toEqual({
			$ref: "#/modifiers/theme",
		});
	});

	it("emits $type on override tokens so resolver merge preserves typing", () => {
		const root = makeRoot(
			[
				v("color.primary", "#ff0000"),
				v("color.alt", "#00ff00"),
				v("color.bg", "#ffffff"),
				v("color.accent", ref("color.primary")),
			],
			[
				theme("dark", [
					v("color.bg", "#000000"),
					// Alias override that points at a different target than default,
					// so the value differs and the override survives the dedup filter.
					v("color.accent", ref("color.alt")),
				]),
			],
		);
		const { resolver } = buildDTCG(root);
		const darkCtx = resolver?.modifiers?.theme?.contexts
			.Dark?.[0] as unknown as Record<string, any>;
		// Direct value override carries `$type`.
		expect(darkCtx.color.bg.$type).toBe("color");
		// Alias override stamps `$type` from the alias target.
		expect(darkCtx.color.accent.$type).toBe("color");
		expect(darkCtx.color.accent.$value).toBe("{color.alt}");
	});

	it("respects tokensSourceRef for the base set $ref", () => {
		const root = makeRoot(
			[v("color.bg", "#ffffff")],
			[theme("dark", [v("color.bg", "#000000")])],
		);
		const { resolver } = buildDTCG(root, {
			tokensSourceRef: "design-tokens.json",
		});
		expect(resolver?.resolutionOrder[0]).toEqual({
			type: "set",
			sources: [{ $ref: "design-tokens.json" }],
		});
	});

	it("omits theme overrides identical to the default", () => {
		const root = makeRoot(
			[v("color.bg", "#ffffff")],
			[theme("dark", [v("color.bg", "#ffffff")])],
		);
		const { resolver } = buildDTCG(root);
		// Identical override → context drops out → resolver omitted entirely.
		expect(resolver).toBeUndefined();
	});

	it("respects the collection name option", () => {
		const root = makeRoot([v("color.x", "#000")]);
		const { tokens } = buildDTCG(root, { collectionName: "Storybook Tokens" });
		const ext = (
			tokens.$extensions as unknown as Record<string, Record<string, any>>
		)["dev.styleframe"];
		expect(ext?.collection).toBe("Storybook Tokens");
	});

	it("emits the schema by default and omits it when includeSchema is false", () => {
		const root = makeRoot([v("color.x", "#000")]);
		expect(buildDTCG(root).tokens.$schema).toBe(
			"https://design-tokens.org/schemas/2025.10/tokens.json",
		);
		expect(
			buildDTCG(root, { includeSchema: false }).tokens.$schema,
		).toBeUndefined();
	});

	it("uses $root when a parent token coexists with children (parent first)", () => {
		const root = makeRoot([
			v("border-width", ref("border-width.thin")),
			v("border-width.thin", "1px"),
			v("border-width.thick", "4px"),
		]);
		const { tokens } = buildDTCG(root);
		const bw = tokens["border-width"] as unknown as Record<string, any>;
		expect(bw.$root).toBeDefined();
		expect(bw.$root.$value).toBe("{border-width.thin}");
		expect(bw.thin).toBeDefined();
		expect(bw.thin.$value).toEqual({ value: 1, unit: "px" });
		expect(bw.thick).toBeDefined();
	});

	it("uses $root when children are emitted before the parent", () => {
		const root = makeRoot([
			v("border-width.thin", "1px"),
			v("border-width.thick", "4px"),
			v("border-width", ref("border-width.thin")),
		]);
		const { tokens } = buildDTCG(root);
		const bw = tokens["border-width"] as unknown as Record<string, any>;
		expect(bw.$root).toBeDefined();
		expect(bw.$root.$value).toBe("{border-width.thin}");
		expect(bw.thin?.$value).toEqual({ value: 1, unit: "px" });
		expect(bw.thick?.$value).toEqual({ value: 4, unit: "px" });
	});

	it("does not lose CSS-keyword-valued children whose parent classifier returns undefined", () => {
		const root = makeRoot([
			v("border-width", ref("border-width.thin")),
			v("border-width.thin", "thin"),
			v("border-width.medium", "medium"),
		]);
		const { tokens } = buildDTCG(root);
		const bw = tokens["border-width"] as unknown as Record<string, any>;
		expect(bw.thin).toBeDefined();
		expect(bw.thin.$value).toBe("thin");
		expect(bw.medium).toBeDefined();
		expect(bw.thin.$type).toBeUndefined();
	});

	it("normalises fluid font-size tokens to {value, unit} dimensions at the max bound", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s); // fluid.min-width=320, fluid.max-width=1440
		useFontSizeDesignTokens(s, { md: [16, 18] });

		const { tokens, fluidNormalisedCount, maxViewport } = buildDTCG(
			s.root as Root,
		);
		const fontSize = tokens["font-size"] as unknown as Record<string, any>;
		const md = fontSize.md as Record<string, any>;

		expect(md.$type).toBe("dimension");
		expect(md.$value).toEqual({ value: 18, unit: "px" });
		expect(md.$extensions["dev.styleframe"].fluidBound).toBe("max");
		expect(fluidNormalisedCount).toBeGreaterThanOrEqual(1);
		expect(maxViewport).toBe(1440);
	});

	it("uses a project-overridden fluid.max-width for the substitution viewport", () => {
		const s = styleframe();
		useFluidViewportDesignTokens(s, { minWidth: 320, maxWidth: 1920 });
		useFontSizeDesignTokens(s, { md: [16, 24] });

		const { tokens, maxViewport } = buildDTCG(s.root as Root);
		const md = (tokens["font-size"] as unknown as Record<string, any>)
			.md as Record<string, any>;

		expect(maxViewport).toBe(1920);
		// At the locked max viewport (1920px), the formula reduces to max=24.
		expect(md.$value).toEqual({ value: 24, unit: "px" });
	});

	it("emits theme overrides under $root when the base token was promoted to $root", () => {
		const root = makeRoot(
			[
				v("color.gray-200", "#e5e7eb"),
				v("color.gray-700", "#374151"),
				v("border-color", ref("color.gray-200")),
				v("border-color.primary", ref("color.primary")),
				v("color.primary", "#007a99"),
			],
			[theme("dark", [v("border-color", ref("color.gray-700"))])],
		);
		const { resolver } = buildDTCG(root);
		expect(resolver).toBeDefined();
		const darkContext = resolver!.modifiers!["theme"]!.contexts[
			"Dark"
		] as unknown as Array<Record<string, unknown>>;
		expect(darkContext).toHaveLength(1);
		const overrideDoc = darkContext[0] as Record<string, unknown>;
		const bc = overrideDoc["border-color"] as Record<string, unknown>;
		expect(bc.$root).toBeDefined();
		expect((bc.$root as Record<string, unknown>).$value).toBe(
			"{color.gray-700}",
		);
		expect(bc.$value).toBeUndefined();
	});
});
