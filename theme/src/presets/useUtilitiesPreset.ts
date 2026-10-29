import type { Styleframe } from "@styleframe/core";

// Import default values from centralized values folder
import {
	// Accessibility
	forcedColorAdjustValues,
	// Backgrounds
	backgroundAttachmentValues,
	backgroundClipValues,
	backgroundImageValues,
	backgroundOriginValues,
	backgroundPositionValues,
	backgroundRepeatValues,
	backgroundSizeValues,
	// Blend modes
	backgroundBlendModeValues,
	mixBlendModeValues,
	// Sizing
	heightValues,
	widthValues,
	// Borders utility
	borderStyleValues,
	borderWidthValues,
	divideStyleValues,
	outlineStyleValues,
	// Flexbox & Grid
	alignContentValues,
	alignItemsValues,
	alignSelfValues,
	flexDirectionValues,
	flexValues,
	flexWrapValues,
	gridAutoFlowValues,
	justifyContentValues,
	justifyItemsValues,
	justifySelfValues,
	placeContentValues,
	placeItemsValues,
	placeSelfValues,
	// Interactivity
	appearanceValues,
	colorSchemeValues,
	cursorValues,
	pointerEventsValues,
	resizeValues,
	scrollBehaviorValues,
	scrollSnapAlignValues,
	scrollSnapStopValues,
	scrollSnapTypeValues,
	touchActionValues,
	userSelectValues,
	willChangeValues,
	// Layout
	aspectRatioValues,
	boxDecorationBreakValues,
	boxSizingValues,
	breakAfterValues,
	breakBeforeValues,
	breakInsideValues,
	clearValues,
	containerTypeValues,
	displayValues,
	floatValues,
	isolationValues,
	objectFitValues,
	objectPositionValues,
	overflowValues,
	overscrollValues,
	positionValues,
	visibilityValues,
	zIndexValues,
	// Tables
	borderCollapseValues,
	captionSideValues,
	tableLayoutValues,
	// Transforms
	backfaceVisibilityValues,
	perspectiveOriginValues,
	transformOriginValues,
	transformStyleValues,
	// Transitions
	animationValues,
	transitionBehaviorValues,
	transitionPropertyValues,
	// Typography utility
	fontSmoothingValues,
	fontStretchValues,
	fontVariantNumericValues,
	hyphensValues,
	listStylePositionValues,
	listStyleTypeValues,
	overflowWrapValues,
	textAlignValues,
	textDecorationLineValues,
	textDecorationStyleValues,
	textDecorationValues,
	textOverflowValues,
	textTransformValues,
	textWrapValues,
	verticalAlignValues,
	whitespaceValues,
	wordBreakValues,
} from "../values";

// Accessibility
import {
	useForcedColorAdjustUtility,
	useNotSrOnlyUtility,
	useSrOnlyUtility,
} from "../utilities/accessibility";

// Backgrounds
import {
	useBackgroundAttachmentUtility,
	useBackgroundClipUtility,
	useBackgroundColorUtility,
	useBackgroundImageUtility,
	useBackgroundOriginUtility,
	useBackgroundPositionUtility,
	useBackgroundRepeatUtility,
	useBackgroundSizeUtility,
	useBackgroundUtility,
	useGradientFromUtility,
	useGradientToUtility,
	useGradientViaUtility,
} from "../utilities/backgrounds";

// Borders
import {
	useBorderColorBottomUtility,
	useBorderBottomUtility,
	useBorderColorEndUtility,
	useBorderColorLeftUtility,
	useBorderColorRightUtility,
	useBorderColorStartUtility,
	useBorderColorTopUtility,
	useBorderColorUtility,
	useBorderColorXUtility,
	useBorderColorYUtility,
	useBorderLeftUtility,
	useBorderRightUtility,
	useBorderTopUtility,
	useBorderUtility,
	useBorderRadiusBottomLeftUtility,
	useBorderRadiusBottomRightUtility,
	useBorderRadiusBottomUtility,
	useBorderRadiusEndEndUtility,
	useBorderRadiusEndStartUtility,
	useBorderRadiusEndUtility,
	useBorderRadiusLeftUtility,
	useBorderRadiusRightUtility,
	useBorderRadiusStartEndUtility,
	useBorderRadiusStartStartUtility,
	useBorderRadiusStartUtility,
	useBorderRadiusTopLeftUtility,
	useBorderRadiusTopRightUtility,
	useBorderRadiusTopUtility,
	useBorderRadiusUtility,
	useBorderStyleBottomUtility,
	useBorderStyleEndUtility,
	useBorderStyleLeftUtility,
	useBorderStyleRightUtility,
	useBorderStyleStartUtility,
	useBorderStyleTopUtility,
	useBorderStyleUtility,
	useBorderStyleXUtility,
	useBorderStyleYUtility,
	useBorderWidthBottomUtility,
	useBorderWidthEndUtility,
	useBorderWidthLeftUtility,
	useBorderWidthRightUtility,
	useBorderWidthStartUtility,
	useBorderWidthTopUtility,
	useBorderWidthUtility,
	useBorderWidthXUtility,
	useBorderWidthYUtility,
	useDivideColorUtility,
	useDivideStyleUtility,
	useDivideXReverseUtility,
	useDivideXUtility,
	useDivideYReverseUtility,
	useDivideYUtility,
	useOutlineColorUtility,
	useOutlineOffsetUtility,
	useOutlineStyleUtility,
	useOutlineUtility,
	useOutlineWidthUtility,
	useRingColorUtility,
	useRingInsetUtility,
	useRingOffsetColorUtility,
	useRingOffsetWidthUtility,
	useRingWidthUtility,
} from "../utilities/borders";

// Effects
import {
	useBackgroundBlendModeUtility,
	useBoxShadowColorUtility,
	useBoxShadowUtility,
	useMixBlendModeUtility,
	useOpacityUtility,
	useTextShadowColorUtility,
	useTextShadowUtility,
} from "../utilities/effects";

// Filters
import {
	useBackdropBlurUtility,
	useBackdropBrightnessUtility,
	useBackdropContrastUtility,
	useBackdropGrayscaleUtility,
	useBackdropHueRotateUtility,
	useBackdropInvertUtility,
	useBackdropOpacityUtility,
	useBackdropSaturateUtility,
	useBackdropSepiaUtility,
	useBlurUtility,
	useBrightnessUtility,
	useContrastUtility,
	useDropShadowUtility,
	useFilterUtility,
	useGrayscaleUtility,
	useHueRotateUtility,
	useInvertUtility,
	useSaturateUtility,
	useSepiaUtility,
} from "../utilities/filters";

// Flexbox and Grid
import {
	useAlignContentUtility,
	useAlignItemsUtility,
	useAlignSelfUtility,
	useFlexBasisUtility,
	useFlexDirectionUtility,
	useFlexGrowUtility,
	useFlexShrinkUtility,
	useFlexUtility,
	useFlexWrapUtility,
	useGapUtility,
	useGapXUtility,
	useGapYUtility,
	useGridAutoColumnsUtility,
	useGridAutoFlowUtility,
	useGridAutoRowsUtility,
	useGridColumnEndUtility,
	useGridColumnStartUtility,
	useGridColumnUtility,
	useGridRowEndUtility,
	useGridRowStartUtility,
	useGridRowUtility,
	useGridTemplateColumnsUtility,
	useGridTemplateRowsUtility,
	useJustifyContentUtility,
	useJustifyItemsUtility,
	useJustifySelfUtility,
	useOrderUtility,
	usePlaceContentUtility,
	usePlaceItemsUtility,
	usePlaceSelfUtility,
} from "../utilities/flexbox-grid";

// Interactivity
import {
	useAccentColorUtility,
	useAppearanceUtility,
	useWebkitAppearanceUtility,
	useCaretColorUtility,
	useColorSchemeUtility,
	useCursorUtility,
	usePointerEventsUtility,
	useResizeUtility,
	useScrollBehaviorUtility,
	useScrollMarginBottomUtility,
	useScrollMarginEndUtility,
	useScrollMarginLeftUtility,
	useScrollMarginRightUtility,
	useScrollMarginStartUtility,
	useScrollMarginTopUtility,
	useScrollMarginUtility,
	useScrollMarginXUtility,
	useScrollMarginYUtility,
	useScrollPaddingBottomUtility,
	useScrollPaddingEndUtility,
	useScrollPaddingLeftUtility,
	useScrollPaddingRightUtility,
	useScrollPaddingStartUtility,
	useScrollPaddingTopUtility,
	useScrollPaddingUtility,
	useScrollPaddingXUtility,
	useScrollPaddingYUtility,
	useScrollSnapAlignUtility,
	useScrollSnapStopUtility,
	useScrollSnapTypeUtility,
	useTouchActionUtility,
	useUserSelectUtility,
	useWillChangeUtility,
} from "../utilities/interactivity";

