import { beforeEach, describe, expect, it } from "vitest";
import type { AtRule, Root, Selector } from "../types";
import {
	createAtRuleFunction,
	createKeyframesFunction,
	createMediaFunction,
} from "./atRule";
import { createRoot } from "./root";
import { createSelectorFunction } from "./selector";
import { createVariableFunction } from "./variable";

// ... existing code ...

describe("createAtRuleFunction", () => {
	let root: Root;
	let selectorInstance: Selector;
	let selector: ReturnType<typeof createSelectorFunction>;
	let atRule: ReturnType<typeof createAtRuleFunction>;

	beforeEach(() => {
		root = createRoot();
		selector = createSelectorFunction(root, root);
		selectorInstance = selector(".test", {});
		atRule = createAtRuleFunction(selectorInstance, root);
	});

	describe("basic at-rule creation", () => {
		it("should create a supports at-rule with callback", () => {
			const result = atRule("supports", "(display: grid)", ({ selector }) => {
				selector(".grid-container", {
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr",
				});
			});

			expect(result).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "supports",
				rule: "(display: grid)",
				variables: [],
				declarations: {},
				children: [
					{
						type: "selector",
						id: expect.any(String),
						parentId: expect.any(String),
						query: ".grid-container",
						variables: [],
						declarations: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
						},
						children: [],
					},
				],
			});
		});

		it("should create a font-face at-rule with declarations", () => {
			const result = atRule("font-face", "", {
				fontFamily: "'Open Sans'",
				src: "url('fonts/OpenSans-Regular.woff2') format('woff2')",
				fontWeight: "normal",
				fontStyle: "normal",
			});

			expect(result).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "font-face",
				rule: "",
				variables: [],
				declarations: {
					fontFamily: "'Open Sans'",
					src: "url('fonts/OpenSans-Regular.woff2') format('woff2')",
					fontWeight: "normal",
					fontStyle: "normal",
				},
				children: [],
			});
		});

		it("should create an import at-rule with empty rule", () => {
			const result = atRule("import", "url('styles.css')", {});

			expect(result).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "import",
				rule: "url('styles.css')",
				variables: [],
				declarations: {},
				children: [],
			});
		});

		it("should add at-rule to parent children", () => {
			const initialChildrenLength = selectorInstance.children.length;

			atRule("charset", "UTF-8", {});

			expect(selectorInstance.children).toHaveLength(initialChildrenLength + 1);

			const lastChild = selectorInstance.children.at(-1) as AtRule;
			expect(lastChild.type).toBe("at-rule");
			expect(lastChild.identifier).toBe("charset");
		});
	});

	describe("supports at-rule tests", () => {
		it("should create a supports at-rule with feature query", () => {
			const result = atRule("supports", "(display: flex)", {
				display: "flex",
				flexDirection: "column",
			});

			expect(result.type).toBe("at-rule");
			expect(result.identifier).toBe("supports");
			expect(result.rule).toBe("(display: flex)");
			expect(result.declarations).toEqual({
				display: "flex",
				flexDirection: "column",
			});
		});

		it("should create a supports at-rule with multiple conditions", () => {
			const result = atRule(
				"supports",
				"(display: grid) and (gap: 1rem)",
				({ selector }) => {
					selector(".modern-grid", {
						display: "grid",
						gap: "1rem",
					});
				},
			);

			expect(result.identifier).toBe("supports");
			expect(result.rule).toBe("(display: grid) and (gap: 1rem)");
			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".modern-grid",
				variables: [],
				declarations: {
					display: "grid",
					gap: "1rem",
				},
				children: [],
			});
		});

		it("should create a supports at-rule with not operator", () => {
			const result = atRule("supports", "not (display: grid)", {
				display: "flex",
			});

			expect(result.identifier).toBe("supports");
			expect(result.rule).toBe("not (display: grid)");
			expect(result.declarations).toEqual({
				display: "flex",
			});
		});
	});

	describe("font-face at-rule tests", () => {
		it("should create a font-face at-rule with multiple font formats", () => {
			const result = atRule("font-face", "", {
				fontFamily: "'My Custom Font'",
				src: "url('fonts/custom.woff2') format('woff2'), url('fonts/custom.woff') format('woff')",
				fontWeight: "700",
				fontStyle: "normal",
				fontDisplay: "swap",
			});

			expect(result.identifier).toBe("font-face");
			expect(result.rule).toBe("");
			expect(result.declarations).toEqual({
				fontFamily: "'My Custom Font'",
				src: "url('fonts/custom.woff2') format('woff2'), url('fonts/custom.woff') format('woff')",
				fontWeight: "700",
				fontStyle: "normal",
				fontDisplay: "swap",
			});
		});

		it("should create a font-face at-rule with unicode-range", () => {
			const result = atRule("font-face", "", {
				fontFamily: "'Noto Sans'",
				src: "url('fonts/NotoSans-Latin.woff2') format('woff2')",
				unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC",
			});

			expect(result.identifier).toBe("font-face");
			expect(result.declarations).toEqual({
				fontFamily: "'Noto Sans'",
				src: "url('fonts/NotoSans-Latin.woff2') format('woff2')",
				unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC",
			});
		});
	});

	describe("container at-rule tests", () => {
		it("should create a container at-rule", () => {
			const result = atRule("container", "", ({ selector }) => {
				selector(".responsive-element", {
					maxWidth: "100%",
				});
			});

			expect(result.identifier).toBe("container");
			expect(result.rule).toBe("");
			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".responsive-element",
				variables: [],
				declarations: {
					maxWidth: "100%",
				},
				children: [],
			});
		});

		it("should create a container at-rule with container name", () => {
			const result = atRule("container", "sidebar (min-width: 768px)", {
				padding: "1rem",
			});

			expect(result.identifier).toBe("container");
			expect(result.rule).toBe("sidebar (min-width: 768px)");
			expect(result.declarations).toEqual({
				padding: "1rem",
			});
		});
	});

	describe("layer at-rule tests", () => {
		it("should create a layer at-rule with declarations", () => {
			const result = atRule("layer", "base", ({ selector }) => {
				selector("body", {
					margin: "0",
					padding: "0",
				});
			});

			expect(result.identifier).toBe("layer");
			expect(result.rule).toBe("base");
			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: "body",
				variables: [],
				declarations: {
					margin: "0",
					padding: "0",
				},
				children: [],
			});
		});

		it("should create a layer at-rule for multiple layers", () => {
			const result = atRule("layer", "utilities, components, base", {});

			expect(result.identifier).toBe("layer");
			expect(result.rule).toBe("utilities, components, base");
			expect(result.declarations).toEqual({});
		});
	});

	describe("property at-rule tests", () => {
		it("should create a property at-rule", () => {
			const result = atRule("property", "--brand-color", {
				syntax: "<color>",
				inherits: "true",
				initialValue: "#1a73e8",
			});

			expect(result.identifier).toBe("property");
			expect(result.rule).toBe("--brand-color");
			expect(result.declarations).toEqual({
				syntax: "<color>",
				inherits: "true",
				initialValue: "#1a73e8",
			});
		});
	});

	describe("page at-rule tests", () => {
		it("should create a page at-rule", () => {
			const result = atRule("page", "", {
				margin: "2cm",
				size: "A4",
			});

			expect(result.identifier).toBe("page");
			expect(result.rule).toBe("");
			expect(result.declarations).toEqual({
				margin: "2cm",
				size: "A4",
			});
		});

		it("should create a page at-rule with pseudo-class", () => {
			const result = atRule("page", ":first", {
				margin: "3cm",
				counterIncrement: "page",
			});

			expect(result.identifier).toBe("page");
			expect(result.rule).toBe(":first");
			expect(result.declarations).toEqual({
				margin: "3cm",
				counterIncrement: "page",
			});
		});

		it("should create a page at-rule with named page", () => {
			const result = atRule("page", "chapter", ({ atRule }) => {
				atRule("top-center", "", {
					content: "string(chapter-title)",
				});
			});

			expect(result.identifier).toBe("page");
			expect(result.rule).toBe("chapter");

			const firstChild = result.children[0] as AtRule;

			expect(firstChild?.type).toBe("at-rule");
			expect(firstChild?.identifier).toBe("top-center");
		});
	});

	describe("complex at-rule nesting", () => {
		it("should support nesting at-rules", () => {
			const result = atRule("supports", "(display: grid)", ({ atRule }) => {
				atRule("media", "(min-width: 768px)", {
					display: "grid",
				});
			});

			expect(result.children[0]).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "media",
				rule: "(min-width: 768px)",
				variables: [],
				declarations: {
					display: "grid",
				},
				children: [],
			});
		});

		it("should support deep nesting with multiple at-rules", () => {
			const result = atRule(
				"supports",
				"(display: grid)",
				({ atRule, selector }) => {
					atRule("media", "(min-width: 768px)", ({ atRule }) => {
						atRule("container", "(min-width: 500px)", {
							display: "grid",
						});
					});

					selector(".fallback", {
						display: "flex",
					});
				},
			);

			const nestedMedia = result.children[0] as AtRule;
			expect(nestedMedia.type).toBe("at-rule");
			expect(nestedMedia.identifier).toBe("media");

			const nestedContainer = nestedMedia.children[0] as AtRule;
			expect(nestedContainer.type).toBe("at-rule");
			expect(nestedContainer.identifier).toBe("container");
			expect(nestedContainer.declarations).toEqual({
				display: "grid",
			});

			const fallbackSelector = result.children[1] as Selector;
			expect(fallbackSelector.type).toBe("selector");
			expect(fallbackSelector.query).toBe(".fallback");
		});
	});

	describe("callback context functions in at-rules", () => {
		it("should provide variable function in context", () => {
			const result = atRule("layer", "theme", ({ variable }) => {
				const color = variable("primary-color", "#0066cc");
				expect(color.name).toBe("primary-color");
				expect(color.value).toBe("#0066cc");

				return {
					backgroundColor: color.value as string,
				};
			});

			expect(result.variables).toHaveLength(1);
			expect(result.declarations).toEqual({
				backgroundColor: "#0066cc",
			});
		});
	});
});

