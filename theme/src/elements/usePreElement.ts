import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultPreOptions: WithThemes<PreElementConfig> = {
	fontFamily: "@font-family.mono",
	fontSize: "0.875em",
	marginBottom: "@spacing",
};

export interface PreElementConfig {
	fontFamily?: TokenValue;
	fontSize?: TokenValue;
	marginBottom?: TokenValue;
}

export interface PreElementResult {
	preFontFamily: Variable<"pre.font-family">;
	preFontSize: Variable<"pre.font-size">;
	preMarginBottom: Variable<"pre.margin-bottom">;
}

export function usePreDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: PreElementConfig = {},
): Partial<PreElementResult> {
	const result: Partial<PreElementResult> = {};

	if (config.fontFamily !== undefined) {
		result.preFontFamily = ctx.variable("pre.font-family", config.fontFamily);
	}
	if (config.fontSize !== undefined) {
		result.preFontSize = ctx.variable("pre.font-size", config.fontSize);
	}
	if (config.marginBottom !== undefined) {
		result.preMarginBottom = ctx.variable(
			"pre.margin-bottom",
			config.marginBottom,
		);
	}

	return result;
}

export function usePreSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<PreElementConfig>,
): PreElementResult {
	const result = usePreDesignTokens(ctx, config) as PreElementResult;

	ctx.selector("pre", {
		fontFamily: ctx.ref(result.preFontFamily),
		fontSize: ctx.ref(result.preFontSize),
		display: "block",
		overflowX: "auto",
		marginTop: "0",
		marginBottom: ctx.ref(result.preMarginBottom),
		"& > code": {
			background: "transparent",
			color: "inherit",
			fontSize: "inherit",
		},
	});

	return result;
}

export function usePreElement(
	s: Styleframe,
	options: WithThemes<PreElementConfig> = {},
): PreElementResult {
	const { themes, ...config } = mergeElementOptions(defaultPreOptions, options);

	const result = usePreSelectors(s, config as Required<PreElementConfig>);

	registerElementThemes(s, themes, usePreDesignTokens);

	return result;
}
