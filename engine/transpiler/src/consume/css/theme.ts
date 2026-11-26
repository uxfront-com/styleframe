import type { StyleframeOptions, Theme } from "@styleframe/core";

import { defaultThemeSelectorFn } from "../../defaults";
import type { ConsumeFunction } from "../../types";
import { createContainerConsumer } from "./container";

export function createThemeConsumer(consume: ConsumeFunction) {
	const consumeContainer = createContainerConsumer(consume);

	return function consumeTheme(instance: Theme, options: StyleframeOptions) {
		const selectorFn = options.themes?.selector ?? defaultThemeSelectorFn;
		const query = selectorFn({ name: instance.name });

		return consumeContainer(query, instance, options);
	};
}