describe("createMediaFunction", () => {
	let root: Root;
	let selector: Selector;
	let media: ReturnType<typeof createMediaFunction>;
	let variable: ReturnType<typeof createVariableFunction>;

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
		media = createMediaFunction(selector, root);
		variable = createVariableFunction(root, root);
	});

	describe("basic media query creation", () => {
		it("should create a media query with callback only", () => {
			const result = media("(min-width: 768px)", ({ selector }) => {
				selector(".container", {
					width: "750px",
				});
			});

			expect(result).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "media",
				rule: "(min-width: 768px)",
				variables: [],
				declarations: {},
				children: [
					{
						type: "selector",
						id: expect.any(String),
						parentId: expect.any(String),
						query: ".container",
						variables: [],
						declarations: {
							width: "750px",
						},
						children: [],
					},
				],
			});
		});

		it("should create a media query with declarations and callback", () => {
			const result = media("(min-width: 768px)", ({ selector }) => {
				selector(".text", {
					lineHeight: "1.4",
				});

				return {
					fontSize: "18px",
				};
			});

			expect(result.type).toBe("at-rule");
			expect(result.identifier).toBe("media");
			expect(result.rule).toBe("(min-width: 768px)");
			expect(result.declarations).toEqual({
				fontSize: "18px",
			});
			expect(result.children).toHaveLength(1);
			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".text",
				variables: [],
				declarations: {
					lineHeight: "1.4",
				},
				children: [],
			});
		});

		it("should create a media query with declarations only", () => {
			const result = media("(max-width: 767px)", {
				fontSize: "14px",
				padding: "0.5rem",
			});

			expect(result).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "media",
				rule: "(max-width: 767px)",
				variables: [],
				declarations: {
					fontSize: "14px",
					padding: "0.5rem",
				},
				children: [],
			});
		});

		it("should add media query to context children", () => {
			const initialChildrenLength = selector.children.length;

			media("(min-width: 1024px)", {
				width: "980px",
			});

			expect(selector.children).toHaveLength(initialChildrenLength + 1);

			const lastChild = selector.children.at(-1) as AtRule;
			expect(lastChild.type).toBe("at-rule");
		});
	});

	describe("context parameter handling", () => {
		it("should work with root context", () => {
			const mediaWithRootContext = createMediaFunction(root, root);

			const result = mediaWithRootContext(
				"(min-width: 768px)",
				({ selector }) => {
					selector(".root-selector", {
						margin: "0 auto",
					});
				},
			);

			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".root-selector",
				variables: [],
				declarations: {
					margin: "0 auto",
				},
				children: [],
			});
		});

		it("should work with selector context", () => {
			const mediaWithSelectorContext = createMediaFunction(selector, root);

			const result = mediaWithSelectorContext("(min-width: 768px)", {
				padding: "2rem",
			});

			expect(result.declarations).toEqual({
				padding: "2rem",
			});
		});
	});

	describe("callback context functions", () => {
		it("should provide variable function in context", () => {
			media("(min-width: 768px)", ({ variable }) => {
				const testVar = variable("test-media-var", "2rem");
				expect(testVar.name).toBe("test-media-var");
				expect(testVar.value).toBe("2rem");
			});
		});

		it("should provide selector function in context", () => {
			const result = media("(min-width: 768px)", ({ selector }) => {
				selector(".media-selector", {
					display: "block",
				});
			});

			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".media-selector",
				variables: [],
				declarations: {
					display: "block",
				},
				children: [],
			});
		});

		it("should provide nested media function in context", () => {
			const result = media("(min-width: 768px)", ({ media }) => {
				media("(orientation: landscape)", {
					width: "100vw",
				});
			});

			expect(result.children[0]).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "media",
				rule: "(orientation: landscape)",
				variables: [],
				declarations: {
					width: "100vw",
				},
				children: [],
			});
		});

		it("should allow chaining multiple context functions", () => {
			const result = media("(min-width: 768px)", ({ variable, selector }) => {
				const spacing = variable("media-spacing", "2rem");

				selector(".spaced", {
					margin: spacing.value as string,
				});
			});

			expect(result.children).toHaveLength(1); // selector
			expect(result.variables).toHaveLength(1); // variable
		});
	});

	describe("media query strings", () => {
		it("should handle simple min-width queries", () => {
			const result = media("(min-width: 768px)", {});

			expect(result.rule).toBe("(min-width: 768px)");
		});

		it("should handle complex media queries", () => {
			const complexQuery =
				"(min-width: 768px) and (max-width: 1023px) and (orientation: landscape)";
			const result = media(complexQuery, {});

			expect(result.rule).toBe(complexQuery);
		});

		it("should handle feature queries", () => {
			const result = media("(prefers-color-scheme: dark)", {
				backgroundColor: "#1a1a1a",
			});

			expect(result.rule).toBe("(prefers-color-scheme: dark)");
			expect(result.declarations.backgroundColor).toBe("#1a1a1a");
		});

		it("should handle resolution queries", () => {
			const result = media(
				"(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
				{
					backgroundImage: 'url("image@2x.png")',
				},
			);

			expect(result.rule).toBe(
				"(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
			);
			// A retina URL's mid-token @ must stay a literal string, not parse as
			// a reference (no throw, no dead var(--2x--png)). See SF-33.
			expect(result.declarations.backgroundImage).toBe('url("image@2x.png")');
		});

		it("should handle empty query string", () => {
			const result = media("", {
				display: "none",
			});

			expect(result.rule).toBe("");
		});
	});

	describe("nested media queries", () => {
		it("should support nesting media queries", () => {
			const result = media("(min-width: 768px)", ({ media }) => {
				media("(orientation: portrait)", {
					width: "100%",
				});
			});

			expect(result.children[0]).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "media",
				rule: "(orientation: portrait)",
				variables: [],
				declarations: {
					width: "100%",
				},
				children: [],
			});
		});

		it("should support deep nesting", () => {
			const result = media("(min-width: 768px)", ({ media }) => {
				media("(max-width: 1023px)", ({ selector }) => {
					selector(".nested-selector", {
						padding: "1rem",
					});
				});
			});

			const nestedMedia = result.children[0] as AtRule;
			expect(nestedMedia.type).toBe("at-rule");
			expect(nestedMedia.identifier).toBe("media");
			expect(nestedMedia.rule).toBe("(max-width: 1023px)");
			expect(nestedMedia.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".nested-selector",
				variables: [],
				declarations: {
					padding: "1rem",
				},
				children: [],
			});
		});
	});

	describe("declarations handling", () => {
		it("should handle empty declarations", () => {
			const result = media("(min-width: 768px)", {});

			expect(result.declarations).toEqual({});
		});

		it("should handle single declaration", () => {
			const result = media("(min-width: 768px)", {
				width: "750px",
			});

			expect(result.declarations).toEqual({
				width: "750px",
			});
		});

		it("should handle multiple declarations", () => {
			const result = media("(min-width: 768px)", {
				width: "750px",
				margin: "0 auto",
				padding: "2rem",
			});

			expect(result.declarations).toEqual({
				width: "750px",
				margin: "0 auto",
				padding: "2rem",
			});
		});

		it("should handle CSS custom properties", () => {
			const result = media("(min-width: 768px)", {
				"--primary-color": "#006cff",
				"--spacing": "2rem",
			});

			expect(result.declarations).toEqual({
				"--primary-color": "#006cff",
				"--spacing": "2rem",
			});
		});
	});

	describe("real-world usage patterns", () => {
		it("should support responsive typography", () => {
			const result = media("(min-width: 768px)", ({ selector }) => {
				selector(".responsive-text", {
					fontSize: "18px",
					lineHeight: "1.4",
				});
			});

			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".responsive-text",
				variables: [],
				declarations: {
					fontSize: "18px",
					lineHeight: "1.4",
				},
				children: [],
			});
		});

		it("should support responsive grid layouts", () => {
			const result = media("(min-width: 1024px)", ({ selector }) => {
				selector(".grid", {
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "2rem",
				});
			});

			expect(result.children[0]).toEqual({
				type: "selector",
				id: expect.any(String),
				parentId: expect.any(String),
				query: ".grid",
				variables: [],
				declarations: {
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "2rem",
				},
				children: [],
			});
		});

		it("should support breakpoint variables", () => {
			const breakpointMd = variable("breakpoint-md", "768px");

			const result = media(
				`(min-width: ${breakpointMd.value})`,
				({ selector, variable }) => {
					const spacing = variable("tablet-spacing", "1.5rem");
					selector(".responsive-container", {
						padding: spacing.value as string,
					});
				},
			);

			expect(result.children).toHaveLength(1); // selector
			expect(result.variables).toHaveLength(1); // variable
		});

		it("should support dark mode queries", () => {
			const result = media("(prefers-color-scheme: dark)", ({ selector }) => {
				selector(".theme-aware", {
					backgroundColor: "#1a1a1a",
					color: "#ffffff",
				});
			});

			expect(result.rule).toBe("(prefers-color-scheme: dark)");
		});

		it("should support reduced motion queries", () => {
			const result = media(
				"(prefers-reduced-motion: reduce)",
				({ selector }) => {
					selector(".animated", {
						animation: "none",
						transition: "none",
					});
				},
			);

			expect(result.rule).toBe("(prefers-reduced-motion: reduce)");
		});
	});

	describe("function overloading", () => {
		it("should distinguish between callback and declarations as second parameter", () => {
			const callbackResult = media("(min-width: 768px)", ({ selector }) => {
				selector(".callback-test", { width: "100%" });
			});

			const declarationsResult = media("(min-width: 768px)", {
				width: "750px",
			});

			expect(callbackResult.declarations).toEqual({});
			expect(callbackResult.children).toHaveLength(1);

			expect(declarationsResult.declarations).toEqual({ width: "750px" });
			expect(declarationsResult.children).toHaveLength(0);
		});

		it("should handle three-parameter form correctly", () => {
			const result = media("(min-width: 768px)", ({ selector }) => {
				selector(".three-param-test", {
					lineHeight: "1.4",
				});

				return {
					fontSize: "18px",
				};
			});

			expect(result.declarations).toEqual({ fontSize: "18px" });
			expect(result.children).toHaveLength(1);
		});
	});

	describe("edge cases", () => {
		it("should handle multiple media queries with same query string", () => {
			const result1 = media("(min-width: 768px)", { width: "750px" });
			const result2 = media("(min-width: 768px)", { height: "100vh" });

			expect(result1).not.toBe(result2);
			expect(result1.rule).toBe(result2.rule);
			expect(result1.declarations).not.toEqual(result2.declarations);
		});

		it("should maintain proper structure with empty callback", () => {
			const result = media("(min-width: 768px)", () => {
				// Empty callback
			});

			expect(result).toEqual({
				type: "at-rule",
				id: expect.any(String),
				parentId: expect.any(String),
				identifier: "media",
				rule: "(min-width: 768px)",
				variables: [],
				declarations: {},
				children: [],
			});
		});

		it("should handle special characters in media queries", () => {
			const complexQuery =
				"screen and (min-width: 768px) and (max-width: 1023.98px)";
			const result = media(complexQuery, {});

			expect(result.rule).toBe(complexQuery);
		});
	});

	describe("function context independence", () => {
		it("should create independent functions for different contexts", () => {
			const context1 = createRoot();
			const context2: Selector = {
				type: "selector",
				id: "test-id",
				query: ".different",
				variables: [],
				declarations: {},
				children: [],
			};

			const media1 = createMediaFunction(context1, root);
			const media2 = createMediaFunction(context2, root);

			const result1 = media1("(min-width: 768px)", { width: "100%" });
			const result2 = media2("(min-width: 768px)", { width: "750px" });

			expect(media1).not.toBe(media2);
			expect(result1.declarations).not.toEqual(result2.declarations);
		});
	});
});

