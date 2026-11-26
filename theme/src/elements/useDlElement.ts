import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultDlOptions: WithThemes<DlElementConfig> = {
	marginBottom: "@spacing",
};

export interface DlElementConfig {
	marginBottom?: TokenValue;
}

export interface DlElementResult {
	dlMarginBottom: Variable<"dl.margin-bottom">;
}

export function useDlDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: DlElementConfig = {},
): Partial<DlElementResult> {
	const result: Partial<DlElementResult> = {};

	if (config.marginBottom !== undefined) {
		result.dlMarginBottom = ctx.variable(
			"dl.margin-bottom",
			config.marginBottom,
		);
	}

	return result;
}

export function useDlSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<DlElementConfig>,
): DlElementResult {
	const result = useDlDesignTokens(ctx, config) as DlElementResult;

	ctx.selector("dl", {
		marginBottom: ctx.ref(result.dlMarginBottom),
	});

	return result;
}

export function useDlElement(
	s: Styleframe,
	options: WithThemes<DlElementConfig> = {},
): DlElementResult {
	const { themes, ...config } = mergeElementOptions(defaultDlOptions, options);

	const result = useDlSelectors(s, config as Required<DlElementConfig>);

	registerElementThemes(s, themes, useDlDesignTokens);

	return result;
}
