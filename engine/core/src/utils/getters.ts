import type { Container, ModifierFactory, Root, UtilityFactory, Variable } from "../types";

export function getVariable(root: Container, name: string): Variable {
	const variable = root.variables.find((variable) => variable.name === name);
	if (!variable) {
		throw new Error(`Variable "${name}" not found`);
	}

	return variable;
}

export function getUtility(root: Root, name: string): UtilityFactory {
	const utility = root.utilities.find((utility) => utility.name === name);
	if (!utility) {
		throw new Error(`Utility "${name}" not found`);
	}

	return utility;
}

export function getModifier(root: Root, name: string): ModifierFactory {
	const modifier = root.modifiers.find((modifier) => modifier.key.includes(name));
	if (!modifier) {
		throw new Error(`Modifier "${name}" not found`);
	}

	return modifier;
}
