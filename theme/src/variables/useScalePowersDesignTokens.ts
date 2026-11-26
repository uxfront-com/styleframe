import type {
	CSS,
	DeclarationsCallbackContext,
	Reference,
	TokenValue,
	Variable,
} from "@styleframe/core";
import { isRef } from "@styleframe/core";

import { scalePowerValues } from "../values";
export function useScalePowersDesignTokens<
	Context extends DeclarationsCallbackContext,
	T extends ReadonlyArray<number>,
>(
	s: Context,
	scale: Variable | Reference,
	powers: T = scalePowerValues as T,
): Record<number, TokenValue> {
	const results: Record<number, CSS> = {};

	for (const power of powers) {
		const absPower = Math.abs(power);
		const operator = power > 0 ? " * " : " / ";
		const value: Array<TokenValue> = [];

		if (power <= 0) {
			value.push("1");
		}

		// Build the CSS value array directly
		for (let i = 0; i < absPower; i++) {
			if (i > 0 || power < 0) {
				value.push(operator);
			}
			value.push(isRef(scale) ? scale : s.ref(scale));
		}

		results[power] = {
			type: "css",
			value,
		};
	}

	return results as Record<keyof typeof powers, TokenValue>;
}
