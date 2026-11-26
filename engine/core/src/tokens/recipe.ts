import { defaultUtilitySelectorFn } from "../defaults";
import { isRef } from "../typeGuards";
import type {
	Container,
	ModifierDeclarationsBlock,
	ModifierFactory,
	Recipe,
	RecipeRuntime,
	RuntimeModifierDeclarationsBlock,
	RuntimeVariantDeclarationsBlock,
	Root,
	TokenValue,
	UtilityFactory,
	VariantDeclarationsBlock,
	VariantsBase,
} from "../types";
import { getModifier } from "../utils/getters";

/**
 * Creates a recipe function to define design system recipes with variants.
 *
 * @example ```ts
 * recipe({
 *     name: "button",
 *     base: {
 *         borderWidth: ref(borderWidth), // Token reference => Variable<'border-width'> => Auto-generate _border-width
 *         borderStyle: ref(borderStyle), // Token reference => Variable<'border-style'> => Auto-generate _border-style
 *  	   boxShadow: ref(boxShadowMd), // Token reference => Variable<'box-shadow.md'> => Auto-generate _box-shadow:md
 *         'hover:focus': { // Applying hover and focus modifiers
 *             boxShadow: ref(boxShadowSm), // Token reference => Variable<'box-shadow.sm'> => Auto-generate _hover:box-shadow:sm
 *         }
 *     },
 *     variants: {
 *         color: {
 *             primary: {
 *                 background: ref(colorPrimary), // Token reference => Variable<'color.primary'> => Auto-generate _background:primary
 *                 color: ref(colorWhite), // Token reference => Variable<'color.white'> => Auto-generate _color:white
 *                 borderColor: ref(colorPrimaryShade50), // Token reference => Variable<'color.primary-shade-50'> => Auto-generate _border-color:primary-shade-50,
 *             },
 *             secondary: {
 *                 background: "@color.secondary", // Token path => Variable<'color.secondary'> => Auto-generate _background:secondary
 *                 color: "@color.white", // Token path => Variable<'color.white'> => Auto-generate _color:white
 *                 borderColor: "@color.secondary-shade-50", // Token path => Variable<'color.secondary-shade-50'> => Auto-generate _border-color:secondary
 *             },
 * 			   disabled: {
 * 				   false: {},
 * 				   true: {
 * 					   opacity: "@opacity.50", // Token path => Variable<'opacity.50'> => Auto-generate _opacity:50
 * 					   cursor: "not-allowed", // Arbitrary value => Auto-generate _cursor:[not-allowed]
 * 				   }
 *             }
 *         },
 *         size: {
 *             sm: {
 *                 padding: "@spacing.sm", // Token path => Variable<'spacing.sm'> => Auto-generate _padding:sm
 *                 fontSize: "@font-size.sm", // Token path => Variable<'font-size.sm'> => Auto-generate _font-size:sm
 *             },
 *             md: {
 *                 padding: "1rem", // Arbitrary value => Auto-generate _padding:[1rem]
 *                 fontSize: "1rem", // Arbitrary value => Auto-generate _font-size:[1rem]
 *             },
 *             lg: {
 *                 padding: "@spacing.lg", // Token path => Variable<'spacing.lg'> => Auto-generate _padding:lg
 *                 fontSize: "1.25rem", // Arbitrary value => Auto-generate _font-size:[1.25rem]
 *             },
 *         },
 *     },
 *     defaultVariants: {
 * 		   color: "primary",
 * 	       size: "md",
 *     },
 *     compoundVariants: [
 *         {
 *             match: {
 *                 color: "primary",
 *                 disabled: false
 *             },
 *             css: {
 * 				   hover: {
 * 					   background: "@color.primary-shade-50", // Token path => Variable<'color.primary-shade-50'> => Auto-generate _hover:background:primary-shade-50
 * 				   }
 *             },
 *         },
 *         {
 *             match: {
 *                 color: "secondary",
 *                 disabled: false
 *             },
 *             css: {
 * 				   hover: {
 * 					   background: ref(colorSecondaryShade50), // Token reference => Variable<'color.secondary-shade-50'> => Auto-generate _hover:background:secondary-shade-50
 * 				   }
 *             },
 *         },
 *     ],
 *     _runtime: {
 * 	       base: {
 * 				borderWidth: 'default',
 *         		borderStyle: 'default',
 *  	   		boxShadow: 'md',
 *         		'hover:focus': {
 *             		boxShadow: 'sm',
 *         		}
 *         },
 * 	   	   variants: {
 * 			   color: {
 * 				   primary: {
 * 					   background: "primary",
 * 					   color: "white",
 * 					   borderColor: "primary-shade-50",
 * 				   },
 * 				   secondary: {
 * 					   background: "secondary",
 * 					   color: "white",
 * 					   borderColor: "secondary-shade-50",
 * 				   }
 * 			   },
 * 			   disabled: {
 * 				   	false: {},
 * 				   	true: {
 * 					   	opacity: "50",
 * 					   	cursor: "[not-allowed]",
 * 				   	}
 *            },
 *            size: {
 *             		sm: {
 *                 		padding: "sm",
 *                 		fontSize: "sm",
 *             		},
 *             		md: {
 *                 		padding: "[1rem]",
 *                 		fontSize: "[1rem]",
 *             		},
 *             		lg: {
 *                 		padding: "lg",
 *                 		fontSize: "[1.25rem]",
 *             		},
 *         		},
 *          },
 *     		defaultVariants: {
 * 		   		color: "primary",
 * 	       		size: "md",
 *     		},
 *     		compoundVariants: [
 *         		{
 *             		match: {
 *                 		color: "primary",
 *                 		disabled: false
 *             		},
 *             		css: {
 * 				   		hover: {
 * 					   		background: "primary-shade-50",
 * 				   		}
 *             		},
 *         		},
 *         		{
 *             		match: {
 *                 		color: "secondary",
 *                 		disabled: false
 *             		},
 *             		css: {
 * 				   		hover: {
 * 					   		background: 'secondary-shade-50',
 * 				   		}
 *             		},
 *         		},
 *     		],
 *     }
 * });
 * ```
 */