// Layout
import {
	useAnchorNameUtility,
	useAspectRatioUtility,
	useBottomUtility,
	useBoxDecorationBreakUtility,
	useBoxSizingUtility,
	useBreakAfterUtility,
	useBreakBeforeUtility,
	useBreakInsideUtility,
	useClearUtility,
	useColumnsUtility,
	useContainerNameUtility,
	useContainerTypeUtility,
	useDisplayUtility,
	useFloatUtility,
	useInsetEndUtility,
	useInsetStartUtility,
	useInsetUtility,
	useInsetXUtility,
	useInsetYUtility,
	useIsolationUtility,
	useLeftUtility,
	useObjectFitUtility,
	useObjectPositionUtility,
	useOverflowUtility,
	useOverflowXUtility,
	useOverflowYUtility,
	useOverscrollUtility,
	useOverscrollXUtility,
	useOverscrollYUtility,
	usePositionAnchorUtility,
	usePositionAreaUtility,
	usePositionTryFallbacksUtility,
	usePositionUtility,
	useRightUtility,
	useTopUtility,
	useVisibilityUtility,
	useZIndexUtility,
} from "../utilities/layout";

// Sizing
import {
	useHeightUtility,
	useMaxHeightUtility,
	useMaxWidthUtility,
	useMinHeightUtility,
	useMinWidthUtility,
	useSizeUtility,
	useWidthUtility,
} from "../utilities/sizing";

// Spacing
import {
	useMarginBlockUtility,
	useMarginBottomUtility,
	useMarginInlineEndUtility,
	useMarginInlineStartUtility,
	useMarginInlineUtility,
	useMarginLeftUtility,
	useMarginRightUtility,
	useMarginTopUtility,
	useMarginUtility,
	useMarginXUtility,
	useMarginYUtility,
	usePaddingBlockUtility,
	usePaddingBottomUtility,
	usePaddingInlineEndUtility,
	usePaddingInlineStartUtility,
	usePaddingInlineUtility,
	usePaddingLeftUtility,
	usePaddingRightUtility,
	usePaddingTopUtility,
	usePaddingUtility,
	usePaddingXUtility,
	usePaddingYUtility,
	useSpaceXReverseUtility,
	useSpaceXUtility,
	useSpaceYReverseUtility,
	useSpaceYUtility,
} from "../utilities/spacing";

// SVG
import {
	useFillUtility,
	useStrokeUtility,
	useStrokeWidthUtility,
} from "../utilities/svg";

// Tables
import {
	useBorderCollapseUtility,
	useBorderSpacingUtility,
	useBorderSpacingXUtility,
	useBorderSpacingYUtility,
	useCaptionSideUtility,
	useTableLayoutUtility,
} from "../utilities/tables";

// Transforms
import {
	useBackfaceVisibilityUtility,
	usePerspectiveOriginUtility,
	usePerspectiveUtility,
	useRotateUtility,
	useRotateXUtility,
	useRotateYUtility,
	useScaleUtility,
	useScaleXUtility,
	useScaleYUtility,
	useSkewXUtility,
	useSkewYUtility,
	useTransformOriginUtility,
	useTransformStyleUtility,
	useTransformUtility,
	useTranslateUtility,
	useTranslateXUtility,
	useTranslateYUtility,
	useTranslateZUtility,
} from "../utilities/transforms";

// Transitions and Animation
import {
	useAnimationUtility,
	useAnimationNameUtility,
	useAnimationDurationUtility,
	useAnimationTimingFunctionUtility,
	useAnimationIterationCountUtility,
	useTransitionBehaviorUtility,
	useTransitionDelayUtility,
	useTransitionDurationUtility,
	useTransitionPropertyUtility,
	useTransitionTimingFunctionUtility,
	useTransitionUtility,
	useViewTransitionNameUtility,
} from "../utilities/transitions-animation";

// Typography
import {
	useColorUtility,
	useContentUtility,
	useFontFamilyUtility,
	useFontSizeUtility,
	useFontSmoothingUtility,
	useFontStretchUtility,
	useFontStyleUtility,
	useFontVariantNumericUtility,
	useFontWeightUtility,
	useHyphensUtility,
	useLetterSpacingUtility,
	useLineClampUtility,
	useLineHeightUtility,
	useListStyleImageUtility,
	useListStylePositionUtility,
	useListStyleTypeUtility,
	useListStyleUtility,
	useOverflowWrapUtility,
	useTextAlignUtility,
	useTextColorUtility,
	useTextDecorationColorUtility,
	useTextDecorationLineUtility,
	useTextDecorationStyleUtility,
	useTextDecorationThicknessUtility,
	useTextDecorationUtility,
	useTextIndentUtility,
	useTextOverflowUtility,
	useTextTransformUtility,
	useTextUnderlineOffsetUtility,
	useTextWrapUtility,
	useVerticalAlignUtility,
	useWhitespaceUtility,
	useWhiteSpaceUtility,
	useWordBreakUtility,
} from "../utilities/typography";

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Meta configuration for utilities preset
 */
export interface UtilitiesMetaConfig {
	/**
	 * Controls how custom utility values combine with defaults.
	 *
	 * - `true` (default): custom values are merged with defaults. Custom values
	 *   override defaults with the same key; default keys not present in the
	 *   custom record are preserved.
	 * - `false`: custom values replace the defaults entirely for any utility
	 *   that is supplied a custom record.
	 */
	merge?: boolean;
}

/**
 * Configuration options for the utilities preset.
 *
 * - Omit or set to `undefined` to use default values
 * - Set to `false` to disable the utility category entirely
 * - Provide a custom record to merge custom values with defaults
 * - Set `meta.merge` to `false` to replace defaults entirely with the custom record
 */
export interface UtilitiesPresetConfig {
	meta?: UtilitiesMetaConfig;

	/**
	 * Custom names for utility classes (CSS class prefix).
	 * Keys are default utility names (kebab-case), values are custom names.
	 *
	 * @example
	 * ```typescript
	 * useUtilitiesPreset(s, {
	 *     names: { 'margin': 'm', 'padding': 'p', 'width': 'w' }
	 * });
	 * // Generates: ._m:sm, ._p:md, ._w:full
	 * ```
	 */
	names?: Record<string, string>;

	// Accessibility
	forcedColorAdjust?: Record<string, string> | false;

	// Backgrounds
	backgroundAttachment?: Record<string, string> | false;
	backgroundClip?: Record<string, string> | false;
	backgroundImage?: Record<string, string> | false;
	backgroundOrigin?: Record<string, string> | false;
	backgroundPosition?: Record<string, string> | false;
	backgroundRepeat?: Record<string, string> | false;
	backgroundSize?: Record<string, string> | false;

	// Effects
	backgroundBlendMode?: Record<string, string> | false;
	mixBlendMode?: Record<string, string> | false;

	// Borders utility
	divideStyle?: Record<string, string> | false;
	outline?: Record<string, string> | false;
	outlineStyle?: Record<string, string> | false;

	// Flexbox & Grid
	flex?: Record<string, string> | false;
	flexDirection?: Record<string, string> | false;
	flexWrap?: Record<string, string> | false;
	justifyContent?: Record<string, string> | false;
	justifyItems?: Record<string, string> | false;
	justifySelf?: Record<string, string> | false;
	alignContent?: Record<string, string> | false;
	alignItems?: Record<string, string> | false;
	alignSelf?: Record<string, string> | false;
	placeContent?: Record<string, string> | false;
	placeItems?: Record<string, string> | false;
	placeSelf?: Record<string, string> | false;
	gridAutoFlow?: Record<string, string> | false;

	// Interactivity
	appearance?: Record<string, string> | false;
	webkitAppearance?: Record<string, string> | false;
	colorScheme?: Record<string, string> | false;
	cursor?: Record<string, string> | false;
	pointerEvents?: Record<string, string> | false;
	resize?: Record<string, string> | false;
	scrollBehavior?: Record<string, string> | false;
	scrollSnapAlign?: Record<string, string> | false;
	scrollSnapStop?: Record<string, string> | false;
	scrollSnapType?: Record<string, string> | false;
	touchAction?: Record<string, string> | false;
	userSelect?: Record<string, string> | false;
	willChange?: Record<string, string> | false;

