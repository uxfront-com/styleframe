import { inject } from "vue";
import type { InjectionKey, ComputedRef, Ref } from "vue";

export type TabsColor = "light" | "dark" | "neutral";
export type TabsVariant = "line" | "pill" | "soft";
export type TabsSize = "sm" | "md" | "lg";
export type TabsOrientation = "horizontal" | "vertical";

export interface TabsContext {
	active: Ref<string>;
	setActive: (value: string) => void;
	color: ComputedRef<TabsColor>;
	variant: ComputedRef<TabsVariant>;
	size: ComputedRef<TabsSize>;
	orientation: ComputedRef<TabsOrientation>;
}

export const tabsInjectionKey: InjectionKey<TabsContext> = Symbol("tabs");

export function useTabsContext(): TabsContext | null {
	return inject(tabsInjectionKey, null);
}
