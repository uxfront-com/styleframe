import type { StyleframeOptions } from "@styleframe/core";

import type { ConsumeFunction } from "../../types";

/**
 * Consumes a primitive instance, equivalent to setting a CSS value
 */
export function createPrimitiveConsumer(_consume: ConsumeFunction) {
	return function consumePrimitive(instance: unknown, _options: StyleframeOptions): string {
		return instance !== undefined && instance !== null ? `${instance as string}` : "";
	};
}
