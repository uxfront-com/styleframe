import { isContainerInput } from "../typeGuards";
import type {
	AtRule,
	Container,
	ContainerInput,
	DeclarationsBlock,
	DeclarationsCallback,
	Root,
} from "../types";
import { generateRandomId } from "../utils";
import { createDeclarationsCallbackContext, parseDeclarationsBlock } from "./declarations";

export function createAtRuleFunction(parent: Container, root: Root) {
	return function atRule(
		identifier: string,
		rule: string,
		declarationsOrCallback?: DeclarationsBlock | ContainerInput | DeclarationsCallback,
	): AtRule {
		const instance: AtRule = {
			type: "at-rule",
			id: generateRandomId("ar-"),
			parentId: parent.id,
			identifier,
			rule,
			declarations: {},
			variables: [],
			children: [],
		};

		root._registry.set(instance.id, instance);

		const callbackContext = createDeclarationsCallbackContext(instance, root);

		// Handle overloaded parameters
		if (typeof declarationsOrCallback === "function") {
			// atRule(query, callback)
			instance.declarations = declarationsOrCallback(callbackContext) ?? {};
		} else if (isContainerInput(declarationsOrCallback)) {
			instance.variables = declarationsOrCallback.variables;
			instance.declarations = declarationsOrCallback.declarations;
			instance.children = declarationsOrCallback.children;
		} else if (declarationsOrCallback) {
			// atRule(query, declarations)
			instance.declarations = declarationsOrCallback;
		}

		parseDeclarationsBlock(instance.declarations, callbackContext, instance, root);

		parent.children.push(instance);

		return instance;
	};
}

export function createMediaFunction(parent: Container, root: Root) {
	const atRule = createAtRuleFunction(parent, root);

	return function media(
		query: string,
		declarationsOrCallback?: DeclarationsBlock | ContainerInput | DeclarationsCallback,
	): AtRule {
		return atRule("media", query, declarationsOrCallback);
	};
}

export function createKeyframesFunction(parent: Container, root: Root) {
	const atRule = createAtRuleFunction(parent, root);

	return function keyframes(name: string, declarations: Record<string, DeclarationsBlock>): AtRule {
		return atRule("keyframes", name, declarations);
	};
}
