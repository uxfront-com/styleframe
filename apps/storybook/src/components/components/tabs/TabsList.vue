<script setup lang="ts">
import { computed } from "vue";
import { tabsList } from "virtual:styleframe";
import { useTabsContext } from './context';
import type { TabsColor, TabsOrientation, TabsSize, TabsVariant } from './context';

const props = defineProps<{
	color?: TabsColor;
	variant?: TabsVariant;
	size?: TabsSize;
	orientation?: TabsOrientation;
}>();

const ctx = useTabsContext();

const color = computed(() => props.color ?? ctx?.color.value ?? "neutral");
const variant = computed(() => props.variant ?? ctx?.variant.value ?? "line");
const size = computed(() => props.size ?? ctx?.size.value ?? "md");
const orientation = computed(
	() => props.orientation ?? ctx?.orientation.value ?? "horizontal",
);

const classes = computed(() =>
	tabsList({
		color: color.value,
		variant: variant.value,
		size: size.value,
		orientation: orientation.value,
	}),
);
</script>

<template>
	<div role="tablist" :aria-orientation="orientation" :class="classes">
		<slot />
	</div>
</template>
