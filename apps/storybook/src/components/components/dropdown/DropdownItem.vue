<script setup lang="ts">
import { computed } from "vue";
import { dropdownItem } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		size?: "sm" | "md" | "lg";
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	},
);

const classes = computed(() =>
	dropdownItem({
		color: props.color,
		variant: props.variant,
		size: props.size,
	}),
);
</script>

<template>
	<button type="button" role="menuitem" :class="classes" :disabled="props.disabled">
		<slot />
	</button>
</template>
