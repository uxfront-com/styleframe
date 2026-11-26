import type {
	ContainerChild,
	Root,
	Selector,
	StyleframeOptions,
} from "@styleframe/core";
import { isSelector } from "@styleframe/core";
import type { ConsumeFunction, TranspileContext } from "../../types";

/**
 * Collects selectors with _exportName from children.
 * Exported selectors are always direct children of root since
 * _exportName is only set on module-level exports.
 */
function collectExportedSelectors(
	children: Array<ContainerChild>,
): Array<Selector> {
	return children.filter(
		(child): child is Selector => isSelector(child) && !!child._exportName,
	);
}

export function createRootConsumer(consume: ConsumeFunction) {
	return function consumeRoot(
		instance: Root,
		options: StyleframeOptions,
		context?: TranspileContext,
	) {
		const exportedSelectors = collectExportedSelectors(instance.children);

		const usedRecipes = instance._usage?.recipes;
		const recipesToEmit =
			usedRecipes && usedRecipes.size > 0
				? instance.recipes.filter((r) => usedRecipes.has(r.name))
				: instance.recipes;

		const hasRecipes = recipesToEmit.length > 0;
		const hasSelectors = exportedSelectors.length > 0;

		if (!hasRecipes && !hasSelectors) {
			return "";
		}

		const parts: Array<string> = [];

		if (hasRecipes) {
			const importParts = [
				"import { createRecipe } from '@styleframe/runtime';",
				"import type { RecipeRuntime, RecipeVariantProps } from '@styleframe/runtime';",
			];

			if (context?.shortMap) {
				importParts.push(
					"import type { ShorteningMap } from '@styleframe/runtime';",
				);
			}

			parts.push(`${importParts.join("\n")}\n`);

			if (context?.shortMap) {
				parts.push(
					`const __shortMap: ShorteningMap = ${JSON.stringify(context.shortMap)} as const;\n`,
				);
			}

			parts.push(consume(recipesToEmit, options, context));
		}

		if (hasSelectors) {
			parts.push(consume(exportedSelectors, options));
		}

		return parts.join("\n");
	};
}
