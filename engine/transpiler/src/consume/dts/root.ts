import type { ContainerChild, Root, Selector, StyleframeOptions } from "@styleframe/core";
import { isSelector } from "@styleframe/core";

import type { ConsumeFunction } from "../../types";
import { DTS_HEADER } from "./constants";

/**
 * Collects selectors with _exportName from children.
 * Exported selectors are always direct children of root since
 * _exportName is only set on module-level exports.
 */
function collectExportedSelectors(children: Array<ContainerChild>): Array<Selector> {
	return children.filter((child): child is Selector => isSelector(child) && !!child._exportName);
}

export function createRootConsumer(consume: ConsumeFunction) {
	return function consumeRoot(instance: Root, options: StyleframeOptions) {
		const exportedSelectors = collectExportedSelectors(instance.children);

		const usedRecipes = instance._usage?.recipes;
		const recipesToEmit =
			usedRecipes && usedRecipes.size > 0
				? instance.recipes.filter((r) => usedRecipes.has(r.name))
				: instance.recipes;

		const hasRecipes = recipesToEmit.length > 0;
		const hasSelectors = exportedSelectors.length > 0;

		const parts: Array<string> = [
			DTS_HEADER,
			'import type { Styleframe } from "@styleframe/core";',
			"",
			"export function styleframe(): Styleframe;",
		];

		// Add recipe exports
		if (hasRecipes) {
			parts.push("");
			const recipeDeclarations = recipesToEmit
				.map((recipe) => consume(recipe, options))
				.filter(Boolean);
			parts.push(...recipeDeclarations);
		}

		// Add selector exports
		if (hasSelectors) {
			parts.push("");
			const selectorDeclarations = exportedSelectors
				.map((selector) => consume(selector, options))
				.filter(Boolean);
			parts.push(...selectorDeclarations);
		}

		parts.push("");

		return parts.join("\n");
	};
}
