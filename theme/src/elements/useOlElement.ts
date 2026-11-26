import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultOlOptions: WithThemes<OlElementConfig> = {
	marginBottom: "@spacing",
	paddingLeft: "@spacing.lg",
};

export interface OlElementConfig {
	marginBottom?: TokenValue;
	paddingLeft?: TokenValue;
}

export interface OlElementResult {
	olMarginBottom: Variable<"ol.margin-bottom">;
	olPaddingLeft: Variable<"ol.padding-left">;
}

export function useOlDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: OlElementConfig = {},
): Partial<OlElementResult> {
	const result: Partial<OlElementResult> = {};

	if (config.marginBottom !== undefined) {
		result.olMarginBottom = ctx.variable(
			"ol.margin-bottom",
			config.marginBottom,
		);
	}
	if (config.paddingLeft !== undefined) {
		result.olPaddingLeft = ctx.variable("ol.padding-left", config.paddingLeft);
	}

	return result;
}

export function useOlSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<OlElementConfig>,
): OlElementResult {
	const result = useOlDesignTokens(ctx, config) as OlElementResult;

	ctx.selector("ol", {
		marginBottom: ctx.ref(result.olMarginBottom),
		paddingLeft: ctx.ref(result.olPaddingLeft),
		"& ol, & ul": {
			marginBottom: "0",
		},
	});

	return result;
}

export function useOlElement(
	s: Styleframe,
	options: WithThemes<OlElementConfig> = {},
): OlElementResult {
	const { themes, ...config } = mergeElementOptions(defaultOlOptions, options);

	const result = useOlSelectors(s, config as Required<OlElementConfig>);

	registerElementThemes(s, themes, useOlDesignTokens);

	return result;
}
