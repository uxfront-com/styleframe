import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { createUseUtility } from "./createUseUtility";

describe("createUseUtility", () => {
	it("should create a composable for margin utility", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		useMargin(s, { sm: "8px" });

		const utility = s.root.children.find((u): u is Utility => isUtility(u) && u.name === "margin");
		expect(utility).toBeDefined();
		expect(utility?.declarations).toEqual({ margin: "8px" });
	});

	it("should create a composable for padding utility", () => {
		const usePadding = createUseUtility("padding", ({ value }) => ({
			padding: value,
		}));
		const s = styleframe();
		usePadding(s, { md: "16px" });

		const utility = s.root.children.find((u): u is Utility => isUtility(u) && u.name === "padding");
		expect(utility).toBeDefined();
		expect(utility?.declarations).toEqual({ padding: "16px" });
	});

	it("should create a composable for custom utility", () => {
		const useCustom = createUseUtility("custom-prop", ({ value }) => ({
			customProperty: value,
		}));
		const s = styleframe();
		useCustom(s, { value: "test" });

		const utility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "custom-prop",
		);
		expect(utility).toBeDefined();
		expect(utility?.declarations).toEqual({ customProperty: "test" });
	});

	it("should create utility instances with string values", () => {
		const useWidth = createUseUtility("width", ({ value }) => ({
			width: value,
		}));
		const s = styleframe();
		useWidth(s, { full: "100%", half: "50%" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "width",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should create utility instances with boolean values", () => {
		const useHidden = createUseUtility("hidden", ({ value }) => ({
			display: value === true ? "none" : "block",
		}));
		const s = styleframe();
		useHidden(s, { default: true });

		const utility = s.root.children.find((u): u is Utility => isUtility(u) && u.name === "hidden");
		expect(utility).toBeDefined();
		expect(utility?.declarations).toEqual({ display: "none" });
	});

	it("should create utility instances with reference values", () => {
		const useBackground = createUseUtility("bg", ({ value }) => ({
			backgroundColor: value,
		}));
		const s = styleframe();
		const colorPrimary = s.variable("color.primary", "#3b82f6");
		useBackground(s, { primary: s.ref(colorPrimary) });

		const utility = s.root.children.find((u): u is Utility => isUtility(u) && u.name === "bg");
		expect(utility?.declarations?.backgroundColor).toEqual({
			type: "reference",
			name: "color.primary",
		});
	});

	it("should create multiple utility instances", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		useMargin(s, { xs: "4px", sm: "8px", md: "16px", lg: "24px" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "margin",
		);
		expect(utilities).toHaveLength(4);
	});

	it("should add utility instances to root.children", () => {
		const usePadding = createUseUtility("padding", ({ value }) => ({
			padding: value,
		}));
		const s = styleframe();
		usePadding(s, { sm: "8px", md: "16px" });

		expect(s.root.children).toHaveLength(2);
		expect(s.root.children[0]?.type).toBe("utility");
		expect(s.root.children[1]?.type).toBe("utility");
	});

	it("should register utility factory in root.utilities", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		useMargin(s, { sm: "8px" });

		expect(s.root.utilities).toHaveLength(1);
		expect(s.root.utilities[0]?.name).toBe("margin");
	});

	it("should store values in factory instance", () => {
		const useGap = createUseUtility("gap", ({ value }) => ({
			gap: value,
		}));
		const s = styleframe();
		useGap(s, { sm: "8px", md: "16px" });

		expect(s.root.utilities[0]?.values).toEqual([
			{ key: "sm", value: "8px", modifiers: [] },
			{ key: "md", value: "16px", modifiers: [] },
		]);
	});

	it("should handle kebab-case value names", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		useMargin(s, { "extra-large": "48px" });

		const utility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "margin" && u.value === "extra-large",
		);
		expect(utility).toBeDefined();
		expect(utility?.declarations).toEqual({ margin: "48px" });
	});

	it("should handle snake_case value names", () => {
		const usePadding = createUseUtility("padding", ({ value }) => ({
			padding: value,
		}));
		const s = styleframe();
		usePadding(s, { card_padding: "24px" });

		const utility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "padding" && u.value === "card_padding",
		);
		expect(utility).toBeDefined();
		expect(utility?.declarations).toEqual({ padding: "24px" });
	});

	it("should handle numeric value names", () => {
		const useZIndex = createUseUtility("z", ({ value }) => ({
			zIndex: value,
		}));
		const s = styleframe();
		useZIndex(s, { "10": "10", "20": "20", "50": "50" });

		const utilities = s.root.children.filter((u): u is Utility => isUtility(u) && u.name === "z");
		expect(utilities).toHaveLength(3);
	});

	it("should handle 'default' key producing no value suffix", () => {
		const useDisplay = createUseUtility("display", ({ value }) => ({
			display: value,
		}));
		const s = styleframe();
		useDisplay(s, { default: "block" });

		const utility = s.root.children.find(
			(u): u is Utility => isUtility(u) && u.name === "display" && u.value === "default",
		);
		expect(utility).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._display {");
		expect(css).not.toContain(String.raw`._display\:default`);
	});

	it("should handle empty values object", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		useMargin(s, {});

		expect(s.root.children).toHaveLength(0);
	});

	it("should skip duplicate keys when creator is called multiple times", () => {
		const useColor = createUseUtility("text-color", ({ value }) => ({
			color: value,
		}));
		const s = styleframe();
		const createColor = useColor(s, { primary: "#3b82f6" });
		// Call the same creator again with duplicate key
		createColor({ primary: "#ef4444" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "text-color" && u.value === "primary",
		);
		expect(utilities).toHaveLength(1);
		expect(utilities[0]?.declarations?.color).toBe("#3b82f6");
	});

	it("should accumulate values when creator is called multiple times", () => {
		const useSpacing = createUseUtility("spacing", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		const createSpacing = useSpacing(s, { sm: "8px", md: "16px" });
		// Call the same creator again with new values
		createSpacing({ lg: "24px", xl: "32px" });

		expect(s.root.utilities[0]?.values).toHaveLength(4);
		expect(s.root.children).toHaveLength(4);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		useMargin(s, { sm: "8px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin\:sm {`);
		expect(css).toContain("margin: 8px;");
	});

	it("should generate proper selector format", () => {
		const usePadding = createUseUtility("padding", ({ value }) => ({
			padding: value,
		}));
		const s = styleframe();
		usePadding(s, { sm: "8px", md: "16px", lg: "24px" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._padding\:sm {`);
		expect(css).toContain(String.raw`._padding\:md {`);
		expect(css).toContain(String.raw`._padding\:lg {`);
	});

	it("should handle special characters in values", () => {
		const useSpacing = createUseUtility("p", ({ value }) => ({
			padding: value,
		}));
		const s = styleframe();
		useSpacing(s, { "1/2": "0.125rem", "2.5": "0.625rem" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._p\:1\/2 {`);
		expect(css).toContain(String.raw`._p\:2\.5 {`);
	});

	it("should apply single modifier to utilities", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		const hoverModifier = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));

		useMargin(s, { sm: "8px" }, [hoverModifier]);

		const hoverUtility = s.root.children.find(
			(u): u is Utility =>
				isUtility(u) && u.name === "margin" && u.value === "sm" && u.modifiers.includes("hover"),
		);
		expect(hoverUtility).toBeDefined();
	});

	it("should apply multiple modifiers to utilities as individual variants", () => {
		const usePadding = createUseUtility("padding", ({ value }) => ({
			padding: value,
		}));
		const s = styleframe();
		const hoverModifier = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		const focusModifier = s.modifier("focus", ({ declarations }) => ({
			"&:focus": declarations,
		}));

		// Flat array: each modifier creates an individual variant (no auto-combination)
		usePadding(s, { sm: "8px" }, [hoverModifier, focusModifier]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "padding",
		);
		// base + hover + focus = 3 (no auto-combination)
		expect(utilities).toHaveLength(3);
	});

	it("should combine modifiers via nested arrays", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		const hoverModifier = s.modifier("hover", ({ declarations }) => ({
			"&:hover": declarations,
		}));
		const focusModifier = s.modifier("focus", ({ declarations }) => ({
			"&:focus": declarations,
		}));

		// Nested array for combined modifier variant
		useMargin(s, { sm: "8px" }, [hoverModifier, focusModifier, [hoverModifier, focusModifier]]);

		// Should have: base, hover-only, focus-only, hover+focus
		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "margin",
		);
		expect(utilities).toHaveLength(4);
	});

	it("should return UtilityCreatorFn", () => {
		const useMargin = createUseUtility("margin", ({ value }) => ({
			margin: value,
		}));
		const s = styleframe();
		const creator = useMargin(s, { sm: "8px" });

		expect(typeof creator).toBe("function");
	});

	describe("defaults option", () => {
		it("should use defaults when no values are provided", () => {
			const useDisplay = createUseUtility(
				"display",
				({ value }) => ({
					display: value,
				}),
				{
					defaults: {
						block: "block",
						flex: "flex",
						grid: "grid",
					},
				},
			);
			const s = styleframe();
			useDisplay(s);

			const utilities = s.root.children.filter(
				(u): u is Utility => isUtility(u) && u.name === "display",
			);
			expect(utilities).toHaveLength(3);
		});

		it("should override defaults when values are provided", () => {
			const useDisplay = createUseUtility(
				"display",
				({ value }) => ({
					display: value,
				}),
				{
					defaults: {
						block: "block",
						flex: "flex",
					},
				},
			);
			const s = styleframe();
			useDisplay(s, { inline: "inline", custom: "contents" });

			const utilities = s.root.children.filter(
				(u): u is Utility => isUtility(u) && u.name === "display",
			);
			expect(utilities).toHaveLength(2);

			const inlineUtility = utilities.find((u) => u.value === "inline");
			expect(inlineUtility).toBeDefined();
		});
	});

	describe("mergeDefaults option", () => {
		it("should merge defaults with values when mergeDefaults is true", () => {
			const useVisibility = createUseUtility(
				"visibility",
				({ value }) => ({
					visibility: value,
				}),
				{
					defaults: {
						visible: "visible",
						hidden: "hidden",
					},
					mergeDefaults: true,
				},
			);
			const s = styleframe();
			useVisibility(s, { collapse: "collapse" });

			const utilities = s.root.children.filter(
				(u): u is Utility => isUtility(u) && u.name === "visibility",
			);
			expect(utilities).toHaveLength(3);
		});

		it("should not merge when mergeDefaults is false", () => {
			const usePosition = createUseUtility(
				"position",
				({ value }) => ({
					position: value,
				}),
				{
					defaults: {
						static: "static",
						relative: "relative",
					},
					mergeDefaults: false,
				},
			);
			const s = styleframe();
			usePosition(s, { absolute: "absolute" });

			const utilities = s.root.children.filter(
				(u): u is Utility => isUtility(u) && u.name === "position",
			);
			expect(utilities).toHaveLength(1);
			expect(utilities[0]?.value).toBe("absolute");
		});
	});

	describe("type safety", () => {
		it("should preserve utility name in instances", () => {
			const useMargin = createUseUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();
			useMargin(s, { sm: "8px" });

			const utility = s.root.children[0] as Utility;
			expect(utility.type).toBe("utility");
			expect(utility.name).toBe("margin");
			expect(utility.value).toBe("sm");
		});

		it("should preserve declarations structure", () => {
			const useFlex = createUseUtility("flex", ({ value }) => ({
				display: "flex",
				flexDirection: value === "col" ? "column" : "row",
			}));
			const s = styleframe();
			useFlex(s, { row: "row", col: "col" });

			const rowUtility = s.root.children.find(
				(u): u is Utility => isUtility(u) && u.name === "flex" && u.value === "row",
			);
			const colUtility = s.root.children.find(
				(u): u is Utility => isUtility(u) && u.name === "flex" && u.value === "col",
			);

			expect(rowUtility?.declarations).toEqual({
				display: "flex",
				flexDirection: "row",
			});
			expect(colUtility?.declarations).toEqual({
				display: "flex",
				flexDirection: "column",
			});
		});
	});

	describe("utilityOptions.name override", () => {
		it("should override the utility name", () => {
			const useMargin = createUseUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();
			useMargin(s, { sm: "8px" }, undefined, { name: "m" });

			const utility = s.root.children.find((u): u is Utility => isUtility(u) && u.name === "m");
			expect(utility).toBeDefined();
			expect(utility?.declarations).toEqual({ margin: "8px" });
		});

		it("should generate correct CSS selector with overridden name", () => {
			const useMargin = createUseUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();
			useMargin(s, { sm: "8px" }, undefined, { name: "m" });

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(String.raw`._m\:sm {`);
			expect(css).not.toContain("._margin");
		});

		it("should use default name when no override provided", () => {
			const useMargin = createUseUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();
			useMargin(s, { sm: "8px" });

			expect(s.root.utilities[0]?.name).toBe("margin");
		});
	});

	describe("real-world use cases", () => {
		it("should work like useMarginUtility", () => {
			const useMarginUtility = createUseUtility("margin", ({ value }) => ({
				margin: value,
			}));
			const s = styleframe();
			useMarginUtility(s, { sm: "0.5rem", md: "1rem", lg: "1.5rem" });

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(String.raw`._margin\:sm {`);
			expect(css).toContain("margin: 0.5rem;");
			expect(css).toContain(String.raw`._margin\:md {`);
			expect(css).toContain("margin: 1rem;");
			expect(css).toContain(String.raw`._margin\:lg {`);
			expect(css).toContain("margin: 1.5rem;");
		});

		it("should work like useDisplayUtility with defaults", () => {
			const useDisplayUtility = createUseUtility(
				"display",
				({ value }) => ({
					display: value,
				}),
				{
					defaults: {
						block: "block",
						"inline-block": "inline-block",
						inline: "inline",
						flex: "flex",
						"inline-flex": "inline-flex",
						grid: "grid",
						"inline-grid": "inline-grid",
						hidden: "none",
					},
				},
			);
			const s = styleframe();
			useDisplayUtility(s);

			const utilities = s.root.children.filter(
				(u): u is Utility => isUtility(u) && u.name === "display",
			);
			expect(utilities).toHaveLength(8);
		});

		it("should work like useFontSizeUtility", () => {
			const useFontSizeUtility = createUseUtility("font-size", ({ value }) => ({
				fontSize: value,
			}));
			const s = styleframe();
			useFontSizeUtility(s, {
				xs: "0.75rem",
				sm: "0.875rem",
				base: "1rem",
				lg: "1.125rem",
				xl: "1.25rem",
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(String.raw`._font-size\:xs {`);
			expect(css).toContain("font-size: 0.75rem;");
			expect(css).toContain(String.raw`._font-size\:base {`);
			expect(css).toContain("font-size: 1rem;");
		});

		it("should work with multi-property utilities", () => {
			const useTransition = createUseUtility("transition", ({ value }) => ({
				transitionProperty: value,
				transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
				transitionDuration: "150ms",
			}));
			const s = styleframe();
			useTransition(s, { colors: "color, background-color, border-color" });

			const utility = s.root.children[0] as Utility;
			expect(utility.declarations).toEqual({
				transitionProperty: "color, background-color, border-color",
				transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
				transitionDuration: "150ms",
			});
		});

		it("should work with composite utilities like margin-inline", () => {
			const useMarginInline = createUseUtility("margin-inline", ({ value }) => ({
				marginLeft: value,
				marginRight: value,
			}));
			const s = styleframe();
			useMarginInline(s, { sm: "8px", auto: "auto" });

			const smUtility = s.root.children.find(
				(u): u is Utility => isUtility(u) && u.name === "margin-inline" && u.value === "sm",
			);
			expect(smUtility?.declarations).toEqual({
				marginLeft: "8px",
				marginRight: "8px",
			});

			const autoUtility = s.root.children.find(
				(u): u is Utility => isUtility(u) && u.name === "margin-inline" && u.value === "auto",
			);
			expect(autoUtility?.declarations).toEqual({
				marginLeft: "auto",
				marginRight: "auto",
			});
		});
	});
});
