import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultDtOptions: WithThemes<DtElementConfig> = {
	fontWeight: "@font-weight.bold",
};

export interface DtElementConfig {
	fontWeight?: TokenValue;
}

export interface DtElementResult {
	dtFontWeight: Variable<"dt.font-weight">;
}

export function useDtDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: DtElementConfig = {},
): Partial<DtElementResult> {
	const result: Partial<DtElementResult> = {};

	if (config.fontWeight !== undefined) {
		result.dtFontWeight = ctx.variable("dt.font-weight", config.fontWeight);
	}

	return result;
}

export function useDtSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<DtElementConfig>,
): DtElementResult {
	const result = useDtDesignTokens(ctx, config) as DtElementResult;

	ctx.selector("dt", {
		fontWeight: ctx.ref(result.dtFontWeight),
	});

	return result;
}

export function useDtElement(
	s: Styleframe,
	options: WithThemes<DtElementConfig> = {},
): DtElementResult {
	const { themes, ...config } = mergeElementOptions(defaultDtOptions, options);

	const result = useDtSelectors(s, config as Required<DtElementConfig>);

	registerElementThemes(s, themes, useDtDesignTokens);

	return result;
}
