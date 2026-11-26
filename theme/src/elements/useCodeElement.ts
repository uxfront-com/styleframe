import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultCodeOptions: WithThemes<CodeElementConfig> = {
	fontFamily: "@font-family.mono",
	fontSize: "0.875em",
};

export interface CodeElementConfig {
	fontFamily?: TokenValue;
	fontSize?: TokenValue;
}

export interface CodeElementResult {
	codeFontFamily: Variable<"code.font-family">;
	codeFontSize: Variable<"code.font-size">;
}

export function useCodeDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: CodeElementConfig = {},
): Partial<CodeElementResult> {
	const result: Partial<CodeElementResult> = {};

	if (config.fontFamily !== undefined) {
		result.codeFontFamily = ctx.variable("code.font-family", config.fontFamily);
	}
	if (config.fontSize !== undefined) {
		result.codeFontSize = ctx.variable("code.font-size", config.fontSize);
	}

	return result;
}

export function useCodeSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<CodeElementConfig>,
): CodeElementResult {
	const result = useCodeDesignTokens(ctx, config) as CodeElementResult;

	ctx.selector("code, samp", {
		fontFamily: ctx.ref(result.codeFontFamily),
		fontSize: ctx.ref(result.codeFontSize),
	});

	return result;
}

export function useCodeElement(
	s: Styleframe,
	options: WithThemes<CodeElementConfig> = {},
): CodeElementResult {
	const { themes, ...config } = mergeElementOptions(
		defaultCodeOptions,
		options,
	);

	const result = useCodeSelectors(s, config as Required<CodeElementConfig>);

	registerElementThemes(s, themes, useCodeDesignTokens);

	return result;
}
