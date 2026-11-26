import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultBodyOptions: WithThemes<BodyElementConfig> = {
	color: "@color.text",
	background: "@color.background",
	fontFamily: "@font-family",
	fontSize: "@font-size",
	lineHeight: "@line-height",
	themes: {
		dark: {
			color: "@color.text",
			background: "@color.background",
		},
	},
};

export interface BodyElementConfig {
	color?: string;
	background?: string;
	fontFamily?: TokenValue;
	fontSize?: TokenValue;
	lineHeight?: TokenValue;
}

export interface BodyElementResult {
	bodyColor: Variable<"body.color">;
	bodyBackground: Variable<"body.background">;
	bodyFontFamily: Variable<"body.font-family">;
	bodyFontSize: Variable<"body.font-size">;
	bodyLineHeight: Variable<"body.line-height">;
}

export function useBodyDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: BodyElementConfig = {},
): Partial<BodyElementResult> {
	const result: Partial<BodyElementResult> = {};

	if (config.color !== undefined) {
		result.bodyColor = ctx.variable("body.color", config.color);
	}
	if (config.background !== undefined) {
		result.bodyBackground = ctx.variable("body.background", config.background);
	}
	if (config.fontFamily !== undefined) {
		result.bodyFontFamily = ctx.variable("body.font-family", config.fontFamily);
	}
	if (config.fontSize !== undefined) {
		result.bodyFontSize = ctx.variable("body.font-size", config.fontSize);
	}
	if (config.lineHeight !== undefined) {
		result.bodyLineHeight = ctx.variable("body.line-height", config.lineHeight);
	}

	return result;
}

export function useBodySelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<BodyElementConfig>,
): BodyElementResult {
	const result = useBodyDesignTokens(ctx, config) as BodyElementResult;

	ctx.selector("body", {
		fontFamily: ctx.ref(result.bodyFontFamily),
		fontSize: ctx.ref(result.bodyFontSize),
		lineHeight: ctx.ref(result.bodyLineHeight),
		color: ctx.ref(result.bodyColor),
		background: ctx.ref(result.bodyBackground),
		"-webkit-font-smoothing": "antialiased",
		"-moz-osx-font-smoothing": "grayscale",
	});

	return result;
}

export function useBodyElement(
	s: Styleframe,
	options: WithThemes<BodyElementConfig> = {},
): BodyElementResult {
	const { themes, ...config } = mergeElementOptions(
		defaultBodyOptions,
		options,
	);

	const result = useBodySelectors(s, config as Required<BodyElementConfig>);

	registerElementThemes(s, themes, useBodyDesignTokens);

	return result;
}
