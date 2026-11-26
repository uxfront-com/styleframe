import type { Root, StyleframeOptions } from "@styleframe/core";
import {
	createRecipeFunction,
	createRefFunction,
	createRoot,
	createUtilityFunction,
	createVariableFunction,
} from "@styleframe/core";

import { createRecipeConsumer } from "./recipe";

describe("createRecipeConsumer", () => {
	const mockConsume = vi.fn();
	const consumeRecipe = createRecipeConsumer(mockConsume);
	const options: StyleframeOptions = {};

	let root: Root;
	let recipe: ReturnType<typeof createRecipeFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;
	let variable: ReturnType<typeof createVariableFunction>;
	let ref: ReturnType<typeof createRefFunction>;

	beforeEach(() => {
		mockConsume.mockClear();
		root = createRoot();
		recipe = createRecipeFunction(root, root);
		utility = createUtilityFunction(root, root);
		variable = createVariableFunction(root, root);
		ref = createRefFunction(root, root);
	});

	it("should generate basic recipe with arbitrary values", () => {
		utility("cursor", ({ value }) => ({ cursor: value }));

		const instance = recipe({
			name: "button",
			base: { cursor: "pointer" },
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const buttonRecipe = {
    "base": {
        "cursor": "[pointer]"
    },
    "variants": {}
} as const satisfies RecipeRuntime;

export type ButtonProps = RecipeVariantProps<typeof buttonRecipe>;
export const button = createRecipe("button", buttonRecipe);
`);
	});

	it("should generate recipe with @ token references", () => {
		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("borderStyle", ({ value }) => ({ borderStyle: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));

		const instance = recipe({
			name: "button",
			base: {
				borderWidth: "@border.width.thin",
				borderStyle: "@border.style.solid",
			},
			variants: {
				color: {
					primary: {
						background: "@color.primary",
						color: "@color.white",
					},
					secondary: {
						background: "@color.secondary",
						color: "@color.white",
					},
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const buttonRecipe = {
    "base": {
        "borderWidth": "border.width.thin",
        "borderStyle": "border.style.solid"
    },
    "variants": {
        "color": {
            "primary": {
                "background": "color.primary",
                "color": "color.white"
            },
            "secondary": {
                "background": "color.secondary",
                "color": "color.white"
            }
        }
    }
} as const satisfies RecipeRuntime;

export type ButtonProps = RecipeVariantProps<typeof buttonRecipe>;
export const button = createRecipe("button", buttonRecipe);
`);
	});

	it("should generate recipe with ref() using variables", () => {
		const colorPrimary = variable("color.primary", "#007bff");
		const colorWhite = variable("color.white", "#ffffff");
		const colorSecondary = variable("color.secondary", "#6c757d");
		const spacingSm = variable("spacing.sm", "0.5rem");
		const spacingMd = variable("spacing.md", "1rem");

		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "button",
			base: {},
			variants: {
				color: {
					primary: {
						background: ref(colorPrimary),
						color: ref(colorWhite),
					},
					secondary: {
						background: ref(colorSecondary),
						color: ref(colorWhite),
					},
				},
				size: {
					sm: { padding: ref(spacingSm) },
					md: { padding: ref(spacingMd) },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const buttonRecipe = {
    "base": {},
    "variants": {
        "color": {
            "primary": {
                "background": "color.primary",
                "color": "color.white"
            },
            "secondary": {
                "background": "color.secondary",
                "color": "color.white"
            }
        },
        "size": {
            "sm": {
                "padding": "spacing.sm"
            },
            "md": {
                "padding": "spacing.md"
            }
        }
    }
} as const satisfies RecipeRuntime;

export type ButtonProps = RecipeVariantProps<typeof buttonRecipe>;
export const button = createRecipe("button", buttonRecipe);
`);
	});

	it("should generate recipe with mixed arbitrary values and refs", () => {
		const colorPrimary = variable("color.primary", "#007bff");

		utility("display", ({ value }) => ({ display: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "card",
			base: {
				display: "block",
				background: ref(colorPrimary),
				padding: "1rem",
			},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const cardRecipe = {
    "base": {
        "display": "[block]",
        "background": "color.primary",
        "padding": "[1rem]"
    },
    "variants": {}
} as const satisfies RecipeRuntime;

export type CardProps = RecipeVariantProps<typeof cardRecipe>;
export const card = createRecipe("card", cardRecipe);
`);
	});

	it("should generate recipe with defaultVariants using refs", () => {
		const borderRadiusSm = variable("border.radius.sm", "4px");
		const colorPrimary = variable("color.primary", "#007bff");
		const colorSecondary = variable("color.secondary", "#6c757d");
		const fontSizeSm = variable("font.size.sm", "12px");
		const fontSizeMd = variable("font.size.md", "14px");

		utility("borderRadius", ({ value }) => ({ borderRadius: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("fontSize", ({ value }) => ({ fontSize: value }));

		const instance = recipe({
			name: "chip",
			base: { borderRadius: ref(borderRadiusSm) },
			variants: {
				variant: {
					filled: { background: ref(colorPrimary) },
					outline: { background: ref(colorSecondary) },
				},
				size: {
					sm: { fontSize: ref(fontSizeSm) },
					md: { fontSize: ref(fontSizeMd) },
				},
			},
			defaultVariants: {
				variant: "filled",
				size: "sm",
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const chipRecipe = {
    "base": {
        "borderRadius": "border.radius.sm"
    },
    "variants": {
        "variant": {
            "filled": {
                "background": "color.primary"
            },
            "outline": {
                "background": "color.secondary"
            }
        },
        "size": {
            "sm": {
                "fontSize": "font.size.sm"
            },
            "md": {
                "fontSize": "font.size.md"
            }
        }
    },
    "defaultVariants": {
        "variant": "filled",
        "size": "sm"
    }
} as const satisfies RecipeRuntime;

export type ChipProps = RecipeVariantProps<typeof chipRecipe>;
export const chip = createRecipe("chip", chipRecipe);
`);
	});

	it("should generate recipe with compoundVariants using @ references", () => {
		utility("display", ({ value }) => ({ display: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("border", ({ value }) => ({ border: value }));
		utility("padding", ({ value }) => ({ padding: value }));
		utility("fontSize", ({ value }) => ({ fontSize: value }));
		utility("fontWeight", ({ value }) => ({ fontWeight: value }));

		const instance = recipe({
			name: "badge",
			base: { display: "inline-block" },
			variants: {
				variant: {
					solid: { background: "@color.blue" },
					outline: { border: "@border.solid.blue" },
				},
				size: {
					sm: { padding: "@spacing.xs" },
					lg: { padding: "@spacing.md" },
				},
			},
			compoundVariants: [
				{
					match: { variant: "solid", size: "sm" },
					css: { fontSize: "@font.size.xs" },
				},
				{
					match: { variant: "outline", size: "lg" },
					css: { fontSize: "@font.size.lg", fontWeight: "@font.weight.bold" },
				},
			],
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const badgeRecipe = {
    "base": {
        "display": "[inline-block]"
    },
    "variants": {
        "variant": {
            "solid": {
                "background": "color.blue"
            },
            "outline": {
                "border": "border.solid.blue"
            }
        },
        "size": {
            "sm": {
                "padding": "spacing.xs"
            },
            "lg": {
                "padding": "spacing.md"
            }
        }
    },
    "compoundVariants": [
        {
            "match": {
                "variant": "solid",
                "size": "sm"
            },
            "css": {
                "fontSize": "font.size.xs"
            }
        },
        {
            "match": {
                "variant": "outline",
                "size": "lg"
            },
            "css": {
                "fontSize": "font.size.lg",
                "fontWeight": "font.weight.bold"
            }
        }
    ]
} as const satisfies RecipeRuntime;

export type BadgeProps = RecipeVariantProps<typeof badgeRecipe>;
export const badge = createRecipe("badge", badgeRecipe);
`);
	});

	it("should generate recipe with both defaultVariants and compoundVariants using refs", () => {
		const borderWidth = variable("border.width.default", "1px");
		const borderStyle = variable("border.style.solid", "solid");
		const colorGray = variable("color.gray", "#6c757d");
		const colorTransparent = variable("color.transparent", "transparent");
		const heightSm = variable("height.sm", "32px");
		const heightLg = variable("height.lg", "48px");
		const spacingMd = variable("spacing.md", "16px");
		const fontSizeLg = variable("font.size.lg", "18px");

		utility("borderWidth", ({ value }) => ({ borderWidth: value }));
		utility("borderStyle", ({ value }) => ({ borderStyle: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("height", ({ value }) => ({ height: value }));
		utility("padding", ({ value }) => ({ padding: value }));
		utility("fontSize", ({ value }) => ({ fontSize: value }));

		const instance = recipe({
			name: "input",
			base: {
				borderWidth: ref(borderWidth),
				borderStyle: ref(borderStyle),
			},
			variants: {
				variant: {
					filled: { background: ref(colorGray) },
					outline: { background: ref(colorTransparent) },
				},
				size: {
					sm: { height: ref(heightSm) },
					lg: { height: ref(heightLg) },
				},
			},
			defaultVariants: {
				variant: "outline",
				size: "sm",
			},
			compoundVariants: [
				{
					match: { variant: "filled", size: "lg" },
					css: {
						padding: ref(spacingMd),
						fontSize: ref(fontSizeLg),
					},
				},
			],
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const inputRecipe = {
    "base": {
        "borderWidth": "border.width.default",
        "borderStyle": "border.style.solid"
    },
    "variants": {
        "variant": {
            "filled": {
                "background": "color.gray"
            },
            "outline": {
                "background": "color.transparent"
            }
        },
        "size": {
            "sm": {
                "height": "height.sm"
            },
            "lg": {
                "height": "height.lg"
            }
        }
    },
    "defaultVariants": {
        "variant": "outline",
        "size": "sm"
    },
    "compoundVariants": [
        {
            "match": {
                "variant": "filled",
                "size": "lg"
            },
            "css": {
                "padding": "spacing.md",
                "fontSize": "font.size.lg"
            }
        }
    ]
} as const satisfies RecipeRuntime;

export type InputProps = RecipeVariantProps<typeof inputRecipe>;
export const input = createRecipe("input", inputRecipe);
`);
	});

	it("should generate recipe with empty _runtime when no utilities registered", () => {
		const instance = recipe({
			name: "minimal",
			base: {},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const minimalRecipe = {
    "base": {},
    "variants": {}
} as const satisfies RecipeRuntime;

export type MinimalProps = RecipeVariantProps<typeof minimalRecipe>;
export const minimal = createRecipe("minimal", minimalRecipe);
`);
	});

	it("should generate recipe with empty variants using @ references in base", () => {
		utility("padding", ({ value }) => ({ padding: value }));
		utility("margin", ({ value }) => ({ margin: value }));

		const instance = recipe({
			name: "simple",
			base: {
				padding: "@spacing.md",
				margin: "@spacing.none",
			},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const simpleRecipe = {
    "base": {
        "padding": "spacing.md",
        "margin": "spacing.none"
    },
    "variants": {}
} as const satisfies RecipeRuntime;

export type SimpleProps = RecipeVariantProps<typeof simpleRecipe>;
export const simple = createRecipe("simple", simpleRecipe);
`);
	});

	it("should handle recipe names with PascalCase using refs", () => {
		const colorPointer = variable("cursor.pointer", "pointer");

		utility("cursor", ({ value }) => ({ cursor: value }));

		const instance = recipe({
			name: "PrimaryButton",
			base: { cursor: ref(colorPointer) },
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const PrimaryButtonRecipe = {
    "base": {
        "cursor": "cursor.pointer"
    },
    "variants": {}
} as const satisfies RecipeRuntime;

export type PrimaryButtonProps = RecipeVariantProps<typeof PrimaryButtonRecipe>;
export const PrimaryButton = createRecipe("PrimaryButton", PrimaryButtonRecipe);
`);
	});

	it("should handle recipe names with camelCase", () => {
		utility("cursor", ({ value }) => ({ cursor: value }));

		const instance = recipe({
			name: "primaryButton",
			base: { cursor: "@cursor.pointer" },
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const primaryButtonRecipe = {
    "base": {
        "cursor": "cursor.pointer"
    },
    "variants": {}
} as const satisfies RecipeRuntime;

export type PrimaryButtonProps = RecipeVariantProps<typeof primaryButtonRecipe>;
export const primaryButton = createRecipe("primaryButton", primaryButtonRecipe);
`);
	});

	it("should handle recipe names with kebab-case", () => {
		utility("cursor", ({ value }) => ({ cursor: value }));

		const instance = recipe({
			name: "primary-button",
			base: { cursor: "@cursor.pointer" },
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const primaryButtonRecipe = {
    "base": {
        "cursor": "cursor.pointer"
    },
    "variants": {}
} as const satisfies RecipeRuntime;

export type PrimaryButtonProps = RecipeVariantProps<typeof primaryButtonRecipe>;
export const primaryButton = createRecipe("primary-button", primaryButtonRecipe);
`);
	});

	it("should handle recipe with complex nested variant declarations using refs", () => {
		const spacingMd = variable("spacing.md", "1rem");
		const radiusSm = variable("radius.sm", "4px");

		const colorInfoBg = variable("color.info.bg", "#e3f2fd");
		const colorInfoText = variable("color.info.text", "#0288d1");
		const colorInfoBorder = variable("color.info.border", "#0288d1");

		const colorWarningBg = variable("color.warning.bg", "#fff3e0");
		const colorWarningText = variable("color.warning.text", "#f57c00");
		const colorWarningBorder = variable("color.warning.border", "#f57c00");

		const colorErrorBg = variable("color.error.bg", "#ffebee");
		const colorErrorText = variable("color.error.text", "#d32f2f");
		const colorErrorBorder = variable("color.error.border", "#d32f2f");

		const colorSuccessBg = variable("color.success.bg", "#e8f5e9");
		const colorSuccessText = variable("color.success.text", "#388e3c");
		const colorSuccessBorder = variable("color.success.border", "#388e3c");

		utility("padding", ({ value }) => ({ padding: value }));
		utility("borderRadius", ({ value }) => ({ borderRadius: value }));
		utility("display", ({ value }) => ({ display: value }));
		utility("alignItems", ({ value }) => ({ alignItems: value }));
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));
		utility("borderColor", ({ value }) => ({ borderColor: value }));

		const instance = recipe({
			name: "alert",
			base: {
				padding: ref(spacingMd),
				borderRadius: ref(radiusSm),
				display: "flex",
				alignItems: "center",
			},
			variants: {
				severity: {
					info: {
						background: ref(colorInfoBg),
						color: ref(colorInfoText),
						borderColor: ref(colorInfoBorder),
					},
					warning: {
						background: ref(colorWarningBg),
						color: ref(colorWarningText),
						borderColor: ref(colorWarningBorder),
					},
					error: {
						background: ref(colorErrorBg),
						color: ref(colorErrorText),
						borderColor: ref(colorErrorBorder),
					},
					success: {
						background: ref(colorSuccessBg),
						color: ref(colorSuccessText),
						borderColor: ref(colorSuccessBorder),
					},
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const alertRecipe = {
    "base": {
        "padding": "spacing.md",
        "borderRadius": "radius.sm",
        "display": "[flex]",
        "alignItems": "[center]"
    },
    "variants": {
        "severity": {
            "info": {
                "background": "color.info.bg",
                "color": "color.info.text",
                "borderColor": "color.info.border"
            },
            "warning": {
                "background": "color.warning.bg",
                "color": "color.warning.text",
                "borderColor": "color.warning.border"
            },
            "error": {
                "background": "color.error.bg",
                "color": "color.error.text",
                "borderColor": "color.error.border"
            },
            "success": {
                "background": "color.success.bg",
                "color": "color.success.text",
                "borderColor": "color.success.border"
            }
        }
    }
} as const satisfies RecipeRuntime;

export type AlertProps = RecipeVariantProps<typeof alertRecipe>;
export const alert = createRecipe("alert", alertRecipe);
`);
	});

	it("should correctly format recipe constant name with ref values", () => {
		const displayBlock = variable("display.block", "block");

		utility("display", ({ value }) => ({ display: value }));

		const instance = recipe({
			name: "myComponent",
			base: { display: ref(displayBlock) },
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain("const myComponentRecipe = {");
		expect(result).toContain(
			"export type MyComponentProps = RecipeVariantProps<typeof myComponentRecipe>;",
		);
		expect(result).toContain(
			`export const myComponent = createRecipe("myComponent", myComponentRecipe);`,
		);
	});

	it("should preserve all _runtime properties in JSON stringification", () => {
		const displayBlock = variable("display.block", "block");
		const widthSm = variable("width.sm", "100px");
		const widthLg = variable("width.lg", "200px");
		const fontWeightBold = variable("font.weight.bold", "700");

		utility("display", ({ value }) => ({ display: value }));
		utility("width", ({ value }) => ({ width: value }));
		utility("fontWeight", ({ value }) => ({ fontWeight: value }));

		const instance = recipe({
			name: "complete",
			base: { display: ref(displayBlock) },
			variants: {
				size: {
					sm: { width: ref(widthSm) },
					lg: { width: ref(widthLg) },
				},
			},
			defaultVariants: { size: "sm" },
			compoundVariants: [
				{
					match: { size: "lg" },
					css: { fontWeight: ref(fontWeightBold) },
				},
			],
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain('"base"');
		expect(result).toContain('"variants"');
		expect(result).toContain('"defaultVariants"');
		expect(result).toContain('"compoundVariants"');
		expect(result).not.toContain('"type": "recipe"');
		expect(result).not.toContain('"name": "complete"');
	});

	it("should use 4-space indentation in JSON output with refs", () => {
		const spacingMd = variable("spacing.md", "1rem");
		const fontSizeSm = variable("font.size.sm", "12px");

		utility("padding", ({ value }) => ({ padding: value }));
		utility("fontSize", ({ value }) => ({ fontSize: value }));

		const instance = recipe({
			name: "indented",
			base: { padding: ref(spacingMd) },
			variants: {
				size: {
					sm: { fontSize: ref(fontSizeSm) },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		// Check for 4-space indentation
		expect(result).toContain('    "base": {');
		expect(result).toContain('        "padding": "spacing.md"');
	});

	it("should not call the consume function parameter", () => {
		const instance = recipe({
			name: "test",
			base: {},
			variants: {},
		});

		consumeRecipe(instance, options);

		expect(mockConsume).not.toHaveBeenCalled();
	});

	it("should work with different options using refs", () => {
		const cursorPointer = variable("cursor.pointer", "pointer");

		utility("cursor", ({ value }) => ({ cursor: value }));

		const instance = recipe({
			name: "button",
			base: { cursor: ref(cursorPointer) },
			variants: {},
		});

		const customOptions: StyleframeOptions = {};
		const result = consumeRecipe(instance, customOptions);

		expect(result).toEqual(`const buttonRecipe = {
    "base": {
        "cursor": "cursor.pointer"
    },
    "variants": {}
} as const satisfies RecipeRuntime;

export type ButtonProps = RecipeVariantProps<typeof buttonRecipe>;
export const button = createRecipe("button", buttonRecipe);
`);
	});

	it("should handle recipe with single variant group using @ references", () => {
		utility("display", ({ value }) => ({ display: value }));
		utility("background", ({ value }) => ({ background: value }));

		const instance = recipe({
			name: "toggle",
			base: { display: "@display.inline-block" },
			variants: {
				state: {
					on: { background: "@color.success" },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const toggleRecipe = {
    "base": {
        "display": "display.inline-block"
    },
    "variants": {
        "state": {
            "on": {
                "background": "color.success"
            }
        }
    }
} as const satisfies RecipeRuntime;

export type ToggleProps = RecipeVariantProps<typeof toggleRecipe>;
export const toggle = createRecipe("toggle", toggleRecipe);
`);
	});

	it("should handle recipe with empty variant declarations using refs", () => {
		const opacityHalf = variable("opacity.50", "0.5");
		const opacityFull = variable("opacity.100", "1");

		utility("opacity", ({ value }) => ({ opacity: value }));

		const instance = recipe({
			name: "placeholder",
			base: { opacity: ref(opacityHalf) },
			variants: {
				state: {
					empty: {},
					filled: { opacity: ref(opacityFull) },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const placeholderRecipe = {
    "base": {
        "opacity": "opacity.50"
    },
    "variants": {
        "state": {
            "empty": {},
            "filled": {
                "opacity": "opacity.100"
            }
        }
    }
} as const satisfies RecipeRuntime;

export type PlaceholderProps = RecipeVariantProps<typeof placeholderRecipe>;
export const placeholder = createRecipe("placeholder", placeholderRecipe);
`);
	});

	it("should handle recipe with multiple compound variants using @ references", () => {
		utility("justifyContent", ({ value }) => ({ justifyContent: value }));
		utility("alignItems", ({ value }) => ({ alignItems: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "matrix",
			base: {},
			variants: {
				x: {
					left: { justifyContent: "@justify.start" },
					right: { justifyContent: "@justify.end" },
				},
				y: {
					top: { alignItems: "@align.start" },
					bottom: { alignItems: "@align.end" },
				},
			},
			compoundVariants: [
				{
					match: { x: "left", y: "top" },
					css: { padding: "@spacing.top-left" },
				},
				{
					match: { x: "right", y: "bottom" },
					css: { padding: "@spacing.bottom-right" },
				},
				{
					match: { x: "left", y: "bottom" },
					css: { padding: "@spacing.bottom-left" },
				},
			],
		});

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const matrixRecipe = {
    "base": {},
    "variants": {
        "x": {
            "left": {
                "justifyContent": "justify.start"
            },
            "right": {
                "justifyContent": "justify.end"
            }
        },
        "y": {
            "top": {
                "alignItems": "align.start"
            },
            "bottom": {
                "alignItems": "align.end"
            }
        }
    },
    "compoundVariants": [
        {
            "match": {
                "x": "left",
                "y": "top"
            },
            "css": {
                "padding": "spacing.top-left"
            }
        },
        {
            "match": {
                "x": "right",
                "y": "bottom"
            },
            "css": {
                "padding": "spacing.bottom-right"
            }
        },
        {
            "match": {
                "x": "left",
                "y": "bottom"
            },
            "css": {
                "padding": "spacing.bottom-left"
            }
        }
    ]
} as const satisfies RecipeRuntime;

export type MatrixProps = RecipeVariantProps<typeof matrixRecipe>;
export const matrix = createRecipe("matrix", matrixRecipe);
`);
	});

	it("should handle recipe with custom autogenerate extracting token keys", () => {
		// Custom autogenerate that extracts only the last part of token path
		utility("background", ({ value }) => ({ background: value }), {
			autogenerate: (value) => {
				if (typeof value === "string" && value.startsWith("@")) {
					const fullName = value.slice(1);
					const shortName = fullName.split(".").pop() ?? fullName;
					return { [shortName]: { type: "reference", name: fullName } };
				}
				return { [`[${value}]`]: value };
			},
		});
		utility("color", ({ value }) => ({ color: value }), {
			autogenerate: (value) => {
				if (typeof value === "string" && value.startsWith("@")) {
					const fullName = value.slice(1);
					const shortName = fullName.split(".").pop() ?? fullName;
					return { [shortName]: { type: "reference", name: fullName } };
				}
				return { [`[${value}]`]: value };
			},
		});

		const instance = recipe({
			name: "themed",
			base: {
				background: "@color.primary",
				color: "@color.white",
			},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain('"background": "primary"');
		expect(result).toContain('"color": "white"');
	});

	it("should generate correct TypeScript type annotation", () => {
		const instance = recipe({
			name: "typed",
			base: {},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain("const typedRecipe = {");
	});

	it("should generate correct export statement", () => {
		const instance = recipe({
			name: "exported",
			base: {},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain(
			"export type ExportedProps = RecipeVariantProps<typeof exportedRecipe>;",
		);
		expect(result).toContain(`export const exported = createRecipe("exported", exportedRecipe);`);
	});

	it("should handle recipe without _runtime by outputting empty object", () => {
		// Create a recipe, then remove _runtime to test fallback
		const bareRoot = createRoot();
		const bareUtility = createUtilityFunction(bareRoot, bareRoot);
		bareUtility("display", ({ value }) => ({ display: value }));
		const bareRecipe = createRecipeFunction(bareRoot, bareRoot);

		const instance = bareRecipe({
			name: "noRuntime",
			base: { display: "block" },
			variants: {},
		});

		// Manually remove _runtime to test fallback
		delete instance._runtime;

		const result = consumeRecipe(instance, options);

		expect(result).toEqual(`const noRuntimeRecipe = {} as const satisfies RecipeRuntime;

export type NoRuntimeProps = RecipeVariantProps<typeof noRuntimeRecipe>;
export const noRuntime = createRecipe("noRuntime", noRuntimeRecipe);
`);
	});

	it("should handle ref() with string name directly", () => {
		utility("background", ({ value }) => ({ background: value }));
		utility("color", ({ value }) => ({ color: value }));

		const instance = recipe({
			name: "stringRef",
			base: {
				background: ref("color.primary"),
				color: ref("color.white"),
			},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain('"background": "color.primary"');
		expect(result).toContain('"color": "color.white"');
	});
});
