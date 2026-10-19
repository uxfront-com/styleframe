import { styleframe } from "@styleframe/core";
import { useDarkModifier } from "../../modifiers/useMediaPreferenceModifiers";
import {
	useFocusWithinModifier,
	useHoverModifier,
} from "../../modifiers/usePseudoStateModifiers";
import {
	createFieldAddonRecipe,
	createFieldRecipe,
	fieldSurfaceCompoundVariants,
	useFieldSelector,
} from "./createFieldRecipe";

function createInstance() {
	const s = styleframe();
	for (const name of [
		"display",
		"alignItems",
		"flexGrow",
		"flexShrink",
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
		"borderBottomColor",
		"borderBottomLeftRadius",
		"borderBottomRightRadius",
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
		"whiteSpace",
		"userSelect",
		"gap",
	]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
	s.variable("color.text-weakest", "#64748B", { default: true });

	useDarkModifier(s);
	useHoverModifier(s);
	useFocusWithinModifier(s);
	return s;
}

function findSelector(s: ReturnType<typeof styleframe>, query: string) {
	return s.root.children.find(
		(child) =>
			child.type === "selector" && (child as { query: string }).query === query,
	);
}

describe("createFieldRecipe", () => {
	it("builds a wrapper recipe with the shared field surface", () => {
		const s = createInstance();
		const recipe = createFieldRecipe("demo", {
			base: { display: "flex", alignItems: "flex-start" },
		})(s);

		expect(recipe.type).toBe("recipe");
		expect(recipe.name).toBe("demo");

		// caller base deltas + shared base
		expect(recipe.base).toMatchObject({
			display: "flex",
			alignItems: "flex-start",
			borderRadius: "@border-radius.md",
			color: "@color.text",
			"&:focus-within": {
				outlineColor: "@color.primary",
			},
		});

		// shared variant axes + 12 shared compounds + 6 shared defaults
		expect(Object.keys(recipe.variants!)).toEqual([
			"color",
			"variant",
			"size",
			"invalid",
			"disabled",
			"readonly",
		]);
		expect(recipe.compoundVariants).toHaveLength(12);
		expect(recipe.defaultVariants).toEqual({
			color: "neutral",
			variant: "default",
			size: "md",
			invalid: "false",
			disabled: "false",
			readonly: "false",
		});
	});

	it("registers the transparent nested field reset for the given name", () => {
		const s = createInstance();
		createFieldRecipe("demo", {
			base: { display: "flex", alignItems: "flex-start" },
		})(s);

		expect(findSelector(s, ".demo-field")).toBeDefined();
	});

	it("merges per-field extras and runs the extra setup", () => {
		const s = createInstance();
		const recipe = createFieldRecipe(
			"demo",
			{
				base: { display: "flex", alignItems: "flex-start" },
				variants: { tone: { a: {}, b: {} } },
				compoundVariants: [{ match: { tone: "a" }, className: "-tone-a" }],
				defaultVariants: { tone: "a" },
			},
			(s2) => {
				s2.selector(".demo-extra", { color: "red" });
			},
		)(s);

		// extra axis is added alongside the shared ones
		expect(Object.keys(recipe.variants!)).toContain("tone");
		expect(recipe.compoundVariants).toHaveLength(13); // 12 shared + 1 extra
		expect(recipe.defaultVariants).toMatchObject({
			color: "neutral",
			tone: "a",
		});
		expect(findSelector(s, ".demo-extra")).toBeDefined();
	});
});

describe("fieldSurfaceCompoundVariants", () => {
	const compounds = fieldSurfaceCompoundVariants();
	const lastGhost = Math.max(
		...compounds.flatMap((v, i) => (v.match.variant === "ghost" ? [i] : [])),
	);

	// Rest and hover borders per color: `light` and `dark` keep theirs in both
	// modes, `neutral` takes the light pair plain and the dark pair under `&:dark`.
	const light = { rest: "@color.gray-450", hover: "@color.gray-500" };
	const dark = { rest: "@color.gray-500", hover: "@color.gray-450" };

	function bordered(
		[bg, fg, darkBg, darkFg]: string[],
		plain: typeof light,
		inDark: typeof light,
	) {
		return {
			background: bg,
			borderColor: plain.rest,
			color: fg,
			"&:hover": { borderColor: plain.hover },
			"&:dark": { background: darkBg, borderColor: inDark.rest, color: darkFg },
			"&:dark:hover": { borderColor: inDark.hover },
		};
	}

	function ghost(
		[fg, darkFg]: string[],
		plain: typeof light,
		inDark: typeof light,
	) {
		return {
			background: "transparent",
			borderColor: "transparent",
			borderBottomColor: plain.rest,
			borderBottomLeftRadius: "0",
			borderBottomRightRadius: "0",
			color: fg,
			"&:hover": { borderBottomColor: plain.hover },
			"&:dark": {
				background: "transparent",
				borderColor: "transparent",
				borderBottomColor: inDark.rest,
				color: darkFg,
			},
			"&:dark:hover": { borderBottomColor: inDark.hover },
		};
	}

	it.each([
		[
			"light",
			"default",
			bordered(
				["@color.white", "@color.text", "@color.white", "@color.text-inverted"],
				light,
				light,
			),
		],
		[
			"light",
			"soft",
			bordered(
				[
					"@color.gray-100",
					"@color.text",
					"@color.gray-100",
					"@color.text-inverted",
				],
				light,
				light,
			),
		],
		[
			"light",
			"ghost",
			ghost(["@color.text", "@color.text-inverted"], light, light),
		],
		[
			"dark",
			"default",
			bordered(
				["@color.gray-900", "@color.white", "@color.gray-900", "@color.white"],
				dark,
				dark,
			),
		],
		[
			"dark",
			"soft",
			bordered(
				[
					"@color.gray-800",
					"@color.gray-300",
					"@color.gray-800",
					"@color.gray-300",
				],
				dark,
				dark,
			),
		],
		[
			"dark",
			"ghost",
			ghost(["@color.gray-300", "@color.gray-300"], dark, dark),
		],
		[
			"neutral",
			"default",
			bordered(
				["@color.white", "@color.text", "@color.gray-900", "@color.white"],
				light,
				dark,
			),
		],
		[
			"neutral",
			"soft",
			bordered(
				[
					"@color.gray-100",
					"@color.text",
					"@color.gray-800",
					"@color.gray-300",
				],
				light,
				dark,
			),
		],
		["neutral", "ghost", ghost(["@color.text", "@color.white"], light, dark)],
	])(
		"paints the %s %s surface with the 3:1 border tokens",
		(color, variant, css) => {
			const cv = compounds.find(
				(v) => v.match.color === color && v.match.variant === variant,
			);

			expect(cv).toEqual({ match: { color, variant }, css });
		},
	);

	it("paints a ghost invalid bottom border with the error color", () => {
		const invalid = compounds.findIndex((v) => v.match.invalid === "true");

		// A later compound replaces an earlier one's key, so invalid must follow every ghost.
		expect(invalid).toBeGreaterThan(lastGhost);
		expect(compounds[invalid]!.css).toMatchObject({
			borderBottomColor: "@color.error",
			"&:hover": { borderBottomColor: "@color.error" },
			"&:dark": { borderBottomColor: "@color.error" },
			"&:dark:hover": { borderBottomColor: "@color.error" },
		});
	});

	it("gives the read-only state a dashed border after the ghost compounds", () => {
		const readonly = compounds.findIndex((v) => v.match.readonly === "true");

		expect(readonly).toBeGreaterThan(lastGhost);
		expect(compounds[readonly]!.css).toMatchObject({
			background: "@color.gray-50",
			borderStyle: "@border-style.dashed",
			"&:dark": { background: "@color.gray-800" },
		});
	});
});

describe("createFieldAddonRecipe", () => {
	it("uses the trailing padding edge for a prefix", () => {
		const s = createInstance();
		const recipe = createFieldAddonRecipe("demo-prefix", "paddingRight")(s);

		expect(recipe.name).toBe("demo-prefix");
		expect(recipe.variants!.size.md).toEqual({
			fontSize: "@font-size.sm",
			paddingRight: "@0.5",
			gap: "@0.375",
		});
	});

	it("uses the leading padding edge for a suffix", () => {
		const s = createInstance();
		const recipe = createFieldAddonRecipe("demo-suffix", "paddingLeft")(s);

		expect(recipe.variants!.size.md).toEqual({
			fontSize: "@font-size.sm",
			paddingLeft: "@0.5",
			gap: "@0.375",
		});
	});
});

describe("useFieldSelector", () => {
	function findSelector(s: ReturnType<typeof styleframe>, query: string) {
		return s.root.children.find(
			(child) =>
				child.type === "selector" &&
				(child as { query: string }).query === query,
		) as
			| {
					type: "selector";
					query: string;
					declarations: Record<string, unknown>;
			  }
			| undefined;
	}

	it("should register a selector with the given query", () => {
		const s = createInstance();
		useFieldSelector(s, ".input-field");

		expect(findSelector(s, ".input-field")).toBeDefined();
	});

	it("should target whatever field query it is given", () => {
		const s = createInstance();
		useFieldSelector(s, ".textarea-field");

		expect(findSelector(s, ".textarea-field")).toBeDefined();
		expect(findSelector(s, ".input-field")).toBeUndefined();
	});

	it("should apply a transparent, borderless reset", () => {
		const s = createInstance();
		useFieldSelector(s, ".input-field");

		expect(findSelector(s, ".input-field")?.declarations).toMatchObject({
			width: "100%",
			background: "transparent",
			border: "none",
			padding: "0",
		});
	});

	it("should give a disabled field a not-allowed cursor", () => {
		for (const query of [".input-field", ".textarea-field"]) {
			const s = createInstance();
			useFieldSelector(s, query);

			const disabled = (
				findSelector(s, query) as unknown as {
					children: { query: string; declarations: Record<string, unknown> }[];
				}
			).children.find((child) => child.query === "&:disabled");

			expect(disabled?.declarations, query).toEqual({ cursor: "not-allowed" });
		}
	});
});
