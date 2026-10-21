import { isTokenValue } from "../typeGuards";
import type {
	Container,
	DeclarationsBlock,
	DeclarationsCallbackContext,
	Root,
} from "../types";
import {
	createAtRuleFunction,
	createKeyframesFunction,
	createMediaFunction,
} from "./atRule";
import { createCssFunction } from "./css";
import { createPropertyFunction } from "./property";
import { createRefFunction } from "./ref";
import { createPropertyValueResolver } from "./resolve";
import { createSelectorFunction } from "./selector";
import { createVariableFunction } from "./variable";

export function createDeclarationsCallbackContext(
	parent: Container,
	root: Root,
): DeclarationsCallbackContext {
	const variable = createVariableFunction(parent, root);
	const property = createPropertyFunction(parent, root);
	const selector = createSelectorFunction(parent, root);
	const atRule = createAtRuleFunction(parent, root);
	const keyframes = createKeyframesFunction(root, root);
	const media = createMediaFunction(parent, root);
	const ref = createRefFunction(root, root);
	const css = createCssFunction(root, root);

	return {
		variable,
		property,
		selector,
		keyframes,
		atRule,
		media,
		ref,
		css,
	};
}

export function parseDeclarationsBlock(
	declarations: DeclarationsBlock,
	context: DeclarationsCallbackContext,
	parent: Container,
	root: Root,
) {
	for (const key in declarations) {
		// If the key represents a selector or media query, remove it and add it as a separate declaration
		if (key.startsWith("@")) {
			const atRuleDeclarations = declarations[key];
			if (
				typeof atRuleDeclarations === "object" &&
				atRuleDeclarations !== null &&
				!isTokenValue(atRuleDeclarations)
			) {
				const identifier = key.replace(/^@([\w-]+).*/, "$1");
				const rule = key.replace(`@${identifier}`, "").trim();
				context.atRule(identifier, rule, atRuleDeclarations);
				delete declarations[key];
			}
		} else if (
			/^[.&:]/.test(key) ||
			/^(\d+%|from|to)(\s*,\s*(\d+%|from|to))*$/.test(key)
		) {
			// If the key starts with a special character or is a keyframe selector, treat it as a nested selector
			const nested = declarations[key] as DeclarationsBlock;
			if (typeof nested === "object") {
				context.selector(key, nested);
				delete declarations[key];
			}
		}
	}

	// Resolve @-prefixed string values to variable references
	const resolvePropertyValue = createPropertyValueResolver(parent, root);
	for (const key in declarations) {
		const value = declarations[key];
		if (isTokenValue(value)) {
			const resolved = resolvePropertyValue(value);
			if (resolved !== value) {
				declarations[key] = resolved;
			}
		}
	}

	return declarations;
}
