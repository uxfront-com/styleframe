/**
 * Consumes a variable instance, equivalent to setting a CSS variable
 */

import type { StyleframeOptions, Variable } from "@styleframe/core";

import { defaultVariableNameFn } from "../../defaults";
import { genDeclareVariable } from "../../generator";
import type { ConsumeFunction } from "../../types";

export function createVariableConsumer(consume: ConsumeFunction) {
	return function consumeVariable(instance: Variable, options: StyleframeOptions): string {
		const variableNameFn = options.variables?.name ?? defaultVariableNameFn;
		const variableName = variableNameFn({ name: instance.name });

		return genDeclareVariable(variableName, consume(instance.value, options));
	};
}
