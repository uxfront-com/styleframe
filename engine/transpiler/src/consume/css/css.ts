import type { CSS, StyleframeOptions } from "@styleframe/core";

import type { ConsumeFunction } from "../../types";

/**
 * Consumes a CSS value, equivalent to the string body of a selector
 */
export function createCSSTemplateLiteralConsumer(consume: ConsumeFunction) {
	return function consumeCSSTemplateLiteral(instance: CSS, options: StyleframeOptions): string {
		return instance.value
			.map((part) => consume(part, options))
			.join("")
			.trim();
	};
}
