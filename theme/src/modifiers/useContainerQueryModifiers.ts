import type { ModifierFactory, Styleframe } from "@styleframe/core";

import { breakpointValues } from "../values";

export interface ContainerQueryModifiers {
	containerSm: ModifierFactory;
	containerMd: ModifierFactory;
	containerLg: ModifierFactory;
	containerXl: ModifierFactory;
	container2xl: ModifierFactory;
}

export function useContainerSmModifier(s: Styleframe): ModifierFactory {
	return s.modifier("container-sm", ({ declarations, variables, children }) => ({
		[`@container (min-width: ${breakpointValues.sm}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useContainerMdModifier(s: Styleframe): ModifierFactory {
	return s.modifier("container-md", ({ declarations, variables, children }) => ({
		[`@container (min-width: ${breakpointValues.md}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useContainerLgModifier(s: Styleframe): ModifierFactory {
	return s.modifier("container-lg", ({ declarations, variables, children }) => ({
		[`@container (min-width: ${breakpointValues.lg}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useContainerXlModifier(s: Styleframe): ModifierFactory {
	return s.modifier("container-xl", ({ declarations, variables, children }) => ({
		[`@container (min-width: ${breakpointValues.xl}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

export function useContainer2xlModifier(s: Styleframe): ModifierFactory {
	return s.modifier("container-2xl", ({ declarations, variables, children }) => ({
		[`@container (min-width: ${breakpointValues["2xl"]}px)`]: {
			declarations,
			variables,
			children,
		},
	}));
}

/**
 * Register container-query modifiers for component-based responsive styling.
 *
 * Each modifier wraps declarations in an `@container (min-width: …)` block sized
 * to the shared breakpoint scale — the structural twin of the media-preference
 * modifiers, scoped to the nearest query container instead of the viewport.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { containerMd } = useContainerQueryModifiers(s);
 *
 * const createDisplay = s.utility("display", ({ value }) => ({ display: value }));
 * createDisplay({ flex: "flex" }, [containerMd]);
 * ```
 */
export function useContainerQueryModifiers(s: Styleframe): ContainerQueryModifiers {
	return {
		containerSm: useContainerSmModifier(s),
		containerMd: useContainerMdModifier(s),
		containerLg: useContainerLgModifier(s),
		containerXl: useContainerXlModifier(s),
		container2xl: useContainer2xlModifier(s),
	};
}
