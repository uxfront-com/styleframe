import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultDdOptions: WithThemes<DdElementConfig> = {
	marginBottom: "@spacing.xs",
	marginLeft: "0",
};

export interface DdElementConfig {
	marginBottom?: TokenValue;
	marginLeft?: TokenValue;
}

export interface DdElementResult {
	ddMarginBottom: Variable<"dd.margin-bottom">;
	ddMarginLeft: Variable<"dd.margin-left">;
}

export function useDdDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: DdElementConfig = {},
): Partial<DdElementResult> {
	const result: Partial<DdElementResult> = {};

	if (config.marginBottom !== undefined) {
		result.ddMarginBottom = ctx.variable(
			"dd.margin-bottom",
			config.marginBottom,
		);
	}
	if (config.marginLeft !== undefined) {
		result.ddMarginLeft = ctx.variable("dd.margin-left", config.marginLeft);
	}

	return result;
}

export function useDdSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<DdElementConfig>,
): DdElementResult {
	const result = useDdDesignTokens(ctx, config) as DdElementResult;

	ctx.selector("dd", {
		marginBottom: ctx.ref(result.ddMarginBottom),
		marginLeft: ctx.ref(result.ddMarginLeft),
	});

	return result;
}

export function useDdElement(
	s: Styleframe,
	options: WithThemes<DdElementConfig> = {},
): DdElementResult {
	const { themes, ...config } = mergeElementOptions(defaultDdOptions, options);

	const result = useDdSelectors(s, config as Required<DdElementConfig>);

	registerElementThemes(s, themes, useDdDesignTokens);

	return result;
}
