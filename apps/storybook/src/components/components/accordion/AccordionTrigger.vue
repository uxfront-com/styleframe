<script setup lang="ts">
import { computed, inject } from "vue";
import { accordionTrigger } from "virtual:styleframe";
import { accordionItemKey, accordionKey } from "./context";

const ctx = inject(accordionKey);
const item = inject(accordionItemKey);

const open = computed(
	() => !!item && !!ctx && ctx.openValues.value.includes(item.value),
);

const classes = computed(() =>
	accordionTrigger({
		color: ctx?.color.value,
		variant: ctx?.variant.value,
		size: ctx?.size.value,
	}),
);

function onClick() {
	if (ctx && item) {ctx.toggle(item.value);}
}
</script>

<template>
	<h3 class="accordion-header">
		<button
			type="button"
			:class="classes"
			:data-state="open ? 'open' : 'closed'"
			:aria-expanded="open"
			:disabled="item?.disabled.value"
			@click="onClick"
		>
			<span><slot /></span>
			<svg
				class="accordion-trigger-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</button>
	</h3>
</template>
