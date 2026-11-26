import { describe, expect, it } from "vitest";
import { fromDTCG, fromDTCGResolver } from "./from-dtcg";
import type { DTCGDocument, DTCGResolverDocument } from "@styleframe/dtcg";

describe("fromDTCG (single-mode)", () => {
	it("converts a single sRGB color token", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: {
					$value: { colorSpace: "srgb", components: [0, 0.424, 1] },
				},
			},
		};
		const result = fromDTCG(doc);
		expect(result.collection).toBe("Design Tokens");
		expect(result.modes).toEqual(["Default"]);
		expect(result.variables).toHaveLength(1);
		expect(result.variables[0]?.name).toBe("color/primary");
		expect(result.variables[0]?.styleframeName).toBe("color.primary");
		expect(result.variables[0]?.type).toBe("COLOR");
		expect(result.variables[0]?.values["Default"]).toEqual({
			r: 0,
			g: 0.424,
			b: 1,
			a: 1,
		});
	});

	it("inherits $type from parent group", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				palette: {
					red: { $value: { colorSpace: "srgb", components: [1, 0, 0] } },
				},
			},
		};
		const result = fromDTCG(doc);
		expect(result.variables[0]?.type).toBe("COLOR");
	});

	it("converts dimension objects to FLOAT", () => {
		const doc: DTCGDocument = {
			spacing: {
				$type: "dimension",
				small: { $value: { value: 4, unit: "px" } },
				medium: { $value: { value: 1, unit: "rem" } },
			},
		};
		const result = fromDTCG(doc);
		expect(
			result.variables.find((v) => v.name === "spacing/small")?.values[
				"Default"
			],
		).toBe(4);
		expect(
			result.variables.find((v) => v.name === "spacing/medium")?.values[
				"Default"
			],
		).toBe(16);
	});

	it("converts aliases to VARIABLE_ALIAS shape", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: { $value: { colorSpace: "srgb", components: [0, 0, 0] } },
				accent: { $value: "{color.primary}" },
			},
		};
		const result = fromDTCG(doc);
		const accent = result.variables.find((v) => v.name === "color/accent");
		expect(accent?.aliasTo).toBe("color/primary");
		expect(accent?.values["Default"]).toEqual({
			type: "VARIABLE_ALIAS",
			id: "color/primary",
		});
	});

	it("handles nested groups", () => {
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				palette: {
					red: {
						light: {
							$value: { colorSpace: "srgb", components: [1, 0.8, 0.8] },
						},
						dark: { $value: { colorSpace: "srgb", components: [0.5, 0, 0] } },
					},
				},
			},
		};
		const result = fromDTCG(doc);
		expect(result.variables.map((v) => v.name).sort()).toEqual([
			"color/palette/red/dark",
			"color/palette/red/light",
		]);
	});

	it("preserves $description", () => {
		const doc: DTCGDocument = {
			color: {
				primary: {
					$type: "color",
					$description: "Brand primary",
					$value: { colorSpace: "srgb", components: [0, 0, 1] },
				},
			},
		};
		const result = fromDTCG(doc);
		expect(result.variables[0]?.description).toBe("Brand primary");
	});

	it("respects custom collection / mode names", () => {
		const doc: DTCGDocument = {
			color: {
				primary: {
					$type: "color",
					$value: { colorSpace: "srgb", components: [0, 0, 0] },
				},
			},
		};
		const result = fromDTCG(doc, {
			collectionName: "My Tokens",
			defaultModeName: "Light",
		});
		expect(result.collection).toBe("My Tokens");
		expect(result.modes).toEqual(["Light"]);
	});

	it("preserves viewport-relative dimension tokens as STRING fallbacks instead of dropping them", () => {
		// fluid.screen uses "vw" which has no Figma pixel equivalent.
		// Rather than dropping the token (which silently leaves Figma at 0)
		// we downgrade the variable type to STRING and keep the original CSS.
		const doc: DTCGDocument = {
			color: {
				$type: "color",
				primary: { $value: { colorSpace: "srgb", components: [0, 0, 1] } },
			},
			fluid: {
				screen: {
					$type: "dimension",
					$value: { value: 100, unit: "vw" },
				},
			},
		};
		expect(() => fromDTCG(doc)).not.toThrow();
		const result = fromDTCG(doc);
		const names = result.variables.map((v) => v.name);
		expect(names).toContain("color/primary");
		expect(names).toContain("fluid/screen");
		const fluid = result.variables.find((v) => v.name === "fluid/screen");
		expect(fluid?.type).toBe("STRING");
		expect(fluid?.values["Default"]).toBe("100vw");
	});

	it("preserves untyped (`unknownType`) tokens as STRING variables", () => {
		// Mirrors `border-radius.none` in apps/storybook/tokens.json: a token
		// whose styleframe value ("0") couldn't be classified.
		const doc: DTCGDocument = {
			"border-radius": {
				none: {
					$value: "0",
					$extensions: { "dev.styleframe": { unknownType: true } },
				},
			},
		} as unknown as DTCGDocument;
		const result = fromDTCG(doc);
		const none = result.variables.find((v) => v.name === "border-radius/none");
		expect(none?.type).toBe("STRING");
		expect(none?.values["Default"]).toBe("0");
	});

	it("round-trips spacing/border-radius/letter-spacing/duration tokens to non-zero FLOAT values", () => {
		// Excerpt mirroring apps/storybook/tokens.json — proves dimensions and
		// durations land as numeric Figma values (not 0).
		const doc: DTCGDocument = {
			spacing: {
				$type: "dimension",
				md: { $value: { value: 1, unit: "rem" } },
				lg: { $value: { value: 1.5, unit: "rem" } },
			},
			"border-radius": {
				$type: "dimension",
				md: { $value: { value: 0.25, unit: "rem" } },
				full: { $value: { value: 9999, unit: "px" } },
			},
			"letter-spacing": {
				$type: "dimension",
				wide: { $value: { value: 0.05, unit: "em" } },
			},
			duration: {
				$type: "duration",
				instant: { $value: { value: 0, unit: "ms" } },
				normal: { $value: { value: 250, unit: "ms" } },
				half: { $value: { value: 0.5, unit: "s" } },
			},
		};
		const result = fromDTCG(doc);

		const expectFloat = (name: string, expected: number) => {
			const v = result.variables.find((x) => x.name === name);
			expect(v, name).toBeDefined();
			expect(v?.type, name).toBe("FLOAT");
			expect(v?.values["Default"], name).toBe(expected);
		};

		expectFloat("spacing/md", 16);
		expectFloat("spacing/lg", 24);
		expectFloat("border-radius/md", 4);
		expectFloat("border-radius/full", 9999);
		expectFloat("letter-spacing/wide", 0.8);
		expectFloat("duration/instant", 0);
		expectFloat("duration/normal", 250);
		expectFloat("duration/half", 500);
	});

	it("imports $root tokens at the parent's path", () => {
		const doc: DTCGDocument = {
			"border-width": {
				$root: {
					$type: "dimension",
					$value: { value: 1, unit: "px" },
				},
				thin: {
					$type: "dimension",
					$value: { value: 1, unit: "px" },
				},
				thick: {
					$type: "dimension",
					$value: { value: 4, unit: "px" },
				},
			},
		} as unknown as DTCGDocument;
		const result = fromDTCG(doc);
		const names = result.variables.map((v) => v.name).sort();
		expect(names).toEqual([
			"border-width",
			"border-width/thick",
			"border-width/thin",
		]);
	});

	it("resolves aliases to $root targets without the $root suffix", () => {
		const doc: DTCGDocument = {
			spacing: {
				$root: {
					$type: "dimension",
					$value: "{spacing.md}",
				},
				md: {
					$type: "dimension",
					$value: { value: 16, unit: "px" },
				},
			},
			address: {
				"margin-bottom": {
					$type: "dimension",
					$value: "{spacing.$root}",
				},
			},
		} as unknown as DTCGDocument;
		const result = fromDTCG(doc);
		const margin = result.variables.find(
			(v) => v.name === "address/margin-bottom",
		);
		expect(margin?.aliasTo).toBe("spacing");
		expect(margin?.values["Default"]).toEqual({
			type: "VARIABLE_ALIAS",
			id: "spacing",
		});
	});

	it("restores BOOLEAN type from dev.styleframe.boolean extension", () => {
		const doc: DTCGDocument = {
			feature: {
				enabled: {
					$value: "true",
					$type: "string",
					$extensions: { "dev.styleframe": { boolean: true } },
				},
			},
		} as unknown as DTCGDocument;
		const result = fromDTCG(doc);
		const enabled = result.variables.find((v) => v.name === "feature/enabled");
		expect(enabled?.type).toBe("BOOLEAN");
		expect(enabled?.values["Default"]).toBe(true);
	});

	it("restores BOOLEAN false value from extension", () => {
		const doc: DTCGDocument = {
			feature: {
				disabled: {
					$value: "false",
					$type: "string",
					$extensions: { "dev.styleframe": { boolean: true } },
				},
			},
		} as unknown as DTCGDocument;
		const result = fromDTCG(doc);
		const disabled = result.variables.find(
			(v) => v.name === "feature/disabled",
		);
		expect(disabled?.type).toBe("BOOLEAN");
		expect(disabled?.values["Default"]).toBe(false);
	});
});

