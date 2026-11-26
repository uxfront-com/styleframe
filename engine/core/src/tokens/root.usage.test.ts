import { beforeEach, describe, expect, it } from "vitest";

import type { ModifierFactory, Root } from "../types";
import { createAtRuleFunction, createMediaFunction } from "./atRule";
import { createCssFunction } from "./css";
import { createRecipeFunction, registerRecipeUtilities } from "./recipe";
import { createRefFunction } from "./ref";
import { createRoot } from "./root";
import { createSelectorFunction } from "./selector";
import { createThemeFunction } from "./theme";
import { createUtilityFunction } from "./utility";
import { createVariableFunction } from "./variable";

const trackedVariables = (root: Root) => Array.from(root._usage.variables).sort();
const trackedUtilities = (root: Root) => Array.from(root._usage.utilities).sort();

describe("root._usage.variables collection", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;
	let selector: ReturnType<typeof createSelectorFunction>;
	let atRule: ReturnType<typeof createAtRuleFunction>;
	let media: ReturnType<typeof createMediaFunction>;
	let theme: ReturnType<typeof createThemeFunction>;
	let css: ReturnType<typeof createCssFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;
	let recipe: ReturnType<typeof createRecipeFunction>;

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
		selector = createSelectorFunction(root, root);
		atRule = createAtRuleFunction(root, root);
		media = createMediaFunction(root, root);
		theme = createThemeFunction(root, root);
		css = createCssFunction(root, root);
		utility = createUtilityFunction(root, root);
		recipe = createRecipeFunction(root, root);
	});

	describe("ref() direct calls", () => {
		it("tracks the name when called with a Variable instance", () => {
			const colorPrimary = variable("color.primary", "#006cff");

			ref(colorPrimary);

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks the name when called with a string", () => {
			ref("color.primary");

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks both the ref and an @-prefixed fallback", () => {
			variable("color.primary", "#006cff");
			ref("color.text", "@color.primary");

			expect(trackedVariables(root)).toEqual(["color.primary", "color.text"]);
		});

		it("tracks each reference embedded in an @-fallback", () => {
			variable("color.primary", "#006cff");
			variable("color.secondary", "#999");
			ref("border", "1px solid @color.primary @color.secondary");

			expect(trackedVariables(root)).toEqual(["border", "color.primary", "color.secondary"]);
		});
	});

	describe("@-strings in declarations", () => {
		it("tracks an exact @-reference in a selector declaration", () => {
			variable("color.primary", "#006cff");

			selector(".btn", { color: "@color.primary" });

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks references embedded in a CSS-string property value", () => {
			variable("border.width", "1px");
			variable("color.primary", "#006cff");

			selector(".btn", { border: "@border.width solid @color.primary" });

			expect(trackedVariables(root)).toEqual(["border.width", "color.primary"]);
		});

		it("tracks references inside at-rule blocks", () => {
			variable("color.primary", "#006cff");

			atRule("supports", "(display: grid)", {
				color: "@color.primary",
			});

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks references inside media queries", () => {
			variable("color.primary", "#006cff");

			media("(min-width: 600px)", {
				color: "@color.primary",
			});

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});
	});

	describe("variables", () => {
		it("tracks references when a variable's default value is an @-string", () => {
			variable("color.base", "#0066ff");

			variable("color.primary", "@color.base");

			expect(trackedVariables(root)).toEqual(["color.base"]);
		});

		it("tracks references when a variable is created via ref()", () => {
			const base = variable("color.base", "#0066ff");

			variable("color.primary", ref(base));

			expect(trackedVariables(root)).toEqual(["color.base"]);
		});
	});

	describe("themes", () => {
		it("tracks @-string overrides inside a theme block", () => {
			variable("color.brand", "#000");
			variable("color.text", "#fff");

			theme("dark", ({ variable }) => {
				variable("color.text", "@color.brand");
			});

			expect(trackedVariables(root)).toEqual(["color.brand"]);
		});
	});

	describe("css() template literal", () => {
		it("tracks a single @-reference in a static string", () => {
			variable("color.primary", "#006cff");

			css`@color.primary`;

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks an embedded @-reference inside a static string", () => {
			variable("color.primary", "#006cff");

			css`1px solid @color.primary`;

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks Variable interpolations via ref()", () => {
			const colorPrimary = variable("color.primary", "#006cff");

			css`color: ${colorPrimary}`;

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks @-references inside string interpolations", () => {
			variable("color.primary", "#006cff");

			const dynamic = "@color.primary";
			css`color: ${dynamic}`;

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});
	});

	describe("utility autogenerate (default transformUtilityKey)", () => {
		it("tracks an @-string passed to a default utility autogenerate", () => {
			variable("color.primary", "#006cff");

			const color = utility("color", ({ value }) => ({ color: value }));
			color(["@color.primary"]);

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});
	});

	describe("utility autogenerate (namespace string)", () => {
		it("tracks the namespaced reference when an @-string is autogenerated", () => {
			variable("color.primary", "#006cff");

			const color = utility("color", ({ value }) => ({ color: value }), {
				namespace: "color",
			});
			color(["@primary"]);

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("does not double-prepend when the @-string already includes the namespace", () => {
			variable("color.primary", "#006cff");

			const color = utility("color", ({ value }) => ({ color: value }), {
				namespace: "color",
			});
			color(["@color.primary"]);

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});
	});

	describe("utility autogenerate (namespace array)", () => {
		it("tracks the first matching namespace", () => {
			variable("background.primary", "#006cff");

			const bg = utility("background", ({ value }) => ({ background: value }), {
				namespace: ["background", "color"],
			});
			bg(["@primary"]);

			expect(trackedVariables(root)).toEqual(["background.primary"]);
		});

		it("falls back to a later namespace when the first has no match", () => {
			variable("color.primary", "#006cff");

			const bg = utility("background", ({ value }) => ({ background: value }), {
				namespace: ["background", "color"],
			});
			bg(["@primary"]);

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks an exact-name cross-namespace reference", () => {
			variable("primary", "#006cff");

			const bg = utility("background", ({ value }) => ({ background: value }), {
				namespace: ["background", "color"],
			});
			bg(["@primary"]);

			expect(trackedVariables(root)).toEqual(["primary"]);
		});
	});

	describe("recipes", () => {
		beforeEach(() => {
			utility("color", ({ value }) => ({ color: value }));
			utility("background", ({ value }) => ({ background: value }));
			utility("padding", ({ value }) => ({ padding: value }));
			utility("borderColor", ({ value }) => ({ borderColor: value }));
		});

		it("tracks ref() calls inside recipe base declarations", () => {
			const colorPrimary = variable("color.primary", "#006cff");

			recipe({
				name: "button",
				base: { color: ref(colorPrimary) },
			});

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks @-strings used in recipe base declarations", () => {
			variable("color.primary", "#006cff");

			recipe({
				name: "button",
				base: { color: "@color.primary" },
			});

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});

		it("tracks @-strings used in recipe variants", () => {
			variable("color.primary", "#006cff");
			variable("color.secondary", "#999");

			recipe({
				name: "button",
				variants: {
					color: {
						primary: { background: "@color.primary" },
						secondary: { background: "@color.secondary" },
					},
				},
			});

			expect(trackedVariables(root)).toEqual(["color.primary", "color.secondary"]);
		});

		it("tracks @-strings inside variant modifier blocks", () => {
			variable("color.primary", "#006cff");
			variable("color.primary-shade-50", "#003a99");

			root.modifiers.push({
				type: "modifier",
				key: ["hover"],
				factory: ({ declarations }) => ({ "&:hover": declarations }),
			});

			recipe({
				name: "button",
				variants: {
					color: {
						primary: {
							background: "@color.primary",
							"&:hover": { background: "@color.primary-shade-50" },
						},
					},
				},
			});

			expect(trackedVariables(root)).toEqual(["color.primary", "color.primary-shade-50"]);
		});

		it("tracks @-strings inside compoundVariants.css", () => {
			variable("color.primary-shade-50", "#003a99");

			recipe({
				name: "button",
				variants: {
					color: { primary: {}, secondary: {} },
				},
				compoundVariants: [
					{
						match: { color: "primary" },
						css: { background: "@color.primary-shade-50" },
					},
				],
			});

			expect(trackedVariables(root)).toEqual(["color.primary-shade-50"]);
		});
	});

	describe("modifier-applied utilities", () => {
		it("does not drop or duplicate names when a utility has modifiers", () => {
			variable("color.primary", "#006cff");

			const hoverModifier: ModifierFactory = {
				type: "modifier",
				key: ["hover"],
				factory: ({ declarations }) => ({ "&:hover": declarations }),
			};

			const color = utility("color", ({ value }) => ({ color: value }), {
				namespace: "color",
			});
			color(["@primary"], [hoverModifier]);

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});
	});

	describe("de-duplication", () => {
		it("records each variable name only once across many references", () => {
			variable("color.primary", "#006cff");

			ref("color.primary");
			ref("color.primary");
			selector(".a", { color: "@color.primary" });
			selector(".b", { background: "@color.primary" });

			expect(trackedVariables(root)).toEqual(["color.primary"]);
		});
	});
});

