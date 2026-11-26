import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultParagraphOptions: WithThemes<ParagraphElementConfig> = {
	marginTop: "0",
	marginBottom: "@spacing",
};

export interface ParagraphElementConfig {
	marginTop?: TokenValue;
	marginBottom?: TokenValue;
}

export interface ParagraphElementResult {
	paragraphMarginTop: Variable<"paragraph.margin-top">;
	paragraphMarginBottom: Variable<"paragraph.margin-bottom">;
}

export function useParagraphDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: ParagraphElementConfig = {},
): Partial<ParagraphElementResult> {
	const result: Partial<ParagraphElementResult> = {};

	if (config.marginTop !== undefined) {
		result.paragraphMarginTop = ctx.variable(
			"paragraph.margin-top",
			config.marginTop,
		);
	}
	if (config.marginBottom !== undefined) {
		result.paragraphMarginBottom = ctx.variable(
			"paragraph.margin-bottom",
			config.marginBottom,
		);
	}

	return result;
}

export function useParagraphSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<ParagraphElementConfig>,
): ParagraphElementResult {
	const result = useParagraphDesignTokens(
		ctx,
		config,
	) as ParagraphElementResult;

	ctx.selector("p", {
		marginTop: ctx.ref(result.paragraphMarginTop),
		marginBottom: ctx.ref(result.paragraphMarginBottom),
	});

	return result;
}

export function useParagraphElement(
	s: Styleframe,
	options: WithThemes<ParagraphElementConfig> = {},
): ParagraphElementResult {
	const { themes, ...config } = mergeElementOptions(
		defaultParagraphOptions,
		options,
	);

	const result = useParagraphSelectors(
		s,
		config as Required<ParagraphElementConfig>,
	);

	registerElementThemes(s, themes, useParagraphDesignTokens);

	return result;
}
