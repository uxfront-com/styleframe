import type { ModifierFactory, Styleframe } from "@styleframe/core";

export interface MediaPreferenceModifiers {
	dark: ModifierFactory;
	motionSafe: ModifierFactory;
	motionReduce: ModifierFactory;
	contrastMore: ModifierFactory;
	contrastLess: ModifierFactory;
	portrait: ModifierFactory;
	landscape: ModifierFactory;
	print: ModifierFactory;
	forcedColors: ModifierFactory;
	hoverCapable: ModifierFactory;
	anyPointerCoarse: ModifierFactory;
}

export function useDarkModifier(s: Styleframe): ModifierFactory {
	return s.modifier("dark", ({ declarations, variables, children }) => ({
		':is(.dark-theme, [data-theme="dark"]) &': {
			declarations,
			variables,
			children,
		},
	}));
}

export function useMotionSafeModifier(s: Styleframe): ModifierFactory {
	return s.modifier("motion-safe", ({ declarations, variables, children }) => ({
		"@media (prefers-reduced-motion: no-preference)": {
			declarations,
			variables,
			children,
		},
	}));
}

export function useMotionReduceModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"motion-reduce",
		({ declarations, variables, children }) => ({
			"@media (prefers-reduced-motion: reduce)": {
				declarations,
				variables,
				children,
			},
		}),
	);
}

export function useContrastMoreModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"contrast-more",
		({ declarations, variables, children }) => ({
			"@media (prefers-contrast: more)": { declarations, variables, children },
		}),
	);
}

export function useContrastLessModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"contrast-less",
		({ declarations, variables, children }) => ({
			"@media (prefers-contrast: less)": { declarations, variables, children },
		}),
	);
}

export function usePortraitModifier(s: Styleframe): ModifierFactory {
	return s.modifier("portrait", ({ declarations, variables, children }) => ({
		"@media (orientation: portrait)": { declarations, variables, children },
	}));
}

export function useLandscapeModifier(s: Styleframe): ModifierFactory {
	return s.modifier("landscape", ({ declarations, variables, children }) => ({
		"@media (orientation: landscape)": { declarations, variables, children },
	}));
}

export function usePrintModifier(s: Styleframe): ModifierFactory {
	return s.modifier("print", ({ declarations, variables, children }) => ({
		"@media print": { declarations, variables, children },
	}));
}

export function useForcedColorsModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"forced-colors",
		({ declarations, variables, children }) => ({
			"@media (forced-colors: active)": { declarations, variables, children },
		}),
	);
}

export function useHoverCapableModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"hover-capable",
		({ declarations, variables, children }) => ({
			"@media (hover: hover)": { declarations, variables, children },
		}),
	);
}

export function useAnyPointerCoarseModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"any-pointer-coarse",
		({ declarations, variables, children }) => ({
			"@media (any-pointer: coarse)": { declarations, variables, children },
		}),
	);
}

/**
 * Register media/preference query modifiers for adaptive styling.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { dark, motionReduce } = useMediaPreferenceModifiers(s);
 *
 * const createBg = utility("background", ({ value }) => ({ background: value }));
 * createBg({ primary: ref(colorPrimary) }, [dark]);
 * ```
 */
export function useMediaPreferenceModifiers(
	s: Styleframe,
): MediaPreferenceModifiers {
	return {
		dark: useDarkModifier(s),
		motionSafe: useMotionSafeModifier(s),
		motionReduce: useMotionReduceModifier(s),
		contrastMore: useContrastMoreModifier(s),
		contrastLess: useContrastLessModifier(s),
		portrait: usePortraitModifier(s),
		landscape: useLandscapeModifier(s),
		print: usePrintModifier(s),
		forcedColors: useForcedColorsModifier(s),
		hoverCapable: useHoverCapableModifier(s),
		anyPointerCoarse: useAnyPointerCoarseModifier(s),
	};
}
