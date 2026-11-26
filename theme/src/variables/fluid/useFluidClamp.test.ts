import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useFluidClamp } from "./useFluidClamp";

describe("useFluidClamp", () => {
	it("should create a fluid range value with numeric min and max", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16, 20]);

		expect(result).toEqual(
			expect.objectContaining({
				type: "css",
			}),
		);
	});

	it("should generate correct calc formula with numeric values", () => {
		const s = styleframe();
		s.variable("fluid.breakpoint", "0.5");
		const result = useFluidClamp(s, [16, 20]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		// Should follow pattern: calc((min / 16 * 1rem) + (max - min) * breakpoint)
		expect(css).toContain("calc(");
		expect(css).toContain("/ 16 * 1rem");
		expect(css).toContain("var(--fluid--breakpoint)");
	});

	it("should handle variable references for min value", () => {
		const s = styleframe();
		const minVar = s.variable("min-value", 16);
		const result = useFluidClamp(s, [minVar, 20]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--min-value)");
	});

	it("should handle variable references for max value", () => {
		const s = styleframe();
		const maxVar = s.variable("max-value", 20);
		const result = useFluidClamp(s, [16, maxVar]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--max-value)");
	});

	it("should handle variable references for both min and max", () => {
		const s = styleframe();
		const minVar = s.variable("min-value", 16);
		const maxVar = s.variable("max-value", 20);
		const result = useFluidClamp(s, [minVar, maxVar]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--min-value)");
		expect(css).toContain("var(--max-value)");
	});

	it("should use default fluid.breakpoint reference", () => {
		const s = styleframe();
		s.variable("fluid.breakpoint", "0.5");
		const result = useFluidClamp(s, [16, 20]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--fluid--breakpoint)");
	});

	it("should accept custom breakpoint variable", () => {
		const s = styleframe();
		const customBreakpoint = s.variable("custom-breakpoint", "0.75");
		const result = useFluidClamp(s, [16, 20], customBreakpoint);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--custom-breakpoint)");
	});

	it("should accept custom breakpoint as TokenValue", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16, 20], "50vw");

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("50vw");
	});

	it("should accept custom breakpoint reference", () => {
		const s = styleframe();
		const customBreakpoint = s.variable("custom-breakpoint", "0.75");
		const result = useFluidClamp(s, [16, 20], s.ref(customBreakpoint));

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--custom-breakpoint)");
	});

	it("should handle zero as min value", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [0, 20]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("calc(");
		expect(css).toContain("0");
	});

	it("should handle zero as max value", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16, 0]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("calc(");
		expect(css).toContain("0");
	});

	it("should handle equal min and max values", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16, 16]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("calc(");
		expect(css).toContain("16");
	});

	it("should handle negative values", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [-10, -5]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("calc(");
	});

	it("should handle decimal values", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16.5, 20.75]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("calc(");
		expect(css).toContain("16.5");
		expect(css).toContain("20.75");
	});

	it("should handle string values for min", () => {
		const s = styleframe();
		const result = useFluidClamp(s, ["1rem", 20]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("1rem");
	});

	it("should handle string values for max", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16, "1.5rem"]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("1.5rem");
	});

	it("should handle string values for both min and max", () => {
		const s = styleframe();
		const result = useFluidClamp(s, ["1rem", "1.5rem"]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("1rem");
		expect(css).toContain("1.5rem");
	});

	it("should handle large values", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [1000, 2000]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("1000");
		expect(css).toContain("2000");
	});

	it("should generate correct formula structure", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16, 20]);

		expect(result).toEqual({
			type: "css",
			value: expect.arrayContaining([
				"calc((",
				16,
				" / 16 * 1rem) + (",
				20,
				" - ",
				16,
				") * ",
				expect.objectContaining({
					type: "reference",
					name: "fluid.breakpoint",
				}),
				")",
			]),
		});
	});

	it("should work with css token expressions", () => {
		const s = styleframe();
		const minExpr = s.css`16 * 1.2`;
		const maxExpr = s.css`18 * 1.2`;
		const result = useFluidClamp(s, [minExpr, maxExpr]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("calc(");
	});

	it("should return a css token type", () => {
		const s = styleframe();
		const result = useFluidClamp(s, [16, 20]);

		expect(result).toHaveProperty("type", "css");
		expect(result).toHaveProperty("value");
	});

	it("should handle reference tokens for min", () => {
		const s = styleframe();
		const minRef = s.ref("some-var");
		const result = useFluidClamp(s, [minRef, 20]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--some-var)");
	});

	it("should handle reference tokens for max", () => {
		const s = styleframe();
		const maxRef = s.ref("some-var");
		const result = useFluidClamp(s, [16, maxRef]);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--some-var)");
	});

	it("should handle reference tokens for breakpoint", () => {
		const s = styleframe();
		const bpRef = s.ref("custom-bp");
		const result = useFluidClamp(s, [16, 20], bpRef);

		const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

		expect(css).toContain("var(--custom-bp)");
	});

	describe("integration scenarios", () => {
		it("should work with font size variables", () => {
			const s = styleframe();
			const fontSizeMin = s.variable("font-size.min", 16);
			const fontSizeMax = s.variable("font-size.max", 20);
			const fluidBreakpoint = s.variable("fluid.breakpoint", "0.5");

			const result = useFluidClamp(s, [fontSizeMin, fontSizeMax], fluidBreakpoint);

			const css = consumeCSS(s.variable("font-size", result, { default: true }), s.options);

			expect(css).toContain("var(--font-size--min)");
			expect(css).toContain("var(--font-size--max)");
			expect(css).toContain("var(--fluid--breakpoint)");
		});

		it("should work with multiplied base values", () => {
			const s = styleframe();
			const fontSizeMin = s.variable("font-size.min", 16);
			const fontSizeMax = s.variable("font-size.max", 18);
			const minMultiplied = s.css`${s.ref(fontSizeMin)} * 1.2`;
			const maxMultiplied = s.css`${s.ref(fontSizeMax)} * 1.25`;

			const result = useFluidClamp(s, [minMultiplied, maxMultiplied]);

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			expect(css).toContain("var(--font-size--min) * 1.2");
			expect(css).toContain("var(--font-size--max) * 1.25");
		});

		it("should work in a complete fluid typography setup", () => {
			const s = styleframe();

			// Setup base values
			const fontSizeMin = s.variable("font-size.min", 16);
			const fontSizeMax = s.variable("font-size.max", 18);
			const fluidMinWidth = s.variable("fluid.min-width", 320);
			const fluidMaxWidth = s.variable("fluid.max-width", 1440);
			const fluidScreen = s.variable("fluid.screen", "100vw");
			const fluidBreakpoint = s.variable(
				"fluid.breakpoint",
				s.css`calc((${s.ref(fluidScreen)} - ${s.ref(fluidMinWidth)} / 16 * 1rem) / (${s.ref(fluidMaxWidth)} - ${s.ref(fluidMinWidth)}))`,
			);

			// Create fluid range
			const fluidSize = useFluidClamp(s, [fontSizeMin, fontSizeMax], fluidBreakpoint);

			const css = consumeCSS(s.variable("font-size", fluidSize, { default: true }), s.options);

			expect(css).toContain("var(--font-size--min)");
			expect(css).toContain("var(--font-size--max)");
			expect(css).toContain("var(--fluid--breakpoint)");
		});

		it("should work with scale powers", () => {
			const s = styleframe();
			const fontSizeMin = s.variable("font-size.min", 16);
			const fontSizeMax = s.variable("font-size.max", 18);
			const scaleMinPower = 1.2; // Scale power value
			const scaleMaxPower = 1.25;

			const minScaled = s.css`${s.ref(fontSizeMin)} * ${scaleMinPower}`;
			const maxScaled = s.css`${s.ref(fontSizeMax)} * ${scaleMaxPower}`;

			const result = useFluidClamp(s, [minScaled, maxScaled]);

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			expect(css).toContain("var(--font-size--min) * 1.2");
			expect(css).toContain("var(--font-size--max) * 1.25");
		});
	});

	describe("formula correctness", () => {
		it("should divide min by 16 and multiply by 1rem", () => {
			const s = styleframe();
			const result = useFluidClamp(s, [16, 20]);

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			expect(css).toContain("/ 16 * 1rem");
		});

		it("should calculate difference between max and min", () => {
			const s = styleframe();
			const result = useFluidClamp(s, [16, 20]);

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			// Should contain (max - min) structure
			expect(css).toContain("20 - 16");
		});

		it("should multiply difference by breakpoint", () => {
			const s = styleframe();
			const result = useFluidClamp(s, [16, 20]);

			expect(result).toEqual({
				type: "css",
				value: expect.arrayContaining([
					") * ",
					expect.objectContaining({
						type: "reference",
						name: "fluid.breakpoint",
					}),
				]),
			});
		});

		it("should wrap everything in calc()", () => {
			const s = styleframe();
			const result = useFluidClamp(s, [16, 20]);

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			expect(css).toMatch(/calc\(/);
			expect(css).toMatch(/\);$/);
		});
	});

	describe("type safety", () => {
		it("should accept Variable type for min", () => {
			const s = styleframe();
			const minVar: Variable<"min"> = s.variable("min", 16);
			const result = useFluidClamp(s, [minVar, 20]);

			expect(result).toHaveProperty("type", "css");
		});

		it("should accept Variable type for max", () => {
			const s = styleframe();
			const maxVar: Variable<"max"> = s.variable("max", 20);
			const result = useFluidClamp(s, [16, maxVar]);

			expect(result).toHaveProperty("type", "css");
		});

		it("should accept Variable type for breakpoint", () => {
			const s = styleframe();
			const bpVar: Variable<"breakpoint"> = s.variable("breakpoint", "0.5");
			const result = useFluidClamp(s, [16, 20], bpVar);

			expect(result).toHaveProperty("type", "css");
		});

		it("should accept TokenValue types", () => {
			const s = styleframe();
			const result = useFluidClamp(s, [16, 20], "50vw");

			expect(result).toHaveProperty("type", "css");
		});
	});

	describe("object form { min, max }", () => {
		it("should produce the same css as the tuple form for numeric values", () => {
			const tupleS = styleframe();
			tupleS.variable("fluid.breakpoint", "0.5");
			const tupleResult = useFluidClamp(tupleS, [16, 20]);
			const tupleCss = consumeCSS(
				tupleS.variable("test", tupleResult, { default: true }),
				tupleS.options,
			);

			const objectS = styleframe();
			objectS.variable("fluid.breakpoint", "0.5");
			const objectResult = useFluidClamp(objectS, { min: 16, max: 20 });
			const objectCss = consumeCSS(
				objectS.variable("test", objectResult, { default: true }),
				objectS.options,
			);

			expect(objectCss).toBe(tupleCss);
		});

		it("should handle a Variable reference for min", () => {
			const s = styleframe();
			const minVar = s.variable("min-value", 16);
			const result = useFluidClamp(s, { min: minVar, max: 20 });

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			expect(css).toContain("var(--min-value)");
		});

		it("should handle a Variable reference for max", () => {
			const s = styleframe();
			const maxVar = s.variable("max-value", 20);
			const result = useFluidClamp(s, { min: 16, max: maxVar });

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			expect(css).toContain("var(--max-value)");
		});

		it("should honor a custom breakpoint argument", () => {
			const s = styleframe();
			const bpVar: Variable<"breakpoint"> = s.variable("breakpoint", "0.5");
			const result = useFluidClamp(s, { min: 16, max: 20 }, bpVar);

			const css = consumeCSS(s.variable("test", result, { default: true }), s.options);

			expect(css).toContain("var(--breakpoint)");
		});
	});
});
