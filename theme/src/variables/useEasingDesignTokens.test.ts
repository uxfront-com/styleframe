import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { easingValues } from "../values";
import { useEasingDesignTokens } from "./useEasingDesignTokens";

describe("useEasingDesignTokens", () => {
	it("should create a single easing variable with 'default' key", () => {
		const s = styleframe();
		const { easing } = useEasingDesignTokens(s, {
			default: "ease-in-out",
		});

		expect(easing).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing",
			value: "ease-in-out",
		});

		const css = consumeCSS(easing, s.options);
		expect(css).toBe(`--easing: ease-in-out;`);
	});

	it("should create easing variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { easingEaseOutCubic } = useEasingDesignTokens(s, {
			"ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
		});

		expect(easingEaseOutCubic).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing.ease-out-cubic",
			value: "cubic-bezier(0.215, 0.61, 0.355, 1)",
		});

		const css = consumeCSS(easingEaseOutCubic, s.options);
		expect(css).toBe(`--easing--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);`);
	});

	it("should create multiple easing variables", () => {
		const s = styleframe();
		const { easing, easingEaseIn, easingEaseOut, easingEaseInOut } = useEasingDesignTokens(s, {
			default: "@easing.ease-in-out",
			"ease-in": "ease-in",
			"ease-out": "ease-out",
			"ease-in-out": "ease-in-out",
		});

		expect(easingEaseIn).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing.ease-in",
			value: "ease-in",
		});

		expect(easingEaseOut).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing.ease-out",
			value: "ease-out",
		});

		expect(easingEaseInOut).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing.ease-in-out",
			value: "ease-in-out",
		});

		expect(easing).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing",
			value: {
				type: "reference",
				name: "easing.ease-in-out",
			},
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useEasingDesignTokens(s, {
			default: "ease-in-out",
			"ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("easing");
		expect(s.root.variables[1]?.name).toBe("easing.ease-out-cubic");
	});

	it("should handle cubic-bezier values", () => {
		const s = styleframe();
		const { easingEaseInSine } = useEasingDesignTokens(s, {
			"ease-in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
		});

		expect(easingEaseInSine).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing.ease-in-sine",
			value: "cubic-bezier(0.47, 0, 0.745, 0.715)",
		});
	});

	it("should handle linear() function values for spring", () => {
		const s = styleframe();
		const springValue =
			"linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%)";

		const { easingSpring } = useEasingDesignTokens(s, {
			spring: springValue,
		});

		expect(easingSpring).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing.spring",
			value: springValue,
		});
	});

	it("should handle linear() function values for bounce", () => {
		const s = styleframe();
		const bounceValue =
			"linear(0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765, 1, 0.891 40.9%, 0.848, 0.813, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785, 0.813, 0.848, 0.891 68.2%, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953, 0.973, 1, 0.988, 0.984, 0.988, 1)";

		const { easingBounce } = useEasingDesignTokens(s, {
			bounce: bounceValue,
		});

		expect(easingBounce).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "easing.bounce",
			value: bounceValue,
		});
	});

	it("should handle empty easing object", () => {
		const s = styleframe();
		const result = useEasingDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle easing references", () => {
		const s = styleframe();
		const baseEasing = s.variable("base-easing", "ease-in-out");
		const { easing } = useEasingDesignTokens(s, {
			default: s.ref(baseEasing),
		});

		expect(easing.value).toEqual({
			type: "reference",
			name: "base-easing",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useEasingDesignTokens(s, {
			default: "@easing.ease-out-cubic",
			"ease-in": "ease-in",
			"ease-out": "ease-out",
			"ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--easing--ease-in: ease-in;
	--easing--ease-out: ease-out;
	--easing--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
	--easing: var(--easing--ease-out-cubic);
}`);
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		const easings = useEasingDesignTokens(s);

		// Check basic CSS keywords
		expect(easings.easingLinear.value).toBe("linear");
		expect(easings.easingEase.value).toBe("ease");
		expect(easings.easingEaseIn.value).toBe("ease-in");
		expect(easings.easingEaseOut.value).toBe("ease-out");
		expect(easings.easingEaseInOut.value).toBe("ease-in-out");

		// Check cubic-bezier values
		expect(easings.easingEaseInSine.value).toBe("cubic-bezier(0.47, 0, 0.745, 0.715)");
		expect(easings.easingEaseOutCubic.value).toBe("cubic-bezier(0.215, 0.61, 0.355, 1)");
		expect(easings.easingEaseInOutBack.value).toBe("cubic-bezier(0.68, -0.55, 0.265, 1.55)");

		// Check spring and bounce
		expect(easings.easingSpring.value).toContain("linear(");
		expect(easings.easingBounce.value).toContain("linear(");
	});

	it("should export easingValues with all expected keys", () => {
		// Basic CSS keywords
		expect(easingValues.linear).toBe("linear");
		expect(easingValues.ease).toBe("ease");
		expect(easingValues["ease-in"]).toBe("ease-in");
		expect(easingValues["ease-out"]).toBe("ease-out");
		expect(easingValues["ease-in-out"]).toBe("ease-in-out");

		// Sine family
		expect(easingValues["ease-in-sine"]).toBe("cubic-bezier(0.47, 0, 0.745, 0.715)");
		expect(easingValues["ease-out-sine"]).toBe("cubic-bezier(0.39, 0.575, 0.565, 1)");
		expect(easingValues["ease-in-out-sine"]).toBe("cubic-bezier(0.445, 0.05, 0.55, 0.95)");

		// Back family (with overshoot)
		expect(easingValues["ease-in-back"]).toBe("cubic-bezier(0.6, -0.28, 0.735, 0.045)");
		expect(easingValues["ease-out-back"]).toBe("cubic-bezier(0.175, 0.885, 0.32, 1.275)");
		expect(easingValues["ease-in-out-back"]).toBe("cubic-bezier(0.68, -0.55, 0.265, 1.55)");

		// Spring and bounce
		expect(easingValues.spring).toContain("linear(");
		expect(easingValues.bounce).toContain("linear(");
	});

	describe("type safety", () => {
		it("should preserve exact easing names in return type", () => {
			const s = styleframe();
			const easings = useEasingDesignTokens(s, {
				default: "ease-in-out",
				"ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
			});

			// Type assertions to verify the generic types are preserved
			const defaultEasing: Variable<"easing"> = easings.easing;
			const cubicEasing: Variable<"easing.ease-out-cubic"> = easings.easingEaseOutCubic;

			expect(defaultEasing.name).toBe("easing");
			expect(cubicEasing.name).toBe("easing.ease-out-cubic");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const { easingEaseInOutCubic } = useEasingDesignTokens(s, {
				"ease-in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
			});

			const typed: Variable<"easing.ease-in-out-cubic"> = easingEaseInOutCubic;
			expect(typed.name).toBe("easing.ease-in-out-cubic");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const easingConfig = {
				default: "ease-in-out",
				spring:
					"linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%)",
			} as const;

			const easings = useEasingDesignTokens(s, easingConfig);

			expect(easings.easing.name).toBe("easing");
			expect(easings.easingSpring.name).toBe("easing.spring");
		});
	});
});
