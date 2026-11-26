import type { ComputedRef, InjectionKey, Ref } from "vue";

export type AccordionColor = "light" | "dark" | "neutral";
export type AccordionVariant = "solid" | "ghost";
export type AccordionSize = "sm" | "md" | "lg";

export interface AccordionContext {
	openValues: Ref<Array<string>>;
	toggle: (value: string) => void;
	color: ComputedRef<AccordionColor | undefined>;
	variant: ComputedRef<AccordionVariant | undefined>;
	size: ComputedRef<AccordionSize | undefined>;
}

export interface AccordionItemContext {
	value: string;
	disabled: ComputedRef<boolean>;
}

export const accordionKey: InjectionKey<AccordionContext> = Symbol("accordion");
export const accordionItemKey: InjectionKey<AccordionItemContext> =
	Symbol("accordion-item");
