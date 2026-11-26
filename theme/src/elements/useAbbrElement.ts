import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultAbbrOptions: WithThemes<AbbrElementConfig> = {
	cursor: "help",
	textDecoration: "underline dotted",
};

export interface AbbrElementConfig {
	cursor?: TokenValue;
	textDecoration?: TokenValue;
}

export interface AbbrElementResult {
	abbrCursor: Variable<"abbr.cursor">;
	abbrTextDecoration: Variable<"abbr.text-decoration">;
}

export function useAbbrDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: AbbrElementConfig = {},
): Partial<AbbrElementResult> {
	const result: Partial<AbbrElementResult> = {};

	if (config.cursor !== undefined) {
		result.abbrCursor = ctx.variable("abbr.cursor", config.cursor);
	}
	if (config.textDecoration !== undefined) {
		result.abbrTextDecoration = ctx.variable(
			"abbr.text-decoration",
			config.textDecoration,
		);
	}

	return result;
}

export function useAbbrSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<AbbrElementConfig>,
): AbbrElementResult {
	const result = useAbbrDesignTokens(ctx, config) as AbbrElementResult;

	ctx.selector("abbr[title]", {
		cursor: ctx.ref(result.abbrCursor),
		textDecorationSkipInk: "none",
		textDecoration: ctx.ref(result.abbrTextDecoration),
	});

	return result;
}

export function useAbbrElement(
	s: Styleframe,
	options: WithThemes<AbbrElementConfig> = {},
): AbbrElementResult {
	const { themes, ...config } = mergeElementOptions(
		defaultAbbrOptions,
		options,
	);

	const result = useAbbrSelectors(s, config as Required<AbbrElementConfig>);

	registerElementThemes(s, themes, useAbbrDesignTokens);

	return result;
}
