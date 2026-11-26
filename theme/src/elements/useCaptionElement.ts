import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";

import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultCaptionOptions: WithThemes<CaptionElementConfig> = {
	color: "@color.text-weak",
	paddingTop: "@spacing.xs",
	paddingRight: "@spacing.sm",
	paddingBottom: "@spacing.xs",
	paddingLeft: "@spacing.sm",
	textAlign: "left",
	themes: {
		dark: {
			color: "@color.text-weak",
		},
	},
};

export interface CaptionElementConfig {
	color?: TokenValue;
	paddingTop?: TokenValue;
	paddingRight?: TokenValue;
	paddingBottom?: TokenValue;
	paddingLeft?: TokenValue;
	textAlign?: TokenValue;
}

export interface CaptionElementResult {
	captionColor: Variable<"caption.color">;
	captionPaddingTop: Variable<"caption.padding-top">;
	captionPaddingRight: Variable<"caption.padding-right">;
	captionPaddingBottom: Variable<"caption.padding-bottom">;
	captionPaddingLeft: Variable<"caption.padding-left">;
	captionTextAlign: Variable<"caption.text-align">;
}

export function useCaptionDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: CaptionElementConfig = {},
): Partial<CaptionElementResult> {
	const result: Partial<CaptionElementResult> = {};

	if (config.color !== undefined) {
		result.captionColor = ctx.variable("caption.color", config.color);
	}
	if (config.paddingTop !== undefined) {
		result.captionPaddingTop = ctx.variable("caption.padding-top", config.paddingTop);
	}
	if (config.paddingRight !== undefined) {
		result.captionPaddingRight = ctx.variable("caption.padding-right", config.paddingRight);
	}
	if (config.paddingBottom !== undefined) {
		result.captionPaddingBottom = ctx.variable("caption.padding-bottom", config.paddingBottom);
	}
	if (config.paddingLeft !== undefined) {
		result.captionPaddingLeft = ctx.variable("caption.padding-left", config.paddingLeft);
	}
	if (config.textAlign !== undefined) {
		result.captionTextAlign = ctx.variable("caption.text-align", config.textAlign);
	}

	return result;
}

export function useCaptionSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<CaptionElementConfig>,
): CaptionElementResult {
	const result = useCaptionDesignTokens(ctx, config) as CaptionElementResult;

	ctx.selector("caption", {
		color: ctx.ref(result.captionColor),
		paddingTop: ctx.ref(result.captionPaddingTop),
		paddingRight: ctx.ref(result.captionPaddingRight),
		paddingBottom: ctx.ref(result.captionPaddingBottom),
		paddingLeft: ctx.ref(result.captionPaddingLeft),
		textAlign: ctx.ref(result.captionTextAlign),
	});

	return result;
}

export function useCaptionElement(
	s: Styleframe,
	options: WithThemes<CaptionElementConfig> = {},
): CaptionElementResult {
	const { themes, ...config } = mergeElementOptions(defaultCaptionOptions, options);

	const result = useCaptionSelectors(s, config as Required<CaptionElementConfig>);

	registerElementThemes(s, themes, useCaptionDesignTokens);

	return result;
}
