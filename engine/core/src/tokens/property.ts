import type { AtRule, Container, Root, TokenValue, Variable } from "../types";
import { createAtRuleFunction } from "./atRule";
import { createVariableFunction } from "./variable";

export type PropertyOptions = {
	/**
	 * The CSS `syntax` descriptor, e.g. `"<length>"`, `"<color>"`, `"*"`.
	 * Pass it unquoted — the quotes are added in the generated `@property` block.
	 */
	syntax: string;
	/** The CSS `inherits` descriptor. Defaults to `false`. */
	inherits?: boolean;
	/**
	 * The CSS `initial-value` descriptor. Defaults to `value`.
	 * Should be a concrete value; references are emitted verbatim.
	 */
	initialValue?: TokenValue;
	/** Same semantics as `variable`'s `default` option. */
	default?: boolean;
};

/**
 * Registers a typed custom property. Composes `variable` (the value
 * declaration) with an `@property` at-rule (the registration), and returns the
 * same `Variable` — one custom property in the graph, distinct at authoring.
 */
export function createPropertyFunction(parent: Container, root: Root) {
	const variable = createVariableFunction(parent, root);
	// `@property` is only valid at the top level, so register it on root.
	const atRule = createAtRuleFunction(root, root);

	return function property<Name extends string>(
		nameOrInstance: Name | Variable<Name>,
		value: TokenValue,
		options: PropertyOptions,
	): Variable<Name> {
		const instance = variable(nameOrInstance, value, {
			default: options.default ?? false,
		});

		const registrationName = `--${instance.name}`;

		// One `@property` block per custom property name. A later call with a
		// different value updates the variable declaration but keeps the first
		// `initial-value` — the cascade lands on the latest value regardless.
		const alreadyRegistered = root.children.some(
			(child): child is AtRule =>
				child.type === "at-rule" &&
				child.identifier === "property" &&
				child.rule === registrationName,
		);

		if (!alreadyRegistered) {
			const initialValue =
				options.initialValue !== undefined ? options.initialValue : instance.value;

			atRule("property", registrationName, {
				syntax: JSON.stringify(options.syntax),
				inherits: options.inherits ? "true" : "false",
				"initial-value": initialValue,
			});
		}

		return instance;
	};
}
