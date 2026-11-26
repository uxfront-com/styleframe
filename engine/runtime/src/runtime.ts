import type {
	PrimitiveTokenValue,
	RecipeRuntime,
	RecipeVariantProps,
	RuntimeModifierDeclarationsBlock,
	RuntimeVariantDeclarationsBlock,
	RuntimeVariantDeclarationsValue,
	RuntimeVariantOptions,
	ShorteningMap,
} from "./types";

/**
 * Converts a utility name and value to a class name string.
 * Format: _utility-name:value or _modifier:utility-name:value
 *
 * @param utilityName - The name of the utility (e.g., "borderWidth", "padding")
 * @param value - The value of the utility (e.g., "thin", "sm", "2")
 * @param modifiers - Optional array of modifier prefixes (e.g., ["hover", "focus"])
 * @returns The formatted class name (e.g., "_border-width:thin" or "_hover:border-width:thin")
 */
function toClassName(
	utilityName: string,
	value: string | boolean,
	modifiers: Array<string> = [],
	shortMap?: ShorteningMap,
): string {
	const kebabName = utilityName.replaceAll(
		/[A-Z]/g,
		(letter) => `-${letter.toLowerCase()}`,
	);

	const resolvedUtilityName = shortMap?.p[kebabName] ?? kebabName;
	const resolvedModifiers = shortMap
		? modifiers.map((m) => shortMap.m[m] ?? m)
		: modifiers;
	const modifierPrefix =
		resolvedModifiers.length > 0 ? `${resolvedModifiers.join(":")}:` : "";

	if (value === true) {
		return `_${modifierPrefix}${resolvedUtilityName}`;
	}

	const resolvedValue =
		shortMap && typeof value === "string"
			? (shortMap.v[value] ?? value)
			: value;

	return `_${modifierPrefix}${resolvedUtilityName}:${resolvedValue}`;
}

/**
 * Checks if a value is a modifier block (an object) vs a primitive declaration value.
 *
 * @param value - The value to check
 * @returns True if the value is a modifier block
 */
/**
 * Resolves a variant value from props, coercing booleans to strings.
 * Falls back to defaultVariants if the prop is not provided.
 */
function resolveVariantValue(
	props: Record<string, string | boolean>,
	variantKey: string,
	defaultVariants?: Record<string, string>,
): string | undefined {
	const raw = props[variantKey];
	return (
		(raw !== undefined ? String(raw) : undefined) ??
		defaultVariants?.[variantKey]
	);
}

function isModifierBlock(
	value: RuntimeVariantDeclarationsValue,
): value is RuntimeModifierDeclarationsBlock {
	return typeof value === "object" && value !== null;
}

/**
 * Processes a runtime declarations block and adds entries to the declarations map.
 * Handles modifier blocks (one level deep) by extracting modifier keys.
 *
 * @param declarations - The runtime declarations block to process (already resolved values)
 * @param declarationsMap - Map to accumulate utility declarations
 */
function processDeclarationsBlock(
	declarations: RuntimeVariantDeclarationsBlock,
	declarationsMap: Map<
		string,
		{ value: PrimitiveTokenValue; modifiers: Array<string> }
	>,
): void {
	for (const [key, value] of Object.entries(declarations)) {
		if (isModifierBlock(value)) {
			// Key is a modifier (e.g., 'hover', 'hover:focus')
			// Split compound modifiers into individual keys
			const modifierKeys = key.split(":");

			// Process the modifier block's utility declarations (one level only)
			for (const [utilityKey, utilityValue] of Object.entries(value)) {
				const mapKey = `${modifierKeys.join(":")}:${utilityKey}`;
				declarationsMap.set(mapKey, {
					value: utilityValue as string | boolean,
					modifiers: modifierKeys,
				});
			}
		} else {
			// Key is a utility name, value is the declaration value
			declarationsMap.set(key, { value, modifiers: [] });
		}
	}
}

