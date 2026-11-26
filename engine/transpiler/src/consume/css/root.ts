import type { ContainerChild, Root, StyleframeOptions, Variable } from "@styleframe/core";

import { defaultUtilitySelectorFn } from "../../defaults";
import type { ConsumeFunction, TranspileContext } from "../../types";
import { createContainerConsumer } from "./container";

export function createRootConsumer(consume: ConsumeFunction) {
	const consumeContainer = createContainerConsumer(consume);

	return function consumeRoot(
		instance: Root,
		options: StyleframeOptions,
		context?: TranspileContext,
	) {
		const treeshake = context?.treeshake ?? false;
		const scanner = context?.scanner ?? false;

		const usage = instance._usage.variables;
		const keep = (variable: Variable) => !treeshake || usage.has(variable.name);

		const filterVariables = <T extends { variables: Array<Variable> }>(container: T): T =>
			treeshake ? { ...container, variables: container.variables.filter(keep) } : container;

		const treeshakeUtilities = treeshake && scanner;
		const usedUtilities = instance._usage.utilities;
		const keepChild = (child: ContainerChild): boolean => {
			if (child.type !== "utility") {
				return true;
			}
			if (!treeshakeUtilities) {
				return true;
			}
			return usedUtilities.has(
				defaultUtilitySelectorFn({
					name: child.name,
					value: child.value,
					modifiers: child.modifiers,
				}),
			);
		};

		const filtered = filterVariables(instance);
		const rootForEmit = treeshakeUtilities
			? { ...filtered, children: filtered.children.filter(keepChild) }
			: filtered;
		const themesForEmit = instance.themes.map(filterVariables);

		return themesForEmit
			.reduce(
				(acc, theme) => {
					acc.push(consume(theme, options));
					return acc;
				},
				[consumeContainer(":root", rootForEmit, options)], // Default theme (root)
			)
			.join("\n\n");
	};
}
