import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";

import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultUlOptions: WithThemes<UlElementConfig> = {
	marginBottom: "@spacing",
	paddingLeft: "@spacing.lg",
};

export interface UlElementConfig {
	marginBottom?: TokenValue;
	paddingLeft?: TokenValue;
}

export interface UlElementResult {
	ulMarginBottom: Variable<"ul.margin-bottom">;
	ulPaddingLeft: Variable<"ul.padding-left">;
}

export function useUlDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: UlElementConfig = {},
): Partial<UlElementResult> {
	const result: Partial<UlElementResult> = {};

	if (config.marginBottom !== undefined) {
		result.ulMarginBottom = ctx.variable("ul.margin-bottom", config.marginBottom);
	}
	if (config.paddingLeft !== undefined) {
		result.ulPaddingLeft = ctx.variable("ul.padding-left", config.paddingLeft);
	}

	return result;
}

export function useUlSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<UlElementConfig>,
): UlElementResult {
	const result = useUlDesignTokens(ctx, config) as UlElementResult;

	ctx.selector("ul", {
		marginBottom: ctx.ref(result.ulMarginBottom),
		paddingLeft: ctx.ref(result.ulPaddingLeft),
		"& ol, & ul": {
			marginBottom: "0",
		},
	});

	return result;
}

export function useUlElement(
	s: Styleframe,
	options: WithThemes<UlElementConfig> = {},
): UlElementResult {
	const { themes, ...config } = mergeElementOptions(defaultUlOptions, options);

	const result = useUlSelectors(s, config as Required<UlElementConfig>);

	registerElementThemes(s, themes, useUlDesignTokens);

	return result;
}
