import type { Recipe, StyleframeOptions } from "@styleframe/core";
import { capitalizeFirst } from "@styleframe/core";
import type { ConsumeFunction } from "../../types";
import { isUppercase, toCamelCase } from "../../utils";

/**
 * Generates variant props type from recipe runtime variants.
 * Example output: { color?: "primary" | "secondary"; size?: "sm" | "md" }
 */
function generateVariantPropsType(runtime: Recipe["_runtime"]): string {
	const variants = runtime?.variants;
	if (!variants || Object.keys(variants).length === 0) {
		return "Record<string, never>";
	}

	const entries: Array<string> = [];
	for (const [variantKey, variantOptions] of Object.entries(variants)) {
		if (!variantOptions) {
			continue;
		}
		const optionKeys = Object.keys(variantOptions);
		if (optionKeys.length > 0) {
			const optionUnion = optionKeys.map((k) => `"${k}"`).join(" | ");
			const isBooleanVariant =
				optionKeys.includes("true") && optionKeys.includes("false");
			const typeUnion = isBooleanVariant
				? `${optionUnion} | boolean`
				: optionUnion;
			entries.push(`${variantKey}?: ${typeUnion}`);
		}
	}

	if (entries.length === 0) {
		return "Record<string, never>";
	}

	return `{ ${entries.join("; ")} }`;
}

/**
 * Consumes a recipe instance and generates TypeScript type declaration for it.
 * Outputs the function signature with variant props type.
 */
export function createRecipeConsumer(_consume: ConsumeFunction) {
	return function consumeRecipe(
		instance: Recipe,
		_options: StyleframeOptions,
	): string {
		// Use _exportName if present, otherwise derive from recipe name
		let exportName = instance._exportName;

		if (!exportName) {
			exportName = toCamelCase(instance.name);

			// Handle PascalCase names
			if (instance.name[0] && isUppercase(instance.name[0])) {
				exportName = capitalizeFirst(exportName);
			}
		}

		const variantPropsType = generateVariantPropsType(instance._runtime);
		const propsTypeName = `${capitalizeFirst(exportName)}Props`;

		return `export type ${propsTypeName} = ${variantPropsType};
export const ${exportName}: (props?: ${propsTypeName}) => string;`;
	};
}
