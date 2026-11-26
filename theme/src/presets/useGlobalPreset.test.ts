import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDesignTokensPreset } from "./useDesignTokensPreset";
import { useGlobalPreset } from "./useGlobalPreset";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useGlobalPreset", () => {
	describe("basic functionality", () => {
		it("should create all default domains when called with no config", () => {
			const s = createInstance();
			const result = useGlobalPreset(s);

			expect(result.body).toBeDefined();
			expect(result.heading).toBeDefined();
			expect(result.link).toBeDefined();
			expect(result.selection).toBeDefined();
			expect(result.focus).toBeDefined();
		});

		it("should create all default domains when called with empty config", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, {});

			expect(result.body).toBeDefined();
			expect(result.heading).toBeDefined();
			expect(result.link).toBeDefined();
			expect(result.selection).toBeDefined();
			expect(result.focus).toBeDefined();
		});

		it("should add variables to root", () => {
			const s = createInstance();
			const variablesBefore = s.root.variables.length;
			useGlobalPreset(s);

			expect(s.root.variables.length).toBeGreaterThan(variablesBefore);
		});

		it("should generate CSS output with expected selectors", () => {
			const s = createInstance();
			useGlobalPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("body");
			expect(css).toContain("h1, h2, h3, h4, h5, h6");
			expect(css).toContain("--body--color");
			expect(css).toContain("--body--background");
			expect(css).toContain("--heading--color");
			expect(css).toContain("--link--color");
			expect(css).toContain("--link--hover--color");
			expect(css).toContain("--selection--background");
			expect(css).toContain("--selection--color");
			expect(css).toContain("--focus--outline-color");
		});

		it("should generate body selector with font references", () => {
			const s = createInstance();
			useGlobalPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("var(--body--font-family)");
			expect(css).toContain("var(--body--font-size)");
			expect(css).toContain("var(--body--line-height)");
			expect(css).toContain("-webkit-font-smoothing: antialiased");
		});

		it("should generate heading selectors with design token references", () => {
			const s = createInstance();
			useGlobalPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("var(--heading--font-weight)");
			expect(css).toContain("var(--heading--line-height)");
			expect(css).toContain("var(--heading--h1--font-size)");
			expect(css).toContain("var(--heading--h2--font-size)");
			expect(css).toContain("var(--heading--h3--font-size)");
			expect(css).toContain("var(--heading--h4--font-size)");
			expect(css).toContain("var(--heading--h5--font-size)");
			expect(css).toContain("var(--heading--h6--font-size)");
		});

		it("should generate link selectors with hover state", () => {
			const s = createInstance();
			useGlobalPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("var(--link--color)");
			expect(css).toContain("var(--link--hover--color)");
		});

		it("should generate code selectors", () => {
			const s = createInstance();
			useGlobalPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("code, samp");
			expect(css).toContain("pre");
			expect(css).toContain("var(--code--font-family)");
			expect(css).toContain("var(--pre--font-family)");
		});

		it("should generate selection selector", () => {
			const s = createInstance();
			useGlobalPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("::selection");
			expect(css).toContain("var(--selection--background)");
			expect(css).toContain("var(--selection--color)");
		});

		it("should generate focus-visible selector", () => {
			const s = createInstance();
			useGlobalPreset(s);

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain(":focus-visible");
			expect(css).toContain("var(--focus--outline-color)");
		});
	});

	describe("disabling domains", () => {
		it("should disable body when body is false", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, { body: false });

			expect(result.body).toBeUndefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--body--color");
			expect(css).not.toContain("--body--background");
		});

		it("should disable heading when heading is false", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, { heading: false });

			expect(result.heading).toBeUndefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--heading--color");
		});

		it("should disable link when link is false", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, { link: false });

			expect(result.link).toBeUndefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--link--color");
		});

		it("should disable code when code is false", () => {
			const s = createInstance();
			useGlobalPreset(s, { code: false });

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("code, samp");
		});

		it("should disable selection when selection is false", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, { selection: false });

			expect(result.selection).toBeUndefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--selection--background");
		});

		it("should disable focus when focus is false", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, { focus: false });

			expect(result.focus).toBeUndefined();

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--focus--outline-color");
		});

		it("should disable all domains", () => {
			const s = styleframe();
			const result = useGlobalPreset(s, {
				body: false,
				heading: false,
				link: false,
				code: false,
				selection: false,
				focus: false,
				hr: false,
				kbd: false,
				mark: false,
				caption: false,
				pre: false,
				abbr: false,
				address: false,
				samp: false,
				dl: false,
				dt: false,
				dd: false,
				ol: false,
				ul: false,
				paragraph: false,
				img: false,
				iframe: false,
				output: false,
				legend: false,
				summary: false,
			});

			expect(result.abbr).toBeUndefined();
			expect(result.body).toBeUndefined();
			expect(result.heading).toBeUndefined();
			expect(result.link).toBeUndefined();
			expect(result.code).toBeUndefined();
			expect(result.selection).toBeUndefined();
			expect(result.focus).toBeUndefined();
			expect(result.hr).toBeUndefined();
			expect(result.kbd).toBeUndefined();
			expect(result.mark).toBeUndefined();
			expect(result.caption).toBeUndefined();
			expect(result.dl).toBeUndefined();
			expect(result.dt).toBeUndefined();
			expect(result.dd).toBeUndefined();
			expect(result.samp).toBeUndefined();
			expect(result.paragraph).toBeUndefined();
			expect(result.ol).toBeUndefined();
			expect(result.ul).toBeUndefined();
			expect(result.pre).toBeUndefined();
			expect(s.root.variables).toHaveLength(0);
			expect(s.root.children).toHaveLength(0);
		});
	});

	describe("custom values", () => {
		it("should use custom body colors", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, {
				body: { color: "#000000", background: "#f0f0f0" },
			});

			expect(result.body?.bodyColor.value).toBe("#000000");
			expect(result.body?.bodyBackground.value).toBe("#f0f0f0");
		});

		it("should use custom heading color", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, {
				heading: { color: "#333333" },
			});

			expect(result.heading?.headingColor.value).toBe("#333333");
		});

		it("should use custom heading sizes", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				heading: { sizes: { h1: "3rem", h2: "2.5rem" } },
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("3rem");
			expect(css).toContain("2.5rem");
		});

		it("should use custom heading font family", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				heading: { fontFamily: "Georgia, serif" },
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("Georgia, serif");
		});

		it("should use custom link colors", () => {
			const s = createInstance();
			const result = useGlobalPreset(s, {
				link: { color: "#0066cc", hoverColor: "#004499" },
			});

			expect(result.link?.linkColor.value).toBe("#0066cc");
			expect(result.link?.linkHoverColor.value).toBe("#004499");
		});

		it("should use custom focus outline values", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				focus: {
					outlineColor: "#ff0000",
					outlineWidth: "3px",
					outlineStyle: "dashed",
					outlineOffset: "4px",
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain("3px");
			expect(css).toContain("dashed");
			expect(css).toContain("4px");
		});
	});

	describe("themes", () => {
		it("should apply theme overrides for body colors", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				themes: {
					dark: {
						body: { color: "#e2e8f0", background: "#0f172a" },
					},
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain('[data-theme="dark"]');
			expect(css).toContain("#e2e8f0");
			expect(css).toContain("#0f172a");
		});

		it("should apply theme overrides for link colors", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				themes: {
					dark: {
						link: { color: "#93c5fd", hoverColor: "#60a5fa" },
					},
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain('[data-theme="dark"]');
			expect(css).toContain("#93c5fd");
			expect(css).toContain("#60a5fa");
		});

		it("should apply theme overrides for heading color", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				themes: {
					dark: {
						heading: { color: "#f1f5f9" },
					},
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain('[data-theme="dark"]');
			expect(css).toContain("#f1f5f9");
		});

		it("should support multiple themes", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				themes: {
					dark: {
						body: { color: "#e2e8f0", background: "#0f172a" },
					},
					high_contrast: {
						body: { color: "#ffffff", background: "#000000" },
					},
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toContain('[data-theme="dark"]');
			expect(css).toContain('[data-theme="high_contrast"]');
		});

		it("should not apply theme overrides for disabled domains", () => {
			const s = createInstance();
			useGlobalPreset(s, {
				body: false,
				themes: {
					dark: {
						body: { color: "#e2e8f0" },
					},
				},
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).not.toContain("--body--color");
		});
	});
});