	// Layout
	anchorName?: Record<string, string> | false;
	aspectRatio?: Record<string, string> | false;
	boxDecorationBreak?: Record<string, string> | false;
	boxSizing?: Record<string, string> | false;
	breakAfter?: Record<string, string> | false;
	breakBefore?: Record<string, string> | false;
	breakInside?: Record<string, string> | false;
	clear?: Record<string, string> | false;
	containerType?: Record<string, string> | false;
	containerName?: Record<string, string> | false;
	display?: Record<string, string> | false;
	float?: Record<string, string> | false;
	isolation?: Record<string, string> | false;
	objectFit?: Record<string, string> | false;
	objectPosition?: Record<string, string> | false;
	overflow?: Record<string, string> | false;
	overscroll?: Record<string, string> | false;
	position?: Record<string, string> | false;
	positionAnchor?: Record<string, string> | false;
	positionArea?: Record<string, string> | false;
	positionTryFallbacks?: Record<string, string> | false;
	visibility?: Record<string, string> | false;
	zIndex?: Record<string, string> | false;

	// Sizing
	width?: Record<string, string> | false;
	minWidth?: Record<string, string> | false;
	maxWidth?: Record<string, string> | false;
	height?: Record<string, string> | false;
	minHeight?: Record<string, string> | false;
	maxHeight?: Record<string, string> | false;

	// Borders
	borderStyle?: Record<string, string> | false;
	borderWidth?: Record<string, string> | false;

	// Tables
	borderCollapse?: Record<string, string> | false;
	captionSide?: Record<string, string> | false;
	tableLayout?: Record<string, string> | false;

	// Transforms
	backfaceVisibility?: Record<string, string> | false;
	perspectiveOrigin?: Record<string, string> | false;
	transform?: Record<string, string> | false;
	transformOrigin?: Record<string, string> | false;
	transformStyle?: Record<string, string> | false;

	// Transitions & Animation
	animation?: Record<string, string> | false;
	animationName?: Record<string, string> | false;
	animationDuration?: Record<string, string> | false;
	animationTimingFunction?: Record<string, string> | false;
	animationIterationCount?: Record<string, string> | false;
	transitionBehavior?: Record<string, string> | false;
	transitionProperty?: Record<string, string> | false;
	viewTransitionName?: Record<string, string> | false;

	// Typography utility
	fontSmoothing?: Record<string, string> | false;
	fontStretch?: Record<string, string> | false;
	fontVariantNumeric?: Record<string, string> | false;
	hyphens?: Record<string, string> | false;
	listStylePosition?: Record<string, string> | false;
	listStyleType?: Record<string, string> | false;
	overflowWrap?: Record<string, string> | false;
	textAlign?: Record<string, string> | false;
	textDecoration?: Record<string, string> | false;
	textDecorationLine?: Record<string, string> | false;
	textDecorationStyle?: Record<string, string> | false;
	textOverflow?: Record<string, string> | false;
	textTransform?: Record<string, string> | false;
	textWrap?: Record<string, string> | false;
	verticalAlign?: Record<string, string> | false;
	whiteSpace?: Record<string, string> | false;
	whitespace?: Record<string, string> | false;
	wordBreak?: Record<string, string> | false;
}

/**
 * Register all utility factories with the Styleframe instance and return their creator functions.
 *
 * This function is useful when you want to register all utilities at once for use with recipes.
 * Each utility factory is registered with configurable default values.
 *
 * @param s - The Styleframe instance to register utilities with
 * @param config - Configuration options for customizing utility defaults
 * @returns An object containing creator functions for all registered utilities
 *
 * @example
 * ```typescript
 * import { styleframe } from "styleframe";
 * import { useUtilitiesPreset } from "@styleframe/theme";
 *
 * const s = styleframe();
 *
 * // Use all defaults
 * const utilities = useUtilitiesPreset(s);
 *
 * // Customize specific utilities — custom values are merged with defaults
 * const utilities = useUtilitiesPreset(s, {
 *     cursor: { custom: "url('custom.cur'), auto" },
 *     position: false, // Disable position utilities
 * });
 *
 * // Replace defaults entirely with the custom record
 * const utilities = useUtilitiesPreset(s, {
 *     meta: { merge: false },
 *     display: { flex: "flex", block: "block", hidden: "none" },
 * });
 *
 * // Now you can use the creator functions to define additional utility values
 * utilities.createMarginUtility({ sm: '0.5rem', md: '1rem', lg: '1.5rem' });
 * ```
 */
