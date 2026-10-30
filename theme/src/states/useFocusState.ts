import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultFocusOptions: WithThemes<FocusStateConfig> = {
	outlineColor: "@color.focus",
	outlineWidth: "2px",
	outlineStyle: "solid",
	outlineOffset: "2px",
};

export interface FocusStateConfig {
	outlineColor?: TokenValue;
	outlineWidth?: TokenValue;
	outlineStyle?: TokenValue;
	outlineOffset?: TokenValue;
}

export interface FocusStateResult {
	focusOutlineColor: Variable<"focus.outline-color">;
	focusOutlineWidth: Variable<"focus.outline-width">;
	focusOutlineStyle: Variable<"focus.outline-style">;
	focusOutlineOffset: Variable<"focus.outline-offset">;
}

export function useFocusDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: FocusStateConfig = {},
): Partial<FocusStateResult> {
	const result: Partial<FocusStateResult> = {};

	if (config.outlineColor !== undefined)
		result.focusOutlineColor = ctx.variable(
			"focus.outline-color",
			config.outlineColor,
		);
	if (config.outlineWidth !== undefined)
		result.focusOutlineWidth = ctx.variable(
			"focus.outline-width",
			config.outlineWidth,
		);
	if (config.outlineStyle !== undefined)
		result.focusOutlineStyle = ctx.variable(
			"focus.outline-style",
			config.outlineStyle,
		);
	if (config.outlineOffset !== undefined)
		result.focusOutlineOffset = ctx.variable(
			"focus.outline-offset",
			config.outlineOffset,
		);

	return result;
}

export function useFocusSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<FocusStateConfig>,
): FocusStateResult {
	const result = useFocusDesignTokens(ctx, config) as FocusStateResult;

	ctx.selector(":focus-visible", {
		outlineColor: ctx.ref(result.focusOutlineColor),
		outlineWidth: ctx.ref(result.focusOutlineWidth),
		outlineStyle: ctx.ref(result.focusOutlineStyle),
		outlineOffset: ctx.ref(result.focusOutlineOffset),
	});

	return result;
}

export function useFocusState(
	s: Styleframe,
	options: WithThemes<FocusStateConfig> = {},
): FocusStateResult {
	const { themes, ...config } = mergeElementOptions(
		defaultFocusOptions,
		options,
	);

	// Projects that replace the default colors may not define `color.focus`,
	// so the default falls back to the primary color it references.
	if (
		config.outlineColor === defaultFocusOptions.outlineColor &&
		!s.root.variables.some((variable) => variable.name === "color.focus")
	) {
		config.outlineColor = "@color.primary";
	}

	const result = useFocusSelectors(s, config as Required<FocusStateConfig>);

	registerElementThemes(s, themes, useFocusDesignTokens);

	return result;
}
