import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useDesignTokensPreset,
	useModifiersPreset,
	useUtilitiesPreset,
} from "../../presets";
import { useButtonRecipe } from "./useButtonRecipe";

type Slot = Record<string, unknown>;

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	useModifiersPreset(s);
	useUtilitiesPreset(s);
	return s;
}

/** Every declarations block of the recipe, with the key it sits under. */
function blocks(recipe: ReturnType<typeof useButtonRecipe>) {
	const result: { name: string; key: string; declarations: Slot }[] = [];
	const visit = (name: string, css: Slot | undefined) => {
		if (!css) return;
		result.push({ name, key: "", declarations: css });
		for (const [key, value] of Object.entries(css)) {
			if (typeof value === "object" && value !== null) {
				result.push({ name, key, declarations: value as Slot });
			}
		}
	};
	visit("base", recipe.base as Slot);
	for (const [axis, values] of Object.entries(recipe.variants!)) {
		for (const [value, css] of Object.entries(values)) {
			visit(`${axis}=${value}`, css as Slot);
		}
	}
	for (const cv of recipe.compoundVariants!) {
		visit(
			`${cv.match.color ?? "*"}/${cv.match.variant ?? "*"}`,
			cv.css as Slot,
		);
	}
	return result;
}

const stateKeys = [
	"&:hover-capable:hover",
	"&:dark:hover-capable:hover",
	"&:active",
	"&:dark:active",
	"&:aria-pressed",
	"&:dark:aria-pressed",
	"&:aria-expanded",
	"&:dark:aria-expanded",
	"&:focus-visible",
	"&:disabled",
	"&:aria-disabled",
	"&:data-loading",
];

