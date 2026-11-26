import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";

import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultKbdOptions: WithThemes<KbdElementConfig> = {
	background: "#1e293b",
	color: "#ffffff",
	fontFamily: "@font-family.mono",
	fontSize: "0.875em",
	borderRadius: "@border-radius.sm",
	paddingBlock: "0.1875rem",
	paddingInline: "0.375rem",
	themes: {
		dark: {
			background: "@color.white",
			color: "@color.black",
		},
	},
};

export interface KbdElementConfig {
	background?: TokenValue;
	color?: string;
	fontFamily?: TokenValue;
	fontSize?: TokenValue;
	borderRadius?: TokenValue;
	paddingBlock?: TokenValue;
	paddingInline?: TokenValue;
}

export interface KbdElementResult {
	kbdBackground: Variable<"kbd.background">;
	kbdColor: Variable<"kbd.color">;
	kbdFontFamily: Variable<"kbd.font-family">;
	kbdFontSize: Variable<"kbd.font-size">;
	kbdBorderRadius: Variable<"kbd.border-radius">;
	kbdPaddingBlock: Variable<"kbd.padding-block">;
	kbdPaddingInline: Variable<"kbd.padding-inline">;
}

export function useKbdDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: KbdElementConfig = {},
): Partial<KbdElementResult> {
	const result: Partial<KbdElementResult> = {};

	if (config.background !== undefined) {
		result.kbdBackground = ctx.variable("kbd.background", config.background);
	}
	if (config.color !== undefined) {
		result.kbdColor = ctx.variable("kbd.color", config.color);
	}
	if (config.fontFamily !== undefined) {
		result.kbdFontFamily = ctx.variable("kbd.font-family", config.fontFamily);
	}
	if (config.fontSize !== undefined) {
		result.kbdFontSize = ctx.variable("kbd.font-size", config.fontSize);
	}
	if (config.borderRadius !== undefined) {
		result.kbdBorderRadius = ctx.variable("kbd.border-radius", config.borderRadius);
	}
	if (config.paddingBlock !== undefined) {
		result.kbdPaddingBlock = ctx.variable("kbd.padding-block", config.paddingBlock);
	}
	if (config.paddingInline !== undefined) {
		result.kbdPaddingInline = ctx.variable("kbd.padding-inline", config.paddingInline);
	}

	return result;
}

export function useKbdSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<KbdElementConfig>,
): KbdElementResult {
	const result = useKbdDesignTokens(ctx, config) as KbdElementResult;

	ctx.selector("kbd", {
		background: ctx.ref(result.kbdBackground),
		color: ctx.ref(result.kbdColor),
		fontFamily: ctx.ref(result.kbdFontFamily),
		fontSize: ctx.ref(result.kbdFontSize),
		borderRadius: ctx.ref(result.kbdBorderRadius),
		paddingBlock: ctx.ref(result.kbdPaddingBlock),
		paddingInline: ctx.ref(result.kbdPaddingInline),
		display: "inline-block",
		"& > kbd": {
			paddingBlock: "0",
			paddingInline: "0",
			fontSize: "1em",
		},
	});

	return result;
}

export function useKbdElement(
	s: Styleframe,
	options: WithThemes<KbdElementConfig> = {},
): KbdElementResult {
	const { themes, ...config } = mergeElementOptions(defaultKbdOptions, options);

	const result = useKbdSelectors(s, config as Required<KbdElementConfig>);

	registerElementThemes(s, themes, useKbdDesignTokens);

	return result;
}
