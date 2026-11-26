import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultSampOptions: WithThemes<SampElementConfig> = {
	fontFamily: "@font-family.mono",
};

export interface SampElementConfig {
	fontFamily?: TokenValue;
}

export interface SampElementResult {
	sampFontFamily: Variable<"samp.font-family">;
}

export function useSampDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: SampElementConfig = {},
): Partial<SampElementResult> {
	const result: Partial<SampElementResult> = {};

	if (config.fontFamily !== undefined) {
		result.sampFontFamily = ctx.variable("samp.font-family", config.fontFamily);
	}

	return result;
}

export function useSampSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<SampElementConfig>,
): SampElementResult {
	const result = useSampDesignTokens(ctx, config) as SampElementResult;

	ctx.selector("samp", {
		fontFamily: ctx.ref(result.sampFontFamily),
	});

	return result;
}

export function useSampElement(
	s: Styleframe,
	options: WithThemes<SampElementConfig> = {},
): SampElementResult {
	const { themes, ...config } = mergeElementOptions(
		defaultSampOptions,
		options,
	);

	const result = useSampSelectors(s, config as Required<SampElementConfig>);

	registerElementThemes(s, themes, useSampDesignTokens);

	return result;
}