describe("root._usage.utilities collection", () => {
	let root: Root;
	let variable: ReturnType<typeof createVariableFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;
	let recipe: ReturnType<typeof createRecipeFunction>;

	beforeEach(() => {
		root = createRoot();
		variable = createVariableFunction(root, root);
		utility = createUtilityFunction(root, root);
		recipe = createRecipeFunction(root, root);
	});

	describe("recipes", () => {
		beforeEach(() => {
			utility("padding", ({ value }) => ({ padding: value }));
			utility("background", ({ value }) => ({ background: value }));
			utility("color", ({ value }) => ({ color: value }));
		});

		it("populates recipeUtilities map, not utilities directly", () => {
			recipe({
				name: "button",
				base: { padding: "1rem" },
			});

			expect(trackedUtilities(root)).toEqual([]);
			expect(Array.from(root._usage.recipeUtilities.get("button") ?? [])).toEqual([
				"_padding:[1rem]",
			]);
		});

		it("tracks utility class names from recipe variant declarations", () => {
			variable("color.primary", "#006cff");
			variable("color.secondary", "#999");

			recipe({
				name: "button",
				variants: {
					color: {
						primary: { background: "@color.primary" },
						secondary: { background: "@color.secondary" },
					},
				},
			});

			expect(Array.from(root._usage.recipeUtilities.get("button") ?? []).sort()).toEqual([
				"_background:color.primary",
				"_background:color.secondary",
			]);
		});

		it("tracks only the modifier variant, not the side-effect base", () => {
			variable("color.primary", "#006cff");

			const hoverModifier: ModifierFactory = {
				type: "modifier",
				key: ["hover"],
				factory: ({ declarations }) => ({ "&:hover": declarations }),
			};
			root.modifiers.push(hoverModifier);

			recipe({
				name: "button",
				variants: {
					color: {
						primary: {
							"&:hover": { background: "@color.primary" },
						},
					},
				},
			});

			expect(Array.from(root._usage.recipeUtilities.get("button") ?? [])).toEqual([
				"_hover:background:color.primary",
			]);
		});

		it("tracks base and modifier entries independently", () => {
			variable("color.primary", "#006cff");
			variable("color.primary-shade-50", "#003a99");

			const hoverModifier: ModifierFactory = {
				type: "modifier",
				key: ["hover"],
				factory: ({ declarations }) => ({ "&:hover": declarations }),
			};
			root.modifiers.push(hoverModifier);

			recipe({
				name: "button",
				variants: {
					color: {
						primary: {
							background: "@color.primary",
							"&:hover": { background: "@color.primary-shade-50" },
						},
					},
				},
			});

			expect(Array.from(root._usage.recipeUtilities.get("button") ?? []).sort()).toEqual([
				"_background:color.primary",
				"_hover:background:color.primary-shade-50",
			]);
		});

		it("tracks utility class names from compoundVariants", () => {
			variable("color.primary-shade-50", "#003a99");

			recipe({
				name: "button",
				variants: {
					color: { primary: {}, secondary: {} },
				},
				compoundVariants: [
					{
						match: { color: "primary" },
						css: { background: "@color.primary-shade-50" },
					},
				],
			});

			expect(Array.from(root._usage.recipeUtilities.get("button") ?? [])).toEqual([
				"_background:color.primary-shade-50",
			]);
		});

		it("tracks multiple recipes independently", () => {
			recipe({
				name: "button",
				base: { padding: "1rem" },
			});
			recipe({
				name: "badge",
				base: { background: "blue" },
			});

			expect(root._usage.recipeUtilities.size).toBe(2);
			expect(root._usage.recipeUtilities.has("button")).toBe(true);
			expect(root._usage.recipeUtilities.has("badge")).toBe(true);
		});
	});

	describe("registerRecipeUtilities", () => {
		beforeEach(() => {
			utility("padding", ({ value }) => ({ padding: value }));
			utility("background", ({ value }) => ({ background: value }));
		});

		it("promotes all recipe utilities when called without names", () => {
			recipe({
				name: "button",
				base: { padding: "1rem" },
			});
			recipe({
				name: "badge",
				base: { background: "blue" },
			});

			registerRecipeUtilities(root);

			expect(trackedUtilities(root)).toEqual(["_background:[blue]", "_padding:[1rem]"]);
		});

		it("promotes only named recipes when called with a set", () => {
			recipe({
				name: "button",
				base: { padding: "1rem" },
			});
			recipe({
				name: "badge",
				base: { background: "blue" },
			});

			registerRecipeUtilities(root, new Set(["button"]));

			expect(trackedUtilities(root)).toEqual(["_padding:[1rem]"]);
		});

		it("preserves shared utilities when one recipe is promoted", () => {
			variable("color.primary", "#006cff");

			recipe({
				name: "button",
				base: { background: "@color.primary" },
			});
			recipe({
				name: "badge",
				base: { background: "@color.primary" },
			});

			registerRecipeUtilities(root, new Set(["button"]));

			expect(trackedUtilities(root)).toEqual(["_background:color.primary"]);
		});
	});

	describe("manual factory.create", () => {
		it("does NOT populate _usage.utilities", () => {
			const createPadding = utility("padding", ({ value }) => ({
				padding: value,
			}));
			createPadding({ sm: "0.5rem", md: "1rem" });

			expect(trackedUtilities(root)).toEqual([]);
		});
	});
});