export function createRecipeFunction(_parent: Container, root: Root) {
	return function recipe<Name extends string, Variants extends VariantsBase>(
		options: Omit<Recipe<Name, Variants>, "type">,
	): Recipe<Name, Variants> {
		const instance: Recipe<Name, Variants> = {
			type: "recipe",
			...options,
		};

		// Generate runtime object for efficient class name lookups
		instance._runtime = generateRecipeRuntime(instance, root);

		processRecipeUtilities(instance, root);

		root.recipes.push(instance);
		return instance;
	};
}

/**
 * Resolves a token value to its runtime key using the utility's autogenerate function.
 *
 * @param utilityFactory - The utility factory containing the autogenerate function
 * @param value - The token value to resolve
 * @returns The runtime key string
 */
function resolveRuntimeKey(utilityFactory: UtilityFactory, value: TokenValue): string {
	const autogeneratedEntries = utilityFactory.autogenerate(value);
	const keys = Object.keys(autogeneratedEntries);
	return keys[0] ?? "default";
}

/**
 * Transforms a declarations block to its runtime representation.
 * Replaces token values with their resolved runtime keys.
 *
 * @param declarations - The declarations block to transform
 * @param root - The root object containing utility factories
 * @returns The transformed runtime declarations block
 */
function transformDeclarationsToRuntime(
	declarations: VariantDeclarationsBlock,
	root: Root,
): RuntimeVariantDeclarationsBlock {
	const result: RuntimeVariantDeclarationsBlock = {};

	for (const [key, value] of Object.entries(declarations)) {
		if (isModifierBlock(value)) {
			// Handle modifier blocks (e.g., 'hover:focus': { ... })
			const modifierResult: RuntimeModifierDeclarationsBlock = {};
			for (const [utilityKey, utilityValue] of Object.entries(value)) {
				const utilityFactory = getUtilityFactory(root, utilityKey);
				if (!utilityFactory) {
					throw new Error(
						`[styleframe] Utility "${utilityKey}" not found in registry. Make sure the utility is registered before using it in a recipe.`,
					);
				}
				modifierResult[utilityKey] = resolveRuntimeKey(utilityFactory, utilityValue);
			}
			result[stripSelectorPrefix(key)] = modifierResult;
		} else if (typeof value === "boolean") {
			result[key] = value;
		} else {
			// Regular utility declaration
			const utilityFactory = getUtilityFactory(root, key);
			if (!utilityFactory) {
				throw new Error(
					`[styleframe] Utility "${key}" not found in registry. Make sure the utility is registered before using it in a recipe.`,
				);
			}
			result[key] = resolveRuntimeKey(utilityFactory, value);
		}
	}

	return result;
}

/**
 * Generates the runtime object for a recipe.
 * This object contains resolved runtime keys for efficient class name lookups.
 *
 * @param recipe - The recipe to generate runtime for
 * @param root - The root object containing utility factories
 * @returns The runtime object
 */