export function useUtilitiesPreset(
	s: Styleframe,
	config: UtilitiesPresetConfig = {},
) {
	const shouldMerge = config.meta?.merge !== false;

	/**
	 * Helper to resolve utility options from the names config
	 */
	function resolveUtilityOptions(defaultName: string) {
		const customName = config.names?.[defaultName];
		return customName ? { name: customName } : undefined;
	}

	/**
	 * Helper to resolve values with optional merge behavior
	 */
	function resolveValues<TDefault extends Record<string, string>>(
		configValue: Record<string, string> | false | undefined,
		defaultValue: TDefault,
	): TDefault | Record<string, string> | undefined {
		if (configValue === false) {
			return undefined;
		}

		if (configValue === undefined) {
			return defaultValue;
		}

		if (shouldMerge) {
			return { ...defaultValue, ...configValue };
		}

		return configValue;
	}

	// Resolve all utility values
	const forcedColorAdjust = resolveValues(
		config.forcedColorAdjust,
		forcedColorAdjustValues,
	);
	const backgroundAttachment = resolveValues(
		config.backgroundAttachment,
		backgroundAttachmentValues,
	);
	const backgroundClip = resolveValues(
		config.backgroundClip,
		backgroundClipValues,
	);
	const backgroundImage = resolveValues(
		config.backgroundImage,
		backgroundImageValues,
	);
	const backgroundOrigin = resolveValues(
		config.backgroundOrigin,
		backgroundOriginValues,
	);
	const backgroundPosition = resolveValues(
		config.backgroundPosition,
		backgroundPositionValues,
	);
	const backgroundRepeat = resolveValues(
		config.backgroundRepeat,
		backgroundRepeatValues,
	);
	const backgroundSize = resolveValues(
		config.backgroundSize,
		backgroundSizeValues,
	);
	const backgroundBlendMode = resolveValues(
		config.backgroundBlendMode,
		backgroundBlendModeValues,
	);
	const mixBlendMode = resolveValues(config.mixBlendMode, mixBlendModeValues);
	const divideStyle = resolveValues(config.divideStyle, divideStyleValues);
	const outlineStyle = resolveValues(config.outlineStyle, outlineStyleValues);
	const flex = resolveValues(config.flex, flexValues);
	const flexDirection = resolveValues(
		config.flexDirection,
		flexDirectionValues,
	);
	const flexWrap = resolveValues(config.flexWrap, flexWrapValues);
	const justifyContent = resolveValues(
		config.justifyContent,
		justifyContentValues,
	);
	const justifyItems = resolveValues(config.justifyItems, justifyItemsValues);
	const justifySelf = resolveValues(config.justifySelf, justifySelfValues);
	const alignContent = resolveValues(config.alignContent, alignContentValues);
	const alignItems = resolveValues(config.alignItems, alignItemsValues);
	const alignSelf = resolveValues(config.alignSelf, alignSelfValues);
	const placeContent = resolveValues(config.placeContent, placeContentValues);
	const placeItems = resolveValues(config.placeItems, placeItemsValues);
	const placeSelf = resolveValues(config.placeSelf, placeSelfValues);
	const gridAutoFlow = resolveValues(config.gridAutoFlow, gridAutoFlowValues);
	const appearance = resolveValues(config.appearance, appearanceValues);
	const webkitAppearance = resolveValues(
		config.webkitAppearance,
		appearanceValues,
	);
	const colorScheme = resolveValues(config.colorScheme, colorSchemeValues);
	const cursor = resolveValues(config.cursor, cursorValues);
	const pointerEvents = resolveValues(
		config.pointerEvents,
		pointerEventsValues,
	);
	const resize = resolveValues(config.resize, resizeValues);
	const scrollBehavior = resolveValues(
		config.scrollBehavior,
		scrollBehaviorValues,
	);
	const scrollSnapAlign = resolveValues(
		config.scrollSnapAlign,
		scrollSnapAlignValues,
	);
	const scrollSnapStop = resolveValues(
		config.scrollSnapStop,
		scrollSnapStopValues,
	);
	const scrollSnapType = resolveValues(
		config.scrollSnapType,
		scrollSnapTypeValues,
	);
	const touchAction = resolveValues(config.touchAction, touchActionValues);
	const userSelect = resolveValues(config.userSelect, userSelectValues);
	const willChange = resolveValues(config.willChange, willChangeValues);
	const anchorName = resolveValues(config.anchorName, {});
	const aspectRatio = resolveValues(config.aspectRatio, aspectRatioValues);
	const boxDecorationBreak = resolveValues(
		config.boxDecorationBreak,
		boxDecorationBreakValues,
	);
	const boxSizing = resolveValues(config.boxSizing, boxSizingValues);
	const breakAfter = resolveValues(config.breakAfter, breakAfterValues);
	const breakBefore = resolveValues(config.breakBefore, breakBeforeValues);
	const breakInside = resolveValues(config.breakInside, breakInsideValues);
	const clear = resolveValues(config.clear, clearValues);
	const containerType = resolveValues(
		config.containerType,
		containerTypeValues,
	);
	const containerName = resolveValues(config.containerName, {});
	const display = resolveValues(config.display, displayValues);
	const float = resolveValues(config.float, floatValues);
	const isolation = resolveValues(config.isolation, isolationValues);
	const objectFit = resolveValues(config.objectFit, objectFitValues);
	const objectPosition = resolveValues(
		config.objectPosition,
		objectPositionValues,
	);
	const overflow = resolveValues(config.overflow, overflowValues);
	const overscroll = resolveValues(config.overscroll, overscrollValues);
	const position = resolveValues(config.position, positionValues);
	const positionAnchor = resolveValues(config.positionAnchor, {});
	const positionArea = resolveValues(config.positionArea, {});
	const positionTryFallbacks = resolveValues(config.positionTryFallbacks, {});
	const visibility = resolveValues(config.visibility, visibilityValues);
	const zIndex = resolveValues(config.zIndex, zIndexValues);
	const width = resolveValues(config.width, widthValues);
	const minWidth = resolveValues(config.minWidth, {});
	const maxWidth = resolveValues(config.maxWidth, {});
	const height = resolveValues(config.height, heightValues);
	const minHeight = resolveValues(config.minHeight, {});
	const maxHeight = resolveValues(config.maxHeight, {});
	const borderStyle = resolveValues(config.borderStyle, borderStyleValues);
	const borderWidth = resolveValues(config.borderWidth, borderWidthValues);
	const borderCollapse = resolveValues(
		config.borderCollapse,
		borderCollapseValues,
	);
	const captionSide = resolveValues(config.captionSide, captionSideValues);
	const tableLayout = resolveValues(config.tableLayout, tableLayoutValues);
	const backfaceVisibility = resolveValues(
		config.backfaceVisibility,
		backfaceVisibilityValues,
	);
	const perspectiveOrigin = resolveValues(
		config.perspectiveOrigin,
		perspectiveOriginValues,
	);
	const transform = resolveValues(config.transform, {});
	const transformOrigin = resolveValues(
		config.transformOrigin,
		transformOriginValues,
	);
	const transformStyle = resolveValues(
		config.transformStyle,
		transformStyleValues,
	);
	const animation = resolveValues(config.animation, animationValues);
	const animationName = resolveValues(config.animationName, {});
	const animationDuration = resolveValues(config.animationDuration, {});
	const animationTimingFunction = resolveValues(
		config.animationTimingFunction,
		{},
	);
	const animationIterationCount = resolveValues(
		config.animationIterationCount,
		{},
	);
	const transitionBehavior = resolveValues(
		config.transitionBehavior,
		transitionBehaviorValues,
	);
	const transitionProperty = resolveValues(
		config.transitionProperty,
		transitionPropertyValues,
	);
	const viewTransitionName = resolveValues(config.viewTransitionName, {});
	const fontSmoothing = resolveValues(
		config.fontSmoothing,
		fontSmoothingValues,
	);
	const fontStretch = resolveValues(config.fontStretch, fontStretchValues);
	const fontVariantNumeric = resolveValues(
		config.fontVariantNumeric,
		fontVariantNumericValues,
	);
	const hyphens = resolveValues(config.hyphens, hyphensValues);
	const listStylePosition = resolveValues(
		config.listStylePosition,
		listStylePositionValues,
	);
	const listStyleType = resolveValues(
		config.listStyleType,
		listStyleTypeValues,
	);
	const overflowWrap = resolveValues(config.overflowWrap, overflowWrapValues);
	const textAlign = resolveValues(config.textAlign, textAlignValues);
	const textDecoration = resolveValues(
		config.textDecoration,
		textDecorationValues,
	);
	const textDecorationLine = resolveValues(
		config.textDecorationLine,
		textDecorationLineValues,
	);
	const textDecorationStyle = resolveValues(
		config.textDecorationStyle,
		textDecorationStyleValues,
	);
	const textOverflow = resolveValues(config.textOverflow, textOverflowValues);
	const textTransform = resolveValues(
		config.textTransform,
		textTransformValues,
	);
	const textWrap = resolveValues(config.textWrap, textWrapValues);
	const verticalAlign = resolveValues(
		config.verticalAlign,
		verticalAlignValues,
	);
	const whiteSpace = resolveValues(config.whiteSpace, whitespaceValues);
	const whitespace = resolveValues(config.whitespace, whitespaceValues);
	const wordBreak = resolveValues(config.wordBreak, wordBreakValues);

	// Register utilities with resolved values
	const createForcedColorAdjustUtility = useForcedColorAdjustUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("forced-color-adjust"),
	);
	if (forcedColorAdjust) createForcedColorAdjustUtility(forcedColorAdjust);

	const createBackgroundAttachmentUtility = useBackgroundAttachmentUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-attachment"),
	);
	if (backgroundAttachment)
		createBackgroundAttachmentUtility(backgroundAttachment);

	const createBackgroundClipUtility = useBackgroundClipUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-clip"),
	);
	if (backgroundClip) createBackgroundClipUtility(backgroundClip);

	const createBackgroundImageUtility = useBackgroundImageUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-image"),
	);
	if (backgroundImage) createBackgroundImageUtility(backgroundImage);

	const createBackgroundOriginUtility = useBackgroundOriginUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-origin"),
	);
	if (backgroundOrigin) createBackgroundOriginUtility(backgroundOrigin);

	const createBackgroundPositionUtility = useBackgroundPositionUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-position"),
	);
	if (backgroundPosition) createBackgroundPositionUtility(backgroundPosition);

	const createBackgroundRepeatUtility = useBackgroundRepeatUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-repeat"),
	);
	if (backgroundRepeat) createBackgroundRepeatUtility(backgroundRepeat);

	const createBackgroundSizeUtility = useBackgroundSizeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-size"),
	);
	if (backgroundSize) createBackgroundSizeUtility(backgroundSize);

	const createBackgroundBlendModeUtility = useBackgroundBlendModeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("background-blend-mode"),
	);
	if (backgroundBlendMode)
		createBackgroundBlendModeUtility(backgroundBlendMode);

	const createMixBlendModeUtility = useMixBlendModeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("mix-blend-mode"),
	);
	if (mixBlendMode) createMixBlendModeUtility(mixBlendMode);

	const createDivideStyleUtility = useDivideStyleUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("divide-style"),
	);
	if (divideStyle) createDivideStyleUtility(divideStyle);

	const createOutlineUtility = useOutlineUtility(s);

	const createOutlineStyleUtility = useOutlineStyleUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("outline-style"),
	);
	if (outlineStyle) createOutlineStyleUtility(outlineStyle);

	const createFlexUtility = useFlexUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("flex"),
	);
	if (flex) createFlexUtility(flex);

	const createFlexDirectionUtility = useFlexDirectionUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("flex-direction"),
	);
	if (flexDirection) createFlexDirectionUtility(flexDirection);

	const createFlexWrapUtility = useFlexWrapUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("flex-wrap"),
	);
	if (flexWrap) createFlexWrapUtility(flexWrap);

	const createJustifyContentUtility = useJustifyContentUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("justify-content"),
	);
	if (justifyContent) createJustifyContentUtility(justifyContent);

	const createJustifyItemsUtility = useJustifyItemsUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("justify-items"),
	);
	if (justifyItems) createJustifyItemsUtility(justifyItems);

	const createJustifySelfUtility = useJustifySelfUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("justify-self"),
	);
	if (justifySelf) createJustifySelfUtility(justifySelf);

	const createAlignContentUtility = useAlignContentUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("align-content"),
	);
	if (alignContent) createAlignContentUtility(alignContent);

	const createAlignItemsUtility = useAlignItemsUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("align-items"),
	);
	if (alignItems) createAlignItemsUtility(alignItems);

	const createAlignSelfUtility = useAlignSelfUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("align-self"),
	);
	if (alignSelf) createAlignSelfUtility(alignSelf);

	const createPlaceContentUtility = usePlaceContentUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("place-content"),
	);
	if (placeContent) createPlaceContentUtility(placeContent);

	const createPlaceItemsUtility = usePlaceItemsUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("place-items"),
	);
	if (placeItems) createPlaceItemsUtility(placeItems);

	const createPlaceSelfUtility = usePlaceSelfUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("place-self"),
	);
	if (placeSelf) createPlaceSelfUtility(placeSelf);

	const createGridAutoFlowUtility = useGridAutoFlowUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("grid-auto-flow"),
	);
	if (gridAutoFlow) createGridAutoFlowUtility(gridAutoFlow);

	const createAppearanceUtility = useAppearanceUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("appearance"),
	);
	if (appearance) createAppearanceUtility(appearance);

	const createWebkitAppearanceUtility = useWebkitAppearanceUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("-webkit-appearance"),
	);
	if (webkitAppearance) createWebkitAppearanceUtility(webkitAppearance);

	const createColorSchemeUtility = useColorSchemeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("color-scheme"),
	);
	if (colorScheme) createColorSchemeUtility(colorScheme);

	const createCursorUtility = useCursorUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("cursor"),
	);
	if (cursor) createCursorUtility(cursor);

	const createPointerEventsUtility = usePointerEventsUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("pointer-events"),
	);
	if (pointerEvents) createPointerEventsUtility(pointerEvents);

	const createResizeUtility = useResizeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("resize"),
	);
	if (resize) createResizeUtility(resize);

	const createScrollBehaviorUtility = useScrollBehaviorUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("scroll-behavior"),
	);
	if (scrollBehavior) createScrollBehaviorUtility(scrollBehavior);

	const createScrollSnapAlignUtility = useScrollSnapAlignUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("scroll-snap-align"),
	);
	if (scrollSnapAlign) createScrollSnapAlignUtility(scrollSnapAlign);

	const createScrollSnapStopUtility = useScrollSnapStopUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("scroll-snap-stop"),
	);
	if (scrollSnapStop) createScrollSnapStopUtility(scrollSnapStop);

	const createScrollSnapTypeUtility = useScrollSnapTypeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("scroll-snap-type"),
	);
	if (scrollSnapType) createScrollSnapTypeUtility(scrollSnapType);

	const createTouchActionUtility = useTouchActionUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("touch-action"),
	);
	if (touchAction) createTouchActionUtility(touchAction);

	const createUserSelectUtility = useUserSelectUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("user-select"),
	);
	if (userSelect) createUserSelectUtility(userSelect);

	const createWillChangeUtility = useWillChangeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("will-change"),
	);
	if (willChange) createWillChangeUtility(willChange);

	const createAnchorNameUtility = useAnchorNameUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("anchor-name"),
	);
	if (anchorName) createAnchorNameUtility(anchorName);

	const createAspectRatioUtility = useAspectRatioUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("aspect-ratio"),
	);
	if (aspectRatio) createAspectRatioUtility(aspectRatio);

	const createBoxDecorationBreakUtility = useBoxDecorationBreakUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("box-decoration-break"),
	);
	if (boxDecorationBreak) createBoxDecorationBreakUtility(boxDecorationBreak);

	const createBoxSizingUtility = useBoxSizingUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("box-sizing"),
	);
	if (boxSizing) createBoxSizingUtility(boxSizing);

	const createBreakAfterUtility = useBreakAfterUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("break-after"),
	);
	if (breakAfter) createBreakAfterUtility(breakAfter);

	const createBreakBeforeUtility = useBreakBeforeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("break-before"),
	);
	if (breakBefore) createBreakBeforeUtility(breakBefore);

	const createBreakInsideUtility = useBreakInsideUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("break-inside"),
	);
	if (breakInside) createBreakInsideUtility(breakInside);

	const createClearUtility = useClearUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("clear"),
	);
	if (clear) createClearUtility(clear);

	const createContainerTypeUtility = useContainerTypeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("container-type"),
	);
	if (containerType) createContainerTypeUtility(containerType);

	const createContainerNameUtility = useContainerNameUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("container-name"),
	);
	if (containerName) createContainerNameUtility(containerName);

	const createDisplayUtility = useDisplayUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("display"),
	);
	if (display) createDisplayUtility(display);

	const createFloatUtility = useFloatUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("float"),
	);
	if (float) createFloatUtility(float);

	const createIsolationUtility = useIsolationUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("isolation"),
	);
	if (isolation) createIsolationUtility(isolation);

	const createObjectFitUtility = useObjectFitUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("object-fit"),
	);
	if (objectFit) createObjectFitUtility(objectFit);

	const createObjectPositionUtility = useObjectPositionUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("object-position"),
	);
	if (objectPosition) createObjectPositionUtility(objectPosition);

	const createOverflowUtility = useOverflowUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("overflow"),
	);
	if (overflow) createOverflowUtility(overflow);

	const createOverscrollUtility = useOverscrollUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("overscroll"),
	);
	if (overscroll) createOverscrollUtility(overscroll);

	const createPositionUtility = usePositionUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("position"),
	);
	if (position) createPositionUtility(position);

	const createPositionAnchorUtility = usePositionAnchorUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("position-anchor"),
	);
	if (positionAnchor) createPositionAnchorUtility(positionAnchor);

	const createPositionAreaUtility = usePositionAreaUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("position-area"),
	);
	if (positionArea) createPositionAreaUtility(positionArea);

	const createPositionTryFallbacksUtility = usePositionTryFallbacksUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("position-try-fallbacks"),
	);
	if (positionTryFallbacks)
		createPositionTryFallbacksUtility(positionTryFallbacks);

	const createVisibilityUtility = useVisibilityUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("visibility"),
	);
	if (visibility) createVisibilityUtility(visibility);

	const createZIndexUtility = useZIndexUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("z-index"),
	);
	if (zIndex) createZIndexUtility(zIndex);

	const createWidthUtility = useWidthUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("width"),
	);
	if (width) createWidthUtility(width);

	const createMinWidthUtility = useMinWidthUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("min-width"),
	);
	if (minWidth) createMinWidthUtility(minWidth);

	const createMaxWidthUtility = useMaxWidthUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("max-width"),
	);
	if (maxWidth) createMaxWidthUtility(maxWidth);

	const createHeightUtility = useHeightUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("height"),
	);
	if (height) createHeightUtility(height);

	const createMinHeightUtility = useMinHeightUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("min-height"),
	);
	if (minHeight) createMinHeightUtility(minHeight);

	const createMaxHeightUtility = useMaxHeightUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("max-height"),
	);
	if (maxHeight) createMaxHeightUtility(maxHeight);

	const createBorderUtility = useBorderUtility(s);
	const createBorderTopUtility = useBorderTopUtility(s);
	const createBorderRightUtility = useBorderRightUtility(s);
	const createBorderBottomUtility = useBorderBottomUtility(s);
	const createBorderLeftUtility = useBorderLeftUtility(s);

	const createBorderStyleUtility = useBorderStyleUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-style"),
	);
	if (borderStyle) createBorderStyleUtility(borderStyle);

	const createBorderStyleXUtility = useBorderStyleXUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-x-style"),
	);
	if (borderStyle) createBorderStyleXUtility(borderStyle);

	const createBorderStyleYUtility = useBorderStyleYUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-y-style"),
	);
	if (borderStyle) createBorderStyleYUtility(borderStyle);

	const createBorderStyleTopUtility = useBorderStyleTopUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-top-style"),
	);
	if (borderStyle) createBorderStyleTopUtility(borderStyle);

	const createBorderStyleRightUtility = useBorderStyleRightUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-right-style"),
	);
	if (borderStyle) createBorderStyleRightUtility(borderStyle);

	const createBorderStyleBottomUtility = useBorderStyleBottomUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-bottom-style"),
	);
	if (borderStyle) createBorderStyleBottomUtility(borderStyle);

	const createBorderStyleLeftUtility = useBorderStyleLeftUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-left-style"),
	);
	if (borderStyle) createBorderStyleLeftUtility(borderStyle);

	const createBorderStyleStartUtility = useBorderStyleStartUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-inline-start-style"),
	);
	if (borderStyle) createBorderStyleStartUtility(borderStyle);

	const createBorderStyleEndUtility = useBorderStyleEndUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-inline-end-style"),
	);
	if (borderStyle) createBorderStyleEndUtility(borderStyle);

	const createBorderWidthUtility = useBorderWidthUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-width"),
	);
	if (borderWidth) createBorderWidthUtility(borderWidth);

	const createBorderCollapseUtility = useBorderCollapseUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("border-collapse"),
	);
	if (borderCollapse) createBorderCollapseUtility(borderCollapse);

	const createCaptionSideUtility = useCaptionSideUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("caption-side"),
	);
	if (captionSide) createCaptionSideUtility(captionSide);

	const createTableLayoutUtility = useTableLayoutUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("table-layout"),
	);
	if (tableLayout) createTableLayoutUtility(tableLayout);

	const createBackfaceVisibilityUtility = useBackfaceVisibilityUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("backface-visibility"),
	);
	if (backfaceVisibility) createBackfaceVisibilityUtility(backfaceVisibility);

	const createPerspectiveOriginUtility = usePerspectiveOriginUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("perspective-origin"),
	);
	if (perspectiveOrigin) createPerspectiveOriginUtility(perspectiveOrigin);

	const createTransformOriginUtility = useTransformOriginUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("transform-origin"),
	);
	if (transformOrigin) createTransformOriginUtility(transformOrigin);

	const createTransformStyleUtility = useTransformStyleUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("transform-style"),
	);
	if (transformStyle) createTransformStyleUtility(transformStyle);

	const createTransformUtility = useTransformUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("transform"),
	);
	if (transform) createTransformUtility(transform);

	const createAnimationUtility = useAnimationUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("animation"),
	);
	if (animation) createAnimationUtility(animation);

	const createAnimationNameUtility = useAnimationNameUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("animation-name"),
	);
	if (animationName) createAnimationNameUtility(animationName);

	const createAnimationDurationUtility = useAnimationDurationUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("animation-duration"),
	);
	if (animationDuration) createAnimationDurationUtility(animationDuration);

	const createAnimationTimingFunctionUtility =
		useAnimationTimingFunctionUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("animation-timing-function"),
		);
	if (animationTimingFunction)
		createAnimationTimingFunctionUtility(animationTimingFunction);

	const createAnimationIterationCountUtility =
		useAnimationIterationCountUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("animation-iteration-count"),
		);
	if (animationIterationCount)
		createAnimationIterationCountUtility(animationIterationCount);

	const createTransitionBehaviorUtility = useTransitionBehaviorUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("transition-behavior"),
	);
	if (transitionBehavior) createTransitionBehaviorUtility(transitionBehavior);

	const createTransitionPropertyUtility = useTransitionPropertyUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("transition-property"),
	);
	if (transitionProperty) createTransitionPropertyUtility(transitionProperty);

	const createViewTransitionNameUtility = useViewTransitionNameUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("view-transition-name"),
	);
	if (viewTransitionName) createViewTransitionNameUtility(viewTransitionName);

	const createFontSmoothingUtility = useFontSmoothingUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("font-smoothing"),
	);
	if (fontSmoothing) createFontSmoothingUtility(fontSmoothing);

	const createFontStretchUtility = useFontStretchUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("font-stretch"),
	);
	if (fontStretch) createFontStretchUtility(fontStretch);

	const createFontVariantNumericUtility = useFontVariantNumericUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("font-variant-numeric"),
	);
	if (fontVariantNumeric) createFontVariantNumericUtility(fontVariantNumeric);

	const createHyphensUtility = useHyphensUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("hyphens"),
	);
	if (hyphens) createHyphensUtility(hyphens);

	const createListStyleUtility = useListStyleUtility(s);

	const createListStylePositionUtility = useListStylePositionUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("list-style-position"),
	);
	if (listStylePosition) createListStylePositionUtility(listStylePosition);

	const createListStyleTypeUtility = useListStyleTypeUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("list-style-type"),
	);
	if (listStyleType) createListStyleTypeUtility(listStyleType);

	const createOverflowWrapUtility = useOverflowWrapUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("overflow-wrap"),
	);
	if (overflowWrap) createOverflowWrapUtility(overflowWrap);

	const createTextAlignUtility = useTextAlignUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("text-align"),
	);
	if (textAlign) createTextAlignUtility(textAlign);

	const createTextDecorationUtility = useTextDecorationUtility(s);
	if (textDecoration) createTextDecorationUtility(textDecoration);

	const createTextDecorationLineUtility = useTextDecorationLineUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("text-decoration-line"),
	);
	if (textDecorationLine) createTextDecorationLineUtility(textDecorationLine);

	const createTextDecorationStyleUtility = useTextDecorationStyleUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("text-decoration-style"),
	);
	if (textDecorationStyle)
		createTextDecorationStyleUtility(textDecorationStyle);

	const createTextOverflowUtility = useTextOverflowUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("text-overflow"),
	);
	if (textOverflow) createTextOverflowUtility(textOverflow);

	const createTextTransformUtility = useTextTransformUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("text-transform"),
	);
	if (textTransform) createTextTransformUtility(textTransform);

	const createTextWrapUtility = useTextWrapUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("text-wrap"),
	);
	if (textWrap) createTextWrapUtility(textWrap);

	const createVerticalAlignUtility = useVerticalAlignUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("vertical-align"),
	);
	if (verticalAlign) createVerticalAlignUtility(verticalAlign);

	const createWhiteSpaceUtility = useWhiteSpaceUtility(s);
	if (whiteSpace) createWhiteSpaceUtility(whiteSpace);

	const createWhitespaceUtility = useWhitespaceUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("whitespace"),
	);
	if (whitespace) createWhitespaceUtility(whitespace);

	const createWordBreakUtility = useWordBreakUtility(
		s,
		undefined,
		undefined,
		resolveUtilityOptions("word-break"),
	);
	if (wordBreak) createWordBreakUtility(wordBreak);

	return {
		// Accessibility
		createForcedColorAdjustUtility,
		createNotSrOnlyUtility: useNotSrOnlyUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("not-sr-only"),
		),
		createSrOnlyUtility: useSrOnlyUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("sr-only"),
		),

		// Backgrounds
		createBackgroundAttachmentUtility,
		createBackgroundClipUtility,
		createBackgroundColorUtility: useBackgroundColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("background-color"),
		),
		createBackgroundImageUtility,
		createBackgroundOriginUtility,
		createBackgroundPositionUtility,
		createBackgroundRepeatUtility,
		createBackgroundSizeUtility,
		createBackgroundUtility: useBackgroundUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("background"),
		),
		createGradientFromUtility: useGradientFromUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("gradient-from"),
		),
		createGradientToUtility: useGradientToUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("gradient-to"),
		),
		createGradientViaUtility: useGradientViaUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("gradient-via"),
		),

		// Borders
		createBorderUtility,
		createBorderTopUtility,
		createBorderRightUtility,
		createBorderBottomUtility,
		createBorderLeftUtility,
		createBorderColorBottomUtility: useBorderColorBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-bottom-color"),
		),
		createBorderColorEndUtility: useBorderColorEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-inline-end-color"),
		),
		createBorderColorLeftUtility: useBorderColorLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-left-color"),
		),
		createBorderColorRightUtility: useBorderColorRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-right-color"),
		),
		createBorderColorStartUtility: useBorderColorStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-inline-start-color"),
		),
		createBorderColorTopUtility: useBorderColorTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-top-color"),
		),
		createBorderColorUtility: useBorderColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-color"),
		),
		createBorderColorXUtility: useBorderColorXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-x-color"),
		),
		createBorderColorYUtility: useBorderColorYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-y-color"),
		),
		createBorderRadiusBottomLeftUtility: useBorderRadiusBottomLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-bottom-left-radius"),
		),
		createBorderRadiusBottomRightUtility: useBorderRadiusBottomRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-bottom-right-radius"),
		),
		createBorderRadiusBottomUtility: useBorderRadiusBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-radius-bottom"),
		),
		createBorderRadiusEndEndUtility: useBorderRadiusEndEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-end-end-radius"),
		),
		createBorderRadiusEndStartUtility: useBorderRadiusEndStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-end-start-radius"),
		),
		createBorderRadiusEndUtility: useBorderRadiusEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-radius-end"),
		),
		createBorderRadiusLeftUtility: useBorderRadiusLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-radius-left"),
		),
		createBorderRadiusRightUtility: useBorderRadiusRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-radius-right"),
		),
		createBorderRadiusStartEndUtility: useBorderRadiusStartEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-start-end-radius"),
		),
		createBorderRadiusStartStartUtility: useBorderRadiusStartStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-start-start-radius"),
		),
		createBorderRadiusStartUtility: useBorderRadiusStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-radius-start"),
		),
		createBorderRadiusTopLeftUtility: useBorderRadiusTopLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-top-left-radius"),
		),
		createBorderRadiusTopRightUtility: useBorderRadiusTopRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-top-right-radius"),
		),
		createBorderRadiusTopUtility: useBorderRadiusTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-radius-top"),
		),
		createBorderRadiusUtility: useBorderRadiusUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-radius"),
		),
		createBorderStyleUtility,
		createBorderStyleBottomUtility,
		createBorderStyleEndUtility,
		createBorderStyleLeftUtility,
		createBorderStyleRightUtility,
		createBorderStyleStartUtility,
		createBorderStyleTopUtility,
		createBorderStyleXUtility,
		createBorderStyleYUtility,
		createBorderWidthBottomUtility: useBorderWidthBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-bottom-width"),
		),
		createBorderWidthEndUtility: useBorderWidthEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-inline-end-width"),
		),
		createBorderWidthLeftUtility: useBorderWidthLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-left-width"),
		),
		createBorderWidthRightUtility: useBorderWidthRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-right-width"),
		),
		createBorderWidthStartUtility: useBorderWidthStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-inline-start-width"),
		),
		createBorderWidthTopUtility: useBorderWidthTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-top-width"),
		),
		createBorderWidthUtility,
		createBorderWidthXUtility: useBorderWidthXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-x-width"),
		),
		createBorderWidthYUtility: useBorderWidthYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-y-width"),
		),
		createDivideColorUtility: useDivideColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("divide-color"),
		),
		createDivideStyleUtility,
		createDivideXReverseUtility: useDivideXReverseUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("divide-x-reverse"),
		),
		createDivideXUtility: useDivideXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("divide-x"),
		),
		createDivideYReverseUtility: useDivideYReverseUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("divide-y-reverse"),
		),
		createDivideYUtility: useDivideYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("divide-y"),
		),
		createOutlineColorUtility: useOutlineColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("outline-color"),
		),
		createOutlineOffsetUtility: useOutlineOffsetUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("outline-offset"),
		),
		createOutlineStyleUtility,
		createOutlineUtility,
		createOutlineWidthUtility: useOutlineWidthUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("outline-width"),
		),
		createRingColorUtility: useRingColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("ring-color"),
		),
		createRingInsetUtility: useRingInsetUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("ring-inset"),
		),
		createRingOffsetColorUtility: useRingOffsetColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("ring-offset-color"),
		),
		createRingOffsetWidthUtility: useRingOffsetWidthUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("ring-offset"),
		),
		createRingWidthUtility: useRingWidthUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("ring"),
		),

		// Effects
		createBackgroundBlendModeUtility,
		createBoxShadowColorUtility: useBoxShadowColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("box-shadow-color"),
		),
		createBoxShadowUtility: useBoxShadowUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("box-shadow"),
		),
		createMixBlendModeUtility,
		createOpacityUtility: useOpacityUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("opacity"),
		),
		createTextShadowColorUtility: useTextShadowColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("text-shadow-color"),
		),
		createTextShadowUtility: useTextShadowUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("text-shadow"),
		),

		// Filters
		createBackdropBlurUtility: useBackdropBlurUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-blur"),
		),
		createBackdropBrightnessUtility: useBackdropBrightnessUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-brightness"),
		),
		createBackdropContrastUtility: useBackdropContrastUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-contrast"),
		),
		createBackdropGrayscaleUtility: useBackdropGrayscaleUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-grayscale"),
		),
		createBackdropHueRotateUtility: useBackdropHueRotateUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-hue-rotate"),
		),
		createBackdropInvertUtility: useBackdropInvertUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-invert"),
		),
		createBackdropOpacityUtility: useBackdropOpacityUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-opacity"),
		),
		createBackdropSaturateUtility: useBackdropSaturateUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-saturate"),
		),
		createBackdropSepiaUtility: useBackdropSepiaUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("backdrop-sepia"),
		),
		createBlurUtility: useBlurUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("blur"),
		),
		createBrightnessUtility: useBrightnessUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("brightness"),
		),
		createContrastUtility: useContrastUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("contrast"),
		),
		createDropShadowUtility: useDropShadowUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("drop-shadow"),
		),
		createFilterUtility: useFilterUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("filter"),
		),
		createGrayscaleUtility: useGrayscaleUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grayscale"),
		),
		createHueRotateUtility: useHueRotateUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("hue-rotate"),
		),
		createInvertUtility: useInvertUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("invert"),
		),
		createSaturateUtility: useSaturateUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("saturate"),
		),
		createSepiaUtility: useSepiaUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("sepia"),
		),

		// Flexbox and Grid
		createAlignContentUtility,
		createAlignItemsUtility,
		createAlignSelfUtility,
		createFlexBasisUtility: useFlexBasisUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("flex-basis"),
		),
		createFlexDirectionUtility,
		createFlexGrowUtility: useFlexGrowUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("flex-grow"),
		),
		createFlexShrinkUtility: useFlexShrinkUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("flex-shrink"),
		),
		createFlexUtility,
		createFlexWrapUtility,
		createGapUtility: useGapUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("gap"),
		),
		createGapXUtility: useGapXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("gap-x"),
		),
		createGapYUtility: useGapYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("gap-y"),
		),
		createGridAutoColumnsUtility: useGridAutoColumnsUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-auto-columns"),
		),
		createGridAutoFlowUtility,
		createGridAutoRowsUtility: useGridAutoRowsUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-auto-rows"),
		),
		createGridColumnEndUtility: useGridColumnEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-column-end"),
		),
		createGridColumnStartUtility: useGridColumnStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-column-start"),
		),
		createGridColumnUtility: useGridColumnUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-column"),
		),
		createGridRowEndUtility: useGridRowEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-row-end"),
		),
		createGridRowStartUtility: useGridRowStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-row-start"),
		),
		createGridRowUtility: useGridRowUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-row"),
		),
		createGridTemplateColumnsUtility: useGridTemplateColumnsUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-template-columns"),
		),
		createGridTemplateRowsUtility: useGridTemplateRowsUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("grid-template-rows"),
		),
		createJustifyContentUtility,
		createJustifyItemsUtility,
		createJustifySelfUtility,
		createOrderUtility: useOrderUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("order"),
		),
		createPlaceContentUtility,
		createPlaceItemsUtility,
		createPlaceSelfUtility,

		// Interactivity
		createAccentColorUtility: useAccentColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("accent-color"),
		),
		createAppearanceUtility,
		createWebkitAppearanceUtility,
		createCaretColorUtility: useCaretColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("caret-color"),
		),
		createColorSchemeUtility,
		createCursorUtility,
		createPointerEventsUtility,
		createResizeUtility,
		createScrollBehaviorUtility,
		createScrollMarginBottomUtility: useScrollMarginBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-bottom"),
		),
		createScrollMarginEndUtility: useScrollMarginEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-inline-end"),
		),
		createScrollMarginLeftUtility: useScrollMarginLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-left"),
		),
		createScrollMarginRightUtility: useScrollMarginRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-right"),
		),
		createScrollMarginStartUtility: useScrollMarginStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-inline-start"),
		),
		createScrollMarginTopUtility: useScrollMarginTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-top"),
		),
		createScrollMarginUtility: useScrollMarginUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin"),
		),
		createScrollMarginXUtility: useScrollMarginXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-x"),
		),
		createScrollMarginYUtility: useScrollMarginYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-margin-y"),
		),
		createScrollPaddingBottomUtility: useScrollPaddingBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-bottom"),
		),
		createScrollPaddingEndUtility: useScrollPaddingEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-inline-end"),
		),
		createScrollPaddingLeftUtility: useScrollPaddingLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-left"),
		),
		createScrollPaddingRightUtility: useScrollPaddingRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-right"),
		),
		createScrollPaddingStartUtility: useScrollPaddingStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-inline-start"),
		),
		createScrollPaddingTopUtility: useScrollPaddingTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-top"),
		),
		createScrollPaddingUtility: useScrollPaddingUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding"),
		),
		createScrollPaddingXUtility: useScrollPaddingXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-x"),
		),
		createScrollPaddingYUtility: useScrollPaddingYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scroll-padding-y"),
		),
		createScrollSnapAlignUtility,
		createScrollSnapStopUtility,
		createScrollSnapTypeUtility,
		createTouchActionUtility,
		createUserSelectUtility,
		createWillChangeUtility,

		// Layout
		createAspectRatioUtility,
		createBottomUtility: useBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("bottom"),
		),
		createBoxDecorationBreakUtility,
		createBoxSizingUtility,
		createAnchorNameUtility,
		createBreakAfterUtility,
		createBreakBeforeUtility,
		createBreakInsideUtility,
		createClearUtility,
		createColumnsUtility: useColumnsUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("columns"),
		),
		createContainerTypeUtility,
		createContainerNameUtility,
		createDisplayUtility,
		createFloatUtility,
		createInsetEndUtility: useInsetEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("inset-inline-end"),
		),
		createInsetStartUtility: useInsetStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("inset-inline-start"),
		),
		createInsetUtility: useInsetUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("inset"),
		),
		createInsetXUtility: useInsetXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("inset-x"),
		),
		createInsetYUtility: useInsetYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("inset-y"),
		),
		createIsolationUtility,
		createLeftUtility: useLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("left"),
		),
		createObjectFitUtility,
		createObjectPositionUtility,
		createOverflowUtility,
		createOverflowXUtility: useOverflowXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("overflow-x"),
		),
		createOverflowYUtility: useOverflowYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("overflow-y"),
		),
		createOverscrollUtility,
		createOverscrollXUtility: useOverscrollXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("overscroll-x"),
		),
		createOverscrollYUtility: useOverscrollYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("overscroll-y"),
		),
		createPositionUtility,
		createPositionAnchorUtility,
		createPositionAreaUtility,
		createPositionTryFallbacksUtility,
		createRightUtility: useRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("right"),
		),
		createTopUtility: useTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("top"),
		),
		createVisibilityUtility,
		createZIndexUtility,

		// Sizing
		createHeightUtility,
		createMaxHeightUtility,
		createMaxWidthUtility,
		createMinHeightUtility,
		createMinWidthUtility,
		createSizeUtility: useSizeUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("size"),
		),
		createWidthUtility,

		// Spacing
		createMarginBlockUtility: useMarginBlockUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-block"),
		),
		createMarginBottomUtility: useMarginBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-bottom"),
		),
		createMarginInlineEndUtility: useMarginInlineEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-inline-end"),
		),
		createMarginInlineStartUtility: useMarginInlineStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-inline-start"),
		),
		createMarginInlineUtility: useMarginInlineUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-inline"),
		),
		createMarginLeftUtility: useMarginLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-left"),
		),
		createMarginRightUtility: useMarginRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-right"),
		),
		createMarginTopUtility: useMarginTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-top"),
		),
		createMarginUtility: useMarginUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin"),
		),
		createMarginXUtility: useMarginXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-x"),
		),
		createMarginYUtility: useMarginYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("margin-y"),
		),
		createPaddingBlockUtility: usePaddingBlockUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-block"),
		),
		createPaddingBottomUtility: usePaddingBottomUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-bottom"),
		),
		createPaddingInlineEndUtility: usePaddingInlineEndUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-inline-end"),
		),
		createPaddingInlineStartUtility: usePaddingInlineStartUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-inline-start"),
		),
		createPaddingInlineUtility: usePaddingInlineUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-inline"),
		),
		createPaddingLeftUtility: usePaddingLeftUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-left"),
		),
		createPaddingRightUtility: usePaddingRightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-right"),
		),
		createPaddingTopUtility: usePaddingTopUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-top"),
		),
		createPaddingUtility: usePaddingUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding"),
		),
		createPaddingXUtility: usePaddingXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-x"),
		),
		createPaddingYUtility: usePaddingYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("padding-y"),
		),
		createSpaceXReverseUtility: useSpaceXReverseUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("space-x-reverse"),
		),
		createSpaceXUtility: useSpaceXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("space-x"),
		),
		createSpaceYReverseUtility: useSpaceYReverseUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("space-y-reverse"),
		),
		createSpaceYUtility: useSpaceYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("space-y"),
		),

		// SVG
		createFillUtility: useFillUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("fill"),
		),
		createStrokeUtility: useStrokeUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("stroke"),
		),
		createStrokeWidthUtility: useStrokeWidthUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("stroke-width"),
		),

		// Tables
		createBorderCollapseUtility,
		createBorderSpacingUtility: useBorderSpacingUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-spacing"),
		),
		createBorderSpacingXUtility: useBorderSpacingXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-spacing-x"),
		),
		createBorderSpacingYUtility: useBorderSpacingYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("border-spacing-y"),
		),
		createCaptionSideUtility,
		createTableLayoutUtility,

		// Transforms
		createBackfaceVisibilityUtility,
		createPerspectiveOriginUtility,
		createPerspectiveUtility: usePerspectiveUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("perspective"),
		),
		createRotateUtility: useRotateUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("rotate"),
		),
		createRotateXUtility: useRotateXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("rotate-x"),
		),
		createRotateYUtility: useRotateYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("rotate-y"),
		),
		createScaleUtility: useScaleUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scale"),
		),
		createScaleXUtility: useScaleXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scale-x"),
		),
		createScaleYUtility: useScaleYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("scale-y"),
		),
		createSkewXUtility: useSkewXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("skew-x"),
		),
		createSkewYUtility: useSkewYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("skew-y"),
		),
		createTransformOriginUtility,
		createTransformStyleUtility,
		createTransformUtility,
		createTranslateUtility: useTranslateUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("translate"),
		),
		createTranslateXUtility: useTranslateXUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("translate-x"),
		),
		createTranslateYUtility: useTranslateYUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("translate-y"),
		),
		createTranslateZUtility: useTranslateZUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("translate-z"),
		),

		// Transitions and Animation
		createAnimationUtility,
		createAnimationNameUtility,
		createAnimationDurationUtility,
		createAnimationTimingFunctionUtility,
		createAnimationIterationCountUtility,
		createTransitionBehaviorUtility,
		createTransitionUtility: useTransitionUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("transition"),
		),
		createTransitionDelayUtility: useTransitionDelayUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("transition-delay"),
		),
		createTransitionDurationUtility: useTransitionDurationUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("transition-duration"),
		),
		createTransitionPropertyUtility,
		createTransitionTimingFunctionUtility: useTransitionTimingFunctionUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("transition-timing-function"),
		),
		createViewTransitionNameUtility,

		// Typography
		createColorUtility: useColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("color"),
		),
		createContentUtility: useContentUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("content"),
		),
		createFontFamilyUtility: useFontFamilyUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("font-family"),
		),
		createFontSizeUtility: useFontSizeUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("font-size"),
		),
		createFontSmoothingUtility,
		createFontStretchUtility,
		createFontStyleUtility: useFontStyleUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("font-style"),
		),
		createFontVariantNumericUtility,
		createFontWeightUtility: useFontWeightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("font-weight"),
		),
		createHyphensUtility,
		createLetterSpacingUtility: useLetterSpacingUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("letter-spacing"),
		),
		createLineClampUtility: useLineClampUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("line-clamp"),
		),
		createLineHeightUtility: useLineHeightUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("line-height"),
		),
		createListStyleUtility,
		createListStyleImageUtility: useListStyleImageUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("list-style-image"),
		),
		createListStylePositionUtility,
		createListStyleTypeUtility,
		createOverflowWrapUtility,
		createTextAlignUtility,
		createTextColorUtility: useTextColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("text-color"),
		),
		createTextDecorationColorUtility: useTextDecorationColorUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("text-decoration-color"),
		),
		createTextDecorationLineUtility,
		createTextDecorationStyleUtility,
		createTextDecorationUtility,
		createTextDecorationThicknessUtility: useTextDecorationThicknessUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("text-decoration-thickness"),
		),
		createTextIndentUtility: useTextIndentUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("text-indent"),
		),
		createTextOverflowUtility,
		createTextTransformUtility,
		createTextUnderlineOffsetUtility: useTextUnderlineOffsetUtility(
			s,
			undefined,
			undefined,
			resolveUtilityOptions("text-underline-offset"),
		),
		createTextWrapUtility,
		createVerticalAlignUtility,
		createWhiteSpaceUtility,
		createWhitespaceUtility,
		createWordBreakUtility,
	};
}
