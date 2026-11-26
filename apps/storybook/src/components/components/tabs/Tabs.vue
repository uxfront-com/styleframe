<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { tabs } from "virtual:styleframe";
import { tabsInjectionKey } from './context';
import type { TabsColor, TabsOrientation, TabsSize, TabsVariant } from './context';

const props = withDefaults(
	defineProps<{
		modelValue?: string;
		color?: TabsColor;
		variant?: TabsVariant;
		size?: TabsSize;
		orientation?: TabsOrientation;
	}>(),
	{
		modelValue: "",
		color: "neutral",
		variant: "line",
		size: "md",
		orientation: "horizontal",
	},
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const active = ref(props.modelValue);

watch(
	() => props.modelValue,
	(value) => {
		active.value = value;
	},
);

function setActive(value: string) {
	active.value = value;
	emit("update:modelValue", value);
}

provide(tabsInjectionKey, {
	active,
	setActive,
	color: computed(() => props.color),
	variant: computed(() => props.variant),
	size: computed(() => props.size),
	orientation: computed(() => props.orientation),
});

const classes = computed(() =>
	tabs({ orientation: props.orientation, size: props.size }),
);
</script>

<template>
	<div :class="classes">
		<slot />
	</div>
</template>
