import type { DTCGDocument, DTCGResolverDocument } from "@styleframe/dtcg";
import { describe, expect, it } from "vitest";
import { flattenToFigmaDTCG } from "./flatten-to-figma-dtcg";

describe("flattenToFigmaDTCG (single-mode)", () => {
	it("flattens a color token to sRGB with hex", async () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: {
					$value: {
						colorSpace: "srgb",
						components: [0, 0.424, 1],
						alpha: 1,
					},
				},
			},
		};
		const { modes, diagnostics } = await flattenToFigmaDTCG(doc);
		expect(diagnostics).toHaveLength(0);
		const defaultDoc = modes.Default!;
		expect(defaultDoc.$extensions).toEqual({
			"com.figma.modeName": "Default",
		});
		const token = (defaultDoc.color as Record<string, unknown>)
			.primary as Record<string, unknown>;
		expect(token.$type).toBe("color");
		expect(token.$value).toMatchObject({
			colorSpace: "srgb",
			components: [0, 0.424, 1],
			alpha: 1,
		});
		expect((token.$value as Record<string, unknown>).hex).toBeDefined();
	});

	it("flattens a dimension token to a bare number", async () => {
		const doc: DTCGDocument = {
			spacing: {
				$type: "dimension",
				md: { $value: { value: 16, unit: "px" } },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.spacing as Record<string, unknown>)
			.md as Record<string, unknown>;
		expect(token.$type).toBe("number");
		expect(token.$value).toBe(16);
	});

	it("converts rem dimensions to px", async () => {
		const doc: DTCGDocument = {
			spacing: {
				$type: "dimension",
				lg: { $value: { value: 1.5, unit: "rem" } },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.spacing as Record<string, unknown>)
			.lg as Record<string, unknown>;
		expect(token.$type).toBe("number");
		expect(token.$value).toBe(24);
	});

	it("falls back to string for unsupported dimension units", async () => {
		const doc: DTCGDocument = {
			fluid: {
				$type: "dimension",
				width: { $value: { value: 100, unit: "vw" } },
			},
		};
		const { modes, diagnostics } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.fluid as Record<string, unknown>)
			.width as Record<string, unknown>;
		expect(token.$type).toBe("string");
		expect(token.$value).toBe("100vw");
		expect(diagnostics.length).toBeGreaterThan(0);
	});

	it("flattens a duration token to a bare ms number", async () => {
		const doc: DTCGDocument = {
			duration: {
				$type: "duration",
				fast: { $value: { value: 200, unit: "ms" } },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.duration as Record<string, unknown>)
			.fast as Record<string, unknown>;
		expect(token.$type).toBe("number");
		expect(token.$value).toBe(200);
	});

	it("converts seconds to ms for duration", async () => {
		const doc: DTCGDocument = {
			duration: {
				$type: "duration",
				slow: { $value: { value: 0.5, unit: "s" } },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.duration as Record<string, unknown>)
			.slow as Record<string, unknown>;
		expect(token.$type).toBe("number");
		expect(token.$value).toBe(500);
	});

	it("flattens cubicBezier to a stringified array", async () => {
		const doc: DTCGDocument = {
			easing: {
				$type: "cubicBezier",
				ease: { $value: [0.25, 0.1, 0.25, 1] },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.easing as Record<string, unknown>)
			.ease as Record<string, unknown>;
		expect(token.$type).toBe("string");
		expect(token.$value).toBe("[0.25,0.1,0.25,1]");
	});

	it("flattens fontFamily to string", async () => {
		const doc: DTCGDocument = {
			"font-family": {
				$type: "fontFamily",
				body: { $value: "Inter" },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!["font-family"] as Record<string, unknown>)
			.body as Record<string, unknown>;
		expect(token.$type).toBe("string");
		expect(token.$value).toBe("Inter");
	});

	it("flattens fontFamily array to comma-separated string", async () => {
		const doc: DTCGDocument = {
			"font-family": {
				$type: "fontFamily",
				body: { $value: ["Inter", "sans-serif"] },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!["font-family"] as Record<string, unknown>)
			.body as Record<string, unknown>;
		expect(token.$type).toBe("string");
		expect(token.$value).toBe("Inter, sans-serif");
	});

	it("flattens numeric fontWeight to number", async () => {
		const doc: DTCGDocument = {
			"font-weight": {
				$type: "fontWeight",
				bold: { $value: 700 },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!["font-weight"] as Record<string, unknown>)
			.bold as Record<string, unknown>;
		expect(token.$type).toBe("number");
		expect(token.$value).toBe(700);
	});

	it("flattens keyword fontWeight to string", async () => {
		const doc: DTCGDocument = {
			"font-weight": {
				$type: "fontWeight",
				normal: { $value: "normal" },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!["font-weight"] as Record<string, unknown>)
			.normal as Record<string, unknown>;
		expect(token.$type).toBe("string");
		expect(token.$value).toBe("normal");
	});

	it("flattens strokeStyle to string", async () => {
		const doc: DTCGDocument = {
			"border-style": {
				$type: "strokeStyle",
				solid: { $value: "solid" },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!["border-style"] as Record<string, unknown>)
			.solid as Record<string, unknown>;
		expect(token.$type).toBe("string");
		expect(token.$value).toBe("solid");
	});

	it("flattens number tokens as-is", async () => {
		const doc: DTCGDocument = {
			scale: {
				$type: "number",
				ratio: { $value: 1.25 },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.scale as Record<string, unknown>)
			.ratio as Record<string, unknown>;
		expect(token.$type).toBe("number");
		expect(token.$value).toBe(1.25);
	});

	it("preserves alias tokens with correct figma type", async () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: {
					$value: {
						colorSpace: "srgb",
						components: [0, 0.424, 1],
						alpha: 1,
					},
				},
				accent: { $value: "{color.primary}" },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.color as Record<string, unknown>)
			.accent as Record<string, unknown>;
		expect(token.$type).toBe("color");
		expect(token.$value).toBe("{color.primary}");
	});

	it("preserves alias to group with $root without rewriting", async () => {
		const doc: DTCGDocument = {
			"font-family": {
				$type: "fontFamily",
				$root: { $value: "Inter" },
				mono: { $value: "JetBrains Mono" },
			},
			body: {
				"font-family": { $type: "string", $value: "{font-family}" },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.body as Record<string, unknown>)[
			"font-family"
		] as Record<string, unknown>;
		expect(token.$value).toBe("{font-family}");
	});

	it("emits untyped tokens as string", async () => {
		const doc: DTCGDocument = {
			misc: {
				cursor: { $value: "pointer" },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const token = (modes.Default!.misc as Record<string, unknown>)
			.cursor as Record<string, unknown>;
		expect(token.$type).toBe("string");
		expect(token.$value).toBe("pointer");
	});

	it("handles $root tokens within groups", async () => {
		const doc: DTCGDocument = {
			spacing: {
				$type: "dimension",
				$root: { $value: { value: 16, unit: "px" } },
				sm: { $value: { value: 8, unit: "px" } },
			},
		};
		const { modes } = await flattenToFigmaDTCG(doc);
		const spacing = modes.Default!.spacing as Record<string, unknown>;
		const root = spacing.$root as Record<string, unknown>;
		expect(root.$type).toBe("number");
		expect(root.$value).toBe(16);
		const sm = spacing.sm as Record<string, unknown>;
		expect(sm.$type).toBe("number");
		expect(sm.$value).toBe(8);
	});

	it("aliases to keyword fontWeight get $type string, not number", async () => {
		const doc: DTCGDocument = {
			"font-weight": {
				$type: "fontWeight",
				$root: { $value: "{font-weight.normal}" },
				normal: { $value: "normal" },
				bold: { $value: 700 },
			},
		} as unknown as DTCGDocument;
		const { modes } = await flattenToFigmaDTCG(doc);
		const fw = modes.Default!["font-weight"] as Record<string, unknown>;
		const root = fw.$root as Record<string, unknown>;
		expect(root.$type).toBe("string");
		expect(root.$value).toBe("{font-weight.normal}");
		const bold = fw.bold as Record<string, unknown>;
		expect(bold.$type).toBe("number");
	});

	it("uses custom default mode name", async () => {
		const doc: DTCGDocument = {
			scale: { $type: "number", ratio: { $value: 1.25 } },
		};
		const { modes } = await flattenToFigmaDTCG(doc, undefined, {
			defaultModeName: "Light",
		});
		expect(modes.Light).toBeDefined();
		expect(modes.Light!.$extensions).toEqual({
			"com.figma.modeName": "Light",
		});
	});
});

describe("flattenToFigmaDTCG (multi-mode with resolver)", () => {
	it("produces one complete document per mode", async () => {
		const baseTokens: DTCGDocument = {
			color: {
				$type: "color",
				background: {
					$value: {
						colorSpace: "srgb",
						components: [1, 1, 1],
						alpha: 1,
					},
				},
			},
		};
		const darkOverrides: DTCGDocument = {
			color: {
				$type: "color",
				background: {
					$value: {
						colorSpace: "srgb",
						components: [0.1, 0.1, 0.1],
						alpha: 1,
					},
				},
			},
		};
		const resolver: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: {
				theme: {
					contexts: {
						light: [baseTokens],
						dark: [darkOverrides],
					},
					default: "light",
				},
			},
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};
		const { modes } = await flattenToFigmaDTCG(baseTokens, resolver);
		expect(Object.keys(modes)).toEqual(["Default", "Dark"]);
		const lightBg = (modes.Default!.color as Record<string, unknown>)
			.background as Record<string, unknown>;
		expect(lightBg.$type).toBe("color");
		expect(
			(
				(lightBg.$value as Record<string, unknown>).components as Array<number>
			)[0],
		).toBe(1);
		const darkBg = (modes.Dark!.color as Record<string, unknown>)
			.background as Record<string, unknown>;
		expect(
			(
				(darkBg.$value as Record<string, unknown>).components as Array<number>
			)[0],
		).toBeCloseTo(0.1, 1);
	});
});
