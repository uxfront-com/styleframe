import type { StyleframeOptions } from "@styleframe/core";
import {
	isAtRule,
	isCSS,
	isRef,
	isRoot,
	isSelector,
	isTheme,
	isUtility,
	isVariable,
} from "@styleframe/core";

import type { TranspileContext } from "../../types";
import { createAtRuleConsumer } from "./at-rule";
import { createCSSTemplateLiteralConsumer } from "./css";
import { createPrimitiveConsumer } from "./primitive";
import { createRefConsumer } from "./ref";
import { createRootConsumer } from "./root";
import { createSelectorConsumer } from "./selector";
import { createThemeConsumer } from "./theme";
import { createUtilityConsumer } from "./utility";
import { createVariableConsumer } from "./variable";

/**
 * Consumes any token instance and returns the CSS string representation
 */
export function consume(
	instance: unknown,
	options: StyleframeOptions,
	context?: TranspileContext,
): string {
	const consumeRoot = createRootConsumer(consume);
	const consumeSelector = createSelectorConsumer(consume);
	const consumeUtility = createUtilityConsumer(consume);
	const consumeAtRule = createAtRuleConsumer(consume);
	const consumeTheme = createThemeConsumer(consume);
	const consumeVariable = createVariableConsumer(consume);
	const consumeRef = createRefConsumer(consume);
	const consumeTemplateLiteral = createCSSTemplateLiteralConsumer(consume);
	const consumePrimitive = createPrimitiveConsumer(consume);

	switch (true) {
		case isSelector(instance):
			return consumeSelector(instance, options);
		case isUtility(instance):
			return consumeUtility(instance, options);
		case isAtRule(instance):
			return consumeAtRule(instance, options);
		case isRoot(instance):
			return consumeRoot(instance, options, context);
		case isTheme(instance):
			return consumeTheme(instance, options);
		case isVariable(instance):
			return consumeVariable(instance, options);
		case isRef(instance):
			return consumeRef(instance, options);
		case isCSS(instance):
			return consumeTemplateLiteral(instance, options);
		default:
			return consumePrimitive(instance, options);
	}
}
