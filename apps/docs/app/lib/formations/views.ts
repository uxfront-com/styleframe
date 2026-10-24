import type { FormationViews, StageView } from "@uxfront/scene";

/**
 * The hero's framing for `tokens`, on the right of UxHero's copy. Its own
 * framing puts it on the left, for a chapter whose copy is on the right.
 */
export const HERO_VIEWS = {
	desktop: { shift: [0.42, 0.02] },
} satisfies Partial<Record<keyof FormationViews, Partial<StageView>>>;
