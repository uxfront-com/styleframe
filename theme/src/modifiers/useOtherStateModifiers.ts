import type { ModifierFactory, Styleframe } from "@styleframe/core";

export interface OtherStateModifiers {
	open: ModifierFactory;
	inert: ModifierFactory;
	dataLoading: ModifierFactory;
}

export function useOpenModifier(s: Styleframe): ModifierFactory {
	return s.modifier("open", ({ declarations, variables, children }) => ({
		"&:is([open], :popover-open)": { declarations, variables, children },
	}));
}

export function useInertModifier(s: Styleframe): ModifierFactory {
	return s.modifier("inert", ({ declarations, variables, children }) => ({
		"&:is([inert], [inert] *)": { declarations, variables, children },
	}));
}

export function useDataLoadingModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"data-loading",
		({ declarations, variables, children }) => ({
			"&[data-loading]": { declarations, variables, children },
		}),
	);
}

/**
 * Register other state modifiers for open, inert and loading element states.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { open } = useOtherStateModifiers(s);
 *
 * const createDisplay = utility("display", ({ value }) => ({ display: value }));
 * createDisplay({ block: "block" }, [open]);
 * ```
 */
export function useOtherStateModifiers(s: Styleframe): OtherStateModifiers {
	return {
		open: useOpenModifier(s),
		inert: useInertModifier(s),
		dataLoading: useDataLoadingModifier(s),
	};
}
