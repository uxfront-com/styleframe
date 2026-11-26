import type { ModifierFactory, Styleframe } from "@styleframe/core";

export interface PseudoStateModifiers {
	hover: ModifierFactory;
	focus: ModifierFactory;
	focusWithin: ModifierFactory;
	focusVisible: ModifierFactory;
	active: ModifierFactory;
	visited: ModifierFactory;
	target: ModifierFactory;
}

export function useHoverModifier(s: Styleframe): ModifierFactory {
	return s.modifier("hover", ({ declarations, variables, children }) => ({
		"&:hover": { declarations, variables, children },
	}));
}

export function useFocusModifier(s: Styleframe): ModifierFactory {
	return s.modifier("focus", ({ declarations, variables, children }) => ({
		"&:focus": { declarations, variables, children },
	}));
}

export function useFocusWithinModifier(s: Styleframe): ModifierFactory {
	return s.modifier("focus-within", ({ declarations, variables, children }) => ({
		"&:focus-within": { declarations, variables, children },
	}));
}

export function useFocusVisibleModifier(s: Styleframe): ModifierFactory {
	return s.modifier("focus-visible", ({ declarations, variables, children }) => ({
		"&:focus-visible": { declarations, variables, children },
	}));
}

export function useActiveModifier(s: Styleframe): ModifierFactory {
	return s.modifier("active", ({ declarations, variables, children }) => ({
		"&:active, &:focus:active": { declarations, variables, children },
	}));
}

export function useVisitedModifier(s: Styleframe): ModifierFactory {
	return s.modifier("visited", ({ declarations, variables, children }) => ({
		"&:visited": { declarations, variables, children },
	}));
}

export function useTargetModifier(s: Styleframe): ModifierFactory {
	return s.modifier("target", ({ declarations, variables, children }) => ({
		"&:target": { declarations, variables, children },
	}));
}

/**
 * Register pseudo-class state modifiers for interactive states.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { hover, focus } = usePseudoStateModifiers(s);
 *
 * const createBg = utility("background", ({ value }) => ({ background: value }));
 * createBg({ primary: ref(colorPrimary) }, [hover, focus]);
 * ```
 */
export function usePseudoStateModifiers(s: Styleframe): PseudoStateModifiers {
	return {
		hover: useHoverModifier(s),
		focus: useFocusModifier(s),
		focusWithin: useFocusWithinModifier(s),
		focusVisible: useFocusVisibleModifier(s),
		active: useActiveModifier(s),
		visited: useVisitedModifier(s),
		target: useTargetModifier(s),
	};
}
