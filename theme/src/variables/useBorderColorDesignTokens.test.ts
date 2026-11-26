import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useBorderColorDesignTokens } from "./useBorderColorDesignTokens";

describe("useBorderColorDesignTokens", () => {
	it("should create all border color variables with correct names and values", () => {
		const s = styleframe();
		const { borderColor, borderColorPrimary } = useBorderColorDesignTokens(s, {
			default: "#e5e5e5",
			primary: "#3b82f6",
		});

		expect(borderColorPrimary).toEqual(
			expect.objectContaining({
				type: "variable",
				name: "border-color.primary",
				value: "#3b82f6",
			}),
		);

		expect(borderColor).toEqual(
			expect.objectContaining({
				type: "variable",
				name: "border-color",
				value: "#e5e5e5",
			}),
		);
	});

	it("should add all border color variables to root", () => {
		const s = styleframe();
		useBorderColorDesignTokens(s, {
			default: "#e5e5e5",
			primary: "#3b82f6",
		});

		expect(s.root.variables).toHaveLength(2);
		const names = s.root.variables.map((v) => v.name);
		expect(names).toContain("border-color");
		expect(names).toContain("border-color.primary");
	});

	it("should return all border color variables in an object", () => {
		const s = styleframe();
		const borderColors = useBorderColorDesignTokens(s, {
			default: "#e5e5e5",
			primary: "#3b82f6",
			success: "#10b981",
		});

		expect(Object.keys(borderColors)).toEqual(
			expect.arrayContaining(["borderColor", "borderColorPrimary", "borderColorSuccess"]),
		);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useBorderColorDesignTokens(s, {
			default: "#e5e5e5",
			primary: "#3b82f6",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toContain("--border-color--primary: #3b82f6;");
		expect(css).toContain("--border-color: #e5e5e5;");
	});

	it("should compile individual border color variable to correct CSS", () => {
		const s = styleframe();
		const { borderColorPrimary } = useBorderColorDesignTokens(s, {
			primary: "#3b82f6",
		});

		const css = consumeCSS(borderColorPrimary, s.options);

		expect(css).toBe("--border-color--primary: #3b82f6;");
	});

	it("should not create duplicate variables when called multiple times", () => {
		const s = styleframe();
		const borderColors1 = useBorderColorDesignTokens(s, {
			default: "#e5e5e5",
			primary: "#3b82f6",
		});
		const borderColors2 = useBorderColorDesignTokens(s, {
			default: "#e5e5e5",
			primary: "#3b82f6",
		});

		expect(borderColors1.borderColorPrimary).toBe(borderColors2.borderColorPrimary);
		expect(borderColors1.borderColor).toBe(borderColors2.borderColor);
		expect(s.root.variables).toHaveLength(2);
	});

	it("should allow border color variables to be used as references", () => {
		const s = styleframe();
		const { borderColorPrimary } = useBorderColorDesignTokens(s, {
			primary: "#3b82f6",
		});

		const customBorderColor = s.variable("custom-border-color", s.ref(borderColorPrimary));

		expect(customBorderColor.value).toEqual({
			type: "reference",
			name: "border-color.primary",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("--custom-border-color: var(--border-color--primary);");
	});

	it("should work with selector overrides", () => {
		const s = styleframe();
		const { borderColorPrimary } = useBorderColorDesignTokens(s, {
			primary: "#3b82f6",
		});

		s.selector(".custom-border-color", ({ variable }) => {
			variable(borderColorPrimary, "#ff0000");
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toContain("--border-color--primary: #3b82f6;");
		expect(css).toContain(".custom-border-color {");
		expect(css).toContain("--border-color--primary: #ff0000;");
	});

	describe("type safety", () => {
		it("should preserve exact border color variable names in return type", () => {
			const s = styleframe();
			const borderColors = useBorderColorDesignTokens(s, {
				default: "#e5e5e5",
				primary: "#3b82f6",
			});

			const primary: Variable<"border-color.primary"> = borderColors.borderColorPrimary;
			const borderColor: Variable<"border-color"> = borderColors.borderColor;

			expect(primary.name).toBe("border-color.primary");
			expect(borderColor.name).toBe("border-color");
		});

		it("should have correct value types", () => {
			const s = styleframe();
			const borderColors = useBorderColorDesignTokens(s, {
				default: "#e5e5e5",
				primary: "#3b82f6",
			});

			expect(typeof borderColors.borderColorPrimary.value).toBe("string");
			expect(typeof borderColors.borderColor.value).toBe("string");
		});
	});

	describe("default border color", () => {
		it("should create a default border color variable with the provided value", () => {
			const s = styleframe();
			const { borderColor } = useBorderColorDesignTokens(s, {
				default: "#e5e5e5",
			});

			expect(borderColor).toEqual(
				expect.objectContaining({
					type: "variable",
					name: "border-color",
					value: "#e5e5e5",
				}),
			);
		});

		it("should allow customizing the default border color with a reference", () => {
			const s = styleframe();
			const { borderColor } = useBorderColorDesignTokens(s, {
				primary: "#3b82f6",
				default: "@border-color.primary",
			});

			expect(borderColor.value).toEqual({
				type: "reference",
				name: "border-color.primary",
			});
		});

		it("should compile default border color reference to CSS correctly", () => {
			const s = styleframe();
			useBorderColorDesignTokens(s, {
				primary: "#3b82f6",
				error: "#ef4444",
				default: "@border-color.primary",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toContain("--border-color--primary: #3b82f6;");
			expect(css).toContain("--border-color--error: #ef4444;");
			expect(css).toContain("--border-color: var(--border-color--primary);");
		});
	});

	describe("with color variable references", () => {
		it("should work with cross-domain var() references", () => {
			const s = styleframe();

			useBorderColorDesignTokens(s, {
				default: "var(--color--surface-shade-50)",
				primary: "var(--color--primary-shade-50)",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toContain("--border-color--primary: var(--color--primary-shade-50);");
			expect(css).toContain("--border-color: var(--color--surface-shade-50);");
		});
	});

	describe("practical usage", () => {
		it("should work for creating borders with different colors", () => {
			const s = styleframe();
			const { borderColor, borderColorPrimary } = useBorderColorDesignTokens(s, {
				default: "#e5e5e5",
				primary: "#3b82f6",
			});

			s.selector(".card", ({ variable }) => {
				variable("border-color", s.ref(borderColor));
			});

			s.selector(".card-primary", ({ variable }) => {
				variable("border-color", s.ref(borderColorPrimary));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--border-color: var(--border-color);");
			expect(css).toContain("--border-color: var(--border-color--primary);");
		});

		it("should work for theme-specific border color overrides", () => {
			const s = styleframe();
			const { borderColorPrimary } = useBorderColorDesignTokens(s, {
				primary: "#3b82f6",
			});

			s.selector(".dark-theme", ({ variable }) => {
				variable(borderColorPrimary, "#60a5fa");
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--border-color--primary: #3b82f6;");
			expect(css).toContain("--border-color--primary: #60a5fa;");
		});

		it("should work for state-specific border colors", () => {
			const s = styleframe();
			const { borderColor, borderColorPrimary } = useBorderColorDesignTokens(s, {
				default: "#e5e5e5",
				primary: "#3b82f6",
				error: "#ef4444",
			});

			s.selector(".input", ({ variable }) => {
				variable("border-color", s.ref(borderColor));
			});

			s.selector(".input:focus", ({ variable }) => {
				variable("border-color", s.ref(borderColorPrimary));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("--border-color--primary: #3b82f6;");
			expect(css).toContain("--border-color--error: #ef4444;");
			expect(css).toContain("--border-color: #e5e5e5;");
			expect(css).toContain("--border-color: var(--border-color);");
			expect(css).toContain("--border-color: var(--border-color--primary);");
		});
	});
});
