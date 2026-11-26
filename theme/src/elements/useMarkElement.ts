import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";

import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultMarkOptions: WithThemes<MarkElementConfig> = {
	background: "@color.warning-100",
	color: "inherit",
	paddingTop: "0.1875rem",
	paddingRight: "0.375rem",
	paddingBottom: "0.1875rem",
	paddingLeft: "0.375rem",
	themes: {
		dark: {
			background: "@color.warning-700",
		},
	},
};

export interface MarkElementConfig {
	background?: TokenValue;
	color?: string;
	paddingTop?: TokenValue;
	paddingRight?: TokenValue;
	paddingBottom?: TokenValue;
	paddingLeft?: TokenValue;
}

export interface MarkElementResult {
	markBackground: Variable<"mark.background">;
	markColor: Variable<"mark.color">;
	markPaddingTop: Variable<"mark.padding-top">;
	markPaddingRight: Variable<"mark.padding-right">;
	markPaddingBottom: Variable<"mark.padding-bottom">;
	markPaddingLeft: Variable<"mark.padding-left">;
}

export function useMarkDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: MarkElementConfig = {},
): Partial<MarkElementResult> {
	const result: Partial<MarkElementResult> = {};

	if (config.background !== undefined) {
		result.markBackground = ctx.variable("mark.background", config.background);
	}
	if (config.color !== undefined) {
		result.markColor = ctx.variable("mark.color", config.color);
	}
	if (config.paddingTop !== undefined) {
		result.markPaddingTop = ctx.variable("mark.padding-top", config.paddingTop);
	}
	if (config.paddingRight !== undefined) {
		result.markPaddingRight = ctx.variable("mark.padding-right", config.paddingRight);
	}
	if (config.paddingBottom !== undefined) {
		result.markPaddingBottom = ctx.variable("mark.padding-bottom", config.paddingBottom);
	}
	if (config.paddingLeft !== undefined) {
		result.markPaddingLeft = ctx.variable("mark.padding-left", config.paddingLeft);
	}

	return result;
}

export function useMarkSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<MarkElementConfig>,
): MarkElementResult {
	const result = useMarkDesignTokens(ctx, config) as MarkElementResult;

	ctx.selector("mark", (ctx) => {
		return {
			background: ctx.ref(result.markBackground),
			color: ctx.ref(result.markColor),
			paddingTop: ctx.ref(result.markPaddingTop),
			paddingRight: ctx.ref(result.markPaddingRight),
			paddingBottom: ctx.ref(result.markPaddingBottom),
			paddingLeft: ctx.ref(result.markPaddingLeft),
		};
	});

	return result;
}

export function useMarkElement(
	s: Styleframe,
	options: WithThemes<MarkElementConfig> = {},
): MarkElementResult {
	const { themes, ...config } = mergeElementOptions(defaultMarkOptions, options);

	const result = useMarkSelectors(s, config as Required<MarkElementConfig>);

	registerElementThemes(s, themes, useMarkDesignTokens);

	return result;
}
