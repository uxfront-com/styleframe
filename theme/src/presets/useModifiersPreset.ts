import type { Styleframe } from "@styleframe/core";

import {
	type AriaStateModifiers,
	type ContainerQueryModifiers,
	type DirectionalModifiers,
	type FormStateModifiers,
	type MediaPreferenceModifiers,
	type OtherStateModifiers,
	type PseudoElementModifiers,
	type PseudoStateModifiers,
	type ResponsiveModifiers,
	type StructuralModifiers,
	useAriaStateModifiers,
	useContainerQueryModifiers,
	useDirectionalModifiers,
	useFormStateModifiers,
	useMediaPreferenceModifiers,
	useOtherStateModifiers,
	usePseudoElementModifiers,
	usePseudoStateModifiers,
	useResponsiveModifiers,
	useStructuralModifiers,
} from "../modifiers";

/**
 * Configuration for which modifier categories to register.
 *
 * - Omit or set to `undefined` to enable the category (default)
 * - Set to `false` to disable a specific category
 */
export interface ModifiersConfig {
	/** Pseudo-class state modifiers (hover, focus, active, etc.) */
	pseudoStates?: boolean;
	/** Form state modifiers (disabled, checked, valid, etc.) */
	formStates?: boolean;
	/** Structural pseudo-class modifiers (first, last, odd, even, etc.) */
	structural?: boolean;
	/** Pseudo-element modifiers (before, after, placeholder, etc.) */
	pseudoElements?: boolean;
	/** Media/preference query modifiers (dark, motion-safe, print, etc.) */
	mediaPreferences?: boolean;
	/** Container-query modifiers (container-sm, container-md, etc.) */
	containerQueries?: boolean;
	/** Responsive breakpoint modifiers (sm, md, lg, xl, 2xl) */
	responsive?: boolean;
	/** ARIA state modifiers (aria-expanded, aria-disabled, etc.) */
	ariaStates?: boolean;
	/** Directional modifiers (rtl, ltr) */
	directional?: boolean;
	/** Other state modifiers (open, inert, data-loading) */
	otherStates?: boolean;
}

/**
 * Resolved modifier instances returned by the preset.
 * All individual modifiers are spread into a flat object.
 */
export type ModifierInstances = Partial<
	PseudoStateModifiers &
		FormStateModifiers &
		StructuralModifiers &
		PseudoElementModifiers &
		MediaPreferenceModifiers &
		ContainerQueryModifiers &
		ResponsiveModifiers &
		AriaStateModifiers &
		DirectionalModifiers &
		OtherStateModifiers
>;

/**
 * Registers all modifier composables based on the provided configuration.
 *
 * Each modifier category can be individually enabled (default) or disabled
 * by setting its config key to `false`.
 *
 * @param s - The Styleframe instance to register modifiers with
 * @param config - Configuration for which modifier categories to register
 * @returns A flat object containing all registered modifier instances
 */
export function useModifiersPreset(
	s: Styleframe,
	config: ModifiersConfig = {},
): ModifierInstances {
	return {
		...(config.pseudoStates !== false ? usePseudoStateModifiers(s) : undefined),
		...(config.formStates !== false ? useFormStateModifiers(s) : undefined),
		...(config.structural !== false ? useStructuralModifiers(s) : undefined),
		...(config.pseudoElements !== false
			? usePseudoElementModifiers(s)
			: undefined),
		...(config.mediaPreferences !== false
			? useMediaPreferenceModifiers(s)
			: undefined),
		...(config.containerQueries !== false
			? useContainerQueryModifiers(s)
			: undefined),
		...(config.responsive !== false ? useResponsiveModifiers(s) : undefined),
		...(config.ariaStates !== false ? useAriaStateModifiers(s) : undefined),
		...(config.directional !== false ? useDirectionalModifiers(s) : undefined),
		...(config.otherStates !== false ? useOtherStateModifiers(s) : undefined),
	};
}
