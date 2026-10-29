import type { ModifierFactory, Styleframe } from "@styleframe/core";

export interface AriaStateModifiers {
	ariaBusy: ModifierFactory;
	ariaChecked: ModifierFactory;
	ariaDisabled: ModifierFactory;
	ariaExpanded: ModifierFactory;
	ariaHidden: ModifierFactory;
	ariaInvalid: ModifierFactory;
	ariaPressed: ModifierFactory;
	ariaReadonly: ModifierFactory;
	ariaRequired: ModifierFactory;
	ariaSelected: ModifierFactory;
}

export function useAriaBusyModifier(s: Styleframe): ModifierFactory {
	return s.modifier("aria-busy", ({ declarations, variables, children }) => ({
		'&[aria-busy="true"]': { declarations, variables, children },
	}));
}

export function useAriaCheckedModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-checked",
		({ declarations, variables, children }) => ({
			'&[aria-checked="true"]': { declarations, variables, children },
		}),
	);
}

export function useAriaDisabledModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-disabled",
		({ declarations, variables, children }) => ({
			'&[aria-disabled="true"]': { declarations, variables, children },
		}),
	);
}

export function useAriaExpandedModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-expanded",
		({ declarations, variables, children }) => ({
			'&[aria-expanded="true"]': { declarations, variables, children },
		}),
	);
}

export function useAriaHiddenModifier(s: Styleframe): ModifierFactory {
	return s.modifier("aria-hidden", ({ declarations, variables, children }) => ({
		'&[aria-hidden="true"]': { declarations, variables, children },
	}));
}

export function useAriaInvalidModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-invalid",
		({ declarations, variables, children }) => ({
			'&[aria-invalid="true"]': { declarations, variables, children },
		}),
	);
}

export function useAriaPressedModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-pressed",
		({ declarations, variables, children }) => ({
			'&[aria-pressed="true"]': { declarations, variables, children },
		}),
	);
}

export function useAriaReadonlyModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-readonly",
		({ declarations, variables, children }) => ({
			'&[aria-readonly="true"]': { declarations, variables, children },
		}),
	);
}

export function useAriaRequiredModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-required",
		({ declarations, variables, children }) => ({
			'&[aria-required="true"]': { declarations, variables, children },
		}),
	);
}

export function useAriaSelectedModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"aria-selected",
		({ declarations, variables, children }) => ({
			'&[aria-selected="true"]': { declarations, variables, children },
		}),
	);
}

/**
 * Register ARIA state modifiers for targeting elements by ARIA attributes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { ariaExpanded, ariaDisabled } = useAriaStateModifiers(s);
 *
 * const createOpacity = utility("opacity", ({ value }) => ({ opacity: value }));
 * createOpacity({ 50: "0.5" }, [ariaDisabled]);
 * ```
 */
export function useAriaStateModifiers(s: Styleframe): AriaStateModifiers {
	return {
		ariaBusy: useAriaBusyModifier(s),
		ariaChecked: useAriaCheckedModifier(s),
		ariaDisabled: useAriaDisabledModifier(s),
		ariaExpanded: useAriaExpandedModifier(s),
		ariaHidden: useAriaHiddenModifier(s),
		ariaInvalid: useAriaInvalidModifier(s),
		ariaPressed: useAriaPressedModifier(s),
		ariaReadonly: useAriaReadonlyModifier(s),
		ariaRequired: useAriaRequiredModifier(s),
		ariaSelected: useAriaSelectedModifier(s),
	};
}
