import type { AtRule, StyleframeOptions } from "@styleframe/core";

import { STATEMENT_AT_RULES, STATEMENT_OR_BLOCK_AT_RULES } from "../../constants";
import { genAtRuleQuery } from "../../generator";
import type { ConsumeFunction } from "../../types";
import { createContainerConsumer } from "./container";

/**
 * Consumes a generic at-rule instance, equivalent to setting a CSS at-rule
 * such as @media, @supports, @keyframes, etc.
 */
export function createAtRuleConsumer(consume: ConsumeFunction) {
	const consumeContainer = createContainerConsumer(consume);

	return function consumeAtRule(instance: AtRule, options: StyleframeOptions): string {
		const isStatement = STATEMENT_AT_RULES.includes(instance.identifier);
		const isStatementOrBlock = STATEMENT_OR_BLOCK_AT_RULES.includes(instance.identifier);

		const hasDeclarations = Object.keys(instance.declarations).length > 0;
		const hasVariables = instance.variables.length > 0;
		const hasChildren = instance.children.length > 0;

		const query = genAtRuleQuery(instance.identifier, instance.rule);

		return isStatement || (isStatementOrBlock && !(hasDeclarations || hasVariables || hasChildren))
			? `${query};`
			: consumeContainer(query, instance, options);
	};
}
