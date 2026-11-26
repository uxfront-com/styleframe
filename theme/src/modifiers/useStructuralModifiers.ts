import type { ModifierFactory, Styleframe } from "@styleframe/core";

export interface StructuralModifiers {
	first: ModifierFactory;
	last: ModifierFactory;
	only: ModifierFactory;
	odd: ModifierFactory;
	even: ModifierFactory;
	firstOfType: ModifierFactory;
	lastOfType: ModifierFactory;
	onlyOfType: ModifierFactory;
	empty: ModifierFactory;
}

export function useFirstModifier(s: Styleframe): ModifierFactory {
	return s.modifier("first", ({ declarations, variables, children }) => ({
		"&:first-child": { declarations, variables, children },
	}));
}

export function useLastModifier(s: Styleframe): ModifierFactory {
	return s.modifier("last", ({ declarations, variables, children }) => ({
		"&:last-child": { declarations, variables, children },
	}));
}

export function useOnlyModifier(s: Styleframe): ModifierFactory {
	return s.modifier("only", ({ declarations, variables, children }) => ({
		"&:only-child": { declarations, variables, children },
	}));
}

export function useOddModifier(s: Styleframe): ModifierFactory {
	return s.modifier("odd", ({ declarations, variables, children }) => ({
		"&:nth-child(odd)": { declarations, variables, children },
	}));
}

export function useEvenModifier(s: Styleframe): ModifierFactory {
	return s.modifier("even", ({ declarations, variables, children }) => ({
		"&:nth-child(even)": { declarations, variables, children },
	}));
}

export function useFirstOfTypeModifier(s: Styleframe): ModifierFactory {
	return s.modifier("first-of-type", ({ declarations, variables, children }) => ({
		"&:first-of-type": { declarations, variables, children },
	}));
}

export function useLastOfTypeModifier(s: Styleframe): ModifierFactory {
	return s.modifier("last-of-type", ({ declarations, variables, children }) => ({
		"&:last-of-type": { declarations, variables, children },
	}));
}

export function useOnlyOfTypeModifier(s: Styleframe): ModifierFactory {
	return s.modifier("only-of-type", ({ declarations, variables, children }) => ({
		"&:only-of-type": { declarations, variables, children },
	}));
}

export function useEmptyModifier(s: Styleframe): ModifierFactory {
	return s.modifier("empty", ({ declarations, variables, children }) => ({
		"&:empty": { declarations, variables, children },
	}));
}

/**
 * Register structural pseudo-class modifiers for targeting elements by position.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { first, last, odd, even } = useStructuralModifiers(s);
 *
 * const createBorderWidth = utility("border-width", ({ value }) => ({ borderWidth: value }));
 * createBorderWidth({ 0: "0" }, [first, last]);
 * ```
 */
export function useStructuralModifiers(s: Styleframe): StructuralModifiers {
	return {
		first: useFirstModifier(s),
		last: useLastModifier(s),
		only: useOnlyModifier(s),
		odd: useOddModifier(s),
		even: useEvenModifier(s),
		firstOfType: useFirstOfTypeModifier(s),
		lastOfType: useLastOfTypeModifier(s),
		onlyOfType: useOnlyOfTypeModifier(s),
		empty: useEmptyModifier(s),
	};
}
