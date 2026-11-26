import type { DeclarationsBlock, StyleframeOptions } from "@styleframe/core";

import { genDeclaration } from "../../generator";
import type { ConsumeFunction } from "../../types";

/**
 * Consumes a declarations block, equivalent to setting CSS properties
 */
export function createDeclarationsConsumer(consume: ConsumeFunction) {
	return function consumeDeclarations(
		instance: DeclarationsBlock,
		options: StyleframeOptions,
	): Array<string> {
		return Object.entries(instance).map(([propertyName, propertyValue]) => {
			return genDeclaration(propertyName, consume(propertyValue, options));
		});
	};
}
