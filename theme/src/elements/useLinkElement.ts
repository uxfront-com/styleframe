import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultLinkOptions: WithThemes<LinkElementConfig> = {
	color: "@color.primary",
	textDecoration: "none",
	hoverColor: "@color.primary-700",
	hoverTextDecoration: "underline",
};

export interface LinkElementConfig {
	color?: TokenValue;
	textDecoration?: TokenValue;
	hoverColor?: TokenValue;
	hoverTextDecoration?: TokenValue;
}

export interface LinkElementResult {
	linkColor: Variable<"link.color">;
	linkTextDecoration: Variable<"link.text-decoration">;
	linkHoverColor: Variable<"link.hover.color">;
	linkHoverTextDecoration: Variable<"link.hover.text-decoration">;
}

export function useLinkDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: LinkElementConfig = {},
): Partial<LinkElementResult> {
	const result: Partial<LinkElementResult> = {};

	if (config.color !== undefined)
		result.linkColor = ctx.variable("link.color", config.color);
	if (config.textDecoration !== undefined)
		result.linkTextDecoration = ctx.variable(
			"link.text-decoration",
			config.textDecoration,
		);
	if (config.hoverColor !== undefined)
		result.linkHoverColor = ctx.variable("link.hover.color", config.hoverColor);
	if (config.hoverTextDecoration !== undefined)
		result.linkHoverTextDecoration = ctx.variable(
			"link.hover.text-decoration",
			config.hoverTextDecoration,
		);

	return result;
}

export function useLinkSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<LinkElementConfig>,
): LinkElementResult {
	const result = useLinkDesignTokens(ctx, config) as LinkElementResult;

	ctx.selector("a", {
		color: ctx.ref(result.linkColor),
		textDecoration: ctx.ref(result.linkTextDecoration),
		// On touch screens a tap leaves :hover applied, so the hover styles only
		// apply on devices that can hover.
		"@media (hover: hover)": {
			"&:hover": {
				color: ctx.ref(result.linkHoverColor),
				textDecoration: ctx.ref(result.linkHoverTextDecoration),
			},
		},
	});

	return result;
}

export function useLinkElement(
	s: Styleframe,
	options: WithThemes<LinkElementConfig> = {},
): LinkElementResult {
	const { themes, ...config } = mergeElementOptions(
		defaultLinkOptions,
		options,
	);

	const result = useLinkSelectors(s, config as Required<LinkElementConfig>);

	registerElementThemes(s, themes, useLinkDesignTokens);

	return result;
}
