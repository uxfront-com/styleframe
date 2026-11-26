import type { Styleframe } from "@styleframe/core";

import {
	useAbbrElement,
	useAddressElement,
	useBodyElement,
	useCaptionElement,
	useCodeElement,
	useDdElement,
	useDlElement,
	useDtElement,
	useHeadingElement,
	useHrElement,
	useIframeElement,
	useImgElement,
	useKbdElement,
	useLegendElement,
	useLinkElement,
	useMarkElement,
	useOlElement,
	useOutputElement,
	useParagraphElement,
	usePreElement,
	useSampElement,
	useSummaryElement,
	useUlElement,
} from "../elements";
import type {
	AbbrElementConfig,
	AbbrElementResult,
	AddressElementConfig,
	AddressElementResult,
	BodyElementConfig,
	BodyElementResult,
	CaptionElementConfig,
	CaptionElementResult,
	CodeElementConfig,
	CodeElementResult,
	DdElementConfig,
	DdElementResult,
	DlElementConfig,
	DlElementResult,
	DtElementConfig,
	DtElementResult,
	HeadingElementConfig,
	HeadingElementResult,
	HrElementConfig,
	HrElementResult,
	KbdElementConfig,
	KbdElementResult,
	LinkElementConfig,
	LinkElementResult,
	MarkElementConfig,
	MarkElementResult,
	OlElementConfig,
	OlElementResult,
	ParagraphElementConfig,
	ParagraphElementResult,
	PreElementConfig,
	PreElementResult,
	SampElementConfig,
	SampElementResult,
	UlElementConfig,
	UlElementResult,
} from "../elements";
import { useFocusState, useSelectionState } from "../states";
import type {
	FocusStateConfig,
	FocusStateResult,
	SelectionStateConfig,
	SelectionStateResult,
} from "../states";
import type { WithThemes } from "../types";

// Re-export element defaults
export {
	defaultAbbrOptions,
	defaultAddressOptions,
	defaultBodyOptions,
	defaultCodeOptions,
	defaultDdOptions,
	defaultDlOptions,
	defaultDtOptions,
	defaultHeadingSizeConfig,
	defaultHeadingOptions,
	defaultLinkOptions,
	defaultOlOptions,
	defaultParagraphOptions,
	defaultPreOptions,
	defaultSampOptions,
	defaultUlOptions,
	defaultCaptionOptions,
	defaultHrOptions,
	defaultKbdOptions,
	defaultMarkOptions,
} from "../elements";

// Re-export state defaults
export { defaultFocusOptions, defaultSelectionOptions } from "../states";

// =============================================================================
// Configuration Types
// =============================================================================

export type GlobalAddressConfig = AddressElementConfig;
export type GlobalBodyConfig = BodyElementConfig;
export type GlobalHeadingsConfig = HeadingElementConfig;
export type GlobalLinksConfig = LinkElementConfig;
export type GlobalCodeConfig = CodeElementConfig;
export type GlobalSelectionConfig = SelectionStateConfig;
export type GlobalFocusConfig = FocusStateConfig;
export type GlobalDlConfig = DlElementConfig;
export type GlobalDtConfig = DtElementConfig;
export type GlobalDdConfig = DdElementConfig;

export interface GlobalThemeOverrides {
	address?: AddressElementConfig;
	body?: BodyElementConfig;
	heading?: HeadingElementConfig;
	link?: LinkElementConfig;
	selection?: SelectionStateConfig;
	focus?: FocusStateConfig;
	hr?: HrElementConfig;
	kbd?: KbdElementConfig;
	mark?: MarkElementConfig;
	caption?: CaptionElementConfig;
	dl?: DlElementConfig;
	dt?: DtElementConfig;
	dd?: DdElementConfig;
	abbr?: AbbrElementConfig;
	samp?: SampElementConfig;
	paragraph?: ParagraphElementConfig;
	ol?: OlElementConfig;
	ul?: UlElementConfig;
	code?: CodeElementConfig;
	pre?: PreElementConfig;
}

