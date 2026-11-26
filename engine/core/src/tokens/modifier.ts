import type { Container, ModifierFactory, Root } from "../types";
import { deepClone, generateRandomId } from "../utils";
import {
	createDeclarationsCallbackContext,
	parseDeclarationsBlock,
} from "./declarations";

export function applyModifiers<InstanceType extends Container>(
	baseInstance: InstanceType,
	root: Root,
	modifiers: Map<string, ModifierFactory>,
): InstanceType {
	const instance: InstanceType = {
		...baseInstance,
		id: generateRandomId("ut-"),
		parentId: baseInstance.parentId,
		declarations: { ...baseInstance.declarations },
		variables: [...baseInstance.variables],
		children: [...baseInstance.children],
		modifiers: [...modifiers.keys()],
	};

	root._registry.set(instance.id, instance);

	if (modifiers.size > 0) {
		const modifierList = [...modifiers.values()];
		let accumulated = deepClone(baseInstance.declarations);

		// Reset instance for modifier processing — modifiers control the output
		instance.declarations = {};
		instance.variables = [];
		instance.children = [];

		// Apply inside-out: last modifier = innermost, first = outermost
		for (let i = modifierList.length - 1; i >= 0; i--) {
			const callbackContext = createDeclarationsCallbackContext(instance, root);
			const result = modifierList[i]?.factory({
				...callbackContext,
				declarations: deepClone(accumulated),
				variables: deepClone(baseInstance.variables),
				children: deepClone(baseInstance.children),
			});

			if (result) {
				accumulated = result;
			}
		}

		// Set accumulated result and parse nested selectors/at-rules into children
		instance.declarations = accumulated;
		const callbackContext = createDeclarationsCallbackContext(instance, root);
		parseDeclarationsBlock(
			instance.declarations,
			callbackContext,
			instance,
			root,
		);
	}

	return instance;
}

export function createModifierFunction(_parent: Container, root: Root) {
	return function modifier<Key extends string>(
		key: Key | Array<Key>,
		factory: ModifierFactory["factory"],
	): ModifierFactory {
		const modifierInstance: ModifierFactory = {
			type: "modifier",
			key: Array.isArray(key) ? key : [key],
			factory,
		};

		root.modifiers.push(modifierInstance);

		return modifierInstance;
	};
}
