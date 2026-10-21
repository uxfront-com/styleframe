import type { Styleframe, StyleframeOptions } from "@styleframe/core";
import { registerRecipeUtilities } from "@styleframe/core";
import {
	createAtRuleFunction,
	createCssFunction,
	createRecipeFunction,
	createRefFunction,
	createSelectorFunction,
	createThemeFunction,
	createUtilityFunction,
	createVariableFunction,
	styleframe,
} from "@styleframe/core";
import { createFile, transpile } from "./transpile";

describe("transpile", () => {
	let instance: Styleframe;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;
	let css: ReturnType<typeof createCssFunction>;
	let selector: ReturnType<typeof createSelectorFunction>;
	let theme: ReturnType<typeof createThemeFunction>;
	let atRule: ReturnType<typeof createAtRuleFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;
	let recipe: ReturnType<typeof createRecipeFunction>;

	beforeEach(() => {
		instance = styleframe();
		({
			variable = variable,
			ref = ref,
			css = css,
			selector = selector,
			theme = theme,
			atRule = atRule,
			utility = utility,
			recipe = recipe,
		} = instance);
	});

	describe("createFile", () => {
		it("should create a file with name and content", () => {
			const file = createFile("test.css", "body { margin: 0; }");

			expect(file.name).toBe("test.css");
			expect(file.content).toEqual("body { margin: 0; }");
		});

		it("should create a file with empty content when no content provided", () => {
			const file = createFile("empty.css");

			expect(file.name).toBe("empty.css");
			expect(file.content).toEqual("");
		});

		it("should create a file with content string", () => {
			const content = ":root {\n\t--color: #000;\n}";
			const file = createFile("variables.css", content);

			expect(file.name).toBe("variables.css");
			expect(file.content).toEqual(content);
		});
	});

	describe("transpile", () => {
		it("should transpile an empty Styleframe instance", async () => {
			const output = await transpile(instance);

			expect(output.files).toHaveLength(2);
			expect(output.files[0]!.name).toBe("index.css");
			expect(output.files[0]!.content).toEqual("");
			expect(output.files[1]!.name).toBe("index.ts");
			expect(output.files[1]!.content).toEqual("");
		});

		it("should transpile a simple variable", async () => {
			variable("primary-color", "#006cff");

			const output = await transpile(instance);

			expect(output.files).toHaveLength(2);
			expect(output.files[0]!.name).toBe("index.css");
			expect(output.files[0]!.content).toEqual(`:root {
\t--primary-color: #006cff;
}`);
			expect(output.files[1]!.name).toBe("index.ts");
			expect(output.files[1]!.content).toEqual("");
		});

		it("should transpile multiple variables", async () => {
			variable("primary-color", "#006cff");
			variable("secondary-color", "#ff6c00");
			variable("font-size", "16px");

			const output = await transpile(instance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`:root {
\t--primary-color: #006cff;
\t--secondary-color: #ff6c00;
\t--font-size: 16px;
}`);
		});

		it("should transpile selectors", async () => {
			selector(".button", {
				padding: "0.5rem 1rem",
				backgroundColor: "#006cff",
				color: "#ffffff",
			});

			const output = await transpile(instance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`.button {
\tpadding: 0.5rem 1rem;
\tbackground-color: #006cff;
\tcolor: #ffffff;
}`);
		});

		it("should transpile themes", async () => {
			theme("light", ({ variable: v }) => {
				v("background-color", "#ffffff");
				v("text-color", "#000000");
			});

			theme("dark", ({ variable: v }) => {
				v("background-color", "#000000");
				v("text-color", "#ffffff");
			});

			const output = await transpile(instance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`

.light-theme, [data-theme="light"] {
\t--background-color: #ffffff;
\t--text-color: #000000;
}

.dark-theme, [data-theme="dark"] {
\t--background-color: #000000;
\t--text-color: #ffffff;
}`);
		});

		it("should transpile at-rules", async () => {
			atRule("media", "(min-width: 768px)", ({ selector: s }) => {
				s(".container", {
					maxWidth: "1200px",
					margin: "0 auto",
				});
			});

			const output = await transpile(instance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`@media (min-width: 768px) {
\t.container {
\t\tmax-width: 1200px;
\t\tmargin: 0 auto;
\t}
}`);
		});

		it("should transpile utilities", async () => {
			const createMarginUtility = utility("margin", ({ value }) => ({
				margin: value,
			}));

			createMarginUtility({
				sm: "8px",
				md: "16px",
				lg: "24px",
			});

			const output = await transpile(instance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`._margin\\:sm {
\tmargin: 8px;
}

._margin\\:md {
\tmargin: 16px;
}

._margin\\:lg {
\tmargin: 24px;
}`);
		});

		it("should transpile with custom options", async () => {
			const customOptions: StyleframeOptions = {
				variables: {
					name: ({ name }) => `--app-${name}`,
				},
			};

			const customInstance = styleframe(customOptions);
			const customRoot = customInstance.root;
			const customVariable = createVariableFunction(customRoot, customRoot);

			customVariable("primary", "#006cff");
			customVariable("secondary", "#ff6c00");

			const output = await transpile(customInstance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`:root {
\t--app-primary: #006cff;
\t--app-secondary: #ff6c00;
}`);
		});

		it("should handle variable references", async () => {
			const primaryColor = variable("primary-color", "#006cff");

			selector(".button", {
				backgroundColor: ref(primaryColor),
				border: css`2px solid ${ref(primaryColor)}`,
			});

			const output = await transpile(instance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`:root {
\t--primary-color: #006cff;
}

.button {
\tbackground-color: var(--primary-color);
\tborder: 2px solid var(--primary-color);
}`);
		});

		it("should handle nested selectors", async () => {
			selector(".card", ({ selector: s }) => {
				s(".title", {
					fontSize: "1.5rem",
					fontWeight: "bold",
				});

				s("&:hover", {
					transform: "translateY(-2px)",
					boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
				});

				return {
					padding: "1rem",
					borderRadius: "8px",
				};
			});

			const output = await transpile(instance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`.card {
\tpadding: 1rem;
\tborder-radius: 8px;
\t
\t.title {
\t\tfont-size: 1.5rem;
\t\tfont-weight: bold;
\t}
\t
\t&:hover {
\t\ttransform: translateY(-2px);
\t\tbox-shadow: 0 4px 8px rgba(0,0,0,0.1);
\t}
}`);
		});

		it("should transpile a complex scenario with utilities, modifiers, themes, and nested structures", async () => {
			// Define global variables
			const primaryColor = variable("primary-color", "#006cff");
			const secondaryColor = variable("secondary-color", "#ff6c00");
			variable("font-family", "'Inter', sans-serif");
			variable("spacing-unit", "8px");

			// Create utilities
			const createPaddingUtility = utility("padding", ({ value }) => ({
				padding: value,
			}));

			const createFlexUtility = utility("flex", ({ value }) => ({
				display: "flex",
				flexDirection: value,
			}));

			createPaddingUtility({
				sm: "8px",
				md: "16px",
				lg: "24px",
				xl: "32px",
			});

			createFlexUtility({
				row: "row",
				col: "column",
			});

			// Create base styles
			selector("*", {
				boxSizing: "border-box",
				margin: "0",
				padding: "0",
			});

			selector("body", {
				fontFamily: ref("font-family"),
				lineHeight: "1.6",
			});

			// Create component styles with nested selectors and modifiers
			selector(".button", ({ selector: s, variable: v }) => {
				v("button-bg", ref(primaryColor));
				v("button-hover-bg", ref(secondaryColor));

				s("&:hover", {
					backgroundColor: ref("button-hover-bg"),
					transform: "scale(1.05)",
				});

				s("&:active", {
					transform: "scale(0.98)",
				});

				s("&.button--large", {
					padding: "1rem 2rem",
					fontSize: "1.125rem",
				});

				s("&.button--disabled", {
					opacity: "0.5",
					cursor: "not-allowed",
				});

				s(".button__icon", {
					marginRight: "0.5rem",
					verticalAlign: "middle",
				});

				return {
					backgroundColor: ref("button-bg"),
					color: "#ffffff",
					padding: "0.75rem 1.5rem",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
					transition: "all 0.3s ease",
					fontSize: "1rem",
				};
			});

			// Create card component with complex nesting
			selector(".card", ({ selector: s, variable: v }) => {
				v("card-shadow", "0 2px 8px rgba(0,0,0,0.1)");
				v("card-bg", "#ffffff");

				s(".card__header", ({ selector: nested }) => {
					nested(".card__title", {
						fontSize: "1.5rem",
						fontWeight: "600",
						color: ref(primaryColor),
					});

					nested(".card__subtitle", {
						fontSize: "0.875rem",
						color: "#666666",
						marginTop: "0.25rem",
					});

					return {
						padding: "1.5rem",
						borderBottom: "1px solid #e0e0e0",
					};
				});

				s(".card__body", {
					padding: "1.5rem",
				});

				s(".card__footer", ({ selector: nested }) => {
					nested(".button", {
						marginRight: "0.5rem",
					});

					return {
						padding: "1rem 1.5rem",
						borderTop: "1px solid #e0e0e0",
						display: "flex",
						justifyContent: "flex-end",
					};
				});

				s("&:hover", {
					boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
					transform: "translateY(-2px)",
				});

				return {
					backgroundColor: ref("card-bg"),
					boxShadow: ref("card-shadow"),
					borderRadius: "8px",
					overflow: "hidden",
					transition: "all 0.3s ease",
				};
			});

			// Create themes with overrides
			theme("light", ({ variable: v, selector: s }) => {
				v("bg-primary", "#ffffff");
				v("bg-secondary", "#f5f5f5");
				v("text-primary", "#1a1a1a");
				v("text-secondary", "#666666");
				v("border-color", "#e0e0e0");

				s(".card", ({ variable: cardVar }) => {
					cardVar("card-bg", ref("bg-primary"));
					cardVar("card-shadow", "0 2px 8px rgba(0,0,0,0.08)");
				});

				s(".button", ({ variable: btnVar }) => {
					btnVar("button-bg", ref(primaryColor));
				});
			});

			theme("dark", ({ variable: v, selector: s }) => {
				v("bg-primary", "#1a1a1a");
				v("bg-secondary", "#2d2d2d");
				v("text-primary", "#ffffff");
				v("text-secondary", "#b0b0b0");
				v("border-color", "#404040");

				s("body", {
					backgroundColor: ref("bg-primary"),
					color: ref("text-primary"),
				});

				s(".card", ({ variable: cardVar }) => {
					cardVar("card-bg", ref("bg-secondary"));
					cardVar("card-shadow", "0 2px 8px rgba(0,0,0,0.3)");

					return {
						borderColor: ref("border-color"),
					};
				});

				s(".button", ({ variable: btnVar }) => {
					btnVar("button-bg", "#0080ff");
					btnVar("button-hover-bg", "#0066cc");
				});
			});

			// Create responsive at-rules
			atRule("media", "(min-width: 768px)", ({ selector: s }) => {
				s(".container", {
					maxWidth: "768px",
					margin: "0 auto",
					padding: "0 1rem",
				});

				s(".card", {
					maxWidth: "600px",
				});
			});

			atRule("media", "(min-width: 1024px)", ({ selector: s }) => {
				s(".container", {
					maxWidth: "1024px",
				});

				s(".grid", {
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "1.5rem",
				});
			});

			// Create print styles
			atRule("media", "print", ({ selector: s }) => {
				s("body", {
					backgroundColor: "#ffffff",
					color: "#000000",
				});

				s(".button", {
					display: "none",
				});

				s(".card", {
					boxShadow: "none",
					border: "1px solid #000000",
				});
			});

			// Create animation keyframes
			atRule("keyframes", "fadeIn", {
				"0%": {
					opacity: "0",
				},
				"100%": {
					opacity: "1",
				},
			});

			atRule("keyframes", "slideUp", {
				"0%": {
					transform: "translateY(20px)",
					opacity: "0",
				},
				"100%": {
					transform: "translateY(0)",
					opacity: "1",
				},
			});

			// Create animation classes using the keyframes
			selector(".fade-in", {
				animation: "fadeIn 0.3s ease-in-out",
			});

			selector(".slide-up", {
				animation: "slideUp 0.5s ease-out",
			});

			// Transpile the complex scenario
			const output = await transpile(instance);

			expect(output.files).toHaveLength(2);
			expect(output.files[0]!.name).toBe("index.css");

			const content = output.files[0]!.content;

			// This is a complex test that validates the structure is correct
			// Note: The order of items matters - atRules and keyframes come before themes in the output
			expect(content).toEqual(`:root {
\t--primary-color: #006cff;
\t--secondary-color: #ff6c00;
\t--font-family: 'Inter', sans-serif;
\t--spacing-unit: 8px;
}

._padding\\:sm {
\tpadding: 8px;
}

._padding\\:md {
\tpadding: 16px;
}

._padding\\:lg {
\tpadding: 24px;
}

._padding\\:xl {
\tpadding: 32px;
}

._flex\\:row {
\tdisplay: flex;
\tflex-direction: row;
}

._flex\\:col {
\tdisplay: flex;
\tflex-direction: column;
}

* {
\tbox-sizing: border-box;
\tmargin: 0;
\tpadding: 0;
}

body {
\tfont-family: var(--font-family);
\tline-height: 1.6;
}

.button {
\t--button-bg: var(--primary-color);
\t--button-hover-bg: var(--secondary-color);
\t
\tbackground-color: var(--button-bg);
\tcolor: #ffffff;
\tpadding: 0.75rem 1.5rem;
\tborder: none;
\tborder-radius: 4px;
\tcursor: pointer;
\ttransition: all 0.3s ease;
\tfont-size: 1rem;
\t
\t&:hover {
\t\tbackground-color: var(--button-hover-bg);
\t\ttransform: scale(1.05);
\t}
\t
\t&:active {
\t\ttransform: scale(0.98);
\t}
\t
\t&.button--large {
\t\tpadding: 1rem 2rem;
\t\tfont-size: 1.125rem;
\t}
\t
\t&.button--disabled {
\t\topacity: 0.5;
\t\tcursor: not-allowed;
\t}
\t
\t.button__icon {
\t\tmargin-right: 0.5rem;
\t\tvertical-align: middle;
\t}
}

.card {
\t--card-shadow: 0 2px 8px rgba(0,0,0,0.1);
\t--card-bg: #ffffff;
\t
\tbackground-color: var(--card-bg);
\tbox-shadow: var(--card-shadow);
\tborder-radius: 8px;
\toverflow: hidden;
\ttransition: all 0.3s ease;
\t
\t.card__header {
\t\tpadding: 1.5rem;
\t\tborder-bottom: 1px solid #e0e0e0;
\t\t
\t\t.card__title {
\t\t\tfont-size: 1.5rem;
\t\t\tfont-weight: 600;
\t\t\tcolor: var(--primary-color);
\t\t}
\t\t
\t\t.card__subtitle {
\t\t\tfont-size: 0.875rem;
\t\t\tcolor: #666666;
\t\t\tmargin-top: 0.25rem;
\t\t}
\t}
\t
\t.card__body {
\t\tpadding: 1.5rem;
\t}
\t
\t.card__footer {
\t\tpadding: 1rem 1.5rem;
\t\tborder-top: 1px solid #e0e0e0;
\t\tdisplay: flex;
\t\tjustify-content: flex-end;
\t\t
\t\t.button {
\t\t\tmargin-right: 0.5rem;
\t\t}
\t}
\t
\t&:hover {
\t\tbox-shadow: 0 4px 16px rgba(0,0,0,0.15);
\t\ttransform: translateY(-2px);
\t}
}

@media (min-width: 768px) {
\t.container {
\t\tmax-width: 768px;
\t\tmargin: 0 auto;
\t\tpadding: 0 1rem;
\t}
\t
\t.card {
\t\tmax-width: 600px;
\t}
}

@media (min-width: 1024px) {
\t.container {
\t\tmax-width: 1024px;
\t}
\t
\t.grid {
\t\tdisplay: grid;
\t\tgrid-template-columns: repeat(3, 1fr);
\t\tgap: 1.5rem;
\t}
}

@media print {
\tbody {
\t\tbackground-color: #ffffff;
\t\tcolor: #000000;
\t}
\t
\t.button {
\t\tdisplay: none;
\t}
\t
\t.card {
\t\tbox-shadow: none;
\t\tborder: 1px solid #000000;
\t}
}

@keyframes fadeIn {
\t0% {
\t\topacity: 0;
\t}
\t
\t100% {
\t\topacity: 1;
\t}
}

@keyframes slideUp {
\t0% {
\t\ttransform: translateY(20px);
\t\topacity: 0;
\t}
\t
\t100% {
\t\ttransform: translateY(0);
\t\topacity: 1;
\t}
}

.fade-in {
\tanimation: fadeIn 0.3s ease-in-out;
}

.slide-up {
\tanimation: slideUp 0.5s ease-out;
}

.light-theme, [data-theme="light"] {
\t--bg-primary: #ffffff;
\t--bg-secondary: #f5f5f5;
\t--text-primary: #1a1a1a;
\t--text-secondary: #666666;
\t--border-color: #e0e0e0;
\t
\t.card {
\t\t--card-bg: var(--bg-primary);
\t\t--card-shadow: 0 2px 8px rgba(0,0,0,0.08);
\t}
\t
\t.button {
\t\t--button-bg: var(--primary-color);
\t}
}

.dark-theme, [data-theme="dark"] {
\t--bg-primary: #1a1a1a;
\t--bg-secondary: #2d2d2d;
\t--text-primary: #ffffff;
\t--text-secondary: #b0b0b0;
\t--border-color: #404040;
\t
\tbody {
\t\tbackground-color: var(--bg-primary);
\t\tcolor: var(--text-primary);
\t}
\t
\t.card {
\t\t--card-bg: var(--bg-secondary);
\t\t--card-shadow: 0 2px 8px rgba(0,0,0,0.3);
\t\t
\t\tborder-color: var(--border-color);
\t}
\t
\t.button {
\t\t--button-bg: #0080ff;
\t\t--button-hover-bg: #0066cc;
\t}
}`);
		});

		it("should maintain output file structure", async () => {
			variable("test", "value");
			selector(".test", { color: "red" });

			const output = await transpile(instance);

			expect(output).toHaveProperty("files");
			expect(Array.isArray(output.files)).toBe(true);
			expect(output.files[0]!).toHaveProperty("name");
			expect(output.files[0]!).toHaveProperty("content");
			expect(typeof output.files[0]!.content).toBe("string");

			const content = output.files[0]!.content;
			expect(content).toEqual(`:root {
\t--test: value;
}

.test {
\tcolor: red;
}`);
		});

		it("should pass options to consume function", async () => {
			const customOptions: StyleframeOptions = {
				variables: {
					name: ({ name }) => `--custom-${name}`,
				},
			};

			const customInstance = styleframe(customOptions);
			const customRoot = customInstance.root;
			const customVariable = createVariableFunction(customRoot, customRoot);
			const customUtility = createUtilityFunction(customRoot, customRoot);

			customVariable("color", "#123456");

			const createSpacingUtility = customUtility("space", ({ value }) => ({
				marginBottom: value,
			}));

			createSpacingUtility({
				small: "4px",
				large: "16px",
			});

			const output = await transpile(customInstance);
			const content = output.files[0]!.content;

			expect(content).toEqual(`:root {
\t--custom-color: #123456;
}

._space\\:small {
\tmargin-bottom: 4px;
}

._space\\:large {
\tmargin-bottom: 16px;
}`);
		});
	});

	describe("dts output", () => {
		it("should produce styleframe.d.ts and shims.d.ts", async () => {
			recipe({
				name: "badge",
				base: {},
				variants: { color: { primary: {}, secondary: {} } },
			});

			const output = await transpile(instance, { type: "dts" });

			expect(output.files.map((f) => f.name)).toEqual([
				"styleframe.d.ts",
				"shims.d.ts",
			]);
		});

		it("should produce styleframe.d.ts with top-level exports", async () => {
			recipe({
				name: "badge",
				base: {},
				variants: { color: { primary: {}, secondary: {} } },
			});

			const output = await transpile(instance, { type: "dts" });
			const types = output.files.find((f) => f.name === "styleframe.d.ts");

			expect(types!.content)
				.toEqual(`// Auto-generated by @styleframe/plugin - DO NOT EDIT
import type { Styleframe } from "@styleframe/core";

export function styleframe(): Styleframe;

export type BadgeProps = { color?: "primary" | "secondary" };
export const badge: (props?: BadgeProps) => string;
`);
		});

		it("should produce shims.d.ts with the ambient virtual:styleframe and virtual:styleframe.css modules", async () => {
			recipe({
				name: "badge",
				base: {},
				variants: { color: { primary: {}, secondary: {} } },
			});

			const output = await transpile(instance, { type: "dts" });
			const shims = output.files.find((f) => f.name === "shims.d.ts");

			expect(shims!.content)
				.toEqual(`// Auto-generated by @styleframe/plugin - DO NOT EDIT
declare module "virtual:styleframe" {
\timport type { Styleframe } from "@styleframe/core";

\texport function styleframe(): Styleframe;

\texport type BadgeProps = { color?: "primary" | "secondary" };
\texport const badge: (props?: BadgeProps) => string;
}

declare module "virtual:styleframe.css" {
\tconst css: string;
\texport default css;
}
`);
		});

		it("should keep the ambient virtual:styleframe in shims.d.ts in sync with styleframe.d.ts", async () => {
			recipe({
				name: "badge",
				base: {},
				variants: { color: { primary: {}, secondary: {} } },
			});

			const output = await transpile(instance, { type: "dts" });
			const types = output.files.find((f) => f.name === "styleframe.d.ts");
			const shims = output.files.find((f) => f.name === "shims.d.ts");

			// Body of styleframe.d.ts without its header line.
			const typesBody = types!.content
				.split("\n")
				.slice(1)
				.join("\n")
				.trimEnd();

			// Body of the ambient `virtual:styleframe` block in shims.d.ts,
			// stripped of the `declare module` wrapper and one indent level.
			const match = shims!.content.match(
				/declare module "virtual:styleframe" \{\n([\s\S]*?)\n\}/,
			);
			const ambientBody = match![1]!
				.split("\n")
				.map((line) => line.replace(/^\t/, ""))
				.join("\n")
				.trimEnd();

			expect(ambientBody).toEqual(typesBody);
		});
	});

	describe("with treeshake", () => {
		const cssBlock = (content: string): string => {
			const match = content.match(/^:root \{([\s\S]*?)\n\}/);
			return match ? match[1]! : "";
		};

		it("keeps variables referenced via ref() inside a selector", async () => {
			const used = variable("used", "#0066ff");
			variable("unused", "#ff0000");
			selector(".btn", { color: ref(used) });

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--used: #0066ff");
			expect(content).not.toContain("--unused:");
			expect(content).toContain("color: var(--used)");
		});

		it("keeps variables referenced as a ref() fallback", async () => {
			variable("text", "#000");
			variable("primary", "#0066ff");
			variable("unused", "#ff0000");
			selector(".btn", { color: ref("text", "@primary") });

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(cssBlock(content)).toContain("--text: #000");
			expect(cssBlock(content)).toContain("--primary: #0066ff");
			expect(content).not.toContain("--unused:");
		});

		it("keeps variables referenced inside a css`` template literal", async () => {
			variable("from", "#0066ff");
			variable("to", "#ff6c00");
			variable("unused", "#000");
			selector(".btn", {
				background: css`linear-gradient(@from, @to)`,
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--from: #0066ff");
			expect(content).toContain("--to: #ff6c00");
			expect(content).not.toContain("--unused:");
			expect(content).toContain(
				"background: linear-gradient(var(--from), var(--to))",
			);
		});

		it("keeps variables interpolated into a css`` template literal", async () => {
			const from = variable("from", "#0066ff");
			const to = variable("to", "#ff6c00");
			variable("unused", "#000");
			selector(".btn", {
				background: css`linear-gradient(${from}, ${to})`,
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--from: #0066ff");
			expect(content).toContain("--to: #ff6c00");
			expect(content).not.toContain("--unused:");
			expect(content).toContain(
				"background: linear-gradient(var(--from), var(--to))",
			);
		});

		it("keeps variables interpolated as @-strings into a css`` template literal", async () => {
			variable("from", "#0066ff");
			variable("to", "#ff6c00");
			variable("unused", "#000");
			const dynamicFrom = "@from";
			const dynamicTo = "@to";
			selector(".btn", {
				background: css`linear-gradient(${dynamicFrom}, ${dynamicTo})`,
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--from: #0066ff");
			expect(content).toContain("--to: #ff6c00");
			expect(content).not.toContain("--unused:");
			expect(content).toContain(
				"background: linear-gradient(var(--from), var(--to))",
			);
		});

		it("keeps variables referenced inside an at-rule", async () => {
			variable("brand", "#0066ff");
			variable("unused", "#000");
			atRule("supports", "(display: grid)", {
				color: "@brand",
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--brand: #0066ff");
			expect(content).not.toContain("--unused:");
			expect(content).toContain("@supports (display: grid)");
			expect(content).toContain("color: var(--brand)");
		});

		it("keeps variables referenced inside an @media block", async () => {
			variable("mobile-padding", "8px");
			variable("unused", "#000");
			atRule("media", "(max-width: 600px)", ({ selector: s }) => {
				s(".container", { padding: "@mobile-padding" });
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--mobile-padding: 8px");
			expect(content).not.toContain("--unused:");
			expect(content).toContain("padding: var(--mobile-padding)");
		});

		it("keeps variables referenced via utility autogenerate (@-string)", async () => {
			variable("color.primary", "#0066ff");
			variable("color.secondary", "#999");
			variable("unused", "#000");

			const colorUtility = utility("color", ({ value }) => ({
				color: value,
			}));
			colorUtility(["@color.primary"]);

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--color--primary: #0066ff");
			expect(content).not.toContain("--color--secondary:");
			expect(content).not.toContain("--unused:");
		});

		it("keeps variables referenced via namespace utility autogenerate", async () => {
			variable("color.primary", "#0066ff");
			variable("color.secondary", "#999");
			variable("unused", "#000");

			const colorUtility = utility("color", ({ value }) => ({ color: value }), {
				namespace: "color",
			});
			colorUtility(["@primary"]);

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--color--primary: #0066ff");
			expect(content).not.toContain("--color--secondary:");
			expect(content).not.toContain("--unused:");
		});

		it("keeps variables referenced inside recipe base", async () => {
			variable("color.primary", "#0066ff");
			variable("color.unused", "#000");
			utility("color", ({ value }) => ({ color: value }));

			recipe({
				name: "label",
				base: { color: "@color.primary" },
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--color--primary: #0066ff");
			expect(content).not.toContain("--color--unused:");
		});

		it("keeps variables referenced inside recipe variants", async () => {
			variable("color.primary", "#0066ff");
			variable("color.secondary", "#ff6c00");
			variable("color.unused", "#000");
			utility("background", ({ value }) => ({ background: value }));

			recipe({
				name: "button",
				variants: {
					tone: {
						primary: { background: "@color.primary" },
						secondary: { background: "@color.secondary" },
					},
				},
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--color--primary: #0066ff");
			expect(content).toContain("--color--secondary: #ff6c00");
			expect(content).not.toContain("--color--unused:");
		});

		it("keeps variables referenced inside recipe compoundVariants.css", async () => {
			variable("color.primary-shade", "#003a99");
			variable("color.unused", "#000");
			utility("background", ({ value }) => ({ background: value }));

			recipe({
				name: "button",
				variants: {
					tone: { primary: {}, secondary: {} },
				},
				compoundVariants: [
					{
						match: { tone: "primary" },
						css: { background: "@color.primary-shade" },
					},
				],
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--color--primary-shade: #003a99");
			expect(content).not.toContain("--color--unused:");
		});

		it("preserves a chain when a theme override references another variable", async () => {
			// `text` is the only thing referenced from a selector. The dark theme overrides
			// `text` with `@brand`, which adds `brand` to _usage. So both `text` and `brand`
			// must survive treeshake — `text` because the selector uses it, `brand` because the
			// theme override does.
			variable("text", "#000");
			variable("brand", "#0066ff");
			variable("unused", "#fff");
			selector(".btn", { color: "@text" });

			theme("dark", ({ variable: v }) => {
				v("text", "@brand");
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("--text: #000");
			expect(content).toContain("--brand: #0066ff");
			expect(content).not.toContain("--unused:");
			// Theme override of `text` is kept and resolves to the brand reference.
			expect(content).toContain(
				`.dark-theme, [data-theme="dark"] {\n\t--text: var(--brand);\n}`,
			);
		});

		it("treeshakes across a comprehensive realistic config", async () => {
			// Mix of every surface: variables, selectors, css template, ref(),
			// at-rules, utilities, namespaced utilities, recipes, themes.
			// Several variables are intentionally never referenced and must be dropped.
			variable("color.primary", "#0066ff");
			variable("color.secondary", "#ff6c00");
			variable("color.muted", "#666");
			variable("color.unused", "#000");
			variable("spacing.sm", "8px");
			variable("spacing.unused", "999px");

			utility("color", ({ value }) => ({ color: value }), {
				namespace: "color",
			});
			const padding = utility("padding", ({ value }) => ({ padding: value }));

			selector(".body", { color: ref("color.primary") });
			selector(".alt", {
				background: css`linear-gradient(@color.secondary, white)`,
			});
			atRule("media", "(min-width: 600px)", ({ selector: s }) => {
				s(".container", { padding: "@spacing.sm" });
			});

			padding(["@spacing.sm"]);

			recipe({
				name: "card",
				base: { color: "@color.muted" },
				variants: {
					tone: {
						primary: { color: "@color.primary" },
					},
				},
			});

			theme("dark", ({ variable: v }) => {
				v("color.primary", "#3399ff");
				v("color.unused", "#111"); // override of unused — should be dropped
			});

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			// Used variables are emitted in :root
			expect(content).toContain("--color--primary: #0066ff");
			expect(content).toContain("--color--secondary: #ff6c00");
			expect(content).toContain("--color--muted: #666");
			expect(content).toContain("--spacing--sm: 8px");

			// Unused variables are absent everywhere
			expect(content).not.toContain("--color--unused");
			expect(content).not.toContain("--spacing--unused");

			// Theme override of a used variable is kept; override of an unused one is dropped
			expect(content).toContain(
				`.dark-theme, [data-theme="dark"] {\n\t--color--primary: #3399ff;\n}`,
			);
		});

		it("does not treeshake utilities when scanner is not set", async () => {
			const createMargin = utility("margin", ({ value }) => ({
				margin: value,
			}));
			createMargin({ sm: "0.5rem", md: "1rem" });

			const output = await transpile(instance, { treeshake: true });
			const content = output.files[0]!.content;

			expect(content).toContain("margin: 0.5rem");
			expect(content).toContain("margin: 1rem");
		});

		it("treeshakes unused utilities when treeshake and scanner are both true", async () => {
			const createMargin = utility("margin", ({ value }) => ({
				margin: value,
			}));
			createMargin({ sm: "0.5rem", md: "1rem" });

			instance.root._usage.utilities.add("_margin:sm");

			const output = await transpile(instance, {
				treeshake: true,
				scanner: true,
			});
			const content = output.files[0]!.content;

			expect(content).toContain("margin: 0.5rem");
			expect(content).not.toContain("margin: 1rem");
		});

		it("preserves recipe-tracked utilities during treeshake", async () => {
			utility("padding", ({ value }) => ({ padding: value }));
			utility("background", ({ value }) => ({ background: value }));

			variable("color.primary", "#006cff");

			recipe({
				name: "button",
				base: { padding: "1rem" },
				variants: {
					color: {
						primary: { background: "@color.primary" },
					},
				},
			});

			registerRecipeUtilities(instance.root);

			const output = await transpile(instance, {
				treeshake: true,
				scanner: true,
			});
			const content = output.files[0]!.content;

			expect(content).toContain("padding: 1rem");
			expect(content).toContain("background: var(--color--primary)");
		});
	});

	describe("diagnostics", () => {
		it("emits as before and returns the diagnostics beside files", async () => {
			variable("color.brand", "#6366f1");
			variable("color.brand", "#f59e0b");
			selector(".a", { color: ref("color.brnad") });

			const output = await transpile(instance, { type: "css" });

			expect(output.files[0]!.content).toContain("color: var(--color--brnad)");
			expect(
				output.diagnostics?.map(({ code, severity }) => [code, severity]),
			).toEqual([
				["unresolved-reference", "warning"],
				["duplicate-variable", "warning"],
			]);
		});

		it("returns no diagnostics for a valid instance", async () => {
			const brand = variable("color.brand", "#6366f1");
			selector(".a", { color: ref(brand) });

			const output = await transpile(instance);

			expect(output.diagnostics).toEqual([]);
		});

		it("throws one error listing every diagnostic under strict", async () => {
			const strict = styleframe({ strict: true });
			strict.variable("color.brand", "#6366f1");
			strict.selector(".a", { color: strict.ref("color.brnad") });
			strict.theme("dark", (ctx) => {
				ctx.variable("color.missing", "#000");
			});

			const error = await transpile(strict).catch((e: unknown) => e);

			expect(error).toBeInstanceOf(Error);
			const { message } = error as Error;
			expect(message).toContain("2 problems");
			expect(message).toContain('selector ".a" › color');
			expect(message).toContain('Did you mean "@color.brand"?');
			expect(message).toContain('theme "dark" › variable "color.missing"');
		});

		it("builds under strict when there is nothing to report", async () => {
			const strict = styleframe({ strict: true });
			const brand = strict.variable("color.brand", "#6366f1");
			strict.selector(".a", { color: strict.ref(brand) });

			const output = await transpile(strict, { type: "css" });

			expect(output.files).toHaveLength(1);
			expect(output.diagnostics).toEqual([]);
		});
	});

	describe("hyphenated at-rules", () => {
		it("emits @starting-style nested in a selector", async () => {
			selector(".a", { "@starting-style": { opacity: 0 } });

			const output = await transpile(instance, { type: "css" });

			expect(output.files[0]!.content).toContain("@starting-style {");
		});

		it("emits @font-feature-values with its rule", async () => {
			selector(".a", {
				"@font-feature-values Font One": { fontDisplay: "swap" },
			});

			const output = await transpile(instance, { type: "css" });

			expect(output.files[0]!.content).toContain(
				"@font-feature-values Font One {",
			);
		});
	});
});
