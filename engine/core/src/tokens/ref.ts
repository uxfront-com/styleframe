import { isVariable } from "../typeGuards";
import type { Container, Reference, Root, TokenValue, Variable } from "../types";
import { createPropertyValueResolver } from "./resolve";

export function createRefFunction(parent: Container, root: Root) {
	return function ref<Name extends string>(
		variable: Variable<Name> | Name,
		fallback?: string,
	): Reference<Name> {
		// Resolve @-prefixed fallback values to references
		const resolvePropertyValue = createPropertyValueResolver(parent, root);
		const resolvedFallback: TokenValue | undefined =
			fallback != null ? resolvePropertyValue(fallback) : fallback;

		if (isVariable(variable)) {
			root._usage.variables.add(variable.name);
			return {
				type: "reference",
				name: variable.name,
				fallback: resolvedFallback,
			};
		}

		if (variable == null) {
			throw new Error(
				`[styleframe] ref() received ${String(variable)}. This usually means you're referencing a variable that doesn't exist.`,
			);
		}

		// If a string name is passed, use it directly
		root._usage.variables.add(variable);
		return {
			type: "reference",
			name: variable,
			fallback: resolvedFallback,
		};
	};
}
