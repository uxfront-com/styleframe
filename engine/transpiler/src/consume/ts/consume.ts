import type { StyleframeOptions } from "@styleframe/core";
import { isRecipe, isRoot, isSelector } from "@styleframe/core";

import type { TranspileContext } from "../../types";
import { createRecipeConsumer } from "./recipe";
import { createRootConsumer } from "./root";
import { createSelectorConsumer } from "./selector";

/**
 * Consumes any token instance and returns the TS string representation
 */
export function consume(
	instance: unknown,
	options: StyleframeOptions,
	context?: TranspileContext,
): string {
	const consumeRoot = createRootConsumer(consume);
	const consumeRecipe = createRecipeConsumer(consume);
	const consumeSelector = createSelectorConsumer(consume);

	switch (true) {
		case Array.isArray(instance):
			return instance.map((item) => consume(item, options, context)).join("\n");
		case isRoot(instance):
			return consumeRoot(instance, options, context);
		case isRecipe(instance):
			return consumeRecipe(instance, options, context);
		case isSelector(instance):
			return consumeSelector(instance, options);
		default:
			return "";
	}
}
