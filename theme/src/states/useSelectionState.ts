import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";

import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultSelectionOptions: WithThemes<SelectionStateConfig> = {
	background: "@color.primary",
	color: "#ffffff",
	themes: {
		dark: {
			color: "@color.white",
		},
	},
};

export interface SelectionStateConfig {
	background?: TokenValue;
	color?: string;
}

export interface SelectionStateResult {
	selectionBackground: Variable<"selection.background">;
	selectionColor: Variable<"selection.color">;
}

export function useSelectionDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: SelectionStateConfig = {},
): Partial<SelectionStateResult> {
	const result: Partial<SelectionStateResult> = {};

	if (config.background !== undefined) {
		result.selectionBackground = ctx.variable("selection.background", config.background);
	}
	if (config.color !== undefined) {
		result.selectionColor = ctx.variable("selection.color", config.color);
	}

	return result;
}

export function useSelectionSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<SelectionStateConfig>,
): SelectionStateResult {
	const result = useSelectionDesignTokens(ctx, config) as SelectionStateResult;

	ctx.selector("::selection", {
		background: ctx.ref(result.selectionBackground),
		color: ctx.ref(result.selectionColor),
	});

	return result;
}

export function useSelectionState(
	s: Styleframe,
	options: WithThemes<SelectionStateConfig> = {},
): SelectionStateResult {
	const { themes, ...config } = mergeElementOptions(defaultSelectionOptions, options);

	const result = useSelectionSelectors(s, config as Required<SelectionStateConfig>);

	registerElementThemes(s, themes, useSelectionDesignTokens);

	return result;
}
