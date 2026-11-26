import type { Selector, StyleframeOptions } from "@styleframe/core";

import type { ConsumeFunction } from "../../types";
import { createContainerConsumer } from "./container";

/**
 * Consumes a selector instance, equivalent to setting a CSS selector
 */
export function createSelectorConsumer(consume: ConsumeFunction) {
	const consumeContainer = createContainerConsumer(consume);

	return function consumeSelector(instance: Selector, options: StyleframeOptions): string {
		return consumeContainer(instance.query, instance, options);
	};
}
