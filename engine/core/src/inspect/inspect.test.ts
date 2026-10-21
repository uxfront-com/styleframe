import { styleframe } from "../styleframe";
import { inspect } from "./inspect";

function createInstance(options?: Parameters<typeof styleframe>[0]) {
	const s = styleframe(options);
	const colorBrand = s.variable("color.brand", "#6366f1");
	s.variable("color.accent", s.ref(colorBrand, "#000"));
	s.variable("spacing", s.css`calc(${s.ref("color.brand")} * 2)`);

	s.theme("dark", (ctx) => {
		ctx.variable(colorBrand, "#818cf8");
	});

	const hover = s.modifier("hover", ({ declarations }) => ({
		"&:hover": declarations,
	}));
	const createBackgroundColor = s.utility(
		"background-color",
		({ value }) => ({ backgroundColor: value }),
		{ namespace: "color" },
	);
	createBackgroundColor({ brand: s.ref(colorBrand) }, [hover]);

	s.recipe({
		name: "button",
		base: { backgroundColor: "@color.brand" },
		variants: {
			size: { sm: {}, md: {} },
			tone: { solid: {}, ghost: {} },
		},
		defaultVariants: { size: "md", tone: "solid" },
	});

	return s;
}

describe("inspect", () => {
	it("lists root variables with their property and emitted value", () => {
		expect(inspect(createInstance()).variables).toEqual([
			{ name: "color.brand", property: "--color--brand", value: "#6366f1" },
			{
				name: "color.accent",
				property: "--color--accent",
				value: "var(--color--brand, #000)",
			},
			{
				name: "spacing",
				property: "--spacing",
				value: "calc(var(--color--brand) * 2)",
			},
		]);
	});

	it("lists themes with their selector and overrides", () => {
		expect(inspect(createInstance()).themes).toEqual([
			{
				name: "dark",
				selector: '.dark-theme, [data-theme="dark"]',
				overrides: [{ name: "color.brand", value: "#818cf8" }],
			},
		]);
	});

	it("lists utilities with their values, class names, and modifiers", () => {
		expect(inspect(createInstance()).utilities).toEqual([
			{
				name: "background-color",
				values: ["brand"],
				classNames: [
					"_background-color:brand",
					"_hover:background-color:brand",
				],
				modifiers: ["hover"],
			},
		]);
	});

	it("lists modifiers by key", () => {
		expect(inspect(createInstance()).modifiers).toEqual([{ key: ["hover"] }]);
	});

	it("lists recipes with their variant options and defaults", () => {
		expect(inspect(createInstance()).recipes).toEqual([
			{
				name: "button",
				variants: { size: ["sm", "md"], tone: ["solid", "ghost"] },
				defaultVariants: { size: "md", tone: "solid" },
			},
		]);
	});

	it("keeps non-string default variants from a JavaScript config", () => {
		const s = styleframe();
		s.utility("opacity", ({ value }) => ({ opacity: value }));
		s.recipe({
			name: "button",
			base: {},
			variants: { disabled: { true: { opacity: "0.5" }, false: {} } },
			defaultVariants: { disabled: false } as never,
		});

		expect(inspect(s).recipes[0]?.defaultVariants).toEqual({
			disabled: "false",
		});
	});

	it("follows the instance's naming options", () => {
		const snapshot = inspect(
			createInstance({
				variables: { name: ({ name }) => `sf-${name}` },
				themes: { selector: ({ name }) => `.theme-${name}` },
				utilities: {
					selector: ({ name, value, modifiers }) =>
						[...modifiers, name, value].join("-"),
				},
			}),
		);

		expect(snapshot.variables[1]).toEqual({
			name: "color.accent",
			property: "--sf-color-accent",
			value: "var(--sf-color-brand, #000)",
		});
		expect(snapshot.themes[0]?.selector).toBe(".theme-dark");
		expect(snapshot.utilities[0]?.classNames).toEqual([
			"background-color-brand",
			"hover-background-color-brand",
		]);
	});

	it("returns a snapshot that round-trips through JSON unchanged", () => {
		const snapshot = inspect(createInstance());

		expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
	});

	it("returns empty lists for an empty instance", () => {
		expect(inspect(styleframe())).toEqual({
			variables: [],
			themes: [],
			utilities: [],
			modifiers: [],
			recipes: [],
		});
	});
});
