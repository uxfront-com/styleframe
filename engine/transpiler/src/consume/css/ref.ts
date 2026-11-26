import type { Reference, StyleframeOptions } from "@styleframe/core";

import { defaultVariableNameFn } from "../../defaults";
import { genReferenceVariable } from "../../generator";
import type { ConsumeFunction } from "../../types";

/**
 * Consumes a ref instance, equivalent to referencing a CSS variable with optional fallback
 */
export function createRefConsumer(consume: ConsumeFunction) {
	return function consumeRef(instance: Reference, options: StyleframeOptions): string {
		const variableNameFn = options.variables?.name ?? defaultVariableNameFn;
		const variableName = variableNameFn({ name: instance.name });

		return genReferenceVariable(
			variableName,
			instance.fallback ? consume(instance.fallback, options) : undefined,
		);
	};
}