export interface GlobalPresetConfig {
	address?: WithThemes<AddressElementConfig> | false;
	body?: WithThemes<BodyElementConfig> | false;
	heading?: WithThemes<HeadingElementConfig> | false;
	link?: WithThemes<LinkElementConfig> | false;
	code?: WithThemes<CodeElementConfig> | false;
	selection?: WithThemes<SelectionStateConfig> | false;
	focus?: WithThemes<FocusStateConfig> | false;
	hr?: WithThemes<HrElementConfig> | false;
	kbd?: WithThemes<KbdElementConfig> | false;
	mark?: WithThemes<MarkElementConfig> | false;
	caption?: WithThemes<CaptionElementConfig> | false;
	pre?: WithThemes<PreElementConfig> | false;
	dl?: WithThemes<DlElementConfig> | false;
	dt?: WithThemes<DtElementConfig> | false;
	dd?: WithThemes<DdElementConfig> | false;
	abbr?: WithThemes<AbbrElementConfig> | false;
	samp?: WithThemes<SampElementConfig> | false;
	ol?: WithThemes<OlElementConfig> | false;
	ul?: WithThemes<UlElementConfig> | false;
	paragraph?: WithThemes<ParagraphElementConfig> | false;
	img?: boolean;
	iframe?: boolean;
	output?: boolean;
	legend?: boolean;
	summary?: boolean;
	themes?: Record<string, GlobalThemeOverrides>;
}

// =============================================================================
// Result Type
// =============================================================================

export interface GlobalPresetResult {
	abbr?: AbbrElementResult;
	address?: AddressElementResult;
	body?: BodyElementResult;
	heading?: HeadingElementResult;
	link?: LinkElementResult;
	code?: CodeElementResult;
	selection?: SelectionStateResult;
	focus?: FocusStateResult;
	hr?: HrElementResult;
	kbd?: KbdElementResult;
	mark?: MarkElementResult;
	caption?: CaptionElementResult;
	dl?: DlElementResult;
	dt?: DtElementResult;
	dd?: DdElementResult;
	samp?: SampElementResult;
	paragraph?: ParagraphElementResult;
	ol?: OlElementResult;
	ul?: UlElementResult;
	pre?: PreElementResult;
}

// =============================================================================
// Main Preset Function
// =============================================================================

/**
 * Transposes centralized theme overrides into per-element theme maps.
 *
 * Converts `config.themes.dark.body` → `{ dark: bodyOverrides }` for use
 * as the `themes` property in each element's `WithThemes<T>` options.
 */
function getElementThemes<T>(
	configThemes: Record<string, GlobalThemeOverrides> | undefined,
	key: keyof GlobalThemeOverrides,
): Record<string, T> | undefined {
	if (!configThemes) {
		return undefined;
	}
	let result: Record<string, T> | undefined;
	for (const [themeName, overrides] of Object.entries(configThemes)) {
		const elementOverride = overrides[key];
		if (elementOverride) {
			result ??= {};
			result[themeName] = elementOverride as T;
		}
	}
	return result;
}

/**
 * Merges per-element themes with transposed centralized themes.
 * Centralized themes take precedence (more specific override).
 */
function mergeElementThemes<T>(
	elementThemes: Record<string, T> | undefined,
	centralThemes: Record<string, T> | undefined,
): Record<string, T> | undefined {
	if (!elementThemes && !centralThemes) {
		return undefined;
	}
	if (!elementThemes) {
		return centralThemes;
	}
	if (!centralThemes) {
		return elementThemes;
	}

	const merged: Record<string, T> = {};
	const themeNames = new Set([...Object.keys(elementThemes), ...Object.keys(centralThemes)]);
	for (const name of themeNames) {
		merged[name] = {
			...elementThemes[name],
			...centralThemes[name],
		} as T;
	}
	return merged;
}

/**
 * Builds the final WithThemes options for an element, merging per-element
 * themes from the element config with transposed centralized themes.
 */