export function generateRecipeRuntime<Name extends string, Variants extends VariantsBase>(
	recipe: Recipe<Name, Variants>,
	root: Root,
): RecipeRuntime<Variants> {
	const runtime = {} as RecipeRuntime<Variants>;

	// 1. Transform base declarations
	if (recipe.base) {
		runtime.base = transformDeclarationsToRuntime(recipe.base, root);
	}

	// 2. Transform variants
	if (recipe.variants) {
		const variants = {} as NonNullable<RecipeRuntime<Variants>["variants"]>;
		for (const [variantName, variantGroup] of Object.entries(recipe.variants)) {
			const options = {} as Record<string, RuntimeVariantDeclarationsBlock | null>;
			for (const [optionName, optionDeclarations] of Object.entries(variantGroup)) {
				if (optionDeclarations === null || optionDeclarations === undefined) {
					options[optionName] = null;
				} else {
					options[optionName] = transformDeclarationsToRuntime(
						optionDeclarations as VariantDeclarationsBlock,
						root,
					);
				}
			}
			(variants as Record<string, typeof options>)[variantName] = options;
		}
		runtime.variants = variants;
	}

	// 3. Copy defaultVariants as-is (they're already just strings)
	if (recipe.defaultVariants) {
		runtime.defaultVariants = { ...recipe.defaultVariants };
	}

	// 4. Transform compoundVariants
	if (recipe.compoundVariants) {
		runtime.compoundVariants = recipe.compoundVariants.map((compound) => ({
			match: { ...compound.match },
			...(compound.css ? { css: transformDeclarationsToRuntime(compound.css, root) } : {}),
			...(compound.className ? { className: compound.className } : {}),
		}));
	}

	return runtime;
}

/**
 * Type representing an entry for a utility value with its modifier combination.
 */
type UtilityEntry = {
	value: TokenValue;
	modifiers: Array<string>; // compound modifier as array, e.g., ['hover', 'focus'] for 'hover:focus'
};

/**
 * Checks if a value is a modifier block (an object) vs a primitive declaration value.
 *
 * @param value - The value to check
 * @returns True if the value is a modifier block
 */
function isModifierBlock(
	value: TokenValue | ModifierDeclarationsBlock,
): value is ModifierDeclarationsBlock {
	return !isRef(value) && typeof value === "object" && value !== null;
}

/**
 * Strips the leading "&:" or "&::" CSS selector prefix from a modifier block key.
 * This allows recipe declarations to use CSS-like syntax ("&:hover")
 * interchangeably with bare modifier names ("hover").
 */
function stripSelectorPrefix(key: string): string {
	if (key.startsWith("&::")) {
		return key.slice(3);
	}
	if (key.startsWith("&:")) {
		return key.slice(2);
	}
	return key;
}

/**
 * Collects all values for a given utility key from a declarations block.
 * Handles modifier blocks (one level deep) by extracting compound modifier keys.
 *
 * @param declarations - The declarations block to process
 * @param utilityEntriesMap - Map to accumulate utility key -> entries with values and modifier combinations
 */
function collectDeclarationsValues(
	declarations: VariantDeclarationsBlock,
	utilityEntriesMap: Map<string, Array<UtilityEntry>>,
): void {
	const addUtilityEntry = (utilityKey: string, value: TokenValue, modifiers: Array<string>) => {
		let entries = utilityEntriesMap.get(utilityKey);
		if (!entries) {
			entries = [];
			utilityEntriesMap.set(utilityKey, entries);
		}
		entries.push({ value, modifiers });
	};

	for (const [key, value] of Object.entries(declarations)) {
		if (isModifierBlock(value)) {
			const modifiers = stripSelectorPrefix(key).split(":");
			for (const [utilityKey, utilityValue] of Object.entries(value)) {
				addUtilityEntry(utilityKey, utilityValue, modifiers);
			}
		} else {
			addUtilityEntry(key, value, []);
		}
	}
}

/**
 * Retrieves a utility factory from the root registry by name.
 * Returns undefined if the utility is not found.
 *
 * @param root - The root object containing utility factories
 * @param name - The name of the utility to find
 * @returns The utility factory or undefined
 */
