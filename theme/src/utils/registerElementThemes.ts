import type { DeclarationsCallbackContext, Styleframe } from "@styleframe/core";

/**
 * Registers theme overrides for an element by calling its design tokens
 * function within each theme block.
 */
export function registerElementThemes<T>(
	s: Styleframe,
	themes: Record<string, T> | undefined,
	applyDesignTokens: (ctx: DeclarationsCallbackContext, config: T) => void,
): void {
	if (!themes) {
		return;
	}
	for (const [themeName, overrides] of Object.entries(themes)) {
		s.theme(themeName, (ctx) => {
			applyDesignTokens(ctx, overrides);
		});
	}
}