function buildElementOptions<T extends object>(
	elementConfig: WithThemes<T> | undefined,
	configThemes: Record<string, GlobalThemeOverrides> | undefined,
	key: keyof GlobalThemeOverrides,
): WithThemes<T> {
	const config = elementConfig ?? ({} as WithThemes<T>);
	const centralThemes = getElementThemes<T>(configThemes, key);
	const mergedThemes = mergeElementThemes(config.themes, centralThemes);

	if (mergedThemes) {
		return { ...config, themes: mergedThemes };
	}
	return config;
}

export function useGlobalPreset(
	s: Styleframe,
	config: GlobalPresetConfig = {},
): GlobalPresetResult {
	const result: GlobalPresetResult = {};

	// ── Elements with variables ──
	if (config.address !== false) {
		result.address = useAddressElement(
			s,
			buildElementOptions(config.address || undefined, config.themes, "address"),
		);
	}

	if (config.body !== false) {
		result.body = useBodyElement(
			s,
			buildElementOptions(config.body || undefined, config.themes, "body"),
		);
	}

	if (config.heading !== false) {
		result.heading = useHeadingElement(
			s,
			buildElementOptions(config.heading || undefined, config.themes, "heading"),
		);
	}

	if (config.link !== false) {
		result.link = useLinkElement(
			s,
			buildElementOptions(config.link || undefined, config.themes, "link"),
		);
	}

	if (config.code !== false) {
		result.code = useCodeElement(
			s,
			buildElementOptions(config.code || undefined, config.themes, "code"),
		);
	}

	if (config.selection !== false) {
		result.selection = useSelectionState(
			s,
			buildElementOptions(config.selection || undefined, config.themes, "selection"),
		);
	}

	if (config.focus !== false) {
		result.focus = useFocusState(
			s,
			buildElementOptions(config.focus || undefined, config.themes, "focus"),
		);
	}

	if (config.hr !== false) {
		result.hr = useHrElement(s, buildElementOptions(config.hr || undefined, config.themes, "hr"));
	}

	if (config.kbd !== false) {
		result.kbd = useKbdElement(
			s,
			buildElementOptions(config.kbd || undefined, config.themes, "kbd"),
		);
	}

	if (config.mark !== false) {
		result.mark = useMarkElement(
			s,
			buildElementOptions(config.mark || undefined, config.themes, "mark"),
		);
	}

	if (config.caption !== false) {
		result.caption = useCaptionElement(
			s,
			buildElementOptions(config.caption || undefined, config.themes, "caption"),
		);
	}

	if (config.pre !== false) {
		result.pre = usePreElement(
			s,
			buildElementOptions(config.pre || undefined, config.themes, "pre"),
		);
	}

	if (config.dl !== false) {
		result.dl = useDlElement(s, buildElementOptions(config.dl || undefined, config.themes, "dl"));
	}

	if (config.dt !== false) {
		result.dt = useDtElement(s, buildElementOptions(config.dt || undefined, config.themes, "dt"));
	}

	if (config.dd !== false) {
		result.dd = useDdElement(s, buildElementOptions(config.dd || undefined, config.themes, "dd"));
	}

	if (config.abbr !== false) {
		result.abbr = useAbbrElement(
			s,
			buildElementOptions(config.abbr || undefined, config.themes, "abbr"),
		);
	}

	if (config.samp !== false) {
		result.samp = useSampElement(
			s,
			buildElementOptions(config.samp || undefined, config.themes, "samp"),
		);
	}

	if (config.ol !== false) {
		result.ol = useOlElement(s, buildElementOptions(config.ol || undefined, config.themes, "ol"));
	}

	if (config.ul !== false) {
		result.ul = useUlElement(s, buildElementOptions(config.ul || undefined, config.themes, "ul"));
	}

	if (config.paragraph !== false) {
		result.paragraph = useParagraphElement(
			s,
			buildElementOptions(config.paragraph || undefined, config.themes, "paragraph"),
		);
	}

	// ── Elements without variables ──
	if (config.img !== false) {
		useImgElement(s);
	}
	if (config.iframe !== false) {
		useIframeElement(s);
	}
	if (config.output !== false) {
		useOutputElement(s);
	}
	if (config.legend !== false) {
		useLegendElement(s);
	}
	if (config.summary !== false) {
		useSummaryElement(s);
	}

	return result;
}
