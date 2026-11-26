import type { Root, Selector } from "../types";
import { createAtRuleFunction, createKeyframesFunction } from "./atRule";
import { createCssFunction } from "./css";
import { createRefFunction } from "./ref";
import { createPropertyValueResolver, validateReference } from "./resolve";
import { createRoot } from "./root";
import { createVariableFunction } from "./variable";

describe("createCSSFunction", () => {
	let root: Root;
	let selector: Selector;
	let css: ReturnType<typeof createCssFunction>;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;

	beforeEach(() => {
		root = createRoot();
		selector = {
			type: "selector",
			id: "test-id",
			query: ".test",
			variables: [],
			declarations: {},
			children: [],
		};
		css = createCssFunction(selector, root);
		variable = createVariableFunction(selector, root);
		ref = createRefFunction(selector, root);
	});

	describe("basic CSS creation", () => {
		it("should create a CSS object with strings only", () => {
			const result = css`color: blue;`;

			expect(result).toEqual({
				type: "css",
				value: ["color: blue;"],
			});
		});

		it("should create a CSS object with empty template", () => {
			const result = css``;

			expect(result).toEqual({
				type: "css",
				value: [],
			});
		});

		it("should handle multiline CSS", () => {
			const result = css`
				color: blue;
				background: red;
			`;

			expect(result).toEqual({
				type: "css",
				value: ["\n\t\t\t\tcolor: blue;\n\t\t\t\tbackground: red;\n\t\t\t"],
			});
		});
	});

	describe("interpolation handling", () => {
		it("should handle single string interpolation", () => {
			const color = "blue";
			const result = css`color: ${color};`;

			expect(result).toEqual({
				type: "css",
				value: ["color: ", "blue", ";"],
			});
		});

		it("should handle multiple string interpolations", () => {
			const color = "blue";
			const size = "16px";
			const result = css`color: ${color}; font-size: ${size};`;

			expect(result).toEqual({
				type: "css",
				value: ["color: ", "blue", "; font-size: ", "16px", ";"],
			});
		});

		it("should handle interpolation at the beginning", () => {
			const property = "color";
			const result = css`${property}: blue;`;

			expect(result).toEqual({
				type: "css",
				value: ["color", ": blue;"],
			});
		});

		it("should handle interpolation at the end", () => {
			const value = "blue";
			const result = css`color: ${value}`;

			expect(result).toEqual({
				type: "css",
				value: ["color: ", "blue"],
			});
		});

		it("should handle consecutive interpolations", () => {
			const value1 = "solid";
			const value2 = "1px";
			const result = css`border: ${value1} ${value2};`;

			expect(result).toEqual({
				type: "css",
				value: ["border: ", "solid", " ", "1px", ";"],
			});
		});
	});

	describe("variable reference interpolation", () => {
		it("should handle variable reference interpolation", () => {
			const colorPrimary = variable("color-primary", "#006cff");
			const result = css`color: ${ref(colorPrimary)};`;

			expect(result).toEqual({
				type: "css",
				value: [
					"color: ",
					{
						type: "reference",
						name: "color-primary",
						fallback: undefined,
					},
					";",
				],
			});
		});

		it("should handle multiple variable references", () => {
			const colorPrimary = variable("color-primary", "#006cff");
			const spacing = variable("spacing-md", "1rem");

			const result = css`
				color: ${ref(colorPrimary)};
				padding: ${ref(spacing)};
			`;

			expect(result.value).toEqual([
				"\n\t\t\t\tcolor: ",
				{
					type: "reference",
					name: "color-primary",
					fallback: undefined,
				},
				";\n\t\t\t\tpadding: ",
				{
					type: "reference",
					name: "spacing-md",
					fallback: undefined,
				},
				";\n\t\t\t",
			]);
		});

		it("should handle variable references with fallbacks", () => {
			const result = css`color: ${ref("undefined-color", "#fallback")};`;

			expect(result).toEqual({
				type: "css",
				value: [
					"color: ",
					{
						type: "reference",
						name: "undefined-color",
						fallback: "#fallback",
					},
					";",
				],
			});
		});
	});

	describe("mixed interpolation types", () => {
		it("should handle mixed string and reference interpolations", () => {
			const colorPrimary = variable("color-primary", "#006cff");
			const width = "100%";

			const result = css`
				color: ${ref(colorPrimary)};
				width: ${width};
			`;

			expect(result.value).toEqual([
				"\n\t\t\t\tcolor: ",
				{
					type: "reference",
					name: "color-primary",
					fallback: undefined,
				},
				";\n\t\t\t\twidth: ",
				"100%",
				";\n\t\t\t",
			]);
		});

		it("should handle complex mixed interpolations", () => {
			const primary = variable("primary", "#006cff");
			const secondary = "#ff5733";
			const opacity = "0.8";

			const result = css`
				background: linear-gradient(
					to right,
					${ref(primary)},
					${secondary}
				);
				opacity: ${opacity};
			`;

			expect(result.value).toHaveLength(7); // 4 strings + 3 interpolations
			expect(result.value[1]).toEqual({
				type: "reference",
				name: "primary",
				fallback: undefined,
			});
			expect(result.value[3]).toBe("#ff5733");
			expect(result.value[5]).toBe("0.8");
		});
	});

	describe("context parameter handling", () => {
		it("should work with root context", () => {
			const cssWithRootContext = createCssFunction(root, root);
			const result = cssWithRootContext`color: blue;`;

			expect(result).toEqual({
				type: "css",
				value: ["color: blue;"],
			});
		});

		it("should work with selector context", () => {
			const cssWithSelectorContext = createCssFunction(selector, root);
			const result = cssWithSelectorContext`background: red;`;

			expect(result).toEqual({
				type: "css",
				value: ["background: red;"],
			});
		});

		it("should work with nested selector context", () => {
			const nestedSelector: Selector = {
				type: "selector",
				id: "test-id",
				query: "&:hover",
				variables: [],
				declarations: {},
				children: [],
			};

			const cssWithNestedContext = createCssFunction(nestedSelector, root);
			const result = cssWithNestedContext`opacity: 0.8;`;

			expect(result).toEqual({
				type: "css",
				value: ["opacity: 0.8;"],
			});
		});
	});

	describe("TokenValue types handling", () => {
		it("should handle number interpolations", () => {
			const fontSize = 16;
			const result = css`font-size: ${fontSize}px;`;

			expect(result).toEqual({
				type: "css",
				value: ["font-size: ", 16, "px;"],
			});
		});

		it("should handle boolean interpolations", () => {
			const isVisible = true;
			const result = css`display: ${isVisible ? "block" : "none"};`;

			expect(result).toEqual({
				type: "css",
				value: ["display: ", "block", ";"],
			});
		});

		it("should handle null and undefined interpolations", () => {
			const nullValue = null;
			const undefinedValue = undefined;

			const result1 = css`value: ${nullValue};`;
			const result2 = css`value: ${undefinedValue};`;

			expect(result1.value).toEqual(["value: ", null, ";"]);
			expect(result2.value).toEqual(["value: ", undefined, ";"]);
		});
	});
	describe("edge cases", () => {
		it("should maintain object identity for repeated calls", () => {
			const colorVar = variable("repeat-test", "#fff");

			const ref1 = ref(colorVar);
			const ref2 = ref(colorVar);

			// Should create new objects each time
			expect(ref1).not.toBe(ref2);
			// But should be equal in content
			expect(ref1).toEqual(ref2);
		});

		it("should handle null fallback values", () => {
			const result = ref("test-var", null as any);

			expect(result.fallback).toBeNull();
		});
	});

	describe("real-world usage patterns", () => {
		it("should support design token patterns", () => {
			const blue500 = variable("blue-500", "#3b82f6");
			const blue600 = variable("blue-600", "#2563eb");

			const colorPrimary = variable("color-primary", ref(blue500));
			const colorPrimaryHover = variable("color-primary-hover", ref(blue600));

			expect(colorPrimary.value).toEqual({
				type: "reference",
				name: "blue-500",
				fallback: undefined,
			});

			expect(colorPrimaryHover.value).toEqual({
				type: "reference",
				name: "blue-600",
				fallback: undefined,
			});
		});

		it("should work in CSS template literals", () => {
			const colorPrimary = variable("color-primary", "#006cff");
			const spacingMd = variable("spacing-md", "1rem");

			// Simulate usage in CSS templates
			const colorRef = ref(colorPrimary);
			const spacingRef = ref(spacingMd);
			const fallbackRef = ref("text-color", "#000");

			expect(colorRef).toEqual({
				type: "reference",
				name: "color-primary",
				fallback: undefined,
			});

			expect(spacingRef).toEqual({
				type: "reference",
				name: "spacing-md",
				fallback: undefined,
			});

			expect(fallbackRef).toEqual({
				type: "reference",
				name: "text-color",
				fallback: "#000",
			});
		});

		it("should support conditional references", () => {
			const isDark = false;
			const lightColor = variable("light-bg", "#ffffff");
			const darkColor = variable("dark-bg", "#000000");

			const bgColor = isDark ? ref(darkColor) : ref(lightColor);

			expect(bgColor).toEqual({
				type: "reference",
				name: "light-bg",
				fallback: undefined,
			});
		});
	});

	describe("auto-resolve interpolation", () => {
		it("should auto-resolve a variable to a reference", () => {
			const spacing = variable("spacing-md", "1rem");
			const result = css`${spacing} calc(${spacing} * 2)`;

			expect(result).toEqual({
				type: "css",
				value: [
					{ type: "reference", name: "spacing-md", fallback: undefined },
					" calc(",
					{ type: "reference", name: "spacing-md", fallback: undefined },
					" * 2)",
				],
			});
		});

		it("should auto-resolve multiple variables to references", () => {
			const spacingSm = variable("spacing-sm", "0.5rem");
			const spacingMd = variable("spacing-md", "1rem");

			const result = css`${spacingSm} ${spacingMd}`;

			expect(result).toEqual({
				type: "css",
				value: [
					{ type: "reference", name: "spacing-sm", fallback: undefined },
					" ",
					{ type: "reference", name: "spacing-md", fallback: undefined },
				],
			});
		});

		it("should extract the rule from a keyframes instance", () => {
			const keyframes = createKeyframesFunction(selector, root);
			const fadeIn = keyframes("fade-in", {
				"0%": { opacity: 0 },
				"100%": { opacity: 1 },
			});

			const result = css`${fadeIn} 300ms ease-in-out`;

			expect(result).toEqual({
				type: "css",
				value: ["fade-in", " 300ms ease-in-out"],
			});
		});

		it("should extract the rule from an at-rule instance", () => {
			const atRule = createAtRuleFunction(selector, root);
			const layer = atRule("layer", "utilities");

			const result = css`${layer}`;

			expect(result).toEqual({
				type: "css",
				value: ["utilities"],
			});
		});

		it("should handle mixed variable, at-rule, and string interpolations", () => {
			const duration = variable("duration-md", "300ms");
			const keyframes = createKeyframesFunction(selector, root);
			const fadeIn = keyframes("fade-in", {
				"0%": { opacity: 0 },
				"100%": { opacity: 1 },
			});

			const result = css`${fadeIn} ${duration} ease-in-out`;

			expect(result).toEqual({
				type: "css",
				value: [
					"fade-in",
					" ",
					{ type: "reference", name: "duration-md", fallback: undefined },
					" ease-in-out",
				],
			});
		});
	});

	describe("@variable notation", () => {
		it("should resolve @variablename to a reference", () => {
			const result = css`@color.primary`;

			expect(result).toEqual({
				type: "css",
				value: [{ type: "reference", name: "color.primary", fallback: undefined }],
			});
		});

		it("should resolve @variablename with surrounding text", () => {
			const result = css`1px solid @color.primary`;

			expect(result).toEqual({
				type: "css",
				value: ["1px solid ", { type: "reference", name: "color.primary", fallback: undefined }],
			});
		});

		it("should resolve deeply dotted @variablename", () => {
			const result = css`@color.primary.500`;

			expect(result).toEqual({
				type: "css",
				value: [
					{
						type: "reference",
						name: "color.primary.500",
						fallback: undefined,
					},
				],
			});
		});

		it("should resolve multiple @variablenames in one string segment", () => {
			const result = css`@spacing.x @spacing.y`;

			expect(result).toEqual({
				type: "css",
				value: [
					{ type: "reference", name: "spacing.x", fallback: undefined },
					" ",
					{ type: "reference", name: "spacing.y", fallback: undefined },
				],
			});
		});

		it("should resolve @variablename mixed with interpolations", () => {
			const opacity = "0.8";
			const result = css`@color.primary ${opacity}`;

			expect(result).toEqual({
				type: "css",
				value: [{ type: "reference", name: "color.primary", fallback: undefined }, " ", "0.8"],
			});
		});

		it("should not affect strings without @ references", () => {
			const result = css`1px solid blue`;

			expect(result).toEqual({
				type: "css",
				value: ["1px solid blue"],
			});
		});

		it("should resolve @variablename in a string interpolation", () => {
			const value = "@color.primary";
			const result = css`solid ${value} 1px`;

			expect(result).toEqual({
				type: "css",
				value: ["solid ", { type: "reference", name: "color.primary" }, " 1px"],
			});
		});

		it("should resolve @variablename with negative-index segment in interpolation", () => {
			const value = "@scale.min-powers.-2";
			const result = css`calc(${value} * 1rem)`;

			expect(result).toEqual({
				type: "css",
				value: ["calc(", { type: "reference", name: "scale.min-powers.-2" }, " * 1rem)"],
			});
		});

		it("should not transform interpolated strings without @", () => {
			const value = "100%";
			const result = css`solid ${value} red`;

			expect(result).toEqual({
				type: "css",
				value: ["solid ", "100%", " red"],
			});
		});
	});

	describe("validateReference", () => {
		it("should not throw when variable exists in root", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "color.primary",
				value: "#006cff",
			});

			expect(() => validateReference("color.primary", root, root)).not.toThrow();
		});

		it("should throw when variable does not exist in root", () => {
			expect(() => validateReference("color.nonexistent", root, root)).toThrow(
				'[styleframe] Variable "color.nonexistent" is not defined. Check that the variable exists before referencing it with "@color.nonexistent".',
			);
		});
	});

	describe("resolvePropertyValue", () => {
		let resolvePropertyValue: ReturnType<typeof createPropertyValueResolver>;

		beforeEach(() => {
			resolvePropertyValue = createPropertyValueResolver(root, root);
		});

		it("should resolve exact @reference to a Reference", () => {
			root.variables.push({
				type: "variable",
				id: "test-id",
				name: "color.primary",
				value: "#006cff",
			});
			const result = resolvePropertyValue("@color.primary");

			expect(result).toEqual({
				type: "reference",
				name: "color.primary",
				fallback: undefined,
			});
		});

		it("should resolve embedded @reference to a CSS object", () => {
			root.variables.push({
				type: "variable",
				id: "color-primary",
				name: "color.primary",
				value: "#006cff",
			});

			const result = resolvePropertyValue("1px solid @color.primary");

			expect(result).toEqual({
				type: "css",
				value: ["1px solid ", { type: "reference", name: "color.primary", fallback: undefined }],
			});
		});

		it("should resolve multiple embedded @references to a CSS object", () => {
			root.variables.push(
				{
					type: "variable",
					id: "spacing-sm",
					name: "spacing.sm",
					value: "0.5rem",
				},
				{
					type: "variable",
					id: "spacing-md",
					name: "spacing.md",
					value: "1rem",
				},
			);

			const result = resolvePropertyValue("@spacing.sm @spacing.md");

			expect(result).toEqual({
				type: "css",
				value: [
					{ type: "reference", name: "spacing.sm", fallback: undefined },
					" ",
					{ type: "reference", name: "spacing.md", fallback: undefined },
				],
			});
		});

		it("should return non-string values unchanged", () => {
			expect(resolvePropertyValue(42)).toBe(42);
			expect(resolvePropertyValue(null)).toBeNull();
			expect(resolvePropertyValue(undefined)).toBeUndefined();
		});

		it("should return strings without @ unchanged", () => {
			expect(resolvePropertyValue("1px solid blue")).toBe("1px solid blue");
			expect(resolvePropertyValue("red")).toBe("red");
		});
	});

	describe("function context independence", () => {
		it("should create independent functions for different contexts", () => {
			const context1 = createRoot();
			const context2: Selector = {
				type: "selector",
				id: "test-id",
				query: ".test",
				variables: [],
				declarations: {},
				children: [],
			};

			const ref1 = createRefFunction(context1, root);
			const ref2 = createRefFunction(context2, root);

			const result1 = ref1("test-var-1");
			const result2 = ref2("test-var-2");

			expect(result1.name).toBe("test-var-1");
			expect(result2.name).toBe("test-var-2");

			expect(ref1).not.toBe(ref2);
		});
	});
});
