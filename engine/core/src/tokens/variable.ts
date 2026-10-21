import type { Container, Root, TokenValue, Variable } from "../types";
import { generateRandomId } from "../utils";
import { createPropertyValueResolver } from "./resolve";

/** Variables last set by a `variable()` call without `default: true`. */
const explicitVariables = new WeakSet<Variable>();

export function createVariableFunction(parent: Container, root: Root) {
	return function variable<Name extends string>(
		nameOrInstance: Name | Variable<Name>,
		value: TokenValue,
		options: {
			default: boolean;
		} = {
			default: false,
		},
	): Variable<Name> {
		const name = (
			typeof nameOrInstance === "string" ? nameOrInstance : nameOrInstance.name
		) as Name;

		// Resolve @-prefixed string values to references
		const resolvePropertyValue = createPropertyValueResolver(parent, root);
		const resolvedValue = resolvePropertyValue(value);

		const existingVariable = parent.variables.find(
			(child) => child.name === name,
		) as Variable<Name> | undefined;

		// If default is true and the variable exists, return existing
		if (options.default && existingVariable) {
			return existingVariable;
		}

		// If default is false and the variable exists, update the value
		if (existingVariable) {
			if (explicitVariables.has(existingVariable)) {
				root._records?.push({
					type: "duplicate-variable",
					scopeId: parent.id,
					name,
					values: [existingVariable.value, resolvedValue],
				});
			}

			existingVariable.value = resolvedValue;
			explicitVariables.add(existingVariable);
			return existingVariable;
		}

		// Create a new variable
		const instance: Variable<Name> = {
			type: "variable",
			id: generateRandomId("var-"),
			parentId: parent.id,
			name,
			value: resolvedValue,
		};

		if (!options.default) {
			explicitVariables.add(instance);
		}

		parent.variables.push(instance);
		return instance;
	};
}
