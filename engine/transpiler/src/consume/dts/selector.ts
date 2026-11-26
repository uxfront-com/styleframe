import type { Selector, StyleframeOptions } from "@styleframe/core";

import type { ConsumeFunction } from "../../types";

/**
 * Consumes a selector instance and generates TypeScript type declaration for it.
 * Only generates output if the selector has an _exportName set.
 * Exports the selector as a string type.
 */
export function createSelectorConsumer(_consume: ConsumeFunction) {
	return function consumeSelector(instance: Selector, _options: StyleframeOptions): string {
		// Only export selectors that have an explicit export name
		if (!instance._exportName) {
			return "";
		}

		return `export const ${instance._exportName}: string;`;
	};
}
