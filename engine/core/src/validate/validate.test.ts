import { styleframe } from "../styleframe";
import { merge } from "../utils";
import { validate } from "./validate";

function createInstance(options?: Parameters<typeof styleframe>[0]) {
	const s = styleframe(options);
	s.variable("color.brand", "#6366f1");
	s.variable("color.brand-hover", "#4f46e5");
	s.utility("background", ({ value }) => ({ background: value }));
	s.utility("background-color", ({ value }) => ({ backgroundColor: value }), {
		namespace: "color",
	});
	s.modifier("hover", ({ declarations }) => ({ "&:hover": declarations }));
	s.modifier("enabled", ({ declarations }) => ({
		"&:enabled": declarations,
	}));
	return s;
}

describe("validate", () => {
	it("returns no diagnostics for a valid instance", () => {
		const s = createInstance();
		s.recipe({
			name: "button",
			base: { background: "@color.brand" },
			variants: { tone: { solid: { backgroundColor: "@brand" } } },
		});
		s.selector(".a", { color: s.ref("color.brand") });
		s.theme("dark", (ctx) => {
			ctx.variable("color.brand", "#818cf8");
		});

		expect(validate(s)).toEqual([]);
	});

	describe("unresolved-reference", () => {
		it("reports a token in a recipe's base, with its path and a suggestion", () => {
			const s = createInstance();
			s.recipe({ name: "button", base: { background: "@color.brnad" } });

			expect(validate(s)).toEqual([
				{
					code: "unresolved-reference",
					severity: "warning",
					message:
						'Reference "@color.brnad" resolves to no variable. Did you mean "@color.brand"?',
					path: 'recipe "button" › base › background',
					suggestion: "color.brand",
				},
			]);
		});

		it("reports tokens in variants, compound variants, and modifier blocks", () => {
			const s = createInstance();
			s.recipe({
				name: "button",
				base: { hover: { background: "@color.missing-a" } },
				variants: {
					tone: { solid: { background: "@color.missing-b" } },
				},
				compoundVariants: [
					{
						match: { tone: "solid" },
						css: { "hover:enabled": { background: "@color.brand-hovr" } },
					},
				],
			});

			expect(
				validate(s).map(({ path, suggestion }) => [path, suggestion]),
			).toEqual([
				['recipe "button" › base › hover › background', undefined],
				['recipe "button" › variants › tone › solid › background', undefined],
				[
					'recipe "button" › compoundVariants[0] › hover:enabled › background',
					"color.brand-hover",
				],
			]);
		});

		it("reports a namespace fallback that finds no variable", () => {
			const s = createInstance();
			s.recipe({ name: "button", base: { backgroundColor: "@brnad" } });

			expect(validate(s)).toEqual([
				expect.objectContaining({
					code: "unresolved-reference",
					path: 'recipe "button" › base › backgroundColor',
					suggestion: "color.brand",
				}),
			]);
		});

		it("reports a utility value created directly", () => {
			const s = createInstance();
			const createBackground = s.root.utilities[0]!.create;
			const createBackgroundColor = s.root.utilities[1]!.create;
			createBackground(["@color.brnad"]);
			createBackgroundColor({ accent: s.ref("color.accent") });

			expect(validate(s).map(({ path }) => path)).toEqual([
				'utility "background" › color.brnad › background',
				'utility "background-color" › accent',
			]);
		});

		it("reports a ref() in a selector and in a theme", () => {
			const s = createInstance();
			s.selector(".a", ({ selector }) => {
				selector("&:hover", { color: s.ref("color.missing") });
				return { color: s.ref("color.brand") };
			});
			s.theme("dark", (ctx) => {
				ctx.variable("color.brand", s.ref("color.brnad"));
			});

			expect(validate(s).map(({ path }) => path)).toEqual([
				'selector ".a" › selector "&:hover" › color',
				'theme "dark" › variable "color.brand"',
			]);
		});

		it("accepts a variable defined in an enclosing scope", () => {
			const s = createInstance();
			s.selector(".a", ({ variable, selector }) => {
				variable("local", "1px");
				selector(".b", { width: s.ref("local") });
			});

			expect(validate(s)).toEqual([]);
		});

		it("names a variable defined after the utility that used it", () => {
			const s = createInstance();
			s.recipe({ name: "button", base: { backgroundColor: "@late" } });
			s.variable("color.late", "#000");

			expect(validate(s)).toEqual([
				{
					code: "unresolved-reference",
					severity: "warning",
					message:
						'Reference "@color.late" was used before its variable was defined. Define "color.late" before the recipe or utility that uses it.',
					path: 'recipe "button" › base › backgroundColor',
				},
			]);
		});

		it("gives no suggestion for a name three edits away", () => {
			const s = createInstance();
			s.selector(".a", { color: s.ref("color.bxxxd") });

			expect(validate(s)).toEqual([
				expect.not.objectContaining({ suggestion: expect.anything() }),
			]);
		});

		it("suggests a variable from the enclosing selector", () => {
			const s = createInstance();
			s.selector(".a", ({ variable, selector }) => {
				variable("gutter-size", "1px");
				selector(".b", { width: s.ref("gutter-sise") });
			});

			expect(validate(s)).toEqual([
				expect.objectContaining({ suggestion: "gutter-size" }),
			]);
		});

		it("resolves root variables after merge()", () => {
			const a = createInstance();
			a.selector(".a", { color: a.ref("color.brand") });
			const b = styleframe();
			b.variable("spacing", "1rem");

			expect(validate(merge(a, b))).toEqual([]);
		});

		it("accepts a reference with a fallback", () => {
			const s = createInstance();
			s.selector(".a", { color: s.ref("color.optional", "#333") });

			expect(validate(s)).toEqual([]);
		});
	});

	describe("undefined-theme-override", () => {
		it("reports a theme variable that isn't defined at root", () => {
			const s = createInstance();
			s.theme("dark", (ctx) => {
				ctx.variable("color.brnad", "#818cf8");
			});

			expect(validate(s)).toEqual([
				{
					code: "undefined-theme-override",
					severity: "warning",
					message:
						'Theme "dark" overrides "color.brnad", which isn\'t defined at root. Did you mean "color.brand"?',
					path: 'theme "dark" › variable "color.brnad"',
					suggestion: "color.brand",
				},
			]);
		});
	});

	describe("duplicate-variable", () => {
		it("reports two definitions without default: true, with both values", () => {
			const s = createInstance();
			s.variable("color.brand", "#f59e0b");

			expect(validate(s)).toEqual([
				{
					code: "duplicate-variable",
					severity: "warning",
					message:
						'Variable "color.brand" is defined twice: "#6366f1", then "#f59e0b". The last value wins.',
					path: 'variable "color.brand"',
				},
			]);
		});

		it("accepts an override of a default", () => {
			const s = styleframe();
			s.variable("spacing", "1rem", { default: true });
			s.variable("spacing", "2rem");
			s.variable("spacing", "3rem", { default: true });

			expect(validate(s)).toEqual([]);
		});

		it("reports a second override after a default", () => {
			const s = styleframe();
			s.variable("spacing", "1rem", { default: true });
			s.variable("spacing", "2rem");
			s.variable("spacing", "3rem");

			expect(validate(s)).toEqual([
				expect.objectContaining({
					code: "duplicate-variable",
					message:
						'Variable "spacing" is defined twice: "2rem", then "3rem". The last value wins.',
				}),
			]);
		});

		it("names the scope of a duplicate inside a theme", () => {
			const s = createInstance();
			s.theme("dark", (ctx) => {
				ctx.variable("color.brand", "#000");
				ctx.variable("color.brand", "#111");
			});

			expect(validate(s).map(({ path }) => path)).toEqual([
				'theme "dark" › variable "color.brand"',
			]);
		});

		it("keeps the records of merged instances", () => {
			const a = createInstance();
			a.variable("color.brand", "#f59e0b");
			const b = styleframe();

			expect(validate(merge(a, b))).toHaveLength(1);
		});
	});

	it("returns every problem in one pass", () => {
		const s = createInstance();
		s.variable("color.brand", "#f59e0b");
		s.recipe({ name: "button", base: { background: "@color.brnad" } });
		s.theme("dark", (ctx) => {
			ctx.variable("color.brnad", "#818cf8");
		});

		expect(validate(s).map(({ code }) => code)).toEqual([
			"unresolved-reference",
			"undefined-theme-override",
			"duplicate-variable",
		]);
	});

	it("reports errors under strict", () => {
		const s = createInstance({ strict: true });
		s.recipe({ name: "button", base: { background: "@color.brnad" } });

		expect(validate(s)).toEqual([
			expect.objectContaining({ severity: "error" }),
		]);
	});
});
