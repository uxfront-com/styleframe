import type {
	DeclarationsCallbackContext,
	Styleframe,
	TokenValue,
	Variable,
} from "@styleframe/core";
import type { WithThemes } from "../types";
import { mergeElementOptions, registerElementThemes } from "../utils";

export const defaultHeadingSizeConfig = {
	h1: "@font-size.4xl",
	h2: "@font-size.3xl",
	h3: "@font-size.2xl",
	h4: "@font-size.xl",
	h5: "@font-size.lg",
	h6: "@font-size.md",
} as const;

export const defaultHeadingOptions: WithThemes<HeadingElementConfig> = {
	fontFamily: "inherit",
	fontWeight: "@font-weight.bold",
	lineHeight: "@line-height.tight",
	color: "inherit",
	sizes: { ...defaultHeadingSizeConfig },
};

export interface HeadingElementConfig {
	fontFamily?: TokenValue;
	fontWeight?: TokenValue;
	lineHeight?: TokenValue;
	color?: string;
	sizes?: Partial<Record<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", TokenValue>>;
}

export interface HeadingElementResult {
	headingColor: Variable<"heading.color">;
	headingFontFamily: Variable<"heading.font-family">;
	headingFontWeight: Variable<"heading.font-weight">;
	headingLineHeight: Variable<"heading.line-height">;
	headingH1FontSize: Variable<"heading.h1.font-size">;
	headingH2FontSize: Variable<"heading.h2.font-size">;
	headingH3FontSize: Variable<"heading.h3.font-size">;
	headingH4FontSize: Variable<"heading.h4.font-size">;
	headingH5FontSize: Variable<"heading.h5.font-size">;
	headingH6FontSize: Variable<"heading.h6.font-size">;
}

export function useHeadingDesignTokens(
	ctx: DeclarationsCallbackContext,
	config: HeadingElementConfig = {},
): Partial<HeadingElementResult> {
	const result: Partial<HeadingElementResult> = {};

	if (config.color !== undefined) {
		result.headingColor = ctx.variable("heading.color", config.color);
	}
	if (config.fontFamily !== undefined) {
		result.headingFontFamily = ctx.variable(
			"heading.font-family",
			config.fontFamily,
		);
	}
	if (config.fontWeight !== undefined) {
		result.headingFontWeight = ctx.variable(
			"heading.font-weight",
			config.fontWeight,
		);
	}
	if (config.lineHeight !== undefined) {
		result.headingLineHeight = ctx.variable(
			"heading.line-height",
			config.lineHeight,
		);
	}

	if (config.sizes) {
		if (config.sizes.h1 !== undefined) {
			result.headingH1FontSize = ctx.variable(
				"heading.h1.font-size",
				config.sizes.h1,
			) as Variable<"heading.h1.font-size">;
		}
		if (config.sizes.h2 !== undefined) {
			result.headingH2FontSize = ctx.variable(
				"heading.h2.font-size",
				config.sizes.h2,
			) as Variable<"heading.h2.font-size">;
		}
		if (config.sizes.h3 !== undefined) {
			result.headingH3FontSize = ctx.variable(
				"heading.h3.font-size",
				config.sizes.h3,
			) as Variable<"heading.h3.font-size">;
		}
		if (config.sizes.h4 !== undefined) {
			result.headingH4FontSize = ctx.variable(
				"heading.h4.font-size",
				config.sizes.h4,
			) as Variable<"heading.h4.font-size">;
		}
		if (config.sizes.h5 !== undefined) {
			result.headingH5FontSize = ctx.variable(
				"heading.h5.font-size",
				config.sizes.h5,
			) as Variable<"heading.h5.font-size">;
		}
		if (config.sizes.h6 !== undefined) {
			result.headingH6FontSize = ctx.variable(
				"heading.h6.font-size",
				config.sizes.h6,
			) as Variable<"heading.h6.font-size">;
		}
	}

	return result;
}

export function useHeadingSelectors(
	ctx: DeclarationsCallbackContext,
	config: Required<HeadingElementConfig>,
): HeadingElementResult {
	const result = useHeadingDesignTokens(ctx, config) as HeadingElementResult;

	ctx.selector("h1, h2, h3, h4, h5, h6", {
		fontFamily: ctx.ref(result.headingFontFamily),
		fontWeight: ctx.ref(result.headingFontWeight),
		lineHeight: ctx.ref(result.headingLineHeight),
		color: ctx.ref(result.headingColor),
	});

	for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"] as const) {
		const resultKey =
			`heading${tag.charAt(0).toUpperCase()}${tag.charAt(1)}FontSize` as keyof HeadingElementResult;
		ctx.selector(tag, { fontSize: ctx.ref(result[resultKey]) });
	}

	return result;
}

export function useHeadingElement(
	s: Styleframe,
	options: WithThemes<HeadingElementConfig> = {},
): HeadingElementResult {
	const { themes, ...config } = mergeElementOptions(
		defaultHeadingOptions,
		options,
	);

	// Deep-merge sizes since mergeElementOptions does shallow spread
	config.sizes = {
		...defaultHeadingSizeConfig,
		...config.sizes,
	};

	const result = useHeadingSelectors(
		s,
		config as Required<HeadingElementConfig>,
	);

	registerElementThemes(s, themes, useHeadingDesignTokens);

	return result;
}