/**
 * Creates a runtime recipe function that generates utility class strings based on variant props.
 *
 * The function:
 * 1. Applies the recipe name as the base class
 * 2. Applies all base declarations
 * 3. Applies variant declarations based on props (with defaultVariants as fallback)
 * 4. Applies compound variants if all conditions match
 * 5. Later declarations override earlier ones
 *
 * @param name - The recipe name (used as the base class)
 * @param runtime - The pre-computed RecipeRuntime object with resolved values
 * @returns A function that accepts variant props and returns a className string
 *
 * @example
 * ```ts
 * const buttonRuntime: RecipeRuntime = {
 *     base: {
 *         borderWidth: "thin",
 *         borderStyle: "[solid]",
 *     },
 *     variants: {
 *         color: {
 *             primary: { background: "primary", color: "white" },
 *             secondary: { background: "secondary", color: "white" },
 *         },
 *         size: {
 *             sm: { padding: "[10px]" },
 *             md: { padding: "2" },
 *         },
 *     },
 *     defaultVariants: {
 *         color: "primary",
 *         size: "md",
 *     },
 * };
 *
 * const button = createRecipe("button", buttonRuntime);
 * button({}); // "button _border-width:thin _border-style:[solid] _background:primary _color:white _padding:2"
 * button({ color: "secondary" }); // "button _border-width:thin _border-style:[solid] _background:secondary _color:white _padding:2"
 * ```
 */
export function createRecipe<R extends RecipeRuntime>(
	name: string,
	runtime: R,
	shortMap?: ShorteningMap,
): (props?: RecipeVariantProps<R>) => string {
	return (props = {} as RecipeVariantProps<R>) => {
		// Track all declarations in a map to handle overrides
		// Key: utility name (possibly with modifier prefix), Value: { value, modifiers }
		const declarationsMap = new Map<
			string,
			{ value: string | boolean; modifiers: Array<string> }
		>();

		// 1. Apply base declarations
		if (runtime.base) {
			processDeclarationsBlock(runtime.base, declarationsMap);
		}

		// 2. Apply variant declarations (with defaultVariants as fallback)
		if (runtime.variants) {
			for (const [variantKey, variantOptions] of Object.entries(
				runtime.variants,
			)) {
				// Get the selected variant value from props or defaultVariants
				const selectedVariant = resolveVariantValue(
					props as Record<string, string | boolean>,
					variantKey,
					runtime.defaultVariants as Record<string, string> | undefined,
				);

				const options = variantOptions as RuntimeVariantOptions;
				const declarations = selectedVariant
					? options[selectedVariant]
					: undefined;

				if (declarations) {
					processDeclarationsBlock(declarations, declarationsMap);
				}
			}
		}

		// 3. Apply compound variants if conditions match
		const compoundClassNames: Array<string> = [];
		if (runtime.compoundVariants) {
			for (const compoundVariant of runtime.compoundVariants) {
				// Check if all variant conditions match
				let allConditionsMatch = true;

				for (const [variantKey, variantValue] of Object.entries(
					compoundVariant.match,
				)) {
					// Get the selected variant value from props or defaultVariants
					const selectedVariant = resolveVariantValue(
						props as Record<string, string | boolean>,
						variantKey,
						runtime.defaultVariants as Record<string, string> | undefined,
					);

					if (selectedVariant !== variantValue) {
						allConditionsMatch = false;
						break;
					}
				}

				// If all conditions match, apply the compound variant declarations and className
				if (allConditionsMatch) {
					if (compoundVariant.css) {
						processDeclarationsBlock(compoundVariant.css, declarationsMap);
					}
					if (compoundVariant.className) {
						compoundClassNames.push(compoundVariant.className);
					}
				}
			}
		}

		// 4. Build the final class name string
		const classNames: Array<string> = [name];

		// Convert declarations map to class names
		// Extract the utility name from the map key (remove modifier prefix if present)
		for (const [key, { value, modifiers }] of declarationsMap.entries()) {
			// The key might be "hover:focus:padding" or just "padding"
			// We need to extract just the utility name for toClassName
			const utilityName =
				modifiers.length > 0 ? key.slice(modifiers.join(":").length + 1) : key;
			classNames.push(toClassName(utilityName, value, modifiers, shortMap));
		}

		// Append compound variant classNames after utility classes
		classNames.push(...compoundClassNames);

		return classNames.join(" ");
	};
}
