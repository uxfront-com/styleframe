import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";

import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultAddressOptions: WithThemes<AddressElementConfig> = {
	marginBottom: "@spacing",
};

export interface AddressElementConfig {
	marginBottom?: TokenValue;
}

export interface AddressElementResult {
	addressMarginBottom: Variable<"address.margin-bottom">;
}

export function useAddressDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: AddressElementConfig = {},
): Partial<AddressElementResult> {
	const result: Partial<AddressElementResult> = {};

	if (config.marginBottom !== undefined) {
		result.addressMarginBottom = ctx.variable("address.margin-bottom", config.marginBottom);
	}

	return result;
}

export function useAddressSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<AddressElementConfig>,
): AddressElementResult {
	const result = useAddressDesignTokens(ctx, config) as AddressElementResult;

	ctx.selector("address", {
		marginBottom: ctx.ref(result.addressMarginBottom),
		fontStyle: "normal",
		lineHeight: "inherit",
	});

	return result;
}

export function useAddressElement(
	s: Styleframe,
	options: WithThemes<AddressElementConfig> = {},
): AddressElementResult {
	const { themes, ...config } = mergeElementOptions(defaultAddressOptions, options);

	const result = useAddressSelectors(s, config as Required<AddressElementConfig>);

	registerElementThemes(s, themes, useAddressDesignTokens);

	return result;
}