function getUtilityFactory(root: Root, name: string): UtilityFactory | undefined {
	const exactMatch = root.utilities.find((utility) => utility.name === name);
	if (exactMatch) {
		return exactMatch;
	}

	const kebabName = name.replaceAll(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
	return root.utilities.find((utility) => utility.name === kebabName);
}

/**
 * Processes a recipe and creates utilities for all style declarations.
 *
 * This function iterates through all style fields in a recipe:
 * 1. `base` - Root level field key-value pairs
 * 2. `variants.*.*` - Each variant group's options containing field key-value pairs
 * 3. `compoundVariants.*.css` - Each compound variant's css declarations
 *
 * For efficiency, it:
 * - Collects all values needed for each utility key across the entire recipe
 * - Retrieves each utility factory only once
 * - Creates all utility instances in a single call per utility
 *
 * @param recipe - The recipe to process
 * @param root - The root object containing utility factories
 *
 * @example
 * ```ts
 * const buttonRecipe = recipe({
 *   name: "button",
 *   base: { borderWidth: "thin" },
 *   variants: {
 *     size: {
 *       sm: { padding: "0.5rem" },
 *       lg: { padding: "1rem" },
 *     },
 *   },
 * });
 *
 * processRecipeUtilities(buttonRecipe, root);
 * // Creates:
 * // - borderWidth utility with value "thin"
 * // - padding utility with values ["0.5rem", "1rem"]
 * ```
 */
export function processRecipeUtilities(recipe: Recipe, root: Root): void {
	// Map of utility key -> entries with values and modifier combinations
	const utilityEntriesMap = new Map<string, Array<UtilityEntry>>();

	// 1. Process base declarations
	if (recipe.base) {
		collectDeclarationsValues(recipe.base, utilityEntriesMap);
	}

	// 2. Process variants.*.* declarations
	if (recipe.variants) {
		for (const variantGroup of Object.values(recipe.variants)) {
			for (const variantOption of Object.values(variantGroup)) {
				collectDeclarationsValues(variantOption as VariantDeclarationsBlock, utilityEntriesMap);
			}
		}
	}

	// 3. Process compoundVariants.*.css declarations
	if (recipe.compoundVariants) {
		for (const compoundVariant of recipe.compoundVariants) {
			if (compoundVariant.css) {
				collectDeclarationsValues(compoundVariant.css, utilityEntriesMap);
			}
		}
	}

	// Cache for resolved modifier factories
	const modifierCache = new Map<string, ModifierFactory | null>();

	// Create utilities for each collected key
	for (const [utilityKey, entries] of utilityEntriesMap) {
		const utilityFactory = getUtilityFactory(root, utilityKey);

		if (!utilityFactory) {
			throw new Error(
				`[styleframe] Utility "${utilityKey}" not found in registry. Make sure the utility is registered before using it in a recipe.`,
			);
		}

		for (const entry of entries) {
			// Resolve modifier factories from modifier keys (using cache)
			const modifierFactories: Array<ModifierFactory> = [];
			for (const modifier of entry.modifiers) {
				if (!modifierCache.has(modifier)) {
					try {
						modifierCache.set(modifier, getModifier(root, modifier));
					} catch {
						throw new Error(
							`[styleframe] Modifier "${modifier}" not found in registry. Make sure the modifier is registered before using it in a recipe.`,
						);
					}
				}

				const modifierFactory = modifierCache.get(modifier);
				if (modifierFactory) {
					modifierFactories.push(modifierFactory);
				}
			}

			const generated = utilityFactory.autogenerate(entry.value);
			for (const key of Object.keys(generated)) {
				const selectorString = defaultUtilitySelectorFn({
					name: utilityFactory.name,
					value: key,
					modifiers: entry.modifiers,
				});

				let recipeUtilities = root._usage.recipeUtilities.get(recipe.name);
				if (!recipeUtilities) {
					recipeUtilities = new Set();
					root._usage.recipeUtilities.set(recipe.name, recipeUtilities);
				}
				recipeUtilities.add(selectorString);
			}

			// Call create with the value and modifiers (if any)
			// Compound modifiers (e.g. "hover:focus") are passed as a nested array
			// so they are applied together, not as separate individual modifiers
			utilityFactory.create(
				[entry.value],
				modifierFactories.length > 0
					? modifierFactories.length > 1
						? [modifierFactories]
						: modifierFactories
					: undefined,
			);
		}
	}
}

/**
 * Promotes recipe utility class names from `_usage.recipeUtilities` into `_usage.utilities`.
 *
 * When called without `recipeNames`, promotes all recipes (backward-compatible default).
 * When called with a set of recipe names, only promotes matching entries.
 */
export function registerRecipeUtilities(root: Root, recipeNames?: Set<string>): void {
	for (const [name, classNames] of root._usage.recipeUtilities) {
		if (!recipeNames || recipeNames.has(name)) {
			for (const className of classNames) {
				root._usage.utilities.add(className);
			}
		}
	}
}