describe("createKeyframesFunction", () => {
	let root: Root;
	let keyframes: ReturnType<typeof createKeyframesFunction>;
	let selector: ReturnType<typeof createSelectorFunction>;

	beforeEach(() => {
		root = createRoot();
		keyframes = createKeyframesFunction(root, root);
		selector = createSelectorFunction(root, root);
	});

	it("should create keyframes with the correct structure", () => {
		const fadeInKeyframes = keyframes("fade-in", {
			"0%": {
				opacity: 0,
				transform: "translateY(20px)",
			},
			"100%": {
				opacity: 1,
				transform: "translateY(0)",
			},
		});

		expect(fadeInKeyframes.type).toBe("at-rule");
		expect(fadeInKeyframes.identifier).toBe("keyframes");
		expect(fadeInKeyframes.rule).toBe("fade-in");
		expect(fadeInKeyframes.declarations).toEqual({});
		expect(fadeInKeyframes.children).toHaveLength(2);
		expect(fadeInKeyframes.children[0]).toMatchObject({
			type: "selector",
			query: "0%",
			declarations: { opacity: 0, transform: "translateY(20px)" },
		});
		expect(fadeInKeyframes.children[1]).toMatchObject({
			type: "selector",
			query: "100%",
			declarations: { opacity: 1, transform: "translateY(0)" },
		});

		expect(root.children).toContain(fadeInKeyframes);
	});

	it("should support multiple keyframe stops", () => {
		const bounceKeyframes = keyframes("bounce", {
			"0%": {
				transform: "translateY(0)",
				animationTimingFunction: "ease-out",
			},
			"25%": {
				transform: "translateY(-20px)",
				animationTimingFunction: "ease-in",
			},
			"50%": {
				transform: "translateY(0)",
				animationTimingFunction: "ease-out",
			},
			"75%": {
				transform: "translateY(-10px)",
				animationTimingFunction: "ease-in",
			},
			"100%": {
				transform: "translateY(0)",
				animationTimingFunction: "ease-out",
			},
		});

		expect(bounceKeyframes.children).toHaveLength(5);
		expect(bounceKeyframes.children[0]).toMatchObject({ query: "0%" });
		expect(bounceKeyframes.children[1]).toMatchObject({ query: "25%" });
		expect(bounceKeyframes.children[2]).toMatchObject({ query: "50%" });
		expect(bounceKeyframes.children[3]).toMatchObject({ query: "75%" });
		expect(bounceKeyframes.children[4]).toMatchObject({ query: "100%" });
	});

	it("should be accessible in the declarations context", () => {
		selector(".test", ({ keyframes }) => {
			const fadeIn = keyframes("fade-in", {
				"0%": { opacity: 0 },
				"100%": { opacity: 1 },
			});

			expect(fadeIn.type).toBe("at-rule");
			expect(fadeIn.identifier).toBe("keyframes");
			expect(fadeIn.rule).toBe("fade-in");
			expect(fadeIn.declarations).toEqual({});
			expect(fadeIn.children).toHaveLength(2);
			expect(fadeIn.children[0]).toMatchObject({
				type: "selector",
				query: "0%",
				declarations: { opacity: 0 },
			});
			expect(fadeIn.children[1]).toMatchObject({
				type: "selector",
				query: "100%",
				declarations: { opacity: 1 },
			});
		});
	});
});