describe("fromDTCGResolver (multi-mode)", () => {
	const lightTokens = {
		color: {
			bg: {
				$type: "color",
				$value: { colorSpace: "srgb", components: [1, 1, 1] },
			},
		},
	};
	const darkTokens = {
		color: {
			bg: {
				$type: "color",
				$value: { colorSpace: "srgb", components: [0, 0, 0] },
			},
		},
	};

	const fileLoader = async (ref: string) => {
		switch (ref) {
			case "light.json":
				return lightTokens;
			case "dark.json":
				return darkTokens;
			default:
				throw new Error(`unknown ref ${ref}`);
		}
	};

	it("produces a Figma format with one mode per context", async () => {
		const resolver: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: {
				theme: {
					contexts: {
						light: [{ $ref: "light.json" }],
						dark: [{ $ref: "dark.json" }],
					},
					default: "light",
				},
			},
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};
		const result = await fromDTCGResolver(resolver, { fileLoader });
		expect(result.modes).toEqual(["light", "dark"]);
		const bg = result.variables.find((v) => v.name === "color/bg");
		expect(bg?.values["light"]).toEqual({ r: 1, g: 1, b: 1, a: 1 });
		expect(bg?.values["dark"]).toEqual({ r: 0, g: 0, b: 0, a: 1 });
	});

	it("preserves alias values for all modes, not just the default", async () => {
		const lightTokens = {
			color: {
				$type: "color" as const,
				border: { $value: "{base.gray-200}" },
			},
		};
		const darkTokens = {
			color: {
				$type: "color" as const,
				border: { $value: "{base.gray-700}" },
			},
		};

		const loader = async (ref: string) => {
			if (ref === "light.json") {
				return lightTokens;
			}
			if (ref === "dark.json") {
				return darkTokens;
			}
			throw new Error(`unknown ref ${ref}`);
		};

		const resolver: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: {
				theme: {
					contexts: {
						light: [{ $ref: "light.json" }],
						dark: [{ $ref: "dark.json" }],
					},
					default: "light",
				},
			},
			resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		};

		const result = await fromDTCGResolver(resolver, { fileLoader: loader });
		const border = result.variables.find((v) => v.name === "color/border");
		expect(border).toBeDefined();
		expect(border?.aliasTo).toBe("base/gray-200");
		expect(border?.values["light"]).toEqual({
			type: "VARIABLE_ALIAS",
			id: "base/gray-200",
		});
		expect(border?.values["dark"]).toEqual({
			type: "VARIABLE_ALIAS",
			id: "base/gray-700",
		});
	});

	it("produces concrete default and alias non-default when alias chain is only resolvable in default mode", async () => {
		const baseTokens = {
			color: {
				$type: "color" as const,
				primary: {
					$value: { colorSpace: "srgb", components: [0, 0.478, 0.6] },
				},
			},
			"border-color": {
				$type: "color" as const,
				primary: { $value: "{color.primary}" },
			},
		};
		const darkOverrides = {
			color: {
				$type: "color" as const,
				primary: { $value: "{shade.primary-800}" },
			},
		};

		const loader = async (ref: string) => {
			if (ref === "base.json") {
				return baseTokens;
			}
			throw new Error(`unknown ref ${ref}`);
		};

		const resolver: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: {
				theme: {
					contexts: {
						light: [],
						dark: [darkOverrides],
					},
					default: "light",
				},
			},
			resolutionOrder: [
				{ type: "set", sources: [{ $ref: "base.json" }] },
				{ $ref: "#/modifiers/theme" },
			],
		};

		const result = await fromDTCGResolver(resolver, { fileLoader: loader });
		const border = result.variables.find(
			(v) => v.name === "border-color/primary",
		);
		expect(border).toBeDefined();
		expect(border?.aliasTo).toBeUndefined();
		expect(border?.values["light"]).toEqual({
			r: 0,
			g: 0.478,
			b: 0.6,
			a: 1,
		});
		expect(border?.values["dark"]).toEqual({
			type: "VARIABLE_ALIAS",
			id: "shade/primary-800",
		});
	});

	it("throws when the named modifier doesn't exist", async () => {
		const resolver: DTCGResolverDocument = {
			version: "2025.10",
			modifiers: { other: { contexts: { x: [] } } },
			resolutionOrder: [{ $ref: "#/modifiers/other" }],
		};
		await expect(fromDTCGResolver(resolver, { fileLoader })).rejects.toThrow();
	});
});
