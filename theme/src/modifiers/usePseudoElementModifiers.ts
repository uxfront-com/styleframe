import type { ModifierFactory, Styleframe } from "@styleframe/core";

export interface PseudoElementModifiers {
	before: ModifierFactory;
	after: ModifierFactory;
	placeholder: ModifierFactory;
	selection: ModifierFactory;
	firstLetter: ModifierFactory;
	firstLine: ModifierFactory;
	marker: ModifierFactory;
	backdrop: ModifierFactory;
	file: ModifierFactory;
}

export function useBeforeModifier(s: Styleframe): ModifierFactory {
	return s.modifier("before", ({ declarations, variables, children }) => ({
		"&::before": {
			declarations: { content: "''", ...declarations },
			variables,
			children,
		},
	}));
}

export function useAfterModifier(s: Styleframe): ModifierFactory {
	return s.modifier("after", ({ declarations, variables, children }) => ({
		"&::after": {
			declarations: { content: "''", ...declarations },
			variables,
			children,
		},
	}));
}

export function usePlaceholderModifier(s: Styleframe): ModifierFactory {
	return s.modifier("placeholder", ({ declarations, variables, children }) => ({
		"&::placeholder": { declarations, variables, children },
	}));
}

export function useSelectionModifier(s: Styleframe): ModifierFactory {
	return s.modifier("selection", ({ declarations, variables, children }) => ({
		"&::selection": { declarations, variables, children },
	}));
}

export function useFirstLetterModifier(s: Styleframe): ModifierFactory {
	return s.modifier("first-letter", ({ declarations, variables, children }) => ({
		"&::first-letter": { declarations, variables, children },
	}));
}

export function useFirstLineModifier(s: Styleframe): ModifierFactory {
	return s.modifier("first-line", ({ declarations, variables, children }) => ({
		"&::first-line": { declarations, variables, children },
	}));
}

export function useMarkerModifier(s: Styleframe): ModifierFactory {
	return s.modifier("marker", ({ declarations, variables, children }) => ({
		"&::marker": { declarations, variables, children },
	}));
}

export function useBackdropModifier(s: Styleframe): ModifierFactory {
	return s.modifier("backdrop", ({ declarations, variables, children }) => ({
		"&::backdrop": { declarations, variables, children },
	}));
}

export function useFileModifier(s: Styleframe): ModifierFactory {
	return s.modifier("file", ({ declarations, variables, children }) => ({
		"&::file-selector-button": { declarations, variables, children },
	}));
}

/**
 * Register pseudo-element modifiers for targeting element sub-parts.
 *
 * The `before` and `after` modifiers automatically inject `content: ''`
 * to ensure the pseudo-element is rendered.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { before, placeholder } = usePseudoElementModifiers(s);
 *
 * const createColor = utility("color", ({ value }) => ({ color: value }));
 * createColor({ muted: "#999" }, [placeholder]);
 * ```
 */
export function usePseudoElementModifiers(s: Styleframe): PseudoElementModifiers {
	return {
		before: useBeforeModifier(s),
		after: useAfterModifier(s),
		placeholder: usePlaceholderModifier(s),
		selection: useSelectionModifier(s),
		firstLetter: useFirstLetterModifier(s),
		firstLine: useFirstLineModifier(s),
		marker: useMarkerModifier(s),
		backdrop: useBackdropModifier(s),
		file: useFileModifier(s),
	};
}
