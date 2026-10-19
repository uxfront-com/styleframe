import { styleframe } from "@styleframe/core";
import { useDarkModifier } from "../../modifiers/useMediaPreferenceModifiers";
import {
	useFocusWithinModifier,
	useHoverModifier,
} from "../../modifiers/usePseudoStateModifiers";
import { useTextareaRecipe } from "./useTextareaRecipe";

function createInstance() {
	const s = styleframe();
	for (const name of [
		"display",
		"alignItems",
		"flexGrow",
		"minWidth",
		"width",
		"fontFamily",
		"fontSize",
		"fontWeight",
		"lineHeight",
		"border",
		"borderWidth",
		"borderStyle",
		"borderColor",
		"borderRadius",
		"padding",
		"paddingTop",
		"paddingBottom",
		"paddingLeft",
		"paddingRight",
		"background",
		"color",
		"outline",
		"outlineWidth",
		"outlineStyle",
		"outlineColor",
		"outlineOffset",
		"cursor",
		"opacity",
		"transitionProperty",
		"transitionTimingFunction",
		"transitionDuration",
	]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
	s.variable("color.text-weakest", "#64748B", { default: true });
	useDarkModifier(s);
	useHoverModifier(s);
	useFocusWithinModifier(s);
	return s;
}

describe("useTextareaRecipe", () => {
	it("should create a recipe with correct metadata", () => {
		const s = createInstance();
		const recipe = useTextareaRecipe(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("textarea");
	});

	it("should have correct base styles", () => {
		const s = createInstance();
		const recipe = useTextareaRecipe(s);

		expect(recipe.base).toEqual({
			display: "flex",
			alignItems: "flex-start",
			fontFamily: "inherit",
			fontSize: "@font-size.sm",
			fontWeight: "@font-weight.normal",
			lineHeight: "@line-height.normal",
			borderWidth: "@border-width.thin",
			borderStyle: "@border-style.solid",
			borderColor: "transparent",
			borderRadius: "@border-radius.md",
			paddingTop: "@0.5",
			paddingBottom: "@0.5",
			paddingLeft: "@0.75",
			paddingRight: "@0.75",
			background: "transparent",
			color: "@color.text",
			outline: "none",
			transitionProperty: "color, background-color, border-color",
			transitionTimingFunction: "@easing.ease-in-out",
			transitionDuration: "150ms",
			"&:focus-within": {
				outlineWidth: "2px",
				outlineStyle: "solid",
				outlineColor: "@color.primary",
				outlineOffset: "2px",
			},
		});
	});

	describe("variants", () => {
		it("should have all color variants", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"light",
				"dark",
				"neutral",
			]);
		});

		it("should have all style variants", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(Object.keys(recipe.variants!.variant)).toEqual([
				"default",
				"soft",
				"ghost",
			]);
		});

		it("should have size variants with correct styles", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(recipe.variants!.size).toEqual({
				sm: {
					fontSize: "@font-size.xs",
					paddingTop: "@0.375",
					paddingBottom: "@0.375",
					paddingLeft: "@0.625",
					paddingRight: "@0.625",
					borderRadius: "@border-radius.sm",
				},
				md: {
					fontSize: "@font-size.sm",
					paddingTop: "@0.5",
					paddingBottom: "@0.5",
					paddingLeft: "@0.75",
					paddingRight: "@0.75",
					borderRadius: "@border-radius.md",
				},
				lg: {
					fontSize: "@font-size.md",
					paddingTop: "@0.625",
					paddingBottom: "@0.625",
					paddingLeft: "@0.875",
					paddingRight: "@0.875",
					borderRadius: "@border-radius.md",
				},
			});
		});

		it("should have all resize variants", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(Object.keys(recipe.variants!.resize)).toEqual([
				"none",
				"vertical",
				"horizontal",
				"both",
			]);
		});

		it("should have invalid boolean variants", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(recipe.variants!.invalid).toEqual({
				true: {},
				false: {},
			});
		});

		it("should have disabled boolean variants", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(recipe.variants!.disabled).toEqual({
				true: {},
				false: {},
			});
		});

		it("should have readonly boolean variants", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(recipe.variants!.readonly).toEqual({
				true: {},
				false: {},
			});
		});
	});

	it("should have correct default variants", () => {
		const s = createInstance();
		const recipe = useTextareaRecipe(s);

		expect(recipe.defaultVariants).toEqual({
			color: "neutral",
			variant: "default",
			size: "md",
			resize: "vertical",
			invalid: "false",
			disabled: "false",
			readonly: "false",
		});
	});

	describe("compound variants", () => {
		it("should have 16 compound variants total", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			// 3 colors × 3 variants = 9, plus 3 standalone states
			// (invalid, readonly, disabled), plus 4 resize markers.
			expect(recipe.compoundVariants).toHaveLength(16);
		});

		it("should have correct neutral default compound variant with adaptive dark mode", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.color === "neutral" && v.match.variant === "default",
			);

			expect(cv).toEqual({
				match: { color: "neutral", variant: "default" },
				css: {
					background: "@color.white",
					borderColor: "@color.gray-200",
					color: "@color.text",
					"&:hover": {
						borderColor: "@color.gray-300",
					},
					"&:dark": {
						background: "@color.gray-900",
						borderColor: "@color.gray-700",
						color: "@color.white",
					},
					"&:dark:hover": {
						borderColor: "@color.gray-600",
					},
				},
			});
		});

		it("should have correct invalid compound variant overriding border and focus-within ring", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.invalid === "true",
			);

			expect(cv).toEqual({
				match: { invalid: "true" },
				css: {
					borderColor: "@color.error",
					"&:hover": {
						borderColor: "@color.error",
					},
					"&:focus-within": {
						outlineColor: "@color.error",
					},
					"&:dark": {
						borderColor: "@color.error",
					},
					"&:dark:hover": {
						borderColor: "@color.error",
					},
				},
			});
		});

		it("should have correct disabled compound variant with dimmed styling", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			const cv = recipe.compoundVariants!.find(
				(v) => v.match.disabled === "true",
			);

			expect(cv).toEqual({
				match: { disabled: "true" },
				css: {
					opacity: "0.5",
					cursor: "not-allowed",
				},
			});
		});

		it("should map each resize value to a marker class", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s);

			expect(
				recipe.compoundVariants!.find((v) => v.match.resize === "vertical"),
			).toEqual({
				match: { resize: "vertical" },
				className: "-resize-vertical",
			});
			expect(
				recipe.compoundVariants!.find((v) => v.match.resize === "both"),
			).toEqual({
				match: { resize: "both" },
				className: "-resize-both",
			});
		});
	});

	describe("setup callback", () => {
		it("should register a .textarea-field selector with transparent styling", () => {
			const s = createInstance();
			useTextareaRecipe(s);

			const fieldSelector = s.root.children.find(
				(child) =>
					child.type === "selector" &&
					(child as { query: string }).query === ".textarea-field",
			);

			expect(fieldSelector).toBeDefined();
		});

		it("should register resize selectors targeting the nested field", () => {
			const s = createInstance();
			useTextareaRecipe(s);

			const expectedQueries = [
				".textarea.-resize-none .textarea-field",
				".textarea.-resize-vertical .textarea-field",
				".textarea.-resize-horizontal .textarea-field",
				".textarea.-resize-both .textarea-field",
			];

			for (const query of expectedQueries) {
				const rule = s.root.children.find(
					(child) =>
						child.type === "selector" &&
						(child as { query: string }).query === query,
				);
				expect(rule, `missing resize selector: ${query}`).toBeDefined();
			}
		});

		it("should give the disabled nested textarea a not-allowed cursor", () => {
			const s = createInstance();
			useTextareaRecipe(s);

			const fieldSelector = s.root.children.find(
				(child) =>
					child.type === "selector" &&
					(child as { query: string }).query === ".textarea-field",
			) as
				| {
						children: {
							query: string;
							declarations: Record<string, unknown>;
						}[];
				  }
				| undefined;

			expect(
				fieldSelector?.children.find((child) => child.query === "&:disabled")
					?.declarations,
			).toEqual({ cursor: "not-allowed" });
		});

		it("should turn the resize handle off on a disabled textarea, after every resize selector", () => {
			const s = createInstance();
			useTextareaRecipe(s);

			const queries = s.root.children
				.filter((child) => child.type === "selector")
				.map((child) => (child as { query: string }).query);
			const disabledIndex = queries.indexOf(
				".textarea .textarea-field:disabled",
			);
			const disabledRule = s.root.children.find(
				(child) =>
					child.type === "selector" &&
					(child as { query: string }).query ===
						".textarea .textarea-field:disabled",
			) as { declarations: Record<string, unknown> } | undefined;

			expect(disabledRule?.declarations).toEqual({ resize: "none" });
			for (const query of queries.filter((q) => q.includes("-resize-"))) {
				expect(disabledIndex, query).toBeGreaterThan(queries.indexOf(query));
			}
		});
	});

	describe("config overrides", () => {
		it("should allow overriding base styles", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s, {
				base: { display: "block" },
			});

			expect(recipe.base!.display).toBe("block");
		});
	});

	describe("filter", () => {
		it("should filter color variants", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s, {
				filter: { color: ["neutral"] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["neutral"]);
		});

		it("should prune compound variants when filtering colors", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s, {
				filter: { color: ["neutral"] },
			});

			// Every color-scoped compound variant should be for `neutral`; the
			// standalone state and resize compounds have no `color` field.
			expect(
				recipe.compoundVariants!.every(
					(cv) => cv.match.color === undefined || cv.match.color === "neutral",
				),
			).toBe(true);
			expect(recipe.compoundVariants!.length).toBeLessThan(16);
		});

		it("should keep resize variants when filtering colors", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s, {
				filter: { color: ["neutral"] },
			});

			expect(Object.keys(recipe.variants!.resize)).toEqual([
				"none",
				"vertical",
				"horizontal",
				"both",
			]);
		});

		it("should adjust default variants when filtered out", () => {
			const s = createInstance();
			const recipe = useTextareaRecipe(s, {
				filter: { color: ["light"] },
			});

			expect(recipe.defaultVariants?.color).toBeUndefined();
			expect(recipe.defaultVariants?.resize).toBe("vertical");
			expect(recipe.defaultVariants?.size).toBe("md");
		});
	});
});
