<script setup lang="ts">
import { computed } from "vue";
import { tabsTrigger } from "virtual:styleframe";
import { useTabsContext } from './context';
import type { TabsColor, TabsOrientation, TabsSize, TabsVariant } from './context';

const props = withDefaults(
	defineProps<{
		value: string;
		color?: TabsColor;
		variant?: TabsVariant;
		size?: TabsSize;
		orientation?: TabsOrientation;
		disabled?: boolean;
	}>(),
	{ disabled: false },
);

const ctx = useTabsContext();

const color = computed(() => props.color ?? ctx?.color.value ?? "neutral");
const variant = computed(() => props.variant ?? ctx?.variant.value ?? "line");
const size = computed(() => props.size ?? ctx?.size.value ?? "md");
const orientation = computed(
	() => props.orientation ?? ctx?.orientation.value ?? "horizontal",
);

const selected = computed(() => ctx?.active.value === props.value);

const classes = computed(() =>
	tabsTrigger({
		color: color.value,
		variant: variant.value,
		size: size.value,
		orientation: orientation.value,
	}),
);

function select() {
	if (props.disabled) {return;}
	ctx?.setActive(props.value);
}
</script>

<template>
	<button
		type="button"
		role="tab"
		:class="classes"
		:aria-selected="selected"
		:data-state="selected ? 'active' : 'inactive'"
		:disabled="disabled"
		@click="select"
	>
		<slot />
	</button>
</template>
