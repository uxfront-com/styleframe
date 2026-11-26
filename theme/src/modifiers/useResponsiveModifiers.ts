import type { ModifierFactory, Styleframe } from "@styleframe/core";

import { breakpointValues } from "../values";

export interface ResponsiveModifiers {
	sm: ModifierFactory;
	md: ModifierFactory;
	lg: ModifierFactory;
	xl: ModifierFactory;
	"2xl": ModifierFactory;
}

export function useResponsiveSmModifier(s: Styleframe): ModifierFactory {
	return s.modifier("sm", ({ declarations, variables, children }) => ({
		[`@media (min-width: ${breakpointValues.sm}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useResponsiveMdModifier(s: Styleframe): ModifierFactory {
	return s.modifier("md", ({ declarations, variables, children }) => ({
		[`@media (min-width: ${breakpointValues.md}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useResponsiveLgModifier(s: Styleframe): ModifierFactory {
	return s.modifier("lg", ({ declarations, variables, children }) => ({
		[`@media (min-width: ${breakpointValues.lg}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useResponsiveXlModifier(s: Styleframe): ModifierFactory {
	return s.modifier("xl", ({ declarations, variables, children }) => ({
		[`@media (min-width: ${breakpointValues.xl}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useResponsive2xlModifier(s: Styleframe): ModifierFactory {
	return s.modifier("2xl", ({ declarations, variables, children }) => ({
		[`@media (min-width: ${breakpointValues["2xl"]}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

/**
 * Register responsive breakpoint modifiers for viewport-based responsive styling.
 *
 * Each modifier wraps declarations in a mobile-first `@media (min-width: …)`
 * block sized to the shared breakpoint scale — the viewport-scoped twin of the
 * container-query modifiers, named to mirror the familiar `sm`/`md`/`lg`/`xl`/
 * `2xl` vocabulary so a `_md:padding:xl` prefix resolves to a real media query
 * out of the box.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { md } = useResponsiveModifiers(s);
 *
 * const createDisplay = s.utility("display", ({ value }) => ({ display: value }));
 * createDisplay({ flex: "flex" }, [md]);
 * ```
 */
export function useResponsiveModifiers(s: Styleframe): ResponsiveModifiers {
	return {
		sm: useResponsiveSmModifier(s),
		md: useResponsiveMdModifier(s),
		lg: useResponsiveLgModifier(s),
		xl: useResponsiveXlModifier(s),
		"2xl": useResponsive2xlModifier(s),
	};
}