describe("useButtonRecipe", () => {
	it("should create a recipe with correct metadata", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("button");
	});

	describe("variants", () => {
		it("should keep every color, variant and size", () => {
			const s = createInstance();
			const recipe = useButtonRecipe(s);

			expect(Object.keys(recipe.variants!.color)).toEqual([
				"primary",
				"secondary",
				"success",
				"info",
				"warning",
				"error",
				"light",
				"dark",
				"neutral",
			]);
			expect(Object.keys(recipe.variants!.variant)).toEqual([
				"solid",
				"outline",
				"soft",
				"subtle",
				"ghost",
				"link",
			]);
			expect(Object.keys(recipe.variants!.size)).toEqual([
				"xs",
				"sm",
				"md",
				"lg",
				"xl",
			]);
		});

		it("should have correct default variants", () => {
			const s = createInstance();
			const recipe = useButtonRecipe(s);

			expect(recipe.defaultVariants).toEqual({
				color: "neutral",
				variant: "solid",
				size: "md",
			});
		});

		it("should have a compound variant for every color and variant, the more contrast borders and a disabled reset for every pair", () => {
			const s = createInstance();
			const recipe = useButtonRecipe(s);

			expect(recipe.compoundVariants).toHaveLength(54 + 2 + 54);
		});
	});

	it("button/link-underlined underlines the link variant at rest", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		expect(recipe.variants!.variant.link).toMatchObject({
			textDecoration: "underline",
			textUnderlineOffset: "4px",
		});
		for (const cv of recipe.compoundVariants!) {
			if (cv.match.variant !== "link") continue;
			for (const value of Object.values(cv.css as Slot)) {
				if (typeof value === "object") {
					expect(value).not.toHaveProperty("textDecoration");
				}
			}
		}
	});

	it("button/focus-visible draws a 2px color.focus ring with a 2px offset", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		expect(recipe.base!["&:focus-visible"]).toEqual({
			outlineWidth: "2px",
			outlineStyle: "solid",
			outlineColor: "@color.focus",
			outlineOffset: "2px",
		});
		for (const block of blocks(recipe)) {
			expect(block.key, block.name).not.toMatch(/(^|:)focus$/);
		}
	});

	it("button/target-size keeps every size at least 24 × 24px, with a 44px hit area on touch screens", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		const minHeights = Object.values(recipe.variants!.size).map(
			(size) => (size as Slot).minHeight,
		);
		expect(minHeights).toEqual(["@1.5", "@2", "@2.25", "@2.5", "@3"]);
		for (const size of Object.values(recipe.variants!.size)) {
			expect((size as Slot).minWidth).toBe((size as Slot).minHeight);
		}
		expect(recipe.base!.position).toBe("relative");
		expect(recipe.base!["&:any-pointer-coarse:before"]).toEqual({
			position: "absolute",
			inset: "min(0px, calc((100% - 2.75rem) / 2))",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("@media (any-pointer: coarse)");
		expect(css).toContain("top: min(0px, calc((100% - 2.75rem) / 2));");
	});

	it("button/resizable sizes with min-height and rem padding, and lets the label wrap", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		for (const block of blocks(recipe)) {
			expect(block.declarations, block.name).not.toHaveProperty("whiteSpace");
			expect(block.declarations, block.name).not.toHaveProperty("height");
		}
		expect(recipe.base!.textAlign).toBe("center");
		for (const size of Object.values(recipe.variants!.size)) {
			const { paddingTop, paddingBottom, paddingInline, minHeight } =
				size as Slot;
			for (const value of [
				paddingTop,
				paddingBottom,
				paddingInline,
				minHeight,
			]) {
				expect(value).toMatch(/^@\d+(\.\d+)?$/);
			}
		}
	});

	it("button/stable-size changes no size or position between states", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);
		const sizing = [
			"width",
			"height",
			"minWidth",
			"minHeight",
			"padding",
			"paddingTop",
			"paddingBottom",
			"paddingInline",
			"margin",
			"borderWidth",
			"fontSize",
			"fontWeight",
			"lineHeight",
			"gap",
			"position",
			"inset",
			"transform",
			"translate",
		];

		for (const block of blocks(recipe)) {
			if (!stateKeys.includes(block.key)) continue;
			for (const property of sizing) {
				expect(
					block.declarations,
					`${block.name} ${block.key}`,
				).not.toHaveProperty(property);
			}
		}
	});

	it("button/state-selectors styles disabled, pressed, expanded and loading from their attributes", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		expect(recipe.base!["&:disabled"]).toEqual({
			cursor: "not-allowed",
			opacity: "0.75",
		});
		expect(recipe.base!["&:aria-disabled"]).toEqual(recipe.base!["&:disabled"]);
		expect(recipe.base!["&:data-loading"]).toEqual({ cursor: "progress" });
		for (const cv of recipe.compoundVariants!) {
			if (!cv.match.color) continue;
			const css = cv.css as Slot;
			expect(
				css["&:aria-pressed"],
				`${cv.match.color}/${cv.match.variant}`,
			).toEqual(css["&:active"]);
			expect(
				css["&:dark:aria-pressed"],
				`${cv.match.color}/${cv.match.variant}`,
			).toEqual(css["&:dark:active"]);
			expect(
				css["&:aria-expanded"],
				`${cv.match.color}/${cv.match.variant}`,
			).toEqual(css["&:aria-pressed"]);
			expect(
				css["&:dark:aria-expanded"],
				`${cv.match.color}/${cv.match.variant}`,
			).toEqual(css["&:dark:aria-pressed"]);
		}

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain('&[aria-disabled="true"] {');
		expect(css).toContain('&[aria-pressed="true"] {');
		expect(css).toContain('&[aria-expanded="true"] {');
		expect(css).toContain("&[data-loading] {");
		expect(css).not.toContain(":invalid");
		expect(css).not.toContain(":read-only");
	});

	it("button/loading keeps the size and overlays the spinner, without dimming a disabled loading button", () => {
		const s = createInstance();
		useButtonRecipe(s);

		const css = consumeCSS(s.root, s.options);
		expect(css).toMatch(
			/\.button\[data-loading\]:is\(:disabled, \[aria-disabled="true"\]\) \{\s*opacity: 1;/,
		);
		expect(css).toMatch(
			/\.button\[data-loading\] > :not\(\.spinner\) \{\s*opacity: 0;/,
		);
		expect(css).toMatch(
			/\.button\[data-loading\] > \.spinner \{\s*position: absolute;\s*inset: 0;\s*width: 1em;\s*height: 1em;\s*margin: auto;\s*color: currentColor;/,
		);
	});

	it("button/state-selectors shows no hover, active or pressed look on a disabled button, and keeps its pointer events", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		for (const block of blocks(recipe)) {
			expect(block.declarations, block.name).not.toHaveProperty(
				"pointerEvents",
			);
		}

		const pairs = recipe.compoundVariants!.filter(
			(cv) => cv.match.color && cv.match.variant && "color" in (cv.css as Slot),
		);
		const resets = recipe.compoundVariants!.filter(
			(cv) =>
				cv.match.color && cv.match.variant && "&:disabled" in (cv.css as Slot),
		);
		expect(resets).toHaveLength(pairs.length);
		expect(recipe.variants!.variant.link["&:disabled"]).toEqual({
			textDecorationThickness: "auto",
		});
		expect(recipe.variants!.variant.link["&:aria-disabled"]).toEqual({
			textDecorationThickness: "auto",
		});

		// The resets tie with the state rules on specificity, so they must come
		// after every one of them in the stylesheet.
		const css = consumeCSS(s.root, s.options);
		// The `active` modifier emits `&:focus:active` (0,3,0, or 0,4,0 in the dark
		// theme), which a focused `aria-disabled` button matches. The resets that
		// answer it chain `:active` after the attribute, one class higher.
		expect(css).toMatch(
			/\._aria-disabled\\:active\\:background\\:[^{]+\{\s*&\[aria-disabled="true"\] \{\s*&:active, &:focus:active \{/,
		);
		expect(css).toMatch(
			/\._dark\\:aria-disabled\\:active\\:color\\:[^{]+\{\s*:is\(\.dark-theme, \[data-theme="dark"\]\) & \{\s*&\[aria-disabled="true"\] \{\s*&:active, &:focus:active \{/,
		);

		for (const utility of ["background", "color"]) {
			for (const [state, reset] of [
				["hover-capable\\:hover", "disabled"],
				["active", "disabled"],
				["aria-pressed", "aria-disabled"],
				["dark\\:hover-capable\\:hover", "dark\\:disabled"],
				["dark\\:aria-pressed", "dark\\:aria-disabled"],
			]) {
				const lastState = css.lastIndexOf(`._${state}\\:${utility}\\:`);
				const firstReset = css.indexOf(`._${reset}\\:${utility}\\:`);
				expect(lastState, `${state} ${utility}`).toBeGreaterThan(-1);
				expect(firstReset, `${reset} ${utility}`).toBeGreaterThan(lastState);
			}
		}
		expect(
			css.lastIndexOf("._hover-capable\\:hover\\:text-decoration-thickness"),
		).toBeLessThan(css.indexOf("._disabled\\:text-decoration-thickness"));
		expect(recipe.compoundVariants!.slice(-resets.length)).toEqual(resets);
		for (const cv of pairs) {
			const css = cv.css as Slot;
			const dark = (css["&:dark"] ?? {}) as Slot;
			const reset = resets.find(
				(r) =>
					r.match.color === cv.match.color &&
					r.match.variant === cv.match.variant,
			)!.css as Slot;
			const rest = {
				background: css.background ?? "transparent",
				color: css.color,
			};
			const darkRest = {
				background: dark.background ?? rest.background,
				color: dark.color ?? rest.color,
			};
			expect(reset).toEqual({
				"&:disabled": rest,
				"&:aria-disabled": rest,
				"&:dark:disabled": darkRest,
				"&:dark:aria-disabled": darkRest,
				"&:aria-disabled:active": rest,
				"&:dark:aria-disabled:active": darkRest,
			});
		}
	});

	it("button/contrast keeps the label color on hover over the global a:hover styles", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		expect(recipe.base!["&:hover-capable:hover"]).toEqual({
			textDecorationLine: "none",
		});
		expect(recipe.variants!.variant.link["&:hover-capable:hover"]).toEqual({
			textDecorationLine: "underline",
			textDecorationThickness: "2px",
		});
		for (const cv of recipe.compoundVariants!) {
			const css = cv.css as Slot;
			if (!("color" in css)) continue;
			const name = `${cv.match.color}/${cv.match.variant}`;
			expect(css["&:hover-capable:hover"], name).toHaveProperty("color");
			if ("color" in ((css["&:dark"] ?? {}) as Slot)) {
				expect(css["&:dark:hover-capable:hover"], name).toHaveProperty("color");
			}
		}
	});

	it("button/hover-capable applies every hover style inside @media (hover: hover)", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		for (const block of blocks(recipe)) {
			if (!block.key.includes("hover")) continue;
			expect(block.key, block.name).toMatch(/^&:(dark:)?hover-capable:hover$/);
		}

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("@media (hover: hover)");
	});

	it("button/forced-colors keeps the boundary, focus, disabled, pressed and expanded states visible", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		expect(recipe.base!["&:forced-colors:focus-visible"]).toEqual({
			outlineColor: "Highlight",
		});
		expect(recipe.variants!.variant.link["&:forced-colors"]).toEqual({
			borderWidth: "@border-width.thin",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toMatch(
			/:root \.button\.button\.button\.button:is\(:disabled, \[aria-disabled="true"\]\) \{\s*@media \(forced-colors: active\) \{\s*border-color: GrayText;\s*color: GrayText;\s*opacity: 1;/,
		);
		expect(css).toMatch(
			/:root \.button\.button\.button\.button:is\(\[aria-pressed="true"\], \[aria-expanded="true"\]\) \{\s*@media \(forced-colors: active\) \{\s*forced-color-adjust: none;\s*background: Highlight;\s*color: HighlightText;/,
		);
		// A disabled toggle keeps the pressed background and turns GrayText, so
		// the disabled rule follows the pressed one.
		expect(
			css.indexOf(
				':root .button.button.button.button:is([aria-pressed="true"]',
			),
		).toBeLessThan(
			css.indexOf(":root .button.button.button.button:is(:disabled"),
		);
	});

	it("button/more-contrast draws the outline and subtle borders at full strength", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		const trailing = recipe.compoundVariants!.filter((cv) => !cv.match.color);
		expect(trailing.map((cv) => cv.match)).toEqual([
			{ variant: "outline" },
			{ variant: "subtle" },
		]);
		for (const cv of trailing) {
			expect(cv.css).toEqual({
				"&:contrast-more": { borderColor: "currentColor" },
				"&:dark:contrast-more": { borderColor: "currentColor" },
			});
		}

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("@media (prefers-contrast: more)");
	});

	it("button/reduced-motion animates only colors, so nothing turns or slides", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		expect(recipe.base!.transitionProperty).toBe(
			"color, background-color, border-color",
		);
		for (const block of blocks(recipe)) {
			for (const property of [
				"animation",
				"animationName",
				"transition",
				"transitionProperty",
				"transform",
				"rotate",
			]) {
				if (block.name === "base" && block.key === "") continue;
				expect(block.declarations, block.name).not.toHaveProperty(property);
			}
		}
	});

	it("button/mirrors-in-rtl uses logical inline padding", () => {
		const s = createInstance();
		const recipe = useButtonRecipe(s);

		for (const block of blocks(recipe)) {
			for (const property of [
				"paddingLeft",
				"paddingRight",
				"marginLeft",
				"marginRight",
				"left",
				"right",
			]) {
				expect(block.declarations, block.name).not.toHaveProperty(property);
			}
		}
		expect(recipe.base!.paddingInline).toBe("@0.75");
	});

	describe("config overrides", () => {
		it("should allow overriding base styles", () => {
			const s = createInstance();
			const recipe = useButtonRecipe(s, {
				base: { display: "flex" },
			});

			expect(recipe.base!.display).toBe("flex");
			expect(recipe.base!.alignItems).toBe("center");
		});
	});

	describe("filter", () => {
		it("should filter color variants and their compound variants", () => {
			const s = createInstance();
			const recipe = useButtonRecipe(s, {
				filter: { color: ["primary"] },
			});

			expect(Object.keys(recipe.variants!.color)).toEqual(["primary"]);
			expect(
				recipe.compoundVariants!.every(
					(cv) => !cv.match.color || cv.match.color === "primary",
				),
			).toBe(true);
		});
	});
});
