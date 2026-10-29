import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	defaultColorsMetaConfig,
	useDesignTokensPreset,
} from "./useDesignTokensPreset";

describe("useDesignTokensPreset", () => {
	describe("basic functionality", () => {
		it("should create all default design tokens when called with no config", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			// scale has a default key → produces 'scale' in flat result
			expect(result.scale).toBeDefined();
			expect(result.scalePowers).toBeDefined();
			// spacing has a default key → produces 'spacing' in flat result
			expect(result.spacing).toBeDefined();
			expect(result.borderColor).toBeDefined();
			expect(result.borderWidth).toBeDefined();
			expect(result.borderRadius).toBeDefined();
			expect(result.borderStyle).toBeDefined();
			expect(result.boxShadow).toBeDefined();
			expect(result.colorPrimary).toBeDefined();
			expect(result.fontFamily).toBeDefined();
			expect(result.fontSize).toBeDefined();
			expect(result.fontStyle).toBeDefined();
			expect(result.fontWeight).toBeDefined();
			expect(result.lineHeight).toBeDefined();
			expect(result.letterSpacing).toBeDefined();
			expect(result.breakpointSm).toBeDefined();
			expect(result.easingLinear).toBeDefined();
		});

		it("should create all default design tokens when called with empty config", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {});

			expect(result.scale).toBeDefined();
			expect(result.spacing).toBeDefined();
			expect(result.colorPrimary).toBeDefined();
			expect(result.fontFamily).toBeDefined();
		});

		it("should add variables to root", () => {
			const s = styleframe();
			useDesignTokensPreset(s);

			expect(s.root.variables.length).toBeGreaterThan(0);
		});

		it("should generate CSS output", () => {
			const s = styleframe();
			useDesignTokensPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(":root");
			expect(css).toContain("--spacing");
			expect(css).toContain("--color");
			expect(css).toContain("--font-size");
		});
	});

	describe("disabling domains", () => {
		it("should disable scale when scale is false", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fluidFontSize: false,
				scale: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--scale");
			expect((result as Record<string, unknown>).scalePowers).toBeUndefined();
		});

		it("should disable spacing when spacing is false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				spacing: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--spacing");
		});

		it("should disable border tokens when set to false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				borderColor: false,
				borderWidth: false,
				borderRadius: false,
				borderStyle: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--border-color");
			expect(css).not.toContain("--border-width");
			expect(css).not.toContain("--border-radius");
			expect(css).not.toContain("--border-style");
		});

		it("should disable boxShadow when boxShadow is false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				boxShadow: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--box-shadow");
		});

		it("should disable colors when colors is false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				colors: false,
				borderColor: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--color--primary");
		});

		it("should disable typography tokens when set to false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				fontFamily: false,
				fontSize: false,
				fontStyle: false,
				fontWeight: false,
				lineHeight: false,
				letterSpacing: false,
				fluidFontSize: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--font-family");
			expect(css).not.toContain("--font-size");
			expect(css).not.toContain("--font-style");
			expect(css).not.toContain("--font-weight");
			expect(css).not.toContain("--line-height");
			expect(css).not.toContain("--letter-spacing");
		});

		it("should disable breakpoint when breakpoint is false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				breakpoint: false,
			});

			const css = consumeCSS(s.root, s.options);
			// Static breakpoint vars are `--breakpoint--<key>`; the trailing `--`
			// distinguishes them from `--fluid--breakpoint` (which is enabled by default).
			expect(css).not.toContain("--breakpoint--");
		});

		it("should disable easing when easing is false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				easing: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--easing");
		});

		it("should disable all domains when all set to false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				scale: false,
				spacing: false,
				borderColor: false,
				borderWidth: false,
				borderRadius: false,
				borderStyle: false,
				boxShadow: false,
				zIndex: false,
				colors: false,
				fontFamily: false,
				fontSize: false,
				fontStyle: false,
				fontWeight: false,
				lineHeight: false,
				letterSpacing: false,
				breakpoint: false,
				easing: false,
				duration: false,
				fluidViewport: false,
				fluidFontSize: false,
			});

			expect(s.root.variables).toHaveLength(0);
		});
	});

	describe("custom values", () => {
		it("should use custom spacing values", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				spacing: {
					default: "1rem",
					sm: "0.5rem",
					lg: "2rem",
				},
			});

			expect(result.spacing).toBeDefined();
			expect(result.spacingSm).toBeDefined();
			expect(result.spacingLg).toBeDefined();
		});

		it("should use custom color values", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: {
					primary: "#ff6600",
					secondary: "#333333",
				},
				borderColor: false,
			});

			expect(result.colorPrimary).toBeDefined();
			expect(result.colorSecondary).toBeDefined();
		});

		it("should use custom borderRadius values", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				borderRadius: {
					default: "4px",
					sm: "2px",
					lg: "8px",
				},
			});

			expect(result.borderRadius).toBeDefined();
			expect(result.borderRadiusSm).toBeDefined();
			expect(result.borderRadiusLg).toBeDefined();
		});

		it("should use custom fontSize values", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fluidFontSize: false,
				fontSize: {
					default: "1rem",
					sm: "0.875rem",
					lg: "1.25rem",
				},
			});

			expect(result.fontSize).toBeDefined();
			expect(result.fontSizeSm).toBeDefined();
			expect(result.fontSizeLg).toBeDefined();
		});

		it("should use custom breakpoint values", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				breakpoint: {
					sm: 576,
					md: 768,
					lg: 1024,
				},
			});

			expect(result.breakpointSm).toBeDefined();
			expect(result.breakpointMd).toBeDefined();
			expect(result.breakpointLg).toBeDefined();
		});

		it("should use custom scale values", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fluidFontSize: false,
				scale: {
					default: "1.25",
				},
			});

			expect(result.scale).toBeDefined();
		});

		it("should use custom scalePowers", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				scalePowers: [-2, -1, 0, 1, 2],
			});

			expect(result.scalePowers).toBeDefined();
			expect(Object.keys(result.scalePowers)).toContain("-2");
			expect(Object.keys(result.scalePowers)).toContain("2");
		});

		it("should use custom easing values", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				easing: {
					default: "ease",
					linear: "linear",
				},
			});

			expect(result.easing).toBeDefined();
			expect(result.easingLinear).toBeDefined();
		});
	});

	describe("meta.merge: false (replace)", () => {
		it("should replace defaults entirely for spacing", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				meta: { merge: false },
				spacing: { sm: "0.5rem", lg: "2rem" },
			});

			const spacingKeys = Object.keys(result).filter((k) =>
				k.startsWith("spacing"),
			);
			// Only the keys present in the custom record exist
			expect(spacingKeys.sort()).toEqual(["spacingLg", "spacingSm"]);
		});

		it("should replace defaults entirely for colors", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				meta: { merge: false },
				colors: { brand: "#ff0000" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
			});

			expect(result.colorBrand).toBeDefined();
			// @ts-expect-error - colorPrimary doesn't exist when defaults are replaced
			result.colorPrimary;
		});

		it("should replace defaults entirely for borderRadius type-level", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				meta: { merge: false },
				borderRadius: { sm: "2px", xl: "16px" },
			});

			expect(result.borderRadiusSm).toBeDefined();
			expect(result.borderRadiusXl).toBeDefined();
			// @ts-expect-error - borderRadiusMd is not in custom config (replace mode)
			result.borderRadiusMd;
		});
	});

	describe("meta.colors configuration", () => {
		it("should generate color lightness variations by default", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
			});

			const colorKeys = Object.keys(result).filter((name) =>
				/colorPrimary\d+/.test(name),
			);
			expect(colorKeys.length).toBeGreaterThan(0);
		});

		it("should generate color shades by default", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
			});

			const shadeKeys = Object.keys(result).filter((name) =>
				/colorPrimaryShade/.test(name),
			);
			expect(shadeKeys.length).toBeGreaterThan(0);
		});

		it("should generate color tints by default", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
			});

			const tintKeys = Object.keys(result).filter((name) =>
				/colorPrimaryTint/.test(name),
			);
			expect(tintKeys.length).toBeGreaterThan(0);
		});

		it("should not generate lightness when generateLevels is false", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
					},
				},
			});

			const lightnessKeys = Object.keys(result).filter((name) =>
				/colorPrimary\d+/.test(name),
			);
			expect(lightnessKeys.length).toBe(0);
		});

		it("should not generate shades when generateShades is false", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateShades: false,
					},
				},
			});

			const shadeKeys = Object.keys(result).filter((name) =>
				/colorPrimaryShade/.test(name),
			);
			expect(shadeKeys.length).toBe(0);
		});

		it("should not generate tints when generateTints is false", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateTints: false,
					},
				},
			});

			const tintKeys = Object.keys(result).filter((name) =>
				/colorPrimaryTint/.test(name),
			);
			expect(tintKeys.length).toBe(0);
		});

		it("should use custom lightness levels", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: true,
						generateShades: false,
						generateTints: false,
						levels: { 100: 10, 500: 50, 900: 90 },
					},
				},
			});

			const resultKeys = Object.keys(result);
			expect(resultKeys).toContain("colorPrimary100");
			expect(resultKeys).toContain("colorPrimary500");
			expect(resultKeys).toContain("colorPrimary900");
		});

		it("should use custom shade levels", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: true,
						generateTints: false,
						shadeLevels: { "shade-50": 5, "shade-100": 10 },
					},
				},
			});

			const resultKeys = Object.keys(result);
			expect(resultKeys).toContain("colorPrimaryShade50");
			expect(resultKeys).toContain("colorPrimaryShade100");
		});

		it("should use custom tint levels", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: true,
						tintLevels: { "tint-50": 5, "tint-100": 10 },
					},
				},
			});

			const resultKeys = Object.keys(result);
			expect(resultKeys).toContain("colorPrimaryTint50");
			expect(resultKeys).toContain("colorPrimaryTint100");
		});

		it("should disable levels for a specific color via overrides", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff", secondary: "#333333" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateShades: false,
						generateTints: false,
						overrides: {
							secondary: { generateLevels: false },
						},
					},
				},
			});

			const primaryLevelKeys = Object.keys(result).filter((name) =>
				/colorPrimary\d+/.test(name),
			);
			const secondaryLevelKeys = Object.keys(result).filter((name) =>
				/colorSecondary\d+/.test(name),
			);
			expect(primaryLevelKeys.length).toBeGreaterThan(0);
			expect(secondaryLevelKeys.length).toBe(0);
		});

		it("should enable levels for a specific color when globally disabled via overrides", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff", secondary: "#333333" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
						overrides: {
							primary: { generateLevels: true },
						},
					},
				},
			});

			const primaryLevelKeys = Object.keys(result).filter((name) =>
				/colorPrimary\d+/.test(name),
			);
			const secondaryLevelKeys = Object.keys(result).filter((name) =>
				/colorSecondary\d+/.test(name),
			);
			expect(primaryLevelKeys.length).toBeGreaterThan(0);
			expect(secondaryLevelKeys.length).toBe(0);
		});

		it("should override shades and tints per color independently", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff", secondary: "#333333" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						overrides: {
							primary: { generateShades: false },
							secondary: { generateTints: false },
						},
					},
				},
			});

			const resultKeys = Object.keys(result);

			// Primary: shades disabled, tints enabled
			expect(resultKeys.some((k) => /colorPrimaryShade/.test(k))).toBe(false);
			expect(resultKeys.some((k) => /colorPrimaryTint/.test(k))).toBe(true);

			// Secondary: shades enabled, tints disabled
			expect(resultKeys.some((k) => /colorSecondaryShade/.test(k))).toBe(true);
			expect(resultKeys.some((k) => /colorSecondaryTint/.test(k))).toBe(false);
		});

		it("should disable all color variations", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			const variationKeys = Object.keys(result).filter((k) =>
				/^color[A-Z][a-zA-Z]*(?:\d+|Shade\d+|Tint\d+)$/.test(k),
			);
			expect(variationKeys).toEqual([]);
		});
	});

	describe("using defaults when domains are omitted", () => {
		it("should use defaults when domain is omitted", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				// All domains omitted - should use defaults
			});

			expect(result.spacing).toBeDefined();
			expect(result.colorPrimary).toBeDefined();
			expect(result.scale).toBeDefined();
		});
	});

	describe("defaultColorsMetaConfig", () => {
		it("should have correct default values", () => {
			expect(defaultColorsMetaConfig.generateLevels).toBe(true);
			expect(defaultColorsMetaConfig.generateShades).toBe(true);
			expect(defaultColorsMetaConfig.generateTints).toBe(true);
			expect(defaultColorsMetaConfig.levels).toBeDefined();
			expect(defaultColorsMetaConfig.shadeLevels).toBeDefined();
			expect(defaultColorsMetaConfig.tintLevels).toBeDefined();
		});
	});

	describe("integration", () => {
		it("should create a working design system with custom colors and spacing", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: {
					primary: "#006cff",
					secondary: "#6b7280",
				},
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				spacing: {
					default: "@spacing.md",
					sm: "0.5rem",
					md: "1rem",
					lg: "2rem",
				},
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			expect(result.colorPrimary).toBeDefined();
			expect(result.colorSecondary).toBeDefined();
			expect(result.spacingSm).toBeDefined();
			expect(result.spacingMd).toBeDefined();
			expect(result.spacingLg).toBeDefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--color--primary");
			expect(css).toContain("--color--secondary");
			expect(css).toContain("--spacing--sm");
			expect(css).toContain("--spacing--md");
			expect(css).toContain("--spacing--lg");
		});

		it("should allow using variables from preset in selectors", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				spacing: {
					default: "1rem",
					md: "1rem",
				},
				colors: {
					primary: "#006cff",
				},
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			s.selector(".button", {
				padding: s.ref(result.spacingMd),
				backgroundColor: s.ref(result.colorPrimary),
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("padding: var(--spacing--md)");
			expect(css).toContain("background-color: var(--color--primary)");
		});

		it("should work with minimal configuration", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				scale: false,
				borderColor: false,
				borderWidth: false,
				borderRadius: false,
				borderStyle: false,
				boxShadow: false,
				fontFamily: false,
				fontStyle: false,
				fontWeight: false,
				lineHeight: false,
				letterSpacing: false,
				breakpoint: false,
				easing: false,
				spacing: { default: "1rem" },
				colors: { primary: "#000" },
				fluidFontSize: false,
				fontSize: { default: "1rem" },
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			expect(result.spacing).toBeDefined();
			expect(result.colorPrimary).toBeDefined();
			expect(result.fontSize).toBeDefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--spacing");
			expect(css).toContain("--color--primary");
			expect(css).toContain("--font-size");
		});
	});

	describe("edge cases", () => {
		it("should handle multiple colors with variations", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: {
					primary: "#007bff",
					secondary: "#6c757d",
					success: "#28a745",
				},
				borderColor: false,
			});

			// Should have base colors
			expect(result.colorPrimary).toBeDefined();
			expect(result.colorSecondary).toBeDefined();
			expect(result.colorSuccess).toBeDefined();

			// Should have variations for each
			const resultKeys = Object.keys(result);
			expect(resultKeys.some((n) => n.startsWith("colorPrimary"))).toBe(true);
			expect(resultKeys.some((n) => n.startsWith("colorSecondary"))).toBe(true);
			expect(resultKeys.some((n) => n.startsWith("colorSuccess"))).toBe(true);
		});

		it("should handle empty custom values object under replace mode", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				meta: { merge: false },
				spacing: {},
			});

			// No spacing keys should exist since config was empty and merge is off
			const spacingKeys = Object.keys(result).filter((k) =>
				k.startsWith("spacing"),
			);
			expect(spacingKeys).toEqual([]);
		});

		it("should not create scalePowers when scale doesn't include scale variable", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				meta: { merge: false },
				fluidFontSize: false,
				scale: {
					base: "1.25",
				},
			});

			expect(result.scaleBase).toBeDefined();
			expect((result as Record<string, unknown>).scalePowers).toBeUndefined();
		});
	});

	describe("type checking", () => {
		it("should accept valid config types", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				spacing: { default: "1rem" },
				colors: { primary: "#000" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				borderRadius: { default: "4px" },
				// scale: omitted - uses defaults
				easing: false,
			});

			expect(result).toBeDefined();
		});
	});

	describe("type safety", () => {
		it("should merge custom spacing keys with defaults in return type", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				spacing: { sm: "0.5rem", md: "1rem" },
			});

			// Custom keys are inferred
			expect(result.spacingSm).toBeDefined();
			expect(result.spacingMd).toBeDefined();
			// Default keys are preserved under the merge default
			expect(result.spacingLg).toBeDefined();
			expect(result.spacing2xs).toBeDefined();
		});

		it("should type disabled domains correctly", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: false,
				borderColor: false,
				spacing: false,
			});

			// @ts-expect-error - colorPrimary doesn't exist when colors is disabled
			result.colorPrimary;

			// @ts-expect-error - spacingMd doesn't exist when spacing is disabled
			result.spacingMd;
		});

		it("should include default keys when domain is omitted", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			// All default keys should be present for all domains
			expect(result.spacing).toBeDefined();
			expect(result.spacingMd).toBeDefined();
			expect(result.borderRadius).toBeDefined();
			expect(result.borderRadiusMd).toBeDefined();
			expect(result.fontSize).toBeDefined();
			expect(result.fontSizeMd).toBeDefined();
		});

		it("should merge custom borderRadius keys with defaults", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				borderRadius: { none: "0", sm: "2px", xl: "16px" },
			});

			expect(result.borderRadiusNone).toBeDefined();
			expect(result.borderRadiusSm).toBeDefined();
			expect(result.borderRadiusXl).toBeDefined();
			// Default key preserved under the merge default
			expect(result.borderRadiusMd).toBeDefined();
		});

		it("should merge custom fontSize keys with defaults", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fluidFontSize: false,
				fontSize: { xs: "0.75rem", base: "1rem" },
			});

			expect(result.fontSizeXs).toBeDefined();
			expect(result.fontSizeBase).toBeDefined();
			// Default key preserved under the merge default
			expect(result.fontSizeLg).toBeDefined();
		});

		it("should merge custom breakpoint keys with defaults", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				breakpoint: { mobile: 480, tablet: 768, desktop: 1024 },
			});

			expect(result.breakpointMobile).toBeDefined();
			expect(result.breakpointTablet).toBeDefined();
			expect(result.breakpointDesktop).toBeDefined();
			// Default key preserved under the merge default
			expect(result.breakpointSm).toBeDefined();
		});

		it("should merge custom easing keys with defaults", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				easing: {
					linear: "linear",
					bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
				},
			});

			expect(result.easingLinear).toBeDefined();
			expect(result.easingBounce).toBeDefined();
			// Default key preserved under the merge default
			expect(result.easingEaseIn).toBeDefined();
		});

		it("should type scalePowers as undefined when scale is false", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fluidFontSize: false,
				scale: false,
			});

			// @ts-expect-error - scale doesn't exist when disabled
			result.scale;
			// @ts-expect-error - scalePowers doesn't exist when scale is disabled
			result.scalePowers;
		});

		it("should allow mixed disabled and custom domains", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				spacing: { sm: "0.5rem" },
				borderColor: false,
				borderRadius: false,
				colors: { brand: "#ff0000" },
				easing: false,
			});

			// Custom spacing key works
			expect(result.spacingSm).toBeDefined();
			// Default spacing keys are preserved under the merge default
			expect(result.spacingMd).toBeDefined();

			// borderRadius is disabled
			// @ts-expect-error - borderRadiusMd doesn't exist when disabled
			result.borderRadiusMd;

			// colors is strongly typed for base + custom colors
			expect(result.colorBrand).toBeDefined();
			// Default colors are merged in alongside the custom one
			expect(result.colorPrimary).toBeDefined();

			// easing is disabled
			// @ts-expect-error - easingLinear doesn't exist when disabled
			result.easingLinear;
		});

		it("should infer custom colors keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: {
					primary: "#007bff",
					secondary: "#6c757d",
					accent: "#ff6600",
				},
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			// Base colors are strongly typed
			expect(result.colorPrimary).toBeDefined();
			expect(result.colorSecondary).toBeDefined();
			expect(result.colorAccent).toBeDefined();

			// @ts-expect-error - colorBrand is not in custom config
			result.colorBrand;
		});

		it("should include default color keys when colors is omitted", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				// colors: omitted - uses defaults
			});

			// Default color keys should exist
			expect(result.colorPrimary).toBeDefined();
			expect(result.colorSecondary).toBeDefined();
			expect(result.colorSuccess).toBeDefined();
			expect(result.colorWarning).toBeDefined();
			expect(result.colorError).toBeDefined();
		});

		it("should allow access to color variations via type assertion", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
			});

			// Base colors are strongly typed
			expect(result.colorPrimary).toBeDefined();

			expect(result.colorPrimary100).toBeDefined();
			expect(result.colorPrimaryShade50).toBeDefined();
			expect(result.colorPrimaryTint50).toBeDefined();

			// @ts-expect-error 1500 is not a valid tint
			expect(result.colorPrimaryTint1500).not.toBeDefined();
		});

		it("should merge custom fontWeight keys with defaults", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fontWeight: { light: "300", regular: "400", bold: "700" },
			});

			expect(result.fontWeightLight).toBeDefined();
			expect(result.fontWeightRegular).toBeDefined();
			expect(result.fontWeightBold).toBeDefined();
			// Default key preserved under the merge default
			expect(result.fontWeightMedium).toBeDefined();
		});

		it("should merge custom lineHeight keys with defaults", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				lineHeight: { tight: "1.25", normal: "1.5", loose: "2" },
			});

			expect(result.lineHeightTight).toBeDefined();
			expect(result.lineHeightNormal).toBeDefined();
			expect(result.lineHeightLoose).toBeDefined();
			// Default key preserved under the merge default
			expect(result.lineHeightRelaxed).toBeDefined();
		});
	});

	describe("return value keys", () => {
		it("should return all default spacing keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.spacing;
			result.spacing2xs;
			result.spacingXs;
			result.spacingSm;
			result.spacingMd;
			result.spacingLg;
			result.spacingXl;
			result.spacing2xl;
			result.spacing3xl;

			// @ts-expect-error - spacingXxl is not a default key
			result.spacingXxl;
		});

		it("should return all default borderColor keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.borderColor;
			result.borderColorPrimary;

			// @ts-expect-error - borderColorOther is not a default key
			result.borderColorOther;
		});

		it("should return all default borderWidth keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.borderWidth;
			result.borderWidthNone;
			result.borderWidthThin;
			result.borderWidthMedium;
			result.borderWidthThick;

			// @ts-expect-error - borderWidthHeavy is not a default key
			result.borderWidthHeavy;
		});

		it("should return all default borderRadius keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.borderRadius;
			result.borderRadiusNone;
			result.borderRadiusSm;
			result.borderRadiusMd;
			result.borderRadiusLg;
			result.borderRadiusXl;
			result.borderRadius2xl;
			result.borderRadiusFull;

			// @ts-expect-error - borderRadius3xl is not a default key
			result.borderRadius3xl;
		});

		it("should return all default borderStyle keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.borderStyle;
			result.borderStyleNone;
			result.borderStyleSolid;
			result.borderStyleDashed;
			result.borderStyleDotted;
			result.borderStyleDouble;
			result.borderStyleGroove;
			result.borderStyleInset;
			result.borderStyleOutset;

			// @ts-expect-error - borderStyleRidge is not a default key
			result.borderStyleRidge;
		});

		it("should return all default boxShadow keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.boxShadow;
			result.boxShadowNone;
			result.boxShadowXs;
			result.boxShadowSm;
			result.boxShadowMd;
			result.boxShadowLg;
			result.boxShadowXl;
			result.boxShadow2xl;
			result.boxShadowInner;
			result.boxShadowRing;

			// @ts-expect-error - boxShadow3xl is not a default key
			result.boxShadow3xl;
		});

		it("should return all default fontFamily keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.fontFamily;
			result.fontFamilyBase;
			result.fontFamilyPrint;
			result.fontFamilyMono;

			// @ts-expect-error - fontFamilySans is not a default key
			result.fontFamilySans;
		});

		it("should return all default fontSize keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.fontSize;
			result.fontSize3xs;
			result.fontSize2xs;
			result.fontSizeXs;
			result.fontSizeSm;
			result.fontSizeMd;
			result.fontSizeLg;
			result.fontSizeXl;
			result.fontSize2xl;
			result.fontSize3xl;
			result.fontSize4xl;

			// @ts-expect-error - fontSize5xl is not a default key
			result.fontSize5xl;
		});

		it("should return all default fontStyle keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.fontStyle;
			result.fontStyleItalic;
			result.fontStyleOblique;
			result.fontStyleNormal;
			result.fontStyleInherit;

			// @ts-expect-error - fontStyleRevert is not a default key
			result.fontStyleRevert;
		});

		it("should return all default fontWeight keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.fontWeight;
			result.fontWeightExtralight;
			result.fontWeightLight;
			result.fontWeightNormal;
			result.fontWeightMedium;
			result.fontWeightSemibold;
			result.fontWeightBold;
			result.fontWeightBlack;
			result.fontWeightLighter;
			result.fontWeightBolder;
			result.fontWeightInherit;

			// @ts-expect-error - fontWeightThin is not a default key
			result.fontWeightThin;
		});

		it("should return all default lineHeight keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.lineHeight;
			result.lineHeightTight;
			result.lineHeightSnug;
			result.lineHeightNormal;
			result.lineHeightRelaxed;
			result.lineHeightLoose;

			// @ts-expect-error - lineHeightCompact is not a default key
			result.lineHeightCompact;
		});

		it("should return all default letterSpacing keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.letterSpacing;
			result.letterSpacingTighter;
			result.letterSpacingTight;
			result.letterSpacingNormal;
			result.letterSpacingWide;
			result.letterSpacingWider;

			// @ts-expect-error - letterSpacingWidest is not a default key
			result.letterSpacingWidest;
		});

		it("should return all default scale keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.scale;
			result.scaleMinorSecond;
			result.scaleMajorSecond;
			result.scaleMinorThird;
			result.scaleMajorThird;
			result.scalePerfectFourth;
			result.scaleAugmentedFourth;
			result.scalePerfectFifth;
			result.scaleGolden;

			// @ts-expect-error - scaleOctave is not a default key
			result.scaleOctave;
		});

		it("should return all default breakpoint keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.breakpointXs;
			result.breakpointSm;
			result.breakpointMd;
			result.breakpointLg;
			result.breakpointXl;
			result.breakpoint2xl;
		});

		it("should return all default easing keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.easingLinear;
			result.easingEase;
			result.easingEaseIn;
			result.easingEaseOut;
			result.easingEaseInOut;
			result.easingEaseInSine;
			result.easingEaseOutSine;
			result.easingEaseInOutSine;
			result.easingEaseInCubic;
			result.easingEaseOutCubic;
			result.easingEaseInOutCubic;
			result.easingSpring;
			result.easingBounce;

			// @ts-expect-error - easingSnap is not a default key
			result.easingSnap;
		});

		it("should return all default color keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			result.colorPrimary;
			result.colorSecondary;
			result.colorSuccess;
			result.colorWarning;
			result.colorError;
			result.colorInfo;
			// @ts-expect-error - colorBrand is not a default key
			result.colorBrand;
		});

		it("should return color lightness variation keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: true,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			result.colorPrimary;
			result.colorPrimary50;
			result.colorPrimary100;
			result.colorPrimary200;
			result.colorPrimary300;
			result.colorPrimary400;
			result.colorPrimary500;
			result.colorPrimary600;
			result.colorPrimary700;
			result.colorPrimary800;
			result.colorPrimary900;
			result.colorPrimary950;

			// @ts-expect-error - colorPrimary1000 is not a valid lightness level
			result.colorPrimary1000;
		});

		it("should return color shade variation keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: true,
						generateTints: false,
					},
				},
			});

			result.colorPrimary;
			result.colorPrimaryShade50;
			result.colorPrimaryShade100;
			result.colorPrimaryShade150;
			result.colorPrimaryShade200;

			// @ts-expect-error - colorPrimaryShade300 is not a valid shade level
			result.colorPrimaryShade300;
		});

		it("should return color tint variation keys", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: { dark: { colors: false, borderColor: false } },
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: true,
					},
				},
			});

			result.colorPrimary;
			result.colorPrimaryTint50;
			result.colorPrimaryTint100;
			result.colorPrimaryTint150;
			result.colorPrimaryTint200;

			// @ts-expect-error - colorPrimaryTint300 is not a valid tint level
			result.colorPrimaryTint300;
		});

		it("should return all variation keys for multiple colors", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { primary: "#007bff", error: "#ef4444" },
				borderColor: false,
			});

			// primary variations
			result.colorPrimary;
			result.colorPrimary500;
			result.colorPrimaryShade100;
			result.colorPrimaryTint100;

			// error variations
			result.colorError;
			result.colorError500;
			result.colorErrorShade100;
			result.colorErrorTint100;

			// Default colors are merged in alongside the custom overrides
			result.colorSuccess;
			result.colorSuccess500;
		});

		it("should return scalePowers when scale is enabled", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			expect(result.scalePowers).toBeDefined();
			expect(result.scalePowers[-2]).toBeDefined();
			expect(result.scalePowers[-1]).toBeDefined();
			expect(result.scalePowers[0]).toBeDefined();
			expect(result.scalePowers[1]).toBeDefined();
			expect(result.scalePowers[2]).toBeDefined();
			expect(result.scalePowers[3]).toBeDefined();
			expect(result.scalePowers[4]).toBeDefined();
			expect(result.scalePowers[5]).toBeDefined();
		});

		it("should type scalePowers as absent when scale is disabled", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fluidFontSize: false,
				scale: false,
			});

			expect((result as Record<string, unknown>).scalePowers).toBeUndefined();
		});

		it("should type colors as absent when colors is disabled", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: false,
				borderColor: false,
			});

			// @ts-expect-error - colorPrimary doesn't exist when colors is disabled
			result.colorPrimary;

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--color--primary");
		});
	});

	describe("focus color", () => {
		it("should emit color.focus as a reference to color.primary", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			expect(result.colorFocus.value).toEqual({
				type: "reference",
				name: "color.primary",
			});

			const css = consumeCSS(s.root, s.options);
			const [rootCss, darkCss] = css.split(
				'.dark-theme, [data-theme="dark"] {',
			);
			expect(rootCss).toContain("--color--focus: var(--color--primary);");
			expect(darkCss).toContain("--color--focus: var(--color--primary);");
		});

		it("should not generate levels, shades or tints for color.focus", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			expect(
				Object.keys(result).filter((k) => k.startsWith("colorFocus")),
			).toEqual(["colorFocus"]);
			expectTypeOf(result).not.toHaveProperty("colorFocus100");
			expectTypeOf(result).not.toHaveProperty("colorFocusShade50");
			expectTypeOf(result).not.toHaveProperty("colorFocusTint50");
			expectTypeOf(result).toHaveProperty("colorPrimary100");
		});
	});

	describe("themes", () => {
		it("should create a theme block with color overrides", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				colors: { primary: "#007bff", secondary: "#6c757d" },
				borderColor: false,
				themes: {
					dark: {
						colors: { primary: "#60a5fa", secondary: "#cbd5e1" },
					},
				},
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(":root");
			expect(css).toContain("--color--primary");
			expect(css).toContain('[data-theme="dark"]');

			expect(s.root.themes).toHaveLength(1);
			expect(s.root.themes[0]!.name).toBe("dark");
			expect(s.root.themes[0]!.variables.length).toBeGreaterThan(0);
		});

		it("should create a theme block with spacing overrides", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				spacing: { default: "1rem", sm: "0.5rem", lg: "2rem" },
				themes: {
					compact: {
						spacing: {
							default: "0.75rem",
							sm: "0.25rem",
							lg: "1.5rem",
						},
					},
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain('[data-theme="compact"]');
			expect(s.root.themes).toHaveLength(2);
			expect(s.root.themes.map((t) => t.name)).toContain("compact");
			expect(s.root.themes.map((t) => t.name)).toContain("dark");
		});

		it("should support multiple themes", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				colors: { primary: "#007bff" },
				borderColor: false,
				themes: {
					dark: {
						colors: { primary: "#60a5fa" },
					},
					high_contrast: {
						colors: { primary: "#0000ff" },
					},
				},
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			expect(s.root.themes).toHaveLength(2);
			expect(s.root.themes.map((t) => t.name)).toContain("dark");
			expect(s.root.themes.map((t) => t.name)).toContain("high_contrast");

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain('[data-theme="dark"]');
			expect(css).toContain('[data-theme="high_contrast"]');
		});

		it("should use themes.default to fill in undefined root-level config", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				borderColor: false,
				themes: {
					default: {
						colors: { primary: "#ff6600", secondary: "#333" },
						spacing: {
							default: "0.5rem",
							sm: "0.25rem",
						},
					},
					dark: { colors: false, borderColor: false },
				},
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			// Colors and spacing should have been created at root level
			expect(result.colorPrimary).toBeDefined();
			expect(result.spacing).toBeDefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--color--primary");
			expect(css).toContain("--spacing--sm");
			// themes.default should NOT create a [data-theme="default"] block
			expect(css).not.toContain('[data-theme="default"]');
		});

		it("should give root-level config precedence over themes.default", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: { brand: "#ff0000" },
				borderColor: false,
				themes: {
					default: {
						colors: { primary: "#007bff" },
					},
					dark: { colors: false, borderColor: false },
				},
				meta: {
					// Disable merge so themes.default cannot fill in via defaults either
					merge: false,
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			// Root-level colors should win (brand, not primary)
			const colorKeys = Object.keys(result).filter((k) =>
				k.startsWith("color"),
			);
			expect(colorKeys).toContain("colorBrand");
			expect(colorKeys).not.toContain("colorPrimary");
		});

		it("should create domain-level default themes when themes is empty", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				themes: {},
			});

			expect(s.root.themes).toHaveLength(1);
			expect(s.root.themes[0]!.name).toBe("dark");
		});

		it("should create domain-level default themes when themes only has default", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				borderColor: false,
				themes: {
					default: {
						colors: { primary: "#007bff" },
					},
					dark: { colors: false, borderColor: false },
				},
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			// Dark theme still exists (from domain-level defaults for other domains)
			expect(s.root.themes).toHaveLength(1);
			expect(s.root.themes[0]!.name).toBe("dark");
		});

		it("should work with themes.default and additional themes together", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				borderColor: false,
				themes: {
					default: {
						colors: {
							primary: "#ff6600",
							secondary: "#333",
							accent: "#00bcd4",
						},
						spacing: {
							default: "0.5rem",
							sm: "0.25rem",
							md: "0.5rem",
							lg: "1rem",
						},
					},
					dark: {
						colors: {
							primary: "#ff6600",
							secondary: "#fff",
							accent: "#00bcd4",
						},
					},
				},
				meta: {
					colors: {
						generateLevels: false,
						generateShades: false,
						generateTints: false,
					},
				},
			});

			// Root should have colors and spacing
			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--color--primary");
			expect(css).toContain("--spacing--sm");

			// Dark theme should exist
			expect(s.root.themes).toHaveLength(1);
			expect(s.root.themes[0]!.name).toBe("dark");
			expect(css).toContain('[data-theme="dark"]');
		});

		it("should support reference color values that point to shade/tint variants", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: {
					primary: "#ff0000",
					"primary.hover": "@color.primary-shade-50",
					"primary.focus": "@color.primary-shade-100",
				},
				borderColor: false,
			});

			// Base color should exist
			expect(result.colorPrimary).toBeDefined();

			// State color variables should exist
			expect(result.colorPrimaryHover).toBeDefined();
			expect(result.colorPrimaryFocus).toBeDefined();

			// State colors should be references to shade variants
			expect(result.colorPrimaryHover.value).toEqual({
				type: "reference",
				name: "color.primary-shade-50",
			});
			expect(result.colorPrimaryFocus.value).toEqual({
				type: "reference",
				name: "color.primary-shade-100",
			});

			// CSS should contain the reference variables
			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(
				"--color--primary--hover: var(--color--primary-shade-50)",
			);
			expect(css).toContain(
				"--color--primary--focus: var(--color--primary-shade-100)",
			);
		});

		it("should support dark theme overrides for reference color values", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				colors: {
					primary: "#ff0000",
					"primary.hover": "@color.primary-shade-50",
					"primary.focus": "@color.primary-shade-100",
				},
				borderColor: false,
				themes: {
					dark: {
						colors: {
							primary: "#ff6666",
							"primary.hover": "@color.primary-tint-50",
							"primary.focus": "@color.primary-tint-100",
						},
						borderColor: false,
					},
				},
				meta: {
					colors: {
						generateLevels: false,
					},
				},
			});

			const css = consumeCSS(s.root, s.options);

			// Root should have shade references
			expect(css).toContain(
				"--color--primary--hover: var(--color--primary-shade-50)",
			);
			expect(css).toContain(
				"--color--primary--focus: var(--color--primary-shade-100)",
			);

			// Dark theme should have tint references
			expect(css).toContain('[data-theme="dark"]');
			expect(css).toContain(
				"--color--primary--hover: var(--color--primary-tint-50)",
			);
			expect(css).toContain(
				"--color--primary--focus: var(--color--primary-tint-100)",
			);
		});

		it("should support reference colors alongside multiple base colors", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				colors: {
					primary: "#ff0000",
					secondary: "#00ff00",
					"primary.hover": "@color.primary-shade-50",
					"secondary.hover": "@color.secondary-tint-50",
				},
				borderColor: false,
			});

			expect(result.colorPrimaryHover.value).toEqual({
				type: "reference",
				name: "color.primary-shade-50",
			});
			expect(result.colorSecondaryHover.value).toEqual({
				type: "reference",
				name: "color.secondary-tint-50",
			});
		});

		it("should not apply theme overrides for domains disabled at root level", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				colors: false,
				borderColor: false,
				themes: {
					dark: {
						colors: { primary: "#60a5fa" },
					},
				},
			});

			// Colors are disabled at root level
			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--color--primary");

			// The dark theme still exists but only has color overrides
			expect(s.root.themes).toHaveLength(1);
		});
	});

	describe("fluid font size", () => {
		it("should create fluid viewport and fluid font-size variables by default", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s);

			// Fluid handles surfaced on the result
			expect(result.fluidBreakpoint).toBeDefined();
			expect(result.fluidMinWidth).toBeDefined();
			expect(result.fluidMaxWidth).toBeDefined();
			expect(result.scaleMin).toBeDefined();
			expect(result.scaleMax).toBeDefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--fluid--min-width:");
			expect(css).toContain("--fluid--max-width:");
			expect(css).toContain("--fluid--breakpoint:");
			// Fluid mode emits the configurable pixel base as CSS variables,
			// and the per-key calc() expressions reference those vars.
			expect(css).toContain("--font-size--min: 16;");
			expect(css).toContain("--font-size--max: 18;");
			expect(css).not.toContain("--font-size--md: 1rem");
			expect(consumeCSS(result.fontSizeMd, s.options)).toEqual(
				"--font-size--md: calc((var(--font-size--min) * var(--scale--min-powers--0) / 16 * 1rem) + (var(--font-size--max) * var(--scale--max-powers--0) - var(--font-size--min) * var(--scale--min-powers--0)) * var(--fluid--breakpoint));",
			);
		});

		it("should throw when fluidViewport is false but fluidFontSize is enabled (default)", () => {
			const s = styleframe();
			expect(() =>
				useDesignTokensPreset(s, { fluidViewport: false }),
			).toThrowError(/font-size.*fluid mode requires.*fluidViewport/);
		});

		it("should opt out cleanly when both fluidFontSize and fluidViewport are false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				fluidViewport: false,
				fluidFontSize: false,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--fluid--breakpoint");
			expect(css).not.toContain("--fluid--min-width");
			expect(css).not.toContain("--fluid--max-width");
			expect(css).not.toContain("--font-size--min");
			expect(css).not.toContain("--font-size--max");
			// Static font-size runs because fluid is explicitly disabled
			expect(css).toContain("--font-size--md: 1rem");
		});

		it("should still enable fluid font size when fluidFontSize is true (explicit opt-in)", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, { fluidFontSize: true });

			expect(result.fontSize).toBeDefined();
			expect(result.fontSizeMd).toBeDefined();
			expect(result.fluidBreakpoint).toBeDefined();
			expect(result.fluidMinWidth).toBeDefined();
			expect(result.fluidMaxWidth).toBeDefined();
			expect(result.scaleMin).toBeDefined();
			expect(result.scaleMax).toBeDefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--fluid--min-width: 320");
			expect(css).toContain("--fluid--max-width: 1440");
			expect(css).toContain("--fluid--breakpoint:");
			// font-size.min/max are emitted as configurable CSS variables and
			// referenced by every fluid font-size calc() expression
			expect(css).toContain("--font-size--min: 16;");
			expect(css).toContain("--font-size--max: 18;");
			expect(consumeCSS(result.fontSizeMd, s.options)).toEqual(
				"--font-size--md: calc((var(--font-size--min) * var(--scale--min-powers--0) / 16 * 1rem) + (var(--font-size--max) * var(--scale--max-powers--0) - var(--font-size--min) * var(--scale--min-powers--0)) * var(--fluid--breakpoint));",
			);
			// scale.min/max default to references into the static scale set
			expect(css).toContain("--scale--min: var(--scale--major-second);");
			expect(css).toContain("--scale--max: var(--scale--major-third);");
			// Power vars are materialized for both scales
			expect(css).toContain("--scale--min-powers--1:");
			expect(css).toContain("--scale--max-powers--1:");
			// Default fluid font sizes reference the scale-power vars
			expect(css).toContain("var(--scale--min-powers--1)");
			expect(css).toContain("var(--scale--max-powers--1)");
		});

		it("should honor a custom fluidScale config", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				fluidScale: { min: 1.067, max: 1.333 },
				fluidFontSize: true,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--scale--min: 1.067");
			expect(css).toContain("--scale--max: 1.333");
		});

		it("should let user fontSize config win over fluid defaults (mixed static + fluid)", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fontSize: { sm: "0.875rem", md: "1rem" },
			});

			// User's static fontSize values take precedence over fluid defaults
			expect(consumeCSS(result.fontSizeMd, s.options)).toEqual(
				"--font-size--md: 1rem;",
			);
			expect(consumeCSS(result.fontSizeSm, s.options)).toEqual(
				"--font-size--sm: 0.875rem;",
			);
		});

		it("should let user override the fluid font-size base via fontSize.min/max", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				fontSize: { min: 14, max: 20 },
				meta: { merge: true },
			});

			const css = consumeCSS(s.root, s.options);
			// The pixel base is now a configurable CSS variable. Users can
			// retarget the fluid scale by overriding these in their own stylesheet
			// (the scale calc()s reference them via var()).
			expect(css).toContain("--font-size--min: 14;");
			expect(css).toContain("--font-size--max: 20;");
		});

		it("should honor absolute pixel ranges passed via fontSize", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fontSize: {
					sm: [12, 14],
					md: [14, 16],
					lg: [18, 24],
					default: "@font-size.md",
				},
			});

			expect(result.fontSizeSm).toBeDefined();
			expect(result.fontSizeMd).toBeDefined();
			expect(result.fontSizeLg).toBeDefined();

			// Absolute pixel ranges generate calc() expressions per key
			expect(consumeCSS(result.fontSizeSm, s.options)).toEqual(
				"--font-size--sm: calc((12 / 16 * 1rem) + (14 - 12) * var(--fluid--breakpoint));",
			);
			expect(consumeCSS(result.fontSizeMd, s.options)).toEqual(
				"--font-size--md: calc((14 / 16 * 1rem) + (16 - 14) * var(--fluid--breakpoint));",
			);
			expect(consumeCSS(result.fontSizeLg, s.options)).toEqual(
				"--font-size--lg: calc((18 / 16 * 1rem) + (24 - 18) * var(--fluid--breakpoint));",
			);
		});

		it("should honor a custom fluidViewport range", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				fluidViewport: { minWidth: 375, maxWidth: 1920 },
				fluidFontSize: true,
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--fluid--min-width: 375");
			expect(css).toContain("--fluid--max-width: 1920");
		});

		it("should keep fluid viewport while opting out of fluid font size", () => {
			const s = styleframe();
			const result = useDesignTokensPreset(s, {
				fluidViewport: true,
				fluidFontSize: false,
			});

			expect(result.fluidBreakpoint).toBeDefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--fluid--breakpoint:");
			// Static font-size runs because fluid is explicitly disabled
			expect(css).toContain("--font-size--md: 1rem");
			expect(css).not.toContain("--font-size--min");
		});

		it("should throw when fluidViewport is false and fluidFontSize is explicitly true", () => {
			const s = styleframe();
			expect(() =>
				useDesignTokensPreset(s, {
					fluidViewport: false,
					fluidFontSize: true,
				}),
			).toThrowError(/font-size.*fluid mode requires.*fluidViewport/);
		});

		it("should throw when scale is false but fluidFontSize is enabled (default)", () => {
			const s = styleframe();
			expect(() => useDesignTokensPreset(s, { scale: false })).toThrowError(
				/fluid-scale.*requires.*scale/,
			);
		});

		it("should not auto-disable static font-size when fluidFontSize is false", () => {
			const s = styleframe();
			useDesignTokensPreset(s, {
				fluidFontSize: false,
				fontSize: { md: "1rem" },
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--font-size--md: 1rem");
		});
	});
});
