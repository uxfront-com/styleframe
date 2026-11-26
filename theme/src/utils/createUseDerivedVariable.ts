import type { DeclarationsCallbackContext, TokenValue, Variable } from "@styleframe/core";

import type { ExportKeys } from "../types";
import { createUseVariable } from "./createUseVariable";

export function createUseDerivedVariable<
	PropertyType = TokenValue,
	Delimiter extends string = ".",
	Defaults extends Record<string, PropertyType> = Record<string, PropertyType>,
>({
	defaults,
	transform,
	delimiter,
}: {
	defaults?: Defaults;
	transform: (
		value: PropertyType,
		context: { s: DeclarationsCallbackContext; parent: Variable },
	) => TokenValue;
	delimiter?: Delimiter;
}) {
	return function useDerivedVariable<
		Context extends DeclarationsCallbackContext,
		Name extends string,
		T extends Record<string | number, PropertyType> = Defaults,
	>(
		s: Context,
		parent: Variable<Name>,
		tokens: T,
		{ default: isDefault = true }: { default?: boolean } = {},
	): ExportKeys<Name, T, Delimiter> {
		return createUseVariable(parent.name, {
			defaults: defaults as Record<string, TokenValue> | undefined,
			transform: (value) => transform(value as PropertyType, { s, parent }),
			delimiter,
		})(s, tokens as Record<string, TokenValue>, {
			default: isDefault,
		}) as ExportKeys<Name, T, Delimiter>;
	};
}
