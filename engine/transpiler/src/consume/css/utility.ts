import type { StyleframeOptions, Utility } from "@styleframe/core";
import { classNameToCssSelector } from "@styleframe/core";

import { defaultUtilitySelectorFn } from "../../defaults";
import type { ConsumeFunction } from "../../types";
import { createContainerConsumer } from "./container";

/**
 * Consumes a utility instance, equivalent to setting a utility CSS selector
 */
export function createUtilityConsumer(consume: ConsumeFunction) {
	const consumeContainer = createContainerConsumer(consume);

	return function consumeUtility(instance: Utility, options: StyleframeOptions): string {
		const result: Array<string> = [];

		const utilitySelectorFn = options.utilities?.selector ?? defaultUtilitySelectorFn;
		const className = utilitySelectorFn({
			name: instance.name,
			value: instance.value,
			modifiers: instance.modifiers,
		});
		const utilitySelector = classNameToCssSelector(className);

		// Create base utility selector
		result.push(consumeContainer(utilitySelector, instance, options));

		return result.join("\n\n");
	};
}
