import type {
	ContainerChild,
	DeclarationsBlock,
	StyleframeOptions,
	Variable,
} from "@styleframe/core";
import { genSelector } from "../../generator";
import type { ConsumeFunction } from "../../types";
import { createDeclarationsConsumer } from "./declarations";
import { createVariableConsumer } from "./variable";

/**
 * Base function for consuming container-like structures (Selector, AtRule)
 */
export function createContainerConsumer(consume: ConsumeFunction) {
	const consumeVariable = createVariableConsumer(consume);
	const consumeDeclarations = createDeclarationsConsumer(consume);

	return function consumeContainer(
		query: string,
		instance: {
			variables?: Array<Variable>;
			declarations?: DeclarationsBlock;
			children?: Array<ContainerChild>;
		},
		options: StyleframeOptions,
	): string {
		const { variables, declarations, children } = instance;
		const isRoot = query === ":root";

		const consumedVariables = (variables ?? []).map((variable) =>
			consumeVariable(variable, options),
		);

		const consumedDeclarations = consumeDeclarations(
			declarations ?? {},
			options,
		);

		const consumedChildren = (children ?? []).map((child) =>
			consume(child, options),
		);

		const hasVariables = consumedVariables.length > 0;
		const hasDeclarations = consumedDeclarations.length > 0;
		const hasChildren = consumedChildren.length > 0;

		if (isRoot) {
			return `${
				hasVariables || hasDeclarations
					? genSelector(query, [
							...consumedVariables,
							...(hasVariables && hasDeclarations ? [""] : []),
							...consumedDeclarations,
						])
					: ""
			}${
				hasChildren && (hasVariables || hasDeclarations) ? "\n\n" : ""
			}${consumedChildren.join("\n\n")}`;
		}

		return genSelector(query, [
			...consumedVariables,
			...(hasVariables && (hasChildren || hasDeclarations) ? [""] : []),
			...consumedDeclarations,
			...(hasDeclarations && hasChildren ? [""] : []),
			...consumedChildren.flatMap((child, index) =>
				index === consumedChildren.length - 1 ? [child] : [child, ""],
			),
		]);
	};
}
